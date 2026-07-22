// FreelancerFullDetailScreen.jsx
// Converted from flfullDetail.dart — full React.js version

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  limit,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firbase/Firebase"; // adjust path as needed
import { Share2, Flag, ArrowLeft, X, ChevronRight, Check, Ban } from "lucide-react";

// ─── Chip Gradients ───────────────────────────────────────────────────────────
const CHIP_GRADIENTS = [
  ["#FFD6C9", "#FFD6C9"], ["#D7F5FF", "#D7F5FF"], ["#EAD9FF", "#EAD9FF"],
  ["#D9FFE3", "#D9FFE3"], ["#E3F0FF", "#E3F0FF"], ["#FFD9E0", "#FFD9E0"],
  ["#FFF3C4", "#FFF3C4"], ["#E8F5E9", "#E8F5E9"], ["#F3E5F5", "#F3E5F5"],
  ["#E1F5FE", "#E1F5FE"], ["#FFEBEE", "#FFEBEE"], ["#F1F8E9", "#F1F8E9"],
  ["#E0F2F1", "#E0F2F1"], ["#FFFDE7", "#FFFDE7"],
];
function getChipGradient(label) {
  const idx = Math.abs(label.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % CHIP_GRADIENTS.length;
  return CHIP_GRADIENTS[idx];
}

// ─── Skill Chip ───────────────────────────────────────────────────────────────
function SkillChip({ label }) {
  const [c1, c2] = getChipGradient(label);
  return (
    <span style={{
      padding: "6px 14px",
      borderRadius: 24,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      fontSize: 13,
      fontWeight: 500,
      color: "#1A1A1A",
      fontFamily: "Rubik, sans-serif",
      display: "inline-block",
    }}>{label}</span>
  );
}

// ─── Yellow Skill Chip ────────────────────────────────────────────────────────
function YellowSkillChip({ label }) {
  return (
    <span style={{
      padding: "6px 14px",
      borderRadius: 24,
      background: "#FFF7C2",
      fontSize: 13,
      fontWeight: 500,
      color: "#1A1A1A",
      fontFamily: "Rubik, sans-serif",
      display: "inline-block",
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

// ─── Modal Backdrop ───────────────────────────────────────────────────────────
function Modal({ open, onClose, children, maxWidth = 480 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 24, padding: 24,
        width: "90%", maxWidth, boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        fontFamily: "Rubik, sans-serif",
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────
function BottomSheet({ open, onClose, children, height = "auto" }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#FFFDE7", borderRadius: "24px 24px 0 0", padding: 18,
        width: "100%", maxWidth: 600, maxHeight: "80vh", overflowY: "auto",
        fontFamily: "Rubik, sans-serif",
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Snackbar ─────────────────────────────────────────────────────────────────
function Snackbar({ message, color, onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [message]);
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: color || "#333", color: "#fff", padding: "12px 24px",
      borderRadius: 10, fontFamily: "Rubik, sans-serif", zIndex: 9999, fontSize: 14,
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    }}>{message}</div>
  );
}

// ─── Report Reasons ───────────────────────────────────────────────────────────
const REPORT_REASONS = [
  "Fraud or scam", "Misinformation", "Harassment", "Threats or violence",
  "Dangerous or extremist organizations", "Self-harm", "Hateful speech",
  "Graphic content", "Sexual content", "Child exploitation", "Infringement",
  "Illegal goods and service",
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FreelancerFullDetailScreen({ userId: propUserId, jobid: propJobid }) {
  
  const navigate = useNavigate();
  
const params = useParams();

const uid = propUserId || params.userId;
const jobId = propJobid || params.jobId;

  const currentUser = auth.currentUser;
  const currentUid = currentUser?.uid;

  // Profile data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Portfolio
  const [portfolio, setPortfolio] = useState([]);

  // Services
  const [workServices, setWorkServices] = useState([]);
  const [services24h, setServices24h] = useState([]);
  const [activeTab, setActiveTab] = useState("work");

  // Collaboration
  const [requestedJobIds, setRequestedJobIds] = useState(new Set());
  const [acceptedJobIds, setAcceptedJobIds] = useState(new Set());
  const [currentSelectedJobId, setCurrentSelectedJobId] = useState(jobId || "");
  const [cachedJobs, setCachedJobs] = useState(null);

  // Modals
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showReportReasons, setShowReportReasons] = useState(false);
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);

  // Project popup form
  const [selectedJob, setSelectedJob] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [userJobs, setUserJobs] = useState([]);
  const [pendingSubmit, setPendingSubmit] = useState(null);

  // Snackbar
  const [snack, setSnack] = useState({ msg: "", color: "#333" });

  const showSnack = (msg, color = "#333") => setSnack({ msg, color });

  // ── Fetch user data ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    const unsub = onSnapshot(doc(db, "users", uid), snap => {
      if (snap.exists()) setUserData({ id: snap.id, ...snap.data() });
      else setError("User profile not found");
      setLoading(false);
    }, err => { setError(err.message); setLoading(false); });
    return unsub;
  }, [uid]);

  // ── Fetch portfolio ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(
      query(collection(db, "users", uid, "portfolio")),
      snap => setPortfolio(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return unsub;
  }, [uid]);

  // ── Fetch services ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return;
    const unsub1 = onSnapshot(
      query(collection(db, "users", uid, "services"), orderBy("createdAt", "desc")),
      snap => setWorkServices(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    const unsub2 = onSnapshot(
      query(collection(db, "users", uid, "service_24h"), orderBy("createdAt", "desc")),
      snap => setServices24h(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => { unsub1(); unsub2(); };
  }, [uid]);

  // ── Check collaboration requests ─────────────────────────────────────────────
  useEffect(() => {
    if (!currentUid || !uid) return;
    const checkRequested = async () => {
      const snap = await getDocs(query(
        collection(db, "collaboration_requests"),
        where("clientId", "==", currentUid),
        where("freelancerId", "==", uid),
        where("status", "in", ["sent", "pending"])
      ));
      setRequestedJobIds(new Set(snap.docs.map(d => d.data().jobId).filter(Boolean)));
    };
    const checkAccepted = async () => {
      const snap = await getDocs(query(
        collection(db, "accepted_jobs"),
        where("clientId", "==", currentUid),
        where("freelancerId", "==", uid)
      ));
      setAcceptedJobIds(new Set(snap.docs.map(d => d.data().jobId).filter(Boolean)));
    };
    checkRequested();
    checkAccepted();
  }, [currentUid, uid]);

  // ── Fetch user's posted jobs for popup ───────────────────────────────────────
  const fetchUserJobs = useCallback(async () => {
    if (cachedJobs) return cachedJobs;
    if (!currentUid) return [];
    const [j1, j2] = await Promise.all([
      getDocs(query(collection(db, "jobs"), where("userId", "==", currentUid))),
      getDocs(query(collection(db, "jobs_24h"), where("userId", "==", currentUid))),
    ]);
    const all = [
      ...j1.docs.map(d => ({ ...d.data(), id: d.id, type: "services" })),
      ...j2.docs.map(d => ({ ...d.data(), id: d.id, type: "services_24h" })),
    ];
    setCachedJobs(all);
    return all;
  }, [currentUid, cachedJobs]);

  useEffect(() => {
    if (showProjectPopup) fetchUserJobs().then(setUserJobs);
  }, [showProjectPopup]);

  // ── Block user ────────────────────────────────────────────────────────────────
  const blockUser = async () => {
    if (!currentUid) return showSnack("You must be logged in", "red");
    try {
      await setDoc(doc(db, "blocked_users", `${currentUid}_${uid}`), {
        blockedBy: currentUid, blockedUserId: uid,
        blockedUserName: fullName, blockedAt: serverTimestamp(),
      });
      showSnack("User blocked successfully", "green");
      setShowBlockConfirm(false);
    } catch (e) { showSnack("Failed to block user", "red"); }
  };

  // ── Submit report ─────────────────────────────────────────────────────────────
  const submitReport = async (reason) => {
    if (!currentUid) return showSnack("You must be logged in", "red");
    try {
      await addDoc(collection(db, "reports"), {
        reportedBy: currentUid, reportedUserId: uid,
        reportedUserName: fullName, reason,
        reportType: "user_profile", createdAt: serverTimestamp(), status: "pending",
      });
      showSnack("Report submitted successfully", "green");
      setShowReportReasons(false);
    } catch (e) { showSnack("Failed to submit report", "red"); }
  };

  // ── Check already requested ───────────────────────────────────────────────────
  const hasAlreadyRequested = async (freelancerId, jobId) => {
    if (!currentUid || !jobId) return false;
    const snap = await getDocs(query(
      collection(db, "collaboration_requests"),
      where("clientId", "==", currentUid),
      where("freelancerId", "==", freelancerId),
      where("jobId", "==", jobId),
      where("status", "in", ["sent", "pending"]),
      limit(1)
    ));
    return !snap.empty;
  };

  // ── Send notification ─────────────────────────────────────────────────────────
  const sendFreelancerNotification = async (freelancerId, jobId, jobTitle) => {
    const existing = await getDocs(query(
      collection(db, "freelancer_notifications"),
      where("freelancerId", "==", freelancerId),
      where("jobId", "==", jobId),
      where("status", "==", "applied")
    ));
    if (!existing.empty) return;
    await addDoc(collection(db, "freelancer_notifications"), {
      freelancerId, jobId, jobTitle, status: "applied",
      createdAt: serverTimestamp(), isRead: false,
    });
  };

  // ── Handle project request submit ─────────────────────────────────────────────
  const handleProjectSubmit = async () => {
    if (!projectTitle.trim()) return;
    const already = await hasAlreadyRequested(uid, selectedJob?.id);
    if (already) return showSnack("You already sent a request to this freelancer", "orange");
    setShowProjectPopup(false);
    setPendingSubmit({ title: projectTitle.trim(), desc: projectDesc.trim() });
    setShowSuccessPopup(true);
  };

  // ── Handle collaboration continue ─────────────────────────────────────────────
const handleCollaborationContinue = async () => {
  setShowSuccessPopup(false);

  if (!currentUid || !pendingSubmit) return;

  const { title, desc } = pendingSubmit;

  try {
    const requestRef = await addDoc(collection(db, "collaboration_requests"), {
      clientId: currentUid,
      freelancerId: uid,
      freelancerName: fullName,
      jobId: selectedJob?.id || null,
      jobType: selectedJob?.type || null,
      title,
      description: desc,
      status: "sent",
      createdAt: serverTimestamp(),
    });

    await sendFreelancerNotification(uid, selectedJob?.id || "", title);

    // ✅ IMPORTANT: Job data create
    const jobPayload = {
      id: selectedJob?.id,
      title: title,
      description: desc,
      budget_from: selectedJob?.budget_from || "",
      budget_to: selectedJob?.budget_to || "",
      category: selectedJob?.category || "",
      sub_category: selectedJob?.sub_category || "",
      skills: selectedJob?.skills || [],
      timeline: selectedJob?.timeline || "",
      is24h: selectedJob?.type === "services_24h",
      startDateTime: selectedJob?.startDateTime || null,
    };

    // ✅ IMPORTANT: Convert to chat format
    const initialMessage = `HUZZLER_JOB_DATA:${JSON.stringify(jobPayload)}`;

    showSnack("Request sent! Opening chat...", "green");

    // ✅ FINAL NAVIGATION FIX
    navigate(`/chat/${currentUid}/${uid}`, {
      state: {
        currentUid: currentUid,
        otherUid: uid,
        otherName: fullName,
        initialMessage: initialMessage, // 🔥 THIS IS KEY
      },
    });

  } catch (e) {
    showSnack("Error sending request", "red");
  }
};

  // ── Share profile ─────────────────────────────────────────────────────────────
  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({ title: "Huzzler App", url: "https://play.google.com/store/apps/details?id=com.huzzler.app" });
    } else {
      navigator.clipboard.writeText("https://play.google.com/store/apps/details?id=com.huzzler.app");
      showSnack("Link copied!", "green");
    }
  };

  // ── Open link ─────────────────────────────────────────────────────────────────
  const openLink = (url) => {
    if (!url) return;
    const fixed = url.startsWith("http") ? url : `https://${url}`;
    window.open(fixed, "_blank");
  };

  // ── Derived data ──────────────────────────────────────────────────────────────
  const firstName = userData?.firstName || "";
  const lastName = userData?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "User";
  const professional = userData?.professional_title || "Freelancer";
  const about = userData?.about || "";
  const skills = Array.isArray(userData?.skills) ? userData.skills : [];
  const tools = Array.isArray(userData?.tools) ? userData.tools : [];
  const profileImage = userData?.profileImage || "";
  const coverImage = userData?.coverImage || "";
  const userLinks = userData?.links || {};

  // ── Collaboration button logic ─────────────────────────────────────────────────
  const effectiveJobId = currentSelectedJobId || jobid || "";

  // ── Render ────────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ width: 40, height: 40, border: "3px solid #7C3CFF", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Rubik, sans-serif" }}>
      <div style={{ fontSize: 48, color: "#ccc", marginBottom: 16 }}>⚠️</div>
      <div style={{ color: "#666", fontSize: 16, textAlign: "center" }}>{error}</div>
      <button onClick={() => window.location.reload()} style={{ marginTop: 24, background: "#7C3CFF", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer" }}>Retry</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", background: "#f9f9f9", minHeight: "100vh", fontFamily: "Rubik, sans-serif", position: "relative" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── Cover + Header ──────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: 200, overflow: "hidden", background: "#ddd" }}>
        {coverImage
          ? <img src={coverImage} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#7C3CFF,#00E5FF)" }} />
        }
        {/* Back + Flag + Share */}
        <div style={{ position: "absolute", top: 16, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 16px" }}>
          <button onClick={() => navigate(-1)} style={iconBtnStyle}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowReportSheet(true)} style={iconBtnStyle}>
              <Flag size={18} color="#fff" />
            </button>
            <button onClick={shareProfile} style={iconBtnStyle}>
              <Share2 size={18} color="#fff" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Profile Image ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -55, background: "#fff", paddingBottom: 8, paddingTop: 0 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ border: "5px solid #fff", borderRadius: "50%", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
            {profileImage
              ? <img src={profileImage} alt="profile" style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover" }} />
              : <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#aaa" }}>👤</div>
            }
          </div>
          <div style={{
            position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
            background: "linear-gradient(90deg,#0047FF,#00E5FF)", borderRadius: 24,
            border: "3px solid #fff", padding: "4px 14px", whiteSpace: "nowrap",
          }}>
            <span style={{ color: "#fff", fontSize: 12, fontFamily: "Rubik, sans-serif" }}>{professional}</span>
          </div>
        </div>

        <h2 style={{ margin: "18px 0 4px", fontSize: 22, fontWeight: 500, color: "#1A1A1A" }}>{fullName}</h2>

        {/* Action Button */}
        <div style={{ width: "80%", maxWidth: 360, margin: "16px auto 0" }}>
          <CollaborationButton
            currentUid={currentUid}
            uid={uid}
            jobid={effectiveJobId}
            fullName={fullName}
            profileImage={profileImage}
            requestedJobIds={requestedJobIds}
            acceptedJobIds={acceptedJobIds}
            onConnect={() => setShowProjectPopup(true)}
            navigate={navigate}
          />
        </div>

        {/* User links */}
        {Object.entries(userLinks).filter(([, v]) => v?.trim()).length > 0 && (
          <div style={{ display: "flex", gap: 24, marginTop: 12, marginBottom: 8 }}>
            {Object.entries(userLinks).filter(([, v]) => v?.trim()).map(([key, val]) => (
              <button key={key} onClick={() => openLink(val)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#1a73e8", fontSize: 15, fontWeight: 500, textDecoration: "underline",
                fontFamily: "Rubik, sans-serif",
              }}>{key.charAt(0).toUpperCase() + key.slice(1)}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── About ──────────────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>About</SectionTitle>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#333", margin: 0 }}>
          {about || "No description available."}
        </p>
        {(skills.length > 0 || tools.length > 0) && (
          <>
            <SectionTitle style={{ marginTop: 24 }}>Skills & Tools</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
              {[...skills, ...tools].map((s, i) => <SkillChip key={i} label={s} />)}
            </div>
          </>
        )}
      </Section>

      {/* ── Portfolio ──────────────────────────────────────────────────────── */}
      <Section style={{ marginTop: 8 }}>
        <SectionTitle>Portfolio</SectionTitle>
        {portfolio.length === 0
          ? <p style={{ color: "#999", fontSize: 14 }}>No portfolio items yet.</p>
          : <PortfolioCarousel items={portfolio} uid={uid} currentUid={currentUid} showSnack={showSnack} />
        }
      </Section>

      {/* ── Services Tabs ──────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", marginTop: 8 }}>
        <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", padding: "0 16px" }}>
          {["work", "24h"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: "14px 0", border: "none", background: "none", cursor: "pointer",
              fontSize: 16, fontWeight: 500, fontFamily: "Rubik, sans-serif",
              color: activeTab === tab ? "#000" : "#888",
              borderBottom: activeTab === tab ? "6px solid #FFFFA8" : "6px solid transparent",
              transition: "all 0.2s",
            }}>
              {tab === "work" ? "Work" : "24 Hour"}
            </button>
          ))}
        </div>
        <div style={{ padding: "12px 0", maxHeight: 420, overflowY: "auto" }}>
          {activeTab === "work"
            ? (workServices.length === 0
                ? <EmptyState msg="No work services yet" />
                : workServices.map(s => <WorkJobCard key={s.id} job={s} />))
            : (services24h.length === 0
                ? <EmptyState msg="No 24h services yet" />
                : services24h.map(s => <WorkJobCard key={s.id} job={s} />))
          }
        </div>
      </div>

      {/* ─── BOTTOM SPACER ────────────────────────────────────────────────── */}
      <div style={{ height: 40 }} />

      {/* ─── MODALS & SHEETS ──────────────────────────────────────────────── */}

      {/* Report / Block Sheet */}
      <BottomSheet open={showReportSheet} onClose={() => setShowReportSheet(false)}>
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 500 }}>Report or block</h3>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "#666" }}>Select an action</p>
        <ReportTile title={`Block ${fullName}`} onClick={() => { setShowReportSheet(false); setShowBlockConfirm(true); }} />
        <ReportTile title={`Report ${fullName}`} onClick={() => { setShowReportSheet(false); setShowReportReasons(true); }} />
        <div style={{ background: "#C5ACF9", borderRadius: 12, padding: 12, display: "flex", gap: 8, margin: "16px 0" }}>
          <span>ℹ️</span>
          <span style={{ fontSize: 13 }}>To report posts, comments, or messages, select the overflow menu next to that content and select Report.</span>
        </div>
        <button onClick={() => setShowReportSheet(false)} style={outlineFullBtn}>Cancel</button>
      </BottomSheet>

      {/* Block Confirm */}
      <Modal open={showBlockConfirm} onClose={() => setShowBlockConfirm(false)}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#E6DCFF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
            <Ban size={28} color="#7C3CFF" />
          </div>
          <h3 style={{ margin: "0 0 12px", fontSize: 20, fontWeight: 600 }}>Block {fullName}?</h3>
          <p style={{ margin: "0 0 24px", fontSize: 14, lineHeight: 1.6, color: "#333" }}>
            You're about to block {fullName}.<br />
            You'll no longer be connected, and will lose any endorsements or recommendations from this person.
          </p>
          <button onClick={blockUser} style={{ ...filledBtn, width: "100%", marginBottom: 12 }}>Block</button>
          <button onClick={() => setShowBlockConfirm(false)} style={{ ...outlineFullBtn, width: "100%" }}>Back</button>
        </div>
      </Modal>

      {/* Report Reasons */}
      <BottomSheet open={showReportReasons} onClose={() => setShowReportReasons(false)} height="80vh">
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>Report profile element</h3>
        <p style={{ margin: "0 0 18px", fontSize: 14, color: "#555" }}>Select our policy that applies</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          {REPORT_REASONS.map(r => (
            <button key={r} onClick={() => setSelectedReason(r)} style={{
              padding: "10px 14px", borderRadius: 30, border: "1px solid #e0e0e0", cursor: "pointer",
              background: selectedReason === r ? "#7C3CFF" : "#EBE1FF",
              color: selectedReason === r ? "#fff" : "#000",
              fontSize: 14, fontFamily: "Rubik, sans-serif", transition: "all 0.2s",
            }}>{r}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setShowReportReasons(false)} style={{ ...outlineFullBtn, flex: 1 }}>Back</button>
          <button disabled={!selectedReason} onClick={() => submitReport(selectedReason)} style={{
            ...filledBtn, flex: 1, opacity: selectedReason ? 1 : 0.5
          }}>Submit Report</button>
        </div>
      </BottomSheet>

      {/* Project Request Popup */}
      <Modal open={showProjectPopup} onClose={() => setShowProjectPopup(false)} maxWidth={520}>
        <h3 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 600, color: "#333" }}>
          Collaborate and Turn Ideas into Reality!
        </h3>
        {/* Job selector */}
        <select
          value={selectedJob?.id || ""}
          onChange={e => {
            const job = userJobs.find(j => j.id === e.target.value);
            setSelectedJob(job || null);
            if (job) setProjectTitle(job.title || "");
          }}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 18, border: "none",
            background: "#fff", fontSize: 14, fontFamily: "Rubik, sans-serif",
            marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", outline: "none",
          }}
        >
          <option value="">Select a Service</option>
          {userJobs.map(j => <option key={j.id} value={j.id}>{j.title || "Untitled"}</option>)}
        </select>
        <input
          value={projectTitle}
          onChange={e => setProjectTitle(e.target.value)}
          placeholder="Project Title"
          style={inputStyle}
        />
        <textarea
          value={projectDesc}
          onChange={e => setProjectDesc(e.target.value)}
          placeholder="Project Description"
          rows={5}
          style={{ ...inputStyle, resize: "vertical", marginTop: 14 }}
        />
        <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
          <button
            disabled={!projectTitle.trim()}
            onClick={handleProjectSubmit}
            style={{ ...filledBtn, background: "#FDFD96", color: "#000", opacity: projectTitle.trim() ? 1 : 0.5 }}
          >Submit</button>
          <button onClick={() => setShowProjectPopup(false)} style={outlineBtn}>Cancel</button>
        </div>
      </Modal>

      {/* Success Popup */}
      <Modal open={showSuccessPopup} onClose={() => setShowSuccessPopup(false)}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#FDFD96", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <Check size={38} color="#000" />
          </div>
          <h3 style={{ margin: "0 0 28px", fontSize: 17, fontWeight: 600 }}>Request sent successfully!</h3>
          <button onClick={handleCollaborationContinue} style={{ ...filledBtn, width: "100%", background: "#FDFD96", color: "#000" }}>
            Continue
          </button>
        </div>
      </Modal>

      {/* Snackbar */}
      <Snackbar message={snack.msg} color={snack.color} onDone={() => setSnack({ msg: "", color: "#333" })} />
    </div>
  );
}

