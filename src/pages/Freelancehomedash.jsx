import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Freelancerpage/components/Sidebar";

export default function FreelancerDashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);

    const onSidebarToggle = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", onSidebarToggle);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("sidebar-toggle", onSidebarToggle);
    };
  }, []);

  const getMarginLeft = () => {
    if (isMobile) return 0;
    return collapsed ? "80px" : "280px";
  };

  return (
    <div className="flex w-full" style={{ paddingTop: isMobile ? "60px" : "0" }}>
      {/* Sidebar (your existing functionality stays) */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          width: "100%",
          boxSizing: "border-box",
          paddingLeft: getMarginLeft(), 
          transition: "padding-left 0.3s ease",
          display: "flex",
          flexDirection: "column",
          minHeight: isMobile ? "calc(100vh - 60px)" : "100vh"
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}