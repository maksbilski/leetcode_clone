# Custom hook implementation
def pytest_terminal_summary(terminalreporter, exitstatus, config):
    # Getting the statistics
    stats = terminalreporter.stats

    # Counting passed and failed tests
    num_passed = len(stats.get('passed', []))
    num_failed = len(stats.get('failed', []))

    # Calculating total runtime in milliseconds
    total_duration_milliseconds = sum(report.duration for report in stats.get('passed', []) + stats.get('failed', [])) * 1000

    # Print the custom summary
    print(f"\nTests passed: {num_passed}, Tests failed: {num_failed}, Total runtime: {total_duration_milliseconds:.2f} ms")
