import { Outlet } from "react-router-dom";
import ClientSidebar from "./Clientpages/slidebar/ClientSidebar";

export default function ClientDashboard2() {
  return (
    <div className="flex">
      <ClientSidebar />

      <div style={{ flex: 1, marginLeft: "16rem" }}>
        <Outlet />
      </div>
    </div>
  );
}
