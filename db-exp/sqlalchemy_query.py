from sqlalchemy_declarative import Base, Author, Book
from sqlalchemy import create_engine

engine = create_engine('sqlite:///sqlalchemy_example.db')
Base.metadata.bind = engine
from sqlalchemy.orm import sessionmaker

DBSession = sessionmaker()
DBSession.bind = engine
session = DBSession()

print("Books: ")
for book in session.query(Book).all():
    print("\t"+book.title+" by "+book.author.name)
print("")
print("Authors:")    
for author in session.query(Author).all():
    print("\t"+author.name)
    for book in author.books:
        print("\t\t"+book.title)