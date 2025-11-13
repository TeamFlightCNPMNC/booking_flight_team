const checkAdmin = (req, res, next) => {
  const accessTokenDecoded = req.jwtDecoded;
  const _id = accessTokenDecoded._id;

  if (_id !== process.env.ID_ADMIN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

module.exports = checkAdmin;
