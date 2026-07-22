

// Service24hDetailScreen.jsx
// Fully ported from servicefullDetailScreen.dart — feature-for-feature parity
// UI design kept exactly as original web version


import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  collection,
  getDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  updateDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "../firbase/Firebase"; // adjust path as needed
import { ArrowLeft, Bookmark, BookmarkCheck, Share2, User, Clock } from "lucide-react";
import FreelancerFullDetailScreen from "../pages/FreelancerFullDetailScreen.jsx"; // for navigation

// ─── Chip Gradients ────────────────────────────────────────────────────────────
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

function TagChip({ label }) {
  const [c1, c2] = getChipGradient(label);
  return (
    <span style={{
      padding: "8px 16px",
      borderRadius: 30,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      fontSize: 13,
      fontWeight: 500,
      color: "#1A1A1A",
      fontFamily: "Rubik, sans-serif",
      display: "inline-block",
    }}>{label}</span>
  );
}

// ─── Time Ago helper ───────────────────────────────────────────────────────────
function timeAgo(date) {
  if (!date) return "";
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  const days = Math.floor(diff / 86400);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

// ─── Format amount ─────────────────────────────────────────────────────────────
function formatAmount(value) {
  const n = Number(value);
  if (isNaN(n)) return String(value);
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

// ─── Snackbar ──────────────────────────────────────────────────────────────────
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

// ─── Loading Spinner ───────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{
        width: 40, height: 40, border: "3px solid #7C3CFF",
        borderTopColor: "transparent", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ServiceFullDetailScreen({ jobId: propJobId }) {
  const navigate = useNavigate();
  const params = useParams();
const jobId = propJobId || params.id;

  const currentUser = auth.currentUser;
  const currentUid = currentUser?.uid;

  // Service data
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // User data (poster)
  const [userData, setUserData] = useState(null);
  const [servicePostedCount, setServicePostedCount] = useState(0);

  // Save state
  const [isSaved, setIsSaved] = useState(false);
  const [savingInProgress, setSavingInProgress] = useState(false);

  // Snackbar
  const [snack, setSnack] = useState({ msg: "", color: "#333" });
  const showSnack = (msg, color = "#333") => setSnack({ msg, color });

  // ── Fetch service from both collections ────────────────────────────────────
  useEffect(() => {
    if (!jobId) return;
    setLoading(true);

    let unsubServices, unsubService24h;
    let hasData = false;

    // Listen to "services" collection
    unsubServices = onSnapshot(doc(db, "services", jobId), snap => {
      if (snap.exists()) {
        hasData = true;
        setServiceData({ id: snap.id, ...snap.data(), _collection: "services" });
        setLoading(false);
      }
    });

    // Listen to "service_24h" collection
    unsubService24h = onSnapshot(doc(db, "service_24h", jobId), snap => {
      if (snap.exists() && !hasData) {
        hasData = true;
        setServiceData({ id: snap.id, ...snap.data(), _collection: "service_24h" });
        setLoading(false);
      }
    });

    // If neither found after a delay
    const timer = setTimeout(() => {
      if (!hasData) {
        setNotFound(true);
        setLoading(false);
      }
    }, 4000);

    return () => {
      unsubServices && unsubServices();
      unsubService24h && unsubService24h();
      clearTimeout(timer);
    };
  }, [jobId]);

  // ── Fetch user's saved jobs ────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUid) return;
    const unsub = onSnapshot(doc(db, "users", currentUid), snap => {
      const data = snap.data() || {};
      const saved = data.savedJobs || [];
      setIsSaved(saved.includes(jobId));
    });
    return unsub;
  }, [currentUid, jobId]);

  // ── Fetch poster's user data ───────────────────────────────────────────────
  useEffect(() => {
    if (!serviceData?.userId) return;
    const fetchUser = async () => {
      const snap = await getDoc(doc(db, "users", serviceData.userId));
      if (snap.exists()) setUserData({ id: snap.id, ...snap.data() });
    };
    fetchUser();
  }, [serviceData?.userId]);

  // ── Fetch service posted count ─────────────────────────────────────────────
  useEffect(() => {
    if (!serviceData?.userId) return;
    const countServices = async () => {
      const [s1, s2] = await Promise.all([
        getDocs(query(collection(db, "services"), where("userId", "==", serviceData.userId))),
        getDocs(query(collection(db, "service_24h"), where("userId", "==", serviceData.userId))),
      ]);
      setServicePostedCount(s1.size + s2.size);
    };
    countServices();
  }, [serviceData?.userId]);

  // ── Toggle save ────────────────────────────────────────────────────────────
  const toggleSave = async () => {
    if (!currentUid || savingInProgress) return;
    setSavingInProgress(true);
    try {
      const userRef = doc(db, "users", currentUid);
      if (isSaved) {
        await updateDoc(userRef, { savedJobs: arrayRemove(jobId) });
      } else {
        await updateDoc(userRef, { savedJobs: arrayUnion(jobId) });
      }
    } catch (e) {
      showSnack("Failed to update saved status", "red");
    }
    setSavingInProgress(false);
  };

  // ── Share ──────────────────────────────────────────────────────────────────
  const shareService = async () => {
    const url = "https://play.google.com/store/apps/details?id=com.huzzler.app";
    if (navigator.share) {
      navigator.share({ title: "Huzzler App", url });
    } else {
      await navigator.clipboard.writeText(url);
      showSnack("Link copied!", "green");
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (loading) return <Spinner />;
  if (notFound || !serviceData) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Rubik, sans-serif", color: "#555" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
      <div style={{ fontSize: 16 }}>Service not found</div>
      <button onClick={() => navigate(-1)} style={{ marginTop: 20, background: "#7C3CFF", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer" }}>Go Back</button>
    </div>
  );

  const {
    title = "",
    description = "",
    deliveryDuration = "24 Hours",
    skills = [],
    tools = [],
    impressions = 0,
    createdAt,
    userId = "",
    location: serviceLocation = "Remote",
    budget_from,
    budget_to,
  } = serviceData;

  const budgetFrom = Number(budget_from) || 0;
  const budgetTo = Number(budget_to) || 0;
  const createdDate = createdAt?.toDate ? createdAt.toDate() : createdAt ? new Date(createdAt) : null;
  const timeText = timeAgo(createdDate);

  const posterFirstName = userData?.firstName || "";
  const posterLastName = userData?.lastName || "";
  const posterFullName = `${posterFirstName} ${posterLastName}`.trim() || "User";
  const posterInitials = [posterFirstName[0], posterLastName[0]].filter(Boolean).join("").toUpperCase() || "U";
  const professionalTitle = userData?.professional_title || "Freelancer";
  const completedProjects = userData?.completedProjects || 0;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", background: "#fff", minHeight: "100vh", fontFamily: "Rubik, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 16px", position: "sticky", top: 0, background: "#fff",
        zIndex: 100, borderBottom: "1px solid #f0f0f0",
      }}>
        <button onClick={() => navigate(-1)} style={iconBtn}>
          <ArrowLeft size={22} color="#000" />
        </button>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={toggleSave} disabled={savingInProgress} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            {isSaved
              ? <Bookmark size={26} fill="#000" color="#000" />
              : <Bookmark size={26} color="#000" />
            }
          </button>
          <button onClick={shareService} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Share2 size={26} color="#000" />
          </button>
        </div>
      </div>

      <div style={{ height: 10 }} />

      {/* ── MAIN CARD (Budget / Timeline / Location) ───────────────────── */}
      <div style={{ margin: "0 16px" }}>
        <div style={{
          background: "#FFFFEA", borderRadius: 20, padding: 20,
          border: "1.2px solid #e0e0e0",
        }}>
          {/* Title */}
          <div style={{ fontSize: 20, fontWeight: 500, color: "#1A1A1A", marginBottom: 12 }}>{title}</div>

          {/* Budget / Timeline / Location row */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <InfoColumn label="Budget" value={`₹${formatAmount(budgetFrom)} – ₹${formatAmount(budgetTo)}`} valueColor="#6200EE" />
            <InfoColumn label="Timeline" value={deliveryDuration} />
            <InfoColumn label="Location" value={serviceLocation} />
          </div>

          {/* Proposed + TimeAgo */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#333" }}>
              <User size={18} />
              <span>{impressions} Proposed</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#333" }}>
              <Clock size={18} />
              <span>{timeText}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 20 }} />

      {/* ── SKILLS REQUIRED ──────────────────────────────────────────────── */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ fontSize: 18, fontWeight: 500, color: "#1A1A1A", marginBottom: 10 }}>Skills Required</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[...skills, ...tools].map((s, i) => <TagChip key={i} label={s} />)}
          {skills.length === 0 && tools.length === 0 && (
            <span style={{ fontSize: 14, color: "#999" }}>No skills listed</span>
          )}
        </div>
      </div>

      <div style={{ height: 24 }} />

      {/* ── DESCRIPTION ──────────────────────────────────────────────────── */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ fontSize: 18, fontWeight: 500, color: "#1A1A1A", marginBottom: 10 }}>Project Description</div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "#333", margin: 0 }}>
          {description || "No description provided."}
        </p>
      </div>

      <div style={{ height: 24 }} />

      {/* ── ABOUT FREELANCER ─────────────────────────────────────────────── */}
      {userData && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#1A1A1A", marginBottom: 14 }}>About the Freelancers</div>

          {/* Avatar + Name + Profile Button */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            {/* Avatar */}
            <div style={{
              width: 55, height: 55, background: "#5359FF", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {userData.profileImage
                ? <img src={userData.profileImage} alt="" style={{ width: 55, height: 55, borderRadius: 10, objectFit: "cover" }} />
                : <span style={{ fontSize: 20, fontWeight: 500, color: "#C4C6FF" }}>{posterInitials}</span>
              }
            </div>

            {/* Name + Title */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: "#1A1A1A" }}>{posterFullName}</div>
              <div style={{ height: 6 }} />
              <div style={{ fontSize: 15, fontWeight: 500, color: "#7C3CFF" }}>{professionalTitle}</div>
            </div>

            {/* View Profile */}
            <button
  style={{
    padding: "8px 14px",
    background: "#7C3CFF",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  }}
  onClick={() => {
    console.log("USER ID:", serviceData?.userId);

    if (!serviceData?.userId) {
      alert("User ID missing");
      return;
    }

    navigate(`/freelance-dashboard/freelancer-profile/${userId}/${jobId}`);
  }}
>
  View Profile
</button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#333" }}>
            <span>Service Posted: {servicePostedCount}</span>
          </div>
        </div>
      )}

      <div style={{ height: 40 }} />

      <Snackbar message={snack.msg} color={snack.color} onDone={() => setSnack({ msg: "", color: "#333" })} />
    </div>
  );
}

// ─── Info Column ───────────────────────────────────────────────────────────────
function InfoColumn({ label, value, valueColor = "#1A1A1A" }) {
  return (
    <div>
      <div style={{ fontSize: 15, color: "#555", marginBottom: 8, fontFamily: "Rubik, sans-serif" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: valueColor, fontFamily: "Rubik, sans-serif" }}>{value}</div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const iconBtn = {
  background: "none", border: "none", cursor: "pointer", padding: 4,
  display: "flex", alignItems: "center", justifyContent: "center",
};