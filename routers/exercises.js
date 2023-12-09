const express = require('express')
const router = express.Router()

const {get_exercises, sort_exercises, open_exercise} = require('../controllers/exercisesController')

router.route('/').get(get_exercises);
router.route('/sort').get(sort_exercises);
router.route('/:exercise_id').get(open_exercise);

module.exports = router