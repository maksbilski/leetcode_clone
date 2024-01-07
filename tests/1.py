# flake8: noqa
# mypy: ignore-errors

from solution import Solution
import pytest


def test_calculate_average_normal_list():
    solution = Solution()
    assert solution.calculate_average([10, 20, 30]) == 20


def test_calculate_average_empty_list():
    solution = Solution()
    assert solution.calculate_average([]) == "Lista jest pusta."


def test_calculate_average_invalid_data():
    solution = Solution()
    assert solution.calculate_average(
        [10, 'abc', 20]) == "Lista zawiera nieprawidłowe dane."
