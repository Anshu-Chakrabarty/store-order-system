const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const orderDir = path.join(__dirname, '../data/orders');

router.get('/', (req, res) => {
  const files = fs.readdirSync(orderDir).filter(f => f.endsWith('.xlsx'));
  let totalOrders = 0;
  let storeStats = [];

  files.forEach(file => {
    const name = file.replace('.xlsx', '');
    const wb = XLSX.readFile(path.join(orderDir, file));
    const ws = wb.Sheets[wb.SheetNames[0]];
    const orders = XLSX.utils.sheet_to_json(ws);

    storeStats.push({
      store: name,
      orderCount: orders.length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      preparing: orders.filter(o => o.status === 'Preparing').length,
      pending: orders.filter(o => o.status === 'Pending').length
    });

    totalOrders += orders.length;
  });

  res.json({
    totalStores: storeStats.length,
    totalOrders,
    storeStats
  });
});

module.exports = router;
