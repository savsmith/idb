from flask import Flask, redirect, url_for, request, render_template, make_response, json, jsonify, Response
import requests
import os
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///betterreads.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

json_url = os.path.join(SITE_ROOT, "static/db", "bookDB.json")
data = json.load(open(json_url))

#gitCommits = requests.get('https://api.github.com/repos/savsmith/idb/contributors').json()

#----------#
# Database #
#----------#
books_author_assoc_table = db.Table('book_author_assoc', 
    db.Column('book_id', db.Integer, db.ForeignKey('books.id')),
    db.Column('author_id', db.Integer, db.ForeignKey('author.id')))
series_author_assoc_table = db.Table('series_author_assoc', 
    db.Column('series_id', db.Integer, db.ForeignKey('series.id')),
    db.Column('author_id', db.Integer, db.ForeignKey('author.id')))

class books(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    list = db.Column(db.String(250), nullable=True)
    description = db.Column(db.String(2500), nullable=True)
    small_img = db.Column(db.String(250), nullable=True)
    large_img = db.Column(db.String(250), nullable=True)
    published_date = db.Column(db.String(250), nullable=True)
    rating = db.Column(db.Float, nullable=True)

    #db.relationships
    series_id = db.Column(db.Integer, db.ForeignKey('series.id'), nullable=True)
    authors = db.relationship("author", secondary=books_author_assoc_table, back_populates="books")
    reviews = db.relationship('reviews', backref='book')

class author(db.Model):
    __tablename__ = 'author'
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(250), nullable=False)
    description = db.Column(db.String(2500), nullable=True)
    hometown = db.Column(db.String(250), nullable=True)
    small_img = db.Column(db.String(250), nullable=True)
    large_img = db.Column(db.String(250), nullable=True)



    #db.relationships
    books = db.relationship("books", secondary=books_author_assoc_table, back_populates="authors")
    series = db.relationship("series", secondary=series_author_assoc_table, back_populates="authors")

class series(db.Model):
    __tablename__ = 'series'
    id = db.Column(db.Integer, primary_key=True)
    series_name = db.Column(db.String(250), nullable=False)
    count = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(2500), nullable=True)

    #db.relationships
    books = db.relationship(books, backref='series')
    authors = db.relationship("author", secondary=series_author_assoc_table, back_populates="series")

class reviews(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(250), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    review = db.Column(db.String(2500), nullable=True)
    spoiler_flag = db.Column(db.String(250), nullable=False)
    date_added = db.Column(db.String(250), nullable=False)

    #db.relationships
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)


#-----------#
# Endpoints #
#-----------#

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    return render_template("index.html")

@app.route('/all', methods = ['GET'])
def get_db():
    book_list = [dict(b) for b in db.engine.execute("select * from books")]
    author_list = [dict(a) for a in db.engine.execute("select * from author")]
    series_list = [dict(s) for s in db.engine.execute("select * from series")]
    reviews_list = [dict(r) for r in db.engine.execute("select * from reviews")]

    resp = jsonify({"books": book_list, "author": author_list, "series_i": series_list, "review": reviews_list})
    resp.status_code = 200
    resp.headers['Link'] = 'http://betterreads.me'

    return resp

@app.route('/api/books', methods = ['GET'])
def get_all_books():
    js = json.dumps([dict(b) for b in db.engine.execute("select * from books")], indent = 4)
    resp = Response(js, status = 200, mimetype = 'application/json')

    return resp

@app.route('/api/authors', methods = ['GET'])
def get_all_authors():
    js = json.dumps([dict(a) for a in db.engine.execute("select * from author")], indent = 4)
    resp = Response(js, status = 200, mimetype = 'application/json')

    return resp

@app.route('/api/series', methods = ['GET'])
def get_all_series():
    js = json.dumps([dict(s) for s in db.engine.execute("select * from series")], indent = 4)
    resp = Response(js, status = 200, mimetype = 'application/json')

    return resp

@app.route('/api/reviews', methods = ['GET'])
def get_all_reviews():
    js = json.dumps([dict(r) for r in db.engine.execute("select * from reviews")], indent = 4)
    resp = Response(js, status = 200, mimetype = 'application/json')

    return resp

@app.route('/api/reviews/book/<int:book_id>', methods = ['GET'])    
def get_book_reviews(book_id):    
    js = json.dumps([dict(r) for r in db.engine.execute("select * from reviews where book_id == "+str(book_id))], indent = 4)
    if len(js) == 0:
        return not_found_error("Book's reviews")
    resp = Response(js, status = 200, mimetype = 'application/json')
    
    return resp

