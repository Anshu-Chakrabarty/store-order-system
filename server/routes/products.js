const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const filePath = path.join(__dirname, "../data/products.xlsx");

// Helper: load all products
function loadProducts() {
  if (!fs.existsSync(filePath)) return [];
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws);
}

// Helper: save all products
function saveProducts(data) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");
  XLSX.writeFile(wb, filePath);
}

// GET all products
router.get("/", (req, res) => {
  const data = loadProducts();
  res.json(data);
});

// POST new product
router.post("/", (req, res) => {
  const products = loadProducts();
  products.push(req.body);
  saveProducts(products);
  res.sendStatus(200);
});

// PUT (update) product at index
router.put("/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const products = loadProducts();
  if (index >= 0 && index < products.length) {
    products[index] = req.body;
    saveProducts(products);
    res.sendStatus(200);
  } else {
    res.status(404).send("Product not found");
  }
});

// DELETE product at index
router.delete("/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const products = loadProducts();
  if (index >= 0 && index < products.length) {
    products.splice(index, 1);
    saveProducts(products);
    res.sendStatus(200);
  } else {
    res.status(404).send("Product not found");
  }
});

module.exports = router;
