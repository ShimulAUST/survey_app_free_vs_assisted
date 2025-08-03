const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Fix CORS (MUST be before any routes)
app.use(cors({
  origin: 'http://localhost:3000',  // use 3000 or 3002 depending on frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Simple root route
app.get('/', (req, res) => {
  res.send('Consent API is running');
});

// ✅ Consent API routes
const consentRoutes = require('./routes/consent');
app.use('/api/consent', consentRoutes);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
