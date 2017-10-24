from flask import Flask, redirect, url_for, request, render_template, make_response, json
import requests
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from createdb import Base, Books, Author, Series, Reviews

import xmltodict

DB_Books = []
DB_Authors = []
DB_Series = []
DB_Reviews = []

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

def populateDB(book, info):
    if info.status_code == 200:
        info = xmltodict.parse(info.text)
        if info['GoodreadsResponse']['search']['total-results'] != "0":
            
            #Book
            book_id = info['GoodreadsResponse']['search']['results']['work']['best_book']['id']['#text']
            work_id = info['GoodreadsResponse']['search']['results']['work']['id']['#text']
            
            #Check if book is already in DB
            if False:
                raise BookNotFound()
            else:
                book_info = xmltodict.parse(requests.get('https://www.goodreads.com/book/show/'+ book_id +'.xml?key=' + API_KEY['GOODREADS']).text)['GoodreadsResponse']['book']
                book['title'] = book_info['title']
                book['description'] = book_info['description']
                book['small_img'] = book_info['small_image_url']
                book['large_img'] = book_info['image_url']
                book['id'] = int(book_id)
                
                Books(**book)
                # -- Other Attributes We Could Add -- #
                # book['rating'] = float(book_info['average_rating'])
                # book['rating_count'] = int(book_info['ratings_count'])
                
            #Authors
            # author_id = #TODO
            # author_info = xmltodict.parse(requests.get('https://www.goodreads.com/author/show/'+ author_id +'?format=xml&key=' + API_KEY['GOODREADS']).text)['GoodreadsResponse']['author']
            
            # #Check if author is already in DB
            # if False:
                # author = None
            # else:
                # author = {}
                # author['id'] = int(author_id)
                # author['author'] = book_details['best_book']['author']['name']
                # author['description'] = author_info['about']
                
                # # -- Other Attributes We Could Add -- #
                # # author['hometown'] = author_info['hometown']
                # # author['influences'] = author_info['influences']
                # # author['born_at'] = author_info['born_at']
                # # author['died_at'] = author_info['died_at']
                
                # session.add(author)
                # session.commit()
            
                
            
            # #Reviews
            
            
            # #Check if book is already in DB
            # if False:
                # book = None
            # else:
                # book['title'] = book_details['best_book']['title']
                # book['author_id'] = int(book_details['best_book']['author']['id']['#text'])
                
                # # -- Other Attributes We Could Add -- #
            
            
            #Series
            # series_info = xmltodict.parse(requests.get('https://www.goodreads.com/work/'+ work_id +'/series?format=xml&key='+ API_KEY['GOODREADS']).text)['GoodreadsResponse']['series_works']
            # if len(series_info) != 0:
                # series = {}
                # series_id = series_info['series_work']['series']['id']
                # #book['series_position'] = series_info['series_work']['user_position']
                
                # #Check if series is already in DB
                
                # #Get info of series with series id
                # series_info = xmltodict.parse(requests.get('https://www.goodreads.com/series/'+ series_id +'/series?format=xml&key='+ API_KEY['GOODREADS']).text)['GoodreadsResponse']['series']
                
                # series['id'] = int(series_id)
                # series['series_name'] = series_info['title']
                # series['description'] = series_info['description']
                # series['count'] = series_info['series_works_count']
                
                
            
            
        else:
            raise BookNotFound
    else:
        raise BookNotFound
        
    return book_details['best_book']['title'], author, series
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

# Clear Table Data
meta = Base.metadata
for table in reversed(meta.sorted_tables):
    session.execute(table.delete())
session.commit()

#-----------------#
# Scrape API Data #
#-----------------#

#NYTimes Best Seller Lists
lists = [lst['list_name_encoded'] for lst in list(requests.get('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=1bfa24a95061415dbc8d4a4f136329a5').json()['results'])]


#for lst in lists:
temp_lists = [lists[0]]
for lst in temp_lists:
    nytimes_info = requests.get('https://api.nytimes.com/svc/books/v3/lists.json?api-key='+ API_KEY['NYTIMES'] +'&list=' + lst).json()['results']
    for nyt_info in nytimes_info:
        book = {}
        try:
            isbn = getNyTimesInfo(book, nyt_info)
            #google_title = getGoogleInfo(book, requests.get('https://www.googleapis.com/books/v1/volumes?key='+ API_KEY['GOOGLE'] +'&q={' + book['isbn13'] + '}&maxResults=1').json())
            populateDB(book, requests.get('https://www.goodreads.com/search/index.xml?key='+ API_KEY['GOODREADS'] + '&q=' + isbn))
            
            # for item in book.items():
                # print(item)
            # for item in author.items():
                # print(item)
            # for item in series.items():
                # print(item)
            
            #verify_same_book(ny_title, google_title, gr_title)
        except (BookNotFound, BooksDoNotMatch) as e:
            print(e)
            