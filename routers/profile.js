const express = require('express');
const router = express.Router();
const {get_aggregate_stats} = require('../controllers/profileController')

router.route('/aggregate').get(get_aggregate_stats);


module.exports = router