# flake8: noqa
# mypy: ignore-errors

from solution import combine_two_tables
import pandas as pd
import pytest

def test_combine_with_full_data():
    person_data = [[1, 'Wang', 'Allen'], [2, 'Alice', 'Bob']]
    person = pd.DataFrame(person_data, columns=['personId', 'lastName', 'firstName'])
    address_data = [[1, 2, 'New York City', 'New York'], [2, 3, 'Leetcode', 'California']]
    address = pd.DataFrame(address_data, columns=['addressId', 'personId', 'city', 'state'])

    result = combine_two_tables(person, address)

    expected_data = [['Allen', 'Wang', None, None], ['Bob', 'Alice', 'New York City', 'New York']]
    expected = pd.DataFrame(expected_data, columns=['firstName', 'lastName', 'city', 'state'])
    pd.testing.assert_frame_equal(result, expected)

def test_combine_with_no_address_data():
    person_data = [[1, 'Wang', 'Allen'], [2, 'Alice', 'Bob']]
    person = pd.DataFrame(person_data, columns=['personId', 'lastName', 'firstName'])
    address = pd.DataFrame(columns=['addressId', 'personId', 'city', 'state'])

    result = combine_two_tables(person, address)

    expected_data = [['Allen', 'Wang', None, None], ['Bob', 'Alice', None, None]]
    expected = pd.DataFrame(expected_data, columns=['firstName', 'lastName', 'city', 'state'])
    pd.testing.assert_frame_equal(result, expected)

def test_combine_with_empty_person_data():
    person = pd.DataFrame(columns=['personId', 'lastName', 'firstName'])
    address_data = [[1, 2, 'New York City', 'New York'], [2, 3, 'Leetcode', 'California']]
    address = pd.DataFrame(address_data, columns=['addressId', 'personId', 'city', 'state'])

    result = combine_two_tables(person, address)

    expected = pd.DataFrame(columns=['firstName', 'lastName', 'city', 'state'])
    pd.testing.assert_frame_equal(result, expected)

def test_combine_with_empty_tables():
    person = pd.DataFrame(columns=['personId', 'lastName', 'firstName'])
    address = pd.DataFrame(columns=['addressId', 'personId', 'city', 'state'])

    result = combine_two_tables(person, address)

    expected = pd.DataFrame(columns=['firstName', 'lastName', 'city', 'state'])
    pd.testing.assert_frame_equal(result, expected)
