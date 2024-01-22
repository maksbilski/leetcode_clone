const pool = require('../db');

/**
 * Retrieves a list of all exercises along with the user's progress on each exercise.
 *
 * @param {object} req - The request object containing user session information.
 * @param {object} res - The response object for sending back exercise data.
 */
const getExercises = async (req, res) => {
  const userId = req.session.userId
  try {
    const result = await pool`
    SELECT e.exercise_id, e.name, e.category, e.difficulty, e.date_added, exu.done, exu.success
    FROM exercises e
    LEFT JOIN ex_users exu ON (e.exercise_id = exu.exercise_id AND exu.user_id = ${userId})
    `;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Retrieves a sorted list of all exercises based on a specified sort key.
 * The sorting is done based on the column name provided in the query parameter.
 *
 * @param {object} req - The request object containing user session information and query parameters.
 * @param {object} res - The response object for sending back sorted exercise data.
 */
const getSortedExercises = async (req, res) => {
  const userId = req.session.userId;
  try {
    const validKeys = ["exercise_id", "name", "category", "difficulty"];
    const { key } = req.query;
    if (!validKeys.includes(key)) {
      return res.status(400).json({ error: 'Invalid sort key' });
    }
    const result = await pool`
    SELECT e.exercise_id, e.name, e.category, e.difficulty, e.date_added, exu.done, exu.success
    FROM exercises e
    LEFT JOIN ex_users exu ON (e.exercise_id = exu.exercise_id AND exu.user_id = ${userId})
    ORDER BY ${pool(key)}
    `;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getExercises,
  getSortedExercises,
};