const pool = require('../db')

const sort_statistics = async (req, res) => {
    try {
  
      const {key} = req.query;
      const result = await pool.query(`
      SELECT 
          users.name,
          COUNT(ex_users.exercise_id) AS total_exercises_attempted,
          COUNT(CASE WHEN ex_users.success = true THEN 1 END) AS total_exercises_completed,
          ROUND(COUNT(CASE WHEN ex_users.done = true AND ex_users.success = true THEN 1 END) * 100.0 / COUNT(ex_users.exercise_id), 1) AS success_rate
         FROM 
          users
         JOIN 
          ex_users ON users.user_id = ex_users.user_id
         GROUP BY 
          users.name
        order by ${key} DESC;`);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
   };
  
   const get_statistics = async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT 
          users.name,
          COUNT(ex_users.exercise_id) AS total_exercises_attempted,
          COUNT(CASE WHEN ex_users.success = true THEN 1 END) AS total_exercises_completed,
          ROUND(COUNT(CASE WHEN ex_users.done = true AND ex_users.success = true THEN 1 END) * 100.0 / COUNT(ex_users.exercise_id), 1) AS success_rate
         FROM 
          users
         JOIN 
          ex_users ON users.user_id = ex_users.user_id
         GROUP BY 
          users.name
        order by total_exercises_completed DESC;`);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
   }

   module.exports = {
    get_statistics, 
    sort_statistics};