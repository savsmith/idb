from flask import Flask, redirect, url_for, request, render_template, make_response, json
import requests
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from createdb import Base, books, author, series, reviews, books_author_assoc_table, series_author_assoc_table

import xmltodict

DB_Books = []
DB_Authors = []
DB_Series = []
DB_Reviews = []

MAXINT = 10

API_KEY = {
    'GOODREADS' : 'XPADtthE0OKv71uiqSwa8g',
    'GOOGLE' : 'AIzaSyBZ9fgBDM51R-dC00kPeCa7m7SjOsZm_Vg',
    'NYTIMES' : '1bfa24a95061415dbc8d4a4f136329a5'
}

class BookNotFound(Exception):
    pass

class BooksDoNotMatch(Exception):
    pass


def getNyTimesInfo(book, info):
    book['list'] = info['list_name']
    book['published_date'] = info['published_date']
    
    return info['book_details'][0]['primary_isbn13']
        
def getGoogleInfo(book, info):
    info = info['items'][0]
    book_details = info['volumeInfo']
    
    return book_details['title']
        

def getGRBookByID(id, author_callee=None, printout=True):
    book_entry = session.query(books).get(id)
    if book_entry is None:
        request = requests.get('https://www.goodreads.com/book/show/'+str(id)+'.xml?key='+API_KEY['GOODREADS'])
        if request.status_code == 200:
            data = xmltodict.parse(request.text)['GoodreadsResponse']['book']
            
            book = {}
            book['id'] = int(data['id'])
            book['title'] = data['title']
            book['description'] = data['description']
            book['small_img'] = data['small_image_url']
            book['large_img'] = data['image_url']
            book['published_date'] = (data['publication_month'] if data['publication_month'] is not None else "unknown_month"
                                     +"-"+
                                     data['publication_day'] if data['publication_day'] is not None else "unknown_day"
                                     +"-"+
                                     data['publication_year'] if data['publication_year'] is not None else "unknown_year")
            book['rating'] = data['average_rating']
            
            work_id = data['work']['id']['#text']
            series_request = xmltodict.parse(requests.get('https://www.goodreads.com/work/'+work_id+'/series?format=xml&key='+API_KEY['GOODREADS']).text)
            try:
                book['series'] = int(getGRSeriesByID(series_request['GoodreadsResponse']['series_works']['series_work']['series']['id']))
            except TypeError:
                book['series'] = None
            
            book_entry = books(**book)
            for key, author in data['authors'].items():
                if type(author) is list:
                    author = author[0]
                if author_callee is None or author_callee != int(author['id']):
                    book_entry.authors.append(getGRAuthorByID(int(author['id']), book_callee=id))   
            session.add(book_entry)
            session.commit() 
            
            if(printout):
                print(book_entry)
            
    return book_entry
    
def getGRAuthorByID(id, book_callee=None, printout=True):
    author_entry = session.query(author).get(id)
    if author_entry is None:
        request = requests.get('https://www.goodreads.com/author/show/'+str(id)+'.xml?key='+API_KEY['GOODREADS'])
        if request.status_code == 200:
            data = xmltodict.parse(request.text)['GoodreadsResponse']['author']
            
            auth = {}
            auth['id'] = int(data['id'])
            auth['author'] = data['name']
            auth['description'] = data['about']
            auth['hometown'] = data['hometown']
            auth['small_img'] = data['small_image_url']
            auth['large_img'] = data['image_url']
            
            author_entry = author(**auth)   
            for key, book in data['books'].items():
                if type(book) is list:
                    book = book[0]
                if book_callee is None or book_callee != int(book['id']['#text']):
                    author_entry.books.append(getGRBookByID(int(book['id']['#text']), id))
            session.add(author_entry)
            session.commit() 
            
            if(printout):
                print(author_entry)
            
    return author_entry        
        
