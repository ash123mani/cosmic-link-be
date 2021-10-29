const Link = require("../models/Link");
const ErrorResponse = require("../utils/errorResponse");

//add,get,delete,update

exports.addLink = async (req, res, next) => {
  const { user, body: { linkUrl, category } } = req;

  if (!linkUrl) {
    return next(new ErrorResponse("Please enter a valid URL", 500));
  }

  try {
    const link = await Link.create({
      linkUrl,
      category,
      userId: user._id,
    });
    res.status(200).json({
      link,
    });
  } catch (error) {
    next(error);
  }
};
