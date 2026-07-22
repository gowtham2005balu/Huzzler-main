// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ArrowLeft,
//   Bell,
//   MessageCircle,
//   Search,
//   Filter,
//   Grid,
//   Bookmark,
//   Plus,
//   X,
// } from "lucide-react";
// import Sidebar from "../pages/components/Sidebar";

// export default function MyJobs() {
//   const [jobs, setJobs] = useState([]);
//   const [activeMainTab, setActiveMainTab] = useState("Applied");
//   const [activeSubTab, setActiveSubTab] = useState("Work");
//   const [showSort, setShowSort] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedJob, setSelectedJob] = useState(null);

//   // ========= FETCH JOBS FROM API ==========
//   // useEffect(() => {
//   //   const fetchJobs = async () => {
//   //     try {
//   //       const res = await axios.get(
//   //         "http://localhost:5000/api/jobProposal/getAllJobProposal"
//   //       );

//   //       console.log("API RAW DATA:", res.data);

//   //       // Backend array → map UI fields
//   //       const formatted = res.data.map((job) => ({
//   //         _id: job._id,
//   //         title: job.JobTitle || "Untitled Job",
//   //         role: job.Category || "No Role",
//   //         description: job.Des || "",
//   //         skills: job.Skills || [],
//   //         salary: `₹${job.minprice} - ₹${job.maxprice}`,
//   //         impressions: job.toot?.length || 0,
//   //         status: "Applied", // 🔥 backend doesn't send → UI needs this
//   //       }));

//   //       setJobs(formatted);

//   //     } catch (error) {
//   //       console.error("Error loading jobs:", error);
//   //     }
//   //   };

//   //   fetchJobs();
//   // }, []);
// useEffect(() => {
//   const fetchJobs = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/jobProposal/getAllJobProposal"
//       );

//       console.log("API RAW DATA:", res.data);

//       // backend → { JobProposal: [...] }
//       const jobArray = res.data.JobProposal || [];

//       const formatted = jobArray.map((job) => ({
//         _id: job._id,
//         title: job.JobTitle || "Untitled Job",
//         role: job.Category || "No Role",
//         description: job.Des || "",
//         skills: job.Skills || [],
//         salary: `₹${job.minprice} - ₹${job.maxprice}`,
//         impressions: job.toot?.length || 0,
//         status: "Applied", // backend doesn't send → UI needs this
//       }));

//       setJobs(formatted);

//     } catch (error) {
//       console.error("Error loading jobs:", error);
//     }
//   };

//   fetchJobs();
// }, []);


//   const visibleJobs = jobs.filter((j) => j.status === activeMainTab);

//   const openModal = (job) => {
//     setSelectedJob(job);
//     setShowModal(true);
//     document.body.style.overflow = "hidden";
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedJob(null);
//     document.body.style.overflow = "auto";
//   };

//   console.log(visibleJobs)
//   return (
//     <>
//       <div className="page-root">
//         <Sidebar />

//         <main className="content">
//           {/* HEADER */}
//           <div className="header">
//             <div className="left">
//               <button className="back-btn">
//                 <ArrowLeft size={20} />
//               </button>
//               <h1 className="page-title">My Jobs</h1>
//             </div>

//             <div className="right">
//               <div className="header-icons">
//                 <MessageCircle size={20} />
//                 <Bell size={20} />
//                 <div className="avatar">A</div>
//               </div>
//             </div>
//           </div>

//           {/* MAIN TABS */}
//           <div className="status-tabs">
//             <button
//               className={`status-pill ${activeMainTab === "Applied" ? "active" : ""}`}
//               onClick={() => setActiveMainTab("Applied")}
//             >
//               Applied
//             </button>

//             <button
//               className={`status-pill ${activeMainTab === "Accepted" ? "active" : ""}`}
//               onClick={() => setActiveMainTab("Accepted")}
//             >
//               Accepted
//             </button>
//           </div>

//           {/* SEARCH + TABS */}
//           <div className="top-controls">
//             <div className="search-wrap">
//               <div className="search-box">
//                 <Search size={18} />
//                 <input placeholder="Search" />
//               </div>
//             </div>

