import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String, Date, Float, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.schema import CreateTable


Base = declarative_base()

class Books(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)

engine = create_engine('sqlite:///betterreads.db')

Base.metadata.create_all(engine)
