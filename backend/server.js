const express = require('express');
const cors = require('cors');
const vendors = require('./data/vendors.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/vendors', (req, res) => {
  res.json(vendors);
});
app.get("/", (req, res) => {
  res.send("Welcome to the Street Food Vendor API 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});