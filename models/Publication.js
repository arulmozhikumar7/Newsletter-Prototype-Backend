// models/Publication.js

const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  newsletters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Newsletter",
    },
  ],
});

const Publication = mongoose.model("Publication", publicationSchema);

module.exports = Publication;
