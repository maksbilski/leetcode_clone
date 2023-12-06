const express = require('express')
const router = express.Router();

const {get_statistics, sort_statistics} = require('../controllers/statisticsController')

router.route('/').get(get_statistics)
router.route('/sort').get(sort_statistics)

module.exports = router