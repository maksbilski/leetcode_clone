const express = require('express')
const router = express.Router()

const {get_exercises, sort_exercises} = require('../controllers/exercisesController')

router.route('/').get(get_exercises);
router.route('/sort').get(sort_exercises);
router.route('/vote/:excerciseId').post()

module.exports = router