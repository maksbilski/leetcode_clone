const pool = require('../db');

/**
 * Toggles the 'private' state of a user's profile.
 * Users can only toggle their own profile's state.
 *
 * @param {object} req - The request object containing the user ID from the body and session.
 * @param {object} res - The response object for sending back the update result.
 */
const toggleState = async (req, res) => {
  try {
    const userIdFromBody = req.body.user_id;
    const userIdFromSession = req.session.userId;

    if (userIdFromBody !== userIdFromSession && userIdFromBody) {
      return res.status(403).json({ error: 'Not sufficient privileges' });
    }

    const result = await pool`
      UPDATE users
      SET private = NOT private
      WHERE user_id = ${userIdFromSession}`;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/**
 * Retrieves a calendar of submission dates for a specific user.
 * If a user ID is provided in the query, it uses that ID; otherwise, it uses the session user ID.
 *
 * @param {object} req - The request object containing optional query parameters and session information.
 * @param {object} res - The response object for sending back the calendar data.
 */
const getCalendar = async (req, res) => {
  let userId;

  if (req.query.userId) {
    userId = req.query.userId;
  } else {
    userId = req.session.userId;
  }

  try {
    const result = await pool`
      SELECT DISTINCT TO_CHAR(submission_date, 'YYYY-MM-DD') AS formatted_date
      FROM submissions_history
      WHERE user_id = ${userId}`;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/**
 * Retrieves the submission history for a specific user, limited to the latest 10 submissions.
 * If a user ID is provided in the query, it uses that ID; otherwise, it uses the session user ID.
 *
 * @param {object} req - The request object containing optional query parameters and session information.
 * @param {object} res - The response object for sending back the history data.
 */
const getHistory = async (req, res) => {
  let userId;

  if (req.query.userId) {
    userId = req.query.userId;
  } else {
    userId = req.session.userId;
  }
  console.log(userId);

  try {
    const result = await pool`
      SELECT
        e.name AS exercise_name,
        sh.submission_date,
        sh.success
      FROM
        submissions_history sh
        JOIN exercises e ON sh.exercise_id = e.exercise_id
      WHERE
        sh.user_id = ${userId}
      ORDER BY
        sh.submission_date DESC
      LIMIT 10;`;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/**
 * Fetches aggregate statistics for a specific user, including counts of successful submissions
 * by difficulty and category, as well as the user's rank among all users.
 *
 * @param {object} req - The request object containing optional query parameters and session information.
 * @param {object} res - The response object for sending back aggregate statistics.
 */
const getAggregateStats = async (req, res) => {
  let userId;

  if (req.query.userId) {
    userId = req.query.userId;
  } else {
    userId = req.session.userId;
  }

  try {
    const result = await pool`
      SELECT
        u.name as name,
        u.private as private,
        COUNT(eu.exercise_id) AS iloscRozwiazanychProblemow,
        SUM(CASE WHEN eu.success = true THEN 1 ELSE 0 END) AS success_count,
        SUM(CASE WHEN (e.difficulty = 'Easy') AND (eu.success = true) THEN 1 ELSE 0 END) AS easy_count,
        SUM(CASE WHEN e.difficulty = 'Medium'AND (eu.success = true) THEN 1 ELSE 0 END) AS medium_count,
        SUM(CASE WHEN e.difficulty = 'Hard' AND (eu.success = true) THEN 1 ELSE 0 END) AS hard_count,
        SUM(CASE WHEN e.category = 'Pandas' AND (eu.success = true) THEN 1 ELSE 0 END) AS pandas_count,
        SUM(CASE WHEN e.category = 'Algorithms' AND (eu.success = true) THEN 1 ELSE 0 END) AS algorithms_count,
        (SELECT COUNT(*) FROM exercises WHERE difficulty = 'Easy') AS total_easy,
        (SELECT COUNT(*) FROM exercises WHERE difficulty = 'Medium') AS total_medium,
        (SELECT COUNT(*) FROM exercises WHERE difficulty = 'Hard') AS total_hard,
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT RANK FROM
          (SELECT user_id, RANK() OVER (ORDER BY COUNT(exercise_id) DESC) AS rank
          FROM ex_users WHERE success = true GROUP BY user_id) AS ranking
        WHERE user_id = u.user_id) AS user_rank
      FROM
        users u
        LEFT JOIN ex_users eu ON u.user_id = eu.user_id
        LEFT JOIN exercises e ON eu.exercise_id = e.exercise_id
      WHERE
        u.user_id = ${userId}
      GROUP BY
        u.user_id;`;
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAggregateStats,
  getHistory,
  getCalendar,
  toggleState,
};
