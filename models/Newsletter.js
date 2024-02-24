// models/Newsletter.js

const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  publication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publication",
    required: true,
  },
  sentDate: {
    type: Date,
    default: null,
  },
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

module.exports = Newsletter;
