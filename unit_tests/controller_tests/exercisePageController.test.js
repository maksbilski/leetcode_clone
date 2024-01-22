// exercisesController.test.js
const {
  getExercisePage,
  postLike,
  getLike,
  getExerciseComments
} = require('../../controllers/exercisePageController.js');
const pool = require('../../db');
jest.mock('../../db');

describe('Exercises Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExercisePage', () => {
    it('should retrieve exercise details and send a JSON response', async () => {
      const mockReq = {
        params: {
          exercise_id: 1,
        },
      };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };
      const mockData =   {
        exercise_id: 1,
        name: 'Longest Substring Without Repeating Characters\n',
        category: 'Algorithms',
        difficulty: 'Medium',
        date_added:  new Date('2023-01-17T00:00:00.000Z').toISOString(),
        content: '<p>Given a string <code>s</code>, find the length of the <strong>longest substring </strong> without repeating characters.</p>\n' +
          '\n' +
          '<p>&nbsp;</p>\n' +
          '<p><strong class="example">Example 1:</strong></p>\n' +
          '\n' +
          '<pre><strong>Input:</strong> s = "abcabcbb"\n' +
          '<strong>Output:</strong> 3\n' +
          '<strong>Explanation:</strong> The answer is "abc", with the length of 3.\n' +
          '</pre>\n' +
          '\n' +
          '<p><strong class="example">Example 2:</strong></p>\n' +
          '\n' +
          '<pre><strong>Input:</strong> s = "bbbbb"\n' +
          '<strong>Output:</strong> 1\n' +
          '<strong>Explanation:</strong> The answer is "b", with the length of 1.\n' +
          '</pre>\n' +
          '\n' +
          '<p><strong class="example">Example 3:</strong></p>\n' +
          '\n' +
          '<pre><strong>Input:</strong> s = "pwwkew"\n' +
          '<strong>Output:</strong> 3\n' +
          '<strong>Explanation:</strong> The answer is "wke", with the length of 3.\n' +
          'Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.\n' +
          '</pre>\n' +
          '\n' +
          '<p>&nbsp;</p>\n' +
          '<p><strong>Constraints:</strong></p>\n' +
          '\n' +
          '<ul>\n' +
          '\t<li><code>0 &lt;= s.length &lt;= 5 * 10<sup>4</sup></code></li>\n' +
          '\t<li><code>s</code> consists of English letters, digits, symbols and spaces.</li>\n' +
          '</ul>\n',
        solution_draft: 'class Solution:\n' +
          '\tdef lengthOfLongestSubstring(self, s: str) -> int:\n' +
          '\t\tpass\n'
      };
      pool.mockResolvedValue([mockData]);

      await getExercisePage(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });

  });
});
