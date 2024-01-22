# flake8: noqa
# mypy: ignore-errors

from solution import Solution
import pytest
from typing import List

def test_two_sum_basic_case():
    solution = Solution()
    assert sorted(solution.twoSum([2, 7, 11, 15], 9)) == [0, 1]

def test_two_sum_with_duplicates():
    solution = Solution()
    assert sorted(solution.twoSum([3, 3], 6)) == [0, 1]

def test_two_sum_negative_numbers():
    solution = Solution()
    assert sorted(solution.twoSum([-3, 4, 3, 90], 0)) == [0, 2]

def test_two_sum_zero_target():
    solution = Solution()
    assert sorted(solution.twoSum([0, 4, 3, 0], 0)) == [0, 3]

def test_two_sum_large_numbers():
    solution = Solution()
    assert sorted(solution.twoSum([123, 456, 789, 10], 912)) == [0, 2]

def test_two_sum_one_negative_one_positive():
    solution = Solution()
    assert sorted(solution.twoSum([-1, 2, 1, -2], 0)) == [0, 2]

def test_two_sum_with_zero_and_positive_numbers():
    solution = Solution()
    assert sorted(solution.twoSum([0, 2, 1, 3], 3)) == [1, 2] or sorted(solution.twoSum([0, 2, 1, 3], 3)) == [0, 3]

def test_two_sum_with_all_positive_numbers():
    solution = Solution()
    assert sorted(solution.twoSum([1, 2, 3, 4], 7)) == [2, 3]

def test_two_sum_single_element_twice():
    solution = Solution()
    assert sorted(solution.twoSum([4, 2, 4], 8)) == [0, 2]

def test_two_sum_large_array():
    solution = Solution()
    large_array = list(range(1000))
    target = large_array[289] + large_array[290]
    assert sorted(solution.twoSum(large_array, target)) == [289, 290]
