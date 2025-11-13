const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment.js");
const checkAdmin = require("../middleware/checkAdmin.js");
const Ticket = require("../models/Ticket.js");
const Flight = require("../models/Flight.js");

router.post("/update/payurl", async (req, res) => {
  try {
    const { orderId, payUrl, typePay } = req.body;

    const payment = await Payment.findOne({ orderId: orderId });
    if (!payment) {
      return res.status(404).json({ message: "Giao dịch không tồn tại" });
    }

    const updatePayment = await Payment.findOneAndUpdate(
      { orderId: payment.orderId },
      { payUrl, typePay },
      { new: true }
    );

    if (updatePayment) {
      return res.status(200).json({
        message: "Cập nhật payUrl thành công!",
        payUrl: updatePayment.payUrl,
        createdAt: updatePayment.createdAt,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đơn hàng với orderId này." });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi update payment",
        stack: error.stack,
      },
    });
  }
});

router.post("/pending", async (req, res) => {
  try {
    const { orderId } = req.body;

    const payment = await Payment.findOne({ orderId: orderId });
    if (!payment) {
      return res.status(404).json({
        message: `Không tìm thấy đơn hàng ${orderId}`,
        order,
      });
    }

    return res.status(200).json({ payment });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi tìm payment pending",
        stack: error.stack,
      },
    });
  }
});

router.get("/get", checkAdmin, async (req, res) => {
  try {
    const payment = await Payment.find();
    if (!payment) {
      return res.status(404).json({
        message: `Không tìm thấy payment nào`,
        payment,
      });
    }

    return res.status(200).json({ payment });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi tìm payment success",
        stack: error.stack,
      },
    });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { orderId, _id, cbId, cbIdRe } = req.body;

    const payment = await Payment.findByIdAndDelete(_id);
    if (!payment) {
      return res.status(404).json({
        message: `Không tìm thấy giao dịch ${_id}`,
      });
    }
    const tickets = await Ticket.find({ maDon: orderId });
    if (!tickets) {
      return res.status(404).json({
        message: `Không tìm thấy vé nào`,
      });
    }

    const result = await Ticket.deleteMany({ maDon: orderId });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Không tìm thấy ticket nào để xóa",
      });
    }

    return res.status(200).json({ message: "Cập nhật chuyến bay thành công" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi tìm payment pending",
        stack: error.stack,
      },
    });
  }
});

module.exports = router;
