const session = require('express-session');
const { MongoStore } = require('connect-mongo');

module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI_WRITE, // dùng tài khoản GHI
    collectionName: 'sessions',
    ttl: 60 * 60 * 24, // 1 ngày
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
});