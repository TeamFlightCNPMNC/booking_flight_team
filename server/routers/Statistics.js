const express = require("express");
const DonHang = require("../models/DonHang.js");
const Ticket = require("../models/Ticket.js");
const Account = require("../models/User.js");
const Payment = require("../models/Payment.js");
const Flight = require("../models/Flight.js");
const { transporter } = require("../service/verifyEmail.js");
const { mongoose } = require("mongoose");

const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const stats = await DonHang.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`),
          },
        },
      },
      {
        $lookup: {
          from: "tickets",
          let: { orderId: { $toString: "$_id" } },
          pipeline: [{ $match: { $expr: { $eq: ["$maDon", "$$orderId"] } } }],
          as: "tickets",
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalFlights: { $sum: { $size: "$tickets" } },
          paidCount: {
            $sum: { $cond: [{ $eq: ["$trangThai", "Đã thanh toán"] }, 1, 0] },
          },
          paidTotal: {
            $sum: {
              $cond: [
                { $eq: ["$trangThai", "Đã thanh toán"] },
                {
                  $convert: {
                    input: {
                      $replaceAll: {
                        input: {
                          $replaceAll: {
                            input: {
                              $toString: { $ifNull: ["$tongGia", "0"] },
                            },
                            find: ".",
                            replacement: "",
                          },
                        },
                        find: " VND",
                        replacement: "",
                      },
                    },
                    to: "double",
                    onError: 0,
                    onNull: 0,
                  },
                },
                0,
              ],
            },
          },
          canceledCount: {
            $sum: { $cond: [{ $eq: ["$trangThai", "Đã hủy"] }, 1, 0] },
          },
          canceledTotal: {
            $sum: {
              $cond: [
                { $eq: ["$trangThai", "Đã hủy"] },
                {
                  $convert: {
                    input: {
                      $replaceAll: {
                        input: {
                          $replaceAll: {
                            input: {
                              $toString: { $ifNull: ["$tongGia", "0"] },
                            },
                            find: ".",
                            replacement: "",
                          },
                        },
                        find: " VND",
                        replacement: "",
                      },
                    },
                    to: "double",
                    onError: 0,
                    onNull: 0,
                  },
                },
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          totalFlights: 1,
          paidCount: 1,
          paidTotal: 1,
          canceledCount: 1,
          canceledTotal: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    const result = [];
    for (let m = 1; m <= 12; m++) {
      const found = stats.find((s) => s.month === m);
      result.push(
        found || {
          month: m,
          totalFlights: 0,
          paidCount: 0,
          paidTotal: 0,
          canceledCount: 0,
          canceledTotal: 0,
        }
      );
    }

    const formattedResult = result.map((item) => ({
      ...item,
      paidTotal:
        item.paidTotal === 0
          ? "0 VND"
          : new Intl.NumberFormat("vi-VN").format(item.paidTotal) + " VND",
      canceledTotal:
        item.canceledTotal === 0
          ? "0 VND"
          : new Intl.NumberFormat("vi-VN").format(item.canceledTotal) + " VND",
    }));

    res.status(200).json({
      message: `Thống kê năm ${year} thành công`,
      year,
      months: formattedResult,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi thống kê theo năm",
        stack: error.stack,
      },
    });
  }
});

module.exports = router;
