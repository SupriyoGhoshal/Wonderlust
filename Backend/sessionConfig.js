const session = require("express-session");

const sessionConfig = session({
  secret: "thisshouldbeabettersecret", // 🔥 You should store it in ENV file later
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,            // Extra security
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});

module.exports = sessionConfig;
