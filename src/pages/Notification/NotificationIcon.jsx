// components/notifications/NotificationIcon.jsx

import React from "react";

export default function NotificationIcon({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-xl hover:bg-yellow-200 transition"
    >
      <span className="material-icons text-gray-800 text-[24px]">
        notifications_none
      </span>

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
