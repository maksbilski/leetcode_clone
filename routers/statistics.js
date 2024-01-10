const express = require('express')
const router = express.Router();

const {getStatistics, sortStatistics} = require('../controllers/statisticsController')

router.route('/').get(getStatistics)
router.route('/sort').get(sortStatistics)

module.exports = router