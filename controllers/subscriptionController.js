// controllers/subscriptionController.js

const Publication = require("../models/Publication");
const User = require("../models/User");

// Subscribe to a publication
exports.subscribeToPublication = async (req, res) => {
  try {
    const publicationId = req.params.id;
    const userId = req.body;
    const user = await User.findById(userId).populate(
      "subscriptions.publication"
    );
    const isAlreadySubscribed = user.subscriptions.some((sub) =>
      sub.publication._id.equals(publicationId)
    );

    if (isAlreadySubscribed) {
      return res
        .status(400)
        .json({ message: "User is already subscribed to this publication" });
    }

    // Subscribe the user to the publication
    const publication = await Publication.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }

    user.subscriptions.push({ publication });
    await user.save();

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Unsubscribe from a publication
exports.unsubscribeFromPublication = async (req, res) => {
  try {
    const publicationId = req.params.id;
    const userId = req.user._id; // Assuming you're using authentication middleware

    // Unsubscribe the user from the publication
    await User.findByIdAndUpdate(userId, {
      $pull: { subscriptions: { publication: publicationId } },
    });

    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
