require("dotenv").config();
const express = require("express");
const _ = require("lodash");
const ms = require("ms");
const User = require("../models/User");
const DonHang = require("../models/DonHang");
const Flight = require("../models/Flight");
const Ticket = require("../models/Ticket");
const { apiLimiter, transporter } = require("../service/verifyEmail.js");
const { mongoose } = require("mongoose");
const { hashPass, comparePass } = require("../service/hashpass");
const { checkBody, arrayError } = require("../service/checkBodyRegister");
const { signToken, verifyToken } = require("../service/JWT");
const { authorization } = require("../middleware/authorization");
const EmailVerification = require("../models/EmailVerification.js");

const router = express.Router();

router.post("/register", checkBody("register"), async (req, res) => {
  try {
    if (!arrayError(req, res).isEmpty()) {
      return res.status(400).send(arrayError(req, res).array());
    }
    const {
      numberPhone,
      fullName,
      gender,
      birthday,
      password,
      email,
      code_verification_email,
    } = req.body;
    console.log(
      numberPhone,
      fullName,
      gender,
      birthday,
      password,
      email,
      code_verification_email
    );

    const existedNumberPhone = await User.findOne({ numberPhone });
    if (existedNumberPhone) {
      return res.status(409).json({
        type: "phone",
        message: "Số này đã được đăng ký",
      });
    }
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res.status(409).json({
        type: "email",
        message: "Email đã được đăng ký",
      });
    }
    const checkVerificationEmail = await EmailVerification.findOne({ email });
    if (
      !checkVerificationEmail ||
      checkVerificationEmail?.code !== code_verification_email
    ) {
      return res.status(400).json({
        type: "code",
        message: "không hợp lệ / đã hết hạn",
      });
    }
    const newPass = await hashPass(password);

    await User.create({
      numberPhone,
      fullName,
      gender,
      birthday,
      password: newPass,
      email,
    });

    return res.status(200).json({ message: "Đăng ký thành công" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi đăng ký tài khoản",
        stack: error.stack,
      },
    });
  }
});

router.post("/update", authorization, checkBody("update"), async (req, res) => {
  try {
    if (!arrayError(req, res).isEmpty()) {
      return res.status(400).send(arrayError(req, res).array());
    }

    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;

    const oldUser = await User.findById(_id);

    if (!oldUser) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    const {
      numberPhone,
      fullName,
      gender,
      birthday,
      email,
      code_verification_email,
      password,
      newPassword,
    } = req.body;

    const userBody = {
      numberPhone: numberPhone,
      fullName: fullName,
      gender: gender,
      birthday: birthday,
      email: email,
    };

    const userCurrent = {
      numberPhone: oldUser.numberPhone,
      fullName: oldUser.fullName,
      gender: oldUser.gender,
      birthday: oldUser.birthday,
      email: oldUser.email,
    };

    const areEqual = _.isEqual(userBody, userCurrent);

    if (email !== oldUser.email) {
      const existedEmail = await User.findOne({
        email: req.body.email,
        _id: { $ne: _id }, // Trừ _id hiện tại
      });
      if (existedEmail) {
        return res.status(409).json({
          type: "email",
          message: "Email đã được đăng ký",
        });
      }
      const checkVerificationEmail = await EmailVerification.findOne({
        email,
      });
      if (
        !checkVerificationEmail ||
        checkVerificationEmail.code !== code_verification_email
      ) {
        return res.status(400).json({
          type: "code",
          message: "không hợp lệ / đã hết hạn",
        });
      }
    }

    if (areEqual && !password && newPassword === "false") {
      return res.status(200).json({ message: "Cập nhật thành công" });
    }

    if (req.body.numberPhone) {
      const existedNumberPhone = await User.findOne({
        numberPhone: req.body.numberPhone,
        _id: { $ne: _id }, // Trừ _id hiện tại
      });
      if (existedNumberPhone) {
        return res.status(409).json({
          type: "phone",
          message: "Số này đã được đăng ký",
        });
      }
    }

    let passNewHash;
    if (password && newPassword !== "false") {
      const checkPass = await comparePass(password, oldUser.password);
      if (!checkPass) {
        return res.status(400).json({
          type: "password",
          message: "Mật khẩu cũ sai",
        });
      }
      passNewHash = await hashPass(newPassword);
    }

    const newUser = await User.findOneAndUpdate(
      { _id: _id },
      {
        numberPhone,
        fullName,
        gender,
        birthday,
        password: passNewHash || oldUser.password,
        email,
      },
      { new: true }
    );

    if (!newUser) {
      return res.status(400).josn({
        type: "update_fail",
        message: "Cập nhật thất bại",
      });
    }

    return res.status(200).json({
      message: "Cập nhật thành công",
      data: {
        numberPhone: newUser.numberPhone,
        fullName: newUser.fullName,
        gender: newUser.gender,
        birthday: newUser.birthday,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi cập nhật tài khoản",
        stack: error.stack,
      },
    });
  }
});

