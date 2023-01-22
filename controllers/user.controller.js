const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.postRegister = async (req, res, next) => {
  try {
    const { name, email, password1, password2, birthdate } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      throw {
        status: 400,
        message: "User already exist",
      };
    }
    if (password1 !== password2) {
      throw {
        status: 400,
        message: "Password doesnt match",
      };
    }
    const hashedPw = await bcrypt.hash(password1, 12);
    const createdUser = await User.create({
      name,
      email,
      password: hashedPw,
      birthdate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({
      user: createdUser,
      message: "User has been created",
    });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw {
        status: 404,
        message: "User not found",
      };
    }
    const isPasswordMatches = await bcrypt.compare(password, user.password);
    if (!isPasswordMatches) {
      throw {
        status: 401,
        message: "Email / password is wrong",
      };
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      token,
      message: "Login success",
    });
  } catch (err) {
    next(err);
  }
};
