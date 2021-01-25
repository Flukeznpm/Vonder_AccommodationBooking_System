const express = require('express');
const router = express.Router();
const userSchema = require('../models/test_user_schema_by_mongoose');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

router.get('/', function (req, res) {

});

router.post('/', function (req, res) {

});

module.exports = router;