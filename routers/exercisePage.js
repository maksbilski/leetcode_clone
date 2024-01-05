const express = require('express')
const router = express.Router()

const {get_exercise_page, get_like, post_like} = require('../controllers/exercisePageController')

router.route('/:exercise_id').get(get_exercise_page);
router.route('/get_like/:exercise_id').get(get_like);
router.route('/post_like/:exercise_id').post(post_like);



module.exports = router