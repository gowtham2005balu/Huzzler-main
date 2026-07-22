

// import { Outlet } from "react-router-dom";
// import Sidebar from "../pages/Clientpages/slidebar/ClientSidebar";
// import Home from "../pages/Clientpages/home/Home"
// export default function ClientDashboard() {
//   return (
//     <div className="flex">
     
//       <Sidebar />
     
//       <div style={{ flex: 1, paddingLeft: "16rem" }}>
         
//         <Outlet />
//       </div>
//     </div>
//   );
// }





import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../pages/Clientpages/slidebar/ClientSidebar";

export default function ClientDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    // Listen to sidebar collapse toggle (desktop only)
    const handler = (e) => setSidebarCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handler);

    return () => window.removeEventListener("sidebar-toggle", handler);
  }, []);

  return (
    <div className="client-dashboard">
      <Sidebar />

      <main
        className="client-content"
        style={{
          paddingLeft: sidebarCollapsed ? "80px" : "300px",
        }}
      >
        <Outlet />
      </main>

      {/* styles */}
      <style>{`
        .client-dashboard {
          display: flex;
          width: 100%;
        }

        .client-content {
          width: 100%;
          transition: padding-left 0.3s ease;
        }

        /* MOBILE FIX — SAME AS FREELANCER */
        @media (max-width: 768px) {
          .client-content {
            padding-left: 0 !important;
            margin-top: 60px; /* space for mobile topbar */
          }
        }
      `}</style>
    </div>
  );
}
