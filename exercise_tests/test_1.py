# flake8: noqa
# mypy: ignore-errors

from solution import Solution
import pytest


def test_longest_substring_unique_chars():
    solution = Solution()
    assert solution.lengthOfLongestSubstring("abcabcbb") == 3

def test_longest_substring_all_same_chars():
    solution = Solution()
    assert solution.lengthOfLongestSubstring("bbbbb") == 1

def test_longest_substring_mixed_chars():
    solution = Solution()
    assert solution.lengthOfLongestSubstring("pwwkew") == 3

def test_longest_substring_empty_string():
    solution = Solution()
    assert solution.lengthOfLongestSubstring("") == 0

def test_longest_substring_no_repeats():
    solution = Solution()
    assert solution.lengthOfLongestSubstring("abcdef") == 6

def test_longest_substring_repeating_chars():
    solution = Solution()
    assert solution.lengthOfLongestSubstring("aab") == 2

def test_longest_substring_long_string():
    solution = Solution()
    long_string = "a" * 10000 + "b" * 10000
    assert solution.lengthOfLongestSubstring(long_string) == 2

def test_longest_substring_complex_case():
    solution = Solution()
    assert solution.lengthOfLongestSubstring("dvdf") == 3

def test_longest_substring_single_char_string():
    solution = Solution()
    assert solution.lengthOfLongestSubstring("a") == 1

def test_longest_substring_with_spaces():
    solution = Solution()
    assert solution.lengthOfLongestSubstring(" ") == 1

def test_longest_substring_with_symbols():
    solution = Solution()
    assert solution.lengthOfLongestSubstring("!@#$%^&*()") == 10

def test_longest_substring_with_numbers():
    solution = Solution()
    assert solution.lengthOfLongestSubstring("11234567890") == 10

def test_longest_substring_with_mixed_characters():
    solution = Solution()
    assert solution.lengthOfLongestSubstring("a1b2c3d4e5f6g7h8i9j0") == 20
