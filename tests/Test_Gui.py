import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

url = "http://localhost:5000/"
class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_page_load_home(self):
        driver = self.driver
        driver.get(url)
        self.assertIn("BetterReads", driver.title)

    def test_page_load_about(self):
        driver = self.driver
        driver.get(url + 'about')
        self.assertIn("BetterReads", driver.title)

    def test_page_load_books(self):
        driver = self.driver
        driver.get(url + 'books')
        self.assertIn("BetterReads", driver.title)

    def test_page_load_series(self):
        driver = self.driver
        driver.get(url + 'series')
        self.assertIn("BetterReads", driver.title)

    def test_page_load_authors(self):
        driver = self.driver
        driver.get(url + "author")
        self.assertIn("BetterReads", driver.title)

    def test_page_load_reviews(self):
        driver = self.driver
        driver.get(url + "reviews")
        self.assertIn("BetterReads", driver.title)

    def test_books(self):
        driver = self.driver
        driver.get(url + "books")
        self.assertIsNotNone(driver.find_element_by_class_name('centerCol'))

    def test_series(self):
        driver = self.driver
        driver.get(url + "series")
        self.assertIsNotNone(driver.find_element_by_class_name('centerCol'))

    def test_authors(self):
        driver = self.driver
        driver.get(url + "author")
        self.assertIsNotNone(driver.find_element_by_class_name('centerCol'))

    def test_reviews(self):
        driver = self.driver
        driver.get(url + "reviews")
        self.assertIsNotNone(driver.find_element_by_class_name('centerCol'))


    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()