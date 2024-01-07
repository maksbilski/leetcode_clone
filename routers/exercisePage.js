const express = require('express')
const router = express.Router()

const {get_exercise_page, submit_code} = require('../controllers/exercisePageController')

router.route('/:exercise_id').get(get_exercise_page);
router.route('/:exercise_id/submit').post(submit_code);

module.exports = router