const nodemailer = require("nodemailer");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Set to true if your SMTP server requires a secure connection (SSL/TLS)
  auth: {
    user: "arulmozhikumar7@gmail.com",
    pass: "tvkImS8MV4WX9qdH",
  },
});

// Example usage: Send an email
const mailOptions = {
  from: "arulmozhikumar7@gmail.com",
  to: "arul27032004@gmail.com",
  subject: "Test Email",
  text: "This is a test email sent using Nodemailer.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email:", error);
  } else {
    console.log("Email sent:", info.response);
  }
});
