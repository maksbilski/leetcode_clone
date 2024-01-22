const { getExercisePage, postLike, getLike, getExerciseComments } = require('../controllers/exercisePageController');
const pool = require('../db');
jest.mock('../db'); // Mockowanie pool

describe('ExerciseController - getExercisePage', () => {
  it('should return exercise page data', async () => {
    // Przygotowanie testowych danych zapytania
    const req = {
      params: { exercise_id: '1' },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };

    const expectedDbResponse = [
      {
        exercise_id: 1,
        // inne dane ćwiczenia
      },
    ];

    // Mockowanie odpowiedzi z bazy danych
    pool.mockResolvedValue(expectedDbResponse);

    // Wywołanie funkcji
    await getExercisePage(req, res);

    // Testowanie czy funkcja działa jak oczekiwano
    expect(res.json).toHaveBeenCalled();
  });
});

describe('ExerciseController - postLike', () => {
  it('should update and return exercise likes and dislikes', async () => {
    // Przygotowanie testowych danych zapytania
    const req = {
      session: { userId: '1' },
      params: { exercise_id: '1' },
      body: { vote: 1 }, // Like
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };

    const expectedDbResponse = [
      {
        likes: 5,
        dislikes: 2,
      },
    ];

    // Mockowanie odpowiedzi z bazy danych
    pool.mockResolvedValue(expectedDbResponse);

    // Wywołanie funkcji
    await postLike(req, res);

    // Testowanie czy funkcja działa jak oczekiwano
    expect(res.json).toHaveBeenCalled();
  });
});

describe('ExerciseController - getLike', () => {
  it('should return exercise likes and dislikes', async () => {
    // Przygotowanie testowych danych zapytania
    const req = {
      params: { exercise_id: '1' },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };

    const expectedDbResponse = [
      {
        likes: 5,
        dislikes: 2,
      },
    ];

    // Mockowanie odpowiedzi z bazy danych
    pool.mockResolvedValue(expectedDbResponse);

    // Wywołanie funkcji
    await getLike(req, res);

    // Testowanie czy funkcja działa jak oczekiwano
    expect(res.json).toHaveBeenCalledWith(expectedDbResponse[0]);
  });
});

describe('ExerciseController - getExerciseComments', () => {
  it('should return exercise comments', async () => {
    // Przygotowanie testowych danych zapytania
    const req = {
      params: { exercise_id: '1' },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };

    const expectedDbResponse = [
      {
        // dane komentarza
      },
    ];

    // Mockowanie odpowiedzi z bazy danych
    pool.mockResolvedValue(expectedDbResponse);

    // Wywołanie funkcji
    await getExerciseComments(req, res);

    // Testowanie czy funkcja działa jak oczekiwano
    expect(res.json).toHaveBeenCalled();
  });
});
