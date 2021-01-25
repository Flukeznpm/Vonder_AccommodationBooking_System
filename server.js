const express = require('express');
const app = express();
const path = require('path');
const cookieSession = require('cookie-session');
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 4800 * 1000
}));

const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const profileRouter = require('./routes/profile');
const roomRouter = require('./routes/room');
const logoutRouter = require('./routes/logout');
const bookingRouter = require('./routes/booking');
const TestUserByMongoose = require('./routes/test_user_route_by_mongoose');

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/profile', profileRouter);
app.use('/room', roomRouter);
app.use('/logout', logoutRouter);
app.use('/booking', bookingRouter);
app.use('/TestUserByMongoose', TestUserByMongoose);

app.use((req, res, next) => {
    res.status(404).send('<h1>No path of your request!</h1>');
});

app.listen(port, () => {
    console.log(`>>> Server is running on port : ${port} <<<`);
});

module.exports = app;