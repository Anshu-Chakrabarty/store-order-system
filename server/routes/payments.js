const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const payDir = path.join(__dirname, '../data/payments');

// Ensure payment directory exists
if (!fs.existsSync(payDir)) {
  fs.mkdirSync(payDir, { recursive: true });
}

// POST - Save new payment
router.post('/', (req, res) => {
  try {
    const payment = req.body;

    if (!payment.storeName || !payment.amount || !payment.customer) {
      return res.status(400).json({ error: 'Missing required payment fields.' });
    }

    const filePath = path.join(payDir, `${payment.storeName}_Payments.xlsx`);

    let workbook, worksheet;
    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
      workbook = XLSX.utils.book_new();
      worksheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
    }

    const existing = XLSX.utils.sheet_to_json(worksheet);
    existing.push(payment);

    const updatedSheet = XLSX.utils.json_to_sheet(existing);
    workbook.Sheets[workbook.SheetNames[0]] = updatedSheet;
    XLSX.writeFile(workbook, filePath);

    res.status(200).json({ message: 'Payment saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save payment', details: err.message });
  }
});

// GET - Retrieve payments for a store
router.get('/:store', (req, res) => {
  try {
    const store = req.params.store;
    const filePath = path.join(payDir, `${store}_Payments.xlsx`);

    if (!fs.existsSync(filePath)) return res.json([]);

    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load payments', details: err.message });
  }
});

module.exports = router;
