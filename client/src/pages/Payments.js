import React, { useEffect, useState } from "react";

const Payments = () => {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({
    storeName: "",
    customer: "",
    amount: "",
    mode: "Cash",
    type: "Full"
  });

  useEffect(() => {
    fetch("https://store-backend-i0xf.onrender.com/api/stores")
      .then(res => res.json())
      .then(data => setStores(data));
  }, []);

  const handleSubmit = async () => {
    const payload = {
      ...form,
      date: new Date().toLocaleString()
    };

    await fetch("https://store-backend-i0xf.onrender.com/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    alert("Payment recorded");
  };

  const handleDownloadPayments = () => {
    if (!form.storeName) {
      alert("Please select a store to download payments.");
      return;
    }
    window.open(`https://store-backend-i0xf.onrender.com/api/export/payments/${form.storeName}`, "_blank");
  };

  return (
    <div className="container">
      <h2>Record Payment</h2>
      <div className="card">
        <select
          value={form.storeName}
          onChange={(e) => setForm({ ...form, storeName: e.target.value })}
        >
          <option value="">Select Store</option>
          {stores.map((s, i) => (
            <option key={i} value={s.name}>{s.name}</option>
          ))}
        </select>
        <input
          placeholder="Customer"
          value={form.customer}
          onChange={(e) => setForm({ ...form, customer: e.target.value })}
        />
        <input
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <select
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value })}
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
        </select>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option>Full</option>
          <option>Partial</option>
        </select>
        <button onClick={handleSubmit}>Submit</button>
        <button className="secondary" onClick={handleDownloadPayments}>📥 Download Payments Excel</button>
      </div>
    </div>
  );
};

export default Payments;
