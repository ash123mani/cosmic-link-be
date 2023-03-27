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
      user: { _id },
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
      { _id },
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

exports.deleteCategory = async (req, res, next) => {
  try {
    const {
      user,
      params: { id },
    } = req;
    const { categories, _id } = user

    if (categories.length === 1) {
      return next(new ErrorResponse("You cannot delete the last category"));
    }

    const query = await User.updateOne(
      { _id },
      { $pull: { categories: { id } } }
    );

    if (!query.modifiedCount) {
      return next(new ErrorResponse("No such category exits", 404));
    }

    const updateUserData = await User.findById(_id);
    const userData = updateUserData.toClient();
    res.status(200).json({
      success: true,
      user: userData,
    });

  } catch (error) {
    next(error);
  }
};
