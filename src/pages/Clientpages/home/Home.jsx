
// import React, { useEffect, useRef, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "../firbase/Firebase";

// // ====== ASSETS ======
// import browseImg1 from "../assets/Container.png";
// import browseImg2 from "../assets/wave.png";
// import worksImg1 from "../assets/file.png";
// import worksImg2 from "../assets/yellowwave.png";
// import arrow from "../assets/arrow.png";
// import profile from "../assets/profile.png";

// // ====== ICONS ======
// import {
//   FiSearch,
//   FiMessageCircle,
//   FiBell,
//   FiPlus,
//   FiBookmark,
//   FiEye,
// } from "react-icons/fi";

// // ======================================================
// // HELPER FUNCTIONS
// // ======================================================
// function parseIntSafe(v) {
//   if (v === undefined || v === null) return null;
//   if (typeof v === "number") return Math.floor(v);
//   const s = String(v).replace(/[^0-9]/g, "");
//   const n = parseInt(s, 10);
//   return Number.isNaN(n) ? null : n;
// }

// function timeAgo(input) {
//   if (!input) return "N/A";
//   let date;
//   if (input instanceof Timestamp) {
//     date = input.toDate();
//   } else if (input instanceof Date) {
//     date = input;
//   } else {
//     date = new Date(input);
//   }
//   const diff = (Date.now() - date.getTime()) / 1000;
//   if (diff < 60) return `${Math.floor(diff)} sec ago`;
//   if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
//   return `${Math.floor(diff / 86400)} days ago`;
// }

// function formatCurrency(amount) {
//   if (!amount && amount !== 0) return "₹0";
//   if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
//   if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
//   return `₹${amount}`;
// }

// // ======================================================
// // MAIN COMPONENT
// // ======================================================
// export default function ClientHomeUI() {
//   const navigate = useNavigate();

//   const [jobs, setJobs] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [savedJobs, setSavedJobs] = useState(new Set());
//   const searchRef = useRef(null);

//   // Fetch jobs
//   useEffect(() => {
//     const col1 = collection(db, "services");
//     const col2 = collection(db, "service_24h");

//     const unsub1 = onSnapshot(
//       query(col1, orderBy("createdAt", "desc")),
//       (snap) => {
//         const data = snap.docs.map((d) => ({
//           _id: d.id,
//           ...d.data(),
//           _source: "services",
//         }));
//         setJobs((prev) => mergeJobs(prev, data));
//       }
//     );

//     const unsub2 = onSnapshot(
//       query(col2, orderBy("createdAt", "desc")),
//       (snap) => {
//         const data = snap.docs.map((d) => ({
//           _id: d.id,
//           ...d.data(),
//           _source: "service_24h",
//         }));
//         setJobs((prev) => mergeJobs(prev, data));
//       }
//     );

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, []);

//   function mergeJobs(prev, incoming) {
//     const map = new Map();
//     for (const p of prev) map.set(p._id + "::" + (p._source || ""), p);
//     for (const n of incoming) map.set(n._id + "::" + (n._source || ""), n);
//     return Array.from(map.values());
//   }

//   // Autocomplete
//   useEffect(() => {
//     const q = searchText.trim().toLowerCase();
//     if (!q) return setSuggestions([]);

//     const setS = new Set();
//     for (const job of jobs) {
//       if (job.title?.toLowerCase().includes(q)) setS.add(job.title);
//       if (Array.isArray(job.skills)) {
//         for (const s of job.skills) {
//           if (String(s).toLowerCase().includes(q)) setS.add(s);
//         }
//       }
//     }
//     setSuggestions(Array.from(setS).slice(0, 6));
//   }, [searchText, jobs]);

//   // Filtered jobs
//   const filteredJobs = useMemo(() => {
//     const q = searchText.trim().toLowerCase();
//     return jobs
//       .filter((j) => {
//         const title = (j.title || "").toLowerCase();
//         const desc = (j.description || "").toLowerCase();
//         const skills = Array.isArray(j.skills)
//           ? j.skills.map((s) => String(s).toLowerCase())
//           : [];
//         return (
//           !q ||
//           title.includes(q) ||
//           desc.includes(q) ||
//           skills.some((s) => s.includes(q))
//         );
//       })
//       .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
//   }, [jobs, searchText]);

