# flake8: noqa
# mypy: ignore-errors

from solution import Solution
import pytest

def test_bubble_sort_unsorted_list():
    solution = Solution()
    assert solution.bubble_sort([3, 2, 1]) == [1, 2, 3]

def test_bubble_sort_sorted_list():
    solution = Solution()
    assert solution.bubble_sort([1, 2, 3]) == [1, 2, 3]

def test_bubble_sort_reverse_list():
    solution = Solution()
    assert solution.bubble_sort([3, 2, 1]) == [1, 2, 3]

def test_bubble_sort_identical_elements():
    solution = Solution()
    assert solution.bubble_sort([1, 1, 1]) == [1, 1, 1]

def test_bubble_sort_single_element():
    solution = Solution()
    assert solution.bubble_sort([1]) == [1]

def test_bubble_sort_empty_list():
    solution = Solution()
    assert solution.bubble_sort([]) == []

def test_bubble_sort_floats():
    solution = Solution()
    assert solution.bubble_sort([1.5, 0.5, 2.5]) == [0.5, 1.5, 2.5]

def test_bubble_sort_large_list():
    solution = Solution()
    large_list = list(range(100, 0, -1))
    sorted_list = list(range(1, 101))
    assert solution.bubble_sort(large_list) == sorted_list

def test_bubble_sort_with_duplicates():
    solution = Solution()
    assert solution.bubble_sort([3, 2, 1, 3, 2]) == [1, 2, 2, 3, 3]

def test_bubble_sort_extreme_values():
    solution = Solution()
    assert solution.bubble_sort([-10000, 10000, 0]) == [-10000, 0, 10000]

def test_bubble_sort_integers_and_floats():
    solution = Solution()
    assert solution.bubble_sort([3.5, 2, 1.1, 3]) == [1.1, 2, 3, 3.5]

def test_bubble_sort_all_positive():
    solution = Solution()
    assert solution.bubble_sort([10, 20, 30, 40]) == [10, 20, 30, 40]

def test_bubble_sort_all_negative():
    solution = Solution()
    assert solution.bubble_sort([-10, -20, -30, -40]) == [-40, -30, -20, -10]
