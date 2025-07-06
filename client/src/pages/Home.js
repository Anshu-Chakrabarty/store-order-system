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
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/summary`);
    const data = await res.json();
    setSummary(data);

    // Recent orders
    const allOrders = [];
    for (const store of data.storeStats) {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/orders/${store.store}`);
      const orders = await res.json();
      orders.forEach((order, idx) => {
        allOrders.push({ ...order, store: store.store, index: idx });
      });
    }
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentOrders(allOrders.slice(0, 5));

    // Payments
    let total = 0;
    for (const store of data.storeStats) {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/payments/${store.store}`);
      const payments = await res.json();
      payments.forEach(p => total += parseFloat(p.amount || 0));
    }
    setTotalPayments(total.toFixed(2));
  };

  if (!summary) return <div className="text-center p-4">Loading dashboard...</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Stores" value={summary.totalStores} color="border-blue-500" icon="🏪" />
        <Card title="Total Orders" value={summary.totalOrders} color="border-green-500" icon="🛒" />
        <Card title="Pending Orders" value={summary.storeStats.reduce((sum, s) => sum + s.pending, 0)} color="border-yellow-500" icon="⏳" />
        <Card title="Total Payments" value={`₹${totalPayments}`} color="border-purple-500" icon="💰" />
      </div>

      {/* 2-Column Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Recent Orders</h3>
          <ul className="space-y-2">
            {recentOrders.map((o, i) => (
              <li key={i} className="border p-2 rounded-md text-sm">
                <div className="flex justify-between">
                  <span>
                    #{o.index + 1} — <strong>{o.customer}</strong>
                  </span>
                  <span className={`text-xs font-medium ${o.status === "Delivered"
                    ? "text-green-600"
                    : o.status === "Preparing"
                      ? "text-blue-500"
                      : "text-orange-500"}`}>
                    {o.status}
                  </span>
                </div>
                <div className="text-gray-500 text-xs">{o.date}</div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Store Performance</h3>
          <ul className="space-y-2">
            {summary.storeStats.map((s, i) => (
              <li key={i} className="border p-2 rounded-md text-sm">
                <strong>{s.store}</strong> — {s.orderCount} orders
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, color, icon }) => (
  <div className={`border ${color} rounded-lg p-4 shadow-sm bg-white`}>
    <div className="text-2xl">{icon}</div>
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);

export default Home;
