
// JobfullDetailScreen.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  collection,
  addDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firbase/Firebase";

import { FiX, FiBookmark } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import share from "../assets/share.png";

const rubikFontStyle = { fontFamily: "'Rubik', sans-serif" };

export default function JobFullDetailJobScreen() {
  const { id: jobId, source } = useParams();
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, [auth]);

  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────
  const [job, setJob] = useState(null);
  const [workJobs, setWorkJobs] = useState([]);
  const [fastJobs, setFastJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const [applicationStatus, setApplicationStatus] = useState("none");
  const [acceptedAt, setAcceptedAt] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  const [filters] = useState({
    searchQuery: "",
    budgetRange: { start: 0, end: 9999999 },
    categories: [],
    skills: [],
    postingTime: null,
    sortOption: "NEWEST",
  });

  const [screeningAnswers, setScreeningAnswers] = useState({});
  const [screeningError, setScreeningError] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  const [client, setClient] = useState(null);

  // ── Resize listener ────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Fetch single job detail (jobs first, then jobs_24h) ──
  useEffect(() => {
    if (!jobId) return;
    let unsub24h = null;

    const unsubJobs = onSnapshot(doc(db, "jobs", jobId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setJob({
          id: snap.id,
          ...data,
          source: "jobs",
          screening_questions: data.screening_questions || [],
        });
        if (unsub24h) unsub24h();
      } else {
        unsub24h = onSnapshot(doc(db, "jobs_24h", jobId), (snap24) => {
          if (snap24.exists()) {
            const data24 = snap24.data();
            setJob({
              id: snap24.id,
              ...data24,
              source: "jobs_24h",
              screening_questions: data24.screening_questions || [],
            });
          } else {
            setJob(null);
          }
        });
      }
    });

    return () => {
      unsubJobs();
      if (unsub24h) unsub24h();
    };
  }, [jobId]);

  // ── Fetch Client Data ──────────────────────────────────
  useEffect(() => {
    if (!job?.userId) return;
    const unsub = onSnapshot(doc(db, "users", job.userId), (snap) => {
      if (snap.exists()) {
        setClient(snap.data());
      }
    });
    return () => unsub();
  }, [job?.userId]);

  // ── Fetch workJobs (jobs collection) ──────────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
      const jobs = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          source: "jobs",
          screening_questions: data.screening_questions || [],
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
        };
      });
      setWorkJobs(jobs);
    });
    return () => unsub();
  }, []);

  // ── Fetch fastJobs (jobs_24h collection) ──────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs_24h"), (snap) => {
      const jobs = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          source: "jobs_24h",
          is24h: true,
          screening_questions: data.screening_questions || [],
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
        };
      });
      setFastJobs(jobs);
    });
    return () => unsub();
  }, []);

  // ── Notifications ──────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "notifications"), (snap) => {
      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((n) => n.clientUid === user.uid);
      setNotifications(items);
    });
    return unsub;
  }, [user]);

  // ── User favorites ─────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        setIsFavorite(false);
        setSavedJobs([]);
        return;
      }
      const favorites = snap.data().favoriteJobs || [];
      setIsFavorite(favorites.includes(jobId));
      setSavedJobs(favorites);
    });
    return () => unsub();
  }, [user, jobId]);

  // ── Application status ─────────────────────────────────
  useEffect(() => {
    if (!job || !user) return;
    if (job.freelancerId === user.uid && job.status === "accepted") {
      setApplicationStatus("accepted");
      setAcceptedAt(job.acceptedAt);
      return;
    }
    const hasApplied = (job.applicants || []).some(
      (a) => a.freelancerId === user.uid
    );
    setApplicationStatus(hasApplied ? "applied" : "none");
  }, [job, user]);

  // ── filteredJobs (Tab logic) ───────────────────────────
  const filteredJobs = useMemo(() => {
    let baseJobs = [];
    if (selectedTab === 0) baseJobs = workJobs;
    if (selectedTab === 1) baseJobs = fastJobs;
    if (selectedTab === 2) baseJobs = [...workJobs, ...fastJobs];

    let result = baseJobs.filter((j) => {
      if (
        filters.searchQuery &&
        !j.title?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
        return false;

      const jobMin = Number(j.budget_from) || 0;
      const jobMax = Number(j.budget_to) || 0;
      if (
        jobMax < filters.budgetRange.start ||
        jobMin > filters.budgetRange.end
      )
        return false;

      if (
        filters.categories.length &&
        !filters.categories.includes(j.category)
      )
        return false;

      if (
        filters.skills.length &&
        !filters.skills.some((s) => j.skills?.includes(s))
      )
        return false;

      if (filters.postingTime) {
        const postedAt = j.createdAt?.getTime?.() || 0;
        const daysMap = {
          "Posted Today": 1,
          "Last 3 Days": 3,
          "Last 7 Days": 7,
          "Last 30 Days": 30,
        };
        const limitDays = daysMap[filters.postingTime];
        if (limitDays) {
          const diffDays = (Date.now() - postedAt) / (1000 * 60 * 60 * 24);
          if (diffDays > limitDays) return false;
        }
      }

      if (selectedTab === 2 && !savedJobs.includes(j.id)) return false;

      return true;
    });

    result.sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );

    return result;
  }, [workJobs, fastJobs, filters, selectedTab, savedJobs]);

  const similarProjects = useMemo(() => {
    if (!job) return [];
    let all = [...workJobs, ...fastJobs];
    let similar = all.filter(j => j.id !== job.id && (j.category === job.category));
    if (similar.length === 0) {
      similar = all.filter(j => j.id !== job.id); // fallback
    }
    similar.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    return similar.slice(0, 3);
  }, [job, workJobs, fastJobs]);

  // ── Handlers ───────────────────────────────────────────
  async function handleSave(e) {
    e?.stopPropagation();
    if (!user) {
      alert("Login required!");
      return;
    }
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, { favoriteJobs: [jobId] });
        return;
      }
      const favorites = userSnap.data().favoriteJobs || [];
      const alreadySaved = favorites.includes(jobId);
      await updateDoc(userRef, {
        favoriteJobs: alreadySaved ? arrayRemove(jobId) : arrayUnion(jobId),
      });
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong");
    }
  }

  async function handleApply(applyJobId, answersArray) {
    if (!user) return alert("Please login to apply");
    try {
      const userId = user.uid;
      const freelancerSnap = await getDoc(doc(db, "users", userId));
      const freelancer = freelancerSnap.data() || {};
      const freelancerName =
        `${freelancer.first_name || ""} ${freelancer.last_name || ""}`.trim();
      const freelancerImage = freelancer.profileImage || "";

      const jobRef = doc(db, job?.source || "jobs", applyJobId);
      const jobSnap = await getDoc(jobRef);
      const jobData = jobSnap.data() || {};

      if ((jobData.applicants || []).some((a) => a.freelancerId === userId)) {
        return alert("Already applied!");
      }

      await updateDoc(jobRef, {
        applicants: arrayUnion({
          freelancerId: userId,
          name: freelancerName,
          profileImage: freelancerImage,
          appliedAt: new Date().toISOString(),
          additional_info: "",
          screening_answers: answersArray,
        }),
        applicants_count: increment(1),
      });

      await addDoc(collection(db, "notifications"), {
        title: jobData.title,
        body: `${freelancerName} applied for ${jobData.title}`,
        freelancerName,
        freelancerImage,
        freelancerId: userId,
        jobTitle: jobData.title,
        jobId: applyJobId,
        clientUid: jobData.userId,
        timestamp: new Date(),
        serviceId: applyJobId,
        read: false,
      });

      alert("Applied successfully!");
    } catch (e) {
      console.error(e);
      alert("Error applying.");
    }
  }

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title || "Project Details",
          text: `Check out this job: ${job?.title}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share canceled or failed", err);
        alert("Share couldn't complete");
      }
    } else {
      try {
        const tempInput = document.createElement("input");
        document.body.appendChild(tempInput);
        tempInput.value = shareUrl;
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Copy fallback failed", err);
        alert("Unable to copy link");
      }
    }
  };

  if (!job)
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>Loading...</div>
    );

  // ── JOB CARD ───────────────────────────────────────────
  const JobCard = ({ j }) => (
    <div
      onClick={() =>
        navigate(`/freelance-dashboard/job/${j.source}/${j.id}`)
      }
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 14,
        padding: "16px 18px",
        marginBottom: 12,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
            {j.title}
          </div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
            {j.category}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 10,
            }}
          >
            {j.skills?.slice(0, 3).map((s, i) => (
              <span
                key={i}
                style={{
                  background: "rgba(255,240,133,0.7)",
                  padding: "3px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#555" }}>
            <span>
              ₹{j.budget_from} - ₹{j.budget_to}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <FaUsers size={12} /> {j.applicants_count || 0}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <MdAccessTime size={12} />
              {j.createdAt ? j.createdAt.toLocaleDateString() : "Recently"}
            </span>
          </div>
        </div>
        {j.is24h && (
          <span
            style={{
              background: "#FF6B35",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 6,
              whiteSpace: "nowrap",
            }}
          >
            ⚡ 24h
          </span>
        )}
      </div>
    </div>
  );

  // ── RENDER ─────────────────────────────────────────────
  return (
    <div style={{ ...rubikFontStyle, display: "flex", justifyContent: "center", padding: isMobile ? "20px 10px" : "40px 40px 100px", background: "#FDFDFD", minHeight: "100vh", boxSizing: "border-box", marginTop: isMobile ? 60 : 0 }}>
      {/* Search Header Area */}
      
      <div style={{ width: "100%", maxWidth: 1300, display: "flex", gap: 24, flexDirection: isMobile ? "column" : "row" }}>
        
        {/* Left Column */}
        <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* Header Card */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #EAEAEA", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#8A8A8A", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
                <span>&larr;</span> Back to Browse
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleSave} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #EAEAEA", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: isFavorite ? "#6C3EEB" : "#8A8A8A" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? "#6C3EEB" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleShare(); }} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #EAEAEA", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <FiX size={16} color="#8A8A8A" onClick={(e) => { e.stopPropagation(); navigate(-1); }} />
                </button>
                <button style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #EAEAEA", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: "#6C3EEB", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700 }}>
                {(() => {
                  const fName = client?.first_name || client?.firstName || client?.name || client?.displayName || "";
                  const lName = client?.last_name || client?.lastName || "";
                  const fullName = fName ? `${fName} ${lName}`.trim() : "Unknown";
                  const compName = client?.Company_name || client?.companyName || job.company_name || fullName;
                  return compName.substring(0, 2).toUpperCase() || "J";
                })()}
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px 0", fontFamily: "'Sora', sans-serif" }}>
                  {(() => {
                    const fName = client?.first_name || client?.firstName || client?.name || client?.displayName || "";
                    const lName = client?.last_name || client?.lastName || "";
                    const fullName = fName ? `${fName} ${lName}`.trim() : "Unknown Company";
                    return client?.Company_name || client?.companyName || job.company_name || fullName;
                  })()}
                </h1>
                <div style={{ fontSize: 14, color: "#8A8A8A", fontFamily: "'DM Sans', sans-serif" }}>{job.category || "General"}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 0", borderTop: "1px solid #F0F0F0", borderBottom: "1px solid #F0F0F0", flexWrap: "wrap", gap: 20, fontFamily: "'DM Sans', sans-serif" }}>
              <div>
                <div style={{ fontSize: 10, color: "#A3A3A3", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>Budget</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#6C3EEB" }}>₹{job.budget_from || 1000}–₹{job.budget_to || 8000}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#A3A3A3", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>Timeline</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{job.timeline || "2-3 weeks"}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#A3A3A3", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>Location</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{job.location || "Remote"}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#A3A3A3", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>Applicants</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{job.applicants_count || 10} Applied</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#A3A3A3", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>Posted</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{job.createdAt ? "Recently" : "6 days ago"}</div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#FFFBF0", color: "#B8860B", borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                ⚡ Immediate Start
              </span>
            </div>
          </div>

          {/* Skills Required */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #EAEAEA", padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px 0", color: "#1A1A1A", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Sora', sans-serif" }}><span style={{ color: "#FF4500" }}>🎯</span> Skills Required</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {(job.skills?.length > 0 ? job.skills : ["UI Design", "Web Design", "UX", "Figma", "Visual Design", "Interactive Design", "Adobe XD", "Prototyping", "Design Systems", "Mobile UI", "Wireframing", "User Research"]).map((s, i) => {
                const colors = [
                  { bg: "#FFF0F4", color: "#FF6E91" },
                  { bg: "#EAF4FF", color: "#3D8BDD" },
                  { bg: "#F0EFFF", color: "#8378FF" },
                  { bg: "#E8F8F0", color: "#34C77B" },
                  { bg: "#FFF4E5", color: "#FF9F43" }
                ];
                const c = colors[i % colors.length];
                return (
                  <span key={i} style={{ background: c.bg, color: c.color, padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                    {s}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Project Description */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #EAEAEA", padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px 0", color: "#1A1A1A", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Sora', sans-serif" }}>📝 Project Description</h3>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, margin: 0, whiteSpace: "pre-line", fontFamily: "'DM Sans', sans-serif" }}>
              {job.description || "We are seeking an experienced UI/UX designer to create modern and intuitive mobile app designs for our startup platform. The project involves designing a complete mobile and web application with approximately 15-20 screens, including onboarding, dashboard, messaging, and analytics interfaces.\n\nThe ideal candidate should have experience creating scalable design systems, user-centered experiences, and responsive layouts optimized for both Android and iOS platforms."}
            </p>
          </div>

          {/* Project Requirements */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #EAEAEA", padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px 0", color: "#1A1A1A", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Sora', sans-serif" }}><span style={{ color: "#32CD32" }}>✅</span> Project Requirements</h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px 32px" }}>
              {[
                "Modern and clean design aesthetic",
                "Mobile-first design approach",
                "Interactive prototypes in Figma",
                "Design system & reusable component library",
                "Responsive web layouts",
                "Strong UX research understanding",
                "User flow and wireframing expertise",
                "Experience with SaaS dashboard design",
                "Ability to collaborate with developers",
                "Fast iteration and communication"
              ].map((req, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6C3EEB", marginTop: 6, flexShrink: 0 }}></div>
                  <span style={{ fontSize: 14, color: "#666", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #EAEAEA", padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px 0", color: "#1A1A1A", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Sora', sans-serif" }}>📦 Deliverables</h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
              {[
                { title: "Mobile App UI Screens", desc: "15-20 high-fidelity screens", icon: "📱", color: "#6C3EEB" },
                { title: "Responsive Web Dashboard", desc: "Full desktop layout", icon: "💻", color: "#6C3EEB" },
                { title: "Design System Library", desc: "Reusable Figma components", icon: "🎨", color: "#6C3EEB" },
                { title: "Interactive Prototype", desc: "Linked Figma prototype", icon: "✨", color: "#6C3EEB" },
                { title: "Developer Handoff Assets", desc: "Annotated specs & exports", icon: "📁", color: "#6C3EEB" },
                { title: "Export-ready UI Kit", desc: "SVG / PNG / Figma", icon: "🎯", color: "#6C3EEB" }
              ].map((del, i) => (
                <div key={i} style={{ background: "#FDFDFD", border: "1px solid #F0F0F0", borderRadius: 12, padding: "16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "#F5F2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: `1px solid ${del.color}30` }}>
                    {del.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", fontFamily: "'Sora', sans-serif", marginBottom: 4 }}>{del.title}</div>
                    <div style={{ fontSize: 12, color: "#A3A3A3", fontFamily: "'DM Sans', sans-serif" }}>{del.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #EAEAEA", padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px 0", color: "#1A1A1A", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Sora', sans-serif" }}>📎 Attachments</h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
              <div style={{ border: "1px solid #F0F0F0", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "#FFF0F4", color: "#FF6E91", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>📄</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", fontFamily: "'Sora', sans-serif", marginBottom: 4 }}>Project_Brief_Final.pdf</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#FF6E91", background: "#FFF0F4", padding: "2px 6px", borderRadius: 4, fontFamily: "'DM Sans', sans-serif" }}>PDF</span>
                      <span style={{ fontSize: 12, color: "#A3A3A3", fontFamily: "'DM Sans', sans-serif" }}>2.4 MB</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ flex: 1, padding: "8px 0", background: "#F5F2FF", color: "#6C3EEB", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Preview</button>
                  <button style={{ flex: 1, padding: "8px 0", background: "#6C3EEB", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Download</button>
                </div>
              </div>
              <div style={{ border: "1px solid #F0F0F0", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "#FFF4E5", color: "#FF9F43", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>🗂️</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", fontFamily: "'Sora', sans-serif", marginBottom: 4 }}>Design_Assets_Pack.zip</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#FF9F43", background: "#FFF4E5", padding: "2px 6px", borderRadius: 4, fontFamily: "'DM Sans', sans-serif" }}>ZIP</span>
                      <span style={{ fontSize: 12, color: "#A3A3A3", fontFamily: "'DM Sans', sans-serif" }}>14.6 MB</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ flex: 1, padding: "8px 0", background: "#F5F2FF", color: "#6C3EEB", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Preview</button>
                  <button style={{ flex: 1, padding: "8px 0", background: "#6C3EEB", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Download</button>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Projects */}
          {similarProjects.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Sora', sans-serif" }}>✨ Similar Projects</h3>
                <span style={{ color: "#6C3EEB", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>View all &rarr;</span>
              </div>
              
              {similarProjects.map((similar, i) => {
                const colors = ["#FF4B4B", "#00B4D8", "#2E8B57", "#6C3EEB", "#FF9F43"];
                const color = colors[i % colors.length];
                const initials = similar.company_name?.substring(0, 2).toUpperCase() || similar.title?.substring(0, 2).toUpperCase() || "SP";
                return (
                  <div key={similar.id} style={{ background: "white", borderRadius: 16, border: "1px solid #EAEAEA", padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#A3A3A3", marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>{similar.company_name || similar.category || "General"}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 6, fontFamily: "'Sora', sans-serif" }}>{similar.title || "Untitled Project"}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {(similar.skills || []).slice(0, 3).map(s => (
                            <span key={s} style={{ background: "#F5F2FF", color: "#6C3EEB", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#6C3EEB", fontFamily: "'Sora', sans-serif" }}>₹{similar.budget_from || 0} - ₹{similar.budget_to || 0}</div>
                      <button 
                        onClick={() => navigate(`/freelance-dashboard/job/${similar.source}/${similar.id}`)}
                        style={{ background: "#6C3EEB", color: "white", padding: "6px 20px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Column (Sidebar) */}
        <div style={{ width: isMobile ? "100%" : 350, flexShrink: 0, display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Action Card */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #EAEAEA", padding: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#6C3EEB", marginBottom: 8, display: "flex", alignItems: "baseline", gap: 4, fontFamily: "'Sora', sans-serif" }}>
              ₹{job.budget_from || 1000}–{job.budget_to || 8000} <span style={{ fontSize: 12, color: "#A3A3A3", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>/ project</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#8A8A8A", marginBottom: 24, flexWrap: "wrap", fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>👥 {job.applicants_count || 10} Applicants</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>⏱️ 6 days ago</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>⚡ Immediate</span>
            </div>

            {/* Screening Questions UI INLINE (if any) */}
            {job.screening_questions?.length > 0 && (
              <div style={{ background: "rgba(255,240,133,0.35)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px 0", fontFamily: "'Sora', sans-serif" }}>Screening Questions *</h3>
                {job.screening_questions.map((q, i) => {
                  const selected = screeningAnswers[i];
                  const showError = screeningError && !selected;
                  return (
                    <div key={i} style={{ background: "#fff", padding: 12, borderRadius: 8, marginBottom: 8, border: showError ? "1px solid red" : "1px solid #eee" }}>
                      <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 8px 0" }}>{q.question}</p>
                      <div style={{ display: "flex", gap: 16 }}>
                        {["Yes", "No"].map((opt) => (
                          <label key={opt} style={{ cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans', sans-serif" }}>
                            <input type="radio" name={`q_${i}`} checked={selected === opt} onChange={() => setScreeningAnswers(prev => ({ ...prev, [i]: opt }))} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button 
              onClick={() => {
                if (applicationStatus !== "none") return;
                const questions = job.screening_questions || [];
                const allAnswered = questions.every((_, i) => screeningAnswers[i]);
                if (!allAnswered && questions.length > 0) {
                  setScreeningError(true);
                  return;
                }
                const answersArray = questions.map((q, i) => ({
                  question: q.question,
                  answer: screeningAnswers[i],
                }));
                handleApply(job.id, answersArray);
              }}
              style={{ width: "100%", padding: 14, background: applicationStatus === "none" ? "linear-gradient(90deg,#8D5CFA,#6C3EEB)" : (applicationStatus === "accepted" ? "#34C77B" : "#A3A3A3"), color: "white", borderRadius: 24, border: "none", fontSize: 14, fontWeight: 700, cursor: applicationStatus === "none" ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}
            >
              🚀 {applicationStatus === "accepted" ? "Accepted 🎉" : applicationStatus === "applied" ? "Application Sent" : "Apply Now"}
            </button>
            <button style={{ width: "100%", padding: 14, background: "white", color: "#6C3EEB", borderRadius: 24, border: "1px solid #6C3EEB", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>
              Delete Request
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div onClick={handleSave} style={{ background: "#FDFDFD", border: "1px solid #F0F0F0", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ color: isFavorite ? "#6C3EEB" : "#8A8A8A" }}>🔖</span> Save Project
              </div>
              <div onClick={handleShare} style={{ background: "#FDFDFD", border: "1px solid #F0F0F0", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ color: "#8A8A8A" }}>↗️</span> Share Project
              </div>
              <div style={{ background: "#FDFDFD", border: "1px solid #F0F0F0", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ color: "#8A8A8A" }}>💬</span> Contact Client
              </div>
            </div>
          </div>

          {/* About the Client Component Render */}
          {job.userId && <AboutClient clientId={job.userId} />}

          {/* AI Assistant Card */}
          <div style={{ background: "linear-gradient(135deg, #8352FF 0%, #6324FF 100%)", borderRadius: 16, padding: 24, color: "white", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, background: "rgba(255,255,255,0.1)", borderRadius: "50%" }}></div>
            <div style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontFamily: "'Sora', sans-serif" }}><span style={{ color: "#FFD700" }}>✨</span> AI Assistant</div>
            <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>Let Huzzler AI help you win this project</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "rgba(255,255,255,0.15)", padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                <span>📝</span> Write Proposal
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                <span>📁</span> Upload Portfolio
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                <span>💡</span> Proposal Tips
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                <span>🚀</span> Start Project
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// ✅ About Client Component
// ──────────────────────────────────────────────────────────
function AboutClient({ clientId }) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!clientId) return;
    getDoc(doc(db, "users", clientId)).then((snap) => {
      if (snap.exists()) {
        setClient(snap.data());
      }
    });
  }, [clientId]);

  if (!client) return null;

  const name = `${client.first_name || ""} ${client.last_name || ""}`.trim() || "Client Name";

  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #EAEAEA", padding: 24 }}>
      <div style={{ fontSize: 11, color: "#A3A3A3", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>About the Client</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#6C3EEB", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
          {name.substring(0, 2).toUpperCase()}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", fontFamily: "'Sora', sans-serif" }}>{client.companyName || name}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#FDFDFD", border: "1px solid #F0F0F0", padding: 12, borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#6C3EEB", marginBottom: 4, fontFamily: "'Sora', sans-serif" }}>{client.rating > 0 ? client.rating : "4.8"} <span style={{fontSize: 10}}>⭐</span></div>
          <div style={{ fontSize: 10, color: "#A3A3A3", fontFamily: "'DM Sans', sans-serif" }}>Client Rating</div>
        </div>
        <div style={{ background: "#FDFDFD", border: "1px solid #F0F0F0", padding: 12, borderRadius: 8, textAlign: "center" }}>
          <ClientJobCount clientId={clientId} />
          <div style={{ fontSize: 10, color: "#A3A3A3", fontFamily: "'DM Sans', sans-serif" }}>Projects Done</div>
        </div>
        <div style={{ background: "#FDFDFD", border: "1px solid #F0F0F0", padding: 12, borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4, fontFamily: "'Sora', sans-serif" }}>2022</div>
          <div style={{ fontSize: 10, color: "#A3A3A3", fontFamily: "'DM Sans', sans-serif" }}>Member Since</div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#8A8A8A", lineHeight: 1.5, margin: "0 0 24px 0", fontFamily: "'DM Sans', sans-serif" }}>
        AI-powered digital product company building next-generation creator tools and SaaS platforms. We work with passionate freelancers globally.
      </p>

      <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 16, fontFamily: "'Sora', sans-serif" }}>More Projects</div>

      {/* More Projects Cards (Mocked) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ border: "1px solid #EAEAEA", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#8378FF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>CS</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>Creativo Studio</div>
              <div style={{ fontSize: 11, color: "#A3A3A3", fontFamily: "'DM Sans', sans-serif" }}>Design Agency</div>
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 6, fontFamily: "'Sora', sans-serif" }}>Senior Product Designer</div>
          <div style={{ fontSize: 12, color: "#8A8A8A", marginBottom: 12, lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}>Join our creative team to build next-gen digital products with a...</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ background: "#FFF0F4", color: "#FF6E91", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Figma</span>
            <span style={{ background: "#E8F8F0", color: "#34C77B", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Prototyping</span>
            <span style={{ background: "#F0EFFF", color: "#8378FF", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>UX</span>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#A3A3A3", fontFamily: "'DM Sans', sans-serif" }}>2d ago</div>
        </div>

        <div style={{ border: "1px solid #EAEAEA", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#8378FF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>CS</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>AI Thumbnail Designer</div>
              <div style={{ fontSize: 11, color: "#A3A3A3", fontFamily: "'DM Sans', sans-serif" }}>Design Agency</div>
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 6, fontFamily: "'Sora', sans-serif" }}>Senior Product Designer</div>
          <div style={{ fontSize: 12, color: "#8A8A8A", marginBottom: 12, lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}>Join our creative team to build next-gen digital products with a...</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ background: "#FFF0F4", color: "#FF6E91", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Figma</span>
            <span style={{ background: "#E8F8F0", color: "#34C77B", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Prototyping</span>
            <span style={{ background: "#F0EFFF", color: "#8378FF", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>UX</span>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#A3A3A3", fontFamily: "'DM Sans', sans-serif" }}>3d ago</div>
          <button style={{ width: "100%", padding: 10, marginTop: 12, background: "#6C3EEB", color: "white", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Apply Now</button>
          <button style={{ width: "100%", padding: 10, marginTop: 8, background: "#F5F2FF", color: "#6C3EEB", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>View More</button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// ✅ Client Job Count Component
// ──────────────────────────────────────────────────────────
function ClientJobCount({ clientId }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
      const total = snap.docs.filter(
        (d) => d.data().userId === clientId
      ).length;
      setCount(total);
    });

    return () => unsub();
  }, [clientId]);

  return (
    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4, fontFamily: "'Sora', sans-serif" }}>
      {count}
    </div>
  );
}