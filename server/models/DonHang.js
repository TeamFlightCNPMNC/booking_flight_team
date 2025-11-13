const mongoose = require("mongoose");

const DonHangSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  soLuongVe: {
    type: Number,
    required: true,
  },
  tongGia: {
    type: String,
    required: true,
  },
  trangThai: {
    type: String,
    default: "Chưa thanh toán",
  },
  phuongThuc: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  expiredAt: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000),
  },
});

// TTL (Time to Life) index tự động xóa đơn hàng sau 1 giờ
DonHangSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("DonHang", DonHangSchema);
