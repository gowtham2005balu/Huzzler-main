// FreelanceHome.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../../firbase/Firebase";
import { useTheme, useMediaQuery } from "@mui/material";


import {
  FiBookmark,
  FiPlus,
  FiSearch,
  FiMessageCircle,
  FiBell,
  FiEye,
  FiClock,
  FiSmile
} from "react-icons/fi";
import { FaReact } from "react-icons/fa";
import TopNavbar from "../../../components/TopNavbar";



import { BsBookmarkFill } from "react-icons/bs";
import browseImg1 from "../../../assets/Container.png";
import browseImg2 from "../../../assets/wave.png";
import worksImg1 from "../../../assets/file.png";
import worksImg2 from "../../../assets/yellowwave.png";
import arrow from "../../../assets/arrow.png";
import profile from "../../../assets/profile.png";


import ActionCard from "../../../assets/Brouse2.png";
import Job from "../../../assets/My_Work.png";
import noCardsImg from "../../../assets/dashboard.png";
import noInternetImg from "../../../assets/nointernet.png";
import notification from "../../../assets/notification.png";
import message from "../../../assets/message.png";
import search from "../../../assets/search.png";

import "./FreelanceHome.css";

import { categoriesData } from "../../../data/categoriesData";

export default function FreelanceHome() {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [activeTopRecTab, setActiveTopRecTab] = useState("For You");
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeMegaCategoryIndex, setActiveMegaCategoryIndex] = useState(0);
  const [topRecJobs, setTopRecJobs] = useState([]);
  const [showTopBanner, setShowTopBanner] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [dbIcons, setDbIcons] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "skills"), (snap) => {
      const iconsMap = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data.name && data.icon) {
          iconsMap[data.name] = data.icon;
        }
      });
      setDbIcons(iconsMap);
    });
    return unsub;
  }, []);

  const trendingSkills = useMemo(() => {
    const defaultTrending = [
      { name: "UI/UX Design", demand: "+34%", jobs: "1.2K", jobsNum: 1200, avg: "₹90K", icon: "🎨", color: "#6C3EEB", percentage: 80, isTop: true },
      { name: "AI Design", demand: "+61%", jobs: "420 projects", jobsNum: 420, avg: "₹120K", icon: "🤖", color: "#34C77B", percentage: 85, isTop: false },
      { name: "Frontend Dev", demand: "+48%", jobs: "846 projects", jobsNum: 846, avg: "₹80K", icon: "⚛️", color: "#3D8BDD", percentage: 70, isTop: false },
      { name: "Motion Design", demand: "+41%", jobs: "312 projects", jobsNum: 312, avg: "₹75K", icon: "🎬", color: "#FF8A00", percentage: 60, isTop: false },
      { name: "Branding", demand: "+35%", jobs: "250 projects", jobsNum: 250, avg: "₹50K", icon: "✏️", color: "#E0245E", percentage: 50, isTop: false }
    ];

    if (!jobs || jobs.length === 0) return defaultTrending;

    const skillCounts = {};
    jobs.forEach(job => {
      if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach(skill => {
          if (!skillCounts[skill]) {
            skillCounts[skill] = { name: skill, count: 0, budgetSum: 0 };
          }
          skillCounts[skill].count++;
          let budget = Number(job.budget_to) || Number(job.budget) || 0;
          skillCounts[skill].budgetSum += budget;
        });
      }
    });

    const sortedSkills = Object.values(skillCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    if (sortedSkills.length === 0) return defaultTrending;

    return defaultTrending.map((def, idx) => {
      const computed = sortedSkills[idx];
      if (!computed) return def;

      const avgBudget = computed.count > 0 ? computed.budgetSum / computed.count : 0;
      let avgFormatted = "Negotiable";
      if (avgBudget > 0) {
        if (avgBudget >= 1000) {
          avgFormatted = "₹" + (avgBudget / 1000).toFixed(1).replace(/\.0$/, '') + "K";
        } else {
          avgFormatted = "₹" + Math.round(avgBudget);
        }
      }

      let jobsFormatted = computed.count >= 1000 ? (computed.count / 1000).toFixed(1) + "K" : computed.count + (def.isTop ? "" : " projects");
      
      const maxCount = sortedSkills[0]?.count || 1;
      const percentage = Math.round((computed.count / maxCount) * 100);
      const demand = `+${percentage}%`;

      return {
        ...def,
        name: computed.name,
        jobs: jobsFormatted,
        jobsNum: computed.count,
        avg: avgFormatted,
        percentage: percentage,
        demand: demand,
        icon: dbIcons[computed.name] || def.icon
      };
    });
  }, [jobs, dbIcons]);

  const searchRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;


  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );


  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    role: "",
    profileImage: "",
  });


  // notifiaction

  const [notifCount, setNotifCount] = useState(0);

  const [notifications, setNotifications] = useState([]);

  const [notifOpen, setNotifOpen] = useState(false);

  const pending = notifications.filter((n) => !n.read).length;


  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "freelancer_notifications"),
      where("freelancerId", "==", user.uid)
    );

    return onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const [blockedUserIds, setBlockedUserIds] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "blocked_users"),
      where("blockedBy", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const ids = snap.docs.map((d) => d.data().blockedUserId);
      setBlockedUserIds(ids);
    });

    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "freelancer_drafts"),
      where("freelancerId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDrafts(items);
    });

    return unsub;
  }, [user]);

  // ===============================
  // handleNotificationClick()
  // replace full function
  // ===============================

  const handleNotificationClick = async (notif) => {
    try {
      // read update
      if (!notif.read) {
        await updateDoc(
          doc(db, "freelancer_notifications", notif.id),
          { read: true }
        );
      }

      setNotifOpen(false);

      // detail screen ku full object pass panrom
      navigate(
        "/freelance-dashboard/notificationsdetailsscreen",
        {
          state: {
            notification: notif,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };





  const [isOnline, setIsOnline] = useState(true);





  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "freelancer_notifications"),
      where("freelancerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds); // newest first
      setNotifications(items);
      setNotifCount(items.filter((n) => !n.read).length);
    });

    return unsubscribe;
  }, [user]);




  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // 🔥 INTERNET LISTENERS
  useEffect(() => {
    function updateStatus() {
      setIsOnline(navigator.onLine);
    }
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  useEffect(() => {
    let unsubSnapshot;
    let unsubSnapshot2;
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return;
      try {
        const userRef = doc(db, "users", currentUser.uid);
        unsubSnapshot = onSnapshot(userRef, (snap) => {
          let data = {};
          if (snap.exists()) data = snap.data();
          
          const hasValidData = data.firstName || data.first_name || data.firstname || data.role || data.professional_title;

          if (snap.exists() && hasValidData) {
            let localData = {};
            try {
              const stored = localStorage.getItem("freelancerOtpUser") || localStorage.getItem("clientOtpUser");
              if (stored) localData = JSON.parse(stored);
            } catch (e) {}

            const authDisplayName = currentUser.displayName || "";
            const authFirst = authDisplayName.split(" ")[0] || "";
            const authLast = authDisplayName.split(" ").slice(1).join(" ") || "";

            setUserInfo({
              first_name: data.first_name || data.firstName || data.firstname || data.displayName || data.name || authFirst || localData.first_name || localData.firstName || "",
              last_name: data.last_name || data.lastName || data.lastname || authLast || localData.last_name || localData.lastName || "",
              role: data.professional_title || data.profession || data.role || data.category || "",
              profileImage: data.profileImage || "",
            });
          } else {
            const freelancerRef = doc(db, "freelancers", currentUser.uid);
            if (unsubSnapshot2) unsubSnapshot2();
            unsubSnapshot2 = onSnapshot(freelancerRef, (fSnap) => {
              if (fSnap.exists()) {
                const fData = fSnap.data();
                
                let localData = {};
                try {
                  const stored = localStorage.getItem("freelancerOtpUser") || localStorage.getItem("clientOtpUser");
                  if (stored) localData = JSON.parse(stored);
                } catch (e) {}

                const authDisplayName = currentUser.displayName || "";
                const authFirst = authDisplayName.split(" ")[0] || "";
                const authLast = authDisplayName.split(" ").slice(1).join(" ") || "";

                setUserInfo({
                  first_name: fData.first_name || fData.firstName || fData.firstname || fData.displayName || fData.name || authFirst || localData.first_name || localData.firstName || "",
                  last_name: fData.last_name || fData.lastName || fData.lastname || authLast || localData.last_name || localData.lastName || "",
                  role: fData.professional_title || fData.profession || fData.role || fData.category || "",
                  profileImage: fData.profileImage || "",
                });
              }
            });
          }
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
      if (unsubSnapshot2) unsubSnapshot2();
    };
  }, []);

  function updateSuggestions(text) {
    const q = text.toLowerCase();
    const setData = new Set();
    jobs.forEach((job) => {
      if (job.title?.toLowerCase().includes(q)) setData.add(job.title);
      if (job.skills) {
        job.skills.forEach((skill) => {
          if (skill.toLowerCase().includes(q)) setData.add(skill);
        });
      }
    });
    setSuggestions(Array.from(setData).slice(0, 6));
  }

  useEffect(() => {
    if (!searchText.trim()) return setSuggestions([]);
    updateSuggestions(searchText);
  }, [searchText, jobs]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data();

        return {
          id: d.id,
          ...raw,
          createdAt: raw.created_at?.toDate?.() || null, // ✅ ADD THIS
        };
      });

      setJobs(data);
    });

    return unsub;
  }, []);

  useEffect(() => {
    const colName = activeTopRecTab === "24 Hours" ? "jobs_24h" : "jobs";
    const unsub = onSnapshot(collection(db, colName), (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          ...raw,
          jobtype: colName,
          createdAt: raw.created_at?.toDate?.() || null,
        };
      });

      if (activeTopRecTab === "Trending") {
        data.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else {
        data.sort((a, b) => {
          const timeA = a.createdAt ? a.createdAt.getTime() : 0;
          const timeB = b.createdAt ? b.createdAt.getTime() : 0;
          return timeB - timeA;
        });
      }

      setTopRecJobs(data);
    });

    return unsub;
  }, [activeTopRecTab]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedJobs(snap.data()?.favoriteJobs || []);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const map = {};
      snap.docs.forEach((u) => (map[u.id] = u.data()));
      setUserMap(map);
    });
    return unsub;
  }, []);

  async function toggleSave(jobId) {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const newList = savedJobs.includes(jobId)
      ? savedJobs.filter((x) => x !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(newList);
    await updateDoc(ref, { favoriteJobs: newList });
  }

  function onViewJob(job) {
    if (job.jobtype === "jobs_24h") {
      navigate(`/freelance-dashboard/job-24/${job.id}`);
    } else {
      navigate(`/freelance-dashboard/job-full/${job.id}`);
    }
  }

  const filteredJobs = jobs.filter((job) => {

    // ❌ BLOCKED USER JOB REMOVE
    if (blockedUserIds.includes(job.userId)) return false;

    const txt = searchText.toLowerCase();

    const matchSearch =
      !searchText.trim() ||
      job.title?.toLowerCase().includes(txt) ||
      job.description?.toLowerCase().includes(txt) ||
      job.skills?.some((s) => s.toLowerCase().includes(txt));

    const matchCategory =
      category === "" ||
      (job.category && job.category.toLowerCase() === category.toLowerCase());

    return matchSearch && matchCategory;
  });

  const filteredTopRecJobs = topRecJobs.filter((job) => !blockedUserIds.includes(job.userId));
  const displayTopRecJob = filteredTopRecJobs.length > 0 ? filteredTopRecJobs[0] : null;

  const timeAgo = (input) => {
    if (!input) return "";

    let date;

    if (input?.seconds) {
      date = new Date(input.seconds * 1000);
    } else if (input instanceof Date) {
      date = input;
    } else if (typeof input === "number") {
      date = new Date(input);
    } else {
      date = new Date(input);
    }

    if (!date || isNaN(date.getTime())) return "";

    const diff = Date.now() - date.getTime();

    if (diff < 60000) return "1m ago";

    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;

    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(days / 365);
    return `${years}y ago`;
  };

  function getStatusLabel(status, jobTitle) {
    if (status === "accepted") {
      return `Your request for "${jobTitle}" was accepted 🎉`;
    }
    if (status === "declined") {
      return `Your request for "${jobTitle}" was not selected.`;
    }
    return `New collaboration request for "${jobTitle}"`;
  }

  return (
    <div
      className="freelance-wrapper"
      style={{
        width: "100%",
        boxSizing: "border-box",
        marginTop: "0px",
        paddingTop: "0px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(0deg, #F7F4EE, #F7F4EE), #FFFFFF",
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      {/* Top Notification Strip */}
      {showTopBanner && (
        <div style={{ background: "linear-gradient(90deg, #6C3EEB 0%, #7C4EF5 100%)", padding: "6px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "white", fontSize: "12px", width: "100%", zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "6px", height: "6px", background: "#F0E870", borderRadius: "3px" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <FiSmile size={16} color="#FFD166" />
              <span>3 new projects match your profile today — Senior UI/UX roles starting immediately</span>
            </div>
          </div>
          <button onClick={() => setShowTopBanner(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", opacity: 0.7 }}>✕</button>
        </div>
      )}

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: showTopBanner ? "calc(100vh - 28px)" : "100vh", marginTop: "0px" }}>
        {/* Left area (Main Content) */}
        <div style={{ flex: 1, padding: "0px 24px 20px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>

          {/* Header & Tabs Container */}
          <div style={{ width: "100%", maxWidth: "1336px", position: "relative", zIndex: 60 }}>
          <TopNavbar
            userName={userInfo.first_name || "James Andrew"}
            isLoggedIn={Boolean(auth.currentUser)}

            searchValue={searchText}
            onSearchChange={(val) => setSearchText(val)}
            onSearchSubmit={(val) => {
              if (val.trim()) {
                navigate("/freelance-dashboard/browse-projects", { state: { searchQuery: val.trim() } });
              } else {
                navigate("/freelance-dashboard/browse-projects");
              }
            }}
            profileImage={userInfo.profileImage}
            onBellClick={() => navigate("/freelance-dashboard/notifications")}
            onMessageClick={() => navigate("/freelance-dashboard/messages")}
            onSelectCategory={(cat) => {
              navigate("/freelance-dashboard/browse-projects", { state: { category: cat } });
            }}
          />



            {/* Category Tabs and Mega Menu Wrapper */}
            <div onMouseLeave={() => setShowMegaMenu(false)}>
              {/* Category Tabs */}
              <div style={{ display: "flex", gap: "24px", color: "#8C84A8", fontSize: "14px", fontWeight: 500, borderBottom: "1px solid #EBE5F2", overflowX: "auto", fontFamily: "'DM Sans', sans-serif", scrollbarWidth: "none", marginBottom: "24px" }}>
                {categoriesData.map((cat, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => {
                      setActiveMegaCategoryIndex(idx);
                      setShowMegaMenu(true);
                    }}
                    onClick={() => {
                      if (activeMegaCategoryIndex === idx && showMegaMenu) {
                        setShowMegaMenu(false);
                      } else {
                        setActiveMegaCategoryIndex(idx);
                        setShowMegaMenu(true);
                      }
                    }}
                  style={{
                    color: activeMegaCategoryIndex === idx && showMegaMenu ? "#6C3EEB" : "#8C84A8",
                    borderBottom: activeMegaCategoryIndex === idx && showMegaMenu ? "2px solid #6C3EEB" : "2px solid transparent",
                    paddingBottom: "12px",
                    marginBottom: "-1px",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {cat.title}
                </div>
              ))}
            </div>

            {/* MEGAMENU DROPDOWN */}
            {showMegaMenu && categoriesData[activeMegaCategoryIndex] && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% - 24px)",
                  left: 0,
                  width: "100%",
                  background: "white",
                  border: "1px solid #E8E6F0",
                  borderTop: "none",
                  boxShadow: "0px 12px 32px rgba(108, 62, 235, 0.08)",
                  borderRadius: "0 0 16px 16px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden"
                }}
              >
                <div style={{ display: "flex", gap: "32px", padding: "24px 32px", overflowX: "auto" }}>
                  {categoriesData[activeMegaCategoryIndex]?.sections.slice(0, 5).map((section, sidx) => (
                    <div key={sidx} style={{ flex: "1 1 0", minWidth: "200px" }}>
                      <h4 style={{ fontSize: "11px", fontWeight: 700, color: "#A39DBA", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", fontFamily: "'Sora', sans-serif" }}>
                        {section.title}
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {section.items.map((item, iidx) => (
                          <div 
                            key={iidx} 
                            onClick={() => {
                              navigate("/freelance-dashboard/freelancebrowesproject", {
                                state: {
                                  category: categoriesData[activeMegaCategoryIndex].title,
                                  skill: item
                                }
                              });
                            }}
                            style={{ display: "flex", alignItems: "center", gap: "8px", color: iidx === 0 ? "#6C3EEB" : "#4A4A68", fontWeight: iidx === 0 ? 600 : 500, fontSize: "14px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
                          >
                            {iidx === 0 && <div style={{ width: "6px", height: "6px", borderRadius: "3px", background: "#6C3EEB" }}></div>}
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Pill Tags */}
                <div style={{ padding: "16px 32px", background: "#FDFCFE", borderTop: "1px solid #E8E6F0", display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ padding: "8px 16px", borderRadius: "50px", border: "1px solid #EBE5F2", background: "white", fontSize: "12px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.target.style.borderColor = "#6C3EEB"} onMouseLeave={(e) => e.target.style.borderColor = "#EBE5F2"}>
                    Trending: {categoriesData[activeMegaCategoryIndex]?.sections[0]?.items[0] || "Services"}
                  </div>
                  <div style={{ padding: "8px 16px", borderRadius: "50px", border: "1px solid #EBE5F2", background: "white", fontSize: "12px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.target.style.borderColor = "#6C3EEB"} onMouseLeave={(e) => e.target.style.borderColor = "#EBE5F2"}>
                    Most Hired: {categoriesData[activeMegaCategoryIndex]?.title} Experts
                  </div>
                  <div style={{ padding: "8px 16px", borderRadius: "50px", border: "1px solid #EBE5F2", background: "white", fontSize: "12px", color: "#8C84A8", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.target.style.borderColor = "#6C3EEB"} onMouseLeave={(e) => e.target.style.borderColor = "#EBE5F2"}>
                    New: Top Rated
                  </div>

                  <div style={{ flex: 1 }} />
                  <button onClick={() => setShowMegaMenu(false)} style={{ background: "transparent", border: "none", color: "#A39DBA", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Close Menu ✕</button>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Hero Section */}
          <section style={{ background: "linear-gradient(100.35deg, rgba(245, 239, 160, 1) 0%, rgba(253, 247, 208, 1) 50%, rgba(240, 232, 168, 1) 100%)", borderRadius: "20px", padding: "24px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "244px", width: "100%", maxWidth: "1336px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", width: "400px", height: "400px", right: "-100px", top: "-100px", background: "rgba(240, 232, 168, 0.4)", borderRadius: "200px", zIndex: 0 }}></div>

            <div style={{ zIndex: 1 }}>
              <h2 style={{ fontSize: "32px", fontWeight: 700, margin: 0, color: "#1A1433", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px", lineHeight: "1.2", display: "flex", alignItems: "center", gap: "10px" }}>
                Welcome, {userInfo.first_name || "Freelancer"}! <FaReact color="#61DBFB" />
              </h2>
              <p style={{ margin: "4px 0 0 0", color: "#6B6B8A", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>You have <strong style={{ color: "#1A1433" }}>12 new matches</strong> waiting · Last active 2h ago</p>
            </div>

            <div style={{ display: "flex", gap: "16px", zIndex: 1, width: "100%", height: "122px", boxSizing: "border-box" }}>
              <div onClick={() => navigate("/freelance-dashboard/browse-projects")} style={{ flex: 1, height: "100%", background: "linear-gradient(106.39deg, #7C4EF5 0%, #6C3EEB 100%)", borderRadius: "20px", padding: "20px", cursor: "pointer", position: "relative", overflow: "hidden", color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0px 4px 16px rgba(108, 62, 235, 0.15)", boxSizing: "border-box" }}>
                <div style={{ position: "absolute", width: "120px", height: "120px", right: "-30px", top: "-30px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "60px" }}></div>
                <div style={{ width: "36px", height: "36px", background: "rgba(255, 255, 255, 0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📂</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "16px", fontFamily: "'Sora', sans-serif" }}>Browse All Projects</div>
                  <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>Explore all available opportunities</div>
                </div>
              </div>

              <div onClick={() => navigate("/freelance-dashboard/freelancermyworks")} style={{ flex: 1, height: "100%", background: "white", borderRadius: "20px", padding: "20px", cursor: "pointer", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.04)", boxSizing: "border-box" }}>
                <div style={{ position: "absolute", width: "200px", height: "200px", right: "-50px", top: "-50px", background: "rgba(108, 62, 235, 0.08)", borderRadius: "100px" }}></div>
                <div style={{ width: "36px", height: "36px", background: "#F5F2FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🗂️</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>My Works</div>
                  <div style={{ fontSize: "12px", color: "#8C84A8", marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>Track your work</div>
                </div>
              </div>

              <div onClick={() => navigate("/freelance-dashboard/aigenerator")} style={{ flex: 1, height: "100%", background: "#F5F2FF", borderRadius: "20px", padding: "20px", cursor: "pointer", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
                <div style={{ position: "absolute", width: "120px", height: "120px", right: "-30px", top: "-30px", background: "rgba(108, 62, 235, 0.08)", borderRadius: "60px" }}></div>
                <div style={{ width: "36px", height: "36px", background: "#EDE8FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✨</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>AI Assistant</div>
                  <div style={{ fontSize: "12px", color: "#8C84A8", marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>Smart freelance help</div>
                </div>
              </div>
            </div>
          </section>

          {/* Top Recommendations */}
          <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px", width: "100%", maxWidth: "1336px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433", display: "flex", alignItems: "center", gap: "8px" }}><span>🌟</span> Top Recommendations</h3>
              <Link to="/freelance-dashboard/browse-projects" style={{ color: "#6C3EEB", fontSize: "13px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>View All →</Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div
                onClick={() => setActiveTopRecTab("For You")}
                style={{
                  padding: "10px 24px",
                  background: activeTopRecTab === "For You" ? "#6C3EEB" : "transparent",
                  color: activeTopRecTab === "For You" ? "white" : "#8C84A8",
                  borderRadius: "50px",
                  fontSize: "14px",
                  fontWeight: activeTopRecTab === "For You" ? 700 : 600,
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: activeTopRecTab === "For You" ? "0px 4px 12px rgba(108, 62, 235, 0.2)" : "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}>
                For You
              </div>
              <div
                onClick={() => setActiveTopRecTab("Trending")}
                style={{
                  padding: activeTopRecTab === "Trending" ? "10px 24px" : "0",
                  background: activeTopRecTab === "Trending" ? "#6C3EEB" : "transparent",
                  color: activeTopRecTab === "Trending" ? "white" : "#8C84A8",
                  borderRadius: "50px",
                  fontSize: "14px",
                  fontWeight: activeTopRecTab === "Trending" ? 700 : 600,
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: activeTopRecTab === "Trending" ? "0px 4px 12px rgba(108, 62, 235, 0.2)" : "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}>
                Trending
              </div>
              <div
                onClick={() => setActiveTopRecTab("24 Hours")}
                style={{
                  padding: activeTopRecTab === "24 Hours" ? "10px 24px" : "0",
                  background: activeTopRecTab === "24 Hours" ? "#6C3EEB" : "transparent",
                  color: activeTopRecTab === "24 Hours" ? "white" : "#8C84A8",
                  borderRadius: "50px",
                  fontSize: "14px",
                  fontWeight: activeTopRecTab === "24 Hours" ? 700 : 600,
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: activeTopRecTab === "24 Hours" ? "0px 4px 12px rgba(108, 62, 235, 0.2)" : "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}>
                24 Hours
              </div>
            </div>

            {/* Purple Featured Card */}
            {displayTopRecJob && (
              <div onClick={() => onViewJob(displayTopRecJob)} style={{ flex: 1, background: "linear-gradient(108.32deg, #6C3EEB 0%, #8D5CFA 100%)", borderRadius: "24px", padding: "32px", color: "white", cursor: "pointer", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0px 8px 32px rgba(108, 62, 235, 0.2)", boxSizing: "border-box" }}>
                {/* Background circles */}
                <div style={{ position: "absolute", width: "500px", height: "500px", right: "-150px", bottom: "-150px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "250px", zIndex: 0 }}></div>
                <div style={{ position: "absolute", width: "250px", height: "250px", right: "150px", top: "-50px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "125px", zIndex: 0 }}></div>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "15px", fontFamily: "'DM Sans', sans-serif", color: "white" }}>{displayTopRecJob.company || displayTopRecJob.companyName || "Zuntra Digital"}</div>
                  <div style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", color: "white" }}>✓ Verified Client · Series B</div>
                </div>

                <div style={{ zIndex: 1, marginTop: "4px" }}>
                  <h2 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px 0", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px", color: "white" }}>{displayTopRecJob.title || "Senior UI/UX Designer"}</h2>
                  <div style={{ fontSize: "14px", opacity: 0.9, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "6px", color: "white" }}>
                    <span>🌍 {displayTopRecJob.location || "Remote"}</span> <span>·</span> <span>{displayTopRecJob.type || "Contract"}</span> <span>·</span> <span>Immediate start</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", zIndex: 1, marginTop: "8px" }}>
                  <div style={{ fontSize: "36px", fontWeight: 700, fontFamily: "'Sora', sans-serif", letterSpacing: "-1px" }}>₹{displayTopRecJob.budget_from || displayTopRecJob.budget || "90K"}</div>
                  <div style={{ fontSize: "15px", opacity: 0.8, fontFamily: "'Sora', sans-serif" }}>/month</div>
                </div>

                <div style={{ display: "flex", gap: "10px", zIndex: 1, marginTop: "4px", flexWrap: "wrap" }}>
                  {(displayTopRecJob.skills || ["UI Design", "Figma", "UX Research", "Prototyping"]).slice(0, 4).map((skill, index) => (
                    <div key={index} style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", backdropFilter: "blur(4px)" }}>{skill}</div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 1, marginTop: "12px", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "14px", background: "rgba(255, 255, 255, 0.2)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, marginRight: "-8px", zIndex: 3 }}>A</div>
                      <div style={{ width: "28px", height: "28px", borderRadius: "14px", background: "rgba(255, 255, 255, 0.2)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, marginRight: "-8px", zIndex: 2 }}>B</div>
                      <div style={{ width: "28px", height: "28px", borderRadius: "14px", background: "rgba(255, 255, 255, 0.2)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, zIndex: 1 }}>C</div>
                    </div>
                    <div style={{ fontSize: "13px", opacity: 0.9, fontFamily: "'DM Sans', sans-serif" }}>{displayTopRecJob.views || 24} applied · {timeAgo(displayTopRecJob.createdAt) || "12h ago"}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onViewJob(displayTopRecJob); }} style={{ background: "white", color: "#6C3EEB", border: "none", padding: "12px 28px", borderRadius: "50px", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)", fontFamily: "'Sora', sans-serif" }}>Apply Now →</button>
                </div>
              </div>
            )}
          </section>

          {/* Recommended Jobs Grid */}
          <section style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "0", width: "100%", maxWidth: "1336px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>💼</span>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433" }}>Recommended</h3>
              </div>
              <Link to="/freelance-dashboard/freelancebrowesproject" style={{ color: "#6C3EEB", fontSize: "13px", fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>View all →</Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "16px" }}>
              {filteredJobs.slice(0, 3).map((job, index) => {
                const isSaved = savedJobs.includes(job.id);
                const colors = [
                  { bg: "#FFF0F4", color: "#FF6E91" },
                  { bg: "#E8F8F0", color: "#34C77B" },
                  { bg: "#F0EFFF", color: "#8378FF" },
                  { bg: "#EAF4FF", color: "#3D8BDD" }
                ];

                return (
                  <article key={job.id || index} style={{ minWidth: 0, background: "white", border: "1px solid #EEEDF3", borderRadius: "20px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>

                    {/* Top Row: Company Info & Badge */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{ width: "40px", height: "40px", background: ["#7850F0", "#2B76E5", "#30B47A", "#FF6B35"][index % 4], borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>
                          {(() => {
                            const client = userMap?.[job.userId];
                            const fName = client?.first_name || client?.firstName || client?.name || client?.displayName || "";
                            const lName = client?.last_name || client?.lastName || "";
                            const fullName = fName ? `${fName} ${lName}`.trim() : "Unknown";
                            const compName = client?.Company_name || client?.companyName || job.company_name || fullName;
                            return compName.substring(0, 2).toUpperCase();
                          })()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "#1A1433", fontFamily: "'DM Sans', sans-serif", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {(() => {
                              const client = userMap?.[job.userId];
                              const fName = client?.first_name || client?.firstName || client?.name || client?.displayName || "";
                              const lName = client?.last_name || client?.lastName || "";
                              const fullName = fName ? `${fName} ${lName}`.trim() : "Unknown Company";
                              return client?.Company_name || client?.companyName || job.company_name || fullName;
                            })()}
                          </div>
                          <div style={{ fontSize: "12px", color: "#A39DBA", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.category || "Design Agency"}</div>
                        </div>
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }} style={{ flexShrink: 0, width: "32px", height: "32px", background: isSaved ? "#F0EFFF" : "transparent", border: isSaved ? "none" : "1px solid #EBE5F2", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: isSaved ? "#6C3EEB" : "#4A4A68", cursor: "pointer", boxSizing: "border-box" }}>
                        {isSaved ? <BsBookmarkFill size={14} /> : <FiBookmark size={14} />}
                      </div>
                    </div>

                    <div style={{ marginTop: "2px" }}>
                      <div onClick={() => onViewJob(job)} style={{ fontWeight: 600, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif", marginBottom: "8px", cursor: "pointer", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{job.title}</div>
                    </div>

                    {/* Budget & Timeline */}
                    <div style={{ display: "flex", gap: "32px", marginTop: "6px" }}>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#A39DBA", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>Budget</div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#6C3EEB", fontFamily: "'DM Sans', sans-serif" }}>₹{job.budget_from || job.budget || "0"} - ₹{job.budget_to || job.budget || "0"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#A39DBA", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>Timeline</div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#1A1433", fontFamily: "'DM Sans', sans-serif" }}>{job.timeline || "4 Weeks"}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px", flex: 1, alignItems: "flex-start", overflow: "hidden" }}>
                      {(job.skills || []).slice(0, 4).map((skill, i) => {
                        const c = colors[i % colors.length];
                        return (
                          <div key={i} style={{ background: c.bg, color: c.color, padding: "6px 12px", borderRadius: "16px", fontSize: "11px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>{skill}</div>
                        );
                      })}
                    </div>

                    {/* Bottom Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", marginTop: "auto" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <div style={{ background: "#EAF4FF", color: "#0B64A0", padding: "6px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>{job.location || "Remote"}</div>
                        <div style={{ fontSize: "12px", color: "#A39DBA", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>{timeAgo(job.createdAt) || "Just now"}</div>
                      </div>
                      <button onClick={() => onViewJob(job)} style={{ background: "#6C3EEB", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>Apply</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Continue Where You Left */}
          {drafts.length > 0 && (
            <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px", width: "100%", maxWidth: "1336px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433", display: "flex", alignItems: "center", gap: "8px" }}><span>📌</span> Continue Where You Left</h3>
                <Link to="/freelance-dashboard" style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>All drafts →</Link>
              </div>

              <div style={{ display: "flex", gap: "14px", width: "100%", overflowX: "auto" }}>
                {drafts.map((draft) => (
                  <div key={draft.id} style={{ flex: 1, minWidth: "300px", background: "white", border: "1px solid #EEEDF3", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ flexShrink: 0, width: "40px", height: "40px", background: "#F5F2FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{draft.icon || "📄"}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "16px", color: "#1A1433", fontFamily: "'Sora', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{draft.title || "Untitled Draft"}</div>
                        <div style={{ fontSize: "13px", color: "#A39DBA", marginTop: "4px", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{draft.subtitle || "Draft"}</div>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div style={{ width: "100%", height: "6px", background: "#F5F2FF", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${draft.progress || 0}%`, height: "100%", background: "#6C3EEB", borderRadius: "4px" }}></div>
                    </div>

                    {/* Bottom Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "15px", color: "#6C3EEB", fontFamily: "'DM Sans', sans-serif" }}>{draft.progress || 0}%</div>
                        <div style={{ fontSize: "12px", color: "#A39DBA", marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>{draft.metaText || ""}</div>
                      </div>
                      <button style={{ background: "#F5F2FF", color: "#6C3EEB", padding: "8px 16px", borderRadius: "20px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>Continue →</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trending Opportunities */}
          <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "32px", width: "100%", maxWidth: "1336px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433", display: "flex", alignItems: "center", gap: "8px" }}><span>🔥</span> Trending Opportunities</h3>
              <Link to="/freelance-jobs" style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>All jobs →</Link>
            </div>

            <div style={{ display: "flex", gap: "14px", width: "100%" }}>
              {filteredJobs.slice(3, 5).map((job, index) => {
                const isUrgent = index === 0;
                const bgGradient = isUrgent ? "linear-gradient(135deg, #4A1C98 0%, #30177A 100%)" : "linear-gradient(135deg, #3A1F92 0%, #2A1772 100%)";
                const pill = isUrgent ? (
                  <div style={{ background: "rgba(255, 255, 255, 0.1)", color: "#FF6E91", padding: "4px 10px", borderRadius: "16px", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", fontFamily: "'DM Sans', sans-serif" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF6E91" }}></div>
                    Urgent
                  </div>
                ) : (
                  <div style={{ background: "rgba(255,255,255,0.1)", color: "#FFC247", padding: "4px 10px", borderRadius: "16px", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", fontFamily: "'DM Sans', sans-serif" }}>
                    ⚡ Trending
                  </div>
                );

                return (
                  <div key={job.id || index} style={{ flex: 1, minWidth: 0, background: bgGradient, borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                    {/* Decorative circles */}
                    <div style={{ position: "absolute", right: isUrgent ? "-20%" : "-10%", top: isUrgent ? "-20%" : "-10%", width: isUrgent ? "150px" : "200px", height: isUrgent ? "150px" : "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}></div>
                    {isUrgent && <div style={{ position: "absolute", right: "-10%", top: "10%", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }}></div>}

                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                      <div style={{ display: "flex", justifyContent: isUrgent ? "flex-start" : "flex-end" }}>
                        {pill}
                      </div>

                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: isUrgent ? "12px" : "4px", fontFamily: "'DM Sans', sans-serif" }}>{job.location || "Remote"} · {job.type || "Full time"}</div>
                      <div style={{ fontWeight: 700, fontSize: "16px", color: "white", marginTop: "4px", fontFamily: "'Sora', sans-serif", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{job.title}</div>
                      <div style={{ fontWeight: 700, fontSize: "16px", color: "white", marginTop: "4px", fontFamily: "'Sora', sans-serif" }}>₹{job.budget_from || job.budget || "90K"}<span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>/mo</span></div>

                      <div style={{ display: "flex", gap: "6px", marginTop: isUrgent ? "12px" : "8px", flexWrap: "wrap" }}>
                        {(job.skills || ["Figma", "Systems", "React"]).slice(0, 4).map(t => (
                          <div key={t} style={{ background: "rgba(255,255,255,0.1)", color: "white", padding: "4px 10px", borderRadius: "16px", fontSize: "10px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{t}</div>
                        ))}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto", paddingTop: "12px" }}>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif" }}>{timeAgo(job.createdAt) || "1h ago"}</div>
                        {isUrgent ? (
                          <button onClick={() => onViewJob(job)} style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "6px 16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Apply +</button>
                        ) : (
                          <button onClick={() => onViewJob(job)} style={{ background: "#FFD335", color: "#1A1433", padding: "6px 16px", borderRadius: "16px", border: "none", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Apply Now →</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Trending Skills */}
          <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "32px", width: "100%", maxWidth: "1336px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433", display: "flex", alignItems: "center", gap: "8px" }}><span>🎯</span> Trending Skills</h3>
              <Link to="/freelance-jobs" style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>All skills →</Link>
            </div>

            <div style={{ display: "flex", gap: "14px", width: "100%", alignItems: "stretch" }}>
              {/* Main Skill Card */}
              {trendingSkills[0] && (
                <div onClick={() => navigate("/freelance-dashboard/browse-projects", { state: { searchQuery: trendingSkills[0].name } })} style={{ flex: 1, background: "linear-gradient(135deg, #2D1B54 0%, #1A0D36 100%)", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                  <div style={{ position: "absolute", right: "-10%", top: "10%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(108,62,235,0.15)" }}></div>

                  <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                    <div>
                      <div style={{ display: "inline-block", background: "rgba(108,62,235,0.4)", color: "#B89AFF", padding: "4px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
                        {trendingSkills[0].name}
                      </div>

                      <div style={{ fontWeight: 700, fontSize: "24px", color: "white", marginTop: "16px", fontFamily: "'Sora', sans-serif" }}>{trendingSkills[0].name}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>Highest demand skill this week · Nationwide</div>

                      <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "18px", color: "#E3F874", fontFamily: "'Sora', sans-serif" }}>{trendingSkills[0].demand}</div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>Demand</div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "18px", color: "#E3F874", fontFamily: "'Sora', sans-serif" }}>{trendingSkills[0].jobs}</div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>Active Jobs</div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "18px", color: "#E3F874", fontFamily: "'Sora', sans-serif" }}>{trendingSkills[0].avg}</div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>Avg/month</div>
                        </div>
                      </div>
                    </div>

                    {/* Mock Bar Chart aligned to bottom */}
                    <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", marginTop: "auto", paddingTop: "20px", height: "40px", width: "100%" }}>
                      <div style={{ flex: 1, background: "rgba(108,62,235,0.4)", height: "30%", borderRadius: "2px" }}></div>
                      <div style={{ flex: 1, background: "rgba(108,62,235,0.4)", height: "40%", borderRadius: "2px" }}></div>
                      <div style={{ flex: 1, background: "rgba(108,62,235,0.4)", height: "35%", borderRadius: "2px" }}></div>
                      <div style={{ flex: 1, background: "#B89AFF", height: "60%", borderRadius: "2px" }}></div>
                      <div style={{ flex: 1, background: "rgba(108,62,235,0.4)", height: "45%", borderRadius: "2px" }}></div>
                      <div style={{ flex: 1, background: "#E3F874", height: "80%", borderRadius: "2px" }}></div>
                      <div style={{ flex: 1, background: "#B89AFF", height: "65%", borderRadius: "2px" }}></div>
                      <div style={{ flex: 1, background: "#E3F874", height: "90%", borderRadius: "2px" }}></div>
                      <div style={{ flex: 1, background: "#B89AFF", height: "55%", borderRadius: "2px" }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Smaller Skill Cards Grid */}
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" }}>
                {trendingSkills.slice(1).map((skill, i) => (
                  <div key={i} onClick={() => navigate("/freelance-dashboard/browse-projects", { state: { searchQuery: skill.name } })} style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "24px", padding: "16px", display: "flex", flexDirection: "column", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                    <div style={{ fontSize: "18px" }}>{skill.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#1A1433", fontFamily: "'Sora', sans-serif", marginTop: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{skill.name}</div>
                    <div style={{ fontSize: "11px", color: skill.color, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>{skill.demand} demand</div>
                    <div style={{ fontSize: "11px", color: "#A39DBA", marginTop: "10px", fontFamily: "'DM Sans', sans-serif" }}>{skill.jobs}</div>
                    <div style={{ width: "100%", height: "4px", background: "#F5F2FF", borderRadius: "2px", overflow: "hidden", marginTop: "14px" }}>
                      <div style={{ width: `${skill.percentage}%`, height: "4px", background: skill.color, borderRadius: "2px" }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Live Feed */}
          <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "32px", width: "100%", maxWidth: "1336px", boxSizing: "border-box", paddingBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif", color: "#1A1433", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ width: "12px", height: "12px", background: "radial-gradient(circle, #E0245E 30%, #FF8A00 100%)", borderRadius: "50%", boxShadow: "0 0 6px rgba(224, 36, 94, 0.4)" }}></span>
                </span>
                Live Feed
                <span style={{ width: "4px", height: "4px", background: "#E0245E", borderRadius: "50%", display: "inline-block" }}></span>
              </h3>
              <Link to="/freelance-jobs" style={{ color: "#6C3EEB", fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>All jobs →</Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {jobs.slice(0, 3).map((job, index) => {
                const avatarColors = ["#34C77B", "#FFB020", "#3D8BDD", "#E0245E", "#6C3EEB"];
                const colorHex = avatarColors[index % avatarColors.length];

                const companyName = job.company || job.clientName || "Unknown";
                const initials = companyName.substring(0, 2).toUpperCase() || "J";

                const skillColors = [
                  { bg: "#FFF0F4", color: "#E0245E" },
                  { bg: "#F0F6FF", color: "#3D8BDD" },
                  { bg: "#F5F2FF", color: "#6C3EEB" },
                  { bg: "#E8F8F0", color: "#34C77B" },
                ];

                const jobBudget = job.budget_from || job.budget || 0;

                return (
                  <div key={job.id} onClick={() => onViewJob(job)} style={{ background: "white", border: "1px solid #EEEDF3", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{ width: "52px", height: "52px", background: colorHex, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "18px", fontFamily: "'Sora', sans-serif" }}>
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "18px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>{job.title || "Untitled Job"}</div>
                          <div style={{ fontSize: "13px", color: "#A39DBA", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>
                            {companyName} {job.location ? `· ${job.location}` : ""}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "18px", color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>
                        ₹{jobBudget}<span style={{ fontSize: "13px", color: "#A39DBA", fontWeight: 500 }}>/day</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", color: "#A39DBA", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>SKILLS REQUIRED</div>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {(job.skills || []).slice(0, 4).map((skill, i) => {
                          const sc = skillColors[i % skillColors.length];
                          return (
                            <div key={i} style={{ background: sc.bg, color: sc.color, padding: "6px 14px", borderRadius: "50px", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                              {skill}
                            </div>
                          );
                        })}
                        {(job.skills?.length || 0) > 4 && (
                          <div style={{ background: "#F4F4F6", color: "#8C84A8", padding: "6px 14px", borderRadius: "50px", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                            +{(job.skills.length - 4)} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description removed */}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                      <div style={{ display: "flex", gap: "20px", color: "#A39DBA", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><FiEye size={16} /> {job.views || 0} views</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><FiClock size={16} /> {job.createdAt ? timeAgo(job.createdAt) : "Just now"}</div>
                      </div>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <button onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }} style={{ width: "42px", height: "42px", borderRadius: "12px", border: "1px solid #EEEDF3", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: savedJobs?.includes(job.id) ? "#6C3EEB" : "#8C84A8", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#F5F2FF"} onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                          {savedJobs?.includes(job.id) ? <BsBookmarkFill size={18} /> : <FiBookmark size={18} />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onViewJob(job); }} style={{ background: "#6C3EEB", color: "white", border: "none", borderRadius: "50px", padding: "0 24px", height: "42px", fontWeight: 700, fontSize: "14px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#5B30D6"} onMouseLeave={(e) => e.currentTarget.style.background = "#6C3EEB"}>
                          Apply Now →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {jobs.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: "#A39DBA", fontFamily: "'DM Sans', sans-serif", border: "1px dashed #EEEDF3", borderRadius: "24px" }}>
                  No live jobs available right now.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Notifications Drawer */}
      {notifOpen && (
        <div
          onClick={() => setNotifOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "90px",
            zIndex: 999,
            background: "rgba(0,0,0,0.3)"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "480px",
              maxHeight: "70vh",
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              border: "1px solid #cfc2c2",
              marginLeft: "auto",
              marginRight: "40px",
              marginTop: "10px",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 20px",
                fontWeight: 600,
                fontSize: "16px",
                borderBottom: "1px solid #ddd",
                fontFamily: "'Sora', sans-serif"
              }}
            >
              <FiBell size={20} color="#6C3EEB" />
              <span style={{ marginLeft: 8, color: "#1A1433" }}>
                Notification ({notifications.length})
              </span>
            </div>

            {/* SECTION TITLE */}
            <div
              style={{
                padding: "12px 20px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#8C84A8",
                borderBottom: "1px solid #ddd",
                fontFamily: "'DM Sans', sans-serif",
                background: "#FAFAFA"
              }}
            >
              Recent
            </div>

            {/* BODY */}
            <div style={{ overflowY: "auto" }}>
              {notifications.length === 0 && (
                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#888",
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                >
                  No notifications yet
                </div>
              )}

              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderBottom: "1px solid #e5e5e5",
                    background: !n.read ? "#F5F2FF" : "#ffffff",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                >
                  {/* AVATAR */}
                  <img
                    src={n.senderAvatar || n.freelancerAvatar || n.profileImage || profile}
                    onError={(e) => (e.target.src = profile)}
                    alt=""
                    style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", marginRight: "14px" }}
                  />
                  {/* CONTENT */}
                  <div style={{ flex: 1, fontFamily: "'DM Sans', sans-serif" }}>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#1A1433" }}>{n.title}</div>
                    <div style={{ fontSize: "12px", color: "#4A4060", marginTop: "2px" }}>{n.freelancerName || n.first_name || n.firstName || "Applicant"}</div>
                    <div style={{ fontSize: "11px", marginTop: "4px", color: "#8C84A8" }}>{getStatusLabel(n.status, n.jobTitle)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
