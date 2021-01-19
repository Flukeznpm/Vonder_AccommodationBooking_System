const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const r = require('../actions/room');
const db = require('../config/db');

router.get('/', async function(req, res) {
    var check_user_session = { username: req.session.username };
    db.connect(function(err) {
        if (err) throw (err);

        var Db = db.db('AccommodationBookingDb').collection('User');
        Db.find(check_user_session).toArray().then(async(result) => {
            const username = result.map(u => u.username).toString();
            if (username != req.session.username) {
                res.redirect('/login');
            } else {
                await db.connect(async function(err) {
                    if (err) throw (err);
                    await db.db('AccommodationBookingDb').collection('RestRoom').find({}).toArray(function(err, roomList) {
                        if (err) throw err;
                        res.render('home', { username: req.session.username, roomList: roomList });
                    });
                });
            }
        });
    });
});

router.post('/mockRestRoom', function(req, res) {
    r.mockRestRoom(req).then(function(err, result) {
        if (err) throw err;
        res.render('home');
    })
});

router.post('/bookingRoom', async function(req, res) {

    const room_id = req.query._id;
    const obj_room_id = ObjectId(room_id);
    const username = req.session.username;

    await db.connect(async function(err) {
        if (err) throw err;

        var Db = db.db('AccommodationBookingDb').collection('RestRoom');

        await Db.find({}).toArray(async function(err, roomList) {
            if (err) throw err;

            const getRestRoom = { _id: obj_room_id };
            await Db.find(getRestRoom).toArray(async function(err, result) {
                if (err) throw err;

                const isActive = result.map(i => i.isActive).toString();;
                const left = result.map(l => l.left).toString();

                if (isActive == "false") {
                    return Promise.reject('This rest room is not active.').catch(err => {
                        const error = [err];
                        res.render('home', {
                            bookingError: error,
                            username: req.session.username,
                            roomList: roomList
                        });
                    });
                } else {
                    if (left == "0") {
                        return Promise.reject('This rest room is have left equal 0.').catch(err => {
                            const error = [err];
                            res.render('home', {
                                bookingError: error,
                                username: req.session.username,
                                roomList: roomList
                            });
                        });
                    } else {
                        var Db_check_booking = db.db('AccommodationBookingDb').collection('Booking');
                        var checkUsername = { username: username }
                        await Db_check_booking.find(checkUsername).toArray(async function(err, resultt) {
                            if (err) throw err;

                            const _idRoom = resultt.map(idr => idr.room_id);

                            for (let i = 0; i < _idRoom.length; i++) {
                                const check_room_already = _idRoom[i];
                                const check_room_already_toString = check_room_already.toString();
                                if (check_room_already_toString == room_id) {
                                    return Promise.reject('Your already booking this rest room.').catch(err => {
                                        const error = [err];
                                        res.render('home', {
                                            bookingError: error,
                                            username: req.session.username,
                                            roomList: roomList
                                        });
                                    });
                                }
                            }
                            await r.UpdateLeft(obj_room_id, username).then(async function(err) {
                                if (err) throw err;

                                return Promise.reject('Your successfully to booking rest room.').catch(err => {
                                    const error = [err];
                                    res.render('home', {
                                        bookingSuccess: error,
                                        username: req.session.username,
                                        roomList: roomList
                                    });
                                });
                            });
                        })
                    }
                }
            });
        });
    });
});

module.exports = router;