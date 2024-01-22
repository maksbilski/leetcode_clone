const express = require('express')
const router = express.Router()

const {getExercises, getSortedExercises} = require('../controllers/exercisesController')

router.route('/').get(getExercises);
router.route('/sort').get(getSortedExercises);
router.route('/vote/:excerciseId').post()

module.exports = router