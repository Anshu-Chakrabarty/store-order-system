const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

// Ensure /data directory exists
const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const filePath = path.join(dataDir, "products.xlsx");

// Helper: Load products
function loadProducts() {
  if (!fs.existsSync(filePath)) return [];
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws);
}

// Helper: Save products
function saveProducts(data) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");
  XLSX.writeFile(wb, filePath);
}

// GET all products
router.get("/", (req, res) => {
  try {
    const data = loadProducts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to load products" });
  }
});

// POST new product
router.post("/", (req, res) => {
  try {
    const products = loadProducts();
    products.push(req.body);
    saveProducts(products);
    res.status(201).json({ message: "Product added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save product" });
  }
});

// PUT update product at index
router.put("/:index", (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const products = loadProducts();
    if (index >= 0 && index < products.length) {
      products[index] = req.body;
      saveProducts(products);
      res.json({ message: "Product updated" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product at index
router.delete("/:index", (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const products = loadProducts();
    if (index >= 0 && index < products.length) {
      products.splice(index, 1);
      saveProducts(products);
      res.json({ message: "Product deleted" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
