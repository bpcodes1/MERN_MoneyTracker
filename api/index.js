// const express = require('express')
// const cors = require('cors');
// require('dotenv').config();
// const Transaction = require('./models/transactions.js');
// const { default: mongoose } = require('mongoose');
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get('/api/test', (req, res) => {
//     res.json({ message: 'test ok'});
// });

// app.post('/api/transaction', async (req, res) => {
//     await mongoose.connect(process.env.MONGO_URL);
//     const {price, name, description, datetime} = req.body;
    
//     const transaction = await Transaction.create({price, name, description, datetime});
//     res.json(transaction);
// });

// app.listen(4000, () => {
//     console.log(`Server is running on port 4000`)
// });
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Transaction = require("./models/transactions.js");
const { default: mongoose } = require("mongoose");
const app = express();

const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({message: 'test ok'});
});

app.post("/api/transaction", async (req, res) => {
  try {
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

    res.json(transaction);
  } catch (error) {
    console.error("Error connecting to MongoDB database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/transactions", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();
  res.json(transactions);
});

// Static Port
app.listen(port);

// console.log(`App listening on port http://localhost:${port}${url}`);

// // Dynamic Port
// const server = app.listen(0, () => {
//   const port = server.address().port;
//   console.log(`App listening on port http://localhost:${port}${url}`);
// });

// Note: to run the program run nodemon index.js