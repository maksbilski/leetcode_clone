const express = require('express')
const router = express.Router()

const {getExercisePage, runCode, getLike, postLike} = require('../controllers/exercisePageController')

router.route('/:exercise_id').get(getExercisePage);
router.route('/:exercise_id/run_code').post(runCode);
router.route('/:exercise_id/comments').get
router.route('/:exercise_id/get_like').get(getLike);
router.route('/:exercise_id/post_like').post(postLike);

module.exports = router