router.post("/status", authorization, async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;

    if (_id !== process.env.ID_ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { status, id } = req.body;

    const oldUser = await User.findById(id);

    if (!oldUser) {
      return res.status(404).json({ message: "Id User not found" });
    }

    let updateStatus;
    if (status.toLowerCase() === "unlock" || status.toLowerCase() === "lock") {
      updateStatus = await User.findOneAndUpdate(
        { _id: id },
        {
          status:
            status === "unlock" ? "Đang hoạt động" : "Tài khoản đã bị khóa",
        }
      );
    } else {
      return res.status(400).josn({ message: "Status không hợp lệ" });
    }

    if (!updateStatus) {
      return res
        .status(409)
        .josn({ message: "Update status không thành công" });
    }

    return res.status(200).json({
      message: "Update status thành công",
      data: {
        numberPhone: updateStatus.numberPhone,
        fullName: updateStatus.fullName,
        gender: updateStatus.gender,
        birthday: updateStatus.birthday,
        status: updateStatus.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get_all", authorization, async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;

    if (_id !== process.env.ID_ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await User.find()
      .select("birthday fullName gender numberPhone status _id")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get", authorization, async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;

    const _id = accessTokenDecoded._id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send(`Not found user`);
    }

    const user = await User.findById(_id);
    const resUser = {
      numberPhone: user.numberPhone,
      fullName: user.fullName,
      gender: user.gender,
      birthday: user.birthday,
      email: user.email,
    };

    return res.status(200).json(resUser);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/search/with/flight", authorization, async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;
    if (_id !== process.env.ID_ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const idF = req.query.idF;
    const trangThai = req.query.trangThai;

    if (!idF) {
      return res.status(400).json({ error: "idF is required" });
    }

    const Tickets = await Ticket.find({ maChuyenBay: idF });

    if (Tickets.length < 0) {
      return res.status(404).json({ message: "Không tìm thấy vé nào." });
    }

    const idDHs = Tickets.map((ticket) => ticket.maDon);

    const matchCondition = {
      _id: { $in: idDHs.map((id) => new mongoose.Types.ObjectId(id)) },
    };

    if (trangThai && trangThai !== "undefined") {
      matchCondition.trangThai = trangThai;
    }

    const orders = await DonHang.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: "tickets",
          let: { orderId: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$maDon", "$$orderId"] } } },
            {
              $lookup: {
                from: "flights",
                let: { cbId: { $toObjectId: "$maChuyenBay" } },
                pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$cbId"] } } }],
                as: "flights",
              },
            },
            {
              $unwind: {
                path: "$flights",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "tickets",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi tìm đơn hàng",
        stack: error.stack,
      },
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { numberPhone, password } = req.body;
    console.log(numberPhone, password);
    const user = await User.findOne({ numberPhone: numberPhone });

    if (!user) {
      return res
        .status(404)
        .json({ message: "So dien thoai chua duoc dang ki" });
    }

    if (user.status === "Tài khoản đã bị khóa") {
      return res.status(403).json({ message: "Tai khoan da bi khoa" });
    }

    const checkPass = await comparePass(password, user.password);

    if (!checkPass) {
      return res.status(400).json({ message: "Mat khau sai" });
    }

    const payload = {
      _id: user._id,
    };

    const accessToken = await signToken(payload, process.env.JWT_SECRET, "1d");
    const refreshToken = await signToken(
      payload,
      process.env.REFRESH_TOKEN,
      "7d"
    );

    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({
      message: "Lỗi khi dang nhap",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi dang nhap",
        stack: error.stack,
      },
    });
  }
});

router.get("/reservation", authorization, async (req, res) => {
  try {
    const accessTokenDecoded = req.jwtDecoded;
    const _id = accessTokenDecoded._id;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        message: "Tài khoản không tồn tại",
      });
    }

    let idUser = _id;
    if (_id === process.env.ID_ADMIN) {
      const { id } = req.query;

      idUser = id || _id;
    }

    const page_size = 2;
    let page = req.query.page || 1;
    if (isNaN(page) || page <= 0) {
      page = 1;
    }

    page = parseInt(page);
    let start = (page - 1) * page_size;

    const { type } = req.query;

    const decodedType = decodeURIComponent(type).split(" (")[0];

    const matchCondition = { userId: idUser };
    if (
      decodedType !== "All" &&
      decodedType !== null &&
      decodedType !== undefined &&
      decodedType !== "undefined"
    ) {
      matchCondition.trangThai = decodedType;
    }

    const orders = await DonHang.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: "tickets",
          let: { orderId: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$maDon", "$$orderId"] } } },
            {
              $lookup: {
                from: "flights",
                let: { cbId: { $toObjectId: "$maChuyenBay" } },
                pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$cbId"] } } }],
                as: "flights",
              },
            },
            {
              $unwind: {
                path: "$flights",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "tickets",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: start },
      { $limit: page_size },
    ]);

    const countOrder = await DonHang.countDocuments(matchCondition);

    if (orders.length <= 0) {
      return res.status(200).json({
        message: "Không tìm thấy đơn hàng nào",
        orders: orders,
      });
    }

    return res.status(200).json({
      message: "Tìm đơn hàng thành công",
      page: page,
      totalPage: Math.ceil(countOrder / page_size),
      orders: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi tìm đơn hàng",
        stack: error.stack,
      },
    });
  }
});

