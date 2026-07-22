import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Search, Grid, Play, Globe, Users, Clock, Calendar, DollarSign, Eye, Bookmark, MoreHorizontal, ChevronLeft, Edit, Share2, X, Star, BarChart2 } from "lucide-react";

import { db } from "../../firbase/Firebase";

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);
  React.useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  return isMobile;
}

if (!String.prototype.hashCode) {
  String.prototype.hashCode = function () {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
      hash = (hash << 5) - hash + this.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };
}

function formatBudget(value) {
  if (value == null) return "0";
  const num = Number(value) || 0;
  if (num >= 100000) return (num / 100000).toFixed(1) + "L";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return String(num);
}

// Map a string to a stable light background color
const getIconBg = (str) => {
  const colors = ["#EEF2FF", "#FEF2F2", "#ECFDF5", "#FFFBEB", "#F5F3FF"];
  const hash = Math.abs(str?.hashCode?.() || 0);
  return colors[hash % colors.length];
};
const getIconColor = (str) => {
  const colors = ["#6366F1", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];
  const hash = Math.abs(str?.hashCode?.() || 0);
  return colors[hash % colors.length];
};

export default function AddJobScreen() {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const isMobile = useIsMobile();

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  const [selectedTab, setSelectedTab] = useState("Active"); // "Active" | "Paused" | "Draft"
  const [searchText, setSearchText] = useState("");
  const [selectedJob, setSelectedJob] = useState(null); // Used for split screen view

  const [worksJobs, setWorksJobs] = useState([]);
  const [jobs24h, setJobs24h] = useState([]);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [loading24h, setLoading24h] = useState(true);

  const [pausedWorksJobs, setPausedWorksJobs] = useState([]);
  const [paused24hJobs, setPaused24hJobs] = useState([]);

  const [savedJobIds, setSavedJobIds] = useState([]);
  const [activeDropdownJobId, setActiveDropdownJobId] = useState(null);

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // Fetch Jobs
  useEffect(() => {
    if (!currentUser) return;

    // Works jobs
    const unsubWorks = onSnapshot(
      query(collection(db, "jobs"), where("userId", "==", currentUser.uid)),
      (snapshot) => {
        setWorksJobs(snapshot.docs.map((d) => ({ id: d.id, ...d.data(), is24h: false })));
        setLoadingWorks(false);
      },
      (err) => setLoadingWorks(false)
    );

    // 24h jobs
    const unsub24h = onSnapshot(
      query(collection(db, "jobs_24h"), where("userId", "==", currentUser.uid)),
      (snapshot) => {
        setJobs24h(snapshot.docs.map((d) => ({ id: d.id, ...d.data(), is24h: true })));
        setLoading24h(false);
      },
      (err) => setLoading24h(false)
    );

    // Paused works
    const unsubPausedWorks = onSnapshot(
      query(collection(db, "pausedJobs"), where("userId", "==", currentUser.uid), where("is24", "==", false)),
      (snapshot) => setPausedWorksJobs(snapshot.docs.map((d) => ({ id: d.id, ...d.data(), is24h: false })))
    );

    // Paused 24h
    const unsubPaused24h = onSnapshot(
      query(collection(db, "pausedJobs"), where("userId", "==", currentUser.uid), where("is24", "==", true)),
      (snapshot) => setPaused24hJobs(snapshot.docs.map((d) => ({ id: d.id, ...d.data(), is24h: true })))
    );

    return () => {
      unsubWorks && unsubWorks();
      unsub24h && unsub24h();
      unsubPausedWorks && unsubPausedWorks();
      unsubPaused24h && unsubPaused24h();
    };
  }, [currentUser]);

  // Fetch Saved Job IDs for the client
  useEffect(() => {
    if (!currentUser) return;
    const unsubUser = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setSavedJobIds(docSnap.data().favoriteJobs || []);
      }
    });
    return () => unsubUser();
  }, [currentUser]);

  // Click outside to close dropdown menu
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownJobId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Combine and Filter
  const filterAndSort = (list) => {
    let data = [...list];
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      data = data.filter((job) => {
        const title = (job.title || "").toLowerCase();
        const skills = (job.skills || []).join(" ").toLowerCase();
        const tools = (job.tools || []).join(" ").toLowerCase();
        return title.includes(q) || skills.includes(q) || tools.includes(q);
      });
    }
    // Sort Newest first
    data.sort((a, b) => {
      const timeA = a.created_at?.seconds || a.created_at || 0;
      const timeB = b.created_at?.seconds || b.created_at || 0;
      return timeB - timeA;
    });
    return data;
  };

  const activeJobs = useMemo(() => filterAndSort([...worksJobs, ...jobs24h]), [worksJobs, jobs24h, searchText]);
  const pausedJobs = useMemo(() => filterAndSort([...pausedWorksJobs, ...paused24hJobs]), [pausedWorksJobs, paused24hJobs, searchText]);
  const draftJobs = []; // Mocks for now as backend doesn't have drafts

  const getDisplayedJobs = () => {
    if (selectedTab === "Active") return activeJobs;
    if (selectedTab === "Paused") return pausedJobs;
    if (selectedTab === "Draft") return draftJobs;
    return [];
  };

  const handleOpenPostJob = () => {
    navigate("/client-dashbroad2/PostJob", { state: { jobData: {} } });
  };

  const handleEditJob = (job) => {
    if (job.is24h) {
      navigate("/client-dashbroad2/clientedit24jobs", { state: { jobId: job.id, jobData: job } });
    } else {
      navigate("/client-dashbroad2/clienteditjob", { state: { jobData: job } });
    }
  };

  const handlePauseJob = async (job) => {
    try {
      if (!job.id) return;
      await setDoc(doc(db, "pausedJobs", job.id), { ...job, is24: job.is24h });
      await deleteDoc(doc(db, job.is24h ? "jobs_24h" : "jobs", job.id));
      setActiveDropdownJobId(null);
      alert("Job paused");
    } catch (err) {
      alert("Something went wrong while pausing.");
    }
  };

  const handleResumeJob = async (job) => {
    try {
      if (!job.id) return;
      const targetCol = job.is24 ? "jobs_24h" : "jobs";
      const { id, is24, ...originalData } = job;
      await setDoc(doc(db, targetCol, job.id), originalData);
      await deleteDoc(doc(db, "pausedJobs", job.id));
      setActiveDropdownJobId(null);
      alert("Job resumed successfully!");
    } catch (err) {
      console.error("Error resuming job:", err);
      alert("Something went wrong while resuming.");
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm("Are you sure you want to permanently delete this job post? This action cannot be undone.")) return;
    try {
      if (!job.id) return;
      if (selectedTab === "Paused") {
        await deleteDoc(doc(db, "pausedJobs", job.id));
      } else {
        await deleteDoc(doc(db, job.is24h ? "jobs_24h" : "jobs", job.id));
      }
      setActiveDropdownJobId(null);
      alert("Job deleted successfully!");
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Something went wrong while deleting.");
    }
  };

  const toggleSaveJob = async (e, jobId) => {
    e.stopPropagation();
    if (!currentUser) return;
    try {
      const isSaved = savedJobIds.includes(jobId);
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        favoriteJobs: isSaved ? arrayRemove(jobId) : arrayUnion(jobId)
      });
      alert(isSaved ? "Removed from saved jobs" : "Saved to bookmarks!");
    } catch (err) {
      console.error("Error toggling save:", err);
      alert("Failed to update saved status.");
    }
  };

  const displayedJobs = getDisplayedJobs();
  const isLoading = loadingWorks || loading24h;

  const renderJobCard = (job, index) => {
    const is24h = job.is24h;
    
    // Choose dynamic icon based on hash of title
    const hash = Math.abs((job.title || "Job").hashCode?.() || index);
    const icons = [Grid, Play, Globe];
    const IconComponent = icons[hash % icons.length];
    
    const iconBg = getIconBg(job.title || "Job");
    const iconColor = getIconColor(job.title || "Job");

    return (
      <div key={job.id} className="job-list-card">
        <div className="card-left-section">
          <div className="job-icon-box" style={{ background: iconBg }}>
            <IconComponent size={24} color={iconColor} />
          </div>
          <div className="job-details-col">
            <h3 className="job-card-title">{job.title || "Untitled Job"}</h3>
            <p className="job-card-subtitle">{job.sub_category || "General Project"}</p>
            
            <div className="job-badges-row">
              {(job.skills || []).slice(0, 3).map((skill, i) => (
                <span key={i} className="skill-badge">{skill}</span>
              ))}
              {(job.skills?.length > 3) && (
                <span className="skill-badge">+{job.skills.length - 3}</span>
              )}
            </div>

            <div className="job-stats-row">
              <span className="stat-item"><Users size={14} color="#9CA3AF"/> {job.applicantsCount || 0} applicants</span>
              <span className="stat-item"><Clock size={14} color="#9CA3AF"/> {job.created_at ? "Just now" : "Recently"}</span>
              <span className="stat-item"><Calendar size={14} color="#9CA3AF"/> {is24h ? "24 Hours" : (job.timeline || "N/A")}</span>
              <span className="stat-item"><DollarSign size={14} color="#9CA3AF"/> ₹ {job.budget_from || 0}-{job.budget_to || 0}</span>
            </div>
            
            <div className="job-stats-row secondary-stats">
              <span className="stat-item"><Eye size={14} color="#9CA3AF"/> {job.views || 0} Views</span>
              <span className="stat-item"><Bookmark size={14} color="#9CA3AF"/> Saved by {job.saves || 0}</span>
            </div>
          </div>
        </div>

        <div className="card-right-section">
          <div className="card-top-right">
            {is24h ? (
              <span className="status-badge status-24h">24 Hours</span>
            ) : selectedTab === "Paused" ? (
              <span className="status-badge status-paused">Paused</span>
            ) : (
              <span className="status-badge status-active">Active</span>
            )}
            <button className="icon-action-btn" onClick={(e) => toggleSaveJob(e, job.id)}>
              <Bookmark size={16} fill={savedJobIds.includes(job.id) ? "#3B82F6" : "none"} color="#3B82F6"/>
            </button>
          </div>
          
          <div className="card-bottom-right">
            <button className="btn-view-applicants" onClick={(e) => { e.stopPropagation(); navigate(`/client-dashbroad2/my-hires/${job.id}`); }}>View Applicants</button>
            <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleEditJob(job); }}>Edit Job</button>
            <div className="more-menu-wrapper" onClick={(e) => e.stopPropagation()}>
              <button 
                className="btn-more" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setActiveDropdownJobId(activeDropdownJobId === job.id ? null : job.id); 
                }}
              >
                <MoreHorizontal size={16} color="#6B7280"/>
              </button>
              
              {activeDropdownJobId === job.id && (
                <div className="dropdown-menu-list">
                  {selectedTab === "Paused" ? (
                    <button className="dropdown-item" onClick={() => handleResumeJob(job)}>
                      Resume Job
                    </button>
                  ) : (
                    <button className="dropdown-item" onClick={() => handlePauseJob(job)}>
                      Pause Job
                    </button>
                  )}
                  <button className="dropdown-item danger" onClick={() => handleDeleteJob(job)}>
                    Delete Job
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderJobDetailsSidebar = () => {
    if (!selectedJob) return null;
    const is24h = selectedJob.is24h;
    
    // Icon logic
    const hash = Math.abs((selectedJob.title || "Job").hashCode?.() || 0);
    const icons = [Grid, Play, Globe];
    const IconComponent = icons[hash % icons.length];
    const iconBg = getIconBg(selectedJob.title || "Job");
    const iconColor = getIconColor(selectedJob.title || "Job");

    // Dummy applicants data matching the screenshot
    const mockApplicants = [
      { id: 1, name: "Arun Kumar", title: "UI/UX Designer", rating: 5.0, jobs: 12, success: "98%", time: "2d ago", initials: "AK", color: "#FEF3C7", textColor: "#92400E" },
      { id: 2, name: "Priya Nair", title: "UI/UX Designer", rating: 4.8, jobs: 8, success: "95%", time: "2d ago", initials: "PN", color: "#FCE7F3", textColor: "#9D174D" },
      { id: 3, name: "Rohit Verma", title: "Product Designer", rating: 4.9, jobs: 15, success: "97%", time: "3d ago", initials: "RV", color: "#D1FAE5", textColor: "#065F46" },
    ];

    return (
      <div className="job-details-sidebar">
        <div className="sidebar-top-bar">
          <button className="icon-btn-round" onClick={() => setSelectedJob(null)}><ChevronLeft size={18} /></button>
          <div className="top-right-actions">
            <button className="icon-btn-round" onClick={() => handleEditJob(selectedJob)}><Edit size={16} /></button>
            <button className="icon-btn-round"><Share2 size={16} /></button>
            <button className="icon-btn-round" onClick={() => setSelectedJob(null)}><X size={16} /></button>
          </div>
        </div>

        <div className="sidebar-content-scroll">
          <div className="sidebar-header-row">
            <div className="job-icon-box-large" style={{ background: iconBg }}>
              <IconComponent size={28} color={iconColor} />
            </div>
            <div className="sidebar-title-col">
              <h2 className="sidebar-job-title">{selectedJob.title || "Untitled Job"}</h2>
              <p className="sidebar-job-subtitle">{selectedJob.sub_category || "Mobile App Project"}</p>
            </div>
            <div className="sidebar-header-right">
              {is24h ? (
                <span className="status-badge status-24h">24 Hours</span>
              ) : selectedTab === "Paused" ? (
                <span className="status-badge status-paused">Paused</span>
              ) : (
                <span className="status-badge status-active">Active</span>
              )}
              <div className="toggle-switch active"></div>
              <Bookmark 
                size={18} 
                color="#3B82F6" 
                fill={savedJobIds.includes(selectedJob.id) ? "#3B82F6" : "none"} 
                className="ml-2" 
                style={{ cursor: "pointer" }}
                onClick={(e) => toggleSaveJob(e, selectedJob.id)}
              />
              <div className="more-menu-wrapper" style={{ display: "inline-block" }}>
                <MoreHorizontal 
                  size={18} 
                  color="#9CA3AF" 
                  className="ml-2" 
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdownJobId(activeDropdownJobId === selectedJob.id ? null : selectedJob.id);
                  }}
                />
                {activeDropdownJobId === selectedJob.id && (
                  <div className="dropdown-menu-list" style={{ right: 0, top: "100%" }}>
                    {selectedTab === "Paused" ? (
                      <button className="dropdown-item" onClick={() => handleResumeJob(selectedJob)}>
                        Resume Job
                      </button>
                    ) : (
                      <button className="dropdown-item" onClick={() => handlePauseJob(selectedJob)}>
                        Pause Job
                      </button>
                    )}
                    <button className="dropdown-item danger" onClick={() => handleDeleteJob(selectedJob)}>
                      Delete Job
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sidebar-metrics-row">
            <div className="metric-col">
              <span className="metric-label">BUDGET</span>
              <span className="metric-val">₹{selectedJob.budget_from || 0}-₹{selectedJob.budget_to || 0}</span>
            </div>
            <div className="metric-col">
              <span className="metric-label">TIMELINE</span>
              <span className="metric-val">{is24h ? "24 Hours" : (selectedJob.timeline || "N/A")}</span>
            </div>
            <div className="metric-col">
              <span className="metric-label">POSTED</span>
              <span className="metric-val">2d ago</span>
            </div>
            <div className="metric-col">
              <span className="metric-label">APPLICANTS</span>
              <span className="metric-val">{selectedJob.applicantsCount || 8}</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h4 className="section-title">Skills Required</h4>
            <div className="job-badges-row mb-0">
              {(selectedJob.skills || ["UI Design", "Figma", "UX Research", "Prototyping"]).map((skill, i) => (
                <span key={i} className="skill-badge-solid">{skill}</span>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h4 className="section-title">Job Description</h4>
            <p className="job-desc-text">
              {selectedJob.description || "We are looking for an experienced UI/UX designer to create modern and intuitive mobile app designs. The project involves 15-20 screens with interactive prototypes and a full design system."}
            </p>
          </div>

          <div className="stats-cards-row">
            <div className="stat-card">
              <Eye size={20} color="#7C4EF5" />
              <span className="stat-card-val">{selectedJob.views || 142}</span>
              <span className="stat-card-label">Views</span>
            </div>
            <div className="stat-card">
              <Bookmark size={20} color="#3B82F6" />
              <span className="stat-card-val">{selectedJob.saves || 24}</span>
              <span className="stat-card-label">Saved</span>
            </div>
            <div className="stat-card">
              <BarChart2 size={20} color="#10B981" />
              <span className="stat-card-val">62%</span>
              <span className="stat-card-label">Response Rate</span>
            </div>
          </div>

          <div className="applicants-section">
            <h4 className="section-title mb-4">Applicants <span className="text-purple">({selectedJob.applicantsCount || 8})</span></h4>
            <div className="applicants-list">
              {mockApplicants.map(app => (
                <div key={app.id} className="applicant-item">
                  <div className="app-avatar" style={{ background: app.color, color: app.textColor }}>{app.initials}</div>
                  <div className="app-details">
                    <h5 className="app-name">{app.name}</h5>
                    <p className="app-title">{app.title}</p>
                    <div className="app-ratings">
                      <Star size={12} color="#F59E0B" fill="#F59E0B" /> {app.rating}
                      <span className="app-dot"></span>
                      <span>💼 {app.jobs} Jobs</span>
                      <span className="app-dot"></span>
                      <span className="text-gray">✔️ {app.success} Success</span>
                    </div>
                  </div>
                  <div className="app-actions">
                    <span className="app-time">Applied {app.time}</span>
                    <button className="app-btn-view">View Profile</button>
                    <button className="app-btn-msg">Message</button>
                    <MoreHorizontal size={16} color="#9CA3AF" />
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-view-all">View All Applicants ({selectedJob.applicantsCount || 8})</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="my-listings-container">
      <div className={`page-wrapper ${selectedJob ? 'split-layout' : ''}`}>
        
        <div className="main-content-left">
          {/* Header Area */}
          <div className="header-flex">
            <div>
              <h1 className="page-main-title">My Job Listings</h1>
              <p className="page-subtitle">Manage and track your active job posts</p>
            </div>
            <button className="post-btn" onClick={handleOpenPostJob}>+ Post</button>
          </div>

          {/* Search */}
          <div className="search-wrapper">
            <Search size={18} color="#9CA3AF" className="search-icon" />
            <input 
              type="text" 
              placeholder="Search your listings..." 
              className="search-input-field"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="tabs-row">
            <button className={`tab-btn ${selectedTab === "Active" ? "active" : ""}`} onClick={() => setSelectedTab("Active")}>
              Active ({activeJobs.length})
            </button>
            <button className={`tab-btn ${selectedTab === "Paused" ? "active" : ""}`} onClick={() => setSelectedTab("Paused")}>
              Paused
            </button>
            <button className={`tab-btn ${selectedTab === "Draft" ? "active" : ""}`} onClick={() => setSelectedTab("Draft")}>
              Draft (0)
            </button>
          </div>

          {/* List Area */}
          <div className="job-cards-container">
            {isLoading ? (
              <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>
            ) : displayedJobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon-box">📋</div>
                <h3>No {selectedTab.toLowerCase()} jobs found</h3>
                <p>You don't have any {selectedTab.toLowerCase()} listings right now.</p>
                {selectedTab === "Active" && <button className="post-btn-large" onClick={handleOpenPostJob}>Post a Job</button>}
              </div>
            ) : (
              displayedJobs.map((job, index) => renderJobCard(job, index))
            )}
          </div>
        </div>

        {/* Right Sidebar Details Pane */}
        {renderJobDetailsSidebar()}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');

        .my-listings-container {
          width: 100%;
          min-height: 100vh;
          background: #FAFAFC;
          font-family: 'DM Sans', sans-serif;
          padding: 32px 40px;
          box-sizing: border-box;
        }

        .page-wrapper {
          width: 100%;
          display: flex;
          gap: 24px;
        }

        .main-content-left {
          flex: 1;
          min-width: 0;
          transition: all 0.3s ease;
        }

        .split-layout .main-content-left {
          flex: 0 0 45%;
        }

        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .page-main-title {
          font-family: 'Sora', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .page-subtitle {
          font-size: 13px;
          color: #6B7280;
          margin: 0;
        }

        .post-btn {
          background: #7C4EF5;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(124, 78, 245, 0.2);
        }

        .search-wrapper {
          position: relative;
          width: 100%;
          margin-bottom: 24px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
        }

        .search-input-field {
          width: 100%;
          padding: 16px 16px 16px 44px;
          border-radius: 12px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
        }
        .search-input-field::placeholder { color: #9CA3AF; }

        .tabs-row {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .tab-btn {
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid transparent;
          cursor: pointer;
          background: transparent;
          color: #6B7280;
          transition: all 0.2s;
        }
        .tab-btn:hover { background: #F3F4F6; }
        .tab-btn.active {
          background: #7C4EF5;
          color: white;
          font-weight: 600;
        }

        .job-cards-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .job-list-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .job-list-card:hover {
          border-color: #7C4EF5;
          box-shadow: 0 4px 12px rgba(124, 78, 245, 0.05);
        }
        .job-list-card.selected {
          border-color: #3B82F6;
          border-width: 2px;
          padding: 23px; /* Compensate for thicker border */
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }

        .split-layout .job-list-card {
          flex-direction: column;
          padding: 20px;
        }
        .split-layout .card-right-section {
          width: 100%;
          flex-direction: row-reverse;
          justify-content: space-between;
          align-items: center;
          min-height: auto;
          margin-top: 16px;
          border-top: 1px solid #F3F4F6;
          padding-top: 16px;
        }

        .card-left-section {
          display: flex;
          gap: 16px;
          flex: 1;
        }

        .job-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .job-details-col {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .job-card-title {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .job-card-subtitle {
          font-size: 12px;
          color: #6B7280;
          margin: 0 0 12px 0;
        }

        .job-badges-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .skill-badge {
          padding: 4px 12px;
          border-radius: 12px;
          background: #FFF1F2;
          color: #E11D48;
          font-size: 11px;
          font-weight: 500;
        }
        .skill-badge:nth-child(even) {
          background: #EEF2FF;
          color: #4F46E5;
        }

        .skill-badge-solid {
          padding: 6px 14px;
          border-radius: 16px;
          background: #FEF3C7;
          color: #92400E;
          font-size: 11px;
          font-weight: 500;
        }
        .skill-badge-solid:nth-child(2) { background: #FCE7F3; color: #9D174D; }
        .skill-badge-solid:nth-child(3) { background: #D1FAE5; color: #065F46; }
        .skill-badge-solid:nth-child(4) { background: #FEF3C7; color: #92400E; }

        .job-stats-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 8px;
        }
        .split-layout .job-stats-row {
          gap: 12px;
        }
        .secondary-stats {
          margin-bottom: 0;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #4B5563;
          font-weight: 400;
        }

        .card-right-section {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          height: 100%;
          min-height: 130px;
        }

        .card-top-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        .status-active {
          background: #ECFDF5;
          color: #059669;
        }
        .status-24h {
          background: #FEF2F2;
          color: #DC2626;
        }
        .status-paused {
          background: #F3F4F6;
          color: #4B5563;
        }

        .icon-action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .card-bottom-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-view-applicants {
          background: #7C4EF5;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-edit {
          background: white;
          color: #4B5563;
          border: 1px solid #E5E7EB;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-more {
          background: white;
          border: 1px solid #E5E7EB;
          width: 34px;
          height: 34px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* --- Right Sidebar Styles --- */
        .job-details-sidebar {
          flex: 1;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 64px);
          position: sticky;
          top: 32px;
          overflow: hidden;
        }

        .sidebar-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #F3F4F6;
        }

        .icon-btn-round {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6B7280;
        }
        .icon-btn-round:hover { background: #F3F4F6; }

        .top-right-actions {
          display: flex;
          gap: 8px;
        }

        .sidebar-content-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .sidebar-header-row {
          display: flex;
          align-items: center;
          margin-bottom: 32px;
        }

        .job-icon-box-large {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-right: 16px;
        }

        .sidebar-title-col {
          flex: 1;
        }

        .sidebar-job-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .sidebar-job-subtitle {
          font-size: 13px;
          color: #6B7280;
          margin: 0;
        }

        .sidebar-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .toggle-switch {
          width: 36px;
          height: 20px;
          background: #E5E7EB;
          border-radius: 10px;
          position: relative;
          cursor: pointer;
        }
        .toggle-switch.active {
          background: #7C4EF5;
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: 0.2s;
        }
        .toggle-switch.active::after {
          left: 18px;
        }

        .sidebar-metrics-row {
          display: flex;
          border-bottom: 1px solid #E5E7EB;
          padding-bottom: 24px;
          margin-bottom: 24px;
        }
        
        .metric-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .metric-label {
          font-size: 10px;
          font-weight: 600;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .metric-val {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .sidebar-section {
          margin-bottom: 24px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 12px 0;
        }
        .mb-4 { margin-bottom: 16px; }
        .mb-0 { margin-bottom: 0; }
        .text-purple { color: #7C4EF5; }

        .job-desc-text {
          font-size: 13px;
          color: #4B5563;
          line-height: 1.6;
          margin: 0;
        }

        .stats-cards-row {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }
        
        .stat-card {
          flex: 1;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        
        .stat-card-val {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 12px 0 4px 0;
        }
        
        .stat-card-label {
          font-size: 11px;
          color: #6B7280;
          font-weight: 500;
        }

        .applicants-list {
          display: flex;
          flex-direction: column;
        }

        .applicant-item {
          display: flex;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #F3F4F6;
        }
        .applicant-item:last-child {
          border-bottom: none;
        }

        .app-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          margin-right: 16px;
        }

        .app-details {
          flex: 1;
        }

        .app-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 2px 0;
        }
        
        .app-title {
          font-size: 12px;
          color: #6B7280;
          margin: 0 0 6px 0;
        }

        .app-ratings {
          display: flex;
          align-items: center;
          font-size: 11px;
          color: #6B7280;
          font-weight: 500;
        }
        
        .app-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #D1D5DB;
          margin: 0 6px;
        }

        .text-gray {
          color: #9CA3AF;
        }

        .app-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .app-time {
          font-size: 11px;
          color: #9CA3AF;
        }

        .app-btn-view {
          background: white;
          border: 1px solid #E5E7EB;
          color: #4B5563;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }

        .app-btn-msg {
          background: #7C4EF5;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-view-all {
          width: 100%;
          padding: 14px;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          color: #7C4EF5;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
        }
        .btn-view-all:hover {
          background: #F9FAFB;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          background: white;
          border-radius: 16px;
          border: 1px dashed #D1D5DB;
        }
        .empty-icon-box {
          font-size: 40px;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        .empty-state h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
        }
        .empty-state p {
          font-size: 14px;
          color: #6B7280;
          margin: 0 0 24px 0;
        }
        .post-btn-large {
          background: #7C4EF5;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .my-listings-container {
            padding: 20px;
            margin-left: 0 !important;
          }
          .page-wrapper {
            flex-direction: column;
          }
          .job-list-card {
            flex-direction: column;
          }
          .card-right-section {
            width: 100%;
            flex-direction: row-reverse;
            justify-content: space-between;
            align-items: center;
            min-height: auto;
            margin-top: 16px;
            border-top: 1px solid #F3F4F6;
            padding-top: 16px;
          }
          .job-details-sidebar {
            height: auto;
            max-height: 80vh;
          }
        }

        /* --- MORE OPTIONS DROPDOWN --- */
        .more-menu-wrapper {
          position: relative;
          display: inline-block;
        }

        .dropdown-menu-list {
          position: absolute;
          right: 0;
          top: 110%;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          z-index: 100;
          min-width: 140px;
          display: flex;
          flex-direction: column;
          padding: 4px 0;
        }

        .dropdown-item {
          background: none;
          border: none;
          padding: 10px 16px;
          font-size: 13px;
          color: #374151;
          text-align: left;
          width: 100%;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .dropdown-item:hover {
          background: #F3F4F6;
        }
        .dropdown-item.danger {
          color: #EF4444;
        }
        .dropdown-item.danger:hover {
          background: #FEE2E2;
        }
      `}</style>
    </div>
  );
}
