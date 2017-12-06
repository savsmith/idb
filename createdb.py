from BetterReads import db, books, author, series, reviews
from xml.parsers.expat import ExpatError
import xmltodict
from collections import OrderedDict
import requests #Watch out for symbolic linking
import sys
from pprint import pprint
from sqlalchemy.exc import IntegrityError
import re
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from GetReviews import reviews

class InvalidEntry(Exception):
    pass

API_KEY = {
    'GOODREADS' : 'XPADtthE0OKv71uiqSwa8g',
    'GOOGLE' : 'AIzaSyBZ9fgBDM51R-dC00kPeCa7m7SjOsZm_Vg',
    'NYTIMES' : '1bfa24a95061415dbc8d4a4f136329a5'
}



def createdb():
    db.create_all()

def populatedb():
    insertGRBooks(1, 10)

def cleardb():
    meta = db.metadata
    for table in reversed(meta.sorted_tables):

        print ('Clear table %s' % table)

        db.session.execute(table.delete())

    db.session.commit()
    
def getNyTimesBooks():
    """
    Adds books and their corresponding authors and series featured on NYTIMES lists to the database
    """
    lists = [lst['list_name_encoded'] for lst in requests.get('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=1bfa24a95061415dbc8d4a4f136329a5').json()['results']]
    global printout
    for l in lists[:1]:
        results = requests.get('https://api.nytimes.com/svc/books/v3/lists.json?list='+l+'&api-key=1bfa24a95061415dbc8d4a4f136329a5').json()
        for r in results['results']:
            isbn = r['book_details'][0]['primary_isbn13']
            list = r['list_name']
            try:
                GRBook_req = requests.get('https://www.goodreads.com/book/isbn_to_id/'+isbn+'?key='+API_KEY['GOODREADS'])
                if(GRBook_req.status_code == 200):
                    getGRBookByID(int(GRBook_req.text), list)
            except ExpatError as e:
                print(e)

def getGRBookByWorkID(id):
    return User.query.filter_by(work_id=id).first()


def getGRBookByID(id, list=None, prefix=""):
    book_entry = db.session.query(books).get(id)
    global printout
    if book_entry is None:
        if(printout):
            print(prefix+"lookup book "+str(id))
        request = requests.get('https://www.goodreads.com/book/show/'+str(id)+'.xml?key='+API_KEY['GOODREADS'])
        if request.status_code == 200:
            try:
                data = xmltodict.parse(request.text)['GoodreadsResponse']['book']
            except ExpatError:
                print(prefix+"book invalid due to ExpatError"+str(id))
                return None
            
            book = {}
            book['id'] = int(data['id'])
            book['title'] = data['title']

            if(printout):
                print(prefix+"|- book title: "+book['title'])

            book['description'] = re.sub("<.*?>", "",data['description']) if data['description'] is not None else None
            book['small_img'] = data['small_image_url']
            book['large_img'] = data['image_url']
            book['published_date'] = (data['publication_month'] if data['publication_month'] is not None else "unknown_month"
                                     +"-"+
                                     data['publication_day'] if data['publication_day'] is not None else "unknown_day"
                                     +"-"+
                                     data['publication_year'] if data['publication_year'] is not None else "unknown_year")
            book['published_day'] = data['publication_day']
            book['published_month'] = data['publication_month']
            book['published_year'] = data['publication_year']
            book['rating'] = data['average_rating']
            book['work_id'] = int(data['work']['id']['#text'])
            pages = data['num_pages']
            book['num_pages'] = int(pages) if pages is not None else None
            book['link'] = data['buy_links']['buy_link']
            if book['link'] is not None and len(book['link']) > 0:
                book['link'] = book['link'][0]['link']
            else:
                book['link'] = None
            isbn = data['isbn']

            if "nophoto" in book['large_img']:
                book['large_img'] = None
                
            if list is not None:
                book['list'] = list

            work_id = data['work']['id']['#text']    
                
            # Look up the book's author
            book_search = requests.get('https://www.goodreads.com/search/index.xml?key='+API_KEY['GOODREADS']+'&q='+str(isbn))
            book_search = xmltodict.parse(book_search.text)
            if book_search['GoodreadsResponse']['search']['results'] is None:
                return None
            work = book_search['GoodreadsResponse']['search']['results']['work']
            match = True
            if isinstance(work, type([])):
                match = False
                for w in work:
                    if int(w['best_book']['author']['id']['#text']) == id:
                        work = w
                        match = True
            if match:
                author_id = int(work['best_book']['author']['id']['#text'])

                #TODO: Double Check Author doesn't already contain a book with the same work id
                book['author'] = getGRAuthorByID(author_id, book_callee=id, prefix=prefix+"\t")
                try:
                    if book['author'] is not None and book['work_id'] in [author_book.work_id for author_book in book['author'].books]:
                        print(prefix+str(book['author'])+" already contains: ")
                        for b in book['author'].books:
                            print(prefix+"\t"+str(b))
                        print(prefix+"failed to add "+str(book['title']))
                        return None
                except TypeError:
                    pass
            else:
                book['author'] = None
                
            nullables = ['published_date', 'published_day', 'published_month', 'published_year']
            if(all([key in nullables or item is not None for (key, item) in book.items()]) and id not in db.session.query(books.id).all()):
                book_entry = books(**book)
                db.session.add(book_entry)
                db.session.commit()
            else:
                print(prefix+"book invalid "+str(id))
                return None
            
            

            
            # Look up the book's series 
            series_request = requests.get('https://www.goodreads.com/work/'+work_id+'/series?format=xml&key='+API_KEY['GOODREADS'])
            series_request = xmltodict.parse(series_request.text)
            try:
                series_work = series_request['GoodreadsResponse']['series_works']['series_work']
                if type(series_work) == type([]):
                    series_work = series_work[0]
                series_id = series_work['series']['id']
            except TypeError as e:
                if series_request['GoodreadsResponse']['series_works'] is not None:
                    print("Error 01 in getGRBookById: "+str(e))
            else:
                #TODO: Double Check Author doesn't already contain a book with the same work id
                series = getGRSeriesByID(int(series_id), prefix=prefix+"\t")
                if series is not None and series.books is not None and book['work_id'] in [book.work_id for book in series.books]:
                    print(prefix+"Series "+str(series.series_name)+" already contains: ")
                    for series_book in series.books:
                        print(prefix+"\t"+str(series_book.title))
                    print(prefix+"failed to add "+str(book['title']))
                    print(prefix+"book invalid "+str(id))
                else:
                    db.session.query(books).get(id).series = series
                    db.session.commit()
            
            if(printout):
                print(prefix+book['title']+" added "+str(book_entry))
                #print(prefix+str(book_entry)+" added")
        
    return book_entry
    
