require("dotenv").config();
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_EMAIL_PASSWORD,
  },
});

//testing success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to send emails");
    console.log(success);
  }
});

const apiLimiter = ({ max }) =>
  rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: max,
    keyGenerator: (req) => {
      return req.headers["authorization"] || req.ip;
    },
    handler: (req, res) => {
      res.status(429).json({
        error: "Too many requests",
        message: "Bạn đã vượt quá giới hạn request. Vui lòng thử lại sau 24h.",
      });
    },
  });

module.exports = {
  apiLimiter,
  transporter,
};