def getGRSeriesByID(id, printout=True):
    series_entry = session.query(series).get(id)
    if series_entry is None:
        request = requests.get('https://www.goodreads.com/series/'+str(id)+'.xml?key='+API_KEY['GOODREADS'])
        if request.status_code == 200:
            data = xmltodict.parse(request.text)['GoodreadsResponse']['series']
            
            ser = {}
            ser['id'] = int(data['id'])
            ser['series_name'] = data['title']
            ser['count'] = int(data['series_works_count'])
            ser['description'] = data['description']
            
            series_entry = series(**ser)
            for key, book in data['series_works'].items():
                while type(book) is list:
                    book = book[0]
                series_entry.books.append(getGRBookByID(int(book['id'])))
            session.add(series_entry)
            session.commit()
            
            if(printout):
                print(series_entry)
            
    return series_entry
def getGRReviewByID(id, printout=True):
    review_entry = session.query(reviews).get(id)
    if review_entry is None:
        request = requests.get('https://www.goodreads.com/review/show.xml?id='+ str(id) +'&key='+API_KEY['GOODREADS'])
        if request.status_code == 200:
            data = xmltodict.parse(request.text)['GoodreadsResponse']['review']
            
            review = {}
            review['id'] = int(data['id'])
            review['user'] = data['user']['display_name']
            review['rating'] = int(data['rating'])
            review['book'] = getGRBookByID(int(data['book']['id']['#text']))
            review['review'] = data['body']
            review['spoiler_flag'] = data['spoiler_flag']
            review['date_added'] = data['date_added']
            
            review_entry = reviews(**review)
            session.add(review_entry)
            session.commit()
            
            if(printout):
                print(review_entry)
    
    return review_entry

def insertGRReviews(start, step):
    i = start
    while i < (start + step):
        getGRReviewByID(i)
        i += 1
    
def insertGRBooks(start, step):
    i = start
    while i < (start + step):
        getGRBookByID(i)
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
        
def populateDB():
    step = 10
    for i in range(1,100, step):
        insertGRBooks(i, i+step)
        insertGRAuthors(i, i+step)
        insertGRReviews(i, i+step)
        insertGRSeries(i, i+step)
    
def verify_same_book(*books):
    for b1 in books:
        for b2 in books:
            if b1 is not b2:
                b1 = b1.upper()
                b2 = b2.upper()
                if not b1 in b2 and not b2 in b1:
                    raise BooksDoNotMatch("Book: "+b1+ " does not match Book: "+b2)
                
            
#-----------------------------------#
# CREATE DATABASE AND START SESSION #
#-----------------------------------#  
          
engine = create_engine('sqlite:///betterreads.db')
# Bind the engine to the metadata of the Base class so that the
# declaratives can be accessed through a DBSession instance
Base.metadata.bind = engine
 
DBSession = sessionmaker(bind=engine)
# A DBSession() instance establishes all conversations with the database
# and represents a "staging zone" for all the objects loaded into the
# database session object. Any change made against the objects in the
# session won't be persisted into the database until you call
# session.commit(). If you're not happy about the changes, you can
# revert all of them back to the last commit by calling
# session.rollback()
session = DBSession()

#Clear Table Data
meta = Base.metadata
for table in reversed(meta.sorted_tables):
    session.execute(table.delete())
session.commit()

#-----------------#
# Scrape API Data #
#-----------------#

#NYTimes Best Seller Lists
# lists = [lst['list_name_encoded'] for lst in list(requests.get('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=1bfa24a95061415dbc8d4a4f136329a5').json()['results'])]


# #for lst in lists:
# temp_lists = [lists[0]]
# for lst in temp_lists:
    # nytimes_info = requests.get('https://api.nytimes.com/svc/books/v3/lists.json?api-key='+ API_KEY['NYTIMES'] +'&list=' + lst).json()['results']
    # for nyt_info in nytimes_info:
        # book = {}
        # try:
            # isbn = getNyTimesInfo(book, nyt_info)
            
            
            
            # #verify_same_book(ny_title, google_title, gr_title)
        # except (BookNotFound, BooksDoNotMatch) as e:
            # print(e)
insertGRReviews(1, 30)           