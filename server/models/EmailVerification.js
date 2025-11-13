const mongoose = require("mongoose");

const EmailVerificationSchema = mongoose.Schema({
  code: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  expiredAt: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000),
  },
});

// TTL (Time to Life) index tự động xóa đơn hàng sau 5 phút
EmailVerificationSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("EmailVerification", EmailVerificationSchema);
