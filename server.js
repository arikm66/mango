const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Serve frontend

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// 1. Simple Model Schema
const ItemSchema = new mongoose.Schema({
  content: String,
  date: { type: Date, default: Date.now }
});
const Item = mongoose.model('Item', ItemSchema);

// 2. Routes
app.post('/api/items', async (req, res) => {
  const newItem = new Item({ content: req.body.content });
  await newItem.save();
  res.json(newItem);
});

app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));