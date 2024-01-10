const pool = require('../db');

const sort_statistics = async (req, res) => {
  console.log(req.session.userId);
  try {
    const validKeys = ["total_exercises_completed", "success_rate", "average_percentile"];
    const { key } = req.query;
    if (!validKeys.includes(key)) {
      return res.status(400).json({ error: 'Invalid sort key' });
    }
    const result = await pool`
      WITH UserExercisePercentiles AS (
        SELECT
          ex_users.user_id,
          ex_users.exercise_id,
          ROUND(PERCENT_RANK() OVER (PARTITION BY ex_users.exercise_id ORDER BY ex_users.run_time) * 100) AS exercise_percentile
        FROM
          ex_users
        WHERE
          ex_users.success = true
      )
      SELECT
        users.name,
        users.user_id,
        COUNT(ex_users.exercise_id) AS total_exercises_attempted,
        COUNT(CASE WHEN ex_users.success = true THEN 1 END) AS total_exercises_completed,
        ROUND(COUNT(CASE WHEN ex_users.done = true AND ex_users.success = true THEN 1 END) * 100.0 / COUNT(ex_users.exercise_id), 1) AS success_rate,
        CONCAT(ROUND(100 - AVG(UserExercisePercentiles.exercise_percentile)), '%') AS average_percentile

      FROM
        users
      JOIN
        ex_users ON users.user_id = ex_users.user_id
      LEFT JOIN
        UserExercisePercentiles ON users.user_id = UserExercisePercentiles.user_id
      GROUP BY
        users.user_id
      ORDER BY ${pool(key)} DESC;`;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const get_statistics = async (req, res) => {
  try {
    const result = await pool`
      WITH UserExercisePercentiles AS (
        SELECT
          ex_users.user_id,
          ex_users.exercise_id,
          ROUND(PERCENT_RANK() OVER (PARTITION BY ex_users.exercise_id ORDER BY ex_users.run_time) * 100) AS exercise_percentile
        FROM
          ex_users
        WHERE
          ex_users.success = true
      )
      SELECT
        users.user_id,
        users.name,
        COUNT(ex_users.exercise_id) AS total_exercises_attempted,
        COUNT(CASE WHEN ex_users.success = true THEN 1 END) AS total_exercises_completed,
        ROUND(COUNT(CASE WHEN ex_users.done = true AND ex_users.success = true THEN 1 END) * 100.0 / COUNT(ex_users.exercise_id), 1) AS success_rate,
        CONCAT(ROUND(100 - AVG(UserExercisePercentiles.exercise_percentile)), '%') AS average_percentile

      FROM
        users
      JOIN
        ex_users ON users.user_id = ex_users.user_id
      LEFT JOIN
        UserExercisePercentiles ON users.user_id = UserExercisePercentiles.user_id
      GROUP BY
        users.user_id
      ORDER BY
        total_exercises_completed DESC;`;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  get_statistics,
  sort_statistics
};