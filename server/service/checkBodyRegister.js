const { validationResult, body } = require("express-validator");

const checkBody = (type) => {
  const validations = [
    body("numberPhone")
      .trim()
      .isNumeric()
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone must be numeric and equal to 10 digits long."),
    body("fullName")
      .trim()
      .matches(/^[a-zA-ZÀ-ỹ\s]+$/u)
      .isLength({ min: 2, max: 70 })
      .withMessage(
        "Name must be at least 2 characters and at most 70 characters."
      ),
    body("gender")
      .trim()
      .custom((gender) => {
        const genders = ["nam", "nu", "nữ", "female", "male"];
        if (!genders.includes(gender.toLowerCase())) {
          throw new Error(
            `Gender must includes: ["nam", "nu", "nữ", "female", "male"]`
          );
        } else {
          return true;
        }
      }),
    body("birthday")
      .trim()
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage(
        "This birthday is invalid. It must be a valid date in the format YYYY-MM-DD."
      ),
  ];

  if (type === "register") {
    validations.push(
      body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage(
          "This password is invalid. It must be at least 8 characters long."
        )
    );
  } else if (type === "update") {
    validations.push(
      body("newPassword")
        .trim()
        .custom((data) => {
          if (data === "false") {
            return true;
          }
          if (data.length < 8) {
            throw new Error("Password must be at most 8 characters long.");
          } else {
            return true;
          }
        })
    );
  }

  return validations;
};

const arrayError = (req, res) => {
  const errors = validationResult(req);
  return errors;
};

module.exports = { checkBody, arrayError };
