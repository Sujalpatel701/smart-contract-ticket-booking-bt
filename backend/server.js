const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// Define Mongoose Schema
const TicketSchema = new mongoose.Schema({
  name: String,
  movie: String,
  quantity: Number,
  transactionId: String, // Add transaction ID
});

const Ticket = mongoose.model("Ticket", TicketSchema);

// 🎟️ Purchase Ticket Route
app.post("/api/tickets/purchase", async (req, res) => {
  try {
    const { name, movie, quantity, transactionId } = req.body;

    if (!name || !movie || !transactionId) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const newPurchase = new Ticket({ name, movie, quantity, transactionId });
    await newPurchase.save();

    res.json({ message: "Ticket purchased successfully!", purchase: newPurchase });
  } catch (error) {
    console.error("❌ Error processing ticket purchase:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🎫 Get All Purchases (Admin View)
app.get("/api/tickets/purchases", async (req, res) => {
  try {
    const purchases = await Ticket.find();
    res.json(purchases);
  } catch (error) {
    console.error("❌ Error fetching purchases:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
