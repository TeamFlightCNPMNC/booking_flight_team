require("dotenv").config();
const jwt = require("jsonwebtoken");

const signToken = async (payload, key, exp) => {
  try {
    return jwt.sign(payload, key, {
      expiresIn: exp,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const verifyToken = async ({ token, secretSignature }) => {
  // if (!req.headers["authorization"]) {
  //   console.log("Authorization header missing");
  //   return next(createError.Unauthorized());
  // }
  // const authHeader = req.headers["authorization"];
  // const bearerToken = authHeader.split(" ");
  // const token = bearerToken[1];

  // console.log("Token received:", token);

  // JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
  //   if (err) {
  //     console.log("JWT verification error:", err);
  //     return next(createError.Unauthorized());
  //   }
  //   req.payload = payload;
  //   next();
  // });
  try {
    return jwt.verify(token, secretSignature);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { signToken, verifyToken };
