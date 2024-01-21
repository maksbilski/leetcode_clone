const pool = require('../db');

async function fetchSortedStatistics(sortKey) {
  const result = await pool`
    SELECT
      users.name,
      users.user_id,
      COUNT(DISTINCT ex_users.exercise_id) AS total_exercises_attempted,
      COUNT(DISTINCT CASE WHEN ex_users.success = true THEN ex_users.exercise_id END) AS total_exercises_completed,
      ROUND(
        COUNT(DISTINCT CASE WHEN ex_users.done = true AND ex_users.success = true THEN ex_users.exercise_id END) * 100.0 / NULLIF(COUNT(DISTINCT ex_users.exercise_id), 0),
        1
      ) AS success_rate
    FROM
      users
    JOIN
      ex_users ON users.user_id = ex_users.user_id
    GROUP BY
      users.user_id
    ORDER BY ${pool(sortKey)} DESC;
  `;
  return result;
}

const getAndSortStatistics = async (req, res) => {
  console.log(req.session.userId);
  try {
    let key = "total_exercises_completed";
    const validKeys = ["total_exercises_completed", "success_rate"];

    if (req.query.key && validKeys.includes(req.query.key)) {
      key = req.query.key;
    }

    const result = await fetchSortedStatistics(key);

    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAndSortStatistics
};
