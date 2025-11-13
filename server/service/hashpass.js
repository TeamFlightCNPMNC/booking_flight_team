// dùng library bcrypt để hash password
const bcrypt = require("bcrypt");

const salt = 10;

const hashPass = (password) => {
  return bcrypt.hash(password, salt);
};

const comparePass = (passInput, passUser) => {
  return bcrypt.compare(passInput, passUser);
};

module.exports = { hashPass, comparePass };
