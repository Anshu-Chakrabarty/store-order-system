import React, { useEffect, useState } from "react";

const Home = () => {
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSummary = async () => {
    const res = await fetch("http://localhost:4000/api/summary");
    const data = await res.json();
    setSummary(data);

    // Fetch recent orders (merge all store orders)
    const allOrders = [];
    for (const store of data.storeStats) {
      const res = await fetch(`http://localhost:4000/api/orders/${store.store}`);
      const orders = await res.json();
      orders.forEach((order, idx) => {
        allOrders.push({ ...order, store: store.store, index: idx });
      });
    }
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentOrders(allOrders.slice(0, 5));

    // Fetch payments
    let total = 0;
    for (const store of data.storeStats) {
      const res = await fetch(`http://localhost:4000/api/payments/${store.store}`);
      const payments = await res.json();
      payments.forEach(p => total += parseFloat(p.amount || 0));
    }
    setTotalPayments(total.toFixed(2));
  };

  if (!summary) return <div>Loading dashboard...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard Overview</h1>

      {/* Top Cards */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Card title="Total Stores" value={summary.totalStores} color="#3b82f6" icon="🏪" />
        <Card title="Total Orders" value={summary.totalOrders} color="#10b981" icon="🛒" />
        <Card title="Pending Orders" value={summary.storeStats.reduce((sum, s) => sum + s.pending, 0)} color="#facc15" icon="⏳" />
        <Card title="Total Payments" value={`₹${totalPayments}`} color="#a855f7" icon="💰" />
      </div>

      {/* 2 Column Layout */}
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <h3>Recent Orders</h3>
          <ul>
            {recentOrders.map((o, i) => (
              <li key={i}>
                Order #{o.index + 1} - {o.customer} — 
                <span style={{ color: o.status === "Delivered" ? "green" : o.status === "Preparing" ? "blue" : "orange" }}>
                  {o.status}
                </span> — <small>{o.date}</small>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Store Performance</h3>
          <ul>
            {summary.storeStats.map((s, i) => (
              <li key={i}>
                {s.store} — {s.orderCount} orders
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Card UI Component
const Card = ({ title, value, color, icon }) => (
  <div style={{
    flex: 1,
    background: "#f9fafb",
    padding: "1rem",
    borderRadius: "10px",
    border: `2px solid ${color}`
  }}>
    <div style={{ fontSize: "2rem" }}>{icon}</div>
    <h4 style={{ margin: 0 }}>{title}</h4>
    <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</p>
  </div>
);

export default Home;
