const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');

router.get('/:store/:orderId', (req, res) => {
  const { store, orderId } = req.params;
  const orderPath = path.join(__dirname, `../data/orders/${store}.xlsx`);

  if (!fs.existsSync(orderPath)) return res.status(404).send('Store not found');
  const wb = XLSX.readFile(orderPath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const orders = XLSX.utils.sheet_to_json(ws);
  const order = orders[parseInt(orderId) - 1];
  if (!order) return res.status(404).send('Order not found');

  const doc = new PDFDocument();
  res.setHeader("Content-Disposition", `attachment; filename="${store}_Order${orderId}.pdf"`);
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Retail Order Bill", { align: "center" });
  doc.moveDown();
  doc.fontSize(12);
  doc.text(`Store: ${store}`);
  doc.text(`Order ID: ${orderId}`);
  doc.text(`Customer: ${order.customer}`);
  doc.text(`Date: ${order.date}`);
  doc.text(`Items: ${order.items}`);
  doc.text(`Total: ₹${order.total}`);
  doc.text(`Payment Mode: ${order.paymentMode}`);
  doc.text(`Payment Type: ${order.paymentType}`);
  doc.text(`Status: ${order.status}`);
  doc.end();
});

module.exports = router;
