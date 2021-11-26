const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const ogs = require("open-graph-scraper");

const Link = require("../models/Link");
const ErrorResponse = require("../utils/errorResponse");
const parseLinkMeta = require("../parser/link");

//get

exports.addLink = async (req, res, next) => {
  let {
    user,
    body: {
      linkUrl,
      title,
      description,
      category,
      imageUrl,
      siteName,
    },
  } = req;

  try {
    if(!category.name || !category.id) {
      return next(
        new ErrorResponse("Please add a valid category", 400)
      );
    }

    const link = await Link.create({
      linkUrl,
      category,
      description,
      userId: user._id,
      title,
      imageUrl,
      siteName,
    });
    const linkData = link.toClient();
    res.status(200).json({
      success: true,
      link: linkData,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteLink = async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;

  if (!mongoose.isValidObjectId(id)) {
    return next(
      new ErrorResponse("Please pass a valid link id for delete", 404)
    );
  }

  try {
    const link = await Link.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!link) {
      return next(new ErrorResponse("No such link exists"), 404);
    }

    res.status(200).json({
      success: true,
      message: "Link delete successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLink = async (req, res, next) => {
  const {
    params: { id },
    user,
    body: { description, category },
  } = req;

  if (!mongoose.isValidObjectId(id)) {
    return next(
      new ErrorResponse(
        "Please pass a valid link id for updaing this link",
        404
      )
    );
  }

  try {
    const link = await Link.findOneAndUpdate(
      { _id: id, userId: user._id },
      { $set: { description, category } },
      { new: true }
    );

    if (!link) {
      return next(new ErrorResponse("No such link exists for updating", 404));
    }

    const linkData = link.toClient();
    res.status(200).json({
      success: true,
      link: linkData,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLinkMeta = async (req, res, next) => {
  try {
    const { linkUrl } = req.body;
    const data = await ogs({ url: linkUrl, timeout: 10000 });
    const { error, result } = data;

    if (error) {
      return next(new ErrorResponse("Unable to get data"));
    }

    const parsedResult = parseLinkMeta(result);
    res.status(200).json({
      success: true,
      meta: parsedResult,
    });
  } catch (error) {
    next(error);
  }
};
