const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Transaction = require("./models/transactions.js");
const { default: mongoose } = require("mongoose");
const app = express();

const port = 4000;

// Use CORS for security reasons
app.use(cors());

// Middlware for processing JSON incoming data
app.use(express.json());

// Test express application HTTP GET request
app.get("/api/test", (req, res) => {
  res.json({message: 'test ok'});
});

// Post transaction to MongoDB
app.post("/api/transaction", async (req, res) => {
  try {
    // Try to Connect to MongoDB
    console.log("Connecting to MongoDB database...");
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB database connected successfully!");

    // Check if all required fields are present in the request body
    if (!req.body.name || !req.body.description || !req.body.datetime || !req.body.price) {
      res.status(400).send("Missing required fields");
      return;
    }

    // Create a new transaction with the data from the request body
    const { name, description, datetime, price } = req.body;
    const transaction = await Transaction.create({
      name,
      description,
      datetime,
      price,
    });

    // Return transaction to the console
    res.json(transaction);
  } catch (error) {
    // Print error if unable to post transaction to the DB
    console.error("Error connecting to MongoDB database:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get transactions from MongoDB
app.get("/api/transactions", async (req, res) => {
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    
    // Find all transactions in DB
    const transactions = await Transaction.find();
    
    // Return all transactions
    res.json(transactions);
});

// Static Port (port 400)
app.listen(port);
