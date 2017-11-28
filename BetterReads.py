from flask import Flask, redirect, url_for, request, render_template, make_response, json, jsonify, Response
import requests
import os
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///betterreads.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#----------#
# Database #
#----------#

series_author_assoc_table = db.Table('series_author_assoc', 
    db.Column('series_id', db.Integer, db.ForeignKey('series.id')),
    db.Column('author_id', db.Integer, db.ForeignKey('author.id')))

## book table
class books(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    list = db.Column(db.String(250), nullable=True)
    description = db.Column(db.String(2500), nullable=False)
    small_img = db.Column(db.String(250), nullable=True)
    large_img = db.Column(db.String(250), nullable=False)
    published_day = db.Column(db.String(250), nullable=True)
    published_year = db.Column(db.String(250), nullable=True)
    published_month = db.Column(db.String(250), nullable=True)
    published_date = db.Column(db.String(250), nullable=True)
    work_id = db.Column(db.Integer, nullable=False)
    num_pages = db.Column(db.Integer, nullable=True)
    link = db.Column(db.String(250), nullable=True)    
    rating = db.Column(db.Float, nullable=False)

    #db.relationships for books
    series_id = db.Column(db.Integer, db.ForeignKey('series.id'), nullable=True)
    author_id = db.Column(db.Integer, db.ForeignKey('author.id'), nullable=False)
    reviews = db.relationship('reviews', backref='book')

## author table
class author(db.Model):
    __tablename__ = 'author'
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(250), nullable=False)
    description = db.Column(db.String(2500), nullable=False)
    hometown = db.Column(db.String(250), nullable=True)
    small_img = db.Column(db.String(250), nullable=True)
    large_img = db.Column(db.String(250), nullable=False)
    gender = db.Column(db.String(250), nullable=True)
    fan_count = db.Column(db.Integer(), nullable=True)


    #db.relationships
    books = db.relationship("books", backref="author")
    series = db.relationship("series", secondary=series_author_assoc_table, back_populates="authors")

## series table
class series(db.Model):
    __tablename__ = 'series'
    id = db.Column(db.Integer, primary_key=True)
    series_name = db.Column(db.String(250), nullable=False)
    count = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(2500), nullable=False)
    primary_count = db.Column(db.Integer, nullable=False)
    numbered = db.Column(db.Boolean, nullable=False)
    
    #db.relationships for series
    books = db.relationship(books, backref='series')
    authors = db.relationship("author", secondary=series_author_assoc_table, back_populates="series")

## reviews table
class reviews(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(250), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    review = db.Column(db.String(2500), nullable=True)
    spoiler_flag = db.Column(db.String(250), nullable=False)
    date_added = db.Column(db.String(250), nullable=False)
    votes = db.Column(db.Integer(), nullable=True)

    #db.relationships
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)


#-----------#
# Endpoints #
#-----------#

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    return render_template("index.html")

# all instances of all models
@app.route('/all', methods = ['GET'])
def get_db():
    book_list = [dict(b) for b in db.engine.execute("select * from books")]
    author_list = [dict(a) for a in db.engine.execute("select * from author")]
    series_list = [dict(s) for s in db.engine.execute("select * from series")]
    reviews_list = [dict(r) for r in db.engine.execute("select * from reviews")]

    resp = jsonify({"books": book_list, "author": author_list, "series_i": series_list, "review": reviews_list})
    resp.status_code = 200
    resp.headers['Link'] = 'https://betterreads.me'

    return resp

def bad_request(errorStr):
    error = {"error": "invalid value for " + errorStr + " parameter"}

    resp = jsonify(error)
    resp.status_code = 400

    return resp

