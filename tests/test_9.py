# flake8: noqa
# mypy: ignore-errors

from solution import Solution
import pytest

def test_longest_palindrome_basic_case():
    solution = Solution()
    assert solution.longestPalindrome("babad") in ["bab", "aba"]

def test_longest_palindrome_even_length_palindrome():
    solution = Solution()
    assert solution.longestPalindrome("cbbd") == "bb"

def test_longest_palindrome_single_character():
    solution = Solution()
    assert solution.longestPalindrome("a") == "a"

def test_longest_palindrome_entire_string_is_palindrome():
    solution = Solution()
    assert solution.longestPalindrome("racecar") == "racecar"

def test_longest_palindrome_no_palindrome():
    solution = Solution()
    assert solution.longestPalindrome("abc") == "c"

def test_longest_palindrome_mixed_characters():
    solution = Solution()
    assert solution.longestPalindrome("A1b2B1a") == "a1b2b1a"

def test_longest_palindrome_long_string():
    solution = Solution()
    long_string = "a" * 500 + "b" * 500
    assert solution.longestPalindrome(long_string) == "b" * 500

def test_longest_palindrome_empty_string():
    solution = Solution()
    assert solution.longestPalindrome("") == ""
