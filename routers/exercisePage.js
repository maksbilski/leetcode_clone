const express = require('express')
const router = express.Router()

const {get_exercise_page} = require('../controllers/exercisePageController')

router.route('/:exercise_id').get(get_exercise_page);

module.exports = router