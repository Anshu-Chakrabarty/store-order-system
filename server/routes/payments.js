const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const payDir = path.join(__dirname, '../data/payments');

router.post('/', (req, res) => {
  const payment = req.body;
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
  const newSheet = XLSX.utils.json_to_sheet(existing);
  workbook.Sheets[workbook.SheetNames[0]] = newSheet;
  XLSX.writeFile(workbook, filePath);

  res.status(200).json({ message: 'Payment saved' });
});

router.get('/:store', (req, res) => {
  const filePath = path.join(payDir, `${req.params.store}_Payments.xlsx`);
  if (!fs.existsSync(filePath)) return res.json([]);
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws);
  res.json(data);
});

module.exports = router;
