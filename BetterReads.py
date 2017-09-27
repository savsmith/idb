from flask import Flask, redirect, url_for, request, render_template, make_response, json
import os

app = Flask(__name__)
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))

json_url = os.path.join(SITE_ROOT, "static/db", "bookDB.json")
data = json.load(open(json_url))
                   
@app.route('/')
def home():
    return render_template("home.html")

@app.route('/book/<int:book_id>')
def book_instance(book_id):
    global data
    
    #If the user types in an id of a book that doesn't exist -> 404
    try:
        book = data["book"][book_id]
    except IndexError:
        redirect(url_for("page_not_found"))
    
    try:
        ratings = [data["review"][int(b)]["rating"] for b in book["reviews"]]
        rating = str(sum(ratings)/len(ratings))
    except IndexError:
        rating = "Unrated"
    
    return render_template("book_instance.html", 
            title=book["title"], 
            cover_art="/static/book_images/"+book["cover_art"],
            author = (data["author"][book["author"]])["name"],
            author_id = str(book["author"]),
            series = (data["series"][book["series"]])["title"],
            series_id = str(book["series"]),
            rating = rating)

@app.route('/author/<int:author_id>')
def author_instance(author_id):
    return "Author!"
    
@app.route('/series/<int:series_id>')
def series_instance(series_id):
    return "Series!"
            
@app.route('/books')
def books_model():
  global data
  books = data["book"]
  book_grid = [(book["title"], "/static/book_images/"+book["cover_art"]) for book in books]
  print(book_grid)
  return render_template('bookgrid.html', book_grid = book_grid)

@app.route('/authors')
def authors_model():
  global data
  authors = data["author"]
  author_grid = [(author["name"], "/static/author_art/"+author["author_art"]) for author in authors]
  return render_template('authorgrid.html', author_grid = author_grid)

@app.route('/series')
def series_model():
  global data
  series = data["series_i"]
  series_grid = [(series_i["name"], "/static/series_art/"+series_i["author_art"]) for series_i in series]
  return render_template('seriesgrid.html', series_grid = series_grid)

@app.route('/reviews')
def review_model():
  global data
  reviews = data["review"]
  review_grid = [("/static/reviews_art/"+review["review_image"], review["rating"], review["book"], review["user"]) for review in reviews]
  return render_template('reviewgrid.html', review_grid = review_grid)
    
@app.errorhandler(404)
def page_not_found(e):
    return "Error 404: Page Not Found"

def get_review_image(rating, images):
    """
    Returns image to use with rating value. Floors rating to a rating divisible by step. So .3 = zero stars. 
    Expects images to give 0 to max stars. 
    
    :param rating: float rating in the range of 0.0-5.0
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