//             <div className="category-row">
//               {["Work", "24 Hours", "Saved"].map((t) => (
//                 <button
//                   key={t}
//                   className={`subtab ${activeSubTab === t ? "active" : ""}`}
//                   onClick={() => setActiveSubTab(t)}
//                 >
//                   {t}
//                 </button>
//               ))}

//               <div className="right-actions">
//                 <div className="action">
//                   <Filter size={18} />
//                   <span>Filter</span>
//                 </div>

//                 <div className="action" onClick={() => setShowSort(!showSort)}>
//                   <Grid size={18} />
//                   <span>Sort</span>
//                 </div>
//               </div>
//             </div>

//             {showSort && (
//               <div className="sort-popup">
//                 {["Best Match", "Popularity", "Hourly Rate", "Newest"].map(
//                   (x) => (
//                     <div className="sort-item" key={x}>
//                       {x}
//                     </div>
//                   )
//                 )}
//               </div>
//             )}
//           </div>

//           {/* RESULTS */}
//           <div className="result-count">{visibleJobs.length} Results</div>

//           {/* JOB CARDS */}
//           <div className="cards-grid">
//             {visibleJobs.length === 0 && (
//               <p>No Jobs Found.</p>
//             )}

//             {visibleJobs.map((job) => (
//               <article key={job._id} className="job-card" onClick={() => openModal(job)}>
//                 <div className="card-top">
//                   <div className="logo">Z</div>

//                   <div className="meta">
//                     <h3 className="job-title">{job.title}</h3>
//                     <div className="job-role">{job.role}</div>
//                   </div>

//                   <div className="price">{job.salary}</div>
//                 </div>

//                 <div className="skills">
//                   {job.skills.map((s, i) => (
//                     <span key={i} className="chip">{s}</span>
//                   ))}
//                 </div>

//                 <p className="desc">{job.description}</p>

//                 <div className="card-bottom">
//                   <div className="card-left">
//                     <span className="meta-small">👁 {job.impressions} Impressions</span>
//                   </div>

//                   <button className="bookmark" onClick={(e) => e.stopPropagation()}>
//                     <Bookmark size={18} />
//                   </button>
//                 </div>
//               </article>
//             ))}
//           </div>

//           {/* FLOAT ADD */}
//           <button className="float">
//             <Plus size={22} />
//           </button>
//         </main>
//       </div>

//       {/* MODAL */}
//       {showModal && selectedJob && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <button className="modal-x" onClick={closeModal}>
//               <X size={20} />
//             </button>

//             <p className="modal-sub">Project Details</p>
//             <h2 className="modal-title">{selectedJob.title}</h2>
//             <div className="modal-role">{selectedJob.role}</div>

//             <h4 className="section">Skills Required</h4>
//             <div className="skill-row">
//               {selectedJob.skills.map((s, i) => (
//                 <span className="yellow" key={i}>{s}</span>
//               ))}
//             </div>

//             <h4 className="section">Project Description</h4>
//             <p className="modal-desc">{selectedJob.description}</p>

//             <button className="apply">Apply Now</button>
//           </div>
//         </div>
//       )}

//       {/* ⬇ FULL CSS SAME FILE */}
//       <style>{`
//         .page-root { display:flex; min-height:100vh; background:linear-gradient(to bottom,#FFF7C9,#fff);}
//         .content { margin-left:17rem; flex:1; padding:2.2rem; padding-top:3.2rem; }

//         .header { display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.6); padding:0.7rem 0; position:sticky; top:0; backdrop-filter:blur(20px); }
//         .avatar { width:36px; height:36px; background:#7C3AED; color:#fff; border-radius:50%; display:flex; justify-content:center; align-items:center; }

//         .status-tabs { display:flex; gap:1rem; margin:1rem 0; }
//         .status-pill { padding:0.55rem 1.2rem; border-radius:999px; background:#fff; box-shadow:0 3px 10px rgba(0,0,0,0.1); border:none; }
//         .status-pill.active { background:linear-gradient(90deg,#A855F7,#7C3AED); color:#fff; }

//         .search-box { background:#fff; padding:0.85rem; border-radius:14px; display:flex; gap:0.6rem; box-shadow:0 5px 18px rgba(0,0,0,0.08); }

