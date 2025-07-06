const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const orderDir = path.join(__dirname, '../data/orders');

// Ensure the order directory exists
if (!fs.existsSync(orderDir)) {
  fs.mkdirSync(orderDir, { recursive: true });
}

// POST - Save new order
router.post('/', (req, res) => {
  try {
    const { storeName, orderData } = req.body;

    if (!storeName || !orderData) {
      return res.status(400).json({ error: 'Missing storeName or orderData' });
    }

    const filePath = path.join(orderDir, `${storeName}.xlsx`);

    let workbook, worksheet;
    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
      workbook = XLSX.utils.book_new();
      worksheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    }

    const existing = XLSX.utils.sheet_to_json(worksheet);
    existing.push(orderData);

    const updatedSheet = XLSX.utils.json_to_sheet(existing);
    workbook.Sheets[workbook.SheetNames[0]] = updatedSheet;
    XLSX.writeFile(workbook, filePath);

    res.status(200).json({ message: '✅ Order saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save order', details: err.message });
  }
});

// GET - Retrieve all orders for a store
router.get('/:store', (req, res) => {
  try {
    const store = req.params.store;
    const filePath = path.join(orderDir, `${store}.xlsx`);

    if (!fs.existsSync(filePath)) return res.json([]);

    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const orders = XLSX.utils.sheet_to_json(ws);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load orders', details: err.message });
  }
});

module.exports = router;
