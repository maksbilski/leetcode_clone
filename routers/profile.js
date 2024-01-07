const express = require('express');
const router = express.Router();
const {get_aggregate_stats, get_calendar, get_history, toggle_state} = require('../controllers/profileController')

router.route('/aggregate').get(get_aggregate_stats);
router.route('/calendar').get(get_calendar);
router.route('/history').get(get_history);
router.route('/toggleState').post(toggle_state);


module.exports = router