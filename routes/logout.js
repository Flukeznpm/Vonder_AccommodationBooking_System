const express = require('express');
const { logout } = require('../config/db');
const router = express.Router();

router.get('/', function (req, res) {
    req.session = null;
    res.redirect('/login');
});

module.exports = router;