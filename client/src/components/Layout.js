import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  const menu = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Store Management", path: "/stores", icon: "🏪" },
    { label: "Product Management", path: "/products", icon: "📦" },
    { label: "Order Management", path: "/orders", icon: "🧾" },
    { label: "Payment Handling", path: "/payments", icon: "💰" },
    { label: "Billing", path: "/bills", icon: "📄" }
  ];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside style={{
        width: "240px",
        background: "#f1f5f9",
        padding: "1.5rem",
        borderRight: "1px solid #e2e8f0",
        boxShadow: "2px 0 4px rgba(0,0,0,0.05)"
      }}>
        <h2 style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          color: "#1e293b"
        }}>
          Business Manager
        </h2>

        <nav>
          {menu.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                style={{
                  display: "block",
                  padding: "0.5rem 1rem",
                  margin: "0.25rem 0",
                  borderRadius: "6px",
                  fontWeight: isActive ? "bold" : "normal",
                  color: isActive ? "#1d4ed8" : "#334155",
                  backgroundColor: isActive ? "#e0e7ff" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Page Content */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
