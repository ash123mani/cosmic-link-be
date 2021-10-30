const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  linkUrl: {
    type: String,
    required: [true, "Please provide a link"],
    match: [
      /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/,
      "Please provide a valid link"
    ],
  },
  category: {
    type: String,
    required: [true, "Please provide a valid category"],
    minlength: 3,
  },
  description: {
    type: String,
    required: [false, "Please provide a valid description"],
    minlength: 12,
  },
  userId: mongoose.Types.ObjectId,
});

LinkSchema.methods.toClient = function() {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  
  return obj;
}

const Link = mongoose.model("Link", LinkSchema);

module.exports = Link;