router.post("/send-verification-code-email", async (req, res) => {
  try {
    const { email } = req.body;
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!email || !emailPattern.test(email) || email.endsWith("@gmail.co")) {
      return res.status(400).json({
        message: "Email không hợp lệ",
      });
    }

    const existedEmail = await EmailVerification.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({
        message: "Email đã được gửi mã xác nhận",
      });
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    const mailOption = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Xác minh email",
      html: `<p>Mã xác minh email của bạn là: ${code}. Mã này có tác dụng trong 5 phút</p>`,
    };
    const emailVerification = new EmailVerification({
      code,
      email,
    });
    await emailVerification.save().then(() => {
      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          return res.status(500).json({
            message: "Lỗi khi gửi mã xác nhận",
            error: {
              name: error.name,
              message: error.message || "Lỗi khi gửi mã xác nhận",
              stack: error.stack,
            },
          });
        }
        return res.status(200).json({
          message: "Đã gửi mã xác nhận. Vui lòng kiểm tra email",
          info,
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: {
        name: error.name,
        message: error.message || "Lỗi khi gửi mã xác minh email",
        stack: error.stack,
      },
    });
  }
});

router.put("/refresh-token", async (req, res) => {
  try {
    //Cách 1: Cookie
    const refreshTokenFromCookie = req.cookies?.RfT;
    //Cách 2: localStorage
    // const refreshTokenFromLocalStorage = req.body?.refreshToken;
    // verify
    const refreshTokenDecoded = await verifyToken({
      token: refreshTokenFromCookie,
      secretSignature: process.env.REFRESH_TOKEN,
    });

    // middleware đã lưu thông tin user vào req.jwtDecoded
    const payload = {
      _id: refreshTokenDecoded._id,
    };

    const accessToken = await signToken(payload, process.env.JWT_SECRET, "1h");

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/logout", (req, res) => {
  try {
    res.clearCookie("AcT", {
      path: "/",
      sameSite: "None",
      secure: true, // Đảm bảo rằng bạn đặt thuộc tính Secure
    });
    res.clearCookie("RfT", {
      path: "/",
      sameSite: "None",
      secure: true,
    });
    res.sendStatus(200);
    return;
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
