import React, { useEffect, useMemo, useState } from "react";
import JobFiltersFullScreen from "./FreelancerFilter";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firbase/Firebase";

import search from "../../assets/search.png";
import eye from "../../assets/eye.png";
import clock from "../../assets/clock.png";
import saved from "../../assets/save.png";
import save from "../../assets/save2.png";
import backarrow from "../../assets/backarrow.png";
import message from "../../assets/message.png";
import notification from "../../assets/notification.png";
import profile from "../../assets/profile.png";
import Filter from "../../assets/Filter.png";
import sort from "../../assets/sort.png";

import { useNavigate } from "react-router-dom";
import "../../pages/Freelancerpage/ExploreFreelancer.responsive.css";
import { FiBell } from "react-icons/fi";

const JobSortOption = {
  BEST_MATCH: "bestMatch",
  NEWEST: "newest",
  AVAILABILITY: "availability",
};

const defaultFilters = {
  searchQuery: "",
  categories: [],
  skills: [],
  postingTime: "",
  budgetRange: { start: 0, end: 100000 },
  sortOption: JobSortOption.BEST_MATCH,
};

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const matchScore = (job, userSkills) => {
  let score = 0;
  job.skills?.forEach((s) => userSkills.includes(s) && (score += 3));
  userSkills.includes(job.category) && (score += 2);
  return score;
};

export default function ExploreFreelancer() {

  const auth = getAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const uid = user?.uid;

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedTab, setSelectedTab] = useState(0);

  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState([]);

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* ================= AUTH ================= */

  /* ================= BLOCKED USERS ================= */

  useEffect(() => {

    if (!uid) return;

    const q = query(
      collection(db, "blocked_users"),
      where("blockedBy", "==", uid)
    );

    const unsub = onSnapshot(q, (snap) => {

      const blocked = snap.docs.map(d => d.data().blockedUserId);

      setBlockedUsers(blocked);

    });

    return unsub;

  }, [uid]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, []);


  /* ================= JOBS LISTENER ================= */

  useEffect(() => {

    const qJobs = query(collection(db, "jobs"), orderBy("created_at", "desc"));
    const qFast = query(collection(db, "jobs_24h"), orderBy("created_at", "desc"));

    const unsub1 = onSnapshot(qJobs, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        source: "jobs",
        is24h: false,
        views: d.data().views || 0,
        ...d.data(),
        createdAt: d.data().created_at?.toDate?.() || null
      }));

      setJobs(prev => {
        const others = prev.filter(j => j.source !== "jobs");
        return [...others, ...data];
      });
    });

    const unsub2 = onSnapshot(qFast, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        source: "jobs_24h",
        is24h: true,
        views: d.data().views || 0,
        ...d.data(),
        createdAt: d.data().created_at?.toDate?.() || null
      }));

      setJobs(prev => {
        const others = prev.filter(j => j.source !== "jobs_24h");
        return [...others, ...data];
      });
    });

    return () => {
      unsub1();
      unsub2();
    }

  }, []);


  /* ================= USER DATA ================= */

  useEffect(() => {

    if (!uid) return;

    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      const data = snap.data() || {};
      setSavedJobs(data.favoriteJobs || []);
      setUserSkills(data.skills || []);
      setUserInfo(data);
    });

    return unsub;

  }, [uid]);


  /* ================= MESSAGES ================= */

  useEffect(() => {

    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("members", "array-contains", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      let count = 0;

      snap.forEach(d => {
        const data = d.data();
        count += data.unread?.[user.uid] || 0;
      });

      setUnreadMsgCount(count);
    });

    return unsub;

  }, [user]);


  /* ================= NOTIFICATIONS ================= */

  useEffect(() => {

    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("freelancerId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      setNotifications(items);
      setNotifCount(items.filter(n => !n.read).length);
    });

    return unsub;

  }, [user]);


  /* ================= FILTERED JOBS ================= */
