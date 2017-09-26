from flask import Flask, redirect, url_for, request, render_template, make_response, json
import os

app = Flask(__name__)
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))

json_url = os.path.join(SITE_ROOT, "static/db", "bookDB.json")
data = json.load(open(json_url))
                   
@app.route('/book/<int:book_id>')
def book_instance(book_id):
    global data
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
            series = (data["series"][book["series"]])["title"],
            rating = rating)

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
    
@app.errorhandler(404)
def page_not_found(e):
    return "Error 404: Page Not Found"

    
if __name__ == '__main__':
   app.run(debug = True)