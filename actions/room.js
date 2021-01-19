const db = require('../config/db');

async function GetAllRoom() {
    await db.connect(async function(err) {
        if (err) throw (err);
        await db.db('AccommodationBookingDb').collection('RestRoom').find({}).toArray(function(err, roomList) {
            if (err) throw err;
            return roomList;
        });
    });
};

async function UpdateLeft(_id, username) {
    await db.connect(async function(err) {
        if (err) throw (err);

        var query = { _id: _id };
        const Db = db.db('AccommodationBookingDb').collection('RestRoom');
        await Db.find(query).toArray(async function(err, result) {
            if (err) throw err;
            const left = result.map(l => l.left);
            const newLeft = left - 1;
            var updateLeft = { $set: { left: newLeft } };
            await Db.updateOne(query, updateLeft, function(err, result) {
                if (err) throw err;
                return true;
            });
        });

        const Db_booking = db.db('AccommodationBookingDb').collection('Booking');
        const obj_booking = {
            username: username,
            room_id: _id
        }
        await Db_booking.insertOne(obj_booking, function(err, result) {
            if (err) throw err;
            return true;
        });
    });
};

async function mockRestRoom(req) {
    db.connect(async function(err) {

        const img = req.body.imgRoom;
        const name = req.body.name;
        const desc = req.body.desc;
        const address = req.body.address;
        const location = req.body.location;
        const price = req.body.price;
        const left = req.body.left;
        const isActive = req.body.isActive;

        var insert_mock_restroom = {
            imgRoom: img,
            name: name,
            desc: desc,
            address: address,
            location: location,
            price: price,
            left: left,
            isActive: isActive
        }
        await db.db('AccommodationBookingDb').collection('RestRoom').insertOne(insert_mock_restroom, function(err, result) {
            if (err) throw err;
            return true;
        });
    });
};

module.exports = { GetAllRoom, UpdateLeft, mockRestRoom };