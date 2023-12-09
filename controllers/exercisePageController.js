
const pool = require('../db')

const get_exercise_page = async (req, res) => {
	try {
		const exerciseId = req.params.exercise_id;
		const result = await pool.query(`SELECT * FROM exercises WHERE exercise_id = $1`, [exerciseId]);
		res.json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error'});
	}
};

module.exports = {
	get_exercise_page,
}