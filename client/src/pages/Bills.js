import React, { useEffect, useState } from "react";

const Bills = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/summary")
      .then(res => res.json())
      .then(data => setSummary(data.storeStats || []));
  }, []);

  const handleDownload = (store, index) => {
    const url = `http://localhost:4000/api/bill/${store}/${index + 1}`;
    window.open(url, "_blank");
  };

  return (
    <div>
      <h2>Bills</h2>
      {summary.map((s, i) => (
        <div key={i}>
          <h4>{s.store} - {s.orderCount} Orders</h4>
          {[...Array(s.orderCount)].map((_, idx) => (
            <button key={idx} onClick={() => handleDownload(s.store, idx)}>
              Download Bill #{idx + 1}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Bills;