//         .cards-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.6rem; }
//         .job-card { background:#fff; padding:1.4rem; border-radius:16px; box-shadow:0 9px 28px rgba(0,0,0,0.08); cursor:pointer; }

//         .skills { margin-top:0.8rem; display:flex; flex-wrap:wrap; gap:0.5rem; }
//         .chip { background:#F4EEFF; color:#7C3AED; padding:0.3rem 0.6rem; border-radius:10px; }

//         .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); display:flex; justify-content:center; padding-top:60px; }
//         .modal { width:640px; background:#fff; padding:2.2rem; border-radius:18px; }
//         .apply { width:100%; padding:1rem; background:linear-gradient(90deg,#A855F7,#7C3AED); border:none; color:white; border-radius:12px; margin-top:1.2rem; }

//       `}</style>
//     </>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../firbase/Firebase";
import {
  Search,
  Bell,
  Star,
  Eye,
  CheckCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
} from "lucide-react";
import Sidebar from "./Freelancerpage/components/Sidebar";

import profilePlaceholder from "../assets/profile.png";
import MyServicesIcon from "../assets/MyServices.png";
import MyJobsIcon from "../assets/myjobs.png";
import notificationIcon from "../assets/notification.png";
import settingsIcon from "../assets/settings.png";
import LogoutIcon from "../assets/logout.png";

