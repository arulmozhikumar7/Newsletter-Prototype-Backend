// controllers/publicationController.js

const Publication = require("../models/Publication");
const User = require("../models/User");

// Create a new publication
exports.createPublication = async (req, res) => {
  try {
    const { name, description, author } = req.body;

    // Check if the user is authorized (optional)
    // For example, ensure that only authenticated users can create publications
    // You may also want to check if the user is an author or has specific permissions

    // Create a new publication
    const publication = new Publication({
      name,
      description,
      author, // Assuming you're using authentication middleware to attach user information to the request
    });

    await publication.save();
    const user = await User.findById(author); // Assuming author is the user's ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.publications.push(publication);
    await user.save();
    res.status(201).json(publication);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all publications
exports.getAllPublications = async (req, res) => {
  try {
    const publications = await Publication.find().populate(
      "author",
      "username"
    );

    res.status(200).json(publications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single publication by ID
exports.getPublicationById = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }

    res.status(200).json(publication);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a publication
exports.deletePublication = async (req, res) => {
  try {
    let publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }
    await Publication.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Publication deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getAllPublicationsByAuthorId = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    // Find all publications where the author field matches the provided author ID
    const publications = await Publication.find({ author: authorId });

    res.status(200).json(publications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
