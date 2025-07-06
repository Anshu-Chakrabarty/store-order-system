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
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/api/stores`)
      .then(res => res.json())
      .then(data => setStores(data));
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetch(`${process.env.REACT_APP_API_BASE}/api/products`)
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

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSubmit = async () => {
    if (!selectedStore || !customer || total === 0) {
      showToast("❗ Please fill in customer and add items.");
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

    await fetch(`${process.env.REACT_APP_API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeName: selectedStore, orderData })
    });

    showToast("✅ Order submitted!");
    setCart({});
    setCustomer("");
  };

  const clearCart = () => {
    if (window.confirm("Clear the cart?")) {
      setCart({});
    }
  };

  return (
    <div className="container" style={{ padding: "1rem" }}>
      {toast && (
        <div style={{ backgroundColor: "#e0ffe0", padding: "8px", marginBottom: "1rem", borderRadius: "4px" }}>
          {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">Place Order</h2>
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
              <div key={i} className="flex justify-between items-center border-b py-1">
                <span>{p.name} - ₹{p.price}</span>
                <div>
                  <button onClick={() => updateQuantity(p.name, parseFloat(p.price), -1)}>-</button>
                  <span className="mx-2">{cart[p.name]?.qty || 0}</span>
                  <button onClick={() => updateQuantity(p.name, parseFloat(p.price), 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 sticky top-4 bg-white border rounded-lg p-4 shadow">
          <h3 className="font-bold text-lg mb-2">🛒 Cart</h3>
          {Object.keys(cart).length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <>
              <ul>
                {Object.entries(cart).map(([name, val]) => (
                  <li key={name}>{name} × {val.qty} = ₹{val.qty * val.price}</li>
                ))}
              </ul>
              <hr className="my-2" />
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

              <button onClick={handleSubmit} className="w-full my-2">
                ✅ Submit Order
              </button>
              <button onClick={clearCart} className="w-full bg-red-200">
                🧹 Clear Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
