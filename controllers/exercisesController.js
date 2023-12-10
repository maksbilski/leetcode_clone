
const pool = require('../db')

const get_exercises = async (req, res) => {
    console.log('sacxz')
    try {
      const result = await pool.query('SELECT * FROM exercises');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
   
const sort_exercises = async (req, res) => {
    try {
      const sortKey = req.query.key;
      const result = await pool.query(`SELECT * FROM exercises ORDER BY ${sortKey}`);
      res.json(result.rows);
     } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
     }
};


module.exports = {
    get_exercises,
    sort_exercises,
}