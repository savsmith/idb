from createdb import Base, books, author, series, reviews
from sqlalchemy import create_engine

from flask import json


engine = create_engine('sqlite:///betterreads.db')
Base.metadata.bind = engine
from sqlalchemy.orm import sessionmaker

DBSession = sessionmaker()
DBSession.bind = engine
session = DBSession()

print("Books: ")
for book in session.query(books).all():
    
    if(book.title is not None):
        print("\t"+book.title)
# print("")
print("Authors:")
for a in session.query(author).all():
    print("\t"+a.author)
    # for book in a.books:
        # print("\t\t"+book.title)
print("Series:")
for s in session.query(series).all():
    print("\t"+s.series_name)
    
print("Reviews:")
for r in session.query(reviews).all():
    if(r.user is not None and r.review is not None):
        print("\t"+r.user+": "+r.review)
        
conn = engine.connect()
print(json.dumps([dict(b) for b in conn.execute("select * from books")]))
