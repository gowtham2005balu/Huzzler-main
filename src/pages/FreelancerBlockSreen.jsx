//  flfullDetail.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firbase/Firebase";
import { FiTrash2 } from "react-icons/fi";
import { ArrowLeft, Flag, Share2 } from "lucide-react";
import ReportBlockPopup from "./BlockPopup.jsx";
import dp from "../assets/dp.png";


export default function FreelancerFullDetailScreen() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [email, setEmail] = useState("");

  const [services, setServices] = useState([]);
  const [services24, setServices24] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  const [activeTab, setActiveTab] = useState("works");
  const [showMenu, setShowMenu] = useState(false);
  const [showBlockPopup, setShowBlockPopup] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fullName =
    `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim();

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) navigate("/firelogin");
      setCurrentUser(u);
    });
    return () => unsub();
  }, [auth, navigate]);

  /* ================= PROFILE ================= */
  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(doc(db, "users", userId), (snap) => {
      setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoadingProfile(false);
    });
    return () => unsub();
  }, [userId]);

  /* ================= SERVICES ================= */
  useEffect(() => {
    if (!userId) return;

    const q1 = query(
      collection(db, "users", userId, "services"),
      orderBy("createdAt", "desc")
    );
    const q2 = query(
      collection(db, "users", userId, "services_24h"),
      orderBy("createdAt", "desc")
    );

    const u1 = onSnapshot(q1, (s) =>
      setServices(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const u2 = onSnapshot(q2, (s) =>
      setServices24(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => {
      u1();
      u2();
    };
  }, [userId]);

  /* ================= PORTFOLIO ================= */
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "users", userId, "portfolio"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) =>
      setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => unsub();
  }, [userId]);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= TOGGLE PAUSE ================= */
  const togglePause = async (job) => {
    const col = activeTab === "works" ? "services" : "services_24h";
    await updateDoc(doc(db, "users", userId, col, job.id), {
      paused: !job.paused,
      pausedAt: !job.paused ? serverTimestamp() : null,
    });
  };

  /* ================= SHARE PROFILE ================= */
  const handleShare = async () => {
    const shareText = `Check out ${profile?.first_name} ${profile?.last_name}'s professional profile`;
    const shareUrl = profile?.linkedin || window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Professional Profile",
          text: shareText,
          url: shareUrl,
        });
        setShowMenu(false);
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setToastMessage("Link copied to clipboard!");
      setTimeout(() => setToastMessage(""), 3000);
      setShowMenu(false);
    }
  };

  /* ================= DELETE PORTFOLIO ================= */
  const handleDeletePortfolio = async (portfolioId) => {
    if (window.confirm("Are you sure you want to delete this portfolio item?")) {
      try {
        await deleteDoc(doc(db, "users", userId, "portfolio", portfolioId));
      } catch (error) {
        console.error("Error deleting portfolio:", error);
      }
    }
  };

  const jobs = useMemo(
    () => (activeTab === "works" ? services : services24),
    [services, services24, activeTab]
  );

  if (loadingProfile || !profile) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (

    <div id="fh-p" style={{ marginLeft: isMobile ? 0 : "-10px" }}>
      <div id="fh-contars" className="fh-container" >
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 40, }}>
          {/* Toast Message */}
          {toastMessage && (
            <div style={styles.toast}>
              {toastMessage}
            </div>
          )}

          {/* ================= PROFILE SUMMARY ================= */}
          <div
            style={{
              ...styles.profileHeader,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "center" : "flex-start",
              textAlign: isMobile ? "center" : "left",
            }}
          >


            <button onClick={() => navigate(-1)} style={styles.backBtn}>
              <ArrowLeft size={18} />
            </button>
            <h1 style={{ marginLeft: "19px" }}>Freelancer Profile</h1>


            {currentUser?.uid !== userId && (
              <div style={styles.menuWrap}>
                <button style={styles.menuBtn} onClick={() => setShowMenu(!showMenu)}>
                  ⋮
                </button>
                {showMenu && (
                  <div style={{
                    ...styles.menuDropdown,
                    right: isMobile ? 80 : 400,
                    top: isMobile ? 150 : 80,
                  }}>
                    <div style={styles.menuItem} onClick={handleShare}>
                      <Share2 size={16} /> Share profile
                    </div>
                    <div
                      style={styles.menuItem}
                      onClick={() => {
                        setShowMenu(false);
                        setShowBlockPopup(true);
                      }}
                    >
                      <Flag size={16} /> Report/Block
                    </div>
                  </div>
                )}
              </div>
            )}

          <img
  src={profile?.profileImage ? profile.profileImage : dp}
  alt={fullName}
  style={{
    ...styles.profileImg,
    marginLeft: isMobile ? -250 : -170,
    marginTop: isMobile ? 20 : 60,
  }}
