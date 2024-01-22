// exercisesController.test.js
const { getExercises, getSortedExercises } = require('../../controllers/exercisesController');
const pool = require('../../db');
jest.mock('../../db');
  

describe('Exercises Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExercises', () => {
    it('should retrieve exercises and send a JSON response', async () => {
      const mockReq = {
        session: {
          userId: 1,
        },
      };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      };
      const mockData = [
		{
		  exercise_id: 3,
		  name: 'Two Sum\n',
		  category: 'Algorithms',
		  difficulty: 'Easy',
		  date_added: new Date('2023-06-11T00:00:00.000Z').toISOString(),
		  done: false,
		  success: false
		},
		{
		  exercise_id: 5,
		  name: 'Add Two Numbers',
		  category: 'Algorithms',
		  difficulty: 'Medium',
		  date_added: new Date('2023-09-28T00:00:00.000Z').toISOString(),
		  done: false,
		  success: false
		},
		{
		  exercise_id: 7,
		  name: 'Median of Two Sorted Arrays',
		  category: 'Algorithms',
		  difficulty: 'Hard',
		  date_added: new Date('2023-05-17T00:00:00.000Z').toISOString(),
		  done: null,
		  success: null
		},
		{
		  exercise_id: 11,
		  name: 'Combine Two Tables',
		  category: 'Pandas',
		  difficulty: 'Easy',
		  date_added: new Date('2024-01-22T00:00:00.000Z').toISOString(),
		  done: null,
		  success: null
		},
		{
		  exercise_id: 9,
		  name: 'Longest Palindromic Substring',
		  category: 'Algorithms',
		  difficulty: 'Medium',
		  date_added: new Date('2023-02-14T00:00:00.000Z').toISOString(),
		  done: null,
		  success: null
		},
		{
		  exercise_id: 1,
		  name: 'Longest Substring Without Repeating Characters\n',
		  category: 'Algorithms',
		  difficulty: 'Medium',
		  date_added: new Date('2023-01-17T00:00:00.000Z').toISOString(),
		  done: null,
		  success: null
		}
	  ];
	pool.mockResolvedValue(mockData);

	await getExercises(mockReq, mockRes);
	expect(mockRes.json).toHaveBeenCalledWith(mockData);

    });

    it('should handle errors and send a 500 status code', async () => {
      const mockReq = {
        session: {
          userId: 1,
        },
      };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const error = new Error('Database error');
      pool.mockRejectedValueOnce(error);

      await getExercises(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});
