const express = require('express');
const router = express.Router();
const {login_user} = require('../controllers/loginController')

router.route('/').post(login_user);

module.exports = router