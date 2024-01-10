const express = require('express');
const router = express.Router();
const {getAggregateStats, getCalendar, getHistory, toggleState} = require('../controllers/profileController')

router.route('/aggregate').get(getAggregateStats);
router.route('/calendar').get(getCalendar);
router.route('/history').get(getHistory);
router.route('/toggleState').post(toggleState);

module.exports = router