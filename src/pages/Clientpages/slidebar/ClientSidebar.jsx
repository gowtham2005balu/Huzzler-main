
// import {
//   Home,
//   Search,
//   Briefcase,
//   User,
//   Settings,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";

// import { useNavigate } from "react-router-dom";
// import hire from "../../../assets/hire.png";
// import save2 from "../../../assets/save2.png";
// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../../../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import logo from "../../../assets/logo.png";

// export default function Sidebar() {
//   const navigate = useNavigate();

//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   const [mobileOpen, setMobileOpen] = useState(false);

//   const [activeTab, setActiveTab] = useState("home");

//   const [userInfo, setUserInfo] = useState({
//     first_name: "",
//     last_name: "",
//   });

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         const data = snap.data();
//         setUserInfo({
//           first_name: data.first_name || "",
//           last_name: data.last_name || "",
//         });
//       }
//     });

//     return () => unsub();
//   }, []);

//   function toggleSidebar() {
//     const next = !collapsed;
//     setCollapsed(next);
//     localStorage.setItem("sidebar-collapsed", next);
//     window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
//   }

//   function handleNav(path, name) {
//     setActiveTab(name);
//     navigate(path);
//     setMobileOpen(false); // ✅ close sidebar on mobile click
//   }

//   return (
//     <>
//       {/* ========== MOBILE TOPBAR (NEW) ========== */}
//       <div className="mobile-topbar">
//         <img src={logo} className="mobile-logo" />
//         <button
//           className="mobile-menu-btn"
//           onClick={() => setMobileOpen(!mobileOpen)}
//         >
//           {mobileOpen ? <X size={26} /> : <Menu size={26} />}
//         </button>
//       </div>

//       {/* ========== SIDEBAR ========== */}
//       <aside
//         className={`hz-sidebar ${collapsed ? "collapsed" : ""} ${
//           mobileOpen ? "mobile-show" : ""
//         }`}
//       >
//         {/* TOGGLE BUTTON (DESKTOP SAME) */}
//         <button className="hz-collapse-btn" onClick={toggleSidebar}>
//           {collapsed ? ">" : "<"}
//         </button>

//         {/* LOGO */}
//         {!collapsed ? (
//           <div className="hz-logo-card">
//             <img src={logo} className="hz-logo-img" />
//             <span className="hz-logo-text">HUZZLER</span>
//           </div>
//         ) : (
//           <div className="hz-logo-small-wrap">
//             <img src={logo} className="hz-logo-img-small" />
//           </div>
//         )}

//         {/* MENU */}
//         <nav className="hz-menu">
//           <button
//             className={`hz-menu-btn ${activeTab === "home" ? "active-btn" : ""}`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/clientserachbar", "home")
//             }
//           >
//             <Home size={18} className="icon" />
//             {!collapsed && "Home"}
//           </button>

//           <button
//             className={`hz-menu-btn ${activeTab === "browse" ? "active-btn" : ""}`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/ClientSideCategories", "browse")
//             }
//           >
//             <Search size={18} className="icon" />
//             {!collapsed && "Browse Projects"}
//           </button>

//           <button
//             className={`hz-menu-btn ${activeTab === "jobs" ? "active-btn" : ""}`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/AddJobScreen", "jobs")
//             }
//           >
//             <Briefcase size={18} className="icon" />
//             {!collapsed && "Job Posted"}
//           </button>

//           <button
//             className={`hz-menu-btn ${
//               activeTab === "service" ? "active-btn" : ""
//             }`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/my-hires", "service")
//             }
//           >
//             <img src={hire} width={18} className="icon" />
//             {!collapsed && "Hire"}
//           </button>

//           <button
//             className={`hz-menu-btn ${activeTab === "saved" ? "active-btn" : ""}`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/Clientsaved", "saved")
//             }
//           >
//             <img src={save2} width={18} className="icon" />
//             {!collapsed && "Saved"}
//           </button>

