const express = require("express");
const router = express.Router();
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Ensure data directory exists
const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const storePath = path.join(dataDir, "stores.xlsx");

// Helper: Read stores
function readStores() {
  if (!fs.existsSync(storePath)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(wb, ws, "Stores");
    XLSX.writeFile(wb, storePath);
  }
  const wb = XLSX.readFile(storePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws);
}

// Helper: Write stores
function writeStores(stores) {
  const ws = XLSX.utils.json_to_sheet(stores);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stores");
  XLSX.writeFile(wb, storePath);
}

// GET all stores
router.get("/", (req, res) => {
  try {
    const stores = readStores();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: "Failed to load stores", details: err.message });
  }
});

// POST add store
router.post("/", (req, res) => {
  try {
    const newStore = req.body;
    if (!newStore || !newStore.name || !newStore.type) {
      return res.status(400).json({ error: "Missing store name or type" });
    }
    const stores = readStores();
    stores.push(newStore);
    writeStores(stores);
    res.status(201).json({ message: "Store added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save store", details: err.message });
  }
});

// PUT update store at index
router.put("/:index", (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const stores = readStores();
    if (index < 0 || index >= stores.length) {
      return res.status(404).json({ error: "Store not found" });
    }
    stores[index] = req.body;
    writeStores(stores);
    res.json({ message: "Store updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update store", details: err.message });
  }
});

// DELETE store at index
router.delete("/:index", (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const stores = readStores();
    if (index < 0 || index >= stores.length) {
      return res.status(404).json({ error: "Store not found" });
    }
    stores.splice(index, 1);
    writeStores(stores);
    res.json({ message: "Store deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete store", details: err.message });
  }
});

// EXPORT Excel file
router.get("/export", (req, res) => {
  try {
    if (!fs.existsSync(storePath)) {
      return res.status(404).send("No store data available");
    }
    res.download(storePath);
  } catch (err) {
    res.status(500).json({ error: "Failed to export store data", details: err.message });
  }
});

module.exports = router;
