const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const LinkSchema = new Schema({
  linkUrl: {
    type: String,
    required: [true, "Please provide a link"],
    match: [
      /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/,
      "Please provide a valid link",
    ],
  },
  category: {
    type: Schema.Types.Mixed,
    required: [true, "Please provide a valid category"],
  },
  description: {
    type: String,
    required: [false, "Please provide a valid description"],
    minlength: 12,
  },
  title: {
    type: String,
    required: [true, "Please provide a valid title"],
  },
  siteName: String,
  imageUrl: String,
  userId: mongoose.Types.ObjectId,
});

LinkSchema.methods.toClient = function () {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
};

const Link = model("Link", LinkSchema);

module.exports = Link;
