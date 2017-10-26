from unittest import main, TestCase
import json
import urllib
import BetterReads

class TestBetterReadsAPI(TestCase):
    def testGetAllBooks(self):
        response = urlopen("http://localhost:5000/api/books/")
        data =
        print(result)
        obj_list = deserialize_list(result)
        print("THIS IS THE RESULT\n\n\n")
        print(len(obj))
        self.assertTrue(len(obj) > 1)

if __name__ == "__main__":
    main()
