from flask import Flask, redirect, url_for, request, render_template, make_response, json
import requests
import os

from xml.parsers.expat import ExpatError

from sqlalchemy import update
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from createdb import Base, books, author, series, reviews, books_author_assoc_table, series_author_assoc_table

from collections import OrderedDict

import xmltodict

API_KEY = {
    'GOODREADS' : 'XPADtthE0OKv71uiqSwa8g',
    #'GOOGLE' : 'AIzaSyBZ9fgBDM51R-dC00kPeCa7m7SjOsZm_Vg',
    'NYTIMES' : '1bfa24a95061415dbc8d4a4f136329a5'
}


def getNyTimesBooks():
    """
    Adds books and their corresponding authors and series featured on NYTIMES lists to the database
    """
    lists = [lst['list_name_encoded'] for lst in requests.get('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=1bfa24a95061415dbc8d4a4f136329a5').json()['results']]
    for l in lists:
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
            
def getGRBookByID(id, printout=True, list=None):
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
            if list is not None:
                book['list'] = list
            
            book_entry = books(**book)
            session.add(book_entry)
            session.commit()
            
            work_id = data['work']['id']['#text']
            series_request = requests.get('https://www.goodreads.com/work/'+work_id+'/series?format=xml&key='+API_KEY['GOODREADS'])
            series_request = xmltodict.parse(series_request.text)
            try:
                series_id = series_request['GoodreadsResponse']['series_works']['series_work']['series']['id']
                session.query(books).get(id).series = getGRSeriesByID(int(series_id))
                session.commit()
            except TypeError as e:
                print("When looking up book's series ran into "+str(e))
            
            
            for key, author in data['authors'].items():
                while type(author) is list:
                    author = author[0]
                if type(author) is OrderedDict:
                    b_author = getGRAuthorByID(int(author['id']), book_callee=id)
                    if b_author is not None:
                        session.query(books).get(id).authors.append(b_author)   
                        session.commit()
            
            if(printout):
                print(book_entry)
            
    return book_entry
    
def getGRAuthorByID(id, book_callee=None, series_callee=None, printout=True):
    """
    Returns author in the database, if author is not found in the database it creates a new one using goodreads api
    """    
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
            session.add(author_entry)
            session.commit() 
            for key, book in data['books'].items():
                while type(book) is list:
                    book = book[0]
                if type(book) is OrderedDict and (book_callee is None or book_callee != int(book['id']['#text'])):
                    a_book = getGRBookByID(int(book['id']['#text']), id)
                    if a_book is not None:
                        session.query(author).get(id).books.append(a_book)
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
            session.add(series_entry)
            session.commit()
            for key, book in data['series_works'].items():
                while type(book) is list:
                    book = book[0]
                if type(book) is OrderedDict:
                    s_books = session.query(series).get(id).books
                    s_authors = session.query(series).get(id).authors
                    s_b = getGRBookByID(int(book['id']))
                    if s_b is not None:
                        s_books.append(s_b)
                        session.commit()
                    s_a = getGRAuthorByID(int(book['work']['best_book']['author']['id']))
                    if s_a is not None:
                        s_authors.append(s_a)
                        session.commit()
            if(printout):
                print(series_entry)
            
    return series_entry
    
def getGRReviewByID(id, printout=True):
    """
    Returns review in the database, if review is not found in the database it creates a new one using goodreads api
    """   
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
        try:
            getGRReviewByID(i)
        except Exception as e:
            print("3"+str(e))
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
# meta = Base.metadata
# for table in reversed(meta.sorted_tables):
    # session.execute(table.delete())
# session.commit()

#-----------------#
# Scrape API Data #
#-----------------#

#getNyTimesBooks()
insertGRReviews(0, 100)