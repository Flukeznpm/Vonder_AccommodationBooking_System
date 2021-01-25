const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nattapong:11501112@sandbox.2ng5o.mongodb.net/AccommodationBookingDb?retryWrites=true&w=majority";
const database = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = database;