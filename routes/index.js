// routes/index.js
const Publication = require("../models/Publication");
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
require("dotenv").config();
const shortid = require("shortid");
// Import route handlers
const authRoutes = require("./authRoutes");
/*const paymentRoutes = require("./paymentRoutes");
const subscriptionRoutes = require("./subscriptionRoutes");*/
const newsletterRoutes = require("./newsletterRoutes");
const publicationRoutes = require("./publicationRoutes");
// Define routes
router.use("/auth", authRoutes);
/*router.use("/payment", paymentRoutes);
router.use("/subscription", subscriptionRoutes);*/
router.use("/newsletter", newsletterRoutes);
router.use("/publications", publicationRoutes);
router.post("/subscribe", async (req, res) => {
  try {
    const amount = 25000;
    // Create Razorpay order
    const order = await createRazorpayOrder(amount);
    res.json({ orderId: order.id, amount: amount });
  } catch (error) {
    console.error("Error subscribing:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle payment confirmation
router.post("/payment/confirm", async (req, res) => {
  try {
    const paymentId = req.body.paymentId;
    const publicationId = req.body.publicationId;
    const userId = req.body.userId;
    // Verify payment with Razorpay
    const payment = await verifyPayment(paymentId);
    // If payment successful, add user to publication's subscribers
    if (payment.status === "captured") {
      await addSubscriberToPublication(userId, publicationId);
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Payment not successful" });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Razorpay Integration

// Function to create Razorpay order
const createRazorpayOrder = async (amount) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });
  const options = {
    amount: amount,
    currency: "INR",
    receipt: shortid.generate(),
  };
  return razorpay.orders.create(options);
};

// Function to verify payment with Razorpay
const verifyPayment = async (paymentId) => {
  const razorpay = new Razorpay({
    key_id: "rzp_test_1RKKP5rJBqKpT4",
    key_secret: "X8BlADZRIipZaJXpTtKfR8yu",
  });
  return razorpay.payments.fetch(paymentId);
};

// Function to add subscriber to publication
const addSubscriberToPublication = async (userId, publicationId) => {
  try {
    // Find the publication by its ID
    const publication = await Publication.findById(publicationId);

    if (!publication) {
      throw new Error("Publication not found");
    }

    // Check if the user is already subscribed to the publication
    if (publication.subscribers.includes(userId)) {
      throw new Error("User is already subscribed");
    }

    // Add the user to the publication's list of subscribers
    publication.subscribers.push(userId);

    // Save the updated publication
    await publication.save();
    console.log(userId);
    console.log("User subscribed successfully");
  } catch (error) {
    console.error("Error adding subscriber to publication:", error.message);
    throw error; // Optional: rethrow the error to handle it elsewhere
  }
};
module.exports = router;
