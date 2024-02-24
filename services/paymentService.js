// services/paymentService.js

const Razorpay = require("razorpay");

// Initialize Razorpay client with your API key and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Function to create a payment order
exports.createPaymentOrder = async (amount, currency, receipt, notes) => {
  try {
    // Validate input parameters
    if (!amount || !currency || !receipt) {
      throw new Error("Invalid input parameters");
    }

    // Create payment order
    const paymentOrder = await razorpay.orders.create({
      amount, // Payment amount in smallest currency unit (e.g., paisa for INR)
      currency, // Payment currency (e.g., INR)
      receipt, // Unique identifier for the payment (e.g., order ID)
      notes, // Additional notes or metadata for the payment (optional)
    });

    return paymentOrder;
  } catch (error) {
    console.error("Error creating payment order:", error);
    throw new Error("Failed to create payment order");
  }
};

// Function to verify payment success
exports.verifyPayment = async (orderId, paymentId, signature) => {
  try {
    // Validate input parameters
    if (!orderId || !paymentId || !signature) {
      throw new Error("Invalid input parameters");
    }

    // Verify payment signature
    const isValidSignature = razorpay.webhooks.validateSignature(
      orderId + "|" + paymentId,
      signature
    );

    if (!isValidSignature) {
      throw new Error("Invalid payment signature");
    }

    // Retrieve payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    if (
      !payment ||
      payment.order_id !== orderId ||
      payment.status !== "captured"
    ) {
      throw new Error("Payment verification failed");
    }

    // Payment is successful, return payment details
    return payment;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw new Error("Failed to verify payment");
  }
};
