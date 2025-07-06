const express = require("express");
const router = express.Router();
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const orderDir = path.join(__dirname, "../data/orders");

// Ensure orders directory exists
if (!fs.existsSync(orderDir)) {
  fs.mkdirSync(orderDir, { recursive: true });
}

// GET summary of all orders per store
router.get("/", (req, res) => {
  try {
    const files = fs.readdirSync(orderDir).filter(f => f.endsWith(".xlsx"));

    let totalOrders = 0;
    let storeStats = [];

    files.forEach(file => {
      const storeName = file.replace(".xlsx", "");
      const filePath = path.join(orderDir, file);
      const wb = XLSX.readFile(filePath);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const orders = XLSX.utils.sheet_to_json(ws);

      storeStats.push({
        store: storeName,
        orderCount: orders.length,
        delivered: orders.filter(o => o.status === "Delivered").length,
        preparing: orders.filter(o => o.status === "Preparing").length,
        pending: orders.filter(o => o.status === "Pending").length
      });

      totalOrders += orders.length;
    });

    res.json({
      totalStores: storeStats.length,
      totalOrders,
      storeStats
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate summary", details: err.message });
  }
});

module.exports = router;