def getGRAuthorByID(id, book_callee=None, series_callee=None, prefix=""):
    """
    Returns author in the database, if author is not found in the database it creates a new one using goodreads api
    """    
    author_entry = db.session.query(author).get(id)
    global printout
    if author_entry is None:
        if printout:
            print(prefix+"lookup author "+str(id))
        request = requests.get('https://www.goodreads.com/author/show/'+str(id)+'.xml?key='+API_KEY['GOODREADS'])
        if request.status_code == 200:
            data = xmltodict.parse(request.text)['GoodreadsResponse']['author']
            
            auth = {}
            auth['id'] = int(data['id'])
            auth['author'] = data['name'] 
            if(printout):
                print(prefix+"|- author: "+auth['author'])
            auth['description'] = re.sub("<.*?>", "", data['about']) if data['about'] is not None else None
            auth['hometown'] = data['hometown']
            auth['small_img'] = data['small_image_url']
            auth['large_img'] = data['image_url']  
            auth['gender'] = data['gender']
            auth['fan_count'] = int(data['fans_count']['#text'])


            
            nullables = ['gender']
            if(all([key in nullables or item is not None for (key, item) in auth.items()]) and id not in db.session.query(author.id).all()):
                author_entry = author(**auth)
                db.session.add(author_entry)
                db.session.commit()
            else:
                print(prefix+"author invalid "+str(id))
                return None
                
            works = data['books']['book']
            for book in works:
                while type(book) is list:
                    book = book[0]
                if type(book) is OrderedDict and (book_callee is None or book_callee != int(book['id']['#text'])):
                    a_book = getGRBookByID(int(book['id']['#text']), id, prefix=prefix+"\t")
                    if a_book is not None:
                        db.session.query(author).get(id).books.append(a_book)
                        db.session.commit()
            

            if(printout):
                print(prefix+auth['author']+" added")
                #print(author_entry)
            
    return author_entry        
        
def getGRSeriesByID(id, prefix=""):
    global printout
    series_entry = db.session.query(series).get(id)
    if series_entry is None:
        if printout:
            print(prefix+"lookup series "+str(id))
        request = requests.get('https://www.goodreads.com/series/'+str(id)+'.xml?key='+API_KEY['GOODREADS'])
        if request.status_code == 200:
            data = xmltodict.parse(request.text)['GoodreadsResponse']['series']
            ser = {}
            ser['id'] = int(data['id'])
            ser['series_name'] = data['title']
            if(printout):
                print(prefix+"|- series: "+ser['series_name'])
            ser['count'] = int(data['series_works_count'])
            ser['description'] = re.sub("<.*?>", "", data['description']) if data['description'] is not None else None
            ser['primary_count'] = data['primary_work_count']
            ser['numbered'] = data['numbered']
            
            
            nullables = []
            if(all([key in nullables or item is not None for (key, item) in ser.items()]) and id not in db.session.query(series.id).all()):
                series_entry = series(**ser)
                db.session.add(series_entry)
                db.session.commit()
            else:
                print(prefix+"series invalid "+str(id))
                return None
            
            works = data['series_works']['series_work']
            for book in works:
                while isinstance(book, type([])):
                    book = book[0]
                if type(book)is OrderedDict:
                    s_books = db.session.query(series).get(id).books
                    s_authors = db.session.query(series).get(id).authors
                    book_id = int(book['work']['best_book']['id'])
                    author_id = int(book['work']['best_book']['author']['id'])
                    if book_id not in db.session.query(books.id):
                        s_b = getGRBookByID(book_id, prefix=prefix+"\t")
                        if s_b is not None:
                            s_books.append(s_b)
                            db.session.commit()
                    if author_id not in db.session.query(author.id):
                        s_a = getGRAuthorByID(author_id, prefix=prefix+"\t")
                        if s_a is not None:
                            s_authors.append(s_a)
                            db.session.commit()
            
            
            if(printout):
                print(prefix+"Series "+str(id)+": "+ser['series_name']+" added")
                #print(series_entry)
            
    return series_entry
    
