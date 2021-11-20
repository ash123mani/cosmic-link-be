const User = require("../models/User");

exports.getUserData = async (req, res, next) => {
  try {
    const { user } = req
    const userData = await User.findById(user._id)

    res.status(200).json({
      success: true,
      user: userData.toClient(),
    })
  } catch (error) {
    next(error);
  }
}