# all instances of books
@app.route('/api/books', methods = ['GET'])
def get_all_books():
    limit = request.args.get('limit', default = None, type = int)
    offset = request.args.get('offset', default = 0, type = int)
    sort = request.args.get('sort', default = None, type = str)
    filtering = request.args.get('filter', default = None, type = str)

    if sort == "asc":
        if filtering == "top":
            items = [dict(b) for b in db.engine.execute("select * from books where rating >= 4.0 order by title")]
        elif filtering == "series":
            items = [dict(b) for b in db.engine.execute("select * from books where series_id is not null order by title")]
        elif filtering == "recent":
            items = [dict(b) for b in db.engine.execute("select * from books where published_year is not null and cast (published_year as int) <= cast (strftime('%Y', 'now') as int) and cast (published_year as int) > (cast (strftime('%Y', 'now') as int) - 10) order by title")]
        elif filtering == None:
            items = [dict(b) for b in db.engine.execute("select * from books order by title")]
        else:
            return bad_request("filter")
    elif sort == "desc":
        if filtering == "top":
            items = [dict(b) for b in db.engine.execute("select * from books where rating >= 4.0 order by title desc")]
        elif filtering == "series":
            items = [dict(b) for b in db.engine.execute("select * from books where series_id is not null order by title desc")]
        elif filtering == "recent":
            items = [dict(b) for b in db.engine.execute("select * from books where published_year is not null and cast (published_year as int) <= cast (strftime('%Y', 'now') as int) and cast (published_year as int) > (cast (strftime('%Y', 'now') as int) - 10) order by title desc")]
        elif filtering == None:
            items = [dict(b) for b in db.engine.execute("select * from books order by title desc")]
        else:
            return bad_request("filter")
    elif sort == None:
        if filtering == "top":
            items = [dict(b) for b in db.engine.execute("select * from books where rating >= 4.0")]
        elif filtering == "series":
            items = [dict(b) for b in db.engine.execute("select * from books where series_id is not null")]
        elif filtering == "recent":
            items = [dict(b) for b in db.engine.execute("select * from books where published_year is not null and cast (published_year as int) <= cast (strftime('%Y', 'now') as int) and cast (published_year as int) > (cast (strftime('%Y', 'now') as int) - 10) order by cast (published_year as int) desc")]
        elif filtering == None:
            items = [dict(b) for b in db.engine.execute("select * from books")]
        else:
            return bad_request("filter")
    else:
        return bad_request("sort")

    if offset < 0:
        return bad_request("offset")
    if limit is not None and limit <= 0:
        return bad_request("limit")

    tmp = []
    idx = 0
    for e in items:
        if idx < offset:
            idx += 1
            continue
        if limit is not None and idx == (limit + offset):
            break
        tmp.append(e)
        idx += 1
    if tmp:
        items = tmp
    else:
        return bad_request("offset (out of range)")

    js = json.dumps(items, indent = 4)
    resp = Response(js, status = 200, mimetype = 'application/json')

    return resp

# all instances of authors
@app.route('/api/authors', methods = ['GET'])
def get_all_authors():
    limit = request.args.get('limit', default = None, type = int)
    offset = request.args.get('offset', default = 0, type = int)
    sort = request.args.get('sort', default = None, type = str)
    filtering = request.args.get('filter', default = None, type = str)

    if sort == "asc":
        if filtering == "top":
            items = [dict(a) for a in db.engine.execute("select * from author where id in (select a.id from books as b inner join author as a on a.id = b.author_id group by a.id having avg(b.rating) >= 4.0) order by author")]
        elif filtering == None:
            items = [dict(a) for a in db.engine.execute("select * from author order by author")]
        else:
            return bad_request("filter")
    elif sort == "desc":
        if filtering == "top":
            items = [dict(a) for a in db.engine.execute("select * from author where id in (select a.id from books as b inner join author as a on a.id = b.author_id group by a.id having avg(b.rating) >= 4.0) order by author desc")]
        elif filtering == None:
            items = [dict(a) for a in db.engine.execute("select * from author order by author desc")]
        else:
            return bad_request("filter")
    elif sort == None:
        if filtering == "top":
            items = [dict(a) for a in db.engine.execute("select * from author where id in (select a.id from books as b inner join author as a on a.id = b.author_id group by a.id having avg(b.rating) >= 4.0)")]
        elif filtering == None:
            items = [dict(a) for a in db.engine.execute("select * from author")]
        else:
            return bad_request("filter")
    else:
        return bad_request("sort")

    if offset < 0:
        return bad_request("offset")
    if limit is not None and limit <= 0:
        return bad_request("limit")

    tmp = []
    idx = 0
    for e in items:
        if idx < offset:
            idx += 1
            continue
        if limit is not None and idx == (limit + offset):
            break
        tmp.append(e)
        idx += 1
    if tmp:
        items = tmp
    else:
        return bad_request("offset (out of range)")

    js = json.dumps(items, indent = 4)
    resp = Response(js, status = 200, mimetype = 'application/json')

    return resp

