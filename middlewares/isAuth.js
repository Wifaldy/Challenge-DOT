const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header) {
      throw {
        status: 401,
        message: "Authorization denied",
      };
    }
    const token = header.split(" ")[1];
    if (!token) {
      throw {
        status: 401,
        message: "Unauthorized",
      };
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw {
          status: 401,
          message: "Invalid token",
        };
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    next(err);
  }
};
