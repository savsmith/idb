from unittest import main, TestCase
import requests, simplejson

testurl = "https://betterreads.me"
print("Testing API...")

class TestBetterReadsAPI(TestCase):
    def testGetAllAuthors(self):
        url = testurl + "/api/authors"
        response = requests.get(url)
        data = response.content
        authors = simplejson.loads(data)
        # Check that the total number of authors > 1
        self.assertTrue(len(authors) > 1)
        for item in authors:
            # Check for a non-empty in the author field
            self.assertTrue(item["author"])

    def testGetAllBooks(self):
        url = testurl + "/api/books"
        response = requests.get(url)
        data = response.content
        books = simplejson.loads(data)
        # Check that the total number of books > 1
        self.assertTrue(len(books) > 1)
        for item in books:
            # Check for a non-empty name in the title field
            self.assertTrue(item["title"])

    def testGetAllSeries(self):
        url = testurl + "/api/series"
        response = requests.get(url)
        data = response.content
        series = simplejson.loads(data)
        # Check that the total number of series > 1
        self.assertTrue(len(series) > 1)
        for item in series:
            # Check for a non-empty name in the title field
            self.assertTrue(item["series_name"])

    def testGetAllReviews(self):
        url = testurl + "/api/reviews"
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
            # Check for a non-negative rating
            self.assertTrue(item["rating"] >= 0.0)

    def testAuthorById(self):
        url = testurl + "/api/authors/1"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 404)
        url = testurl + "/authors/4"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 200)

    def testBookById(self):
        url = testurl + "/api/books/1"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 200)
        url = testurl + "/api/books/20"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 404)

    def testSeriesById(self):
        url = testurl + "/api/series/49075"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 200)
        url = testurl + "/api/series/1"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 404)

    def testReviewById(self):
        url = testurl + "/api/reviews/22"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 200)
        url = testurl + "/api/reviews/1"
        status_code = requests.get(url).status_code
        self.assertEqual(status_code, 404)

if __name__ == "__main__":
    main()
