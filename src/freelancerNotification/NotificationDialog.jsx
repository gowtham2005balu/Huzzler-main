import React from "react";
import NotificationItem from "./NotificationItem";

export default function NotificationDialog({ onClose, notifications }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "92%",
          maxWidth: 480,
          maxHeight: "75vh",
          backgroundColor: "#FFFFFF",
          borderRadius: 24,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "14px 16px",
            backgroundColor: "#FDFD96",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>🔔</span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Notifications</span>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              borderRadius: 12,
              border: "none",
              backgroundColor: "rgba(255,255,255,0.5)",
              padding: 4,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: 24 }}>
              <div
                style={{
                  display: "inline-flex",
                  padding: 18,
                  borderRadius: 50,
                  backgroundColor: "#F5F5F5",
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 28, color: "#BDBDBD" }}>🔕</span>
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#555",
                  marginBottom: 6,
                }}
              >
                No notifications yet
              </div>
              <div style={{ fontSize: 13, color: "#888" }}>
                You're all caught up! New notifications will appear here.
              </div>
            </div>
          ) : (
            notifications.map((notif) => (
              <NotificationItem key={notif.id} notif={notif} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
