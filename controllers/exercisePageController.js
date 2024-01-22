
const pool = require('../db')
const { exec } = require('child_process')
const fs = require('fs/promises')
const os = require('os')
const path = require('path')


/**
 * Fetches details of a specific exercise including its content.
 *
 * @param {object} req - The request object containing parameters.
 * @param {object} res - The response object for sending back data.
 */
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
    res.status(500).json({ error: 'Internal server error' });
  }
};


/**
 * Records a like or dislike vote for an exercise and returns updated counts.
 *
 * @param {object} req - The request object containing user data and vote.
 * @param {object} res - The response object for sending back updated counts.
 */
const postLike = async (req, res) => {
  try {
    const userId = req.session.userId;
    const exerciseId = req.params.exercise_id;
    const vote = req.body.vote;

    const insert = await pool
      `INSERT INTO ex_users (user_id, exercise_id, done, success, run_time, vote)
      VALUES (${userId}, ${exerciseId}, false, false, 0, ${vote})
      ON CONFLICT (user_id, exercise_id) DO UPDATE
      SET vote = ${vote};`;

    const result = await pool`
      SELECT
        SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END) AS likes,
        SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END) AS dislikes
      FROM ex_users
      GROUP BY EXERCISE_ID
      HAVING EXERCISE_ID = ${exerciseId};`;
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/**
 * Retrieves the current like and dislike counts for a specific exercise.
 *
 * @param {object} req - The request object containing exercise ID.
 * @param {object} res - The response object for sending back counts.
 */
const getLike = async (req, res) => {
  try {
    const exerciseId = req.params.exercise_id;
    const result = await pool`
      SELECT
        COALESCE(SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END), 0) AS likes,
        COALESCE(SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END), 0) AS dislikes
      FROM ex_users
      WHERE EXERCISE_ID = ${exerciseId};`;
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/**
 * Fetches the latest comments for a specific exercise.
 *
 * @param {object} req - The request object containing exercise ID.
 * @param {object} res - The response object for sending back comments.
 */
const getExerciseComments = async (req, res) => {
	try {
		const exerciseId = req.params.exercise_id;
		const result = await pool`
		SELECT *
		FROM comments c
    JOIN users u ON (c.user_id = u.user_id)
		WHERE c.exercise_id = ${exerciseId}
    ORDER BY c.comment_date DESC
    FETCH FIRST 5 ROWS ONLY`;
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error'});
	}
}


/**
 * Adds a new comment to a specific exercise.
 *
 * @param {object} req - The request object containing user data and comment content.
 * @param {object} res - The response object for sending back updated comments.
 */
const addComment = async (req, res) => {
  try {
    const exerciseId = req.params.exercise_id;
    const userId = req.session.userId;
    const { commentContent } = req.body;
    const insertComment = await pool`
    INSERT INTO comments(exercise_id, user_id, comment_date, comment_content)
    VALUES(${exerciseId}, ${userId}, NOW(), ${commentContent});
    `;

    const result = await pool`
		SELECT *
		FROM comments c
    JOIN users u ON (c.user_id = u.user_id)
		WHERE c.exercise_id = ${exerciseId}
    ORDER BY c.comment_date DESC
    FETCH FIRST 5 ROWS ONLY`;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error'});
  }
}


/**
 * Executes submitted code for an exercise and returns the execution result.
 *
 * @param {number} userId - The ID of the user submitting the code.
 * @param {number} exerciseId - The ID of the exercise.
 * @param {string} code - The submitted code.
 * @returns {Promise<object>} - The result of code execution.
 */
const executeCode = async (userId, exerciseId, code) => {
  const relativePath = `../exercise_tests/test_${exerciseId}.py`
  const filePath = getAbsolutePath(relativePath)
  const programPath = await createTemporaryFile(code, exerciseId, userId);
  const result = await runDockerContainer(filePath, programPath);
  return result;
}


/**
 * Endpoint handler for running submitted code.
 *
 * @param {object} req - The request object containing user data and code.
 * @param {object} res - The response object for sending back execution result.
 */
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


/**
 * Calculates the percentage of solutions worse than the current submission.
 *
 * @param {number} exerciseId - The ID of the exercise.
 * @param {number} runTime - The runtime of the current submission.
 * @returns {Promise<number>} - The percentage of worse solutions.
 */
async function calculatePercentageOfWorseSolutions(exerciseId, runTime) {
  const countOfWorseSolutions = await pool`
    SELECT COUNT(exercise_id) AS count
    FROM ex_users
    WHERE run_time > ${runTime} AND exercise_id = ${exerciseId} AND success = true;
  `;

  const countOfSolutions = await pool`
    SELECT COUNT(exercise_id) AS count
    FROM ex_users
    WHERE exercise_id = ${exerciseId} AND success = true;
  `;

  if (countOfSolutions[0].count === 0) return 0;
  return (countOfWorseSolutions[0].count / countOfSolutions[0].count) * 100;
}


/**
 * Inserts or updates a user's submission record in 'ex_users' table.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} exerciseId - The ID of the exercise.
 * @param {number} runTime - The runtime of the submission.
 * @param {object} result - The result of the submission.
 */
async function insertToExUser(userId, exerciseId, runTime, result) {
  await pool`
    INSERT INTO ex_users (user_id, exercise_id, run_time, done, success)
    VALUES (${userId}, ${exerciseId}, ${runTime}, true, ${!result.error})
    ON CONFLICT (user_id, exercise_id) DO UPDATE
    SET run_time = ${runTime}, done = true, success = ${!result.error};
  `;
}


/**
 * Inserts a record of a submission into the 'submissions_history' table.
 *
 * @param {number} exerciseId - The ID of the exercise.
 * @param {number} userId - The ID of the user.
 * @param {object} result - The result of the submission.
 */
async function insertSubmissionHistory(exerciseId, userId, result) {
  await pool`
    INSERT INTO submissions_history (exercise_id, user_id, submission_date, success)
    VALUES (${exerciseId}, ${userId}, NOW(), ${!result.error});
  `;
}


/**
 * Submits user's code for an exercise and processes the result.
 *
 * @param {object} req - The request object containing user data and code.
 * @param {object} res - The response object for sending back submission results.
 */
const submitCode = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { exerciseId, code } = req.body;
    const result = await executeCode(userId, exerciseId, code);
    const output = result.stdout;
    const regex = /Total runtime: (\d+\.\d+)/;
    const match = output.match(regex);
    const runTime = parseFloat(match[1]);

    await insertToExUser(userId, exerciseId, runTime, result);
    await insertSubmissionHistory(exerciseId, userId, result);
    const percentageOfWorseSolutions = await calculatePercentageOfWorseSolutions(exerciseId, runTime);

    res.json({
      message: 'Code executed',
      isSuccessfulSubmition: !result.error,
      output: result.stdout,
      errorOutput: result.stderr,
      percentageOfWorseSolutions: percentageOfWorseSolutions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


/**
 * Gets the absolute path for a given relative path.
 *
 * @param {string} relativePath - The relative path.
 * @returns {string} - The absolute path.
 */
function getAbsolutePath(relativePath) {
	return path.resolve(__dirname, relativePath);
}


/**
 * Creates a temporary file with the submitted code.
 *
 * @param {string} code - The submitted code.
 * @param {number} exerciseId - The ID of the exercise.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<string>} - The path to the temporary file.
 */
async function createTemporaryFile(code, exerciseId, userId) {
	const tempDir = os.tmpdir();
	const fileName = `user-${userId}_exercise-${exerciseId}_${Date.now()}.py`;
	const filePath = path.join(tempDir, fileName);
	await fs.writeFile(filePath, code, 'utf8');
	return filePath;
}


/**
 * Runs a Docker container to execute the submitted code.
 *
 * @param {string} testPath - The path to the test file.
 * @param {string} programPath - The path to the program file.
 * @returns {Promise<object>} - The result of the Docker execution.
 */
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
  addComment,
  submitCode,
	runCode,
  postLike,
  getLike,
  postLike,
  getLike,
};
