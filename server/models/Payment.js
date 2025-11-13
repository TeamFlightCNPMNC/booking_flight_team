const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  payUrl: {
    type: String,
    required: true,
  },
  typePay: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
