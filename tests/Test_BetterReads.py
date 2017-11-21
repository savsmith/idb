import unittest
import BetterReads

zero_to_five = ["zero.png", "one.png", "two.png", "three.png", "four.png", "five.png"]

class TestHelperMethods(unittest.TestCase):

    def test_get_review_image(self):
        global zero_to_five
        val = BetterReads.get_review_image(.1, zero_to_five)
        self.assertEqual(val, "zero.png")
    def test_get_review_image2(self):
        global zero_to_five
        val = BetterReads.get_review_image(.4, zero_to_five)
        self.assertEqual(val, "zero.png")
    def test_get_review_image3(self):
        global zero_to_five
        val = BetterReads.get_review_image(5.0, zero_to_five)
        self.assertEqual(val, "five.png")
    def test_get_review_image4(self):
        global zero_to_five
        val = BetterReads.get_review_image(1.0, zero_to_five)
        self.assertEqual(val, "one.png")
    def test_get_review_image5(self):
        global zero_to_five
        val = BetterReads.get_review_image(1.5, zero_to_five)
        self.assertEqual(val, "one.png")
        
        
if __name__ == '__main__':
    unittest.main()