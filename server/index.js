const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());

// Route Imports
const storeRoutes = require("./routes/stores");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payments");
const billRoutes = require("./routes/bills");
const summaryRoutes = require("./routes/summary");
const exportRoutes = require("./routes/export");

// Route Uses
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/export", exportRoutes);

// Server listen
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
