const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const registerPage = (req, res, next) => {
    return res.render('register');
};

router.get('/', registerPage);

router.post('/', [
        check("fname", "Please input your first name.").not().isEmpty(),
        check("lname", "Please input your last name.").not().isEmpty(),
        check("username", "Please input your username.").trim().not().isEmpty(),
        check("password", "Please input your password minimum length 6 characters.").isLength({ min: 6 }),
        check("password", "Please input your password.").not().isEmpty(),
        check("phone", "Please input your phone.").not().isEmpty(),
        check("email", "Invalid E-mail address.").isEmail(),
        check("email", "Please input your email.").not().isEmpty(),
        check("citizenId", "Please input your citizen ID.").not().isEmpty(),
        check("citizenId", "Citizen ID must have 13 chracters.").isLength({ min: 13 }),
    ],
    function(req, res) {
        db.connect(function(err) {
            if (err) throw (err);

            var Db = db.db('AccommodationBookingDb').collection('User');
            const { username, password, fname, lname, phone, email, citizenId } = req.body;
            const validateError = validationResult(req);

            if (validateError.isEmpty()) {
                var query = { username: username };
                Db.find(query).toArray(function(err, result) {
                    if (err) throw err;
                    const Username = result.map(u => u.username).toString();
                    if (Username == username) {
                        return Promise.reject('This username already in use.').catch(err => {
                            const error = [err];
                            res.render('register', {
                                registerError: error,
                                oldData: req.body
                            });
                        });
                    } else {
                        var query = { phone: phone };
                        Db.find(query).toArray(function(err, result) {
                            if (err) throw err;
                            const Phone = result.map(p => p.phone).toString();
                            if (Phone == phone) {
                                return Promise.reject('This phone number already in use.').catch(err => {
                                    const error = [err];
                                    res.render('register', {
                                        registerError: error,
                                        oldData: req.body
                                    });
                                });
                            } else {
                                var query = { email: email };
                                Db.find(query).toArray(function(err, result) {
                                    if (err) throw err;
                                    const Email = result.map(e => e.email).toString();
                                    if (Email == email) {
                                        return Promise.reject('This email already in use.').catch(err => {
                                            const error = [err];
                                            res.render('register', {
                                                registerError: error,
                                                oldData: req.body
                                            });
                                        });
                                    } else {
                                        var query = { citizenId: citizenId };
                                        Db.find(query).toArray(function(err, result) {
                                            if (err) throw err;
                                            const CitizenId = result.map(c => c.citizenId).toString();
                                            if (CitizenId == citizenId) {
                                                return Promise.reject('This citizen id already in use.').catch(err => {
                                                    const error = [err];
                                                    res.render('register', {
                                                        registerError: error,
                                                        oldData: req.body
                                                    });
                                                });
                                            } else {
                                                bcrypt.hash(password, 12).then((hash_password) => {
                                                    var dataOfRegister = {
                                                        fname: fname,
                                                        lname: lname,
                                                        username: username,
                                                        password: hash_password,
                                                        phone: phone,
                                                        email: email,
                                                        citizenId,
                                                        citizenId
                                                    }
                                                    Db.insertOne(dataOfRegister, function(result) {
                                                        db.close();
                                                        res.send(`Your account has been created!, Now you can <a href="/login">Login</a>`);
                                                    }).catch(err => {
                                                        if (err) throw err;
                                                    });
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                const errors = validateError.errors.map(error => {
                    return error.msg;
                });
                res.render('register', {
                    registerError: errors,
                    oldData: req.body
                });
            }
        })
    }
);

module.exports = router;