#all instances of series
@app.route('/api/series', methods = ['GET'])
def get_all_series():
    limit = request.args.get('limit', default = None, type = int)
    offset = request.args.get('offset', default = 0, type = int)
    sort = request.args.get('sort', default = None, type = str)
    filtering = request.args.get('filter', default = None, type = str)

    if sort == "asc":
        if filtering == "low":
            items = [dict(s) for s in db.engine.execute("select * from series where count < 6 order by series_name")]
        elif filtering == "high":
            items = [dict(s) for s in db.engine.execute("select * from series where count >= 6 order by series_name")]
        elif filtering == None:
            items = [dict(s) for s in db.engine.execute("select * from series order by series_name")]
        else:
            return bad_request("filter")
    elif sort == "desc":
        if filtering == "low":
            items = [dict(s) for s in db.engine.execute("select * from series where count < 6 order by series_name desc")]
        elif filtering == "high":
            items = [dict(s) for s in db.engine.execute("select * from series where count >= 6 order by series_name desc")]
        elif filtering == None:
            items = [dict(s) for s in db.engine.execute("select * from series order by series_name desc")]
        else:
            return bad_request("filter")
    elif sort == None:
        if filtering == "low":
            items = [dict(s) for s in db.engine.execute("select * from series where count < 6")]
        elif filtering == "high":
            items = [dict(s) for s in db.engine.execute("select * from series where count >= 6")]
        elif filtering == None:
            items = [dict(s) for s in db.engine.execute("select * from series")]
        else:
            return bad_request("filter")
    else:
        return bad_request("sort")

    if offset < 0:
        return bad_request("offset")
    if limit is not None and limit <= 0:
        return bad_request("limit")

    tmp = []
    idx = 0
    for e in items:
        if idx < offset:
            idx += 1
            continue
        if limit is not None and idx == (limit + offset):
            break
        tmp.append(e)
        idx += 1
    if tmp:
        items = tmp
    else:
        return bad_request("offset (out of range)")

    js = json.dumps(items, indent = 4)
    resp = Response(js, status = 200, mimetype = 'application/json')

    return resp

#all instances of reviews
@app.route('/api/reviews', methods = ['GET'])
def get_all_reviews():
    limit = request.args.get('limit', default = None, type = int)
    offset = request.args.get('offset', default = 0, type = int)
    sort = request.args.get('sort', default = None, type = str)
    filtering = request.args.get('filter', default = None, type = str)

    if sort == "asc":
        if filtering == "low":
            items = [dict(r) for r in db.engine.execute("select * from reviews where review is not null and rating <= 2.5 order by rating")]
        elif filtering == "high":
            items = [dict(r) for r in db.engine.execute("select * from reviews where review is not null and rating > 2.5 order by rating")]
        elif filtering == None:
            items = [dict(r) for r in db.engine.execute("select * from reviews where review is not null order by rating")]
        else:
            return bad_request("filter")
    elif sort == "desc":
        if filtering == "low":
            items = [dict(r) for r in db.engine.execute("select * from reviews where review is not null and rating <= 2.5 order by rating desc")]
        elif filtering == "high":
            items = [dict(r) for r in db.engine.execute("select * from reviews where review is not null and rating > 2.5 order by rating desc")]
        elif filtering == None:
            items = [dict(r) for r in db.engine.execute("select * from reviews where review is not null order by rating desc")]
        else:
            return bad_request("filter")
    elif sort == None:
        if filtering == "low":
            items = [dict(r) for r in db.engine.execute("select * from reviews where review is not null and rating <= 2.5")]
        elif filtering == "high":
            items = [dict(r) for r in db.engine.execute("select * from reviews where review is not null and rating > 2.5")]
        elif filtering == None:
            items = [dict(r) for r in db.engine.execute("select * from reviews where review is not null")]
        else:
            return bad_request("filter")
    else:
        return bad_request("sort")

    if offset < 0:
        return bad_request("offset")
    if limit is not None and limit <= 0:
        return bad_request("limit")

    tmp = []
    idx = 0
    for e in items:
        if idx < offset:
            idx += 1
            continue
        if limit is not None and idx == (limit + offset):
            break
        tmp.append(e)
        idx += 1
    if tmp:
        items = tmp
    else:
        return bad_request("offset (out of range)")

    js = json.dumps(items, indent = 4)
    resp = Response(js, status = 200, mimetype = 'application/json')

    return resp

