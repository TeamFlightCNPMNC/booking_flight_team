require("dotenv").config();
const { verifyToken } = require("../service/JWT");

const authorization = async (req, res, next) => {
  const accessTokenFrHeader = req.headers["authorization"];

  if (!accessTokenFrHeader || !accessTokenFrHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "authorization" });
  }

  try {
    const token = accessTokenFrHeader.substring(7);
    const accessTokenDecoded = await verifyToken({
      token,
      secretSignature: process.env.JWT_SECRET,
    });

    req.jwtDecoded = accessTokenDecoded;

    next();
  } catch (error) {
    if (
      error.message?.includes("jwt expired") ||
      error.message?.includes("TokenExpiredError")
    ) {
      return res.status(400).json({
        error: {
          name: error.name,
          message: error.message || "",
          stack: error.stack,
        },
      });
    }

    return res.status(401).json({ message: "TokenInvalid" });
  }
};

module.exports = { authorization };