def getGRReviewByID(id, prefix=""):
    """
    Returns review in the database, if review is not found in the database it creates a new one using goodreads api
    """   
    review_entry = db.session.query(reviews).get(id)
    global printout
    if review_entry is None:
        if printout:
            print(prefix+"lookup review "+str(id))
        request = requests.get('https://www.goodreads.com/review/show.xml?id='+ str(id) +'&key='+API_KEY['GOODREADS'])
        if request.status_code == 200:
            data = xmltodict.parse(request.text)['GoodreadsResponse']['review']
            
            review = {}
            review['id'] = int(data['id'])
            review['user'] = data['user']['display_name']
            review['rating'] = int(data['rating'])
            review['book'] = getGRBookByID(int(data['book']['id']['#text']), prefix="\t")
            review['review'] = data['body']
            review['spoiler_flag'] = data['spoiler_flag']
            review['date_added'] = data['date_added']
            review['votes'] = int(data['votes'])

            nullables = ['review']
            if(all([key in nullables or item is not None for (key, item) in review.items()])):
                review_entry = reviews(**review)
                db.session.add(review_entry)
                db.session.commit()
            else:
                print(prefix+"review invalid "+str(id))
                return None
            
            if(printout):
                print(prefix+"review "+str(id)+" added")
                #print(review_entry)
    
    return review_entry

def insertGRReviews(start, step):
    i = start
    while i < (start + step):
        try:
            getGRReviewByID(i)
        except Exception as e:
            print("3"+str(e))
        i += 1
    
def insertGRBooks(start, step):
    i = start
    while i < (start + step):
        try:
            getGRBookByID(i)
        except Exception as e:
            print(e)
        i += 1
        
def insertGRAuthors(start, step):
    i = start
    while i < (start + step):
        getGRAuthorByID(i)
        i += 1
        
def insertGRSeries(start, step):
    i = start
    while i < (start + step):
        getGRSeriesByID(i)
        i += 1
        
def getReviewsForBooks():
    book_ids = [b.id for b in db.session.query(books).all()]
    print("Getting Reviews for Books")
    for id in range(2**32):
        print(id)
        if db.session.query(reviews).get(id) is None:
            request = requests.get('https://www.goodreads.com/review/show.xml?id='+ str(id) +'&key='+API_KEY['GOODREADS'])
            if request.status_code == 200:
                data = xmltodict.parse(request.text)['GoodreadsResponse']['review']
                if int(data['book']['id']['#text']) in book_ids:
                    review = {}
                    review['id'] = int(data['id'])
                    review['user'] = data['user']['display_name']
                    review['rating'] = int(data['rating'])
                    review['book'] = db.session.query(books).get(int(data['book']['id']['#text']))
                    review['review'] = data['body']
                    review['spoiler_flag'] = data['spoiler_flag']
                    review['date_added'] = data['date_added']
                    
                    nullables = ['review']
                    if(all([key in nullables or item is not None for (key, item) in review.items()])):
                        review_entry = reviews(**review)
                        db.session.add(review_entry)
                        db.session.commit()
                    
                        print(review_entry)
        

def addReviews():
    review_engine = create_engine('sqlite:///reviews.db', echo=True)
    Session = sessionmaker(bind=review_engine)
    review_session = Session()
    all_reviews = review_session.query(reviews).all()
    book_ids = [b[0] for b in db.session.query(books.id).all()]
    for rev in all_reviews:
        if db.session.query(reviews).get(rev.id) is None and rev.book_id in book_ids:
            r = {}
            r['id'] = rev.id
            r['user'] = rev.user
            r['rating'] = rev.rating
            r['book_id'] = rev.book_id
            r['review'] = rev.review
            r['spoiler_flag'] = rev.spoiler_flag
            r['date_added'] = rev.date_added

            print("Added review of book "+str(rev.book_id))
            db.session.add(reviews(**r))
            db.session.commit()
    
if __name__ == "__main__":
    print("Creating Betterreads Database")
    if '-clear' in sys.argv:
        print("Clearing Database")
        cleardb()
        
    global printout
    printout = '-print' in sys.argv
        
    createdb()
    #getGRSeriesByID(49075)
    populatedb()
    getNyTimesBooks()
    addReviews()
    my_reviews = db.session.query(reviews).all()
    print(reviews.review)