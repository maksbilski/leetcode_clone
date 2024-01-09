const express = require('express')
const router = express.Router()
const {getSubmitForm} = require('../controllers/helpController')

router.route('/sendForm').post(getSubmitForm)

module.exports = router