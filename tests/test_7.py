# flake8: noqa
# mypy: ignore-errors

from solution import Solution
import pytest

def test_median_basic_case():
    solution = Solution()
    assert solution.findMedianSortedArrays([1, 3], [2]) == 2.00000

def test_median_even_number_of_elements():
    solution = Solution()
    assert solution.findMedianSortedArrays([1, 2], [3, 4]) == 2.50000

def test_median_with_negative_numbers():
    solution = Solution()
    assert solution.findMedianSortedArrays([-5, -3, -1], [-2, 0, 2]) == -1.50000

def test_median_one_empty_array():
    solution = Solution()
    assert solution.findMedianSortedArrays([], [1, 2, 3, 4, 5]) == 3.00000

def test_median_large_arrays():
    solution = Solution()
    nums1 = list(range(1000))
    nums2 = list(range(1000, 2000))
    assert solution.findMedianSortedArrays(nums1, nums2) == 999.50000

def test_median_single_element_arrays():
    solution = Solution()
    assert solution.findMedianSortedArrays([2], [3]) == 2.50000

def test_median_arrays_with_duplicates():
    solution = Solution()
    assert solution.findMedianSortedArrays([1, 2, 2, 2, 3], [2, 2, 3, 4, 5]) == 2.00000

def test_median_large_numbers():
    solution = Solution()
    assert solution.findMedianSortedArrays([1000000], [1000001, 1000002, 1000003]) == 1000001.50000

def test_median_mixed_length_arrays():
    solution = Solution()
    assert solution.findMedianSortedArrays([1, 2, 3, 4, 5], [6, 7, 8, 9]) == 5.00000
