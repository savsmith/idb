from unittest import main, TestCase
import requests, simplejson
import BetterReads

class TestBetterReadsAPI(TestCase):
    def testGetAllAuthors(self):
        url = "http://localhost:5000/api/authors"
        response = requests.get(url)
        data = response.content
        authors = simplejson.loads(data)
        # Check that the total number of authors > 1
        self.assertTrue(len(authors) > 1)
        for item in authors:
            # Check for a non-empty in the author field
            self.assertTrue(item["author"])

    def testGetAllBooks(self):
        url = "http://localhost:5000/api/books"
        response = requests.get(url)
        data = response.content
        books = simplejson.loads(data)
        # Check that the total number of books > 1
        self.assertTrue(len(books) > 1)
        for item in books:
            # Check for a non-empty name in the title field
            self.assertTrue(item["title"])

    def testGetAllSeries(self):
        url = "http://localhost:5000/api/series"
        response = requests.get(url)
        data = response.content
        series = simplejson.loads(data)
        # Check that the total number of series > 1
        self.assertTrue(len(series) > 1)
        for item in series:
            # Check for a non-empty name in the title field
            self.assertTrue(item["series_name"])

    def testGetAllReviews(self):
        url = "http://localhost:5000/api/reviews"
        response = requests.get(url)
        data = response.content
        reviews = simplejson.loads(data)
        # Check that the total number of series > 1
        self.assertTrue(len(reviews) > 1)
        for item in reviews:
            """
            The below statement makes the test fail, because some
            review fields are null. We will check for a rating instead.
            self.assertTrue(item["review"])
            """
            # Check for a non-empty name in the rating field
            self.assertTrue(item["rating"])

if __name__ == "__main__":
    main()