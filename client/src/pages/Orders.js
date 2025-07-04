import React, { useEffect, useState } from "react";

const Orders = () => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [cart, setCart] = useState({});
  const [customer, setCustomer] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentType, setPaymentType] = useState("Full");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    fetch("http://localhost:4000/api/stores")
      .then(res => res.json())
      .then(data => setStores(data));
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetch("http://localhost:4000/api/products")
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter(p => p.storeName === selectedStore);
          setProducts(filtered);
          setCart({});
        });
    }
  }, [selectedStore]);

  const updateQuantity = (name, price, delta) => {
    setCart(prev => {
      const currentQty = prev[name]?.qty || 0;
      const newQty = Math.max(currentQty + delta, 0);
      const newCart = { ...prev };
      if (newQty === 0) {
        delete newCart[name];
      } else {
        newCart[name] = { qty: newQty, price };
      }
      return newCart;
    });
  };

  const total = Object.values(cart).reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleSubmit = async () => {
    if (!selectedStore || !customer || total === 0) {
      alert("Please fill in customer and add items.");
      return;
    }

    const confirm = window.confirm(`Place this order for ₹${total}?`);
    if (!confirm) return;

    const orderData = {
      customer,
      items: Object.entries(cart)
        .map(([name, val]) => `${name} x${val.qty}`)
        .join(", "),
      total,
      paymentMode,
      paymentType,
      status,
      date: new Date().toLocaleString()
    };

    await fetch("http://localhost:4000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeName: selectedStore, orderData })
    });

    alert("Order submitted!");
    setCart({});
    setCustomer("");
  };

  const clearCart = () => {
    if (window.confirm("Clear the cart?")) {
      setCart({});
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", padding: "2rem" }}>
      {/* Left: Product selector */}
      <div style={{ flex: 2 }}>
        <h2>Place Order</h2>
        <div className="card">
          <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)}>
            <option value="">Select Store</option>
            {stores.map((s, i) => (
              <option key={i} value={s.name}>{s.name}</option>
            ))}
          </select>

          <input
            placeholder="Customer Name"
            value={customer}
            onChange={e => setCustomer(e.target.value)}
          />

          <h4>Products</h4>
          {products.length === 0 && selectedStore && (
            <p style={{ color: "gray" }}>No products for this store.</p>
          )}

          {products.map((p, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
              padding: "0.25rem 0",
              borderBottom: "1px solid #e5e7eb"
            }}>
              <span>{p.name} - ₹{p.price}</span>
              <div>
                <button onClick={() => updateQuantity(p.name, parseFloat(p.price), -1)}>-</button>
                <span style={{ margin: "0 10px" }}>{cart[p.name]?.qty || 0}</span>
                <button onClick={() => updateQuantity(p.name, parseFloat(p.price), 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Floating Cart Summary */}
      <div style={{
        flex: 1,
        position: "sticky",
        top: "2rem",
        background: "#f9fafb",
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
      }}>
        <h3>🛒 Cart</h3>
        {Object.keys(cart).length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <>
            <ul>
              {Object.entries(cart).map(([name, val]) => (
                <li key={name}>{name} × {val.qty} = ₹{val.qty * val.price}</li>
              ))}
            </ul>
            <hr />
            <p><strong>Total:</strong> ₹{total}</p>

            <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
            </select>

            <select value={paymentType} onChange={e => setPaymentType(e.target.value)}>
              <option>Full</option>
              <option>Partial</option>
            </select>

            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option>Pending</option>
              <option>Preparing</option>
              <option>Delivered</option>
            </select>

            <button onClick={handleSubmit} style={{ width: "100%" }}>
              ✅ Submit Order
            </button>
            <button onClick={clearCart} className="danger" style={{ width: "100%", marginTop: "0.5rem" }}>
              🧹 Clear Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