//           <div className="hz-bottom-menu">
//             <button
//               className={`hz-menu-btn ${
//                 activeTab === "profile" ? "active-btn" : ""
//               }`}
//               onClick={() =>
//                 handleNav("/client-dashbroad2/ClientProfile", "profile")
//               }
//             >
//               <User size={18} className="icon" />
//               {!collapsed && "Profile"}
//             </button>

//             <button
//               className={`hz-menu-btn ${
//                 activeTab === "settings" ? "active-btn" : ""
//               }`}
//               onClick={() =>
//                 handleNav(
//                   "/client-dashbroad2/companyprofileview",
//                   "settings"
//                 )
//               }
//             >
//               <Settings size={18} className="icon" />
//               {!collapsed && "Settings"}
//             </button>

//             <button className="hz-menu-btn" onClick={() => navigate("/logout")}>
//               <LogOut size={18} className="icon" />
//               {!collapsed && "Logout"}
//             </button>
//           </div>
//         </nav>

//         {/* FOOTER */}
//         <div className="hz-user-footer">
//           <div className="hz-user-avatar">
//             {(userInfo.first_name || "?")[0].toUpperCase()}
//           </div>

//           {!collapsed && (
//             <div>
//               <p className="hz-user-name">
//                 {userInfo.first_name} {userInfo.last_name}
//               </p>
//               <p className="hz-user-role">Client</p>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* ========== STYLES ========== */}
//       <style>{`
//         /* --------- DESKTOP STYLES (UNCHANGED) --------- */

//         .hz-sidebar {
//           width: 300px;
//           height: 100vh;
//           background: #e8e8e8;
//           position: fixed;
//           left: 0;
//           top: 0;
//           padding: 18px;
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           transition: 0.3s ease;
//           font-family: 'Rubik', sans-serif;
//           z-index: 999;
//         }

//         .hz-sidebar.collapsed {
//           width: 80px;
//         }

//         .hz-collapse-btn {
//           position: absolute;
//           top: 50px;
//           left: 320px;
//           width: 32px;
//           height: 32px;
//           border-radius: 10px;
//           background: #a855f7;
//           border: none;
//           color: white;
//           cursor: pointer;
//           transition: left 0.3s ease;
//         }

//         .hz-sidebar.collapsed .hz-collapse-btn {
//           left: 100px;
//         }

//         .hz-logo-card {
//           width: 80%;
//           height: 75px;
//           background: #a855f7;
//           border-radius: 20px;
//           display: flex;
//           align-items: center;
//           padding: 10px 18px;
//           gap: 16px;
//           box-shadow: 0 8px 20px rgba(0,0,0,0.1);
//           margin-top: -10px;
//         }

//         .hz-logo-img {
//           width: 46px;
//           height: 46px;
//         }

//         .hz-logo-text {
//           font-size: 22px;
//           font-weight: 600;
//           color: white;
//         }

//         .hz-logo-img-small {
//           width: 55px;
//           height: 55px;
//           background: white;
//           border-radius: 14px;
//           border: 2px solid #a855f7;
//           padding: 4px;
//         }

//         .hz-logo-small-wrap {
//           display: flex;
//           justify-content: center;
//           margin-bottom: 10px;
//         }

//         .hz-menu {
//           margin-top: 5px;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }

//         .hz-menu-btn {
//           height: 40px;
//           width: 90%;
//           border: none;
//           border-radius: 14px;
//           background: none;
//           display: flex;
//           align-items: center;
//           padding: 0 16px;
//           gap: 12px;
//           cursor: pointer;
//           transition: 0.25s ease;
//           font-size: 15px;
//           color: #222;
//         }

//         .hz-menu-btn:hover {
//           background: #c084fc;
//           color: white;
//         }

//         .active-btn {
//           background: #a855f7 !important;
//           color: white !important;
//         }

//         .hz-sidebar.collapsed .hz-menu-btn {
//           justify-content: center;
//           padding: 0;
//         }

