const express = require('express');
const router = express.Router();
const {register_user} = require('../controllers/registerController')

router.route('/').post(register_user);

module.exports = router