const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const orderDir = path.join(__dirname, '../data/orders');

router.post('/', (req, res) => {
  const { storeName, orderData } = req.body;
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
  const newSheet = XLSX.utils.json_to_sheet(existing);
  workbook.Sheets[workbook.SheetNames[0]] = newSheet;
  XLSX.writeFile(workbook, filePath);

  res.status(200).json({ message: 'Order saved' });
});

router.get('/:store', (req, res) => {
  const store = req.params.store;
  const filePath = path.join(orderDir, `${store}.xlsx`);
  if (!fs.existsSync(filePath)) return res.json([]);
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const orders = XLSX.utils.sheet_to_json(ws);
  res.json(orders);
});

module.exports = router;
