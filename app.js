// app.js

const express = require("express");

const db = require("./config/db");
require("dotenv").config();

// Import routes
const routes = require("./routes");

// Create Express app
const app = express();
const cors = require("cors");
// Middleware
app.use(express.json());
app.use(cors());
// Connect to MongoDB
db.connect()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api", routes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
