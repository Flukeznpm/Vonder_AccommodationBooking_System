const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { check, validationResult } = require('express-validator');

const ifNotLogin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('login');
    }
    next();
};

router.get('/', ifNotLogin,async function(req, res) {
    db.connect(async function(err) {
        if (err) throw (err);

        const Username = req.session.username;
        var Db = db.db('AccommodationBookingDb').collection('User');
        var query = { username: Username };

        await Db.find(query).toArray(function(err, result) {
            if (err) throw err;

            const usernamee = result.map(u => u.username).toString();

            if (Username == usernamee) {
                res.render('profile', { p: result });
            } else {
                return Promise.reject('You can not edit other profile.').catch(err => {
                    const error = [err];
                    console.log(error);
                    res.render('profile', {
                        editProfileError: error,
                        p: result
                    });
                });
            }
        });
    });
});

router.get('/editProfile', ifNotLogin ,function(req, res) {
    db.connect(async function(err) {
        if (err) throw (err);

        const Username = req.session.username;
        var Db = db.db('AccommodationBookingDb').collection('User');
        var query = { username: Username };

        await Db.find(query).toArray(function(err, p) {
            if (err) throw err;

            const usernamee = p.map(u => u.username).toString();

            if (Username == usernamee) {
                res.render('editProfile', { p });
            } else {
                return Promise.reject('You can not edit other profile.').catch(err => {
                    const error = [err];
                    console.log(error);
                    res.render('editProfile', {
                        editProfileError: error,
                        p
                    });
                });
            }
        });
    });
});

router.post('/editProfile', [
    check("fname", "Please input your first name.").not().isEmpty(),
    check("lname", "Please input your last name.").not().isEmpty(),
    check("phone", "Please input your phone.").not().isEmpty(),
    check("email", "Invalid E-mail address.").isEmail(),
    check("email", "Please input your email.").not().isEmpty(),
    check("citizenId", "Please input your citizen ID.").not().isEmpty(),
    check("citizenId", "Citizen ID must have 13 chracters.").isLength({ min: 13 }),
], async function(req, res) {
    db.connect(async function(err) {
        if (err) throw (err);

        const fname = req.body.fname;
        const lname = req.body.lname;
        const phone = req.body.phone;
        const email = req.body.email;
        const citizenId = req.body.citizenId;

        var Db = db.db('AccommodationBookingDb').collection('User');
        const validateError = validationResult(req);
        if (validateError.isEmpty()) {

            var MyQuery = { citizenId: citizenId };
            await Db.find(MyQuery).toArray(async function(err, resultMySelf) {
                if (err) throw err;
                const phoneMyself = resultMySelf.map(p => p.phone).toString();
                const emailMyself = resultMySelf.map(p => p.email).toString();
                const citizenMyself = resultMySelf.map(p => p.citizenId).toString();

                var query = { phone: phone };
                await Db.find(query).toArray(async function(err, result) {
                    if (err) throw err;
                    const Phone = result.map(p => p.phone).toString();
                    if (Phone == phone && phone != phoneMyself) {
                        return Promise.reject('This phone number already in use.').catch(err => {
                            const error = [err];
                            console.log(error);
                            res.render('editProfile', {
                                editProfileError: error,
                                oldData: req.body
                            });
                        });
                    } else {
                        var query = { email: email };
                        await Db.find(query).toArray(async function(err, result) {
                            if (err) throw err;
                            const Email = result.map(e => e.email).toString();
                            if (Email == email && email != emailMyself) {
                                return Promise.reject('This email already in use.').catch(err => {
                                    const error = [err];
                                    res.render('editProfile', {
                                        editProfileError: error,
                                        oldData: req.body
                                    });
                                });
                            } else {
                                var query = { citizenId: citizenId };
                                await Db.find(query).toArray(async function(err, result) {
                                    if (err) throw err;
                                    const CitizenId = result.map(c => c.citizenId).toString();
                                    if (CitizenId == citizenId && citizenId != citizenMyself) {
                                        return Promise.reject('This citizen id already in use.').catch(err => {
                                            const error = [err];
                                            res.render('editProfile', {
                                                editProfileError: error,
                                                oldData: req.body
                                            });
                                        });
                                    } else {
                                        var query = { citizenId: citizenId };
                                        var newValues = {
                                            $set: {
                                                fname: fname,
                                                lname: lname,
                                                phone: phone,
                                                email: email,
                                                citizenId: citizenId
                                            }
                                        };
                                        await Db.updateOne(query, newValues, async function(err) {
                                            if (err) throw err;

                                            var query = { citizenId: citizenId };

                                            await Db.find(query).toArray(function(err, result) {
                                                if (err) throw err;
                                                res.render('profile', { p: result });
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        } else {
            const errors = validateError.errors.map(error => {
                return error.msg;
            });
            res.render('editProfile', {
                editProfileError: errors,
                oldData: req.body
            });
        }
    });
});

module.exports = router;