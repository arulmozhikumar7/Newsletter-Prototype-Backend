// routes/newsletterRoutes.js

const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletterController");

// Create a new newsletter for a publication
router.post("/:id", newsletterController.createNewsletter);

// Get all newsletters for a publication
router.get("/:id", newsletterController.getAllNewslettersByPublication);

// Send newsletter emails
router.post(
  "/send-to-subscribers/:id",
  newsletterController.sendNewsletterEmails
);

module.exports = router;
