const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  linkUrl: {
    type: String,
    required: [true, "Please provide a link"],
    match: [
      /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/,
      "Please provide a valid link"
    ]
  },
  category: {
    type: String,
    required: [true, "Please provide a valid category"]
  },
  meta: String,
  userId: mongoose.Types.ObjectId,
});

const Link = mongoose.model("Link", LinkSchema);

module.exports = Link;
