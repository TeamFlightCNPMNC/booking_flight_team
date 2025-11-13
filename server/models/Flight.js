const mongoose = require("mongoose");
const moment = require("moment");

const FlightSchema = mongoose.Schema(
  {
    loaiChuyenBay: {
      type: String,
      required: true,
    },
    diemBay: {
      type: String,
      required: true,
    },
    diemDen: {
      type: String,
      required: true,
    },
    gioBay: {
      type: String,
      required: true,
    },
    ngayBay: {
      type: String,
      required: true,
    },
    gioDen: {
      type: String,
      required: true,
    },
    ngayDen: {
      type: String,
      required: true,
    },
    hangBay: {
      type: String,
      required: true,
    },
    soGhePhoThong: {
      type: Number,
      required: true,
    },
    soGheThuongGia: {
      type: Number,
      required: true,
    },
    gia: {
      type: String,
      required: true,
    },
    trangThaiChuyenBay: {
      type: String,
      default: "Đang hoạt động",
    },
    expiredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flight", FlightSchema);
