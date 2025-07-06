const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');

router.get('/:store/:orderId', (req, res) => {
  try {
    const { store, orderId } = req.params;
    const filePath = path.join(__dirname, `../data/orders/${store}.xlsx`);

    // Check if order file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("❌ Store order file not found");
    }

    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const orders = XLSX.utils.sheet_to_json(worksheet);

    const index = parseInt(orderId, 10) - 1;
    if (isNaN(index) || index < 0 || index >= orders.length) {
      return res.status(404).send("❌ Order ID is invalid or out of range");
    }

    const order = orders[index];

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Disposition", `attachment; filename="${store}_Order_${orderId}.pdf"`);
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // Title
    doc.fontSize(20).text("🧾 Retail Order Invoice", { align: "center" }).moveDown(1.5);

    // Order Info
    doc.fontSize(12);
    doc.text(`🏪 Store: ${store}`);
    doc.text(`📄 Order ID: ${orderId}`);
    doc.text(`👤 Customer: ${order.customer}`);
    doc.text(`📅 Date: ${order.date}`);
    doc.text(`💳 Payment Mode: ${order.paymentMode}`);
    doc.text(`💰 Payment Type: ${order.paymentType}`);
    doc.text(`📦 Status: ${order.status}`).moveDown();

    // Items Breakdown
    doc.font("Helvetica-Bold").text("🛍️ Items", { underline: true }).moveDown(0.5);
    doc.font("Helvetica").text(order.items).moveDown();

    // Total
    doc.font("Helvetica-Bold").text(`Total Amount: ₹${order.total}`, { align: "right" });

    doc.end();
  } catch (err) {
    console.error("Bill generation error:", err.message);
    res.status(500).json({ error: "Failed to generate bill PDF", details: err.message });
  }
});

module.exports = router;
