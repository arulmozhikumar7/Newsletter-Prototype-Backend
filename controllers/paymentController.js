// controllers/paymentController.js

const PaymentService = require("../services/paymentService");
const Publication = require("../models/Publication");
const User = require("../models/User");

// Handle payment success webhook
exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // Verify payment details (implementation depends on your payment gateway)
    const paymentDetails = await PaymentService.verifyPayment(
      orderId,
      paymentId,
      signature
    );

    // Retrieve user ID from payment details (assuming you pass user ID during payment)
    const userId = paymentDetails.userId;

    // Retrieve publication ID and subscription duration from payment details
    const { publicationId, subscriptionDuration } = paymentDetails;

    // Calculate subscription end date
    const subscriptionStartDate = new Date();
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(
      subscriptionEndDate.getMonth() + subscriptionDuration
    );

    // Update user's subscription status with start and end dates
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        subscriptions: {
          publication: publicationId,
          subscriptionStartDate,
          subscriptionEndDate,
        },
      },
    });

    // Add user to subscribers of the publication
    await Publication.findByIdAndUpdate(publicationId, {
      $addToSet: { subscribers: userId },
    });

    res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
