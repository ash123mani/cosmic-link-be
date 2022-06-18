const { v4: uuidv4 } = require("uuid");

const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.getUserData = async (req, res, next) => {
  try {
    const { user } = req;
    const userData = await User.findById(user._id);

    res.status(200).json({
      success: true,
      user: userData.toClient(),
    });
  } catch (error) {
    next(error);
  }
};

exports.addCategory = async (req, res, next) => {
  try {
    const {
      user: { _id: userId },
      body: { name },
    } = req;

    if (!name || (name && name.length < 3)) {
      return next(
        new ErrorResponse(
          "Category name should be at least 3 characters long",
          400
        )
      );
    }

    const user = await User.findOneAndUpdate(
      { userId },
      {
        $push: {
          categories: {
            name,
            id: uuidv4(),
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return next(new ErrorResponse("Please retry again", 404));
    }

    const userData = user.toClient();
    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};