const filteredJobs = useMemo(() => {

  let result = jobs.filter((job) => {

    /* BLOCKED USER JOB REMOVE */
    if (blockedUsers.includes(job.userId)) return false;

    /* SEARCH */
    if (
      filters.searchQuery &&
      !job.title?.toLowerCase().includes(filters.searchQuery.toLowerCase())
    )
      return false;

    /* TABS */
    if (selectedTab === 0 && job.is24h) return false;
    if (selectedTab === 1 && !job.is24h) return false;
    if (selectedTab === 2 && !savedJobs.includes(job.id)) return false;

    /* CATEGORY FILTER */
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(job.category)
    )
      return false;

    /* SKILLS FILTER */
    if (
      filters.skills.length > 0 &&
      !job.skills?.some((s) => filters.skills.includes(s))
    )
      return false;

    /* BUDGET FILTER */
    const budget = job.budget_from || job.budget || 0;

    if (
      budget < filters.budgetRange.start ||
      budget > filters.budgetRange.end
    )
      return false;

    /* POSTING TIME FILTER */
    if (filters.postingTime) {
      const now = Date.now();
      const jobTime = job.createdAt?.getTime() || 0;

      const diffDays = (now - jobTime) / (1000 * 60 * 60 * 24);

      if (filters.postingTime === "Posted Today" && diffDays > 1)
        return false;

      if (filters.postingTime === "Last 3 Days" && diffDays > 3)
        return false;

      if (filters.postingTime === "Last 7 Days" && diffDays > 7)
        return false;

      if (filters.postingTime === "Last 30 Days" && diffDays > 30)
        return false;
    }

    return true;
  });

  /* SORT */
  if (filters.sortOption === JobSortOption.BEST_MATCH) {
    result.sort(
      (a, b) => matchScore(b, userSkills) - matchScore(a, userSkills)
    );
  }

  if (filters.sortOption === JobSortOption.NEWEST) {
    result.sort(
      (a, b) =>
        (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  return result;

}, [jobs, filters, selectedTab, savedJobs, userSkills, blockedUsers]);
  /* ================= SAVE JOB ================= */

  const toggleSave = async (e, jobId) => {

    e.stopPropagation();
    if (!uid) return;

    await updateDoc(doc(db, "users", uid), {
      favoriteJobs: savedJobs.includes(jobId)
        ? arrayRemove(jobId)
        : arrayUnion(jobId)
    });

  };


  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "140px" : "210px",
        transition: "margin-left 0.25s ease",
        overflowX: "hidden",
        maxWidth: "100vw",
        boxSizing: "border-box",
        marginTop: "60px",
        width: "80%",
      }}
    >
      <div
        className="job-search"
        style={{
          width: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* ================= HEADER ================= */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              onClick={() => navigate(-1)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 14,
                border: "0.8px solid #E0E0E0",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                // boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                flexShrink: 0,
              }}
            >
              <img
                src={backarrow}
                alt="Back"
                style={{
                  width: 16,
                  height: 18,
                  objectFit: "contain",
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: 32, fontWeight: 400 }}>
                Explore Freelancer
              </div>
            </div>
          </div>

          <div
            className="top-icons"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginRight: "20px",
              paddingRight: "20px",
            }}
          >
            <div
              className="top-icon"
              onClick={() =>
                navigate("/freelance-dashboard/freelancermessages")
              }
              style={{ position: "relative", cursor: "pointer" }}
            >
              <img src={message} alt="Messages" />
              {unreadMsgCount > 0 && (
                <span
                  className="dot"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    background: "red",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>

            <div
              className="top-icon"
              style={{ position: "relative", cursor: "pointer" }}
            >
              <img
                src={notification}
                onClick={() => setNotifOpen((p) => !p)}
                alt="Notifications"
              />
              {notifCount > 0 && (
                <span
                  className="dot"
                  style={{

                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    background: "red",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>

          </div>
        </div>

        {/* ================= NOTIFICATION DROPDOWN ================= */}
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
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "480px",
                maxHeight: "70vh",
                background: "#f2f2f2",
                borderRadius: "20px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #cfc2c2",
                marginLeft: "750px",
                marginTop: "50px",
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
                }}
              >
                <FiBell size={20} />
                <span style={{ marginLeft: 8 }}>
                  Notification ({notifications.length})
                </span>
              </div>

              {/* SECTION TITLE */}
              <div
                style={{
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#555",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Applicant
              </div>

              {/* BODY */}
              <div style={{ overflowY: "auto" }}>
                {notifications.length === 0 && (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    No notifications yet
                  </div>
                )}

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderBottom: "1px solid #e5e5e5",
                      background: !n.read ? "#ffffff" : "#f8f8f8",
                    }}
                  >
                    {/* AVATAR */}
                    <img
                      src={n.profileImage || profile}
                      alt=""
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "14px",
                      }}
                    />

                    {/* CONTENT */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "15px" }}>
                        {n.title}
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#777",
                        }}
                      >
                        {n.subtitle || "Applicant"}
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          marginTop: "4px",
                          color: "#555",
                        }}
                      >
                        {n.body}
                      </div>
                    </div>


                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SEARCH + FILTER ================= */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "96%",
            marginLeft: isMobile ? "10px" : "0px",
            marginTop: "20px",
          }}
        >
          {/* SEARCH BOX */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flex: 1,
              padding: "clamp(9px, 3vw, 10px) 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "#fff",
              height: "50px"
            }}
          >
            <img
              src={search}
              alt="search"
              style={{
                width: 18,
                height: 18,
                opacity: 0.6,
                flexShrink: 0,

              }}
            />

            <input

              placeholder="Search job"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "clamp(13px, 3.5vw, 14px)",
                background: "transparent",
                marginTop: "14px",
                marginLeft: "-15px"
              }}
            />
          </div>


        </div>


        {/* ================= TABS ================= */}
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            gap: 8,
            padding: "clamp(6px, 2.5vw, 8px)",
            margin: "12px auto",
            borderRadius: 16,
            // boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            border: "1px solid #0e02020e",
            width: "96%",
            maxWidth: 1540,
            overflowX: "auto",
            marginLeft: '1px',
            marginTop: "40px",


          }}
        >
          {["Work", "24 Hours", "Saved"].map((t, i) => {
            const isActive = selectedTab === i;

            return (
              <button
                key={i}
                onClick={() => setSelectedTab(i)}
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "clamp(8px, 3vw, 10px) clamp(18px, 6vw, 42px)",
                  borderRadius: 999,
                  fontSize: "clamp(12px, 3.5vw, 14px)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",

                  // 🔥 THIS IS THE FIX
                  color: isActive ? "#FFFFFF" : "#333",

                  background: isActive ? "#7C3CFF" : "transparent",
                  // boxShadow: isActive
                  //   ? "0 6px 20px rgba(0,0,0,0.19)"
                  //   : "none",
                  transition: "all 0.25s ease",
                  flexShrink: 0,
                }}
              >
                {t}
              </button>
            );
          })}

        </div>
        <div
          className="filter-sort-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
            padding: "12px 26px",
          }}
        >

          {/* ================= FILTER ================= */}
          <div
            className="filter-btn"
            onClick={() => setShowFilter(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              marginTop: "7px",
              marginRight: "5px",
            }}
          >

            <img
              src={Filter}
              alt="filter"
              style={{
                width: 18,
                height: 18,
                opacity: 0.7,
              }}
            />
            <span>Filter</span>
          </div>

          {/* ================= SORT ================= */}
          <div
            className="sort-btnn"
            onClick={() => setShowSort(!showSort)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              marginTop: "7px",
              marginRight: "40px",
              justifyContent: "flex-end",

            }}
          >

            <img
              src={sort}
              alt="sort"
              style={{
                width: 18,
                height: 18,
                opacity: 0.7,

              }}
            />
            <span>Sort</span>
          </div>
        </div>


        {showSort && (
          <div
            style={{
              marginTop: 0,
              marginLeft: "810px",
              display: "flex",
              gap: "10px",
              background: "#fff",
              padding: "10px",
              borderRadius: "20px",
              // boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              border: "1px solid #0e02020e",
              width: "fit-content",

            }}
          >
            {Object.values(JobSortOption).map((opt) => {
              const active = filters.sortOption === opt;

              return (
                <button
                  key={opt}
                  onClick={() => {
                    setFilters({ ...filters, sortOption: opt });
                    setShowSort(false);
                  }}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "14px",
                    border: "none",
                    background: active ? "#7C3AED" : "#F3F4F6",
                    color: active ? "#fff" : "#000",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    // boxShadow: active
                    //   ? "0 6px 14px rgba(124,58,237,0.5)"
                    //   : "none",
                    transition: "all 0.25s ease",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

        )}
        {/* ================= JOB LIST ================= */}
        <div
          className="jobs"
          style={{
            width: "100%",
            overflowX: "hidden",
            marginLeft: isMobile ? "30px" : "0px",
          }}
        >

          {filteredJobs.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.6 }}>
              No jobs found
            </div>
          )}

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
              onClick={() =>
                navigate(`/freelance-dashboard/job-full/${job.id}`, {
                  state: job,
                })
              }
              style={{
                marginTop: 20,
                background: "#fff",
                borderRadius: 20,
                padding: 22,
                marginBottom: 18,
                width: "97%",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >

              {/* ===== HEADER ===== */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >

                <div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: "#222",
                    }}
                  >
                    {job.title}
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      color: "#777",
                      marginTop: 4,
                    }}
                  >
                    ₹{job.budget_from || job.budget} - ₹{job.budget_to || job.budget}
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                  onClick={(e) => toggleSave(e, job.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={savedJobs.includes(job.id) ? saved : save}
                    alt="save"
                    width={20}
                  />
                </button>
              </div>


              {/* ===== SKILLS ===== */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 14, color: "gray" }}>
                  Skills Required
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 10,
                  }}
                >
                  {(job.skills || []).slice(0, 3).map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      style={{
                        background: "#FFF3A0",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {skill}
                    </span>
                  ))}

                  {(job.skills?.length || 0) > 3 && (
                    <span
                      style={{
                        background: "#FFF3A0",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {job.skills.length - 3}+
                    </span>
                  )}
                </div>
              </div>


              {/* ===== DESCRIPTION ===== */}
              <p
                style={{
                  marginTop: 14,
                  fontSize: 14,
                  color: "#444",
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {job.description}
              </p>


              {/* ===== FOOTER ===== */}
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 16,
                  fontSize: 13,
                  color: "#666",
                }}
              >

                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <img src={eye} width={14} alt="views" />
                  {job.views || 0} Impression
                </span>

                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <img src={clock} width={14} alt="time" />
                  {timeAgo(job.createdAt)}
                </span>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ================= FILTER POPUP ================= */}
      {showFilter && (
        <JobFiltersFullScreen
          currentFilters={filters}
          onApply={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
            }));
          }}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}