const mongoose = require('mongoose');
const uri = 'mongodb+srv://nattapong:11501112@sandbox.2ng5o.mongodb.net/AccommodationBookingDb?retryWrites=true&w=majority';

mongoose.Promise = global.Promise;

const db = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("[SUCCESS] : Connected to the database.");
    },
        (error) => {
            console.log("[FAILED] : Error to connected database." + error);
            process.exit();
        }
    );

module.exports = db; 