import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSummary = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/summary`);
    const data = await res.json();
    setSummary(data);
  };

  if (!summary) return <div className="text-center p-4">Loading summary...</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">📊 Dashboard Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Stores" value={summary.totalStores} />
        <StatCard label="Total Orders" value={summary.totalOrders} />
        <StatCard
          label="Total Pending"
          value={summary.storeStats.reduce((sum, s) => sum + s.pending, 0)}
        />
      </div>

      <div className="overflow-auto">
        <h3 className="text-lg font-semibold mt-6 mb-2">📍 Store-wise Order Stats</h3>
        <table className="min-w-full text-sm border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Store</th>
              <th className="p-2 text-center">Orders</th>
              <th className="p-2 text-center text-green-600">Delivered</th>
              <th className="p-2 text-center text-blue-500">Preparing</th>
              <th className="p-2 text-center text-orange-500">Pending</th>
            </tr>
          </thead>
          <tbody>
            {summary.storeStats.map((s, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-2">{s.store}</td>
                <td className="p-2 text-center">{s.orderCount}</td>
                <td className="p-2 text-center text-green-600">{s.delivered}</td>
                <td className="p-2 text-center text-blue-500">{s.preparing}</td>
                <td className="p-2 text-center text-orange-500">{s.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reusable Card Component
const StatCard = ({ label, value }) => (
  <div className="bg-white shadow-sm border rounded-lg p-4 text-center">
    <h4 className="text-gray-500 text-sm">{label}</h4>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Dashboard;
