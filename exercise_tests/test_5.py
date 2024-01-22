# flake8: noqa
# mypy: ignore-errors

from solution import Solution
import pytest

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def array_to_linked_list(arr):
    head = ListNode(0)
    current = head
    for num in arr:
        current.next = ListNode(num)
        current = current.next
    return head.next

def linked_list_to_array(head):
    arr = []
    while head:
        arr.append(head.val)
        head = head.next
    return arr

def test_add_two_numbers_basic_case():
    solution = Solution()
    l1 = array_to_linked_list([2, 4, 3])
    l2 = array_to_linked_list([5, 6, 4])
    result = solution.addTwoNumbers(l1, l2)
    assert linked_list_to_array(result) == [7, 0, 8]

def test_add_two_numbers_with_zeros():
    solution = Solution()
    l1 = array_to_linked_list([0])
    l2 = array_to_linked_list([0])
    result = solution.addTwoNumbers(l1, l2)
    assert linked_list_to_array(result) == [0]

def test_add_two_numbers_large_numbers():
    solution = Solution()
    l1 = array_to_linked_list([9, 9, 9, 9, 9, 9, 9])
    l2 = array_to_linked_list([9, 9, 9, 9])
    result = solution.addTwoNumbers(l1, l2)
    assert linked_list_to_array(result) == [8, 9, 9, 9, 0, 0, 0, 1]

def test_add_two_numbers_different_lengths():
    solution = Solution()
    l1 = array_to_linked_list([1, 8])
    l2 = array_to_linked_list([0])
    result = solution.addTwoNumbers(l1, l2)
    assert linked_list_to_array(result) == [1, 8]

def test_add_two_numbers_carry_over():
    solution = Solution()
    l1 = array_to_linked_list([9, 9])
    l2 = array_to_linked_list([1])
    result = solution.addTwoNumbers(l1, l2)
    assert linked_list_to_array(result) == [0, 0, 1]

def test_add_two_numbers_single_digit():
    solution = Solution()
    l1 = array_to_linked_list([5])
    l2 = array_to_linked_list([5])
    result = solution.addTwoNumbers(l1, l2)
    assert linked_list_to_array(result) == [0, 1]
