import React, { useState } from "react";

export default function ClientNotification() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Applications", "Payments", "Reminders"];

  const mockData = [
    {
      id: 1,
      icon: "💼",
      iconBg: "#F4F0FF",
      title: "New Application — UI/UX Designer",
      body: "Aryan Shah applied to your Mobile App Project. His match score is 97% — review his profile now.",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      icon: "💰",
      iconBg: "#E8F1FF",
      title: "Payment Released — ₹18,000",
      body: "Milestone 2 payment for \"Brand Identity Pack\" has been released to Priya Nair.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      icon: "⏰",
      iconBg: "#FFF8E5",
      title: "Deadline Reminder — NovaSpark",
      body: "Decision pending for 18 shortlisted freelancers. Proposal review closes in 6 hours.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 4,
      icon: "⭐",
      iconBg: "#F4F0FF",
      title: "New Review Received",
      body: "James Andrew left you a 5-star review: \"Best client I've worked with. Clear briefs and prompt payments.\"",
      time: "Yesterday · 4:30 PM",
      unread: false,
    },
    {
      id: 5,
      icon: "🎯",
      iconBg: "#FFF3EB",
      title: "Job Post Milestone",
      body: "Your \"UI/UX Designer\" listing has reached 100 views. Consider boosting it for 3× more applicants.",
      time: "Yesterday · 11:00 AM",
      unread: false,
    },
    {
      id: 6,
      icon: "🤝",
      iconBg: "#FFF0F3",
      title: "Contract Signed",
      body: "Rahul Dev has signed the contract for \"Frontend Developer — Dashboard.\" Work starts Monday.",
      time: "2 days ago",
      unread: false,
    },
  ];

  return (
    <div style={{ background: "#FDFBFF", minHeight: "100vh", padding: "40px", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700&display=swap" rel="stylesheet" />

      {/* Main Container */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", background: "#FFFFFF", borderRadius: "20px", padding: "40px", boxShadow: "0 2px 20px rgba(0,0,0,0.02)", border: "1px solid #EBE5F2" }}>
        
        {/* Header Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "28px", fontWeight: 700, color: "#1A1433", margin: "0 0 8px 0" }}>
              Notifications
            </h1>
            <p style={{ fontSize: "14px", color: "#8A8599", margin: 0, fontWeight: 500 }}>
              3 unread · Updated just now
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ padding: "8px 16px", borderRadius: "20px", border: "1px solid #EBE5F2", background: "white", fontSize: "13px", fontWeight: 700, color: "#1A1433", cursor: "pointer" }}>
              Mark all read
            </button>
            <button style={{ padding: "8px 16px", borderRadius: "20px", border: "1px solid #EBE5F2", background: "white", fontSize: "13px", fontWeight: 700, color: "#1A1433", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>⚙️</span> Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 24px",
                borderRadius: "24px",
                border: activeTab === tab ? "1px solid #EBE5F2" : "none",
                background: activeTab === tab ? "#FFFFFF" : "transparent",
                color: activeTab === tab ? "#1A1433" : "#8A8599",
                fontSize: "14px",
                fontWeight: activeTab === tab ? 700 : 600,
                cursor: "pointer",
                boxShadow: activeTab === tab ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {mockData.map((n, index) => (
            <div 
              key={n.id} 
              style={{ 
                display: "flex", 
                alignItems: "flex-start", 
                padding: "24px 0", 
                borderBottom: index !== mockData.length - 1 ? "1px solid #F4F0FF" : "none",
                position: "relative"
              }}
            >
              {/* Icon Container */}
              <div style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "10px", 
                background: n.iconBg, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "20px",
                marginRight: "20px",
                flexShrink: 0
              }}>
                {n.icon}
              </div>

              {/* Text Content */}
              <div style={{ flex: 1, paddingRight: "40px", paddingTop: "2px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1433", margin: "0 0 6px 0", fontFamily: "'Sora', sans-serif" }}>
                  {n.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#8A8599", margin: "0 0 8px 0", lineHeight: "1.5", fontWeight: 500 }}>
                  {n.body}
                </p>
                <span style={{ fontSize: "12px", color: "#C4C1D4", fontWeight: 600 }}>
                  {n.time}
                </span>
              </div>

              {/* Unread Indicator */}
              {n.unread && (
                <div style={{ 
                  width: "6px", 
                  height: "6px", 
                  borderRadius: "50%", 
                  background: "#8A5CFF", 
                  marginTop: "8px",
                  flexShrink: 0
                }} />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}