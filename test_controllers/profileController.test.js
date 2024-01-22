const { getAggregateStats } = require('../controllers/profileController');
const pool = require('../db');
jest.mock('../db'); // Mockowanie pool

describe('ProfileController - getAggregateStats', () => {

  it('should return aggregate stats for user ID from query', async () => {
    // Przygotowanie testowych danych zapytania
    const req = {
      query: { userId: '35' },
      session: {},
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };

    const expectedDbResponse = {
      rows: [
        {
          name: 'karolinazajac',
          private: false,
          iloscRozwiazanychProblemow: 6,
          success_count: 5,
          easy_count: 2,
          medium_count: 3,
          hard_count: 0,
          database_count: 0,
          algorithms_count: 4,
          total_easy: 2,
          total_medium: 3,
          total_hard: 1,
          total_users: 12,
          user_rank: 1,
        },
      ],
    };

    // Mockowanie odpowiedzi z bazy danych
    pool.mockResolvedValue(expectedDbResponse);

    // Wywołanie funkcji
    await getAggregateStats(req, res);

    // Testowanie czy funkcja działa jak oczekiwano
    expect(res.json).toHaveBeenCalled(); // Sprawdzenie, czy funkcja json została wywołana
  });
});