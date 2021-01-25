const express = require('express');
const router = express.Router();
const db = require('../config/test_db_by_mongoose');
const userSchema = require('../models/test_user_schema_by_mongoose');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

router.get('/', function (req, res) {

});

router.post('/', function (req, res) {

});

module.exports = router;