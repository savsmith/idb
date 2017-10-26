from unittest import main, TestCase
import requests, simplejson
import BetterReads

class TestBetterReadsAPI(TestCase):
    def testGetAllAuthors(self):
        url = "http://localhost:5000/api/authors"
        response = requests.get(url)
        data = response.content
        authors = simplejson.loads(data)
        self.assertTrue(len(authors) > 1)

if __name__ == "__main__":
    main()
