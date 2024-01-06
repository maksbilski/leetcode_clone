const pool = require('../db');

const get_calendar = async (req, res) => {
    const userId = req.session.userId
    console.log('calendar')
    try {
        const result = await pool`
        SELECT DISTINCT TO_CHAR(submission_date, 'YYYY-MM-DD') AS formatted_date
        FROM submissions_history
        WHERE user_id = 1`;
            console.log(result);
            res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

}
const get_history = async (req, res) => {
    const userId = req.session.userId
    try {
      const result = await pool`
      SELECT 
        e.name AS exercise_name,
        sh.submission_date,
        sh.success
        FROM 
            submissions_history sh
        JOIN 
            exercises e ON sh.exercise_id = e.exercise_id
        WHERE 
            sh.user_id = 1  -- Zastąp {user_id} identyfikatorem konkretnego użytkownika
        ORDER BY 
            sh.submission_date DESC
        LIMIT 10;`;
          //console.log(result[0]);
          res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
   }



const get_aggregate_stats = async (req, res) => {
    const userId = req.session.userId
    try {
      const result = await pool`
      SELECT 
        u.name as name,
        COUNT(eu.exercise_id) AS iloscRozwiazanychProblemow,
        SUM(CASE WHEN eu.success = true THEN 1 ELSE 0 END) AS success_count,
        SUM(CASE WHEN (e.difficulty = 'Easy') AND (eu.success = true) THEN 1 ELSE 0 END) AS easy_count,
        SUM(CASE WHEN e.difficulty = 'Medium'AND (eu.success = true) THEN 1 ELSE 0 END) AS medium_count,
        SUM(CASE WHEN e.difficulty = 'Hard' AND (eu.success = true) THEN 1 ELSE 0 END) AS hard_count,
        SUM(CASE WHEN e.category = 'Database' AND (eu.success = true) THEN 1 ELSE 0 END) AS database_count,
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
      LEFT JOIN 
          ex_users eu ON u.user_id = eu.user_id
      LEFT JOIN 
          exercises e ON eu.exercise_id = e.exercise_id
      WHERE 
          u.user_id = 1 -- Tutaj podstawiasz identyfikator użytkownika
      GROUP BY 
          u.user_id;`;
          //console.log(result[0]);
          res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
   }

module.exports = {
    get_aggregate_stats,
    get_history,
    get_calendar,
}