//   function openJob(job) {
//     if (job._source === "service_24h") {
//       navigate(`/client-dashbroad2/service-24h/${job._id}`);
//     } else {
//       navigate(`/client-dashbroad2/service/${job._id}`);
//     }
//   }

//   function toggleSaveJob(jobId) {
//     setSavedJobs((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(jobId)) newSet.delete(jobId);
//       else newSet.add(jobId);
//       return newSet;
//     });
//   }

//   return (
//     <div className="fh-page rubik-font">
//       {/* CONTAINER */}
//       <div className="fh-container">
//         {/* HEADER */}
//         <header className="fh-header">
//           <div className="fh-header-left">
//             <h1 className="fh-title">
//               Welcome,
//               <div>Pixel Studios Pvt Ltd</div>
//             </h1>
//             <div className="fh-subtitle">
//               Discover projects that match your skills
//             </div>
//           </div>

//           <div className="fh-header-right">
//             <button className="icon-btn"><FiMessageCircle onClick={() => navigate("/messages")} /></button>
//             <button className="icon-btn"><FiBell /></button>

//             <div className="fh-avatar">
//               <img src={profile} alt="avatar" />
//             </div>
//           </div>

//           {/* SEARCH BAR */}
//           <div className="fh-search-row">
//             <div className="fh-search fh-search-small" ref={searchRef}>
//               <FiSearch className="search-icon" />
//               <input
//                 className="search-input"
//                 placeholder="Search"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//               />
//               {searchText && (
//                 <button
//                   className="clear-btn"
//                   onClick={() => setSearchText("")}
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>

//             {suggestions.length > 0 && (
//               <div className="autocomplete-list">
//                 {suggestions.map((s, i) => (
//                   <div
//                     key={i}
//                     className="autocomplete-item"
//                     onClick={() => {
//                       setSearchText(s);
//                       setSuggestions([]);
//                     }}
//                   >
//                     {s}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </header>

//         {/* MAIN */}
//         <main className="fh-main">
//           {/* HERO CARDS */}
//           <section className="fh-hero">

//             <div
//               className="fh-hero-card primary"
//               onClick={() => navigate("/client-dashbroad2/clientcategories")}
//               style={{ cursor: "pointer" }}
//             >
//               <img src={browseImg1} className="hero-img img-1" alt="" />
//               <img src={browseImg2} className="hero-img img-2" alt="" />

//               <div>
//                 <h3>Browse All Projects</h3>
//                 <p>Explore verified professionals</p>
//               </div>

//               <div className="hero-right">
//                 <img src={arrow} className="arrow" width={25} alt="" />
//               </div>
//             </div>


//             <div
//               className="fh-hero-card secondary"
//               onClick={() => navigate("/client-dashbroad2/AddJobScreen")}
//               style={{ cursor: "pointer" }}
//             >
//               <img src={worksImg1} className="hero-img img-3" alt="" />
//               <img src={worksImg2} className="hero-img img-4" alt="" />

//               <div>
//                 <h4>Job proposal</h4>
//                 <p>Find the right freelancers for your project</p>
//               </div>

//               <div className="hero-right">
//                 <img src={arrow} className="arrow" width={25} alt="" />
//               </div>
//             </div>

//           </section>


//           {/* RECOMMENDATIONS */}
//           <section className="fh-section">
//             <div className="section-header">
//               <h2>Top Services for You</h2>
//             </div>

//             <div className="jobs-list">
//               {filteredJobs.map((job) => (
//                 <article
//                   key={job._id}
//                   className="job-card"
//                   onClick={() => openJob(job)}
//                 >
//                   <div className="job-card-top">
//                     <div>
//                       <h3 className="job-title">{job.title}</h3>
//                       <div className="job-sub">
//                         {job.category || "Service"}
//                       </div>
//                     </div>

