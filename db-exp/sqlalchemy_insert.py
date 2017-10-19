from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
 
from sqlalchemy_declarative import Base, Book, Author
 
engine = create_engine('sqlite:///sqlalchemy_example.db')
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

# Clear Data
meta = Base.metadata
for table in reversed(meta.sorted_tables):
    session.execute(table.delete())
session.commit()


# Insert an Author in the author table
new_author = Author(name='Brandon Sanderson')
session.add(new_author)
session.commit()

#Insert a Book in the book table
new_book = Book(title='The Way of Kings', author=new_author)
session.add(new_book)
new_book = Book(title='Words of Radience', author=new_author)
session.add(new_book)
new_book = Book(title='Oathbringer', author=new_author)
session.add(new_book)
session.commit()

new_author = Author(name='J.K. Rowling')
session.add(new_author)

new_book = Book(title='Harry Potter and the Sorcerer\'s Stone', author=new_author)
session.add(new_book)
new_book = Book(title='Harry Potter and the Chamber of Secrets', author=new_author)
session.add(new_book)
new_book = Book(title='Harry Potter and the Prizoner of Azkaban', author=new_author)
session.add(new_book)
session.commit()

 
 
# Create an engine that stores data in the local directory's
# sqlalchemy_example.db file.
engine = create_engine('sqlite:///sqlalchemy_example.db')
 
# Create all tables in the engine. This is equivalent to "Create Table"
# statements in raw SQL.
Base.metadata.create_all(engine)