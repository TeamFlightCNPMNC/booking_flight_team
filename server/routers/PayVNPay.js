const {
    ProductCode,
    VnpLocale,
    dateFormat,
    VNPay,
    ignoreLogger,
  } = require("vnpay");
  const express = require("express");
  
  const router = express.Router();
  
  router.post("/api/order", async (req, res) => {
    const vnpay = new VNPay({
      tmnCode: "KN9XXGQP",
      secureSecret: "UJCMBD31F8T20GLXLVFZ5BB4RRCYFWJU",
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true, // optional
  
      hashAlgorithm: "SHA512", // optional
  
      /**
       * Use enableLog if you want to log
       * Disable it, then no logger will be used in any method
       */
      enableLog: true, // optional
  
      /**
       * Use ignoreLogger if you don't want to log console globally,
       * Then you still re-use loggerFn in each method that allow you to log
       */
      loggerFn: ignoreLogger, // optional
    });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    const now = new Date();
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);
  
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: 10000,
      vnp_IpAddr: "127.0.0.1",
      vnp_TxnRef: "12345",
      vnp_OrderInfo: "Thanh toan don hang 12345",
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: "http://localhost:3000/vnpay-return",
      vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
      vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
      vnp_ExpireDate: dateFormat(fifteenMinutesLater), // tùy chọn
    });
  
    return res.json({ paymentUrl });
  });
  module.exports = router;