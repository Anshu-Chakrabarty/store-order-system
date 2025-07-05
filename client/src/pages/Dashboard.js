import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSummary = () => {
    fetch("${process.env.REACT_APP_API_BASE}/api/summary")
      .then(res => res.json())
      .then(data => setSummary(data));
  };

  if (!summary) return <div>Loading summary...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Stores: {summary.totalStores}</p>
      <p>Total Orders: {summary.totalOrders}</p>
      <table>
        <thead>
          <tr>
            <th>Store</th><th>Orders</th><th>Delivered</th><th>Preparing</th><th>Pending</th>
          </tr>
        </thead>
        <tbody>
          {summary.storeStats.map((s, i) => (
            <tr key={i}>
              <td>{s.store}</td>
              <td>{s.orderCount}</td>
              <td>{s.delivered}</td>
              <td>{s.preparing}</td>
              <td>{s.pending}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
