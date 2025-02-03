const express = require("express");
const connectDB = require("./db");
const codeBinRoutes = require("./routes/codeBinRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json()); // Middleware to parse JSON

// API Routes
app.use("/api/codebins", codeBinRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
