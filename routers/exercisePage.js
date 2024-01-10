const express = require('express')
const router = express.Router()

const {getExercisePage, getExerciseComments, addComment, runCode, submitCode, getLike, postLike} = require('../controllers/exercisePageController')

router.route('/:exercise_id').get(getExercisePage);
router.route('/:exercise_id/submit_code').post(submitCode);
router.route('/:exercise_id/run_code').post(runCode);
router.route('/:exercise_id/comments').get(getExerciseComments);
router.route('/:exercise_id/add_comment').post(addComment);
router.route('/:exercise_id/get_like').get(getLike);
router.route('/:exercise_id/post_like').post(postLike);

module.exports = router