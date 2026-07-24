// ClientHomePage.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Categories from "../assets/categories1.png";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db, auth } from "../firbase/Firebase";
import { BsBookmarkFill } from "react-icons/bs";

// ====== ASSETS ======
import browseImg1 from "../assets/Container.png";
import browseImg2 from "../assets/wave.png";
import worksImg1 from "../assets/file.png";
import worksImg2 from "../assets/yellowwave.png";
import arrow from "../assets/arrow.png";
import profile from "../assets/profile.png";
import ActionCard from "../assets/ActionCard.png";
import Job from "../assets/Job_Card.png";
import message from "../assets/message.png";
import notification from "../assets/notification.png";
import { increment } from "firebase/firestore";

// ====== ICONS ======
import {
  FiSearch,
  FiMessageCircle,
  FiBell,
  FiPlus,
  FiBookmark,
  FiEye,
  FiX,
  FiCheck,
  FiChevronLeft,
} from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";
import { Clock } from "lucide-react";

import "./clienthomecss.css";
import TopNavbar from "../components/TopNavbar";


const isMobile = window.innerWidth < 768;

// ====== CATEGORY DATA ======
const categories = [
  "Graphics & Design",
  "Programming & Tech",
  "Digital Marketing",
  "Writing & Translation",
  "Video & Animation",
  "Music & Audio",
  "AI Services",
  "Data",
  "Business",
  "Finance",
  "Photography",
  "Lifestyle",
  "Consulting",
  "Personal Growth & Hobbies",
];

function parseIntSafe(v) {
  if (v === undefined || v === null) return null;
  if (typeof v === "number") return Math.floor(v);
  const s = String(v).replace(/[^0-9]/g, "");
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}

