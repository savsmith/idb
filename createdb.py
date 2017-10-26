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


class books(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True)
    title = Column(String(250), nullable=False)
    list = Column(String(250), nullable=True)
    description = Column(String(2500), nullable=True)
    small_img = Column(String(250), nullable=True)
    large_img = Column(String(250), nullable=True)
    published_date = Column(String(250), nullable=True)
    rating = Column(Float, nullable=True)

    #Relationships
    series_id = Column(Integer, ForeignKey('series.id'), nullable=True)
    authors = relationship("author", secondary=books_author_assoc_table, back_populates="books")
    reviews = relationship('reviews', backref='book')


class author(Base):
    __tablename__ = 'author'
    id = Column(Integer, primary_key=True)
    author = Column(String(250), nullable=False)
    description = Column(String(2500), nullable=True)
    hometown = Column(String(250), nullable=True)
    small_img = Column(String(250), nullable=True)
    large_img = Column(String(250), nullable=True)



    #Relationships
    books = relationship("books", secondary=books_author_assoc_table, back_populates="authors")
    series = relationship("series", backref="author")

class series(Base):
    __tablename__ = 'series'
    id = Column(Integer, primary_key=True)
    series_name = Column(String(250), nullable=False)
    count = Column(Integer, nullable=False)
    description = Column(String(2500), nullable=True)

    #Relationships
    books = relationship(books, backref='series')
    author_id = Column(Integer, ForeignKey('author.id'), nullable=True)

class reviews(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True)
    user = Column(String(250), nullable=False)
    rating = Column(Float, nullable=False)
    review = Column(String(2500), nullable=True)
    spoiler_flag = Column(String(250), nullable=False)
    date_added = Column(String(250), nullable=False)

    #Relationships
    book_id = Column(Integer, ForeignKey('books.id'), nullable=False)


# Create an engine that stores data in the local directory's
# sqlalchemy_example.db file.
engine = create_engine('sqlite:///betterreads.db')

# Create all tables in the engine. This is equivalent to "Create Table"
# statements in raw SQL.
Base.metadata.create_all(engine)

with open('betterreads.schema', 'w') as f:
    print(CreateTable(books.__table__))
    print(CreateTable(author.__table__))
    print(CreateTable(series.__table__))
    print(CreateTable(reviews.__table__))

    f.write(str(CreateTable(books.__table__)))
    f.write(str(CreateTable(author.__table__)))
    f.write(str(CreateTable(series.__table__)))
    f.write(str(CreateTable(reviews.__table__)))

    print('Database Schema can be viewed in betterreads.schema')