// ─── Collaboration Button ──────────────────────────────────────────────────────
function CollaborationButton({ currentUid, uid, jobid, fullName, profileImage, requestedJobIds, acceptedJobIds, onConnect, navigate }) {
  const [status, setStatus] = useState(null); // null | "sent" | "accepted"
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!currentUid || !uid || !jobid) return;
    setChecking(true);
    const unsub = onSnapshot(
      query(
        collection(db, "collaboration_requests"),
        where("clientId", "==", currentUid),
        where("freelancerId", "==", uid),
        where("jobId", "==", jobid),
        limit(1)
      ),
      snap => {
        if (snap.empty) setStatus(null);
        else setStatus(snap.docs[0].data().status || "sent");
        setChecking(false);
      }
    );
    return unsub;
  }, [currentUid, uid, jobid]);

  if (checking) return <div style={{ height: 46 }} />;
  if (!jobid || status === null) {
    return (
      <button onClick={onConnect} style={{ ...connectBtn, width: "100%" }}>Connect</button>
    );
  }
  if (status === "accepted") {
    return (
      <button onClick={() => navigate(`/chat/${currentUid}/${uid}`, { state: { otherName: fullName } })}
        style={{ ...connectBtn, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        💬 Message
      </button>
    );
  }
  return (
    <button disabled style={{ width: "100%", padding: "12px 0", borderRadius: 25, background: "#e0e0e0", color: "#666", border: "none", fontSize: 15, fontFamily: "Rubik, sans-serif", cursor: "not-allowed" }}>
      Requested
    </button>
  );
}

// ─── Portfolio Carousel ────────────────────────────────────────────────────────
function PortfolioCarousel({ items, uid, currentUid, showSnack }) {
  const [idx, setIdx] = useState(0);
  const item = items[idx];
  if (!item) return null;
  const allSkills = [...(item.skills || []), ...(item.tools || [])];

  return (
    <div>
      <div style={{
        border: "1px solid #e0e0e0", borderRadius: 16, padding: 14,
        display: "flex", gap: 16, background: "#fff", cursor: "pointer",
        minHeight: 140,
      }} onClick={() => item.projectUrl && window.open(item.projectUrl.startsWith("http") ? item.projectUrl : `https://${item.projectUrl}`, "_blank")}>
        <img
          src={item.imageUrl || "/portfolio-placeholder.png"}
          alt={item.title}
          onError={e => { e.target.src = "https://via.placeholder.com/120x140?text=Portfolio"; }}
          style={{ width: 120, height: 140, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
        />
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title || "Untitled"}</div>
          <div style={{ fontSize: 14, color: "#666", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{item.description || "No description"}</div>
          {allSkills.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto" }}>
              {allSkills.slice(0, 10).map((s, i) => <YellowSkillChip key={i} label={s} />)}
            </div>
          )}
        </div>
      </div>
      {items.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
          <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0} style={navBtn}>‹</button>
          <span style={{ fontSize: 13, color: "#888" }}>{idx + 1} / {items.length}</span>
          <button onClick={() => setIdx(i => Math.min(items.length - 1, i + 1))} disabled={idx === items.length - 1} style={navBtn}>›</button>
        </div>
      )}
    </div>
  );
}

// ─── Work Job Card ─────────────────────────────────────────────────────────────
function WorkJobCard({ job }) {
  const skills = Array.isArray(job.skills) ? job.skills : [];
  const tools = Array.isArray(job.tools) ? job.tools : [];
  const all = [...skills, ...tools];
  const visible = all.slice(0, 3);
  const extra = all.length - visible.length;

  return (
    <div style={{
      margin: "0 16px 12px", padding: "20px 20px 22px",
      background: "#FFFFEA", borderRadius: 24,
      border: "1px solid #CECECE",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: "#000", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title || ""}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#000", whiteSpace: "nowrap", marginLeft: 12 }}>₹ {job.budget_from || "0"}/per day</div>
      </div>
      <div style={{ fontSize: 10, color: "#888", marginBottom: 10 }}>Skills Required</div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16 }}>
        {visible.map((s, i) => (
          <span key={i} style={{ padding: "6px 12px", background: "#FFFFBE", borderRadius: 20, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>{s}</span>
        ))}
        {extra > 0 && (
          <span style={{ padding: "6px 12px", background: "#FFFFA8", borderRadius: 20, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>{extra}+</span>
        )}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.7, color: "#333", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
        {job.description || ""}
      </div>
    </div>
  );
}

// ─── Helper UI ────────────────────────────────────────────────────────────────
function Section({ children, style = {} }) {
  return <div style={{ background: "#fff", padding: "20px", marginTop: 0, ...style }}>{children}</div>;
}
function SectionTitle({ children, style = {} }) {
  return <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 500, color: "#1A1A1A", ...style }}>{children}</h3>;
}
function EmptyState({ msg }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, color: "#aaa" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>💼</div>
      <div style={{ fontSize: 16, fontFamily: "Rubik, sans-serif" }}>{msg}</div>
    </div>
  );
}
function ReportTile({ title, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
      <span style={{ fontSize: 15 }}>{title}</span>
      <ChevronRight size={18} color="#888" />
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const iconBtnStyle = {
  background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%",
  width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", padding: 0,
};
const connectBtn = {
  background: "#FDFD96", color: "#000", border: "none", borderRadius: 25,
  padding: "12px 24px", fontSize: 15, fontWeight: 500, cursor: "pointer",
  fontFamily: "Rubik, sans-serif",
};
const filledBtn = {
  background: "#7C3CFF", color: "#fff", border: "none", borderRadius: 30,
  padding: "12px 32px", fontSize: 15, fontWeight: 500, cursor: "pointer",
  fontFamily: "Rubik, sans-serif",
};
const outlineFullBtn = {
  background: "none", color: "#000", border: "1px solid #000", borderRadius: 30,
  padding: "12px 32px", fontSize: 15, fontWeight: 500, cursor: "pointer",
  fontFamily: "Rubik, sans-serif", width: "100%",
};
const outlineBtn = {
  background: "none", color: "#000", border: "1px solid rgba(0,0,0,0.2)", borderRadius: 24,
  padding: "12px 32px", fontSize: 15, fontWeight: 500, cursor: "pointer",
  fontFamily: "Rubik, sans-serif",
};
const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 14, border: "none",
  background: "#fff", fontSize: 14, fontFamily: "Rubik, sans-serif",
  boxSizing: "border-box", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", outline: "none",
};
const navBtn = {
  background: "none", border: "1px solid #ddd", borderRadius: 8, padding: "4px 12px",
  cursor: "pointer", fontSize: 18, color: "#555",
};