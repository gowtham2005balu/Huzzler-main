import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import {
  Home,
  Search,
  Briefcase,
  User,
  Settings,
  LogOut,
  Bookmark,
  Menu,
  X,
  MoreVertical,
  Plus,
  Tag,
  Star,
  Activity,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../../firbase/Firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";

export default function FreelanceSideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    role: "",
  });

  const fireSignOut = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      await signOut(auth);
      localStorage.clear();
      setMobileOpen(false);
      navigate("/freelance-dashboard", { replace: true });

    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    let unsubSnapshot;
    let unsubSnapshot2;
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      unsubSnapshot = onSnapshot(userRef, (snap) => {
        let data = {};
        if (snap.exists()) data = snap.data();
        
        const hasValidData = data.firstName || data.first_name || data.firstname || data.role || data.professional_title;

        if (snap.exists() && hasValidData) {
          let localData = {};
          try {
            const stored = localStorage.getItem("freelancerOtpUser") || localStorage.getItem("clientOtpUser");
            if (stored) localData = JSON.parse(stored);
          } catch (e) {}

          const authDisplayName = currentUser.displayName || "";
          const authFirst = authDisplayName.split(" ")[0] || "";
          const authLast = authDisplayName.split(" ").slice(1).join(" ") || "";

          setUserInfo({
            first_name: data.firstName || data.first_name || data.firstname || data.displayName || data.name || authFirst || localData.first_name || localData.firstName || "",
            last_name: data.lastName || data.last_name || data.lastname || authLast || localData.last_name || localData.lastName || "",
            role: data.professional_title || data.profession || data.role || data.category || "",
            profileImage: data.profileImage || "",
          });
        } else {
          const freelancerRef = doc(db, "freelancers", currentUser.uid);
          if (unsubSnapshot2) unsubSnapshot2();
          unsubSnapshot2 = onSnapshot(freelancerRef, (fSnap) => {
            if (fSnap.exists()) {
              const fData = fSnap.data();
              
              let localData = {};
              try {
                const stored = localStorage.getItem("freelancerOtpUser") || localStorage.getItem("clientOtpUser");
                if (stored) localData = JSON.parse(stored);
              } catch (e) {}

              const authDisplayName = currentUser.displayName || "";
              const authFirst = authDisplayName.split(" ")[0] || "";
              const authLast = authDisplayName.split(" ").slice(1).join(" ") || "";

              setUserInfo({
                first_name: fData.firstName || fData.first_name || fData.firstname || fData.displayName || fData.name || authFirst || localData.first_name || localData.firstName || "",
                last_name: fData.lastName || fData.last_name || fData.lastname || authLast || localData.last_name || localData.lastName || "",
                role: fData.professional_title || fData.profession || fData.role || fData.category || "",
                profileImage: fData.profileImage || "",
              });
            }
          });
        }
      });
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
      if (unsubSnapshot2) unsubSnapshot2();
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", next);
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
  }

  function handleMobileNav(path, state = null) {
    navigate(path, { state });
    setMobileOpen(false);
  }

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="mobile-topbar">
        <div className="hz-logo-icon">H</div>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`hz-sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-show" : ""
        }`}
      >
        {/* Toggle Button */}
        <button className="hz-collapse-btn" onClick={toggleSidebar}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* LOGO CARD */}
        <div className="hz-logo-area">
          <div className="hz-logo-icon">H</div>
          {!collapsed && (
            <span className="hz-logo-text">
              Huzzler <span style={{ color: '#7C4EF5' }}>AI</span>
            </span>
          )}
        </div>

        {/* MENU */}
        <nav className="hz-menu">
          <div className="hz-section-title">{!collapsed && "MAIN"}</div>
          
          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard") ? "active-btn" : ""}`}
            onClick={() => handleMobileNav("/freelance-dashboard")}
          >
            <Home size={18} className="icon-lucide" />
            {!collapsed && <span className="btn-text">Home</span>}
          </button>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/browse-projects") ? "active-btn" : ""}`}
            onClick={() => handleMobileNav("/freelance-dashboard/browse-projects")}
          >
            <Search size={18} className="icon-lucide" />
            {!collapsed && <span className="btn-text">Browse</span>}
          </button>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/messages") ? "active-btn" : ""}`}
            onClick={() => handleMobileNav("/freelance-dashboard/messages")}
          >
            <MessageSquare size={18} className="icon-lucide" />
            {!collapsed && <span className="btn-text">Messages</span>}
            {!collapsed && <span className="badge-count">3</span>}
          </button>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/notifications") ? "active-btn" : ""}`}
            onClick={() => handleMobileNav("/freelance-dashboard/notifications")}
          >
            <Bell size={18} className="icon-lucide" />
            {!collapsed && <span className="btn-text">Notifications</span>}
            {!collapsed && <span className="badge-count">5</span>}
          </button>

          <div className="hz-section-title">{!collapsed && "SERVICES"}</div>
          
          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/createservice") ? "active-btn" : ""}`}
            onClick={() => handleMobileNav("/freelance-dashboard/createservice")}
          >
            <Plus size={18} className="icon-lucide" />
            {!collapsed && <span className="btn-text">Create Service</span>}
          </button>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/myjobs") || (location.pathname === "/freelance-dashboard/accountfreelancer" && location.state?.activeTab === "My Services") ? "active-btn" : ""}`}
            onClick={() => handleMobileNav("/freelance-dashboard/accountfreelancer", { activeTab: "My Services" })}
          >
            <Plus size={18} className="hz-menu-btn-icon" style={{ display: 'none' }} />
            <Tag size={18} className="icon-lucide" />
            {!collapsed && <span className="btn-text">My Services</span>}
          </button>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/sidebarsaved") ? "active-btn" : ""}`}
            onClick={() => handleMobileNav("/freelance-dashboard/sidebarsaved")}
          >
            <Bookmark size={18} className="icon-lucide" />
            {!collapsed && <span className="btn-text">Saved Jobs</span>}
          </button>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/aigenerator") ? "active-btn" : ""}`}
            onClick={() => handleMobileNav("/freelance-dashboard/aigenerator")}
          >
            <Star size={18} className="icon-lucide" />
            {!collapsed && <span className="btn-text">AI Generator</span>}
            {!collapsed && <span className="badge-ai">AI</span>}
          </button>

          <div className="hz-section-title">{!collapsed && "ACCOUNT"}</div>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/accountfreelancer") && location.state?.activeTab !== "My Services" ? "active-btn" : ""}`}
            onClick={() => handleMobileNav("/freelance-dashboard/accountfreelancer", { activeTab: "Profile Summary" })}
          >
            <User size={18} className="icon-lucide" />
            {!collapsed && <span className="btn-text">Profile</span>}
          </button>

          <button
            className={`hz-menu-btn ${isActive("/freelance-dashboard/settings") ? "active-btn" : ""}`}
            onClick={() => handleMobileNav("/freelance-dashboard/settings")}
          >
            <Settings size={18} className="icon-lucide" />
            {!collapsed && <span className="btn-text">Account Details</span>}
          </button>

        </nav>

        {/* FOOTER */}
        <div className="hz-user-footer">
          <div className="hz-user-avatar">
            {userInfo.profileImage ? (
              <img src={userInfo.profileImage} alt="" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
            ) : (
              <>
                {(userInfo.first_name || "Freelancer")[0].toUpperCase()}
                {(userInfo.last_name || "")[0]?.toUpperCase() || ""}
              </>
            )}
          </div>

          {!collapsed && (
            <div className="hz-user-info">
              <p className="hz-user-name">
                {userInfo.first_name || "Freelancer"} {userInfo.last_name || ""}
              </p>
              <p className="hz-user-role">{userInfo.role || "UI/UX Designer"}</p>
            </div>
          )}
          
          {!collapsed && (
            <div className="hz-user-more" onClick={() => setShowUserMenu(!showUserMenu)}>
              <MoreVertical size={16} />
              
              {showUserMenu && (
                <div className="hz-user-popup-menu">
                  <button className="hz-popup-btn" onClick={() => handleMobileNav("/freelance-dashboard/settings")}>
                    <Settings size={16} className="icon-lucide" />
                    <span>Account Settings</span>
                  </button>
                  <div className="hz-popup-divider"></div>
                  <button className="hz-popup-btn hz-logout-btn" onClick={fireSignOut}>
                    <LogOut size={16} color="#ef4444" className="icon-lucide" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* CSS */}
      <style>{`
        .hz-sidebar {
          width: 280px;
          height: 100vh;
          background: #ffffff;
          border-right: 1px solid #F3F4F6;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          transition: 0.3s ease;
          font-family: 'DM Sans', sans-serif;
          z-index: 999;
        }

        .hz-sidebar.collapsed {
          width: 80px;
        }

        /* COLLAPSE BUTTON */
        .hz-collapse-btn {
          position: absolute;
          top: 36px;
          right: -16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #E5E7EB;
          color: #6B7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s ease;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .hz-collapse-btn:hover {
          background: #F9FAFB;
        }

        /* LOGO */
        .hz-logo-area {
          height: 90px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 12px;
          margin-top: 10px;
        }
        
        .hz-sidebar.collapsed .hz-logo-area {
          padding: 0;
          justify-content: center;
        }

        .hz-logo-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          background: #7C4EF5;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 20px;
          font-family: 'Sora', sans-serif;
        }

        .hz-logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          font-family: 'Sora', sans-serif;
        }

        /* MENU */
        .hz-menu {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow-y: auto;
          padding-bottom: 20px;
        }

        /* Scrollbar styles for menu */
        .hz-menu::-webkit-scrollbar {
          width: 4px;
        }
        .hz-menu::-webkit-scrollbar-track {
          background: transparent;
        }
        .hz-menu::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 4px;
        }

        .hz-section-title {
          font-size: 11px;
          letter-spacing: 1px;
          color: #9CA3AF;
          font-weight: 700;
          padding: 24px 24px 8px 24px;
          text-transform: uppercase;
        }
        
        .hz-sidebar.collapsed .hz-section-title {
          visibility: hidden;
          padding: 12px 0;
          height: 0;
        }

        .hz-menu-btn {
          height: 44px;
          min-height: 44px;
          margin: 2px 16px;
          border: none;
          border-radius: 10px;
          background: transparent;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 12px;
          cursor: pointer;
          transition: 0.2s ease;
          color: #4B5563;
        }

        .hz-sidebar.collapsed .hz-menu-btn {
          justify-content: center;
          padding: 0;
        }

        .icon-lucide {
          color: #6B7280;
          min-width: 18px;
        }

        .btn-text {
          font-size: 14px;
          font-weight: 500;
        }

        /* HOVER */
        .hz-menu-btn:hover {
          background: #F3F4F6;
        }

        /* ACTIVE */
        .active-btn {
          background: #7C4EF5 !important;
          color: white !important;
        }
        .active-btn .icon-lucide {
          color: white;
        }
        .active-btn .btn-text {
          color: white;
        }

        /* BADGES */
        .badge-count {
          margin-left: auto;
          background: #7C4EF5;
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 12px;
          line-height: 1.2;
        }
        .active-btn .badge-count {
          background: white;
          color: #7C4EF5;
        }
        
        .badge-ai {
          margin-left: auto;
          background: #E3F874;
          color: #1A1433;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 12px;
          line-height: 1.2;
        }

        /* USER FOOTER */
        .hz-user-footer {
          height: 76px;
          border-top: 1px solid #F3F4F6;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 12px;
          background: white;
        }
        
        .hz-sidebar.collapsed .hz-user-footer {
          padding: 0;
          justify-content: center;
        }

        .hz-user-avatar {
          width: 40px;
          height: 40px;
          min-width: 40px;
          background: #7C4EF5;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .hz-user-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }

        .hz-user-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin: 0;
          line-height: 1.2;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .hz-user-role {
          font-size: 12px;
          color: #6B7280;
          margin: 0;
          line-height: 1.2;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .hz-user-more {
          margin-left: auto;
          color: #9CA3AF;
          cursor: pointer;
          display: flex;
          align-items: center;
          position: relative;
        }
        .hz-user-more:hover {
          color: #4B5563;
        }

        /* POPUP MENU */
        .hz-user-popup-menu {
          position: absolute;
          bottom: 100%;
          right: 0;
          margin-bottom: 8px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #F3F4F6;
          padding: 8px 0;
          width: 200px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .hz-popup-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #4B5563;
          transition: background 0.2s ease;
          text-align: left;
        }

        .hz-popup-btn:hover {
          background: #F9FAFB;
        }

        .hz-logout-btn {
          color: #ef4444;
        }

        .hz-logout-btn .icon-lucide {
          color: #ef4444;
        }

        .hz-popup-divider {
          height: 1px;
          background: #F3F4F6;
          margin: 4px 0;
        }

        /* MOBILE TOPBAR */
        .mobile-topbar {
          display: none;
        }

        @media (max-width: 768px) {
          * {
            overflow-x: hidden;
          }
          .hz-sidebar {
            top: 60px;
            left: -320px;
            border-right: none;
          }

          .hz-sidebar.mobile-show {
            height: calc(100vh - 60px);
            left: 0;
            width: 100%;
          }

          .hz-collapse-btn {
            display: none;
          }

          .mobile-topbar {
            display: flex;
            width: 100%;
            height: 60px;
            background: white;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            border-bottom: 1px solid #E5E7EB;
            position: fixed;
            top: 0;
            z-index: 1000;
          }

          .mobile-menu-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #111827;
          }
          
          .hz-logo-area {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
