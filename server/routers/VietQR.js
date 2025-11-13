require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Payment = require("../models/Payment");
const { convertDateToVN } = require("../service/convertDateToVN");
const { formatNumber } = require("../service/formatNumber");
const DonHang = require("../models/DonHang");

router.post("/google-sheet", async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;

    const { orderId } = req.body;
    const response = await axios.get(process.env.GOOGLE_SHEET);

    const donhang = await DonHang.findById(orderId);
    const newestDonhang = await DonHang.findOne({ userId: _id }).sort({
      createdAt: -1,
    });
    if (!donhang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    } else if (donhang.trangThai === "Đã thanh toán") {
      return res.status(400).json({
        message: "Đơn hàng đã thanh toán trước đó",
      });
    }

    const payment = await Payment.findOne({ userId: _id });
    const currentTime = new Date();
    const expiresAt = new Date(payment?.createdAt?.getTime() + 15 * 60 * 1000);

    if (!payment) {
      return res.status(404).json({ message: "Giao dịch không tồn tại" });
    } else if (currentTime > expiresAt) {
      return res.status(400).json({
        message: "Thời gian thanh toán đã hết",
      });
    }

    let AMOUNT_VIETQR = "";
    let DESCRIPTION_VIETQR = "";

    if (newestDonhang) {
      const expiresAt = new Date(
        newestDonhang?.createdAt?.getTime() + 15 * 60 * 1000
      );
      if (
        currentTime > expiresAt &&
        (newestDonhang.expiredAt !== null ||
          newestDonhang.expiredAt !== undefined ||
          newestDonhang.expiredAt !== "null")
      ) {
        AMOUNT_VIETQR = parseInt(
          formatNumber(newestDonhang.tongGia.split(" ")[0])
        );
        DESCRIPTION_VIETQR = `${convertDateToVN(newestDonhang?.expiredAt)} ${
          newestDonhang._id
        }`.replace(/[:/]/g, "");
        if (
          response?.data.data[0]["Mô tả"].slice(-40) === DESCRIPTION_VIETQR &&
          AMOUNT_VIETQR === response?.data.data[0]["Giá trị"]
        ) {
          return res.status(200).json({
            message: "SUCCESS",
            data: {
              orderId: newestDonhang._id,
              typePay: "VietQR",
            },
          });
        }
      }
    }
    AMOUNT_VIETQR = parseInt(formatNumber(donhang.tongGia.split(" ")[0]));
    DESCRIPTION_VIETQR = `${convertDateToVN(donhang?.expiredAt)} ${
      donhang._id
    }`.replace(/[:/]/g, "");
    console.log(
      response?.data.data[0]["Mô tả"].slice(-40),
      DESCRIPTION_VIETQR,
      response?.data.data[0]["Mô tả"].slice(-40).includes(DESCRIPTION_VIETQR),
      AMOUNT_VIETQR === response?.data.data[0]["Giá trị"]
    );
    if (
      response?.data.data[0]["Mô tả"].slice(-40) === DESCRIPTION_VIETQR &&
      AMOUNT_VIETQR === response?.data.data[0]["Giá trị"]
    ) {
      return res.status(200).json({
        message: "SUCCESS",
        data: {
          orderId: donhang._id,
          typePay: "VietQR",
        },
      });
    }
    return res.status(200).json({
      message: "PENDING",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy dữ liệu từ Google Sheet",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi lấy dữ liệu từ Google Sheet",
        stack: error.stack,
      },
    });
  }
});

module.exports = router;
