import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String, Date, Float, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

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
    list = Column(String(250), nullable=False)
    published_date = Column(Date, nullable=False)
    isbn13 = Column(String(250), nullable=False)
    description = Column(String(2500), nullable=False)
    
    #Relationships
    authors = relationship("author", secondary=books_author_assoc_table, back_populates="books")
    series_id = Column(Integer, ForeignKey('series.id'), nullable=False)
    reviews = relationship('reviews', backref='book')
    
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
    start = Column(Date, nullable=False)
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