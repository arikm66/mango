const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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

// 2. API Routes
app.post('/api/items', async (req, res) => {
  const newItem = new Item({ content: req.body.content });
  await newItem.save();
  res.json(newItem);
});

app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// 3. Serve Frontend (Vite specific)
// This part tells Node to serve the React files after you run 'npm run build' in the client folder
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the Vite build folder
  app.use(express.static(path.join(__dirname, 'client/dist')));

  // Handle any requests that don't match the ones above by sending back the index.html file
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));