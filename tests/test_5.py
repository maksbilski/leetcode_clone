# flake8: noqa
# mypy: ignore-errors

from solution import Solution
import pytest

def test_dijkstra_simple_graph():
    solution = Solution()
    graph = {
        'A': {'B': 1, 'C': 4},
        'B': {'A': 1, 'C': 2, 'D': 5},
        'C': {'A': 4, 'B': 2, 'D': 1},
        'D': {'B': 5, 'C': 1}
    }
    assert solution.dijkstra(graph, 'A') == {'A': 0, 'B': 1, 'C': 3, 'D': 4}

def test_dijkstra_multiple_paths():
    solution = Solution()
    graph = {
        'A': {'B': 2, 'C': 5},
        'B': {'A': 2, 'C': 3, 'D': 4},
        'C': {'A': 5, 'B': 3, 'D': 1},
        'D': {'B': 4, 'C': 1}
    }
    assert solution.dijkstra(graph, 'A') == {'A': 0, 'B': 2, 'C': 5, 'D': 6}

def test_dijkstra_single_node():
    solution = Solution()
    graph = {'A': {}}
    assert solution.dijkstra(graph, 'A') == {'A': 0}

def test_dijkstra_unconnected_nodes():
    solution = Solution()
    graph = {
        'A': {'B': 1},
        'B': {'A': 1},
        'C': {}
    }
    assert solution.dijkstra(graph, 'A') == {'A': 0, 'B': 1, 'C': float('infinity')}

def test_dijkstra_large_graph():
    solution = Solution()
    graph = {str(i): {str(i + 1): 1} for i in range(1, 100)}
    graph['100'] = {}
    result = solution.dijkstra(graph, '1')
    expected = {str(i): i - 1 for i in range(1, 101)}
    assert result == expected

def test_dijkstra_one_path_graph():
    solution = Solution()
    graph = {
        'A': {'B': 3},
        'B': {'C': 4},
        'C': {}
    }
    assert solution.dijkstra(graph, 'A') == {'A': 0, 'B': 3, 'C': 7}
