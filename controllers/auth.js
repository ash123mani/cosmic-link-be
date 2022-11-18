const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return next(
      new ErrorResponse("User already exist with this email", 400)
    );
  }

  if (!username || !email || !password) {
    return next(
      new ErrorResponse("Please provide name, email and password", 400)
    );
  }

  try {
    const user = await User.create({
      username,
      email,
      password,
      categories: [
        { name: "Articles", id: uuidv4() },
        { name: "Music", id: uuidv4() },
        { name: "Videos", id: uuidv4() },
        { name: "Others", id: uuidv4() },
      ],
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.forgotpassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new ErrorResponse(
          "Resetpassword link could not be sent. Something not going good.",
          404
        )
      );
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:8080/resetpassword/${resetToken}`;

    const message = `
      <h1>You have requested for password reset</h1>
      <p>Please go to link to reset the your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</1>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({
        success: true,
        message: `We have sent an resetpassword link to  ${user.email}`,
        email: user.email,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      return next(
        new ErrorResponse(
          "Resetpassword link could not be sent. Something not going good.",
          500
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.resetpassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful, now login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = async (user, statusCode, res) => {
  const token = await user.getSignedToken();
  const userData = await user.toClient();
  res.status(statusCode).json({
    success: true,
    token,
    user: userData,
  });
};
