
import React, { useEffect, useMemo, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// import "./mywork.css"


import message from "../assets/message.png";
import notification from "../assets/notification.png";
import backarrow from "../assets/backarrow.png";
import searchIcon from "../assets/search.png";
import clock from "../assets/clock.png";
import impression from "../assets/Impression.png";
import arrow from "../assets/arrow.png";
import { FiBell, FiPlus, FiUser, FiBookmark, FiCode, FiLayout, FiCalendar, FiFolder, FiSettings, FiLogOut } from "react-icons/fi";
import { Search, Sparkles, Bell, ChevronLeft } from "lucide-react";
import Searchjob from "../assets/Searchjob.png";
import SecondarySidebar from "./SecondarySidebar";
import ProfileHeader from "../components/ProfileHeader";

export default function MyWorksScreen() {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await auth.signOut();
      navigate("/firelogin");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleSidebarClick = (tabId) => {
    switch (tabId) {
      case "Profile Summary":
        navigate("/freelance-dashboard/accountfreelancer", { state: { activeTab: "Profile Summary" } });
        break;
      case "Saved":
        navigate("/freelance-dashboard/sidebarsaved");
        break;
      case "My Services":
        navigate("/freelance-dashboard/accountfreelancer", { state: { activeTab: "My Services" } });
        break;
      case "My Works":
        navigate("/freelance-dashboard/freelancermyworks");
        break;
      case "Paused Services":
        navigate("/freelance-dashboard/accountfreelancer", { state: { activeTab: "Paused Services" } });
        break;
      case "Application Status":
        navigate("/freelance-dashboard/applicationstatus");
        break;
      case "Notifications":
        navigate("/freelance-dashboard/notifications");
        break;
      case "Account Settings":
        navigate("/freelance-dashboard/settings");
        break;
      case "Sign Out":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const [selectedTab, setSelectedTab] = useState("Applied");
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [handledNotifs, setHandledNotifs] = useState({});
  const [generalNotifications, setGeneralNotifications] = useState([]);
  const [acceptedNotifications, setAcceptedNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  // ⭐ SIDEBAR COLLAPSED STATE
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ⭐ MOBILE DETECTION
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const CONTENT_WIDTH = isMobile ? "96%" : "calc(100% - 64px)";
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // ── Merge & sort notifications ──────────────────────────────────
  const notifications = useMemo(() => {
    // Filter out locally declined general notifications
    const filteredGeneral = generalNotifications.filter(
      (n) => handledNotifs[n.id] !== "declined"
    );
    const combined = [...filteredGeneral, ...acceptedNotifications];
    return combined.sort((a, b) => {
      const timeA = a.timestamp?.seconds || 0;
      const timeB = b.timestamp?.seconds || 0;
      return timeB - timeA;
    });
  }, [generalNotifications, acceptedNotifications, handledNotifs]);

  const notifCount = notifications.filter((n) => !n.read).length;

  // ── General notifications listener ─────────────────────────────
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("freelancerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setGeneralNotifications(items);
    });

    return unsubscribe;
  }, [user]);

  // ── Accepted-jobs notifications listener ────────────────────────
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "accepted_jobs"),
      where("freelancerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        type: "application_accepted",
      }));
      setAcceptedNotifications(items);
    });

    return unsubscribe;
  }, [user]);

  // ── Notification click handler ──────────────────────────────────
  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.read && notif.type !== "application_accepted") {
        await updateDoc(doc(db, "notifications", notif.id), { read: true });
      }

      setNotifOpen(false);

      if (notif.type === "application_accepted") {
        navigate(`/freelance-dashboard/job-full/${notif.jobId}`);
      } else if (notif.type === "message") {
        navigate("/freelance-dashboard/freelancermessages", {
          state: { otherUid: notif.clientUid },
        });
      }
    } catch (err) {
      console.error("Notification error", err);
    }
  };

  // ── Accept handler → navigate to chat ──────────────────────────
  const acceptNotif = async (item) => {
    try {
      await updateDoc(doc(db, "notifications", item.id), {
        read: true,
        status: "accepted",
      });

      // Mark as accepted locally so buttons disappear
      setHandledNotifs((prev) => ({ ...prev, [item.id]: "accepted" }));

      setNotifOpen(false);

      // Navigate to chat, passing the client's UID so the chat opens correctly
      navigate("/freelance-dashboard/freelancermessages", {
        state: { otherUid: item.clientUid || item.clientId },
      });
    } catch (err) {
      console.error("Accept error", err);
    }
  };

  // ── Decline handler → hide notification ────────────────────────
  const declineNotif = async (item) => {
    try {
      await updateDoc(doc(db, "notifications", item.id), {
        read: true,
        status: "declined",
      });

      // Mark as declined locally — useMemo will filter it out of the list
      setHandledNotifs((prev) => ({ ...prev, [item.id]: "declined" }));
    } catch (err) {
      console.error("Decline error", err);
    }
  };

  // ⭐ LISTEN FOR SIDEBAR TOGGLE EVENT
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  const viewDetails = (job) => {
    navigate(`/freelance-dashboard/jobdetailsscreen/${job.id}`);
  };

  const startChat = (job) => {
    navigate("/chat", {
      state: {
        currentUid: user.uid,
        otherUid: job.clientId,
        otherName: job.clientName || "Client",
        otherImage: job.clientImage || "",
        initialMessage: "Hello! I have accepted your project. Let's begin!",
      },
    });
  };

  const fetchUserProfile = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) setProfile(snap.data());
    } catch (e) {
      console.log("Profile fetch error:", e);
    }
  };

  const fetchClientDetails = async (clientId) => {
    try {
      const snap = await getDoc(doc(db, "users", clientId));
      return snap.exists() ? snap.data() : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchUserProfile(user.uid);
    setLoading(true);

    const showAccepted = selectedTab === "Accepted";
    const notifRef = collection(db, "notifications");

    const qNotif = query(
      notifRef,
      where("freelancerId", "==", user.uid),
      where("read", "==", showAccepted)
    );

    const unsubNotif = onSnapshot(qNotif, async (notifSnap) => {
      const jobIds = [...new Set(notifSnap.docs.map((d) => d.data().jobId))];
      if (jobIds.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      const jobCollection = activeTab === 0 ? "jobs" : "jobs_24h";

      const unsubJobs = onSnapshot(collection(db, jobCollection), async (jobsSnap) => {
        const clientCache = {};
        const list = [];

        for (const d of jobsSnap.docs) {
          if (!jobIds.includes(d.id)) continue;

          const job = { id: d.id, ...d.data() };
          const notif = notifSnap.docs.find((n) => n.data().jobId === d.id)?.data();

          if (notif) {
            job.clientId = notif.clientUid;

            if (!clientCache[notif.clientUid]) {
              clientCache[notif.clientUid] = await fetchClientDetails(notif.clientUid);
            }

            const client = clientCache[notif.clientUid];
            job.clientName = client?.Company_name || client?.first_name || "Client";
            job.clientImage =
              client?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
          }

          list.push(job);
        }

        setJobs(list);
        setLoading(false);
      });

      return () => unsubJobs();
    });

    return () => unsubNotif();
  }, [selectedTab, activeTab, user, db]);

  const filteredJobs = jobs.filter((j) =>
    (j.title || "").toLowerCase().includes(search)
  );

  if (!user) return <div style={{ padding: 20 }}>Please log in</div>;

  const containerStyle = {
    marginLeft: 0,
    transition: "margin-left 0.25s ease",
    minHeight: "100vh",
    paddingBottom: 120,
    background: "#ffffff",
    overflowX: "hidden",
    paddingTop: 0,
    fontFamily: "'Inter', 'DM Sans', sans-serif",
  };

  // ── Helper: should action buttons be shown for this notification ─
  function showActionButtons(item) {
    // Don't show for accepted-job or message type
    if (item.type === "application_accepted" || item.type === "message") return false;
    // Don't show if already handled in this session
    if (handledNotifs[item.id]) return false;
    // Don't show if already accepted/declined in Firestore
    if (item.status === "accepted" || item.status === "declined") return false;
    return true;
  }

  // ── Calculate Stats ─────────────────────────────────────────────
  const totalProjects = jobs.length;
  const totalViews = jobs.reduce((acc, job) => acc + (job.views || 0), 0);
  const totalAppreciations = jobs.reduce((acc, job) => acc + (job.likes || job.appreciations || 0), 0);
  const totalShares = jobs.reduce((acc, job) => acc + (job.shares || 0), 0);

  const formatStatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  return (
    <div style={containerStyle}>
      {/* TOP HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "16px 24px" : "16px 32px",
          background: "#fff",
          borderBottom: "1px solid #E5E7EB",
          marginBottom: 0, // Removed empty space
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, maxWidth: 600 }}>
          <div
            onClick={() => navigate(-1)}
            style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <img src={backarrow} alt="back" style={{ width: 14, height: 14, opacity: 0.7 }} />
          </div>
          <div style={{ position: "relative", width: "100%", height: "40px" }}>
            <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} size={16} />
            <input
              type="text"
              placeholder="Search freelancers, jobs, services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                padding: "0 16px 0 42px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#FAFAFA",
                fontSize: "14px",
                color: "#1F2937",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            style={{
              background: "#6C4DFF",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Sparkles size={14} /> AI Assistant
          </button>

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

          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#6C3EEB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
            {profile?.name ? profile.name.substring(0, 2).toUpperCase() : "GG"}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: isMobile ? "16px 20px" : "16px 40px 32px 40px", boxSizing: "border-box", width: "100%" }}>
        <ProfileHeader 
          profile={profile} 
          projectCount={jobs.length} 
        />          {/* TWO COLUMN LAYOUT: SECONDARY SIDEBAR + MY WORKS */}
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>

          {/* SECONDARY SIDEBAR */}
          {!isMobile && (
            <SecondarySidebar
              activeTab="My Works"
              onTabClick={handleSidebarClick}
            />
          )}

          {/* MY WORKS SECTION */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1A1730", margin: "0 0 4px 0", fontFamily: "'Sora', sans-serif" }}>My Works</h1>
                <p style={{ fontSize: 14, color: "#9B97B8", margin: 0 }}>Showcase your portfolio and track engagement</p>
              </div>
              <button
                onClick={() => navigate("/freelance-dashboard/add-service-form")}
                style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "#FDFD96", color: "#1A1730", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(253,253,150,0.2)" }}>
                + Upload Project
              </button>
            </div>

            {/* Stats Banner */}
            <div style={{
              background: "linear-gradient(100.36deg, #8B5CF6 0%, #9C6FE4 100%)",
              borderRadius: 20,
              padding: "24px 40px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
              marginBottom: 32
            }}>
              {[
                { val: formatStatNumber(totalProjects), label: "Total Projects" },
                { val: formatStatNumber(totalViews), label: "Total Views" },
                { val: formatStatNumber(totalAppreciations), label: "Appreciations" },
                { val: formatStatNumber(totalShares), label: "Client Shares" }
              ].map((stat, i) => (
                <div key={i} style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{stat.val}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Category Pills */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
              {[
                { label: "All", active: true },
                { label: "UI Design", active: false },
                { label: "Branding", active: false },
                { label: "Mobile Apps", active: false },
                { label: "SaaS", active: false },
                { label: "Web Design", active: false }
              ].map((cat) => (
                <div
                  key={cat.label}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 999,
                    cursor: "pointer",
                    background: cat.active ? "#8B5CF6" : "transparent",
                    border: cat.active ? "1px solid #8B5CF6" : "1px solid #E5E7EB",
                    color: cat.active ? "#fff" : "#4B5563",
                    fontWeight: 600,
                    fontSize: 14,
                    transition: "all 0.2s"
                  }}
                >
                  {cat.label}
                </div>
              ))}
            </div>

            {/* Portfolio Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: 24
            }}>
              {filteredJobs.length > 0 ? filteredJobs.map((job, idx) => {
                const colors = ["#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#3B82F6"];
                const color = colors[idx % colors.length];
                const dateStr = job.created_at?.seconds
                  ? new Date(job.created_at.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : "Recently added";

                return (
                  <div key={job.id || idx} style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #F3F4F6",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    height: 308
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    onClick={() => navigate(`/freelance-dashboard/job-full/${job.id}`)}
                  >
                    {/* Image Placeholder */}
                    <div style={{ height: 154, background: color, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <h3 style={{ color: "rgba(255,255,255,0.3)", fontSize: 50, fontWeight: 800 }}>{(job.title || job.Category || "Project").substring(0, 1).toUpperCase()}</h3>
                    </div>

                    {/* Content */}
                    <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", margin: "0 0 8px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.title || job.Category || "Project"}</h3>
                      <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px 0", lineHeight: 1.5, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{job.des || job.description || "No description provided."}</p>

                      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", height: 24, overflow: "hidden" }}>
                        {(job.Skills || []).slice(0, 3).map((skill, i) => {
                          const tagColors = [
                            { bg: "#EFF6FF", color: "#3B82F6" },
                            { bg: "#ECFDF5", color: "#10B981" },
                            { bg: "#FFFBEB", color: "#F59E0B" },
                            { bg: "#FDF2F8", color: "#EC4899" }
                          ];
                          const tc = tagColors[i % tagColors.length];
                          return (
                            <span key={i} style={{ background: tc.bg, color: tc.color, padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                              {skill}
                            </span>
                          );
                        })}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F3F4F6", paddingTop: 16 }}>
                        <div style={{ display: "flex", gap: 12 }}>
                          <span style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ color: "#EF4444" }}>♥</span> {Math.floor(Math.random() * 200) + 10}
                          </span>
                          <span style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ color: "#9CA3AF" }}>👁</span> {Math.floor(Math.random() * 5) + 1}K
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>{dateStr}</span>
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#9CA3AF" }}>No jobs found</div>
              )}

              {/* Add New Work Card */}
              <div style={{
                borderRadius: 16,
                border: "2px dashed #E5E7EB",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "#FAFAFA",
                transition: "all 0.2s",
                height: 308
              }}
                onClick={() => navigate("/freelance-dashboard/add-service-form")}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.borderColor = "#D1D5DB"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#FAFAFA"; e.currentTarget.style.borderColor = "#E5E7EB"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#EFF6FF", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>+</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Add New Work</div>
                <div style={{ fontSize: 13, color: "#9CA3AF" }}>Drag & drop or browse</div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ---------------------------
// JOB CARD COMPONENT
// ---------------------------
function JobCard({ job, selectedTab, onViewDetails, onStartChat }) {
  const isAccepted = selectedTab === "Accepted";

  return (
    <div
      className="job-card-modern"
      onClick={onViewDetails}
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 16,
        padding: 24,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.03)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "#7C4EF5", fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {job.job_role || "UI/UX Designer"}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#111", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontFamily: "'Sora', sans-serif" }}>
            {job.title || job.clientName || "Company Name"}
          </h3>
        </div>
        {isAccepted && <img src={arrow} style={{ width: 18, opacity: 0.4 }} />}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>₹{job.budget || 1000}</span>
        <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>/ project</span>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Skills Required</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(job.skills || ["UI", "UX", "Web"]).map((s, idx) => (
            <span key={idx} style={{ background: "#F3F4F6", color: "#4B5563", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, paddingTop: 16, borderTop: "1px solid #F3F4F6", marginTop: "auto" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, fontWeight: 500 }}>
          <img src={impression} style={{ width: 16, opacity: 0.5 }} />
          {job.views || 29} views
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, fontWeight: 500 }}>
          <img src={clock} style={{ width: 16, opacity: 0.5 }} />
          {job.created_at?.toDate ? job.created_at.toDate().toLocaleDateString() : "No Date"}
        </span>
      </div>

      {isAccepted && (
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
            style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#4B5563", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontSize: 13 }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#F9FAFB"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
          >
            View Details
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onStartChat(); }}
            style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: "#7C4EF5", color: "#fff", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontSize: 13 }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#6C43D9"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#7C4EF5"}
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
}