//                     <div className="job-budget-wrapper">
//                       <div className="job-budget">
//                         {formatCurrency(parseIntSafe(job.price ?? job.budget))}
//                       </div>
//                       <button
//                         className={`save-btn ${savedJobs.has(job._id) ? "saved" : ""}`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleSaveJob(job._id);
//                         }}
//                       >
//                         <FiBookmark />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="job-skills">
//                     {(job.skills || []).slice(0, 3).map((skill, i) => (
//                       <span key={i} className="skill-chip">{skill}</span>
//                     ))}
//                   </div>

//                   <p className="job-desc">
//                     {job.description?.slice(0, 180)}
//                     {job.description?.length > 180 ? "..." : ""}
//                   </p>

//                   <div className="job-meta">
//                     <span className="views-count">
//                       <FiEye style={{ marginRight: "4px" }} />
//                       {job.views || job.impressions || 0} views
//                     </span>

//                     <div className="created">
//                       {timeAgo(job.createdAt)}
//                     </div>

//                     {job._source === "service_24h" && (
//                       <div className="views">⏱ 24 Hours</div>
//                     )}
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </section>
//         </main>

//         {/* FAB BUTTON */}
//         <button
//           className="fh-fab"
//           onClick={() => navigate("/client-dashbroad2/PostJob")}
//         >
//           <FiPlus />
//         </button>
//       </div>

//       {/* EMBEDDED CSS */}
//       <style>{`
//         .fh-container {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 0 20px;
//           margin-left:100px
//         }

//         .autocomplete-list {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           right: 0;
//           background: #fff;
//           border: 1px solid #ccc;
//           border-radius: 6px;
//           max-height: 200px;
//           overflow-y: auto;
//           z-index: 10;
//         }
//         .autocomplete-item {
//           padding: 8px 12px;
//           cursor: pointer;
//         }
//         .autocomplete-item:hover {
//           background: #f0f0f0;
//         }

//         .save-btn {
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #888;
//           font-size: 1.3rem;
//           margin-left: 8px;
//           transition: color 0.2s;
//         }
//         .save-btn.saved {
//           color: #ff9800;
//         }
//         .save-btn:hover {
//           color: #ff9800;
//         }

//         .views-count {
//           display: inline-flex;
//           align-items: center;
//           gap: 4px;
//           color: #555;
//           font-size: 0.9rem;
//         }

//         @media (max-width: 768px) {
//           .fh-hero {
//             display: flex;
//             flex-direction: column;
//             gap: 20px;
//           }
//           .fh-hero-card, .job-card {
//             width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }



import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
} from "firebase/firestore";
import { db, auth } from "../../../firbase/Firebase";

// ====== ASSETS ======
// import browseImg1 from "../assets//Container.png";
// import browseImg2 from "../assets/wave.png";
// import worksImg1 from "../assets/file.png";
// import worksImg2 from "../assets/yellowwave.png";
// import arrow from "../assets/arrow.png";
// import profile from "../assets/profile.png";

// ====== ICONS ======
import {
  FiSearch,
  FiMessageCircle,
  FiBell,
  FiPlus,
  FiBookmark,
  FiEye,
} from "react-icons/fi";
import TopNavbar from "../../../components/TopNavbar";



