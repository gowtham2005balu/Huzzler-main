// components/notifications/NotificationDialog.jsx

import React, { useState } from "react";
import { FiBriefcase, FiFileText, FiClock, FiSettings, FiCpu, FiBell } from "react-icons/fi";

export default function NotificationDialog({
  notifications,
  onClose,
  onClearAll,
}) {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Hiring", "Payments", "AI Updates", "System"];

  // Helper to determine icon based on title/type
  const getIconForNotification = (title = "") => {
    const t = title.toLowerCase();
    if (t.includes("project") || t.includes("hiring") || t.includes("skills")) return <FiBriefcase size={16} />;
    if (t.includes("invoice") || t.includes("payment")) return <FiFileText size={16} />;
    if (t.includes("meeting") || t.includes("reminder")) return <FiClock size={16} />;
    if (t.includes("system") || t.includes("update")) return <FiSettings size={16} />;
    if (t.includes("ai") || t.includes("leads")) return <FiCpu size={16} />;
    return <FiBell size={16} />;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4 font-['DM_Sans',_sans-serif]">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative"
        style={{ maxHeight: "85vh", border: "1px solid #EEEDF3" }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[#A39DBA] hover:text-[#1A1433] transition-colors"
        >
          <span className="material-icons text-[24px]">close</span>
        </button>

        {/* Header Section */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-[28px] font-bold text-[#1A1433] font-['Sora',_sans-serif] leading-tight mb-2">
                Notifications
              </h1>
              <p className="text-[14px] text-[#8C84A8]">
                Stay updated on your projects and applications.
              </p>
            </div>
            
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[13px] font-bold text-[#6C3EEB] hover:text-[#5B30D6] transition-colors bg-transparent border-none cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#EEEDF3] overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[14px] font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab
                    ? "text-[#6C3EEB] font-bold"
                    : "text-[#8C84A8] hover:text-[#1A1433]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#6C3EEB] rounded-t-sm" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Body / List Section */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F5F2FF] flex items-center justify-center mb-4">
                <FiBell size={28} className="text-[#6C3EEB]" />
              </div>
              <p className="font-bold text-[18px] text-[#1A1433] font-['Sora',_sans-serif] mb-2">
                No notifications yet
              </p>
              <p className="text-[14px] text-[#8C84A8] max-w-[280px]">
                You're all caught up! New notifications will appear here when available.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((n, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-[#EEEDF3] bg-white hover:bg-[#FAFAFC] transition-colors flex items-start gap-4 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5F2FF] flex items-center justify-center text-[#6C3EEB] flex-shrink-0">
                    {getIconForNotification(n.title)}
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex justify-between items-start gap-4">
                      {n.title && (
                        <p className="text-[14px] font-semibold text-[#1A1433] leading-snug">
                          {n.title}
                        </p>
                      )}
                      <p className="text-[12px] font-medium text-[#A39DBA] whitespace-nowrap pt-[2px]">
                        Just now
                      </p>
                    </div>
                    {n.body && (
                      <p className="mt-1 text-[13px] text-[#8C84A8] truncate">
                        {n.body}
                      </p>
                    )}
                  </div>
                  
                  {/* Optional unread dot indicator */}
                  <div className="w-2 h-2 rounded-full bg-[#6C3EEB] mt-2 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
