import React, { useEffect, useState } from "react";

const Bills = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/api/summary`)
      .then(res => res.json())
      .then(data => setSummary(data.storeStats || []));
  }, []);

  const handleDownload = (store, index) => {
    const url = `${process.env.REACT_APP_API_BASE}/api/bill/${store}/${index + 1}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-4">🧾 Bills</h2>

      {summary.length === 0 ? (
        <p className="text-gray-500">No store bills available.</p>
      ) : (
        summary.map((s, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{s.store} — {s.orderCount} Orders</h3>
            <div className="flex flex-wrap gap-2">
              {[...Array(s.orderCount)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDownload(s.store, idx)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                >
                  📥 Bill #{idx + 1}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Bills;