//         .hz-user-footer {
//           height: 70px;
//           background: white;
//           box-shadow: 0 6px 20px rgba(0,0,0,0.1);
//           width: calc(100% + 6px);
//           margin-left: -18px;
//           display: flex;
//           align-items: center;
//           padding: 10px 15px;
//           gap: 12px;
//           margin-bottom: 25px;
//         }

//         .hz-user-avatar {
//           width: 44px;
//           height: 44px;
//           background: #a855f7;
//           border-radius: 50%;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           color: white;
//           font-weight: 600;
//         }

//         .hz-user-name {
//           font-size: 15px;
//           font-weight: 600;
//         }

//         .hz-user-role {
//           font-size: 12px;
//           color: #666;
//         }

//         .hz-bottom-menu {
//           margin-top: 100px;
//           display: flex;
//           flex-direction: column;
//           gap: 14px;
//         }

//         /* --------- MOBILE ONLY (NEW) --------- */

//         .mobile-topbar {
//           display: none;
//         }

//         @media (max-width: 768px) {
//           .hz-sidebar {
//             left: -320px;
//           }

//           .hz-sidebar.mobile-show {
//             left: 0;
//             width: 100%;
//           }

//           .hz-collapse-btn {
//             display: none;
//           }

//           .mobile-topbar {
//             display: flex;
//             width: 100%;
//             height: 60px;
//             background: white;
//             align-items: center;
//             justify-content: space-between;
//             padding: 0 16px;
//             position: fixed;
//             top: 0;
//             z-index: 1000;
//             border-bottom: 1px solid #ddd;
//           }

//           .mobile-logo {
//             width: 45px;
//           }

//           .mobile-menu-btn {
//             background: none;
//             border: none;
//             cursor: pointer;
//           }
//         }
//       `}</style>
//     </>
//   );
// }




// import React, { useEffect, useState } from "react";
// import logo from "../../../assets/logo.png";
// import hire from "../../../assets/hire.png";

// import myservices from "../../../assets/MyServices.png";
// import myjobs from "../../../assets/myjobs.png";
// import search from "../../../assets/search.png";
// import profile from "../../../assets/profile.png";
// import settings from "../../../assets/settings.png";
// import save2 from "../../../assets/save2.png";
// import home from "../../../assets/Home.png";
// import signout from "../../../assets/signout.png";

// import {
//   Home,
//   Search,
//   Briefcase,
//   User,
//   Settings,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";

// import { useNavigate, useLocation } from "react-router-dom";
// import { auth, db } from "../../../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// export default function ClientSidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const [userInfo, setUserInfo] = useState({
//     first_name: "",
//     last_name: "",
//   });

//   useEffect(() => {
//     onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;
//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         const data = snap.data();
//         setUserInfo({
//           first_name: data.first_name || "",
//           last_name: data.last_name || "",
//         });
//       }
//     });
//   }, []);

//   const isActive = (path) => location.pathname === path;

//   function toggleSidebar() {
//     const next = !collapsed;
//     setCollapsed(next);
//     localStorage.setItem("sidebar-collapsed", next);
//     window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
//   }

//   function handleNav(path) {
//     navigate(path);
//     setMobileOpen(false);
//   }

//   return (
//     <>
//       {/* MOBILE TOPBAR */}
//       <div className="mobile-topbar">
//         <img src={logo} className="mobile-logo" />
//         <button
//           className="mobile-menu-btn"
//           onClick={() => setMobileOpen(!mobileOpen)}
//         >
//           {mobileOpen ? <X size={26} /> : <Menu size={26} />}
//         </button>
//       </div>

//       {/* SIDEBAR */}
//       <aside
//         className={`hz-sidebar ${collapsed ? "collapsed" : ""} ${
//           mobileOpen ? "mobile-show" : ""
//         }`}
//       >
//         {/* COLLAPSE */}
//         <button className="hz-collapse-btn" onClick={toggleSidebar}>
//           {collapsed ? ">" : "<"}
//         </button>

