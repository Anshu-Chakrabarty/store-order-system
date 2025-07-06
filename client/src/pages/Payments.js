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
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/api/stores`)
      .then(res => res.json())
      .then(data => setStores(data));
  }, []);

  const handleSubmit = async () => {
    if (!form.storeName || !form.customer || !form.amount) {
      showToast("❗ Please fill all required fields.");
      return;
    }

    const payload = {
      ...form,
      date: new Date().toLocaleString()
    };

    await fetch(`${process.env.REACT_APP_API_BASE}/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    showToast("✅ Payment recorded.");
    setForm({ storeName: "", customer: "", amount: "", mode: "Cash", type: "Full" });
  };

  const handleDownloadPayments = () => {
    if (!form.storeName) {
      showToast("❗ Please select a store to download payments.");
      return;
    }
    window.open(`${process.env.REACT_APP_API_BASE}/api/export/payments/${form.storeName}`, "_blank");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="container">
      <h2>Record Payment</h2>

      {toast && (
        <div style={{ backgroundColor: "#e0ffe0", padding: "8px", marginBottom: "1rem", borderRadius: "4px" }}>
          {toast}
        </div>
      )}

      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
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
          type="number"
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
        <button className="secondary" onClick={handleDownloadPayments}>
          📥 Download Payments Excel
        </button>
      </div>
    </div>
  );
};

export default Payments;