// ======================================================
// HELPERS
// ======================================================
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
  const searchRef = useRef(null);

  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    role: '',
    profileImage: '',
    companyName: '',
  });

  useEffect(() => {
    import("firebase/auth").then(({ onAuthStateChanged }) => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) return;
        const userRef = doc(db, "users", currentUser.uid);
        let unsubSnapshot = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            let localData = {};
            try {
              const stored = localStorage.getItem("clientOtpUser") || localStorage.getItem("freelancerOtpUser");
              if (stored) localData = JSON.parse(stored);
            } catch (e) { }

            const authDisplayName = currentUser.displayName || "";
            const authFirst = authDisplayName.split(" ")[0] || "";

            setUserInfo({
              first_name: data.first_name || data.firstName || data.firstname || data.displayName || data.name || authFirst || localData.first_name || localData.firstName || "",
              last_name: data.last_name || data.lastName || data.lastname || "",
              companyName: data.Company_name || data.companyName || "",
              profileImage: data.profileImage || "",
            });
          }
        });
      });
      return () => unsubscribe();
    });
  }, []);

  // ================= NOTIFICATIONS ==================
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("clientUid", "==", user.uid)
    );

    return onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const pending = notifications.filter((n) => !n.read).length;

  async function acceptNotif(item) {
    await updateDoc(doc(db, "notifications", item.id), { read: true });

    navigate("/chat", {
      state: {
        currentUid: auth.currentUser.uid,
        otherUid: item.freelancerId,
        otherName: item.freelancerName,
        otherImage: item.freelancerImage,
        initialMessage: `Your application for ${item.jobTitle} accepted!`,
      },
    });
  }

  async function declineNotif(item) {
    await deleteDoc(doc(db, "notifications", item.id));
  }

  // ================= JOB FETCH ==================
  useEffect(() => {
    const col1 = collection(db, "services");
    const col2 = collection(db, "service_24h");

    const unsub1 = onSnapshot(
      query(col1, orderBy("createdAt", "desc")),
      (snap) => {
        const data = snap.docs.map((d) => ({
          _id: d.id,
          ...d.data(),
          _source: "services",
        }));
        setJobs((prev) => mergeJobs(prev, data));
      }
    );

    const unsub2 = onSnapshot(
      query(col2, orderBy("createdAt", "desc")),
      (snap) => {
        const data = snap.docs.map((d) => ({
          _id: d.id,
          ...d.data(),
          _source: "service_24h",
        }));
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

  // ================= AUTOCOMPLETE ==================
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

  // ================= FILTER ==================
  const filteredJobs = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return jobs
      .filter((j) => {
        const t = (j.title || "").toLowerCase();
        const d = (j.description || "").toLowerCase();
        const skills = Array.isArray(j.skills)
          ? j.skills.map((s) => String(s).toLowerCase())
          : [];
        return (
          !q ||
          t.includes(q) ||
          d.includes(q) ||
          skills.some((s) => s.includes(q))
        );
      })
      .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
  }, [jobs, searchText]);

  // ================= OPEN JOB ==================
  function openJob(job) {
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
    <div
      className="client-home-wrapper"
      style={{
        marginLeft: "-60px",
        marginTop: "0px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(0deg, #F7F4EE, #F7F4EE), #FFFFFF",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100vh", marginTop: "0px" }}>
        <div style={{ flex: 1, padding: "0px 24px 20px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>


          <TopNavbar
            userName={userInfo.first_name || ""}
            isLoggedIn={Boolean(auth.currentUser || localStorage.getItem("userEmail") || localStorage.getItem("clientOtpUser"))}

            searchValue={searchText}
            onSearchChange={(val) => setSearchText(val)}
            profileImage={userInfo.profileImage}
            notificationCount={pending}
            onBellClick={() => setNotifOpen(!notifOpen)}
            onMessageClick={() => navigate("/messages")}
            onSelectCategory={(cat) => {
              navigate("/client-dashbroad2/category", { state: { category: cat } });
            }}
          />



          {/* Yellow Banner */}
          <section style={{ background: "linear-gradient(100.35deg, rgba(245, 239, 160, 1) 0%, rgba(253, 247, 208, 1) 50%, rgba(240, 232, 168, 1) 100%)", borderRadius: "20px", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1336px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", width: "400px", height: "400px", right: "-100px", top: "-100px", background: "rgba(240, 232, 168, 0.4)", borderRadius: "200px", zIndex: 0 }}></div>

            <div style={{ zIndex: 1 }}>
              <h2 style={{ fontSize: "28px", fontWeight: 700, margin: 0, color: "#1A1433", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px", lineHeight: "1.2" }}>Good morning, {userInfo.companyName || userInfo.first_name || "Creativo Studio"}! 👋</h2>
              <p style={{ margin: "4px 0 0 0", color: "#6B6B8A", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>You have <strong style={{ color: "#1A1433" }}>3 new applicants</strong> today</p>
            </div>

            <div style={{ display: "flex", gap: "16px", zIndex: 1 }}>
              <div style={{ background: "rgba(255, 255, 255, 0.5)", padding: "16px 24px", borderRadius: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>4</div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B8A", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>Active Jobs</div>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.5)", padding: "16px 24px", borderRadius: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>17</div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B8A", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>Applicants</div>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.5)", padding: "16px 24px", borderRadius: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>2</div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B8A", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>In Progress</div>
              </div>
            </div>
          </section>

          {/* Proposal Review Strip */}
          <div style={{ background: "white", border: "1px solid #EBE5F2", padding: "12px 20px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "1336px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>⏱</span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A1433", fontFamily: "'DM Sans', sans-serif" }}>Proposal review pending</span>
              <span style={{ fontSize: "14px", color: "#6B6B8A", fontFamily: "'DM Sans', sans-serif" }}>— 12 freelancers applied to your project</span>
            </div>
            <div style={{ background: "#F5F2FF", color: "#6C3EEB", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>1h 20m</div>
          </div>

          <div style={{ display: "flex", gap: "24px", width: "100%", maxWidth: "1336px", marginTop: "8px" }}>
            {/* Top Match Card */}
            <div style={{ flex: "1.5", background: "linear-gradient(108.32deg, #1C1243 0%, #2A1B54 100%)", borderRadius: "24px", padding: "32px", color: "white", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0px 8px 32px rgba(28, 18, 67, 0.15)", boxSizing: "border-box" }}>
              <div style={{ position: "absolute", width: "500px", height: "500px", right: "-150px", bottom: "-150px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "250px", zIndex: 0 }}></div>
              <div style={{ position: "absolute", width: "250px", height: "250px", right: "150px", top: "-50px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "125px", zIndex: 0 }}></div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1 }}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#6C3EEB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>AS</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <div style={{ background: "#F0E870", color: "#1A1433", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "4px" }}>⭐ Top Match</div>
                    </div>
                    <h3 style={{ fontSize: "22px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "white" }}>Aryan Shah</h3>
                    <div style={{ fontSize: "13px", color: "#A39DBA", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>Available now · Verified Pro</div>
                  </div>
                </div>
                <button style={{ background: "#6C3EEB", color: "white", padding: "10px 24px", borderRadius: "50px", border: "none", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>Hire Now →</button>
              </div>

              <div style={{ zIndex: 1, marginTop: "24px" }}>
                <div style={{ fontSize: "14px", color: "#EBE5F2", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>Senior UI/UX Designer · Remote · Contract · Immediate start</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>₹90K</div>
                  <div style={{ fontSize: "14px", color: "#A39DBA", fontFamily: "'Sora', sans-serif" }}>/month</div>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                  {["UI Design", "Figma", "UX Research", "Prototyping"].map((s, i) => (
                    <div key={i} style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{s}</div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px", fontSize: "13px", color: "#A39DBA", fontFamily: "'DM Sans', sans-serif" }}>
                  <span>💼 28 completed projects</span>
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
                <div style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "#1A1433", cursor: "pointer", padding: "20px" }}>
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
            </div>

            <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>📌 Shortlisted Talent</h3>
                <span style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Manage →</span>
              </div>
              <div style={{ display: "flex", gap: "16px", height: "100%" }}>
                {/* Shortlisted 1 */}
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
                {/* Shortlisted 2 */}
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
              </div>
            </div>

          </div>

          {/* Recommended Freelancers Grid */}
          <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px", width: "100%", maxWidth: "1336px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>Recommended Freelancers</h3>
              <span style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>View all →</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {[
                { name: "Priya Nair", role: "Product Designer", tag: "Top Rated", initials: "P", color: "#FF6E91", rate: "₹1,500/day", skills: ["Figma", "UX"], rep: "1h" },
                { name: "Rahul Dev", role: "Mobile Designer", tag: "Available", initials: "R", color: "#30B47A", rate: "₹2,000/day", skills: ["iOS", "Android"], rep: "4h" },
                { name: "Maya Rajan", role: "Product Designer", tag: "Top Rated", initials: "MR", color: "#FF6B35", rate: "₹1,200/day", skills: ["Prototyping", "UI Design"], rep: "2h" },
                { name: "Sandhya Kumar", role: "UX Researcher", tag: "Available", initials: "SK", color: "#D9A000", rate: "₹950/day", skills: ["UX Research"], rep: "3h" },
                { name: "Sandhya Kumar", role: "UX Researcher", tag: "Available", initials: "SK", color: "#D9A000", rate: "₹950/day", skills: ["UX Research"], rep: "3h" }
              ].slice(0, 4).map((freelancer, i) => (
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
                  <div style={{ display: "flex", gap: "8px" }}>
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
                    {i === 0 || i === 2 ?
                      <button style={{ flex: 1, background: "#6C3EEB", color: "white", padding: "10px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Hire</button> :
                      <button style={{ flex: 1, background: "white", color: "#1A1433", border: "1px solid #EEEDF3", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Contact</button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Talent This Week */}
          <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px", width: "100%", maxWidth: "1336px", paddingBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>Top Talent This Week</h3>
              <div style={{ display: "flex", gap: "16px" }}>
                <span style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>See all →</span>
                <span style={{ color: "#1A1433", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Trending Skills</span>
                <span style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Explore →</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1, background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#6C3EEB", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>AS</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ fontWeight: 700, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>Aryan Shah</div>
                      <div style={{ background: "#FDFCEB", color: "#D9A000", padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>#1 This Week</div>
                    </div>
                    <div style={{ fontSize: "13px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>Senior UI/UX Designer</div>
                    <div style={{ fontSize: "13px", color: "#1A1433", fontFamily: "'DM Sans', sans-serif", marginTop: "4px", fontWeight: 600 }}>₹90K<span style={{ color: "#8C84A8", fontWeight: 400 }}>/mo · Remote · Full-time</span></div>
                  </div>
                </div>
                <button style={{ background: "white", color: "#1A1433", border: "1px solid #EEEDF3", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>View →</button>
              </div>

              <div style={{ flex: 1, background: "linear-gradient(106.39deg, #7C4EF5 0%, #6C3EEB 100%)", borderRadius: "16px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "white" }}>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>UI/UX Design</div>
                  <div style={{ fontSize: "13px", opacity: 0.9, fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>Most in-demand skill this week</div>
                </div>
                <button style={{ background: "white", color: "#6C3EEB", border: "none", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Browse Talent →</button>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* NOTIFICATION POPUP */}
      {notifOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }} onClick={(e) => { if (e.target === e.currentTarget) setNotifOpen(false); }}>
          <div style={{ width: "90%", maxWidth: 420, background: "#fff", padding: 20, borderRadius: 16, maxHeight: "80vh", overflowY: "auto" }}>
            <h3 style={{ marginBottom: 15, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>Notifications</h3>
            {notifications.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif" }}>No notifications</div>}
            {notifications.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 15, background: "#f7f7f7", padding: 10, borderRadius: 10, fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "24px", background: "#6C3EEB", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, marginRight: 10 }}>{item.freelancerName?.charAt(0) || "F"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#1A1433" }}>{item.freelancerName}</div>
                  <div style={{ fontSize: "13px", color: "#8C84A8" }}>applied for {item.jobTitle}</div>
                </div>
                {!item.read ? (
                  <>
                    <button onClick={() => acceptNotif(item)} style={{ marginRight: 8, background: "none", border: "none", cursor: "pointer" }}>✅</button>
                    <button onClick={() => declineNotif(item)} style={{ background: "none", border: "none", cursor: "pointer" }}>❌</button>
                  </>
                ) : (
                  <button onClick={() => acceptNotif(item)} style={{ background: "none", border: "none", cursor: "pointer" }}>💬</button>
                )}
              </div>
            ))}
            <button style={{ marginTop: 10, width: "100%", padding: 10, borderRadius: 10, background: "#1A1433", color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }} onClick={() => setNotifOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
