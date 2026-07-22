
// ClientFullDetailsScreen.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../firbase/Firebase';
import {
  Share2,
  ArrowLeft,
  Flag,
  AlertCircle,
  Linkedin,
  Globe
} from 'lucide-react';
import "./detail.css";

import dp from "../../../assets/dp.png";

export default function ClientFullDetailScreen() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();


  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [jobs, setJobs] = useState([]);
  const [jobs24h, setJobs24h] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [activeTab, setActiveTab] = useState('work');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showReportReasons, setShowReportReasons] = useState(false);
  const [showReportProfile, setShowReportProfile] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState(new Set());
  const [selectedProfileReason, setSelectedProfileReason] = useState(null);
  const [confirmReason, setConfirmReason] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const isAnyModalOpen =
    showReportModal ||
    showBlockDialog ||
    showReportProfile ||
    showReportReasons ||
    showReportConfirm;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(doc(db, 'users', userId), (snap) => {
      setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoadingProfile(false);
    });

    return () => unsub();
  }, [userId]);

  /* ================= FETCH JOBS ================= */
  useEffect(() => {
    if (!userId) return;

    const q1 = query(
      collection(db, 'jobs'),
      where('userId', '==', userId)
    );

    const q2 = query(
      collection(db, 'jobs_24h'),
      where('userId', '==', userId)
    );

    const u1 = onSnapshot(q1, (snap) => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadingJobs(false);
    });

    const u2 = onSnapshot(q2, (snap) => {
      setJobs24h(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadingJobs(false);
    });

    return () => {
      u1();
      u2();
    };
  }, [userId]);

  /* ================= BLOCK USER ================= */
  const handleBlock = async () => {
    if (!currentUser || !userId) return;

    try {
      await addDoc(collection(db, 'blocked_users'), {
        blockedBy: currentUser.uid,
        blockedUserId: userId,
        blockedUserName:
          `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "User",
        blockedAt: serverTimestamp(),
      });

      setToastMessage('User blocked successfully');
      setTimeout(() => setToastMessage(""), 3000);
      setShowBlockDialog(false);

      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.error('Error blocking user:', error);
      setToastMessage('Failed to block user');
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  /* ================= REPORT USER ================= */
  const handleReportSubmit = async (reason) => {
    if (!currentUser || !userId) return;

    try {
      await addDoc(collection(db, 'reports'), {
        reportedUserId: userId,
        reportedUserName: `${profile?.first_name} ${profile?.last_name}`,
        reportedBy: currentUser.uid,
        reason,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setToastMessage('Report submitted successfully');
      setTimeout(() => setToastMessage(""), 3000);
      setShowReportProfile(false);
      setShowReportReasons(false);
      setShowReportConfirm(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      setToastMessage('Failed to submit report');
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  /* ================= SHARE PROFILE ================= */
  const handleShare = async () => {
    const shareText = `Check out ${profile?.first_name} ${profile?.last_name}'s professional profile`;
    const shareUrl = profile?.linkedin || window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Professional Profile',
          text: shareText,
          url: shareUrl,
        });
        setShowMenu(false);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setToastMessage('Link copied to clipboard!');
      setTimeout(() => setToastMessage(""), 3000);
      setShowMenu(false);
    }
  };

  /* ================= OPEN LINK ================= */
  const openLink = (url) => {
    if (!url) return;
    const fixedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fixedUrl, '_blank');
  };

  /* ================= LOADING STATE ================= */
  if (loadingProfile) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.errorContainer}>
        <AlertCircle size={64} color="#9ca3af" />
        <p style={styles.errorText}>User profile not found</p>
        <button onClick={() => navigate(-1)} style={styles.retryBtn}>
          Go Back
        </button>
      </div>
    );
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
  const displayedJobs = activeTab === 'work' ? jobs : jobs24h;

  /* ================= RENDER ================= */
  return (

    <div id="fh-page" className="fh-page rubik-font">
      <div className="fh-container">
        <div style={styles.pageWrapper}>
          <div style={styles.container}>
            {/* EVERYTHING ELSE STAYS THE SAME */}


            {toastMessage && (
              <div style={styles.toast}>
                {toastMessage}
              </div>
            )}

            {/* PROFILE HEADER */}
            <div style={styles.profileHeader}>


              {currentUser?.uid !== userId && !isAnyModalOpen && (
                <div style={styles.menuWrap}>
                  <button
                    style={styles.menuBtn}
                    onClick={() => setShowMenu((v) => !v)}
                  >
                    ⋮
                  </button>

                  {showMenu && (
                    <div
                      style={{
                        ...styles.menuDropdown,
                        right: isMobile ? 80 : 260,
                        top: isMobile ? 135 : 120,
                      }}
                    >

                      <div style={styles.menuItem} onClick={handleShare}>
                        <Share2 size={16} /> Share profile
                      </div>

                      <div
                        style={styles.menuItem}
                        onClick={() => {
                          setShowMenu(false);
                          setShowReportModal(true);
                        }}
                      >
                        <Flag size={16} /> Report/Block
                      </div>
                    </div>
                  )}
                </div>
              )}


              <img
                src={profile?.profileImage || dp}
                alt="profile"
                style={styles.profileImg}
              />

              <div style={styles.profileInfo}>
                <h2 style={styles.Company_name}>
                  {profile.Company_name}
                </h2>
                <p style={styles.email}>{profile.email}</p>
                <p style={styles.sectorLocation}>
                  <span style={styles.sector}>{profile.sector || "N/A"}</span>
                  <span style={styles.location}> · {profile.location || "N/A"}</span>
                </p>

                <div style={styles.linksRow}>
                  {profile.linkedin && (
                    <span onClick={() => openLink(profile.linkedin)} style={styles.link}>
                      <Linkedin size={14} /> LinkedIn
                    </span>
                  )}
                  {profile.website && (
                    <span onClick={() => openLink(profile.website)} style={styles.link}>
                      <Globe size={14} /> Website
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ABOUT + DETAILS SECTION */}
            <div style={styles.twoCol}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>About</h3>
                <p style={styles.cardText}>{profile.about || "No description available."}</p>
              </div>

              <div style={{ ...styles.card, background: "#FFFEEF" }}>
                <div style={styles.detailItem}>
                  <h4 style={styles.detailLabel}>Industry</h4>
                  <p style={styles.detailValue}>{profile.sector || "N/A"}</p>
                </div>

                <div style={styles.detailItem}>
                  <h4 style={styles.detailLabel}>Company size</h4>
                  <p style={styles.detailValue}>{profile.team_size || "N/A"}</p>
                </div>

                <div style={styles.detailItem}>
                  <h4 style={styles.detailLabel}>Account Handler</h4>
                  <p style={styles.detailValue}>{fullName}</p>
                </div>

                <div style={{ marginBottom: 0 }}>
                  <h4 style={styles.detailLabel}>Email Address</h4>
                  <p style={styles.detailValue}>{profile.email || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* JOBS SECTION */}
            {/* ================= POSTED JOBS ================= */}
            <div style={styles.postedJobsWrapper}>
              <div style={styles.section}>
                {/* Header */}
                <div style={styles.sectionHeader}>
                  <h3 style={styles.sectionTitle}>Posted Jobs</h3>
                  <span style={styles.viewAllLink}></span>
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                  <button
                    onClick={() => setActiveTab("work")}
                    style={activeTab === "work" ? styles.tabActive : styles.tab}
                  >
                    Work
                  </button>
                  <button
                    onClick={() => setActiveTab("24h")}
                    style={activeTab === "24h" ? styles.tabActive : styles.tab}
                  >
                    24 Hours
                  </button>
                </div>

                {/* Jobs Grid */}
                {loadingJobs ? (
                  <p style={styles.emptyText}>Loading jobs...</p>
                ) : displayedJobs.length === 0 ? (
                  <p style={styles.emptyText}>No jobs posted yet</p>
                ) : (

                  <div className='jobs-griddd' >
                    {displayedJobs.map((job) => {
                      const skills = Array.isArray(job.skills) ? job.skills : [];
                      const initials = job.title
                        ? job.title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                        : "JB";

                      return (
                        <div key={job.id} className="job-carddd" >
                          {/* Card Header with Avatar */}
                          <div style={styles.jobCardHeader}>
                            <div style={styles.jobAvatar}>{initials}</div>
                            <div style={styles.jobTitleWrap}>
                              <h4 style={styles.jobTitle}>{job.title || "Job Title"}</h4>
                              {/* <p style={styles.jobDescription}>
                              {job.description?.slice(0, 60) || "No description"}
                              {job.description?.length > 60 ? "..." : ""}
                            </p> */}
                            </div>
                          </div>

                          {/* Skills */}
                          <div style={styles.skillsContainer}>
                            {skills.slice(0, 3).map((s, i) => (
                              <span key={i} style={styles.skillChip}>{s}</span>
                            ))}
                            {skills.length > 3 && (
                              <span style={styles.skillChipMore}>{skills.length - 3}+</span>
                            )}
                          </div>

                          {/* Meta Details */}
                          <div style={styles.jobDetails}>
                            <div style={styles.detailItem}>
                              <p style={styles.detailLabel}>Budget</p>
                              <p style={styles.budgetValue}>
                                ₹{job.budget_from || 1000} – ₹{job.budget_to || 8000}
                              </p>
                            </div>
                            <div style={styles.detailItem}>
                              <p style={styles.detailLabel}>Timeline</p>
                              <p style={styles.detailValue}>
                                {job.deliveryDuration || "2 – 3 weeks"}
                              </p>
                            </div>
                            <div style={styles.detailItem}>
                              <p style={styles.detailLabel}>Location</p>
                              <p style={styles.detailValue}>{job.location || "Remote"}</p>
                            </div>
                          </div>

                          {/* Actions (Owner Only) */}
                          {currentUser?.uid === userId && (
                            <div style={styles.jobActions}>
                              <button
                                style={{
                                  ...styles.pauseBtn,
                                  backgroundColor: job.paused ? "#ef4444" : "#8b5cf6",
                                }}
                                onClick={() => togglePause(job)}
                              >
                                {job.paused ? "Unpause" : "Pause Service"}
                              </button>
                              <button style={styles.editBtn}>Edit Service</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* REPORT MODAL */}
            {showReportModal && (
              <>
                <div style={styles.overlay} onClick={() => setShowReportModal(false)} />
                <div style={styles.modal}>
                  <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>Report or block</h3>
                    <button onClick={() => setShowReportModal(false)} style={styles.closeBtn}>
                      ✕
                    </button>
                  </div>

                  <p style={styles.modalSubtitle}>Select an action</p>

                  {[
                    { label: `Block ${fullName}`, action: () => { setShowReportModal(false); setShowBlockDialog(true); } },
                    { label: `Report ${fullName}`, action: () => { setShowReportModal(false); setShowReportProfile(true); } },
                  ].map((item) => (
                    <div key={item.label} onClick={item.action} style={styles.modalOption}>
                      <span>{item.label}</span>
                      <span>›</span>
                    </div>
                  ))}

                  <div style={styles.infoBox}>
                    To report posts, comments, or messages, select the overflow menu next to that content and select Report.
                  </div>
                </div>
              </>
            )}

            {/* BLOCK DIALOG */}
            {showBlockDialog && (
              <>
                <div style={styles.overlay} onClick={() => setShowBlockDialog(false)} />
                <div style={styles.confirmModal}>
                  <div style={styles.confirmHeader}>
                    <h3 style={styles.confirmTitle}>Block</h3>
                    <button onClick={() => setShowBlockDialog(false)} style={styles.closeBtn}>✕</button>
                  </div>

                  <div style={styles.confirmContent}>
                    <p style={styles.confirmText}>
                      You're about to block {fullName}. You'll no longer be connected, and will lose any endorsements or recommendations from this person.
                    </p>
                  </div>

                  <div style={styles.confirmActions}>
                    <button onClick={() => setShowBlockDialog(false)} style={styles.cancelBtn}>
                      Back
                    </button>
                    <button onClick={handleBlock} style={styles.confirmBtn}>
                      Block
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* REPORT PROFILE MODAL */}
            {showReportProfile && (
              <>
                <div style={styles.overlay} onClick={() => setShowReportProfile(false)} />
                <div style={styles.confirmModal}>
                  <div style={styles.confirmHeader}>
                    <h3 style={styles.confirmTitle}>Report this profile</h3>
                    <button onClick={() => setShowReportProfile(false)} style={styles.closeBtn}>✕</button>
                  </div>

                  <div style={styles.confirmContent}>
                    <p style={styles.optionSubtitle}>Select an option that applies</p>

                    {[
                      "This person is impersonating someone",
                      "This account has been hacked",
                      "This account is not a real person",
                    ].map((reason) => (
                      <label key={reason} onClick={() => setSelectedProfileReason(reason)} style={styles.radioOption}>
                        <div style={styles.radioCircle}>
                          {selectedProfileReason === reason && <div style={styles.radioDot} />}
                        </div>
                        <span style={styles.radioLabel}>{reason}</span>
                      </label>
                    ))}

                    <div style={styles.warningBox}>
                      If you believe this person is no longer with us, you can let us know this person is deceased
                    </div>
                  </div>

                  <div style={styles.confirmActions}>
                    <button onClick={() => { setShowReportProfile(false); setSelectedProfileReason(null); }} style={styles.cancelBtn}>
                      Back
                    </button>
                    <button
                      disabled={!selectedProfileReason}
                      onClick={() => { if (selectedProfileReason) handleReportSubmit(selectedProfileReason); }}
                      style={{ ...styles.confirmBtn, opacity: selectedProfileReason ? 1 : 0.5 }}
                    >
                      Submit report
                    </button>
                  </div>
                </div>
              </>
            )}

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    minHeight: "100vh",
    paddingBottom: 40,

    paddingLeft: window.innerWidth < 768 ? 2 : 16,  // 👈 almost full
    paddingRight: window.innerWidth < 768 ? 2 : 16,
    marginTop: "30px"
  },

  pageWrapper: {
    width: "100%",
    maxWidth: "100vw",      // 👈 full screen
    margin: "0 auto",
    padding: window.innerWidth < 768 ? "0 4px" : "0 16px", // 👈 side gap reduce
  },


  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  spinner: {
    width: 48,
    height: 48,
    border: '4px solid #e5e7eb',
    borderTopColor: '#FFF9A8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#6b7280',
  },
  retryBtn: {
    marginTop: 20,
    padding: '12px 24px',
    borderRadius: 10,
    border: 'none',
    backgroundColor: '#FFF9A8',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  profileHeader: {
    background: "#FFF9A8",
    padding: "32px 24px",
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    top: 15,
    left: -5,
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
    width: 90,
    height: 90,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #fff",
    background: "transparent"
  },
  menuWrap: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 9999,   // 🔥 important
  },

  menuBtn: {
    border: "1px solid #6f000035",
    background: "#fff",
    borderRadius: "50%",
    width: 36,
    height: 36,
    fontSize: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  menuDropdown: {
    position: "fixed",   // 🔥 absolute -> fixed


    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
    minWidth: 200,
    overflow: "hidden",
    zIndex: 99999,   // 🔥 top layer
  },

  menuItem: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: "14px 18px",
    cursor: "pointer",
    borderBottom: "1px solid #f0f0f0",
    fontSize: 14,
  },
  profileInfo: {
    flex: 1,
  },
  Company_name: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
  },
  email: {
    margin: "8px 0",
    fontSize: 14,
    color: "#555",
  },
  sectorLocation: {
    margin: "6px 0",
    fontSize: 14,
  },
  sector: {
    color: "#8b5cf6",
    fontWeight: 600,
  },
  location: {
    color: "#777",
  },
  linksRow: {
    display: "flex",
    gap: 16,
    marginTop: 8,
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#2563eb",
    fontSize: 13,
    cursor: "pointer",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 20,
    padding: "20px 0 0",
  },

  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    border: "1px solid #e9e2e2ff",
  },
  cardTitle: {
    margin: "0 0 12px 0",
    fontSize: 18,
    fontWeight: 600,
  },
  cardText: {
    margin: 0,
    lineHeight: 1.6,
    color: "#555",
    fontSize: 14,
  },
  detailItem: {
    marginBottom: 18,
  },
  detailLabel: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "#000",
  },
  detailValue: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
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
  },
  tabActive: {
    padding: "10px 24px",
    borderRadius: 20,
    border: "none",
    background: "#FFF9A8",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    padding: '40px 0',
  },
  jobCard: {
    border: "1px solid #f0f0f0",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    background: "#fafafa",
  },
  jobTitle: {
    margin: "0 0 8px 0",
    fontSize: 16,
    fontWeight: 600,
  },
  jobDescription: {
    margin: "0 0 12px 0",
    color: "#555",
    fontSize: 14,
    lineHeight: 1.5,
  },
  skillsContainer: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  skillChip: {
    background: "#FFF9A8",
    padding: "6px 14px",
    borderRadius: 16,
    fontSize: 13,
    fontWeight: 600,
  },
  jobDetails: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  budgetValue: {
    marginTop: 6,
    fontWeight: 600,
    color: "#7c3aed",
    fontSize: 14,
  },
  jobActions: {
    display: "flex",
    gap: 12,
    marginTop: 20,
  },
  pauseBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: 20,
    border: "1px solid #ccc",
    background: "#fff",
    fontWeight: 500,
    cursor: "pointer",
  },
  editBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: 20,
    border: "none",
    background: "#FFF9A8",
    fontWeight: 600,
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  popup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    zIndex: 1000,
    width: "95%",
    maxWidth: 520,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
  },
  closeBtn: {
    border: "none",
    background: "none",
    fontSize: 24,
    cursor: "pointer",
    color: "#666",
  },
  modalSubtitle: {
    color: "#666",
    marginBottom: 16,
    fontSize: 14,
  },
  modalOption: {
    padding: "14px 0",
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    fontSize: 15,
  },
  infoBox: {
    background: "#fffde7",
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    fontSize: 13,
    color: "#555",
    lineHeight: 1.5,
  },
  jobPopup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
    zIndex: 1000,
    width: "95%",
    maxWidth: 520,
  },
  confirmHeader: {
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e5e5",
  },
  confirmTitle: {
    margin: 0,
    fontWeight: 600,
    fontSize: 18,
  },
  confirmContent: {
    padding: "20px",
  },
  confirmText: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.6,
    color: "#111",
  },
  confirmActions: {
    padding: "14px 20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    borderTop: "1px solid #e5e5e5",
  },
  cancelBtn: {
    padding: "8px 18px",
    borderRadius: 8,
    border: "1px solid #cfcfcf",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  confirmBtn: {
    padding: "8px 22px",
    borderRadius: 8,
    border: "none",
    background: "#FFF9A8",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
  optionSubtitle: {
    margin: "0 0 14px",
    fontSize: 14,
    color: "#444",
  },
  radioOption: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 0",
    cursor: "pointer",
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: "2px solid #666",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#111",
  },
  radioLabel: {
    fontSize: 14,
  },
  warningBox: {
    marginTop: 14,
    background: "#fff9c4",
    padding: "12px 14px",
    borderRadius: 6,
    fontSize: 13,
    color: "#333",
    lineHeight: 1.5,
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

  section: {
    background: "#fff",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    border: "1px solid #e9e2e2ff",
  },

  postedJobsWrapper: {
    maxWidth: window.innerWidth < 768 ? "100%" : 1100,
    width: "100%",
    margin: window.innerWidth < 768 ? "0" : "0 auto", // 👈 remove center gap
    marginTop: "40px",
  },

  jobAvatar: {
    width: 50, height: 50, borderRadius: "20%", background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)", display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0,
  },
  // 
  //  jobTitleWrap: {flex: 1, minWidth: 0, }, jobTitle: {margin: 0, fontSize: 16, fontWeight: 600, color: "#1a1a1a", marginBottom: 4, },
  //  jobDescription: {margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.4, }, 

  //  skillsContainer: {display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, },
  // skillChip: {background: "#FFFFBE", color: "#000", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, }, 
  // skillChipMore: {background: "#8b5cf6", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, },  
  //  jobDetails: {display: "flex", justifyContent: "space-between", gap: 12, paddingTop: 16, borderTop: "1px solid #f0f0f0", }, detailItem: {flex: 1, },
  //  detailLabel: {margin: 0, fontSize: 12, color: "#000", fontWeight: 500, marginBottom: 4, }, detailValue: {margin: 0, fontSize: 13, color: "#1a1a1a", fontWeight: 600, }, 
  //  budgetValue: {margin: 0, fontSize: 13, color: "#7C3CFF", fontWeight: 700, },  /* ================= ACTIONS ================= */  
  //  jobActions: {display: "flex", gap: 10, marginTop: 16, }, pauseBtn: {flex: 1, padding: "10px 16px", borderRadius: 12, border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13, transition: "all 0.2s ease", }, editBtn: {flex: 1, padding: "10px 16px", borderRadius: 12, border: "2px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer", fontSize: 13, transition: "all 0.2s ease", }, emptyText: {textAlign: "center", color: "#9ca3af", fontSize: 14, padding: "40px 0", },
};