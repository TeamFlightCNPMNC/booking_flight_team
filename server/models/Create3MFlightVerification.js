const mongoose = require("mongoose");

const Create3MFlightVerificationSchema = mongoose.Schema({
  uniqueString: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  expiredAt: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000),
  },
});

// TTL (Time to Life) index tự động xóa đơn hàng sau 1 giờ
Create3MFlightVerificationSchema.index(
  { expiredAt: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model(
  "Create3MFlightVerification",
  Create3MFlightVerificationSchema
);
