
import { Home, Search, Briefcase, User, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <>
      <aside className="sidebar">
        {/* Logo Section */}
        <div className="sidebar-top">
          <div className="logo-box">
            <div className="logo-title">HUZZLER</div>
            <p className="logo-subtitle">Find Your Next Project</p>
          </div>

          {/* Navigation */}
          <nav className="nav">
            <button className="nav-btn active">
              <Home size={18} /> Home
            </button>

            <button className="nav-btn" onClick={() => navigate("/browse-projects")}>
              <Search size={18} /> Browse Projects
            </button>


            <button className="nav-btn" onClick={() => navigate("/myjobs")}>
              <Briefcase size={18} /> My Jobs..
            </button>

            <button className="nav-btn" onClick={() => navigate("/account-details")}>
              <User size={18} /> Profile
            </button>

            <button className="nav-btn">
              <Settings size={18} /> Settings
            </button>

            <button className="nav-btn">
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </div>

        {/* User Info */}
        <div className="user-info">
          <div className="user-avatar">JsA</div>
          <div>
            <p className="user-name">James Andrew</p>
            <p className="user-status">Premium Member</p>
          </div>
        </div>
      </aside>

      {/* Inline CSS */}
      <style>{`
        .sidebar {
          width: 16rem; /* 64 */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid #f3f3f3;
          color: #000;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          padding: 1.5rem;
          background: linear-gradient(to bottom, #fef08a, #fefce8, #ffffff);
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .sidebar-top {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-grow: 1;
        }

        .logo-box {
          text-align: center;
          background-color: #7c3aed;
          padding: 1rem;
          border-radius: 0.75rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          margin-bottom: 1.5rem;
        }

        .logo-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .logo-subtitle {
          color: #ddd6fe;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex-grow: 1;
        }

        .nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 500;
          font-size: 0.95rem;
          background: none;
          color: #000;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .nav-btn:hover,
        .nav-btn.active {
          background-color: #7c3aed;
          color: #fff;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .user-avatar {
          background-color: #7c3aed;
          color: #fff;
          font-weight: 700;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.2;
          color: #000;
        }

        .user-status {
          font-size: 0.75rem;
          color: #6b7280;
          line-height: 1.1;
        }
      `}</style>
    </>
  );
}
