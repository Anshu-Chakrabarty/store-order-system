import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Stores from "./pages/Stores";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Bills from "./pages/Bills";

function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="stores" element={<PageWrapper><Stores /></PageWrapper>} />
            <Route path="products" element={<PageWrapper><Products /></PageWrapper>} />
            <Route path="orders" element={<PageWrapper><Orders /></PageWrapper>} />
            <Route path="payments" element={<PageWrapper><Payments /></PageWrapper>} />
            <Route path="bills" element={<PageWrapper><Bills /></PageWrapper>} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

// ✅ Universal Responsive Page Wrapper
const PageWrapper = ({ children }) => (
  <div style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1rem",
    boxSizing: "border-box",
    width: "100%"
  }}>
    {children}
  </div>
);

export default App;
