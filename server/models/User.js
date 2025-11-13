const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    numberPhone: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Đang hoạt động",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
