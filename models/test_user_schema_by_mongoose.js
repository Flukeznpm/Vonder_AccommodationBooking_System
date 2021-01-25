const db = require('../config/test_db_by_mongoose');
const modelName = 'User';

var user_schema = db.Schema(
    {
        username: {
            type: String,
            unique: true
        },
        fname: {
            type: String
        },
        lname: {
            type: String
        },
        password: {
            type: String
        },
        phone: {
            type: String,
            unique: true
        },
        email: {
            type: String,
            unique: true
        },
        citizenId: {
            type: String,
            unique: true
        }
    },
    {
        collection: 'User'
    }
);

const user = db.model(modelName, user_schema);

module.exports = user;
