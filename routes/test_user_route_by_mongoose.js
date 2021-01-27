const express = require('express');
const router = express.Router();
const userSchema = require('../models/test_user_schema_by_mongoose');
// const { check, validationResult, Result } = require('express-validator');
// const bcrypt = require('bcrypt');

router.get('/user', function (req, res, next) {
    userSchema.find().exec((err, result) => {
        if (err) throw err;
        res.status(200).json(result);
    });
});

router.get('/user/:userId', function (req, res, next) {
    const userId = req.params.userId;
    userSchema.findById(userId).exec((err, result) => {
        if (err) throw err;
        res.status(200).json(result);
    });
});

router.post('/addUser', function (req, res, next) {
    const dataOfNewUser = req.body;
    const newUser = new userSchema(dataOfNewUser);

    newUser.save((err) => {
        if (err) throw err;
        console.log('Insert 1 User.');
        res.status(201).end();
    });
});

module.exports = router;