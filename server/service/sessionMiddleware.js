const session = require("express-session");

require("dotenv").config();

const sessionMiddleware = session({
  secret: process.env.JWT_SECRET,
  credentials: true,
  name: "redis",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production" ? "true" : "auto",
    httpOnly: true,
    expires: 1000 * 60 * 60,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
});

const wrap = (expressMidd) => (socket, next) => {
  expressMidd(socket.request, {}, next);
};

module.exports = { sessionMiddleware, wrap };
