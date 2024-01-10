const express = require('express')
const router = express.Router()

const {getExercises, sortExercises} = require('../controllers/exercisesController')

router.route('/').get(getExercises);
router.route('/sort').get(sortExercises);
router.route('/vote/:excerciseId').post()

module.exports = router