@app.route('/api/book/<int:book_id>/authors', methods = ['GET'])    
def get_book_authors(book_id):
    author_ids = db.engine.execute("select * from (author a join book_author_assoc baa on (a.id == baa.author_id) ) where book_id == "+str(book_id))
    js = json.dumps([dict(a) for a in author_ids], indent = 4)
    if len(js) == 0:
        return not_found_error("Book's authors")
    resp = Response(js, status = 200, mimetype = 'application/json')
    
    return resp
    
@app.route('/api/series/<int:series_id>/books', methods = ['GET'])    
def get_series_books(series_id):    
    books = db.engine.execute("select * from books where series_id == "+str(series_id))
    js = json.dumps([dict(a) for a in books], indent = 4)
    if len(js) == 0:
        return not_found_error("Series' books")
    resp = Response(js, status = 200, mimetype = 'application/json')
    
    return resp
    
@app.route('/api/authors/<int:author_id>/series', methods = ['GET'])    
def get_authors_series(author_id):    
    series = db.engine.execute("select * from (series s join series_author_assoc saa on (s.id == saa.series_id) ) where author_id == "+str(author_id))
    js = json.dumps([dict(s) for s in series], indent = 4)
    if len(js) == 0:
        return not_found_error("Author's series")
    resp = Response(js, status = 200, mimetype = 'application/json')
    
    return resp
    
@app.route('/api/reviews/<int:review_id>/authors', methods = ['GET']) 
def get_reviews_authors(review_id):
    author_ids = db.engine.execute("select * from (author a join book_author_assoc baa on (a.id == baa.author_id) ) where book_id == (select book_id from reviews where id == "+str(review_id)+")")
    js = json.dumps([dict(a) for a in author_ids], indent = 4)
    if len(js) == 0:
        return not_found_error("Review's author")
    resp = Response(js, status = 200, mimetype = 'application/json')
    
    return resp
    
def not_found_error(errorStr):
    error = {"error": errorStr + " not found"}

    resp = jsonify(error)
    resp.status_code = 404

    return resp

@app.route('/api/books/<int:book_id>', methods = ['GET'])
def get_book_instance(book_id):
    book_list = [dict(b) for b in conn.execute("select * from books where id = " + str(book_id))]
    if book_list:
        resp = jsonify(book_list[0])
        resp.status_code = 200
    else:
        return not_found_error("book id")

    return resp

@app.route('/api/authors/<int:author_id>', methods = ['GET'])
def get_author_instance(author_id):
    author_list = [dict(a) for a in conn.execute("select * from author where id = " + str(author_id))]
    if author_list:
        resp = jsonify(author_list[0])
        resp.status_code = 200
    else:
        return not_found_error("author id")

    return resp

@app.route('/api/series/<int:series_id>', methods = ['GET'])
def get_series_instance(series_id):
    series_list = [dict(s) for s in conn.execute("select * from series where id = " + str(series_id))]
    if series_list:
        resp = jsonify(series_list[0])
        resp.status_code = 200
    else:
        return not_found_error("series id")

    return resp

@app.route('/api/reviews/<int:review_id>', methods = ['GET'])
def get_review_instance(review_id):
    review_list = [dict(r) for r in conn.execute("select * from reviews where id = " + str(review_id))]
    if review_list:
        resp = jsonify(review_list[0])
        resp.status_code = 200
    else:
        return not_found_error("review id")

    return resp

@app.route('/books/<int:book_id>')
def book_instance(book_id):
    global data

    #If the user types in an id of a book that doesn't exist -> 404
    try:
        book = data["book"][book_id]
    except IndexError:
        redirect(url_for("page_not_found"))

    try:
        ratings = [data["review"][int(b)]["rating"] for b in book["reviews"]]
        rating = "/static/review_stars/" + get_review_image(sum(ratings)/len(ratings))
    except IndexError:
        rating = "unrated"
    print(book)

    return render_template("book_instance.html",
            title=book["title"],
            cover_art="/static/book_images/"+book["cover_art"],
            author = (data["author"][book["author"]])["name"],
            author_id = str(book["author"]),
            series = (data["series_i"][book["series"]])["title"],
            series_id = str(book["series"]),
            rating = rating,
            review = (data["review"][book["reviews"][0]])["user"],
            review_id = str(book["reviews"][0]),
            description = str(book["description"])
            )


