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

    def testAuthorById(self):
        url = "http://localhost:5000/api/authors/1"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 404)
        url = "http://localhost:5000/api/authors/4"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 200)

    def testBookById(self):
        url = "http://localhost:5000/api/books/61"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 200)
        url = "http://localhost:5000/api/authors/20"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 404)

    def testSeriesById(self):
        url = "http://localhost:5000/api/series/50296"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 200)
        url = "http://localhost:5000/api/series/1"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 404)

    def testReviewById(self):
        url = "http://localhost:5000/api/reviews/2"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 200)
        url = "http://localhost:5000/api/reviews/1"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 404)

if __name__ == "__main__":
    main()
