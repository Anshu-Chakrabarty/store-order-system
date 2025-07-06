const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Base Directories
const ordersDir = path.join(__dirname, '../data/orders');
const paymentsDir = path.join(__dirname, '../data/payments');
const baseDataDir = path.join(__dirname, '../data');

// Ensure directories exist
[ordersDir, paymentsDir, baseDataDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Download order Excel file
router.get('/orders/:store', (req, res) => {
  try {
    const store = req.params.store;
    const filePath = path.join(ordersDir, `${store}.xlsx`);
    if (!fs.existsSync(filePath)) return res.status(404).send('Order file not found');
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download order file', details: err.message });
  }
});

// Download payments Excel file
router.get('/payments/:store', (req, res) => {
  try {
    const store = req.params.store;
    const filePath = path.join(paymentsDir, `${store}_Payments.xlsx`);
    if (!fs.existsSync(filePath)) return res.status(404).send('Payment file not found');
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download payment file', details: err.message });
  }
});

// Download stores master file
router.get('/stores', (req, res) => {
  try {
    const filePath = path.join(baseDataDir, 'stores.xlsx');
    if (!fs.existsSync(filePath)) return res.status(404).send('Stores file not found');
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download stores file', details: err.message });
  }
});

// Download products master file
router.get('/products', (req, res) => {
  try {
    const filePath = path.join(baseDataDir, 'products.xlsx');
    if (!fs.existsSync(filePath)) return res.status(404).send('Products file not found');
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download products file', details: err.message });
  }
});

module.exports = router;
