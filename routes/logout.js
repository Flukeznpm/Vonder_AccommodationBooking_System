const express = require('express');
const { logout } = require('../config/db');
const router = express.Router();

const ifNotLogin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('login');
    }
    next();
};
router.get('/', ifNotLogin , function (req, res) {
    req.session = null;
    res.redirect('/login');
});

module.exports = router;