export default function MyJobs() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [jobs, setJobs] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [activeTab, setActiveTab] = useState("All Status");
  useEffect(() => {
    const fetchJobs = () => {
      const email = localStorage.getItem("userEmail") || auth.currentUser?.email;
      if (!email) return;

      const q = query(collection(db, "services"), where("userEmail", "==", email));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const formatted = snapshot.docs.map(docSnap => {
          const job = docSnap.data();
          return {
            _id: docSnap.id,
            title: job.title || "Untitled Job",
            role: job.category || "No Role",
            description: job.description || "",
            skills: job.skills || [],
            salary: job.price ? `₹${job.price}` : "Negotiable",
            impressions: job.views || 0,
            status: "Active",
            delivery: job.deliveryDays ? `${job.deliveryDays} delivery` : "Delivery timeframe not set",
            createdAt: job.createdAt
          };
        });

        // Sort by createdAt descending locally
        formatted.sort((a, b) => {
           const timeA = a.createdAt?.seconds || 0;
           const timeB = b.createdAt?.seconds || 0;
           return timeB - timeA;
        });

        setJobs(formatted);
      }, (error) => {
        console.error("Fetch jobs error:", error);
      });

      return unsubscribe;
    };

    let unsubscribe;
    const timeoutId = setTimeout(() => {
       unsubscribe = fetchJobs();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
    };
  }, [auth.currentUser]);

  // ================= PROFILE FETCH =================
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) return;
      const userRef = doc(db, "users", currentUser.uid);
      const unsubUser = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          setProfileData(snap.data());
        }
      });
      return () => unsubUser();
    });
    return unsubscribeAuth;
  }, [auth]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/firelogin");
    } catch (err) {
      navigate("/firelogin");
    }
  };

  const fullName = `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() || "Helen Angel";
  const initials = `${(profileData.first_name || "H")[0]}${(profileData.last_name || "A")[0]}`.toUpperCase();

  const colors = ["#7C4EF5", "#10B981", "#F97316", "#EAB308", "#3B82F6"];

  return (
    <div className="myservices-layout">
      <Sidebar />
      <main className="myservices-main">
        {/* TOP HEADER */}
        <div className="myservices-topbar">
          <div className="myservices-search-container">
            <Search size={16} color="#9CA3AF" />
            <input type="text" placeholder="Search freelancers, jobs, services..." />
          </div>
          <div className="myservices-topbar-right">
            <button className="myservices-ai-btn">
              <Star size={14} /> AI Assistant
            </button>
            <button className="myservices-icon-btn">
              <Bell size={18} />
              <span className="bell-dot"></span>
            </button>
            <div className="myservices-avatar">{initials}</div>
          </div>
        </div>

        {/* PROFILE HERO */}
        <div className="myservices-hero-wrap">
          <div className="myservices-header-titles">
            <h1>Profile</h1>
            <p>Manage your public profile and portfolio.</p>
          </div>

          <div className="myservices-hero-banner">
            <div className="myservices-hero-left">
              <div className="myservices-hero-avatar">
                {profileData.profileImage ? (
                  <img src={profileData.profileImage} alt="" />
                ) : (
                  initials
                )}
                <div className="verified-badge">✓</div>
              </div>
              <div className="myservices-hero-info">
                <h2>{fullName}</h2>
                <p>{profileData.professional_title || "UI/UX Designer • Freelancer"}</p>
                <div className="myservices-hero-stats">
                  <div className="stat-pill">📍 {profileData.location || "Chennai, India"}</div>
                  <div className="stat-pill"><strong>{profileData.skills?.length || 47}</strong> Projects</div>
                  <div className="stat-pill"><span className="star-icon">★</span> 4.9 Rating</div>
                </div>
              </div>
            </div>
            <div className="myservices-hero-actions">
              <button onClick={() => navigate("/freelance-dashboard/accountfreelancer", { state: { activeTab: "Profile Summary" } })} className="btn-outline-white">Edit Profile</button>
              <button className="btn-yellow">Share Profile</button>
            </div>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="myservices-content-row">
          {/* LEFT SIDEBAR (NESTED) */}
          <div className="myservices-inner-sidebar">
            {[
              ["Profile Summary", profilePlaceholder, () => navigate("/freelance-dashboard/accountfreelancer", { state: { activeTab: "Profile Summary" } })],
              ["Saved", MyServicesIcon, "/freelance-dashboard/sidebarsaved"],
              ["My Services", MyServicesIcon, () => navigate("/freelance-dashboard/accountfreelancer", { state: { activeTab: "My Services" } })],
              ["My Works", MyJobsIcon, "/freelance-dashboard/freelancermyworks"],
              ["Paused Services", MyServicesIcon, () => navigate("/freelance-dashboard/accountfreelancer", { state: { activeTab: "Paused Services" } })],
              ["Notifications", notificationIcon, "/freelance-dashboard/notifications"],
              ["Account Settings", settingsIcon, "/freelance-dashboard/settings"],
              ["Sign Out", LogoutIcon, handleLogout, { color: "#EF4444" }],
            ].map(([t, ic, path, customStyle], idx) => {
              const isActive = t === "My Services";
              return (
                <div
                  key={idx}
                  className={`inner-menu-item ${isActive ? "active" : ""}`}
                  style={customStyle || {}}
                  onClick={() => typeof path === "function" ? path() : navigate(path)}
                >
                  <div className="menu-item-left">
                    <img src={ic} alt="" className={isActive ? "icon-active" : ""} />
                    <span>{t}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT CONTENT */}
          <div className="myservices-right-content">
            <div className="myservices-box">
              <div className="myservices-box-header">
                <div>
                  <h2>My Services</h2>
                  <p>Manage and track all your active service listings</p>
                </div>
                <button className="btn-primary">+ Create New Service</button>
              </div>

              {/* STATS ROW */}
              <div className="myservices-stats-row">
                <div className="stat-box">
                  <div className="icon-wrapper bg-purple">
                    <MyServicesIcon />
                    {/* Placeholder icon since MyServicesIcon is an image */}
                    <div style={{width: 20, height: 20, background: "#7C4EF5", WebkitMask: `url(${MyServicesIcon}) center/contain no-repeat`}}></div>
                  </div>
                  <p className="stat-label">ACTIVE SERVICES</p>
                  <h3>{jobs.length || 8}</h3>
                  <span className="stat-sub">2 paused</span>
                </div>
                <div className="stat-box">
                  <div className="icon-wrapper bg-blue">
                    <Eye size={18} color="#3B82F6" />
                  </div>
                  <p className="stat-label">TOTAL VIEWS</p>
                  <h3>2,841</h3>
                  <span className="stat-sub green-text">+15% this week</span>
                </div>
                <div className="stat-box">
                  <div className="icon-wrapper bg-yellow">
                    <CheckCircle size={18} color="#EAB308" />
                  </div>
                  <p className="stat-label">PENDING REQUESTS</p>
                  <h3>4</h3>
                  <span className="stat-sub">Awaiting review</span>
                </div>
              </div>

              {/* FILTERS */}
              <div className="myservices-filters">
                <button className={`filter-btn ${activeTab === "All Status" ? "active" : ""}`} onClick={() => setActiveTab("All Status")}>All Status</button>
                <button className={`filter-btn ${activeTab === "All Categories" ? "active" : ""}`} onClick={() => setActiveTab("All Categories")}>All Categories</button>
                <button className={`filter-btn ${activeTab === "Price Range" ? "active" : ""}`} onClick={() => setActiveTab("Price Range")}>Price Range</button>
              </div>

              {/* CARDS GRID */}
              <div className="myservices-grid">
                {jobs.slice(0, 3).map((job, idx) => {
                  const bg = colors[idx % colors.length];
                  return (
                    <div key={job._id || idx} className="service-card">
                      <div className="card-top-half" style={{ background: bg }}>
                        <h4>{job.role}</h4>
                      </div>
                      <div className="card-bottom-half">
                        <h3 className="service-title">{job.title}</h3>
                        <p className="service-price">{job.salary} <span>/project</span></p>
                        
                        <div className="service-meta-row">
                          <span className="meta-item"><Clock size={12} /> {job.delivery}</span>
                          <span className="meta-item"><Eye size={12} /> {job.impressions} views</span>
                        </div>

                        <div className="service-status-row">
                          <span className="status-label">Status</span>
                          <div className="status-toggle-wrap">
                            <span className="status-text active">Active</span>
                            <div className="toggle active"></div>
                          </div>
                        </div>

                        <div className="service-actions">
                          <button className="action-btn"><Edit2 size={14} /> Edit</button>
                          <div className="divider-vert"></div>
                          <button className="action-btn"><X size={14} /> Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </main>

      <style>{`
        .myservices-layout {
          display: flex;
          min-height: 100vh;
          background-color: #F7F7F9;
          font-family: 'DM Sans', sans-serif;
        }

        .myservices-main {
          flex: 1;
          margin-left: 17rem; /* matches sidebar width */
          padding: 24px 40px;
          box-sizing: border-box;
          max-width: 100%;
        }

        @media (max-width: 1024px) {
          .myservices-main {
            margin-left: 0;
            padding: 24px 20px;
          }
        }

        /* Top Header */
        .myservices-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .myservices-search-container {
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 0 16px;
          width: 400px;
          height: 44px;
        }

        .myservices-search-container input {
          border: none;
          outline: none;
          margin-left: 8px;
          width: 100%;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
        }

        .myservices-topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .myservices-ai-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: #7C4EF5;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        .myservices-icon-btn {
          background: white;
          border: 1px solid #E5E7EB;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4B5563;
          cursor: pointer;
          position: relative;
        }

        .bell-dot {
          position: absolute;
          top: 8px;
          right: 10px;
          width: 6px;
          height: 6px;
          background: #EF4444;
          border-radius: 50%;
        }

        .myservices-avatar {
          background-color: #7C4EF5;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        /* Profile Hero */
        .myservices-hero-wrap {
          margin-bottom: 24px;
        }

        .myservices-header-titles h1 {
          font-size: 24px;
          font-weight: 700;
          color: #111;
          margin: 0;
          font-family: 'Sora', sans-serif;
        }

        .myservices-header-titles p {
          font-size: 14px;
          color: #6B7280;
          margin: 4px 0 20px 0;
        }

        .myservices-hero-banner {
          width: 100%;
          background: linear-gradient(90deg, rgba(108, 77, 255, 1) 0%, rgba(155, 125, 255, 1) 100%);
          border-radius: 22px;
          display: flex;
          align-items: center;
          padding: 24px 32px;
          box-sizing: border-box;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        .myservices-hero-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .myservices-hero-avatar {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 36px;
          font-weight: 600;
          border: 2px solid rgba(255,255,255,0.5);
          flex-shrink: 0;
        }

        .myservices-hero-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .verified-badge {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          background: #FDE047;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #111;
          font-size: 12px;
          border: 2px solid #fff;
        }

        .myservices-hero-info h2 {
          color: #fff;
          font-size: 24px;
          margin: 0 0 4px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
        }

        .myservices-hero-info p {
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          margin: 0 0 12px;
        }

        .myservices-hero-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .stat-pill {
          background: rgba(255,255,255,0.2);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .star-icon { color: #FDE047; }

        .myservices-hero-actions {
          display: flex;
          gap: 12px;
        }

        .btn-outline-white {
          padding: 8px 24px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-yellow {
          padding: 8px 24px;
          border-radius: 999px;
          border: none;
          background: #FDE047;
          color: #111;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Two Column Layout */
        .myservices-content-row {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .myservices-inner-sidebar {
          width: 240px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .inner-menu-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          border-radius: 8px;
          color: #4B5563;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s;
        }

        .inner-menu-item.active {
          background: #EFE8FF;
          color: #7C4EF5;
          font-weight: 600;
        }

        .inner-menu-item:hover:not(.active) {
          background: rgba(124, 78, 245, 0.05);
        }

        .menu-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .menu-item-left img {
          width: 18px;
          opacity: 0.6;
        }

        .icon-active {
          opacity: 1 !important;
          filter: invert(35%) sepia(87%) saturate(2462%) hue-rotate(242deg) brightness(98%) contrast(93%);
        }

        .myservices-right-content {
          flex: 1;
          min-width: 0;
        }

        .myservices-box {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #E5E7EB;
          padding: 32px;
        }

        .myservices-box-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .myservices-box-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #111;
          margin: 0 0 8px;
          font-family: 'Sora', sans-serif;
        }

        .myservices-box-header p {
          font-size: 14px;
          color: #6B7280;
          margin: 0;
        }

        .btn-primary {
          background: #7C4EF5;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        .myservices-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-box {
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 20px;
          background: #fff;
        }

        .icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .bg-purple { background: #EFE8FF; }
        .bg-blue { background: #EFF6FF; }
        .bg-yellow { background: #FEFCE8; }

        .stat-label {
          font-size: 11px;
          font-weight: 700;
          color: #9CA3AF;
          margin: 0 0 8px 0;
          letter-spacing: 0.5px;
        }

        .stat-box h3 {
          font-size: 24px;
          font-weight: 700;
          color: #111;
          margin: 0 0 4px;
        }

        .stat-sub {
          font-size: 12px;
          color: #6B7280;
        }

        .green-text {
          color: #10B981;
          font-weight: 500;
        }

        .myservices-filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .filter-btn {
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid #E5E7EB;
          background: #fff;
          color: #4B5563;
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        .filter-btn.active {
          background: #EFE8FF;
          color: #7C4EF5;
          border-color: #EFE8FF;
          font-weight: 600;
        }

        /* Cards Grid */
        .myservices-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .service-card {
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          display: flex;
          flex-direction: column;
        }

        .card-top-half {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          text-align: center;
        }

        .card-top-half h4 {
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          font-weight: 500;
          margin: 0;
        }

        .card-bottom-half {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .service-title {
          font-size: 15px;
          font-weight: 700;
          color: #111;
          margin: 0 0 8px 0;
          font-family: 'Sora', sans-serif;
          line-height: 1.4;
        }

        .service-price {
          font-size: 15px;
          font-weight: 700;
          color: #7C4EF5;
          margin: 0 0 16px 0;
        }

        .service-price span {
          font-size: 12px;
          color: #9CA3AF;
          font-weight: 500;
        }

        .service-meta-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6B7280;
          font-weight: 500;
        }

        .service-status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .status-label {
          font-size: 12px;
          color: #6B7280;
        }

        .status-toggle-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-text {
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
        }

        .status-text.active { color: #10B981; }

        .toggle {
          width: 32px;
          height: 18px;
          background: #E5E7EB;
          border-radius: 10px;
          position: relative;
          cursor: pointer;
        }

        .toggle::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          background: #fff;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .toggle.active { background: #7C4EF5; }
        .toggle.active::after { transform: translateX(14px); }

        .service-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid #F3F4F6;
          padding-top: 16px;
          margin-top: auto;
          gap: 16px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #4B5563;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        .divider-vert {
          width: 1px;
          height: 16px;
          background: #E5E7EB;
        }

        @media (max-width: 1024px) {
          .myservices-content-row {
            flex-direction: column;
          }
          .myservices-inner-sidebar {
            width: 100%;
          }
          .myservices-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .myservices-grid {
            grid-template-columns: 1fr;
          }
          .myservices-stats-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
