const express = require('express')
const router = express.Router()

const {get_exercise_page, run_code} = require('../controllers/exercisePageController')

router.route('/:exercise_id').get(get_exercise_page);
router.route('/:exercise_id/run_code').post(run_code);

module.exports = router