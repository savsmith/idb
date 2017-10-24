import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String, Date, Float, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.schema import CreateTable

Base = declarative_base()

books_author_assoc_table = Table('book_author_assoc', Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id')),
    Column('author_id', Integer, ForeignKey('author.id')))
series_author_assoc_table = Table('series_author_assoc', Base.metadata,
    Column('series_id', Integer, ForeignKey('series.id')),
    Column('author_id', Integer, ForeignKey('author.id')))    
    

class Books(Base):
    __tablename__ = 'books'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(250), nullable=False)
    list = Column(String(250), nullable=True)
    description = Column(String(2500), nullable=False)
    small_img = Column(String(250), nullable=True)
    large_img = Column(String(250), nullable=True)
    published_date = Column(String(250), nullable=True)
    
    #Relationships
    authors = relationship("author", secondary=books_author_assoc_table, back_populates="books", lazy = "dynamic")
    series_id = Column(Integer, ForeignKey('series.id'), nullable=True)
    reviews = relationship('reviews', backref='book')
    
    def __init__(self,
                 id=None,
                 title=None,
                 list=None,
                 description=None,
                 small_img=None,
                 large_img=None,
                 authors=[],
                 series=None,
                 reviews=[],
                 published_date=None):
        self.id = id
        self.title = title
        self.list = list
        self.description = description
        self.small_img = small_img
        self.large_img = large_img
        self.authors = authors
        self.series = series
        self.reviews = reviews
        self.published_date = published_date
    
class Author(Base):
    __tablename__ = 'author'
    id = Column(Integer, primary_key=True)
    author = Column(String(250), nullable=False)
    description = Column(String(2500), nullable=False)
    
    #Relationships
    books = relationship("book", secondary=books_author_assoc_table, back_populates="authors")
    series = relationship("series", secondary=series_author_assoc_table, back_populates="authors")
    reviews = relationship('reviews', backref='book')
    
class Series(Base):
    __tablename__ = 'series'
    id = Column(Integer, primary_key=True)
    series_name = Column(String(250), nullable=False)
    count = Column(Integer, nullable=False)
    start = Column(Date, nullable=True)
    end = Column(Date, nullable=True)
    
    #Relationships
    books = relationship(Books, backref='series')
    series = relationship("author", secondary=series_author_assoc_table, back_populates="series")
    
class Reviews(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True)
    user = Column(String(250), nullable=False)
    rating = Column(Float, nullable=False)
    review = Column(String(2500), nullable=False)
    
    #Relationships
    book_id = Column(Integer, ForeignKey('books.id'), nullable=False)
    author_id = Column(Integer, ForeignKey('author.id'), nullable=False)
    
    
# Create an engine that stores data in the local directory's
# sqlalchemy_example.db file.
engine = create_engine('sqlite:///betterreads.db')
 
# Create all tables in the engine. This is equivalent to "Create Table"
# statements in raw SQL.
Base.metadata.create_all(engine)

with open('betterreads.schema', 'w') as f:
    print(CreateTable(Books.__table__))
    print(CreateTable(Author.__table__))
    print(CreateTable(Series.__table__))
    print(CreateTable(Reviews.__table__))

    f.write(str(CreateTable(Books.__table__)))
    f.write(str(CreateTable(Author.__table__)))
    f.write(str(CreateTable(Series.__table__)))
    f.write(str(CreateTable(Reviews.__table__)))
    
    print('Database Schema can be viewed in betterreads.schema')

