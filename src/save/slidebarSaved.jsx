import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firbase/Firebase";

import profilePlaceholder from "../assets/profile.png";
import MyServices from "../assets/MyServices.png";
import MyJobs from "../assets/myjobs.png";
import notification from "../assets/notification.png";
import helpcenter from "../assets/icons/helpcenter.png";
import editIcon from "../assets/edit.png";
import ProfileHeader from "../components/ProfileHeader";
import settings from "../assets/settings.png";
import Logout from "../assets/logout.png";
import arrow from "../assets/arrow.png";

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const tagColors = [
  { color: "#EF4444", bg: "#FEF2F2" },
  { color: "#10B981", bg: "#ECFDF5" },
  { color: "#8B5CF6", bg: "#F5F3FF" },
  { color: "#3B82F6", bg: "#EFF6FF" },
  { color: "#EAB308", bg: "#FEFCE8" },
];

const solidColors = ["#6366F1", "#10B981", "#F97316", "#EAB308", "#3B82F6", "#EC4899"];

export default function Sidebarsave() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState("All");

  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    const handleToggle = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen to Auth & User Profile
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const unsubUser = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const userData = snap.data();
          setProfileData(userData);
          setSavedJobIds(userData.favoriteJobs || []);
        }
      });

      return () => {
        unsubUser();
      };
    });

    return unsubscribeAuth;
  }, [auth]);

  // Listen to Jobs
  useEffect(() => {
    const qJobs = query(collection(db, "jobs"), orderBy("created_at", "desc"));
    const qFast = query(
      collection(db, "jobs_24h"),
      orderBy("created_at", "desc")
    );

    const unsubJobs = onSnapshot(qJobs, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        source: "jobs",
        is24h: false,
        ...d.data(),
        createdAt: d.data().created_at?.toDate?.() || null,
      }));
      setJobs((prev) => [...prev.filter((j) => j.source !== "jobs"), ...data]);
    });

    const unsubFast = onSnapshot(qFast, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        source: "jobs_24h",
        is24h: true,
        ...d.data(),
        createdAt: d.data().created_at?.toDate?.() || null,
      }));
      setJobs((prev) => [
        ...prev.filter((j) => j.source !== "jobs_24h"),
        ...data,
      ]);
    });

    return () => {
      unsubJobs();
      unsubFast();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/firelogin");
    } catch (err) {
      navigate("/firelogin");
    }
  };

  const toggleSave = async (jobId) => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "users", auth.currentUser.uid);
    try {
      await updateDoc(userRef, {
        favoriteJobs: savedJobIds.includes(jobId)
          ? arrayRemove(jobId)
          : arrayUnion(jobId),
      });
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  const displayJobs = useMemo(() => {
    let filtered = jobs.filter((job) => savedJobIds.includes(job.id));

    if (activeTab === "Recent") {
      filtered = filtered.filter((job) => {
        if (!job.createdAt) return false;
        const diffDays = (Date.now() - job.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 7; // last 7 days
      });
    }

    return filtered;
  }, [jobs, savedJobIds, activeTab]);

  const firstInit = profileData.first_name?.[0] || profileData.firstName?.[0] || "H";
  const lastInit = profileData.last_name?.[0] || profileData.lastName?.[0] || "A";
  const initials = `${firstInit}${lastInit}`.toUpperCase();
  const profileImage = profileData.profileImage;

  return (
    <>
      <div
        className="freelance-wrapper"
        style={{
          background: "#F7F7F9",
          minHeight: "100vh",
          padding: 0,
          boxSizing: "border-box",
          width: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* TOP HEADER */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "16px 20px" : "16px 40px",
            borderBottom: "1px solid #E5E7EB",
            background: "white",
            boxSizing: "border-box",
            width: "100%"
          }}
        >
          {/* Search Bar */}
          <div style={{ position: "relative", width: "100%", maxWidth: "400px", height: "40px" }}>
            <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} size={16} />
            <input
              type="text"
              placeholder="Search freelancers, jobs, services..."
              style={{
                width: "100%",
                height: "100%",
                padding: "0 16px 0 42px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#F9FAFB",
                fontSize: "14px",
                color: "#1F2937",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Right Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Notification Bell */}
            <div
              style={{
                position: "relative",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#4B5563"
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "6px",
                  height: "6px",
                  background: "#EF4444",
                  borderRadius: "50%"
                }}
              />
            </div>

            {/* User Initials Circle */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#6C3EEB",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "14px",
                overflow: "hidden"
              }}
            >
              {profileImage ? (
                <img src={profileImage} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                initials
              )}
            </div>
          </div>
        </header>

        {/* CONTENT CONTAINER */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "20px" : "32px 40px", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 24 }}>
          <ProfileHeader 
            profile={profileData} 
            projectCount={profileData.skills?.length} 
          />

          {/* TWO COLUMN LAYOUT */}
          <div style={{ display: "flex", gap: 24, flexDirection: isMobile ? "column" : "row", alignItems: "flex-start" }}>
            
            {/* LEFT MENU (SIDEBAR) */}
            <div style={{ width: isMobile ? "100%" : 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                ["Profile Summary", profilePlaceholder, () => navigate("/freelance-dashboard/accountfreelancer", { state: { activeTab: "Profile Summary" } })],
                ["Saved", MyServices, "/freelance-dashboard/sidebarsaved"],
                ["My Services", MyServices, () => navigate("/freelance-dashboard/accountfreelancer", { state: { activeTab: "My Services" } })],
                ["My Works", MyJobs, "/freelance-dashboard/freelancermyworks"],
                ["Paused Services", MyServices, () => navigate("/freelance-dashboard/accountfreelancer", { state: { activeTab: "Paused Services" } })],
                ["Notifications", notification, "/freelance-dashboard/notifications"],
                ["Account Settings", settings, "/freelance-dashboard/settings"],
                ["Sign Out", Logout, handleLogout, { color: "#EF4444" }],
              ].map(([t, ic, path, customStyle], idx) => (
                <MenuItem
                  key={idx}
                  title={t}
                  icon={ic}
                  customStyle={customStyle}
                  onClick={() => typeof path === "function" ? path() : path && navigate(path)}
                />
              ))}
            </div>

            {/* RIGHT CONTENT - SAVED PROJECTS */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
              
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: "24px 32px" }}>
                 
                 {/* Header */}
                 <div style={{ marginBottom: 24 }}>
                   <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Saved Projects</h2>
                   <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Projects you've bookmarked for later review</p>
                 </div>

                 {/* Tabs */}
                 <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                   <button 
                    onClick={() => setActiveTab("All")}
                    style={{ padding: "6px 16px", borderRadius: 20, border: "none", background: activeTab === "All" ? "#6C4DFF" : "#F3F4F6", color: activeTab === "All" ? "#fff" : "#4B5563", fontWeight: 600, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                       All <span style={{ background: activeTab === "All" ? "rgba(255,255,255,0.2)" : "#E5E7EB", padding: "2px 6px", borderRadius: 10, fontSize: 11 }}>{savedJobIds.length}</span>
                   </button>
                   <button 
                    onClick={() => setActiveTab("Recent")}
                    style={{ padding: "6px 16px", borderRadius: 20, border: "none", background: activeTab === "Recent" ? "#6C4DFF" : "#F3F4F6", color: activeTab === "Recent" ? "#fff" : "#4B5563", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                     Recent
                   </button>
                 </div>

                 {/* Grid */}
                 <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
                   {displayJobs.length === 0 ? (
                     <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                       <p style={{ fontSize: 16, margin: 0 }}>No saved jobs found</p>
                     </div>
                   ) : (
                     displayJobs.map((job) => {
                       const jobInitials = job.title
                         ? job.title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                         : "JB";
                       const jobIconBg = solidColors[job.title?.length % solidColors.length] || "#6C4DFF";
                       
                       return (
                         <div
                           key={job.id}
                           onClick={() => navigate(`/freelance-dashboard/job-full/${job.id}`, { state: job })}
                           style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 20, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.transform = "translateY(-2px)";
                             e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.transform = "translateY(0)";
                             e.currentTarget.style.boxShadow = "none";
                           }}
                         >
                           
                           <div>
                             {/* Top row */}
                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                               <div style={{ display: "flex", gap: 12 }}>
                                 <div style={{ width: 40, height: 40, borderRadius: 8, background: jobIconBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>
                                   {jobInitials}
                                 </div>
                                 <div>
                                   <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: "0 0 2px" }}>{job.company_name || job.company || "Client Opportunity"}</h3>
                                   <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>{job.category || "General Opportunity"}</p>
                                 </div>
                               </div>
                               <svg 
                                 width="20" 
                                 height="20" 
                                 viewBox="0 0 24 24" 
                                 fill={savedJobIds.includes(job.id) ? "#6C4DFF" : "none"} 
                                 stroke={savedJobIds.includes(job.id) ? "none" : "#9CA3AF"} 
                                 strokeWidth={savedJobIds.includes(job.id) ? "0" : "2"}
                                 style={{ cursor: "pointer", transition: "all 0.2s" }}
                                 onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
                                 xmlns="http://www.w3.org/2000/svg"
                               >
                                 <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z"/>
                               </svg>
                             </div>

                             {/* Role */}
                             <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>{job.title}</h4>
                             
                             {/* Desc */}
                             <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.5, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{job.description}</p>
                             
                             {/* Budget Timeline */}
                             <div style={{ display: "flex", gap: 32, marginBottom: 16 }}>
                               <div>
                                 <p style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 600, margin: "0 0 4px", letterSpacing: 0.5 }}>Budget</p>
                                 <p style={{ fontSize: 13, color: "#6C4DFF", fontWeight: 700, margin: 0 }}>₹{job.budget_from || job.budget || 0} - ₹{job.budget_to || job.budget || 0}</p>
                               </div>
                               <div>
                                 <p style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 600, margin: "0 0 4px", letterSpacing: 0.5 }}>Timeline</p>
                                 <p style={{ fontSize: 13, color: "#111", fontWeight: 600, margin: 0 }}>{job.timeline || job.deliveryDuration || "24 Hours"}</p>
                               </div>
                             </div>

                             {/* Tags */}
                             <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                               {(job.skills || []).slice(0, 4).map((s, idx) => {
                                 const c = tagColors[idx % tagColors.length];
                                 return (
                                   <span key={s} style={{ background: c.bg, color: c.color, padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                                     {s}
                                   </span>
                                 );
                               })}
                             </div>
                           </div>

                           {/* Bottom Row */}
                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F3F4F6", paddingTop: 16 }}>
                             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                               <span style={{ background: "#EFF6FF", color: "#3B82F6", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{job.location || "Remote"}</span>
                               <span style={{ fontSize: 12, color: "#9CA3AF" }}>{timeAgo(job.createdAt)}</span>
                             </div>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 navigate(`/freelance-dashboard/job-full/${job.id}`, { state: job });
                               }}
                               style={{ background: "#6C4DFF", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                             >
                               Apply Now
                             </button>
                           </div>

                         </div>
                       );
                     })
                   )}
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* MENU ITEM */
function MenuItem({ title, icon, onClick, customStyle }) {
  const isActive = title === "Saved";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        cursor: "pointer",
        borderRadius: 8,
        background: isActive ? "#EDE9FE" : "transparent",
        color: isActive ? "rgba(108, 77, 255, 1)" : (customStyle?.color || "#4B5563"),
        fontWeight: isActive ? 600 : 500,
        transition: "all 0.2s",
        fontSize: 14,
        ...(customStyle || {}),
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) { e.currentTarget.style.background = "rgba(108, 77, 255, 0.05)"; }
      }}
      onMouseLeave={(e) => {
        if (!isActive) { e.currentTarget.style.background = "transparent"; }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {icon && <img src={icon} width={18} alt="" style={{ opacity: isActive ? 1 : 0.6, filter: isActive ? "invert(35%) sepia(87%) saturate(2462%) hue-rotate(242deg) brightness(98%) contrast(93%)" : "none" }} />}
        <span>{title}</span>
      </div>
      {isActive && <span style={{ color: "rgba(108, 77, 255, 1)", fontWeight: "bold" }}>›</span>}
    </div>
  );
}