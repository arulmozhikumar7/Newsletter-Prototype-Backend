// routes/publicationRoutes.js

const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publicationController");

// POST request to create a new publication
router.post("/", publicationController.createPublication);

// GET request to retrieve all publications
router.get("/", publicationController.getAllPublications);

// GET request to retrieve a single publication by ID

// PUT request to update a publication by ID

router.get("/:authorId", publicationController.getAllPublicationsByAuthorId);
// DELETE request to delete a publication by ID
router.delete("/:id", publicationController.deletePublication);

module.exports = router;
