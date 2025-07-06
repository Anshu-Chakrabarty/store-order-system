import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menu = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Store Management", path: "/stores", icon: "🏪" },
    { label: "Product Management", path: "/products", icon: "📦" },
    { label: "Order Management", path: "/orders", icon: "🧾" },
    { label: "Payment Handling", path: "/payments", icon: "💰" },
    { label: "Billing", path: "/bills", icon: "📄" }
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className="title">☰ Business Manager</h2>
        <nav>
          {menu.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="main-content">
        {/* Hamburger Button */}
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <Outlet />
      </main>

      {/* CSS */}
      <style>{`
        .app-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .sidebar {
          width: 240px;
          background: #f1f5f9;
          padding: 1.5rem;
          border-right: 1px solid #e2e8f0;
          transition: transform 0.3s ease;
        }

        .sidebar .title {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: #1e293b;
        }

        .nav-link {
          display: block;
          padding: 0.5rem 1rem;
          margin: 0.25rem 0;
          border-radius: 6px;
          color: #334155;
          text-decoration: none;
          transition: all 0.2s;
        }

        .nav-link.active {
          font-weight: bold;
          color: #1d4ed8;
          background-color: #e0e7ff;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          position: relative;
        }

        .hamburger {
          display: none;
          position: absolute;
          top: 1rem;
          left: 1rem;
          font-size: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            transform: translateX(-100%);
            z-index: 1000;
          }

          .sidebar.open {
            transform: translateX(0);
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
          }

          .hamburger {
            display: block;
          }

          .main-content {
            padding-left: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
