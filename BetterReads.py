from flask import Flask, redirect, url_for, request, render_template, make_response, json
import requests
import os

app = Flask(__name__)
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))

json_url = os.path.join(SITE_ROOT, "static/db", "bookDB.json")
data = json.load(open(json_url))

#gitCommits = requests.get('https://api.github.com/repos/savsmith/idb/contributors').json()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    return render_template("index.html")

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

     return render_template("review_instance.html",
             userf=reviewf["user"],
             cover_art="/static/book_images/"+data["book"][reviewf["book"]]["cover_art"],
             bookf= (data["book"][reviewf["book"]])["title"],
             book_id = str(reviewf["book"]),
             authorf= (data["author"][reviewf["author"]])["name"],
             author_id = str(reviewf["author"]),
             ratingf = reviewf["rating"],
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
            book_id = str(series["books"][0])
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
