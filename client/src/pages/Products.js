// ✅ Final Responsive + Functional Products.js with Edit/Delete + Environment Config
import React, { useEffect, useState } from "react";

const Products = () => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ storeName: "", name: "", price: "", quantity: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/api/stores`)
      .then(res => res.json())
      .then(data => setStores(data));

    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch(`${process.env.REACT_APP_API_BASE}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  const handleSubmit = async () => {
    if (!form.storeName || !form.name || !form.price) {
      showToast("❗ Please fill all required fields.");
      return;
    }

    const payload = { ...form };
    const url = `${process.env.REACT_APP_API_BASE}/api/products`;

    if (editingIndex !== null) {
      await fetch(`${url}/${editingIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      showToast("✅ Product updated!");
    } else {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      showToast("✅ Product added!");
    }

    setForm({ storeName: "", name: "", price: "", quantity: "" });
    setEditingIndex(null);
    fetchProducts();
  };

  const handleEdit = (product, index) => {
    setForm({
      storeName: product.storeName,
      name: product.name,
      price: product.price,
      quantity: product.quantity || ""
    });
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${process.env.REACT_APP_API_BASE}/api/products/${index}`, {
      method: "DELETE"
    });
    showToast("🗑️ Product deleted.");
    fetchProducts();
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="container">
      <h2>{editingIndex !== null ? "Edit Product" : "Add Product"}</h2>

      {toast && (
        <div style={{ backgroundColor: "#e0ffe0", padding: "8px", marginBottom: "1rem", borderRadius: "4px" }}>
          {toast}
        </div>
      )}

      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", marginBottom: "1rem" }}>
        <select
          value={form.storeName}
          onChange={e => setForm({ ...form, storeName: e.target.value })}
        >
          <option value="">Select Store</option>
          {stores.map((s, i) => (
            <option key={i} value={s.name}>{s.name}</option>
          ))}
        </select>
        <input
          placeholder="Product Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
        />
        <button onClick={handleSubmit}>
          {editingIndex !== null ? "Update Product" : "Add Product"}
        </button>
      </div>

      <h3 style={{ marginTop: "2rem" }}>All Products</h3>
      {stores.map((store, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <strong>{store.name}</strong>
          <ul>
            {products.map((p, index) =>
              p.storeName === store.name ? (
                <li key={index}>
                  {p.name} — ₹{p.price} — Qty: {p.quantity || 0}
                  <button
                    onClick={() => handleEdit(p, index)}
                    style={{ marginLeft: "1rem" }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    style={{ marginLeft: "0.5rem" }}
                    className="danger"
                  >
                    ❌ Delete
                  </button>
                </li>
              ) : null
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Products;
