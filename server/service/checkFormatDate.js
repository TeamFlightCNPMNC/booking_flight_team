const moment = require("moment");
function isValidDateFormat(input) {
  const format = "DD-MM-YYYY";

  return moment(input, format, true).isValid();
}

module.exports = isValidDateFormat;
