from flask import Flask, redirect, url_for, request, render_template, make_response
app = Flask(__name__)

#Temporary: For testing. Needs to be replaced with actual info from API. 
reviews = [{"user" : "John Doe",
           "rating" : 4.7,
           "text" : "I liked it alot",
           "book" : 0,
           "author" : 0}]

series = [{"name" : "The Stormlight Archives",
           "books" : [0],
           "start" : "August 31, 2010",
           "end"   : "Ongoing",
           "description" : "Brandon Sanderson's epic fantasy cycle tells the story of Roshar, a world of stone and storms..."}]

authors = [{"name" : "Brandon Sanderson",
            "books" : [0],
            "series" : [0],
            "description" : "He is an author"}]


books = [{"title" : "The Way of Kings", 
          "cover_art" : "the_way_of_kings_cover_art.jpg",
          "author" : 0,
          "series" : 0 ,
          "reviews" : [0]}]


@app.route('/book/<int:book_id>')
def book_instance(book_id):
    global books
    book = books[book_id]
    print(book)
    rating = 0 
    for r in book["reviews"]:
        rating += reviews[r]["rating"]
    rating /= len(book["reviews"])
    return render_template('book_instance.html', title = book["title"], 
                                                 cover_art = "/static/book_images/"+book["cover_art"],
                                                 author = authors[book["author"]]["name"],
                                                 series = series[book["series"]]["name"],
                                                 rating = str(rating))
    
if __name__ == '__main__':
   app.run(debug = True)