//         {/* LOGO */}
//         {!collapsed ? (
//           <div className="hz-logo-card">
//             <img src={logo} className="hz-logo-img" />
//             <span className="hz-logo-text">HUZZLER</span>
//           </div>
//         ) : (
//           <div className="hz-logo-small-wrap">
//             <img src={logo} className="hz-logo-img-small" />
//           </div>
//         )}

//         {/* MENU */}
//         <nav className="hz-menu">
//           <button
//             className={`hz-menu-btn ${
//               isActive("/client-dashbroad2/clientserachbar") ? "active-btn" : ""
//             }`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/clientserachbar")
//             }
//           >
//             <img src={home} width={18} />
//             {!collapsed && "Home"}
//           </button>

//           <button
//             className={`hz-menu-btn ${
//               isActive("/client-dashbroad2/ClientSideCategoryPage") ? "active-btn" : ""
//             }`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/ClientSideCategoryPage")
//             }
//           >
//             <img src={search} width={18} />
//             {!collapsed && "Browse Projects"}
//           </button>

//           <button
//             className={`hz-menu-btn ${
//               isActive("/client-dashbroad2/AddJobScreen") ? "active-btn" : ""
//             }`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/AddJobScreen")
//             }
//           >
//             <img src={myjobs} width={18} />
//             {!collapsed && "Job Posted"}
//           </button>

//           <button
//             className={`hz-menu-btn ${
//               isActive("/client-dashbroad2/my-hires") ? "active-btn" : ""
//             }`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/my-hires")
//             }
//           >
//             <img src={hire} width={18} />
//             {!collapsed && "Hire"}
//           </button>

//           <button
//             className={`hz-menu-btn ${
//               isActive("/client-dashbroad2/Clientsaved") ? "active-btn" : ""
//             }`}
//             onClick={() =>
//               handleNav("/client-dashbroad2/Clientsaved")
//             }
//           >
//             <img src={save2} width={18} />
//             {!collapsed && "Saved"}
//           </button>

//           <div className="hz-bottom-menu">
//             <button
//               className={`hz-menu-btn ${
//                 isActive("/client-dashbroad2/ClientProfile") ? "active-btn" : ""
//               }`}
//               onClick={() =>
//                 handleNav("/client-dashbroad2/ClientProfile")
//               }
//             >
//             <img src={profile} width={18} />
//               {!collapsed && "Profile"}
//             </button>

//             <button
//               className={`hz-menu-btn ${
//                 isActive("/client-dashbroad2/companyprofileview") ? "active-btn" : ""
//               }`}
//               onClick={() =>
//                 handleNav("/client-dashbroad2/companyprofileview")
//               }
//             >
//              <img src={settings} width={18} />
//               {!collapsed && "Settings"}
//             </button>

//             <button className="hz-menu-btn" onClick={() => navigate("/firelogin")}>
//               <img src={signout} width={18} />
//               {!collapsed && "Logout"}
//             </button>
//           </div>
//         </nav>

//         {/* FOOTER */}
//         <div className="hz-user-footer">
//           <div className="hz-user-avatar">
//             {(userInfo.first_name || "?")[0].toUpperCase()}
//           </div>
//           {!collapsed && (
//             <div>
//               <p className="hz-user-name">
//                 {userInfo.first_name || userInfo.name } {userInfo.last_name}
//               </p>
//               <p className="hz-user-role">Client</p>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* 🔥 SAME CSS AS FREELANCER */}
     
//       {/* CSS */}
//       <style>{`
//      .hz-sidebar {
//   width: 300px;
//   height: 100vh;
//   background: #e8e8e8;
//   position: fixed;
//   left: 0;
//   top: 0;
//   padding: 18px;
//   display: flex;
//   flex-direction: column;
//   transition: 0.3s ease;
//   font-family: "Rubik", sans-serif;
//   z-index: 999;
// }

// .hz-sidebar.collapsed {
//   width: 80px;
// }

// /* COLLAPSE BUTTON */
// .hz-collapse-btn {
//   position: absolute;
//   top: 60px;
//   left: 290px;
//   width: 32px;
//   height: 42px;
//   border-radius: 10px;
//   background: #a855f7;
//   border: none;
//   color: white;
//   cursor: pointer;
//   transition: left 0.3s ease;
// }

