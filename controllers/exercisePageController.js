
const pool = require('../db')
const { exec } = require('child_process')
const fs = require('fs/promises')
const os = require('os')
const path = require('path')

const getExercisePage = async (req, res) => {
  console.log(req.session.userid);
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

const postLike = async (req, res) => {
  console.log('dsad');
  try {
    const userId = req.session.userId;
    const exerciseId = req.params.exercise_id;
    const vote = req.body.vote;
    console.log(userId);
    console.log(exerciseId);
    console.log(vote);
    const insert = await pool
      `INSERT INTO ex_users (user_id, exercise_id, vote)
      VALUES (${userId}, ${exerciseId}, ${vote})
      ON CONFLICT (user_id, exercise_id) DO UPDATE
      SET vote = ${vote};`;

    const result = await pool`
      SELECT
        SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END) AS likes,
        SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END) AS dislikes
      FROM ex_users
      GROUP BY EXERCISE_ID
      HAVING EXERCISE_ID = ${exerciseId};`;
    console.log(result[0]);
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getLike = async (req, res) => {
  console.log('sadsadasdsc x');
  try {
    const exerciseId = req.params.exercise_id;
    const result = await pool`
      SELECT
        SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END) AS likes,
        SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END) AS dislikes
      FROM ex_users
      GROUP BY EXERCISE_ID
      HAVING EXERCISE_ID = ${exerciseId};`;
    console.log(result[0]);
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getExerciseComments = async (req, res) => {
	try {
		const exerciseId = req.params.exercise_id;
		const result = await pool`
		SELECT *
		FROM comments
		WHERE exercise_id = ${exerciseId}`;
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error'});
	}
}


const runCode = async (req, res) => {
  try {
    const userId = req.session.userId;
		const { exerciseId, code } = req.body;
		const result = await executeCode(userId, exerciseId, code);
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

const executeCode = async (userId, exerciseId, code) => {
  const relativePath = `../tests/test_${exerciseId}.py`
  const filePath = getAbsolutePath(relativePath)
  const programPath = await createTemporaryFile(code, exerciseId, userId);
  const result = await runDockerContainer(filePath, programPath);
  return result;
}

const submitCode = async (req, res) => {
	try {
		const userId = req.session.userId;
		const { exerciseId, code } = req.body;
		const result = await executeCode(userId, exerciseId, code);
    const output = result.stdout;
    const regex = /Total runtime: (\d+\.\d+)/;
    const match = output.match(regex);
    const runTime = parseFloat(match[1]);
    console.log(runTime);
    console.log(exerciseId);
    console.log(userId);
    console.log(!result.error);
    const insert = await pool
    `INSERT INTO ex_users (user_id, exercise_id, run_time, done, success)
    VALUES (${userId}, ${exerciseId}, ${runTime}, ${true}, ${!result.error})
    ON CONFLICT (user_id, exercise_id) DO UPDATE
    SET run_time = ${runTime}, done = ${true}, success = ${!result.error};`;
    const countOfWorseSolutions = await pool
    `
    SELECT COUNT(exercise_id) AS count
    FROM ex_users
    WHERE run_time > ${runTime} AND exercise_id = ${exerciseId} AND success = ${true};
    `;
    const countOfSolutions = await pool
    `
    SELECT COUNT(exercise_id) AS count
    FROM ex_users
    WHERE exercise_id = ${exerciseId} AND success = ${true};
    `;
    console.log(countOfWorseSolutions[0].count);
    console.log(countOfSolutions[0].count);
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
	return new Promise((resolve) => {
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
			}
			resolve({ stdout, stderr, error });
		});
	});
}

module.exports = {
	getExercisePage,
	getExerciseComments,
  submitCode,
	runCode,
  postLike,
  getLike,
};