/>


            <div style={{
              marginTop: isMobile ? "-140px" : "-20px"
            }}>
              <h2
                style={{
                  margin: isMobile ? "16px 0 0" : "80px 0 0",
                  fontSize: isMobile ? 20 : 24,
                  fontWeight: 700,
                }}
              >
                {fullName}
              </h2>

              <p style={{ margin: "8px 0", opacity: 0.7, fontSize: 15 }}>
                {profile.professional_title}
              </p>
              <p style={{ opacity: "70%", fontSize: "16px" }}><p style={{ opacity: "70%", fontSize: "16px" }}>
                {profile.email || "No email"}
              </p></p>
              <div style={styles.linksRow}>
                {profile.behance && (
                  <a href={profile.behance} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    Behance
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    LinkedIn
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ================= ABOUT + SKILLS ROW ================= */}
          <div
            style={{
              ...styles.twoCol,
              gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
            }}
          >

            <div style={styles.card}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: 18 }}>About</h3>
              <p style={{ lineHeight: 1.6, color: "#555" }}>{profile.about || "No description available"}</p>
            </div>

            <div style={{ ...styles.card }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: 18 }}>Skills</h3>
              <div style={styles.chips}>
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((s) => (
                    <span key={s} style={styles.chip}>
                      {s}
                    </span>
                  ))
                ) : (
                  <p style={{ opacity: 0.6 }}>No skills added</p>
                )}
              </div>

              <h3 style={{ marginTop: 24, marginBottom: 12, fontSize: 18 }}>Tools</h3>
              <div style={styles.chips}>
                {profile.tools && profile.tools.length > 0 ? (
                  profile.tools.map((t) => (
                    <span key={t} style={styles.chip}>
                      {t}
                    </span>
                  ))
                ) : (
                  <p style={{ opacity: 0.6 }}>No tools added</p>
                )}
              </div>
            </div>
          </div>

          {/* ================= PORTFOLIO ================= */}
          <div style={styles.section}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 20 }}>Portfolio</h3>
            {portfolio.length > 0 ? (
              <div style={styles.portfolioRow}>
                {portfolio.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      ...styles.portfolioCard,
                      maxWidth: isMobile ? "100%" : 280,
                      maxHeight: "500px",
                      overflowY: "auto",
                    }}
                  >
                    <img src={p.imageUrl} alt={p.title} style={styles.portfolioImg} />
                    <div style={{ padding: 16 }}>
                      <h4 style={{ margin: "0 0 8px 0", fontSize: 16 }}>{p.title}</h4>
                      <p style={{ opacity: 0.7, fontSize: 14, margin: "0 0 12px 0" }}>
                        {p.description}
                      </p>
                      {currentUser?.uid === userId && (
                        <FiTrash2
                          onClick={() => handleDeletePortfolio(p.id)}
                          style={{ cursor: "pointer", color: "#ef4444", fontSize: 18 }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ opacity: 0.6 }}>No portfolio items yet</p>
            )}
          </div>

          {/* ================= POSTED JOBS ================= */}
          {/* ================= POSTED JOBS ================= */}
          <div style={styles.postedJobsSection}>
            {/* Header */}
            <div style={styles.postedJobsHeader}>
              <h3 style={styles.postedJobsTitle}>Posted Jobs</h3>
              <span style={styles.viewAllLink}></span>
            </div>

            {/* Tabs */}
            <div
              style={{
                background: "white",
                padding: 6,
                borderRadius: 999,
                display: "inline-flex",     // 🔥 width shrink aagum
                gap: 6,
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                marginBottom: 24,
                width: "100%"
              }}
            >
              {/* WORK */}
              <button
                onClick={() => setActiveTab("works")}
                style={{
                  padding: isMobile ? "8px 24px" : "8px 56px",

                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  background: activeTab === "works" ? "#9050FF" : "transparent",
                  color: activeTab === "works" ? "#fff" : "#111827",
                  boxShadow:
                    activeTab === "works"
                      ? "0 6px 12px rgba(144,80,255,0.4)"
                      : "none",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap",
                }}
              >
                Work
              </button>

              {/* 24 HOURS */}
              <button
                onClick={() => setActiveTab("24h")}
                style={{
                  padding: isMobile ? "8px 24px" : "8px 56px",

                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  background: activeTab === "24h" ? "#9050FF" : "transparent",
                  color: activeTab === "24h" ? "#fff" : "#111827",
                  boxShadow:
                    activeTab === "24h"
                      ? "0 6px 12px rgba(144,80,255,0.4)"
                      : "none",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap",
                }}
              >
                24 hours
              </button>
            </div>



            {/* Job Cards Grid */}
            <div
              style={{
                ...styles.jobCardsGrid,
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              }}
            >

              {jobs.length > 0 ? (
                jobs.map((job) => {
                  const skills = Array.isArray(job.skills) ? job.skills : [];
                  const initials = job.title
                    ? job.title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                    : "JB";

                  return (
                    <div key={job.id} style={styles.jobCardNew}>
                      {/* Card Header with Avatar */}
                      <div style={styles.jobCardHeader}>
                        <div style={styles.jobAvatar}>
                          {initials}
                        </div>
                        <div style={styles.jobTitleWrap}>
                          <h4 style={styles.jobTitleText}>{job.title || "Untitled Job"}</h4>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div style={styles.jobSkillsRow}>
                        {skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} style={styles.jobSkillTag}>
                            {skill}
                          </span>
                        ))}
                        {skills.length > 3 && (
                          <span style={styles.jobSkillTagMore}>
                            {skills.length - 3}+
                          </span>
                        )}
                      </div>

                      {/* Meta Info Row */}
                      <div
                        style={{
                          ...styles.jobMetaRow,
                          flexDirection: isMobile ? "column" : "row",
                        }}
                      >

                        <div style={styles.jobMetaItem}>
                          <span style={styles.jobMetaLabel}>Budget</span>
                          <span style={styles.jobMetaValue}>
                            ₹{job.budget_from || 1000} - ₹{job.budget_to || 6000}
                          </span>
                        </div>
                        <div style={styles.jobMetaItem}>
                          <span style={styles.jobMetaLabel}>Timeline</span>
                          <span style={styles.jobMetaValue}>
                            {job.deliveryDuration || "2 - 3 weeks"}
                          </span>
                        </div>
                        <div style={styles.jobMetaItem}>
                          <span style={styles.jobMetaLabel}>Location</span>
                          <span style={styles.jobMetaValue}>
                            {job.location || "Remote"}
                          </span>
                        </div>
                      </div>

                      {/* Pause Button (only for owner) */}
                      {currentUser?.uid === userId && (
                        <button
                          onClick={() => togglePause(job)}
                          style={{
                            ...styles.jobPauseBtn,
                            backgroundColor: job.paused ? "#ef4444" : "#8b5cf6",
                          }}
                        >
                          {job.paused ? "Unpause" : "Pause"}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p style={{ opacity: 0.6, gridColumn: "1 / -1" }}>No jobs posted yet</p>
              )}
            </div>
          </div>

          {/* ================= BLOCK/REPORT POPUP ================= */}
          {showBlockPopup && (
            <>
              <div
                style={styles.popupOverlay}
                onClick={() => setShowBlockPopup(false)}
              />
              <div style={styles.popupCentered}>
                <ReportBlockPopup
                  freelancerId={userId}
                  freelancerName={fullName}
                  onClose={() => setShowBlockPopup(false)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>


  );
}

/* ================= STYLES ================= */
const styles = {
  profileHeader: {
    background: "#f1f4c0ff",
    padding: "32px 24px",
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    position: "relative",
    borderBottom: "2px solid #cfcfcfff",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    overflow: "visible",
  },
  backBtn: {
    position: "absolute",
    top: 24,
    left: 0,
    border: "none",
    background: "#fff",
    borderRadius: "50%",
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #fff",
    flexShrink: 0,
    marginTop: "60px",
    marginLeft: "-150px"
  },
  menuWrap: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  menuBtn: {
    border: "none",
    background: "#fff",
    borderRadius: "50%",
    width: 36,
    height: 36,
    fontSize: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  menuDropdown: {
    position: "fixed",   // 👈 was absolute
    right: 20,
    top: 70,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,.15)",
    minWidth: 180,
    overflow: "hidden",
    zIndex: 9999,        // 👈 important
  },

  menuItem: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: "14px 18px",
    cursor: "pointer",
    borderBottom: "1px solid #f0f0f0",
    transition: "background 0.2s",
    fontSize: 14,
  },
  linksRow: {
    display: "flex",
    gap: 12,
    fontSize: 13,
    marginTop: 8,
    flexWrap: "wrap",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 20,
    padding: "20px 20px 0",
  },
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  chips: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 12,
  },
  chip: {
    background: "#FFF9A8",
    padding: "8px 16px",
    borderRadius: 20,
    fontWeight: 600,
    fontSize: 13,
    border: "1px solid #F5F0C0",
  },
  section: {
    background: "#fff",
    margin: "20px 20px 0",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  portfolioRow: {
    display: "flex",
    gap: 16,
    overflowX: "auto",
    paddingBottom: 8,
    marginTop: 16,
  },
  portfolioCard: {
    minWidth: 260,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,.08)",
    background: "#fff",
  }
  ,
  portfolioImg: {
    width: "100%",
    height: 160,
    objectFit: "cover",
    background: "#00BCD4",
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  tab: {
    padding: "10px 24px",
    borderRadius: 20,
    border: "none",
    background: "#f5f5f5",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    transition: "all 0.2s",
  },
  tabActive: {
    padding: "10px 24px",
    borderRadius: 20,
    border: "none",
    background: "#9050FF",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  jobCard: {
    border: "1px solid #f0f0f0",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    background: "#fafafa",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  pauseBtn: {
    padding: "8px 20px",
    borderRadius: 20,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 13,
    flexShrink: 0,
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  popupCentered: {
    position: "fixed",
    inset: 0,                     // 👈 full screen
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    background: "#34d399",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    fontWeight: 600,
  },
  /* ================= POSTED JOBS STYLES ================= */

  postedJobsSection: {
    background: "#fff",
    margin: "20px 20px 0",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },

  postedJobsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  postedJobsTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#1a1a1a",
  },

  viewAllLink: {
    color: "#9ca3af",
    fontSize: 14,
    cursor: "pointer",
  },

  jobTabs: {
    display: "inline-flex",
    gap: 10,
    marginBottom: 24,
  },

  jobTab: {
    padding: "10px 24px",
    border: "2px dashed #d1d5db",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "#6b7280",
    borderRadius: 8,
  },

  jobTabActive: {
    padding: "10px 24px",
    border: "2px solid #8b5cf6",
    background: "#8b5cf6",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    borderRadius: 8,
  },

  // ✅ TWO CARDS PER ROW
  jobCardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 20,

  },

  jobCardNew: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
    border: "1px solid #dad4d4ff"
  },

  jobCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,

  },

  jobAvatar: {
    width: 48,
    height: 48,
    borderRadius: "20%",
    background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    flexShrink: 0,
  },

  jobTitleWrap: {
    flex: 1,
  },

  jobTitleText: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: "#1a1a1a",
  },

  jobSkillsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  jobSkillTag: {
    background: "#FFF085B2",
    color: "#000",
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },

  jobSkillTagMore: {
    background: "#FFF085B2",
    color: "#000",
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },

  jobMetaRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 16,
    borderTop: "1px solid #f0f0f0",
  },

  jobMetaItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },

  jobMetaLabel: {
    fontSize: 12,
    color: "#000",
    fontWeight: 500,
  },

  jobMetaValue: {
    fontSize: 13,
    color: "#1a1a1a",
    fontWeight: 600,

  },

  jobPauseBtn: {
    width: "100%",
    marginTop: 16,
    padding: "10px 20px",
    borderRadius: 12,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },

};