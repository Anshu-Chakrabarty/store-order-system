const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

// ✅ CORS setup to allow only your Vercel frontend
app.use(cors({
  origin: "https://store-order-system.vercel.app",
  credentials: true
}));

// ✅ Parse JSON body
app.use(express.json());

// ✅ Import routes
const storeRoutes = require("./routes/stores");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payments");
const billRoutes = require("./routes/bills");
const summaryRoutes = require("./routes/summary");
const exportRoutes = require("./routes/export");

// ✅ Use routes
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/export", exportRoutes);

// ✅ Root route (for health check)
app.get("/", (req, res) => {
  res.send("✅ Store-Order backend is running on Render.");
});

// ✅ Dynamic port for Render or fallback to 4000 for local
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
