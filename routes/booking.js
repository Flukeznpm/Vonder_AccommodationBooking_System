const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const db = require('../config/db');

const ifNotLogin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('login');
    }
    next();
};

router.get('/',ifNotLogin, async function(req, res) {
    const bookingList = [];

    await db.connect(async function(err) {
        if (err) throw err;

        var Db_booking = db.db('AccommodationBookingDb').collection('Booking');
        const query = { username: req.session.username };

        await Db_booking.find(query).toArray(async function(err, result) {
            if (err) throw err;

            if (result.length === 0 || result == null || result == undefined) {
                return Promise.reject('You do not have some booking.').catch(err => {
                    const error = [err];
                    res.render('booking', {
                        bookNull: error
                    });
                });
            } else {
                const RoomId = result.map(rid => rid.room_id);

                for (let i = 0; i < RoomId.length; i++) {
                    const roomIdList = RoomId[i];
                    const roomIdListString = roomIdList.toString();
                    const RoomObjId = ObjectId(roomIdListString);

                    var Db_room = db.db('AccommodationBookingDb').collection('RestRoom');
                    const queryByRoomId = { _id: RoomObjId };
                    await Db_room.find(queryByRoomId).toArray(async function(err, book) {
                        if (err) throw err;

                        const imgRoom = await book.map(i => i.imgRoom).toString();
                        const name = await book.map(n => n.name).toString();
                        const desc = await book.map(d => d.desc).toString();
                        const address = await book.map(a => a.address).toString();

                        var book_result = {
                            imgRoom: imgRoom,
                            name: name,
                            desc: desc,
                            address: address
                        }

                        await bookingList.push(book_result);

                        if (i == (RoomId.length) - 1) {
                            return Promise.reject('XXXXXXXXXXX').catch(err => {
                                res.render('booking', {
                                    booking: bookingList
                                });
                            })
                        }
                    });
                }
            }
        });
    });
});

module.exports = router;