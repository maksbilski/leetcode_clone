
const pool = require('../db')

const get_exercise_page = async (req, res) => {
	console.log(req.session.userid)
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

const post_like = async(req, res) => {

	console.log('dsad');
	try {
		const userId = req.session.userId;
		const exerciseId = req.params.exercise_id;
		const vote = req.body.vote;
		console.log(userId);
		console.log(exerciseId);
		console.log(vote);
		const insert = await pool`INSERT INTO ex_users (user_id, exercise_id, vote)
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
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error'});
	}
};

const get_like = async (req, res) => {
	
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
		res.status(500).json({ error: 'Internal server error'});
	}
};

module.exports = {
	get_exercise_page,
	post_like,
	get_like,
}