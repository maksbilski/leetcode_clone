
const pool = require('../db')

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

const { exec } = require('child_process');

const run_docker_container = (req, res) => {
	const dockerCommand = 'docker run -d your-docker-image';
	exec(dockerCommand, (error, stdout, stderr) => {
			if (error) {
					console.error(`exec error: ${error}`);
					return res.status(500).json({ error: 'Internal server error' });
			}
			console.log(`stdout: ${stdout}`);
			console.error(`stderr: ${stderr}`);
			res.status(200).json({ message: 'Docker container started' });
	});
};

module.exports = {
    run_docker_container,
};


module.exports = {
	get_exercise_page,
}