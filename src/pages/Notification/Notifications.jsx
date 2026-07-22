import React, { useState } from "react";
import { Search, MessageSquare, Star } from "lucide-react";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Hiring", "Payments", "AI Updates", "System"];

  // Exact data from the user's Figma image
  const [notifications] = useState([
    {
      id: 1,
      type: "application",
      avatarText: "HA",
      avatarBg: "#7C4EF5",
      title: "Helen Angel accepted your application",
      body: <>Applied for <span style={{ fontWeight: 700, color: "#4B5563" }}>Engaging Video Editor for Promotional Campaigns</span></>,
      time: "2h ago",
      buttonText: "View Project",
      buttonType: "primary",
      unread: true,
    },
    {
      id: 2,
      type: "application",
      avatarText: "HA",
      avatarBg: "#FF65B6",
      title: "Helen Angel accepted your application",
      body: <>Applied for <span style={{ fontWeight: 700, color: "#4B5563" }}>Engaging Video Editor for Promotional Campaigns</span></>,
      time: "2h ago",
      buttonText: "View Project",
      buttonType: "primary",
      unread: true,
    },
    {
      id: 3,
      type: "message",
      icon: <MessageSquare size={18} color="#D97706" />,
      avatarBg: "#FEF3C7",
      title: "New message from Rishi Shah",
      body: '"Hi Helen! I\'ve reviewed your portfolio and I\'m very impressed..."',
      time: "5h ago",
      buttonText: "Reply",
      buttonType: "secondary",
      unread: false,
    },
    {
      id: 4,
      type: "ai",
      icon: <Star size={20} color="#7C4EF5" fill="transparent" strokeWidth={2} />,
      avatarBg: "#F5F3FF",
      title: "AI found 5 new matching jobs ✨",
      body: "Based on your recent activity, Huzzler AI found new opportunities with 90%+ match score.",
      time: "3h ago",
      buttonText: "Browse Jobs",
      buttonType: "secondary",
      unread: false,
    },
  ]);

  return (
    <div className="notif-page-container">
      {/* Top Search Bar (matches layout from image) */}
      <div className="notif-topbar">
        <div className="notif-search-container">
          <Search size={16} color="#9CA3AF" />
          <input 
            type="text" 
            placeholder="Search freelancers, jobs, services..." 
            className="notif-search-input"
          />
        </div>
      </div>

      <div className="notif-content-area">
        {/* Header Section */}
        <div className="notif-header">
          <h1 className="notif-title">Notifications</h1>
          <p className="notif-subtitle">Stay updated on your projects and applications.</p>
        </div>

        {/* Tabs */}
        <div className="notif-tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`notif-tab-btn ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List Section */}
        <div className="notif-list">
          {notifications.map((n) => (
            <div key={n.id} className={`notif-card ${n.unread ? "unread" : ""}`}>
              
              <div className="notif-card-left">
                {/* Avatar / Icon */}
                <div 
                  className="notif-avatar" 
                  style={{ background: n.avatarBg }}
                >
                  {n.avatarText ? (
                    <span style={{ color: "white", fontSize: "14px", fontWeight: 600 }}>{n.avatarText}</span>
                  ) : (
                    n.icon
                  )}
                </div>

                {/* Content */}
                <div className="notif-text-content">
                  <h3 className="notif-item-title">{n.title}</h3>
                  <p className="notif-item-body">{n.body}</p>
                  <p className="notif-item-time">{n.time}</p>
                </div>
              </div>

              {/* Action Button */}
              <button className={`notif-action-btn ${n.buttonType}`}>
                {n.buttonText}
              </button>

            </div>
          ))}
        </div>
      </div>

      <style>{`
        .notif-page-container {
          width: 100%;
          min-height: 100vh;
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .notif-topbar {
          height: 70px;
          border-bottom: 1px solid #F3F4F6;
          display: flex;
          align-items: center;
          padding: 0 32px;
        }

        .notif-search-container {
          display: flex;
          align-items: center;
          background: #F9FAFB;
          border-radius: 8px;
          padding: 0 16px;
          height: 40px;
          width: 400px;
          border: 1px solid #F3F4F6;
        }

        .notif-search-input {
          border: none;
          background: transparent;
          outline: none;
          margin-left: 8px;
          width: 100%;
          font-size: 13px;
          color: #111827;
        }
        .notif-search-input::placeholder {
          color: #9CA3AF;
        }

        .notif-content-area {
          padding: 32px;
          flex: 1;
        }

        .notif-header {
          margin-bottom: 24px;
        }

        .notif-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px 0;
          font-family: 'Sora', sans-serif;
        }

        .notif-subtitle {
          font-size: 13px;
          color: #9CA3AF;
          margin: 0;
        }

        /* Pill Tabs */
        .notif-tabs-container {
          display: inline-flex;
          background: #F9FAFB;
          border-radius: 8px;
          padding: 4px;
          gap: 4px;
          margin-bottom: 32px;
        }

        .notif-tab-btn {
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #6B7280;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .notif-tab-btn:hover {
          color: #111827;
        }

        .notif-tab-btn.active {
          background: #ffffff;
          color: #7C4EF5;
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        /* Notifications List */
        .notif-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 800px; /* Exact width from Figma */
        }

        .notif-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 20px 24px;
          position: relative;
          overflow: hidden;
        }

        .notif-card.unread {
          border-left: 4px solid #7C4EF5;
        }

        .notif-card-left {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          flex: 1;
        }

        .notif-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-text-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .notif-item-title {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }

        .notif-item-body {
          font-size: 13px;
          color: #6B7280;
          margin: 0;
          line-height: 1.5;
        }

        .notif-item-time {
          font-size: 12px;
          font-weight: 500;
          color: #9CA3AF;
          margin: 2px 0 0 0;
        }

        .notif-action-btn {
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .notif-action-btn.primary {
          background: #7C4EF5;
          color: white;
          border: none;
        }
        .notif-action-btn.primary:hover {
          background: #6431E8;
        }

        .notif-action-btn.secondary {
          background: #ffffff;
          color: #4B5563;
          border: 1px solid #E5E7EB;
        }
        .notif-action-btn.secondary:hover {
          background: #F9FAFB;
        }
      `}</style>
    </div>
  );
}