// .hz-sidebar.collapsed .hz-collapse-btn {
//   left: 70px;
//    top: 100px;
// }

// /* LOGO */
// .hz-logo-card {
//   width: 240px;
//   height: 90px;
//   background: #a855f7;
//   border-radius: 20px;
//   display: flex;
//   align-items: center;
//   padding: 10px 18px;
//   gap: 16px;
//   box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
//   margin-top: 30px;
//   margin-bottom: 40px;
// }

// .hz-logo-img {
//   width: 46px;
//   height: 46px;
// }

// .hz-logo-text {
//   font-size: 22px;
//   font-weight: 600;
//   color: white;
// }

// .hz-logo-small-wrap {
//   display: flex;
//   justify-content: center;
//   margin-top: 30px;
//   margin-bottom: 40px;
// }

// .hz-logo-img-small {
//   width: 55px;
//   height: 55px;

//   border-radius: 14px;
//   border: 2px solid #a855f7;
//   padding: 4px;
// }

// /* MENU */
// .hz-menu {
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
//   flex: 1; /* IMPORTANT */
// }

// .hz-menu-btn {
//   height: 40px;
//   width: 90%;
//   border: none;
//   border-radius: 14px;
//   background: none;
//   display: flex;
//   align-items: center;
//   padding: 25px 16px;
//   gap: 12px;
//   cursor: pointer;
//   transition: 0.25s ease;
//   font-size: 15px;
//   color: #222;
// }

// .hz-menu-btn img {
//   width: 18px;
//   min-width: 18px;
// }

// /* HOVER */
// .hz-menu-btn:hover {
//   background: #c084fc;
//   color: white;
// }

// .hz-menu-btn:hover img {
//   filter: brightness(0) invert(1);
// }

// /* ACTIVE */
// .active-btn {
//   background: #a855f7 !important;
//   color: white !important;
// }

// .active-btn img {
//   filter: brightness(0) invert(1);
// }

// /* COLLAPSED MENU (NO SPACING CHANGE) */
// .hz-sidebar.collapsed .hz-menu-btn {
//   justify-content: center;
//   padding: 25px 16px;
// }

// /* BOTTOM MENU */
// .hz-bottom-menu {
//   margin-top: auto; /* KEY FIX */
//   padding-top: 10px;
//   display: flex;
//   flex-direction: column;
//   gap: 14px;
// }

// /* USER FOOTER */
// .hz-user-footer {
//   height: 70px;
//   background: white;
//   box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
//   width: calc(100% + 35px);
//   margin-left: -18px;
//   display: flex;
//   align-items: center;
//   padding: 10px 15px;
//   gap: 12px;
//   margin-bottom: 25px;
// }

// .hz-user-avatar {
//   width: 44px;
//   height: 44px;
//   background: #a855f7;
//   border-radius: 50%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: white;
//   font-weight: 600;
// }

// .hz-user-name {
//   font-size: 15px;
//   font-weight: 600;
// margin-top:10px;
// }

// .hz-user-role {
//   font-size: 12px;
//   color: #666;
 
//   margin-top:-4px;
 
// }

// /* MOBILE TOPBAR */
// .mobile-topbar {
//   display: none;
// }

// @media (max-width: 768px) {
// *{
// overflow:hidden;
// }
//   .hz-sidebar {
//   top:30px;
//     left: -320px;
//   }

//   .hz-sidebar.mobile-show {
//  height:100%;
//     left: 0;
//     width: 100%;
//   }

//   .hz-collapse-btn {
//     display: none;
//   }

//   .mobile-topbar {
//     display: flex;
//     width: 100%;
//     height: 60px;
//     background: white;
//     align-items: center;
//     justify-content: space-between;
//     padding: 0 15px;
//     border-bottom: 1px solid #ddd;
//     position: fixed;
//     top: 0;
//     z-index: 1000;
//   }

