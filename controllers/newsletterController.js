// controllers/newsletterController.js

const Newsletter = require("../models/Newsletter");
const Publication = require("../models/Publication");

const User = require("../models/User");
const nodemailer = require("nodemailer");

// Create a new newsletter
exports.createNewsletter = async (req, res) => {
  try {
    const { title, content } = req.body;
    const publicationId = req.params.id;

    const publication = await Publication.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }

    const newsletter = new Newsletter({
      title,
      content,
      publication: publicationId,
    });

    await newsletter.save();
    publication.newsletters.push(newsletter._id);
    await publication.save();

    res.status(201).json({ message: "Newsletter created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all newsletters for a publication
exports.getAllNewslettersByPublication = async (req, res) => {
  try {
    const publicationId = req.params.id;

    const newsletters = await Newsletter.find({ publication: publicationId });

    res.status(200).json(newsletters);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
exports.sendNewsletterEmails = async (req, res) => {
  try {
    const newsletterId = req.params.id;

    // Fetch newsletter details
    const newsletter = await Newsletter.findById(newsletterId).populate(
      "publication"
    );
    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    // Fetch all subscribers for the publication
    const publication = newsletter.publication;
    const subscribers = publication.subscribers;
    if (!subscribers || subscribers.length === 0) {
      return res
        .status(404)
        .json({ message: "No subscribers found for the publication" });
    }

    // Fetch newsletter content
    const htmlContent = newsletter.content; // Assuming newsletter.content is HTML

    // Set up Nodemailer transporter with SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "arulmozhikumar7@gmail.com",
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send newsletter email to each subscriber
    for (const subscriberId of subscribers) {
      try {
        // Fetch subscriber details
        const subscriber = await User.findById(subscriberId);
        if (subscriber) {
          await transporter.sendMail({
            from: "arulmozhikumar7@gmail.com",
            to: subscriber.email,
            subject: newsletter.title,
            html: htmlContent,
          });
          console.log(`Newsletter sent to ${subscriber.email}`);
        } else {
          console.error(`Subscriber with ID ${subscriberId} not found`);
        }
      } catch (error) {
        console.error(
          `Error sending newsletter to subscriber ${subscriberId}:`,
          error
        );
      }
    }

    res
      .status(200)
      .json({ message: "Newsletter sent successfully to all subscribers" });
  } catch (error) {
    console.error("Error sending newsletter emails:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
