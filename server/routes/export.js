const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const ordersDir = path.join(__dirname, '../data/orders');
const paymentsDir = path.join(__dirname, '../data/payments');
const baseDataDir = path.join(__dirname, '../data');

// Download order Excel file
router.get('/orders/:store', (req, res) => {
  const store = req.params.store;
  const filePath = path.join(ordersDir, `${store}.xlsx`);
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
  res.download(filePath);
});

// Download payments Excel file
router.get('/payments/:store', (req, res) => {
  const store = req.params.store;
  const filePath = path.join(paymentsDir, `${store}_Payments.xlsx`);
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
  res.download(filePath);
});

// Download stores master file
router.get('/stores', (req, res) => {
  const filePath = path.join(baseDataDir, 'stores.xlsx');
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
  res.download(filePath);
});

// Download products master file
router.get('/products', (req, res) => {
  const filePath = path.join(baseDataDir, 'products.xlsx');
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
  res.download(filePath);
});

module.exports = router;
