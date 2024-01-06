const pool = require('../db');

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
		SUM(CASE WHEN e.category = 'Algorithms' AND (eu.success = true) THEN 1 ELSE 0 END) AS algorithms_count
      -- Dodaj kolejne kategorie w podobny sposób, jeśli są potrzebne
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
          console.log(result[0]);
          res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
   }

module.exports = {
    get_aggregate_stats,
}