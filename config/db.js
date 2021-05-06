const MongoClient = require('mongodb').MongoClient;
const uri = "";
const database = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = database;