const pool = require('../db');

const getExercises = async (req, res) => {
  console.log('sacxz');
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

const sortExercises = async (req, res) => {
  try {
    const validKeys = ["exercise_id", "name", "category", "difficulty"];
    const { key } = req.query;
    if (!validKeys.includes(key)) {
      return res.status(400).json({ error: 'Invalid sort key' });
    }
    const result = await pool`
      SELECT * 
      FROM exercises 
      ORDER BY ${pool(key)};`;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getExercises,
  sortExercises,
};