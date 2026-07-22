import React, { useState } from "react";
import { FiX } from "react-icons/fi";

export default function FloatingAssistantButton() {
  const [isFabOpen, setIsFabOpen] = useState(false);

  return (
    <div className="floating-btn" style={{ position: "fixed", right: 40, bottom: 40, zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
      {isFabOpen && (
        <>
          <button style={{ width: 119, height: 36, background: "#FFFFFF", border: "1px solid #A987FF", boxShadow: "0px 4px 16px rgba(108, 62, 235, 0.15)", borderRadius: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 18px", gap: 6, cursor: "pointer", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 11, color: "#6C3EEB" }}>
            ✨ AI Assistant
          </button>
          <button style={{ width: 121, height: 34, background: "linear-gradient(106.09deg, #6C3EEB 0%, #7C4EF5 100%)", boxShadow: "0px 4px 20px rgba(108, 62, 235, 0.35)", borderRadius: 50, border: "none", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 18px", gap: 6, cursor: "pointer", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 11, color: "#FFFFFF" }}>
            🚀 Start Project
          </button>
        </>
      )}
      <button
        onClick={() => setIsFabOpen(!isFabOpen)}
        style={{ width: 50, height: 50, background: "linear-gradient(135deg, #6C3EEB 0%, #7C4EF5 100%)", boxShadow: "0px 6px 24px rgba(108, 62, 235, 0.45)", borderRadius: 25, border: "none", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", color: "#FFFFFF", fontSize: 20 }}
      >
        {isFabOpen ? <FiX size={24} /> : "⚡"}
      </button>
    </div>
  );
}