//   .mobile-logo {
//     width: 45px;
  
//   }

//   .mobile-menu-btn {
//     background: none;
//     border: none;
//     cursor: pointer;
//   }
//  /* LOGO */
// .hz-logo-card {
//   width: 360px;
//   height: 90px;
//   background: #a855f7;
//   border-radius: 20px;
//   display: flex;
//   align-items: center;
//   padding: 10px 18px;
//   gap: 16px;
//   box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
//   margin-top: 30px;
//   margin-bottom: 40px;
 
// }

// }

//       `}</style>
//     </>
//   );
// }




import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import hire from "../../../assets/hire.png";

import myservices from "../../../assets/MyServices.png";
import myjobs from "../../../assets/myjobs.png";
import {
  LayoutGrid,
  Search,
  MessageSquare,
  Bell,
  Activity,
  PlusCircle,
  FileText,
  Tag,
  Edit3,
  Users,
  BarChart2,
  CreditCard,
  User,
  Star,
  Settings,
  UserCircle,
  Briefcase,
  MessageCircle,
  CheckCircle,
  Menu,
  X,
  LogOut,
  MoreVertical
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../../firbase/Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function ClientSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    let unsubSnapshot;
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      unsubSnapshot = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          let localData = {};
          try {
            const stored = localStorage.getItem("clientOtpUser") || localStorage.getItem("freelancerOtpUser");
            if (stored) localData = JSON.parse(stored);
          } catch (e) {}

          const authDisplayName = currentUser.displayName || "";
          const authFirst = authDisplayName.split(" ")[0] || "";
          const authLast = authDisplayName.split(" ").slice(1).join(" ") || "";

          setUserInfo({
            first_name: data.first_name || data.firstName || data.firstname || data.displayName || data.name || authFirst || localData.first_name || localData.firstName || "",
            last_name: data.last_name || data.lastName || data.lastname || authLast || localData.last_name || localData.lastName || "",
          });
        }
      });
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", next);
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
  }

  function handleNav(path) {
    if (path) navigate(path);
    setMobileOpen(false);
  }

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    await signOut(auth);
    localStorage.clear();
    setMobileOpen(false);
    navigate("/freelance-dashboard", { replace: true });

  };

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="mobile-topbar">
        <div className="hz-client-sidebar-logo mobile-logo">
          <div className="hz-client-logo-icon">
            <svg width="18" height="24" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.1667 1.83333L1.83333 12.8333H8.25L7.33333 20.1667L15.6667 9.16667H9.25L10.1667 1.83333Z" fill="#FFD43B" />
            </svg>
          </div>
        </div>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} color="#1A1433" /> : <Menu size={26} color="#1A1433" />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`hz-sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-show" : ""
        }`}
      >
        {/* LOGO */}
        <div className="hz-client-sidebar-header">
          <div className="hz-client-sidebar-logo" style={{ cursor: "pointer" }} onClick={toggleSidebar}>
            <div className="hz-client-logo-icon">
              <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.1667 1.83333L1.83333 12.8333H8.25L7.33333 20.1667L15.6667 9.16667H9.25L10.1667 1.83333Z" fill="#FFD43B" />
              </svg>
            </div>
            {!collapsed && <span className="hz-client-logo-text">Huzzler</span>}
          </div>
        </div>

        {/* SCROLLABLE MENU */}
        <div className="sidebar-scrollable">
          
          {/* MAIN */}
          <div className="sidebar-group">
            {!collapsed && <div className="sidebar-title">MAIN</div>}
            <button className={`hz-menu-btn ${isActive("/client-dashbroad2/clientserachbar") || isActive("/client-dashbroad2") ? "active-btn" : ""}`} onClick={() => handleNav("/client-dashbroad2/clientserachbar")}>
              <LayoutGrid size={18} className="icon" />
              {!collapsed && <span className="btn-text">Dashboard</span>}
            </button>
            <button className={`hz-menu-btn ${isActive("/client-dashbroad2/ClientSideCategoryPage") ? "active-btn" : ""}`} onClick={() => handleNav("/client-dashbroad2/ClientSideCategoryPage")}>
              <Search size={18} className="icon" />
              {!collapsed && <span className="btn-text">Browse Jobs</span>}
            </button>
            <button className={`hz-menu-btn ${isActive("/client-dashbroad2/messages") ? "active-btn" : ""}`} onClick={() => handleNav("/client-dashbroad2/messages")}>
              <MessageSquare size={18} className="icon" />
              {!collapsed && <div className="btn-content"><span className="btn-text">Messages</span><span className="badge">4</span></div>}
            </button>
            <button className={`hz-menu-btn ${isActive("/client-dashbroad2/clientNotification") ? "active-btn" : ""}`} onClick={() => handleNav("/client-dashbroad2/clientNotification")}>
              <Bell size={18} className="icon" />
              {!collapsed && <div className="btn-content"><span className="btn-text">Notifications</span><span className="badge">3</span></div>}
            </button>
          </div>

          {/* WORK */}
          <div className="sidebar-group">
            {!collapsed && <div className="sidebar-title">WORK</div>}

            <button className={`hz-menu-btn ${isActive("/client-dashbroad2/AddJobScreen") ? "active-btn" : ""}`} onClick={() => handleNav("/client-dashbroad2/AddJobScreen")}>
              <FileText size={18} className="icon" />
              {!collapsed && <div className="btn-content"><span className="btn-text">My Listings</span><span className="badge">3</span></div>}
            </button>
            <button className={`hz-menu-btn ${isActive("/client-dashbroad2/Clientsaved") ? "active-btn" : ""}`} onClick={() => handleNav("/client-dashbroad2/Clientsaved")}>
              <Tag size={18} className="icon" />
              {!collapsed && <span className="btn-text">My Services</span>}
            </button>
            <button className={`hz-menu-btn ${isActive("/client-dashbroad2/PostJob") ? "active-btn" : ""}`} onClick={() => handleNav("/client-dashbroad2/PostJob")}>
              <Edit3 size={18} className="icon" />
              {!collapsed && <span className="btn-text">Create Service</span>}
            </button>
            <button className={`hz-menu-btn ${isActive("/client-dashbroad2/my-hires") ? "active-btn" : ""}`} onClick={() => handleNav("/client-dashbroad2/my-hires")}>
              <Users size={18} className="icon" />
              {!collapsed && <div className="btn-content"><span className="btn-text">Applicants</span><span className="badge">8</span></div>}
            </button>
          </div>



          {/* ACCOUNT */}
          <div className="sidebar-group">
            {!collapsed && <div className="sidebar-title">ACCOUNT</div>}
            <button className={`hz-menu-btn ${isActive("/client-dashbroad2/ClientProfile") ? "active-btn" : ""}`} onClick={() => handleNav("/client-dashbroad2/ClientProfile")}>
              <User size={18} className="icon" />
              {!collapsed && <span className="btn-text">Talent Profile</span>}
            </button>
            <button className={`hz-menu-btn`} onClick={() => {}}>
              <Star size={18} className="icon" />
              {!collapsed && <span className="btn-text">AI Assistant</span>}
            </button>
            <button className={`hz-menu-btn ${isActive("/client-dashbroad2/settings") ? "active-btn" : ""}`} onClick={() => handleNav("/client-dashbroad2/settings")}>
              <Settings size={18} className="icon" />
              {!collapsed && <span className="btn-text">Settings</span>}
            </button>
            <button className={`hz-menu-btn ${isActive("/client-dashbroad2/account-details") ? "active-btn" : ""}`} onClick={() => handleNav("/client-dashbroad2/account-details")}>
              <UserCircle size={18} className="icon" />
              {!collapsed && <span className="btn-text">Account Details</span>}
            </button>
          </div>


          


        </div>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <div className="footer-avatar">
            {(userInfo.first_name || userInfo.name || "C")[0].toUpperCase()}
          </div>
          {!collapsed && (
            <div className="footer-info">
              <div className="footer-name">
                {userInfo.first_name || userInfo.name || "Creativo"} {userInfo.last_name || "Studio"}
              </div>
              <div className="footer-role">Pro Client · Verified</div>
            </div>
          )}
          {!collapsed && (
            <div className="hz-user-more" onClick={() => setShowUserMenu(!showUserMenu)}>
              <MoreVertical size={16} />
              
              {showUserMenu && (
                <div className="hz-user-popup-menu">
                  <button className="hz-popup-btn" onClick={() => handleNav("/client-dashbroad2/settings")}>
                    <Settings size={16} className="icon-lucide" />
                    <span>Account Settings</span>
                  </button>
                  <div className="hz-popup-divider"></div>
                  <button className="hz-popup-btn hz-logout-btn" onClick={handleLogout}>
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
          background: #FFFFFF;
          border-right: 1px solid #EEEDF3;
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

        /* HEADER & LOGO */
        .hz-client-sidebar-header {
          padding: 24px 24px;
          border-bottom: 1px solid #EEEDF3;
        }

        .hz-client-sidebar-logo {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
        }

        .hz-client-logo-icon {
          width: 36px;
          min-width: 36px;
          height: 36px;
          background: #6C3EEB;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFD43B;
          font-size: 18px;
          flex-shrink: 0;
        }

        .hz-client-logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #1A1433;
          font-family: 'Sora', sans-serif;
          margin: 0;
          padding: 0;
          line-height: 1;
        }

        /* SCROLLABLE AREA */
        .sidebar-scrollable {
          flex: 1;
          overflow-y: auto;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .sidebar-scrollable::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scrollable::-webkit-scrollbar-thumb {
          background-color: #EBE5F2;
          border-radius: 4px;
        }

        /* GROUPS */
        .sidebar-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-title {
          font-size: 11px;
          font-weight: 700;
          color: #B5B1C6;
          letter-spacing: 1px;
          margin-bottom: 8px;
          padding-left: 12px;
        }

        /* BUTTONS */
        .hz-menu-btn {
          height: 40px;
          width: 100%;
          border: none;
          border-radius: 12px;
          background: transparent;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #8C84A8;
        }

        .hz-menu-btn .icon {
          min-width: 18px;
          color: #A39DBA;
        }

        .btn-text {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .badge {
          background: #6C3EEB;
          color: white;
          font-size: 11px;
          font-weight: 700;
          width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* HOVER & ACTIVE */
        .hz-menu-btn:hover {
          background: #F8F7FA;
          color: #1A1433;
        }
        
        .hz-menu-btn:hover .icon {
          color: #6C3EEB;
        }

        .active-btn {
          background: #F5F2FF !important;
          color: #6C3EEB !important;
        }

        .active-btn .icon {
          color: #6C3EEB !important;
        }

        /* FOOTER */
        .sidebar-footer {
          padding: 20px 24px;
          border-top: 1px solid #EEEDF3;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-avatar {
          width: 40px;
          height: 40px;
          background: #6C3EEB;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          min-width: 40px;
        }

        .footer-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .footer-name {
          font-size: 14px;
          font-weight: 700;
          color: #1A1433;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .footer-role {
          font-size: 12px;
          color: #8C84A8;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        /* MOBILE STYLES */
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

        .icon-lucide {
          color: #6B7280;
          min-width: 18px;
        }

        .mobile-topbar {
          display: none;
        }

        @media (max-width: 768px) {
          .hz-sidebar {
            left: -100%;
          }
          
          .hz-sidebar.mobile-show {
            left: 0;
            width: 80%;
            max-width: 300px;
          }

          .mobile-topbar {
            display: flex;
            width: 100%;
            height: 60px;
            background: white;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            border-bottom: 1px solid #EEEDF3;
            position: fixed;
            top: 0;
            z-index: 1000;
          }

          .mobile-menu-btn {
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .mobile-logo {
            padding: 0;
            border: none;
          }
        }
      `}</style>
    </>
  );
}