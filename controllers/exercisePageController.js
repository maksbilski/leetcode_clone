
const pool = require('../db')
const { exec } = require('child_process')
const fs = require('fs/promises')
const os = require('os')
const path = require('path')

const getExercisePage = async (req, res) => {
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

const runCode = async (req, res) => {
	try {
		const userId = req.session.userId;
		const { exerciseId, code } = req.body;
		const relativePath = `../tests/${exerciseId}.py`
		const filePath = getAbsolutePath(relativePath)
		const programPath = await createTemporaryFile(code, exerciseId, userId);
		const result = await runDockerContainer(filePath, programPath);
		res.json({
			message: 'Code executed',
			output: result.stdout,
			errorOutput: result.stderr
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}


function getAbsolutePath(relativePath) {
	return path.resolve(__dirname, relativePath);
}


async function createTemporaryFile(code, exerciseId, userId) {
	const tempDir = os.tmpdir();
	const fileName = `user-${userId}_exercise-${exerciseId}_${Date.now()}.py`;
	const filePath = path.join(tempDir, fileName);
	await fs.writeFile(filePath, code, 'utf8');
	return filePath;
}


function runDockerContainer(testPath, programPath) {
	return new Promise((resolve, reject) => {
		const command = `docker run -v "${programPath}:/app/solution.py" -v "${testPath}:/app/test.py" test-container`

		exec(command, async (error, stdout, stderr) => {
			try {
				await fs.unlink(programPath);
			} catch (err) {
				console.error("Deleting temp file not successful:", err);
			}

			if (error) {
				console.error("Docker command failed:", command);
				console.error("Error:", error);
				console.error("Stderr:", stderr);
				reject({ error: error.message, stderr });
			} else {
				resolve({ stdout, stderr });
			}
		});
	});
}

module.exports = {
	getExercisePage,
	runCode
}