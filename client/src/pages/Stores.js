// ✅ Final Responsive + Functional Stores.js with Toast, Table & Download
import React, { useState, useEffect } from "react";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ name: "", type: "Franchise" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/stores`);
    const data = await res.json();
    setStores(data);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showToast("❗ Please enter a store name.");
      return;
    }

    const url = `${process.env.REACT_APP_API_BASE}/api/stores`;
    const method = editingIndex !== null ? "PUT" : "POST";
    const endpoint = editingIndex !== null ? `${url}/${editingIndex}` : url;

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    showToast(editingIndex !== null ? "✅ Store updated!" : "✅ Store added!");
    setForm({ name: "", type: "Franchise" });
    setEditingIndex(null);
    fetchStores();
  };

  const handleEdit = (index) => {
    const selected = stores[index];
    setForm({ name: selected.name, type: selected.type });
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this store?")) return;
    await fetch(`${process.env.REACT_APP_API_BASE}/api/stores/${index}`, {
      method: "DELETE",
    });
    showToast("🗑️ Store deleted.");
    fetchStores();
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setForm({ name: "", type: "Franchise" });
  };

  const downloadStoresExcel = () => {
    window.open(`${process.env.REACT_APP_API_BASE}/api/stores/export`, "_blank");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-2">{editingIndex !== null ? "Edit Store" : "Add Store"}</h2>

      {toast && (
        <div style={{ backgroundColor: "#e0ffe0", padding: "8px", marginBottom: "1rem", borderRadius: "4px" }}>
          {toast}
        </div>
      )}

      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", marginBottom: "1rem" }}>
        <input
          placeholder="Store Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="Franchise">Franchise</option>
          <option value="Location">Location</option>
        </select>
        <button onClick={handleSubmit}>
          {editingIndex !== null ? "Update" : "Add"}
        </button>
        {editingIndex !== null && (
          <button onClick={handleCancel} className="secondary">Cancel</button>
        )}
        <button onClick={downloadStoresExcel} style={{ marginLeft: "auto" }}>
          📥 Download Excel
        </button>
      </div>

      <h3>All Stores</h3>
      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>#</th>
              <th>Store Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{store.name}</td>
                <td>{store.type}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>✏️</button>
                  <button onClick={() => handleDelete(index)} style={{ marginLeft: "0.5rem" }}>❌</button>
                </td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No stores added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stores;