@app.route('/review/<int:review_id>')
def review_instance(review_id):
     try:
         reviewf = data["review"][review_id]
     except IndexError:
         redirect(url_for("page_not_found"))

     try:
         rating = "/static/review_stars/" + get_review_image(reviewf["rating"])
     except IndexError:
         rating = "no rating"

     return render_template("review_instance.html",
             userf=reviewf["user"],
             cover_art="/static/book_images/"+data["book"][reviewf["book"]]["cover_art"],
             bookf= (data["book"][reviewf["book"]])["title"],
             book_id = str(reviewf["book"]),
             authorf= (data["author"][reviewf["author"]])["name"],
             author_id = str(reviewf["author"]),
             ratingf = reviewf["rating"],
             rating_pic = rating,
             textf = reviewf["text"])

@app.route('/authors/<int:author_id>')
def author_instance(author_id):
    try:
        author = data["author"][author_id]
    except IndexError:
        redirect(url_for("page_not_found"))

    return render_template("author_instance.html",
            name=author["name"],
            author_art="/static/author_art/"+author["author_art"],
            description=author["description"],
            series=(data["series_i"][author["series"][0]])["title"],
            series_id=str(author["series"][0]),
            book_id=str(author["books"][0]),
            book=(data["book"][author["books"][0]])["title"],
            genre=author["genres"][0],
            twitter=author["twitter"],
            review = (data["review"][author["author_reviews"][0]])["user"],
            review_id = str(author["author_reviews"][0])
            )


@app.route('/series/<int:series_id>')
def series_instance(series_id):
    global data

    try:
        series = data["series_i"][series_id]
    except IndexError:
        redirect(url_for("page_not_found"))

    return render_template("series_instance.html",
            title=series["title"],
            cover_art="/static/series_art/"+series["series_art"],
            author = (data["author"][series["author"]])["name"],
            author_id = str(series["author"]),
            count = series["count"],
            start = series["start"],
            end = series["end"],
            book = (data["book"][series["books"][0]])["title"],
            book_id = str(series["books"][0]),
            book_pic = "/static/book_images/"+(data["book"][series["books"][0]])["cover_art"],
            )

@app.route('/books')
def books_model():
  global data
  books = data["book"]
  book_grid = [(book["title"], "/static/book_images/"+book["cover_art"], book["book_id"]) for book in books]
  print(book_grid)
  return render_template('bookgrid.html', book_grid = book_grid)

@app.route('/authors')
def authors_model():
  global data
  authors = data["author"]
  author_grid = [(author["name"], "/static/author_art/"+author["author_art"], author["author_id"]) for author in authors]
  return render_template('authorgrid.html', author_grid = author_grid)

@app.route('/series')
def series_model():
  global data
  series = data["series_i"]
  series_grid = [(series_i["title"], "/static/series_art/"+series_i["series_art"], series_i["series_id"]) for series_i in series]
  return render_template('seriesgrid.html', series_grid = series_grid)

@app.route('/reviews')
def review_model():
  global data
  reviews = data["review"]
  review_grid = [("/static/review_stars/" + get_review_image(review["rating"]), review["rating"], review["book_title"], review["user"], review["review_id"]) for review in reviews]
  return render_template('reviewgrid.html', review_grid = review_grid)

@app.route('/about')
def about_page():
    # global gitCommits
    # commits = []
    # totalCommits = 0
    # for user in range(0,6):
    #     commits.append(gitCommits[user]["contributions"])
    #     totalCommits += commits[user]
    # commits[0] = commits[0] + commits[4]
    return render_template('about.html')


@app.errorhandler(404)
def page_not_found(e):
    return "Error 404: Page Not Found"

def get_review_image(rating, images=["0star.png", "1star.png", "2star.png", "3star.png", "4star.png", "5star.png"]):
    """
    Returns image to use with rating value. Floors rating to a rating divisible by step. So .3 = zero stars.
    Expects images to give 0 to max stars.

    :param rating: db.Float rating in the range of 0.0-5.0
    :param images: list of image names, ex: [zero_star.png, five_star.png]
    """
    step = 5/(len(images)-1)
    val = step
    for i in images:
        if rating < val:
            return i
        val += step

if __name__ == '__main__':
   app.run(debug = True)
