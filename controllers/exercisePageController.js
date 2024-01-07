
const pool = require('../db')
const { exec } = require('child_process')

const get_exercise_page = async (req, res) => {
	try {
		const exerciseId = req.params.exercise_id;
		const result = await pool`
		SELECT * 
		FROM exercises e
		INNER JOIN exercise_content ec ON (e.exercise_id = ec.exercise_id)
		WHERE e.exercise_id = ${exerciseId}`;
		res.json(result[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error'});
	}
};

const run_code = async (req, res) => {
	try {
		const { exerciseId, code } = req.body;
		//dockerinho
		console.log(code);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

module.exports = {
	get_exercise_page,
	run_code
}