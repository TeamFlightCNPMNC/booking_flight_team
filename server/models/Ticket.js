const mongoose = require("mongoose");

const TicketSchema = mongoose.Schema({
  Ten: {
    type: String,
    required: true,
  },
  ngaySinh: {
    type: String,
    required: true,
  },
  loaiTuoi: {
    type: String,
    required: true,
  },
  hangVe: {
    type: String,
  },
  giaVe: {
    type: String,
    required: true,
  },
  maDon: {
    type: String,
    required: true,
  },
  maChuyenBay: {
    type: String,
    required: true,
  },
  trangThaiVe: {
    type: String,
    required: true,
    default: "Chưa thanh toán",
  },
  maSoGhe: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  expiredAt: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000),
  },
});

TicketSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Ticket", TicketSchema);