#reviews for a book
@app.route('/api/reviews/book/<int:book_id>', methods = ['GET'])    
def get_book_reviews(book_id):    
    js = json.dumps([dict(r) for r in db.engine.execute("select * from reviews where book_id == "+str(book_id))], indent = 4)
    if len(js) == 0:
        return not_found_error("Book's reviews")
    resp = Response(js, status = 200, mimetype = 'application/json')
    
    return resp

#authors for a book
@app.route('/api/book/<int:book_id>/authors', methods = ['GET'])    
def get_book_authors(book_id):
    author_ids = db.engine.execute("select * from (author a join book_author_assoc baa on (a.id == baa.author_id) ) where book_id == "+str(book_id))
    js = json.dumps([dict(a) for a in author_ids], indent = 4)
    if len(js) == 0:
        return not_found_error("Book's authors")
    resp = Response(js, status = 200, mimetype = 'application/json')
    
    return resp
  
#books for a series  
@app.route('/api/series/<int:series_id>/books', methods = ['GET'])    
def get_series_books(series_id):    
    books = db.engine.execute("select * from books where series_id == "+str(series_id))
    js = json.dumps([dict(a) for a in books], indent = 4)
    if len(js) == 0:
        return not_found_error("Series' books")
    resp = Response(js, status = 200, mimetype = 'application/json')
    
    return resp
   
#series for an author 
@app.route('/api/authors/<int:author_id>/series', methods = ['GET'])    
def get_authors_series(author_id):    
    series = db.engine.execute("select * from (series s join series_author_assoc saa on (s.id == saa.series_id) ) where author_id == "+str(author_id))
    js = json.dumps([dict(s) for s in series], indent = 4)
    if len(js) == 0:
        return not_found_error("Author's series")
    resp = Response(js, status = 200, mimetype = 'application/json')
    
    return resp

#author for a review 
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

#book instance based on id
@app.route('/api/books/<int:book_id>', methods = ['GET'])
def get_book_instance(book_id):
    book_list = [dict(b) for b in db.engine.execute("select * from books where id = " + str(book_id))]
    if book_list:
        resp = jsonify(book_list[0])
        resp.status_code = 200
    else:
        return not_found_error("book id")

    return resp

#book instance based on id
@app.route('/api/authors/<int:author_id>', methods = ['GET'])
def get_author_instance(author_id):
    author_list = [dict(a) for a in db.engine.execute("select * from author where id = " + str(author_id))]
    if author_list:
        resp = jsonify(author_list[0])
        resp.status_code = 200
    else:
        return not_found_error("author id")

    return resp

#series instance based on id
@app.route('/api/series/<int:series_id>', methods = ['GET'])
def get_series_instance(series_id):
    series_list = [dict(s) for s in db.engine.execute("select * from series where id = " + str(series_id))]
    if series_list:
        resp = jsonify(series_list[0])
        resp.status_code = 200
    else:
        return not_found_error("series id")

    return resp

#review instance based on id
@app.route('/api/reviews/<int:review_id>', methods = ['GET'])
def get_review_instance(review_id):
    review_list = [dict(r) for r in db.engine.execute("select * from reviews where id = " + str(review_id))]
    if review_list:
        resp = jsonify(review_list[0])
        resp.status_code = 200
    else:
        return not_found_error("review id")

    return resp


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
