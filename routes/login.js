const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const ifLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/room');
    }
    next();
};

const ifNotLogin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('login');
    }
    next();
};

router.get('/', ifNotLogin, ifLogin, function(req, res) {
    var check_user_session = { username: req.session.username };
    db.connect(function(err) {
        if (err) throw (err);
        var Db = db.db('AccommodationBookingDb').collection('User');
        Db.find(check_user_session).toArray().then((result) => {
            const username = result.map(u => u.username).toString();
            res.render('home', {
                username: username
            });
        });
    });
});

router.post('/', ifLogin, function(req, res) {
    db.connect(function(err) {
        if (err) throw (err);

        var Db = db.db('AccommodationBookingDb').collection('User');
        const { username, password } = req.body;

        var query = { username: username };
        return Db.find(query).toArray((err, result) => {
            if (err) throw err;
            const Username = result.map(u => u.username).toString();
            if (Username == username) {
                Db.find({ username: username }).toArray((err, result) => {
                    if (err) throw err;
                    const hash_password = result.map(p => p.password).toString();
                    bcrypt.compare(password, hash_password).then((compareResult) => {
                        if (compareResult === true) {
                            req.session.isLoggedIn = true;
                            req.session.username = Username;
                            res.redirect('/room');
                        } else {
                            return Promise.reject('Invalid password').catch(err => {
                                const error = [err];
                                res.render('login', {
                                    loginError: error,
                                });
                            });
                        }
                    })
                })
            } else {
                return Promise.reject('Invalid username').catch(err => {
                    const error = [err];
                    res.render('login', {
                        loginError: error,
                    });
                });
            }
        });
    });
});

module.exports = router;