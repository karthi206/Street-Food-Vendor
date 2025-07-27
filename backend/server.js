const express = require("express");
const app = express();
const cors = require("cors");
const vendors = require("./data/vendors.json");

app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Welcome to Street Food Vendor API – backend is running.");
});

app.get("/api/vendors", (req, res) => {
  res.json(vendors);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});