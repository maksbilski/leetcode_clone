const express = require('express')
const router = express.Router();

const {getAndSortStatistics} = require('../controllers/statisticsController')

router.route('/').get(getAndSortStatistics)
router.route('/sort').get(getAndSortStatistics)

module.exports = router