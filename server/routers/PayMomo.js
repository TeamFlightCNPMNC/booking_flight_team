const axios = require("axios");
const express = require("express");
const crypto = require("crypto");
const { authMiddleware } = require("../middleware/authorization");
const Payment = require("../models/Payment.js");
const DonHang = require("../models/DonHang");

var accessKey = "F8BBA842ECF85";
var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var partnerCode = "MOMO";
const router = express.Router();

router.post("/payment-momo", async (req, res) => {
  const { amount, orderId } = req.body;

  var orderInfo = "pay with MoMo";
  var redirectUrl = process.env.BASE_URL;
  var ipnUrl = "https://travfruitv4-server.vercel.app/callback";
  // var ipnUrl = "http://localhost:4001/callback";
  var requestType = "payWithMethod";
  var extraData = "";
  var autoCapture = true;
  var lang = "vi";

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    orderId +
    "&requestType=" +
    requestType;

  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  var expire = Math.floor(Date.now() / 1000) + 900; // 15 phút hết hạn

  const requestBody = JSON.stringify({
    autoCapture: autoCapture,
    partnerCode: partnerCode,
    requestId: orderId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    requestType: requestType,
    extraData: extraData,
    lang: lang,
    signature: signature,
    expireTime: expire,
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    if (!result.data) {
      return res.status(400).json({ message: "Lỗi khi thanh toán với MoMo" });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi thanh toán với MoMo",
      error: error.response?.data || error.message,
    });
  }
});

router.post("/callback", async (req, res) => {
  return res.status(200).json(req.body);
});

router.get("/transaction-status/:orderId", async (req, res) => {
  const { orderId } = req.params;

  const payment = await Payment.findOne({ orderId: orderId });
  const currentTime = new Date();
  const expiresAt = new Date(payment?.createdAt?.getTime() + 15 * 60 * 1000);

  if (currentTime > expiresAt) {
    return res.status(400).json({
      message: "Thời gian thanh toán đã hết",
    });
  }

  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId,
    signature,
    lang: "vi",
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };

  let result = await axios(options);
  return res.status(200).json(result.data);
});

module.exports = router;
