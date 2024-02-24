// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  publications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publication",
    },
  ],
  subscriptions: [
    {
      publication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Publication",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("remove", async function (next) {
  try {
    // Access the user's subscriptions and remove them
    await mongoose.model("Subscription").deleteMany({ user: this._id });
    next();
  } catch (error) {
    next(error);
  }
});
const User = mongoose.model("User", userSchema);

module.exports = User;