function timeAgo(input) {
  if (!input) return "N/A";
  let d = input instanceof Timestamp ? input.toDate() : new Date(input);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function formatCurrency(amount) {
  if (!amount && amount !== 0) return "₹0";
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

// ======================================================
// MAIN
// ======================================================
export default function ClientHomeUI() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [blockedUsers, setBlockedUsers] = useState(new Set());
  const searchRef = useRef(null);

  // ================= NOTIFICATIONS ==================
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  // ================= FULL DETAIL DRAWER ==================
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUserId, setDetailUserId] = useState(null);
  const [detailJobId, setDetailJobId] = useState(null);

  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    role: "",
    profileImage: "",
    companyName: "",
  });

  const [freelancers, setFreelancers] = useState([]);
  const [loadingFreelancers, setLoadingFreelancers] = useState(true);
  const [worksJobsCount, setWorksJobsCount] = useState(0);
  const [jobs24hCount, setJobs24hCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [worksJobsList, setWorksJobsList] = useState([]);
  const [jobs24hList, setJobs24hList] = useState([]);
  const [userId, setUserId] = useState(null);

  // Listen for auth state changes to update userId
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return unsub;
  }, []);

  // Fetch freelancers/professionals
  useEffect(() => {
    const q = query(collection(db, "users"), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((u) => {
          const r = (u.role || "").toLowerCase();
          return r === "freelancer" || r === "professional";
        });
      setFreelancers(list);
      setLoadingFreelancers(false);
    });
    return () => unsub();
  }, []);

  // Fetch client jobs count and jobs lists
  useEffect(() => {
    if (!userId) {
      setWorksJobsCount(0);
      setJobs24hCount(0);
      setWorksJobsList([]);
      setJobs24hList([]);
      return;
    }

    const q1 = query(collection(db, "jobs"), where("userId", "==", userId));
    const unsub1 = onSnapshot(q1, (snap) => {
      setWorksJobsCount(snap.size);
      setWorksJobsList(snap.docs.map((d) => ({ id: d.id, ...d.data(), type: "work" })));
    });

    const q2 = query(collection(db, "jobs_24h"), where("userId", "==", userId));
    const unsub2 = onSnapshot(q2, (snap) => {
      setJobs24hCount(snap.size);
      setJobs24hList(snap.docs.map((d) => ({ id: d.id, ...d.data(), type: "24h" })));
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [userId]);

  // Fetch client in progress count
  useEffect(() => {
    if (!userId) {
      setInProgressCount(0);
      return;
    }
    const q = query(
      collection(db, "accepted_jobs"),
      where("clientId", "==", userId)
    );
    const unsub = onSnapshot(q, (snap) => {
      setInProgressCount(snap.size);
    });
    return unsub;
  }, [userId]);

  const activeJobsCount = worksJobsCount + jobs24hCount;
  const applicantsCount = notifications.length;

  const newApplicantsTodayCount = useMemo(() => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return notifications.filter((n) => {
      const ms = n.timestamp instanceof Timestamp ? n.timestamp.toDate().getTime() : new Date(n.timestamp).getTime();
      return ms > oneDayAgo;
    }).length;
  }, [notifications]);

  const latestNotifTime = useMemo(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      return timeAgo(latest.timestamp || latest.createdAt);
    }
    return "1h 20m";
  }, [notifications]);

  const topMatch = useMemo(() => {
    return freelancers.length > 0 ? freelancers[0] : null;
  }, [freelancers]);

  const clientJobs = useMemo(() => {
    return [...worksJobsList, ...jobs24hList];
  }, [worksJobsList, jobs24hList]);

  const shortlistedTalent = useMemo(() => {
    return freelancers.length > 0 ? freelancers.slice(0, 2) : [];
  }, [freelancers]);

  const recommendedFreelancers = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) {
      return freelancers.length > 2 ? freelancers.slice(2, 6) : [];
    }
    return freelancers.filter((f) => {
      const name = `${f.firstName || f.first_name || ""} ${f.lastName || f.last_name || ""}`.trim().toLowerCase();
      const role = (f.role || f.title || "").toLowerCase();
      const skills = Array.isArray(f.skills) ? f.skills.map((s) => String(s).toLowerCase()) : [];
      return name.includes(q) || role.includes(q) || skills.some((s) => s.includes(q));
    }).slice(0, 4);
  }, [freelancers, searchText]);

  function getInitials(name) {
    if (!name) return "FL";
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }

  // ─── Blocked users ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      setBlockedUsers(new Set());
      return;
    }
    const q = query(
      collection(db, "blocked_users"),
      where("blockedBy", "==", userId)
    );
    const unsubBlock = onSnapshot(q, (snap) => {
      const ids = snap.docs.map((d) => d.data().blockedUserId);
      setBlockedUsers(new Set(ids));
    });
    return unsubBlock;
  }, [userId]);

  // ─── User profile ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserInfo({
          first_name: data.first_name || data.firstName || "",
          last_name: data.last_name || data.lastName || "",
          role: data.role || "",
          profileImage: data.profileImage || "",
          companyName: data.companyName || data.Company_name || "",
        });
      }
    });
    return unsubscribe;
  }, [userId]);

  // ─── Notifications listener ──────────────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }
    const q = query(
      collection(db, "notifications"),
      where("clientUid", "==", userId)
    );
    const unsubscribeNotif = onSnapshot(q, (snap) => {
      const filtered = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((n) => n.type !== "hire_request")
        .sort((a, b) => {
          const ta = a.timestamp?.seconds ?? 0;
          const tb = b.timestamp?.seconds ?? 0;
          return tb - ta;
        });
      setNotifications(filtered);
    });
    return unsubscribeNotif;
  }, [userId]);

  const pending = notifications.filter((n) => !n.read).length;

  // ─── Accept notification → open FullDetail drawer ────────────────────────
  async function acceptNotif(item) {
    await updateDoc(doc(db, "notifications", item.id), { read: true });
    setNotifOpen(false);
    setDetailUserId(item.freelancerId);
    setDetailJobId(item.jobId || item.id);
    setDetailOpen(true);
  }

  async function declineNotif(item) {
    try {
      // Fetch freelancer info
      let freelancerName = item.freelancerName || "";
      let freelancerImage = item.freelancerImage || "";
      const freelancerId = item.freelancerId;
      const jobId = item.jobId || "";
      const jobTitle = item.jobTitle || "Job Application";

      if (!freelancerName || freelancerName === "Unknown Freelancer") {
        try {
          const uDoc = await getDoc(doc(db, "users", freelancerId));
          if (uDoc.exists()) {
            const d = uDoc.data();
            freelancerName =
              `${d.firstName || ""} ${d.lastName || ""}`.trim() ||
              "Freelancer";
            freelancerImage = d.profileImage || "";
          }
        } catch (_) { }
      }

      // Mark notification as declined
      await updateDoc(doc(db, "notifications", item.id), {
        status: "declined",
        read: true,
      });

      // Write freelancer_notifications
      await addDoc(collection(db, "freelancer_notifications"), {
        freelancerId,
        freelancerName,
        freelancerAvatar: freelancerImage,
        jobId,
        jobTitle,
        status: "declined",
        createdAt: serverTimestamp(),
        isRead: false,
      });
    } catch (e) {
      console.error("declineNotif error:", e);
    }
  }

  // ─── Mark all read ────────────────────────────────────────────────────────
  async function markAllRead() {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const q = query(
        collection(db, "notifications"),
        where("clientUid", "==", user.uid),
        where("read", "==", false)
      );
      const snap = await getDocs(q);
      const promises = snap.docs.map((d) =>
        updateDoc(doc(db, "notifications", d.id), { read: true })
      );
      await Promise.all(promises);
    } catch (e) {
      console.error("markAllRead error:", e);
    }
  }

  // ─── Job fetch ────────────────────────────────────────────────────────────
  useEffect(() => {
    const col1 = collection(db, "services");
    const col2 = collection(db, "service_24h");

    const unsub1 = onSnapshot(
      query(col1, orderBy("createdAt", "desc")),
      (snap) => {
        const data = snap.docs.map((d) => {
          const docData = d.data();
          return {
            _id: d.id,
            ...docData,
            ownerId: docData.userId || docData.ownerId || docData.uid,
            _source: "services",
          };
        });
        setJobs((prev) => mergeJobs(prev, data));
      }
    );

    const unsub2 = onSnapshot(
      query(col2, orderBy("createdAt", "desc")),
      (snap) => {
        const data = snap.docs.map((d) => {
          const docData = d.data();
          return {
            _id: d.id,
            ...docData,
            ownerId:
              docData.userId ||
              docData.uid ||
              docData.ownerId ||
              docData.createdBy,
            _source: "service_24h",
          };
        });
        setJobs((prev) => mergeJobs(prev, data));
      }
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  function mergeJobs(prev, incoming) {
    const map = new Map();
    for (const p of prev) map.set(p._id + "::" + (p._source || ""), p);
    for (const n of incoming) map.set(n._id + "::" + (n._source || ""), n);
    return Array.from(map.values());
  }

  // ─── Autocomplete ─────────────────────────────────────────────────────────
  useEffect(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return setSuggestions([]);
    const setS = new Set();
    for (const job of jobs) {
      if (job.title?.toLowerCase().includes(q)) setS.add(job.title);
      if (Array.isArray(job.skills)) {
        for (const s of job.skills) {
          if (String(s).toLowerCase().includes(q)) setS.add(s);
        }
      }
    }
    setSuggestions(Array.from(setS).slice(0, 6));
  }, [searchText, jobs]);

  // ─── Filter ───────────────────────────────────────────────────────────────
  const filteredJobs = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return jobs
      .filter((j) => {
        if (!j.ownerId) return false;
        if (blockedUsers.has(String(j.ownerId))) return false;
        const t = (j.title || "").toLowerCase();
        const d = (j.description || "").toLowerCase();
        const skills = Array.isArray(j.skills)
          ? j.skills.map((s) => String(s).toLowerCase())
          : [];
        return (
          !q || t.includes(q) || d.includes(q) || skills.some((s) => s.includes(q))
        );
      })
      .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
  }, [jobs, searchText, blockedUsers]);

  // â”€â”€â”€ Open job â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function openJob(job) {
    if (blockedUsers.has(String(job.ownerId))) {
      alert("This user is blocked");
      return;
    }
    if (!job?._id) return;
    const collectionName =
      job._source === "service_24h" ? "service_24h" : "services";
    try {
      await setDoc(
        doc(db, collectionName, job._id),
        { views: increment(1) },
        { merge: true }
      );
    } catch (err) {
      console.error("Error updating views:", err);
    }
    if (job._source === "service_24h")
      navigate(`/client-dashbroad2/service-24h/${job._id}`);
    else navigate(`/client-dashbroad2/service/${job._id}`);
  }

  function toggleSaveJob(id) {
    setSavedJobs((prev) => {
      const ns = new Set(prev);
      if (ns.has(id)) ns.delete(id);
      else ns.add(id);
      return ns;
    });
  }

  // ======================================================
  // UI
  // ======================================================
  return (
    <>
      {/* NEW DASHBOARD UI INJECTED BELOW */}
      <div
        className="client-home-wrapper"
        style={{
          marginTop: "0px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "linear-gradient(0deg, #F7F4EE, #F7F4EE), #FFFFFF",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100vh", marginTop: "20px" }}>
          <div style={{ flex: 1, padding: "8px 24px 20px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>

            <TopNavbar
              userName={userInfo.first_name || ""}
              isLoggedIn={Boolean(auth.currentUser || localStorage.getItem("userEmail") || localStorage.getItem("clientOtpUser"))}

              searchValue={searchText}
              onSearchChange={(val) => setSearchText(val)}
              profileImage={userInfo.profileImage}
              onBellClick={() => setNotifOpen(!notifOpen)}
              onMessageClick={() => navigate("/client-dashbroad2/messages")}
              onSelectCategory={(cat) => {
                navigate("/client-dashbroad2/category", { state: { category: cat } });
              }}
            />



            {/* Yellow Banner */}
            <section style={{ background: "linear-gradient(100.35deg, rgba(245, 239, 160, 1) 0%, rgba(253, 247, 208, 1) 50%, rgba(240, 232, 168, 1) 100%)", borderRadius: "20px", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1336px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: "400px", height: "400px", right: "-100px", top: "-100px", background: "rgba(240, 232, 168, 0.4)", borderRadius: "200px", zIndex: 0 }}></div>

              <div style={{ zIndex: 1 }}>
                <h2 style={{ fontSize: "28px", fontWeight: 700, margin: 0, color: "#1A1433", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px", lineHeight: "1.2" }}>Good morning, {userInfo.companyName || userInfo.first_name || "Creativo Studio"}! 👋</h2>
                <p style={{ margin: "4px 0 0 0", color: "#6B6B8A", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>You have <strong style={{ color: "#1A1433" }}>{newApplicantsTodayCount} new applicant{newApplicantsTodayCount === 1 ? "" : "s"}</strong> today</p>
              </div>

              <div style={{ display: "flex", gap: "16px", zIndex: 1 }}>
                <div style={{ background: "rgba(255, 255, 255, 0.5)", padding: "16px 24px", borderRadius: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>{activeJobsCount}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B8A", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>Active Jobs</div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.5)", padding: "16px 24px", borderRadius: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>{applicantsCount}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B8A", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>Applicants</div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.5)", padding: "16px 24px", borderRadius: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>{inProgressCount}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B8A", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>In Progress</div>
                </div>
              </div>
            </section>

            {/* Proposal Review Strip */}
            <div style={{ background: "white", border: "1px solid #EBE5F2", padding: "12px 20px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "1336px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>⏱</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A1433", fontFamily: "'DM Sans', sans-serif" }}>Proposal review pending</span>
                <span style={{ fontSize: "14px", color: "#6B6B8A", fontFamily: "'DM Sans', sans-serif" }}>{notifications.length > 0 ? `— ${notifications.length} freelancer${notifications.length === 1 ? "" : "s"} applied to your project` : "— 12 freelancers applied to your project"}</span>
              </div>
              <div style={{ background: "#F5F2FF", color: "#6C3EEB", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{notifications.length > 0 ? latestNotifTime : "1h 20m"}</div>
            </div>

            <div style={{ display: "flex", gap: "24px", width: "100%", maxWidth: "1336px", marginTop: "8px" }}>
              {/* Top Match Card */}
              <div style={{ flex: "1.5", background: "linear-gradient(108.32deg, #1C1243 0%, #2A1B54 100%)", borderRadius: "24px", padding: "32px", color: "white", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0px 8px 32px rgba(28, 18, 67, 0.15)", boxSizing: "border-box" }}>
                <div style={{ position: "absolute", width: "500px", height: "500px", right: "-150px", bottom: "-150px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "250px", zIndex: 0 }}></div>
                <div style={{ position: "absolute", width: "250px", height: "250px", right: "150px", top: "-50px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "125px", zIndex: 0 }}></div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1 }}>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#6C3EEB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
                      {topMatch ? getInitials(`${topMatch.firstName || topMatch.first_name || ""} ${topMatch.lastName || topMatch.last_name || ""}`) : "AS"}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <div style={{ background: "#F0E870", color: "#1A1433", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "4px" }}>⭐ Top Match</div>
                      </div>
                      <h3 style={{ fontSize: "22px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "white" }}>
                        {topMatch ? `${topMatch.firstName || topMatch.first_name || ""} ${topMatch.lastName || topMatch.last_name || ""}`.trim() : "Aryan Shah"}
                      </h3>
                      <div style={{ fontSize: "13px", color: "#A39DBA", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>Available now · Verified Pro</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!topMatch) return;
                      navigate("/client-dashbroad2/chat", {
                        state: {
                          currentUid: auth.currentUser?.uid,
                          otherUid: topMatch.id,
                          otherName: `${topMatch.firstName || topMatch.first_name || ""} ${topMatch.lastName || topMatch.last_name || ""}`.trim(),
                          otherImage: topMatch.profileImage || "",
                        }
                      });
                    }}
                    style={{ background: "#6C3EEB", color: "white", padding: "10px 24px", borderRadius: "50px", border: "none", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}
                  >
                    Hire Now →
                  </button>
                </div>

                <div style={{ zIndex: 1, marginTop: "24px" }}>
                  <div style={{ fontSize: "14px", color: "#EBE5F2", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>
                    {topMatch ? (topMatch.role || topMatch.title || "Senior UI/UX Designer") : "Senior UI/UX Designer"} · Remote · Contract · Immediate start
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
                      {topMatch ? (topMatch.rate ? `₹${topMatch.rate}/month` : "₹90K") : "₹90K"}
                    </div>
                    {!topMatch?.rate && <div style={{ fontSize: "14px", color: "#A39DBA", fontFamily: "'Sora', sans-serif" }}>/month</div>}
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                    {(Array.isArray(topMatch?.skills) ? topMatch.skills : ["UI Design", "Figma", "UX Research", "Prototyping"]).slice(0, 4).map((s, i) => (
                      <div key={i} style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{s}</div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px", fontSize: "13px", color: "#A39DBA", fontFamily: "'DM Sans', sans-serif" }}>
                    <span>💼 {topMatch?.completedProjects || "28"} completed projects</span>
                    <span>·</span>
                    <span>⏱ Response time ~2 hours</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "16px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1A1433", marginBottom: "4px" }}>Quick Actions</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", height: "100%" }}>
                  <div onClick={() => navigate("/client-dashbroad2/AddJobScreen")} style={{ background: "linear-gradient(106.39deg, #7C4EF5 0%, #6C3EEB 100%)", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white", cursor: "pointer", padding: "20px", boxShadow: "0px 4px 16px rgba(108, 62, 235, 0.15)" }}>
                    <FiPlus size={24} />
                    <span style={{ fontWeight: 600, fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>Post a Job</span>
                  </div>
                  <div onClick={() => navigate("/client-dashbroad2/clientcategories")} style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "#1A1433", cursor: "pointer", padding: "20px" }}>
                    <FiSearch size={24} color="#6C3EEB" />
                    <span style={{ fontWeight: 600, fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>Browse Talent</span>
                  </div>
                  <div onClick={() => navigate("/client-dashbroad2/AddJobScreen")} style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "#1A1433", cursor: "pointer", padding: "20px" }}>
                    <span style={{ fontSize: "24px" }}>📁</span>
                    <span style={{ fontWeight: 600, fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>My Projects</span>
                  </div>
                  <div style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "#1A1433", cursor: "pointer", padding: "20px" }}>
                    <span style={{ fontSize: "24px" }}>⭐</span>
                    <span style={{ fontWeight: 600, fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>Leave Review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Hiring & Shortlisted */}
            <div style={{ display: "flex", gap: "24px", width: "100%", maxWidth: "1336px", marginTop: "16px" }}>

              <div style={{ flex: "1.5", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>Continue Hiring</h3>
                  <span style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>All drafts →</span>
                </div>

                {clientJobs.length > 0 ? (
                  clientJobs.slice(0, 2).map((job) => {
                    const jobApps = notifications.filter((n) => n.jobId === job.id);
                    const totalApps = jobApps.length;
                    const newApps = jobApps.filter((n) => !n.read).length;
                    return (
                      <div key={job.id} style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "40px", height: "40px", background: "#F5F2FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📄</div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>Review Proposals — {job.title}</div>
                              <div style={{ fontSize: "13px", color: "#A39DBA", marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>
                                {totalApps} freelancer{totalApps === 1 ? "" : "s"} applied · {newApps} new · 📅 Decision pending
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 700, fontSize: "14px", color: "#6C3EEB", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>75%</div>
                            <button
                              onClick={() => {
                                if (job.type === "24h") {
                                  navigate(`/client-dashbroad2/job-full24/${job.id}`, { state: { jobData: job } });
                                } else {
                                  navigate(`/client-dashbroad2/job-full/${job.id}`, { state: { jobData: job, from: "works" } });
                                }
                              }}
                              style={{ background: "#F0E870", color: "#1A1433", padding: "8px 20px", borderRadius: "20px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                            >
                              Continue →
                            </button>
                          </div>
                        </div>
                        <div style={{ width: "100%", height: "6px", background: "#F5F2FF", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: "75%", height: "100%", background: "#6C3EEB", borderRadius: "4px" }}></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "40px", height: "40px", background: "#F5F2FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📄</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>Review Proposals — NovaSpark</div>
                            <div style={{ fontSize: "13px", color: "#A39DBA", marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>18 freelancers shortlisted · 3 new · 📅 Decision due tomorrow</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "#6C3EEB", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>75%</div>
                          <button style={{ background: "#F0E870", color: "#1A1433", padding: "8px 20px", borderRadius: "20px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Continue →</button>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: "6px", background: "#F5F2FF", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ width: "75%", height: "100%", background: "#6C3EEB", borderRadius: "4px" }}></div>
                      </div>
                    </div>

                    <div style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "40px", height: "40px", background: "#F5F8FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📝</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>Complete Project Brief</div>
                            <div style={{ fontSize: "13px", color: "#A39DBA", marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>2 required fields remaining · 🔥 Get 3+ more proposals</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "#30B47A", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>60%</div>
                          <button style={{ background: "white", color: "#1A1433", border: "1px solid #EEEDF3", padding: "8px 20px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Finish →</button>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: "6px", background: "#F5F8FF", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ width: "60%", height: "100%", background: "#30B47A", borderRadius: "4px" }}></div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>📌 Shortlisted Talent</h3>
                  <span style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Manage →</span>
                </div>
                <div style={{ display: "flex", gap: "16px", height: "100%", width: "100%" }}>
                  {shortlistedTalent.length > 0 ? (
                    shortlistedTalent.map((freelancer, idx) => {
                      const name = `${freelancer.firstName || freelancer.first_name || "Freelancer"} ${freelancer.lastName || freelancer.last_name || ""}`.trim();
                      const initials = getInitials(name);
                      const role = freelancer.role || freelancer.title || "Professional";
                      return (
                        <div key={freelancer.id} style={{ flex: 1, background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", padding: "24px 16px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "24px", background: idx === 0 ? "#6C3EEB" : "#FF6B35", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "15px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>{name}</div>
                            <div style={{ fontSize: "12px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif" }}>{role}</div>
                          </div>
                          <div style={{ color: "#F0E870", fontSize: "14px" }}>★★★★★</div>
                          <div style={{ background: "#F0E870", color: "#1A1433", padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Top Rated</div>
                          <div style={{ fontSize: "11px", color: "#30B47A", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>Fast response</div>
                          <button
                            onClick={() => {
                              navigate("/client-dashbroad2/chat", {
                                state: {
                                  currentUid: auth.currentUser?.uid,
                                  otherUid: freelancer.id,
                                  otherName: name,
                                  otherImage: freelancer.profileImage || "",
                                }
                              });
                            }}
                            style={{ marginTop: "auto", width: "100%", background: "white", border: "1px solid #EBE5F2", color: "#6C3EEB", padding: "8px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
                          >
                            Invite →
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <div style={{ flex: 1, background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", padding: "24px 16px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "24px", background: "#6C3EEB", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>AS</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "15px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>Aryan Shah</div>
                          <div style={{ fontSize: "12px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif" }}>UI/UX Designer</div>
                        </div>
                        <div style={{ color: "#F0E870", fontSize: "14px" }}>★★★★★</div>
                        <div style={{ background: "#F0E870", color: "#1A1433", padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Top Rated</div>
                        <div style={{ fontSize: "11px", color: "#30B47A", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>Fast response</div>
                        <button style={{ marginTop: "auto", width: "100%", background: "white", border: "1px solid #EBE5F2", color: "#6C3EEB", padding: "8px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Invite →</button>
                      </div>
                      <div style={{ flex: 1, background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", padding: "24px 16px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "24px", background: "#FF6B35", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>PN</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "15px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>Priya Nair</div>
                          <div style={{ fontSize: "12px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif" }}>Product Designer</div>
                        </div>
                        <div style={{ color: "#F0E870", fontSize: "14px" }}>★★★★★</div>
                        <div style={{ background: "#E8F8F0", color: "#30B47A", padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Available</div>
                        <div style={{ fontSize: "11px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>Replies in 1h</div>
                        <button style={{ marginTop: "auto", width: "100%", background: "white", border: "1px solid #EBE5F2", color: "#6C3EEB", padding: "8px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Invite →</button>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Recommended Freelancers Grid */}
            <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px", width: "100%", maxWidth: "1336px", paddingBottom: "40px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>Recommended Freelancers</h3>
                <span style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>View all →</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                {recommendedFreelancers.length > 0 ? (
                  recommendedFreelancers.map((freelancer, i) => {
                    const name = `${freelancer.firstName || freelancer.first_name || "Freelancer"} ${freelancer.lastName || freelancer.last_name || ""}`.trim();
                    const initials = getInitials(name);
                    const role = freelancer.role || freelancer.title || "Professional";
                    const rate = freelancer.rate ? (typeof freelancer.rate === 'number' ? `₹${freelancer.rate.toLocaleString()}/day` : freelancer.rate) : "₹1,500/day";
                    const skills = Array.isArray(freelancer.skills) ? freelancer.skills : ["Design", "Figma"];
                    const bgColors = ["#FF6E91", "#30B47A", "#FF6B35", "#D9A000"];
                    const avatarBg = bgColors[i % bgColors.length];
                    return (
                      <div key={freelancer.id} style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: avatarBg, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
                            {initials}
                          </div>
                          <div style={{ background: "#E8F8F0", color: "#30B47A", padding: "4px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Available</div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>{name}</div>
                          <div style={{ fontSize: "12px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>{role}</div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: "15px", color: "#6C3EEB", fontFamily: "'Sora', sans-serif" }}>{rate}</div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {skills.slice(0, 2).map((s, idx) => (
                            <div key={idx} style={{ background: "#F5F2FF", color: "#6C3EEB", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{s}</div>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif" }}>
                            <span style={{ color: "#1A1433" }}>★★★★★</span> 5.0
                          </div>
                          <div style={{ fontSize: "11px", color: "#A39DBA", fontFamily: "'DM Sans', sans-serif" }}>Replies in 2h</div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                          <button
                            onClick={() => {
                              navigate("/client-dashbroad2/chat", {
                                state: {
                                  currentUid: auth.currentUser?.uid,
                                  otherUid: freelancer.id,
                                  otherName: name,
                                  otherImage: freelancer.profileImage || "",
                                }
                              });
                            }}
                            style={{ flex: 1, background: "#6C3EEB", color: "white", padding: "10px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Hire
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  [
                    { name: "Priya Nair", role: "Product Designer", tag: "Top Rated", initials: "P", color: "#FF6E91", rate: "₹1,500/day", skills: ["Figma", "UX"], rep: "1h" },
                    { name: "Rahul Dev", role: "Mobile Designer", tag: "Available", initials: "R", color: "#30B47A", rate: "₹2,000/day", skills: ["iOS", "Android"], rep: "4h" },
                    { name: "Maya Rajan", role: "Product Designer", tag: "Top Rated", initials: "MR", color: "#FF6B35", rate: "₹1,200/day", skills: ["Prototyping", "UI Design"], rep: "2h" },
                    { name: "Sandhya Kumar", role: "UX Researcher", tag: "Available", initials: "SK", color: "#D9A000", rate: "₹950/day", skills: ["UX Research"], rep: "3h" }
                  ].map((freelancer, i) => (
                    <div key={i} style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: freelancer.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>{freelancer.initials}</div>
                        {freelancer.tag === "Top Rated" ?
                          <div style={{ background: "#FDFCEB", border: "1px solid #F0E870", color: "#D9A000", padding: "4px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>🏆 Top Rated</div> :
                          <div style={{ background: "#E8F8F0", color: "#30B47A", padding: "4px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Available</div>
                        }
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>{freelancer.name}</div>
                        <div style={{ fontSize: "12px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>{freelancer.role}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "15px", color: "#6C3EEB", fontFamily: "'Sora', sans-serif" }}>{freelancer.rate}</div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {freelancer.skills.map((s, idx) => (
                          <div key={idx} style={{ background: "#F5F2FF", color: "#6C3EEB", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{s}</div>
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif" }}>
                          <span style={{ color: "#1A1433" }}>★★★★★</span> 5.0
                        </div>
                        <div style={{ fontSize: "11px", color: "#A39DBA", fontFamily: "'DM Sans', sans-serif" }}>Replies in {freelancer.rep}</div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                        <button style={{ flex: 1, background: "#6C3EEB", color: "white", padding: "10px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Hire</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Top Talent This Week & Trending Skills */}
            <div style={{ display: "flex", gap: "24px", width: "100%", maxWidth: "1336px", marginTop: "24px", paddingBottom: "40px" }}>
              {/* Left Column: Top Talent This Week */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>Top Talent This Week</h3>
                  <span style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>See all →</span>
                </div>

                <div style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", display: "flex", flexDirection: "column" }}>
                  {/* Row 1 */}
                  <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EEEDF3" }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "24px", background: "#6C3EEB", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
                        {topMatch ? getInitials(`${topMatch.firstName || topMatch.first_name || ""} ${topMatch.lastName || topMatch.last_name || ""}`) : "AS"}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ fontWeight: 700, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>
                            {topMatch ? `${topMatch.firstName || topMatch.first_name || ""} ${topMatch.lastName || topMatch.last_name || ""}`.trim() : "Aryan Shah"}
                          </div>
                          <div style={{ background: "#FDFCEB", color: "#D9A000", padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>#1 This Week</div>
                        </div>
                        <div style={{ fontSize: "13px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>
                          {topMatch ? (topMatch.role || topMatch.title || "Senior UI/UX Designer") : "Senior UI/UX Designer"}
                        </div>
                        <div style={{ fontSize: "13px", color: "#1A1433", fontFamily: "'DM Sans', sans-serif", marginTop: "4px", fontWeight: 600 }}>
                          {topMatch ? (topMatch.rate ? `₹${topMatch.rate}/mo` : "₹90K/mo") : "₹90K/mo"}
                          <span style={{ color: "#8C84A8", fontWeight: 400 }}> · Remote · Full-time</span>
                        </div>
                        <div style={{ display: "flex", gap: "2px", marginTop: "6px" }}>
                          <span style={{ color: "#F0E870", fontSize: "12px" }}>★</span>
                          <span style={{ color: "#F0E870", fontSize: "12px" }}>★</span>
                          <span style={{ color: "#F0E870", fontSize: "12px" }}>★</span>
                          <span style={{ color: "#F0E870", fontSize: "12px" }}>★</span>
                          <span style={{ color: "#F0E870", fontSize: "12px" }}>★</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!topMatch) return;
                        navigate("/client-dashbroad2/chat", {
                          state: {
                            currentUid: auth.currentUser?.uid,
                            otherUid: topMatch.id,
                            otherName: `${topMatch.firstName || topMatch.first_name || ""} ${topMatch.lastName || topMatch.last_name || ""}`.trim(),
                            otherImage: topMatch.profileImage || "",
                          }
                        });
                      }}
                      style={{ background: "white", color: "#1A1433", border: "1px solid #EEEDF3", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      View →
                    </button>
                  </div>

                  {/* Row 2 */}
                  <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "24px", background: "#FF6E91", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
                        KM
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ fontWeight: 700, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>Karan Modi</div>
                          <div style={{ background: "#F5F2FF", color: "#6C3EEB", padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>#2 This Week</div>
                        </div>
                        <div style={{ fontSize: "13px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>Motion & 3D Designer</div>
                        <div style={{ fontSize: "13px", color: "#1A1433", fontFamily: "'DM Sans', sans-serif", marginTop: "4px", fontWeight: 600 }}>₹75K<span style={{ color: "#8C84A8", fontWeight: 400 }}>/mo · Hybrid · Contract</span></div>
                        <div style={{ display: "flex", gap: "2px", marginTop: "6px" }}>
                          <span style={{ color: "#F0E870", fontSize: "12px" }}>★</span>
                          <span style={{ color: "#F0E870", fontSize: "12px" }}>★</span>
                          <span style={{ color: "#F0E870", fontSize: "12px" }}>★</span>
                          <span style={{ color: "#F0E870", fontSize: "12px" }}>★</span>
                          <span style={{ color: "#EEEDF3", fontSize: "12px" }}>★</span>
                        </div>
                      </div>
                    </div>
                    <button style={{ background: "#6C3EEB", color: "white", border: "none", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Hire →</button>
                  </div>
                </div>
              </div>

              {/* Right Column: Trending Skills */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>Trending Skills</h3>
                  <span style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Explore →</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
                  {/* Purple Banner */}
                  <div style={{ background: "linear-gradient(106.39deg, #8B65F8 0%, #7C4EF5 100%)", borderRadius: "16px", padding: "24px", color: "white", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>UI/UX Design</div>
                      <div style={{ fontSize: "13px", opacity: 0.9, fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>Highest demand across Huzzler</div>
                    </div>

                    <div style={{ display: "flex", gap: "32px", marginTop: "24px" }}>
                      <div>
                        <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>+34%</div>
                        <div style={{ fontSize: "11px", opacity: 0.8, fontFamily: "'DM Sans', sans-serif" }}>Growing fast</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>1.2K</div>
                        <div style={{ fontSize: "11px", opacity: 0.8, fontFamily: "'DM Sans', sans-serif" }}>Freelancers</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>₹90K</div>
                        <div style={{ fontSize: "11px", opacity: 0.8, fontFamily: "'DM Sans', sans-serif" }}>Avg Rates</div>
                      </div>
                    </div>
                  </div>

                  {/* 3 small cards */}
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1, background: "white", border: "1px solid #EEEDF3", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ fontSize: "16px" }}>🎨</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>AI Design</div>
                        <div style={{ fontSize: "11px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif" }}>96 freelancers</div>
                      </div>
                      <div style={{ color: "#30B47A", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>+32% ⬆</div>
                    </div>

                    <div style={{ flex: 1, background: "white", border: "1px solid #EEEDF3", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ fontSize: "16px" }}>💻</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>Frontend</div>
                        <div style={{ fontSize: "11px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif" }}>300 freelancers</div>
                      </div>
                      <div style={{ color: "#30B47A", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>+26% ⬆</div>
                    </div>

                    <div style={{ flex: 1, background: "white", border: "1px solid #EEEDF3", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ fontSize: "16px" }}>🎬</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>Motion</div>
                        <div style={{ fontSize: "11px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif" }}>420 freelancers</div>
                      </div>
                      <div style={{ color: "#30B47A", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>+18% ⬆</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Active Section */}
            <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px", width: "100%", maxWidth: "1336px", paddingBottom: "60px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#30B47A" }}></div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>Recently Active</h3>
                </div>
                <span style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>View all →</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {freelancers.slice(0, 3).map((freelancer, index) => {
                  const initials = `${freelancer.firstName || freelancer.first_name || ""}${freelancer.lastName || freelancer.last_name || ""}`.substring(0, 1).toUpperCase() || "F";
                  const fullName = `${freelancer.firstName || freelancer.first_name || ""} ${freelancer.lastName || freelancer.last_name || ""}`.trim() || "Freelancer";
                  const title = freelancer.role || freelancer.title || "Professional";
                  const location = freelancer.location || freelancer.city || "Remote";
                  const desc = freelancer.bio || freelancer.about || freelancer.description || "Experienced professional ready to work on your next big project.";
                  const skills = Array.isArray(freelancer.skills) ? freelancer.skills.slice(0, 4) : [];
                  const rate = freelancer.rate ? `₹${freelancer.rate}` : "₹1,000–₹1,500";

                  // Colors for avatar
                  const avatarColors = ["#7C4EF5", "#4A90E2", "#FF8A00"];
                  const bgColor = avatarColors[index % avatarColors.length];

                  // Badges logic
                  let badges = null;
                  if (index === 0) {
                    badges = (
                      <>
                        <div style={{ background: "#FDFCEB", color: "#D9A000", padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "4px" }}>⭐ 97% Match</div>
                        <div style={{ background: "#E8F8F0", color: "#30B47A", padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>New</div>
                      </>
                    );
                  } else if (index === 1) {
                    badges = (
                      <div style={{ background: "#FFF3E5", color: "#FF8A00", padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "4px" }}>🔥 Hot</div>
                    );
                  }

                  // Skill tag colors
                  const skillColors = [
                    { bg: "#F5F2FF", color: "#6C3EEB" },
                    { bg: "#EBF3FF", color: "#4A90E2" },
                    { bg: "#FFEBF0", color: "#FF6E91" },
                    { bg: "#FFF3E5", color: "#FF8A00" },
                  ];

                  return (
                    <div key={freelancer.id || index} style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: "16px" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "24px", background: bgColor, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "18px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>{title}</div>
                            <div style={{ fontSize: "13px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>{fullName} · {location} · Full-time</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {badges}
                        </div>
                      </div>

                      <div style={{ fontSize: "14px", color: "#6B6B8A", fontFamily: "'DM Sans', sans-serif", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {desc}
                      </div>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {skills.map((skill, sIdx) => {
                          const sc = skillColors[sIdx % skillColors.length];
                          return (
                            <div key={sIdx} style={{ background: sc.bg, color: sc.color, padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                              {skill}
                            </div>
                          );
                        })}
                        {skills.length === 0 && (
                          <div style={{ background: "#F5F2FF", color: "#6C3EEB", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                            Design Systems
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>
                          {rate}<span style={{ fontSize: "13px", color: "#8C84A8", fontWeight: 400, fontFamily: "'DM Sans', sans-serif" }}>/day</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <button style={{ background: "white", color: "#1A1433", border: "1px solid #EEEDF3", padding: "8px 20px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "6px" }}>
                            📌 Save
                          </button>
                          <button
                            onClick={() => {
                              navigate("/client-dashbroad2/chat", {
                                state: {
                                  currentUid: auth.currentUser?.uid,
                                  otherUid: freelancer.id,
                                  otherName: fullName,
                                  otherImage: freelancer.profileImage || "",
                                }
                              });
                            }}
                            style={{ background: "#6C3EEB", color: "white", border: "none", padding: "8px 24px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                            Hire →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(!freelancers || freelancers.length === 0) && (
                  <div style={{ textAlign: "center", padding: "40px", color: "#8C84A8" }}>
                    No recently active freelancers found.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ================= NOTIFICATION POPUP ================= */}
      {notifOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setNotifOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 9998 }}
          />

          {/* Panel */}
          <div
            style={{
              position: "fixed",
              top: 100,
              right: isMobile ? 10 : 170,
              width: isMobile ? "calc(100vw - 20px)" : 420,
              maxHeight: "75vh",
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              border: "1px solid #ccc2c2",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #eee",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiBell />
                Notifications ({notifications.length})
              </div>
              <button
                onClick={markAllRead}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 12,
                  color: "#888",
                  cursor: "pointer",
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                Mark all read
              </button>
            </div>

            {/* Scroll Area */}
            <div style={{ overflowY: "auto" }}>
              {notifications.length === 0 && (
                <div
                  style={{ padding: 30, textAlign: "center", color: "#777" }}
                >
                  No notifications
                </div>
              )}

              {notifications.map((item) => (
                <NotificationTile
                  key={item.id}
                  item={item}
                  onAccept={acceptNotif}
                  onDecline={declineNotif}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ================= FULL DETAIL DRAWER ================= */}
      {detailOpen && (
        <FullDetailDrawer
          userId={detailUserId}
          jobId={detailJobId}
          onClose={() => {
            setDetailOpen(false);
            setDetailUserId(null);
            setDetailJobId(null);
          }}
          onChatOpen={(freelancerId, name, image) => {
            setDetailOpen(false);
            navigate("/client-dashbroad2/chat", {
              state: {
                currentUid: auth.currentUser?.uid,
                otherUid: freelancerId,
                otherName: name,
                otherImage: image,
              },
            });
          }}
        />
      )}

      <style>{`
/* ================= CATEGORY SCROLL ================= */
:root { --search-height: 42px; }

.category-scroll-wrapper {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 14px 6px;
  scrollbar-width: none;
}
.category-scroll-wrapper::-webkit-scrollbar { display: none; }
@media (min-width: 1024px) {
  .category-scroll-wrapper { scrollbar-width: auto; }
  .category-scroll-wrapper::-webkit-scrollbar { display: block; height: 8px; }
  .category-scroll-wrapper::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
  .category-scroll-wrapper::-webkit-scrollbar-track { background: transparent; }
}

.category-card-img {
  position: relative;
  flex: 0 0 auto;
  min-width: 212px;
  height: 136px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: none !important;
}
.category-bg-img { width: 100%; height: 100%; object-fit: cover; }
.category-card-img::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,);
}
.category-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  color: #fff;
}
.category-star { font-size: 16px; opacity: 0.9; }
.category-title { font-size: 14px; font-weight: 600; line-height: 1.2; }

@media (max-width: 768px) {
  .category-card-img { min-width: 160px; height: 85px; }
  .category-title { font-size: 13px; }
}

.job-card { position: relative; }
.badge-24 {
  position: absolute;
  top: 1px;
  right: 110px;
  background: #FFDADA;
  color: #E7000B;
  padding: 4px 10px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(229,57,53,0.4);
  z-index: 5;
  font-family: Rubik;
  font-weight: 400;
  font-size: 15px;
  line-height: 140%;
}

.fh-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}
.icon-btn {
  width: 42px; height: 42px;
  border-radius: 50%; border: none;
  background: #f3f3f3;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; position: relative; font-size: 20px;
}
.icon-btn:hover { background: #e5e5e5; }
.notif-btn { position: relative; }
.notif-dot {
  width: 8px; height: 8px;
  background: red; border-radius: 50%;
  position: absolute; top: 8px; right: 8px;
}
.fh-avatar { width: 42px; height: 42px; border-radius: 50%; overflow: hidden; cursor: pointer; }
.fh-avatar img { width: 100%; height: 100%; object-fit: cover; }

.fh-search-row { width: 100%; display: flex; justify-content: center; margin-top: 0px; }
.fh-search {
  width: 420px;
  height: var(--search-height);
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f3f3f3;
  padding: 0 14px;
  border-radius: 999px;
}
.search-icon { font-size: 18px; color: #555; flex-shrink: 0; margin-top: -0px; }
.search-input {
  flex: 1; height: 100%; border: none; outline: none;
  font-size: 15px; line-height: normal;
  padding: 0; width: 100%; margin-top: 14px;
}
.clear-btn { background: none; border: none; cursor: pointer; font-size: 14px; }

@media (max-width: 768px) {
  .fh-search { width: 100%; height: var(--search-height); }
  .search-icon { font-size: 16px; margin-top: -4px; }
  .search-input { font-size: 14px; height: 15px; }
  .clear-btn { font-size: 12px; }
}

@media (min-width: 1024px) {
  .fh-container { margin-top: 20px; margin-left: 20px; }
}

.save-btn {
  background: none; border: none; cursor: pointer;
  font-size: 20px; color: #666;
  transition: color 0.3s ease, transform 0.2s ease;
}
.save-btn.saved { color: #000; }

.job-card {
  background: var(--card-bg);
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(0,0,0,0.03);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  cursor: pointer;
  max-width: 100%; width: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
}
.job-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(2,6,23,0.08); }
.job-card-top { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
.job-title { margin: 0; font-size: 18px; font-weight: 400; margin-bottom: 10px; }
.job-sub { font-size: 13px; color: var(--muted); margin-top: 4px; }
.job-skills { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.skill-chip {
  background: rgba(255,240,133,0.7);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #000;
  font-weight: 400;
  border: 1px solid rgba(124,58,237,0.07);
}
.job-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.fh-search-row { position: relative; }
.autocomplete-list {
  position: absolute;
  top: calc(var(--search-height) + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  z-index: 999;
  overflow: hidden;
}
.autocomplete-item {
  padding: 12px 16px; font-size: 14px; cursor: pointer;
  border-bottom: 1px solid #eee;
}
.autocomplete-item:last-child { border-bottom: none; }
.autocomplete-item:hover { background: #f5f5f5; }

@media (max-width: 768px) {
  .autocomplete-list { width: 100%; left: 0; transform: none; }
}
        `}</style>
    </>
  );
}

// ======================================================
// NOTIFICATION TILE COMPONENT
// ======================================================
function NotificationTile({ item, onAccept, onDecline }) {
  const navigate = useNavigate();
  const [freelancerName, setFreelancerName] = useState(
    item.freelancerName || ""
  );
  const [jobTitle, setJobTitle] = useState(item.jobTitle || "Job Application");
  const [declining, setDeclining] = useState(false);

  useEffect(() => {
    // Fetch live freelancer name
    if (!item.freelancerId) return;
    getDoc(doc(db, "users", item.freelancerId))
      .then((snap) => {
        if (snap.exists()) {
          const d = snap.data();
          const name =
            `${d.firstName || ""} ${d.lastName || ""}`.trim() ||
            item.freelancerName ||
            "Freelancer";
          setFreelancerName(name);
        }
      })
      .catch(() => { });
  }, [item.freelancerId]);

  useEffect(() => {
    // Fetch live job title
    if (!item.jobId) return;
    (async () => {
      try {
        const jDoc = await getDoc(doc(db, "jobs", item.jobId));
        if (jDoc.exists() && jDoc.data().title) {
          setJobTitle(jDoc.data().title);
          return;
        }
        const j24Doc = await getDoc(doc(db, "jobs_24h", item.jobId));
        if (j24Doc.exists() && j24Doc.data().title) {
          setJobTitle(j24Doc.data().title);
        }
      } catch (_) { }
    })();
  }, [item.jobId]);

  const isDeclined = item.status === "declined";
  const isAccepted = item.status === "accepted";
  const isPending = !isDeclined && !isAccepted && item.type === "application";

  async function handleDecline() {
    if (declining) return;
    const confirmed = window.confirm(
      `Are you sure you want to decline this application from ${freelancerName}?`
    );
    if (!confirmed) return;
    setDeclining(true);
    await onDecline(item);
    setDeclining(false);
  }

  return (
    <div
      onClick={() => {
        if (!isDeclined) {
          navigate(`/client-dashbroad2/clientnotificationdetails/${item.freelancerId}/${item.jobId}`)
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        padding: 16,
        borderBottom: "1px solid #f2f2f2",
        gap: 14,
        background: item.read ? "#fff" : "#FFF9E6",
        cursor: isDeclined ? "default" : "pointer",
        transition: "background 0.3s",
      }}
    >
      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={
            item.freelancerImage ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt=""
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        {!item.read && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 10,
              height: 10,
              background: "#FFCC00",
              borderRadius: "50%",
              border: "2px solid #fff",
            }}
          />
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: 15,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {freelancerName}
          </span>
          <span style={{ fontSize: 11, color: "#aaa", whiteSpace: "nowrap" }}>
            {timeAgo(item.timestamp)}
          </span>
        </div>
        <div
          style={{
            fontSize: 13,
            color: isDeclined ? "#bbb" : "#666",
            marginTop: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Applied for {jobTitle}
        </div>

        {/* Status widget */}
        {item.type === "application" && (
          <div style={{ marginTop: 10 }}>
            {isAccepted && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#16a34a", fontSize: 14 }}>✓</span>
                <span
                  style={{ color: "#16a34a", fontWeight: 600, fontSize: 13 }}
                >
                  Accepted
                </span>
              </div>
            )}
            {isDeclined && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#ef4444", fontSize: 14 }}>✕</span>
                <span
                  style={{ color: "#ef4444", fontWeight: 600, fontSize: 13 }}
                >
                  Declined
                </span>
              </div>
            )}
            {isPending && (
              <div
                style={{ display: "flex", gap: 10 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onAccept(item)}
                  style={{
                    padding: "6px 18px",
                    borderRadius: 20,
                    border: "none",
                    background: "#FDFD96",
                    color: "#000",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "Rubik, sans-serif",
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={handleDecline}
                  disabled={declining}
                  style={{
                    padding: "6px 18px",
                    borderRadius: 20,
                    border: "1.2px solid #fca5a5",
                    background: "#fff",
                    color: "#ef4444",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: declining ? "not-allowed" : "pointer",
                    fontFamily: "Rubik, sans-serif",
                  }}
                >
                  {declining ? "..." : "Decline"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Already read accepted → show Chat button */}
        {item.read && isAccepted && (
          <div
            style={{ marginTop: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "none",
                background: "#9050FF",
                color: "#fff",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "Rubik, sans-serif",
              }}
            >
              Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ======================================================
// FULL DETAIL DRAWER COMPONENT  (mirrors fullDetial.dart)
// ======================================================
function FullDetailDrawer({ userId, jobId, onClose, onChatOpen }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [services24h, setServices24h] = useState([]);
  const [activeTab, setActiveTab] = useState("work");
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Fetch user profile
    const unsubUser = onSnapshot(
      doc(db, "users", userId),
      (snap) => {
        if (snap.exists()) setUserData(snap.data());
        setLoading(false);
      },
      () => setLoading(false)
    );

    // Fetch portfolio
    const unsubPortfolio = onSnapshot(
      collection(db, "users", userId, "portfolio"),
      (snap) => setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    // Fetch services
    const unsubServices = onSnapshot(
      query(
        collection(db, "users", userId, "services"),
        orderBy("createdAt", "desc")
      ),
      (snap) =>
        setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => { }
    );

    // Fetch 24h services
    const unsubServices24 = onSnapshot(
      query(
        collection(db, "users", userId, "services_24h"),
        orderBy("createdAt", "desc")
      ),
      (snap) =>
        setServices24h(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => { }
    );

    // Check if already accepted
    (async () => {
      if (!jobId || !userId) return;
      try {
        const q = query(
          collection(db, "notifications"),
          where("jobId", "==", jobId),
          where("freelancerId", "==", userId),
          where("status", "==", "accepted"),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) setIsAccepted(true);
      } catch (_) { }
    })();

    return () => {
      unsubUser();
      unsubPortfolio();
      unsubServices();
      unsubServices24();
    };
  }, [userId, jobId]);

  async function fetchJobTitle(jId) {
    if (!jId) return "Job Application";
    try {
      const jDoc = await getDoc(doc(db, "jobs", jId));
      if (jDoc.exists() && jDoc.data().title) return jDoc.data().title;
      const j24 = await getDoc(doc(db, "jobs_24h", jId));
      if (j24.exists() && j24.data().title) return j24.data().title;
    } catch (_) { }
    return "Job Application";
  }

  async function handleAccept() {
    if (accepting || !jobId || !userId) return;
    setAccepting(true);
    try {
      // Find the notification doc
      const q = query(
        collection(db, "notifications"),
        where("jobId", "==", jobId),
        where("freelancerId", "==", userId),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        alert("No matching application found.");
        setAccepting(false);
        return;
      }
      const docRef = snap.docs[0].reference;

      // Mark accepted
      await updateDoc(docRef, { status: "accepted", read: true });

      // Fetch freelancer profile
      const uDoc = await getDoc(doc(db, "users", userId));
      const fd = uDoc.data() || {};
      const freelancerName =
        `${fd.firstName || ""} ${fd.lastName || ""}`.trim();
      const freelancerImage = fd.profileImage || "";

      // Fetch real job title
      const jobTitle = await fetchJobTitle(jobId);

      // Create accepted_jobs record
      await addDoc(collection(db, "accepted_jobs"), {
        jobId,
        freelancerId: userId,
        freelancerName,
        freelancerImage,
        acceptedAt: serverTimestamp(),
        status: "accepted",
        clientId: auth.currentUser?.uid,
      });

      // Write freelancer_notifications
      await addDoc(collection(db, "freelancer_notifications"), {
        freelancerId: userId,
        freelancerName,
        freelancerAvatar: freelancerImage,
        jobId,
        jobTitle,
        status: "accepted",
        createdAt: serverTimestamp(),
        isRead: false,
      });

      setIsAccepted(true);
    } catch (e) {
      console.error("handleAccept error:", e);
      alert("Error accepting application.");
    }
    setAccepting(false);
  }

  async function handleDecline() {
    const confirmed = window.confirm(
      "Are you sure you want to decline this application?"
    );
    if (!confirmed) return;

    setDeclining(true);
    try {
      if (!jobId || !userId) return;

      const q = query(
        collection(db, "notifications"),
        where("jobId", "==", jobId),
        where("freelancerId", "==", userId)
      );
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await updateDoc(doc(db, "notifications", d.id), {
          status: "declined",
          read: true,
        });
      }

      const uDoc = await getDoc(doc(db, "users", userId));
      const fd = uDoc.data() || {};
      const freelancerName =
        `${fd.first_name || fd.firstName || fd.name || ""} ${fd.last_name || fd.lastName || ""}`.trim() || "Freelancer";
      const freelancerImage = fd.profileImage || "";
      const jobTitle = await fetchJobTitle(jobId);

      await addDoc(collection(db, "freelancer_notifications"), {
        freelancerId: userId,
        freelancerName,
        freelancerAvatar: freelancerImage,
        jobId,
        jobTitle,
        status: "declined",
        createdAt: serverTimestamp(),
        isRead: false,
      });

      onClose();
    } catch (e) {
      console.error("handleDecline error:", e);
      alert("Error declining application.");
    }
    setDeclining(false);
  }

  async function openChat() {
    if (!userData || !userId) return;
    const name =
      `${userData.first_name || userData.firstName || userData.name || ""} ${userData.last_name || userData.lastName || ""}`.trim() ||
      "Freelancer";
    const image = userData.profileImage || "";
    onChatOpen(userId, name, image);
  }

  if (loading) {
    return (
      <DrawerOverlay onClose={onClose}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div className="fd-spinner" />
        </div>
      </DrawerOverlay>
    );
  }

  if (!userData) {
    return (
      <DrawerOverlay onClose={onClose}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 48 }}>⚠️</span>
          <p style={{ color: "#666" }}>User profile not found.</p>
          <button onClick={onClose} className="fd-btn-yellow">
            Go Back
          </button>
        </div>
      </DrawerOverlay>
    );
  }

  const firstName = userData?.first_name || userData?.firstName || userData?.name || "";
  const lastName = userData?.last_name || userData?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "User";
  const about = userData.about || "";
  const profileImage = userData.profileImage || "";
  const coverImage = userData.coverImage || "";
  const skills = extractList(userData.skills);
  const tools = extractList(userData.tools);
  const links = userData.links || {};

  return (
    <DrawerOverlay onClose={onClose}>
      <div className="fd-scroll">
        {/* ── COVER + PROFILE ── */}
        <div className="fd-cover-wrap">
          <div
            className="fd-cover"
            style={{
              background: coverImage
                ? `url(${coverImage}) center/cover`
                : "linear-gradient(135deg,#e0e7ff,#fef9c3)",
            }}
          >
            <button className="fd-back-btn" onClick={onClose}>
              <FiChevronLeft size={20} />
            </button>
          </div>

          <div className="fd-avatar-row">
            <div className="fd-avatar-wrap">
              {profileImage ? (
                <img src={profileImage} alt={fullName} className="fd-avatar-img" />
              ) : (
                <div className="fd-avatar-placeholder">
                  <span style={{ fontSize: 40, color: "#aaa" }}>👤</span>
                </div>
              )}
              <div className="fd-badge">Freelancer</div>
            </div>
          </div>
        </div>

        {/* ── NAME ── */}
        <div className="fd-name-section">
          <h2 className="fd-fullname">{fullName}</h2>

          {/* ── ACTION BUTTONS ── */}
          <div className="fd-action-row">
            {isAccepted ? (
              <button className="fd-btn-yellow fd-btn-full" onClick={openChat}>
                💬 Message
              </button>
            ) : (
              <>
                <button
                  className="fd-btn-yellow"
                  onClick={handleAccept}
                  disabled={accepting}
                  style={{ flex: 1 }}
                >
                  {accepting ? "Accepting..." : "Accept"}
                </button>
                <button
                  className="fd-btn-outline"
                  onClick={handleDecline}
                  disabled={declining}
                  style={{ flex: 1 }}
                >
                  {declining ? "Declining..." : "Decline"}
                </button>
              </>
            )}
          </div>

          {/* Links */}
          {Object.keys(links).length > 0 && (
            <div className="fd-links-row">
              {Object.entries(links)
                .filter(([, v]) => typeof v === "string" && v.trim())
                .map(([k, v]) => (
                  <a
                    key={k}
                    href={v.startsWith("http") ? v : `https://${v}`}
                    target="_blank"
                    rel="noreferrer"
                    className="fd-link"
                  >
                    {capitalize(k)}
                  </a>
                ))}
            </div>
          )}
        </div>

        {/* ── ABOUT ── */}
        <div className="fd-section">
          <h3 className="fd-section-title">About</h3>
          <p className="fd-about-text">
            {about || "No about info provided."}
          </p>
          {(skills.length > 0 || tools.length > 0) && (
            <>
              <h3 className="fd-section-title" style={{ marginTop: 20 }}>
                Skills & Tools
              </h3>
              <div className="fd-chips-wrap">
                {[...skills, ...tools].map((s, i) => (
                  <span key={i} className={`fd-chip fd-chip-${i % 14}`}>
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── PORTFOLIO ── */}
        <div className="fd-section">
          <h3 className="fd-section-title">Portfolio</h3>
          {portfolio.length === 0 ? (
            <p className="fd-muted">No portfolio items yet.</p>
          ) : (
            <div className="fd-portfolio-scroll">
              {portfolio.map((p) => (
                <PortfolioCard key={p.id} item={p} />
              ))}
            </div>
          )}
        </div>

        {/* ── SERVICES TABS ── */}
        <div className="fd-section fd-section-services">
          <div className="fd-tabs">
            <button
              className={`fd-tab ${activeTab === "work" ? "fd-tab-active" : ""}`}
              onClick={() => setActiveTab("work")}
            >
              Work
            </button>
            <button
              className={`fd-tab ${activeTab === "24h" ? "fd-tab-active" : ""}`}
              onClick={() => setActiveTab("24h")}
            >
              24 Hour
            </button>
          </div>

          <div className="fd-services-list">
            {(activeTab === "work" ? services : services24h).length === 0 ? (
              <div className="fd-empty-state">
                <span style={{ fontSize: 48 }}>💼</span>
                <p className="fd-muted">No services added yet.</p>
              </div>
            ) : (
              (activeTab === "work" ? services : services24h).map((svc) => (
                <ServiceCard key={svc.id} service={svc} />
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
/* ── DRAWER STYLES ── */
.fd-spinner {
  width: 40px; height: 40px;
  border: 3px solid #eee;
  border-top-color: #9050FF;
  border-radius: 50%;
  animation: fd-spin 0.8s linear infinite;
}
@keyframes fd-spin { to { transform: rotate(360deg); } }

.fd-scroll {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  background: #f9f9f9;
}
.fd-scroll::-webkit-scrollbar { width: 6px; }
.fd-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }

.fd-cover-wrap { position: relative; }
.fd-cover {
  height: 200px;
  width: 100%;
  background: linear-gradient(135deg, #e0e7ff, #fef9c3);
}
.fd-back-btn {
  position: absolute;
  top: 16px; left: 16px;
  width: 36px; height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.35);
  color: #fff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.fd-avatar-row {
  display: flex;
  justify-content: center;
  margin-top: -55px;
}
.fd-avatar-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fd-avatar-img {
  width: 110px; height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}
.fd-avatar-placeholder {
  width: 110px; height: 110px;
  border-radius: 50%;
  background: #eee;
  border: 5px solid #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
}
.fd-badge {
  margin-top: -14px;
  padding: 4px 16px;
  background: linear-gradient(90deg, #0047FF, #00E5FF);
  color: #fff;
  border-radius: 24px;
  font-size: 12px;
  font-family: Rubik, sans-serif;
  border: 3px solid #fff;
  white-space: nowrap;
}

.fd-name-section {
  background: #fff;
  padding: 20px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border-bottom: 8px solid #f3f3f3;
}
.fd-fullname {
  font-size: 22px;
  font-weight: 500;
  font-family: Rubik, sans-serif;
  color: #111;
  margin: 0;
  text-align: center;
}

.fd-action-row {
  display: flex;
  gap: 14px;
  width: 100%;
  max-width: 400px;
}
.fd-btn-yellow {
  padding: 13px 24px;
  border-radius: 30px;
  border: none;
  background: #FDFD96;
  color: #111;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  font-family: Rubik, sans-serif;
  transition: opacity 0.2s;
}
.fd-btn-yellow:hover { opacity: 0.85; }
.fd-btn-yellow:disabled { opacity: 0.5; cursor: not-allowed; }
.fd-btn-yellow.fd-btn-full { width: 100%; }
.fd-btn-outline {
  padding: 13px 24px;
  border-radius: 30px;
  border: 1.5px solid #111;
  background: #fff;
  color: #111;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  font-family: Rubik, sans-serif;
  transition: opacity 0.2s;
}
.fd-btn-outline:hover { background: #f5f5f5; }
.fd-btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }

.fd-links-row { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
.fd-link {
  font-size: 15px;
  font-weight: 500;
  color: #2563eb;
  text-decoration: underline;
  font-family: Rubik, sans-serif;
}

.fd-section {
  background: #fff;
  margin-top: 8px;
  padding: 20px;
}
.fd-section-services { padding-bottom: 40px; }
.fd-section-title {
  font-size: 18px;
  font-weight: 500;
  color: #111;
  margin: 0 0 12px;
  font-family: Rubik, sans-serif;
}
.fd-about-text {
  font-size: 14px;
  line-height: 1.65;
  color: #222;
  font-family: Rubik, sans-serif;
  margin: 0;
}
.fd-muted { font-size: 14px; color: #888; font-family: Rubik, sans-serif; margin: 0; }

.fd-chips-wrap { display: flex; flex-wrap: wrap; gap: 10px; }
.fd-chip {
  padding: 8px 14px;
  border-radius: 24px;
  font-size: 13px;
  font-family: Rubik, sans-serif;
  color: #222;
}
.fd-chip-0  { background: #FFD6C9; }
.fd-chip-1  { background: #D7F5FF; }
.fd-chip-2  { background: #EAD9FF; }
.fd-chip-3  { background: #D9FFE3; }
.fd-chip-4  { background: #E3F0FF; }
.fd-chip-5  { background: #FFD9E0; }
.fd-chip-6  { background: #FFF3C4; }
.fd-chip-7  { background: #E8F5E9; }
.fd-chip-8  { background: #F3E5F5; }
.fd-chip-9  { background: #E1F5FE; }
.fd-chip-10 { background: #FFEBEE; }
.fd-chip-11 { background: #F1F8E9; }
.fd-chip-12 { background: #E0F2F1; }
.fd-chip-13 { background: #FFFDE7; }

.fd-portfolio-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
}
.fd-portfolio-scroll::-webkit-scrollbar { display: none; }

.fd-tabs {
  display: flex;
  margin-bottom: 16px;
  gap: 0;
  border-bottom: 2px solid #eee;
}
.fd-tab {
  padding: 10px 28px;
  background: none;
  border: none;
  border-bottom: 6px solid transparent;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  font-family: Rubik, sans-serif;
  transition: all 0.2s;
  margin-bottom: -2px;
}
.fd-tab-active {
  color: #111;
  border-bottom-color: #FFFFA8;
}

.fd-services-list { display: flex; flex-direction: column; gap: 4px; }
.fd-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
}
      `}</style>
    </DrawerOverlay>
  );
}

// ── DrawerOverlay ─────────────────────────────────────────────────────────────
function DrawerOverlay({ children, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 10000,
        }}
      />
      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: isMobile ? "100vw" : Math.min(520, window.innerWidth),
          background: "#f9f9f9",
          zIndex: 10001,
          boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          animation: "fd-slide-in 0.3s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes fd-slide-in {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

// ── PortfolioCard ────────────────────────────────────────────────────────────
function PortfolioCard({ item }) {
  const title = item.title || "Untitled";
  const description = item.description || "No description";
  const imageUrl = item.imageUrl || "";
  const projectUrl = item.projectUrl || "";
  const skills = extractList(item.skills);
  const tools = extractList(item.tools);
  const all = [...skills, ...tools];

  return (
    <div
      onClick={() => {
        if (projectUrl) {
          const fixed = projectUrl.startsWith("http")
            ? projectUrl
            : `https://${projectUrl}`;
          window.open(fixed, "_blank");
        }
      }}
      style={{
        flexShrink: 0,
        width: 300,
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        background: "#fff",
        overflow: "hidden",
        cursor: projectUrl ? "pointer" : "default",
        display: "flex",
        flexDirection: "row",
        padding: 14,
        gap: 14,
      }}
    >
      <img
        src={imageUrl || "/assets/ActionCard.png"}
        alt={title}
        className="fds-portfolio-thumb"
        onError={(e) => {
          e.target.src = "/assets/ActionCard.png";
        }
        }
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: "0 0 6px",
            fontWeight: 600,
            fontSize: 15,
            fontFamily: "Rubik, sans-serif",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 13,
            color: "#555",
            fontFamily: "Rubik, sans-serif",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
        {all.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {all.slice(0, 4).map((s, i) => (
              <span
                key={i}
                style={{
                  background: "#FFF7C2",
                  padding: "3px 10px",
                  borderRadius: 12,
                  fontSize: 11,
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ServiceCard ──────────────────────────────────────────────────────────────
function ServiceCard({ service }) {
  const skills = extractList(service.skills);
  const tools = extractList(service.tools);
  const all = [...skills, ...tools];

  return (
    <div
      style={{
        background: "#FFFFEA",
        borderRadius: 24,
        border: "1px solid #CECECE",
        padding: "20px 20px 22px",
        marginBottom: 4,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 500,
            fontFamily: "Rubik, sans-serif",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {service.title || ""}
        </p>
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "Rubik, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          ₹ {service.budget_from || "0"}/per day
        </span>
      </div>

      <p
        style={{
          margin: "14px 0 10px",
          fontSize: 10,
          color: "#888",
          fontFamily: "Rubik, sans-serif",
        }}
      >
        Skills Required
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {all.slice(0, 4).map((s, i) => (
          <span
            key={i}
            style={{
              background: "#FFFFBE",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "Rubik, sans-serif",
            }}
          >
            {s}
          </span>
        ))}
        {all.length > 4 && (
          <span
            style={{
              background: "#FFFFA8",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "Rubik, sans-serif",
            }}
          >
            {all.length - 4}+
          </span>
        )}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 12,
          lineHeight: 1.6,
          color: "#333",
          fontFamily: "Rubik, sans-serif",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {service.description || ""}
      </p>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractList(data) {
  if (Array.isArray(data)) return data.map(String);
  return [];
}

function capitalize(str) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}