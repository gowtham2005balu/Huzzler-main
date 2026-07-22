// BrowseProjects.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Bell,
  Search,
  Filter,
  Bookmark,
  X,
  Star,
  ChevronDown,
  ChevronRight
} from "lucide-react";

import { collection, onSnapshot, orderBy, query, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firbase/Firebase";
import { categoriesData } from "../data/categoriesData";

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [showSort, setShowSort] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // NEW STATE FOR FILTERING
  const [activeMainCategory, setActiveMainCategory] = useState("Graphics & Design");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchJobQuery, setSearchJobQuery] = useState("");
  
  // TOP SECTION FUNCTIONALITY STATE
  const [activeTab, setActiveTab] = useState("Work");
  const [activeSort, setActiveSort] = useState("Best Match");
  const [savedJobs, setSavedJobs] = useState([]);
  const [activePills, setActivePills] = useState([
    { id: 'figma', label: 'Figma', colorClass: 'pill-purple', filter: 'Figma' },
    { id: 'graphic-design', label: 'Graphic Design', colorClass: 'pill-yellow', filter: 'Graphic Design' },
    { id: 'ui-ux', label: 'UI/UX', colorClass: 'pill-green', filter: 'UI/UX' }
  ]);

  const sortRef = useRef(null);
  
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const uid = user?.uid;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, [auth]);

  useEffect(() => {
    const qJobs = query(collection(db, "jobs"), orderBy("created_at", "desc"));
    const qFast = query(collection(db, "jobs_24h"), orderBy("created_at", "desc"));

    const formatData = (d, source) => {
      const data = d.data();
      const createdAt = data.created_at?.toDate?.() || null;
      const salaryStr = (data.budget_from && data.budget_to) 
        ? `₹${data.budget_from} - ₹${data.budget_to}` 
        : (data.budget ? `₹${data.budget}` : 'Negotiable');
        
      const titleStr = data.companyName || "Client";
      const initials = titleStr.substring(0, 2).toUpperCase();
      const colors = ["#F59E0B", "#3B82F6", "#10B981", "#8B5CF6", "#EF4444"];
      const circleBg = colors[d.id.charCodeAt(0) % colors.length];

      return {
        id: d.id,
        title: titleStr,
        role: data.title || "Freelance Job",
        circle: initials,
        circleBg: circleBg,
        skills: data.skills || [],
        salary: salaryStr,
        description: data.description || "",
        time: timeAgo(createdAt),
        impressions: data.views || 0,
        source: source,
        category: data.category || "",
        raw: data
      };
    };

    const unsub1 = onSnapshot(qJobs, (snap) => {
      const data = snap.docs.map(d => formatData(d, "jobs"));
      setProjects(prev => {
        const others = prev.filter(j => j.source !== "jobs");
        return [...others, ...data].sort((a,b) => (b.raw.created_at?.toMillis() || 0) - (a.raw.created_at?.toMillis() || 0));
      });
    });

    const unsub2 = onSnapshot(qFast, (snap) => {
      const data = snap.docs.map(d => formatData(d, "jobs_24h"));
      setProjects(prev => {
        const others = prev.filter(j => j.source !== "jobs_24h");
        return [...others, ...data].sort((a,b) => (b.raw.created_at?.toMillis() || 0) - (a.raw.created_at?.toMillis() || 0));
      });
    });

    return () => {
      unsub1();
      unsub2();
    }
  }, []);

  // open modal
  const openModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  // close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
    document.body.style.overflow = "auto";
  };

  // close sort if clicked outside
  useEffect(() => {
    function handleDocClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    }
    if (showSort) document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [showSort]);

  // close modal on Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (showModal) closeModal();
        if (showSort) setShowSort(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showModal, showSort]);

  const handleSaveJob = (e, job) => {
    e.stopPropagation();
    if (savedJobs.includes(job.id)) {
      setSavedJobs(prev => prev.filter(id => id !== job.id));
    } else {
      setSavedJobs(prev => [...prev, job.id]);
    }
  };

  const handleRemovePill = (id) => {
    setActivePills(prev => prev.filter(p => p.id !== id));
  };

  let filteredProjects = projects.filter((job) => {
    // Tab Filter
    if (activeTab === "Work" && job.source !== "jobs") return false;
    if (activeTab === "24 Hour" && job.source !== "jobs_24h") return false;
    if (activeTab === "Saved" && !savedJobs.includes(job.id)) return false;

    // Search Box
    if (searchJobQuery && !job.title.toLowerCase().includes(searchJobQuery.toLowerCase()) && !job.role.toLowerCase().includes(searchJobQuery.toLowerCase())) {
      return false;
    }

    // Sidebar Category
    if (selectedCategory && job.category !== selectedCategory) {
      if (!job.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }
    }

    // Top Filter Pills (match ANY pill)
    if (activePills.length > 0) {
      const pillFilters = activePills.map(p => p.filter.toLowerCase());
      const jobSkillsAndCategory = [job.category?.toLowerCase(), ...(job.skills || []).map(s => s.toLowerCase())].filter(Boolean);
      const matchesPills = pillFilters.some(pf => jobSkillsAndCategory.some(j => j.includes(pf)));
      if (!matchesPills) return false;
    }

    return true;
  });

  // Apply Sorting
  filteredProjects = filteredProjects.sort((a, b) => {
    if (activeSort === "Newest") {
      return (b.raw.created_at?.toMillis() || 0) - (a.raw.created_at?.toMillis() || 0);
    } else if (activeSort === "Highest Budget") {
      const budgetA = a.raw.budget_to || a.raw.budget || 0;
      const budgetB = b.raw.budget_to || b.raw.budget || 0;
      return budgetB - budgetA;
    }
    // Best Match (default sorting)
    return 0;
  });

  return (
    <>
      <div className="browse-wrapper">
        {/* TOP HEADER ALIGNED TO RIGHT */}
        <div className="top-right-header">
          <button className="ai-assistant-btn">
            <Star size={14} /> AI Assistant
          </button>
          <button className="icon-btn" style={{ position: 'relative' }}>
            <Bell size={18} />
            <span className="bell-dot"></span>
          </button>
          <div className="avatar-header">HA</div>
        </div>

        <div className="page-content">
          <h1 className="page-title">Browse Projects</h1>
          <p className="page-subtitle">Discover AI-matched jobs tailored to your skills and experience.</p>

          <div className="tabs">
            <button className={`tab ${activeTab === "Work" ? "active" : ""}`} onClick={() => setActiveTab("Work")}>Work</button>
            <button className={`tab ${activeTab === "24 Hour" ? "active" : ""}`} onClick={() => setActiveTab("24 Hour")}>24 Hour</button>
            <button className={`tab ${activeTab === "Saved" ? "active" : ""}`} onClick={() => setActiveTab("Saved")}>Saved</button>
          </div>

          <div className="search-container">
            <div className="search-box">
              <Search size={18} color="#6B7280" style={{ marginLeft: 16 }} />
              <input 
                type="text" 
                placeholder="Search UI/UX Designer, Product Designer, Video Editor..." 
                value={searchJobQuery}
                onChange={(e) => setSearchJobQuery(e.target.value)}
              />
              <button className="search-btn">Search</button>
            </div>
            
            <div className="search-filters-row">
              <div className="filter-pills">
                <button className={`pill ${activeSort === "Best Match" ? "active-pill" : ""}`} onClick={() => setActiveSort("Best Match")}>Best Match</button>
                <button className={`pill ${activeSort === "Newest" ? "active-pill" : ""}`} onClick={() => setActiveSort("Newest")}>Newest</button>
                <button className="pill">Availability</button>
                
                {activePills.map(pill => (
                  <button key={pill.id} className={`pill ${pill.colorClass}`} onClick={() => handleRemovePill(pill.id)}>
                    {pill.label} <X size={12} style={{marginLeft: 4}}/>
                  </button>
                ))}

                {activePills.length > 0 && (
                  <span className="filters-count">{activePills.length} Filters</span>
                )}
                <span className="clear-all" onClick={() => { setActivePills([]); setSearchJobQuery(""); }}>Clear all</span>
              </div>
              <div className="right-filters" ref={sortRef}>
                <button className="secondary-btn" onClick={() => setShowSort(!showSort)}>
                  <Filter size={14} /> Sort: {activeSort}
                </button>
                <button className="secondary-btn">
                  <Filter size={14} /> Filters
                </button>

                {showSort && (
                  <div className="sort-popup">
                    <div className="sort-item" onClick={() => { setActiveSort("Best Match"); setShowSort(false); }}>Best Match</div>
                    <div className="sort-item" onClick={() => { setActiveSort("Newest"); setShowSort(false); }}>Newest</div>
                    <div className="sort-item" onClick={() => { setActiveSort("Highest Budget"); setShowSort(false); }}>Highest Budget</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="main-layout">
            {/* LEFT SIDEBAR FILTERS */}
            <aside className="filters-sidebar">
              <div className="filters-header">
                <h3>Filters</h3>
                <span className="clear-all" onClick={() => { setSelectedCategory(""); setActiveMainCategory("Graphics & Design"); setSearchCategory(""); }} style={{cursor: 'pointer'}}>Clear all</span>
              </div>
              
              <div className="categories-section">
                <h4>CATEGORIES</h4>
                <div className="category-search">
                  <Search size={14} color="#9CA3AF" />
                  <input 
                    type="text" 
                    placeholder="Search categories..." 
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                  />
                </div>

                {categoriesData.map((mainCat, idx) => {
                  const matchSearch = searchCategory === "" || 
                    mainCat.title.toLowerCase().includes(searchCategory.toLowerCase()) || 
                    mainCat.sections.some(sec => sec.title.toLowerCase().includes(searchCategory.toLowerCase()) || sec.items.some(item => item.toLowerCase().includes(searchCategory.toLowerCase())));
                  
                  if (!matchSearch) return null;

                  const isActive = activeMainCategory === mainCat.title;

                  if (isActive) {
                    return (
                      <div className="category-group" key={idx}>
                        <div className="group-header active-group" onClick={() => setActiveMainCategory("")}>
                          <span>{mainCat.title}</span>
                          <ChevronRight size={14} />
                        </div>
                        {mainCat.sections.map((sec, sIdx) => {
                          const secMatch = searchCategory === "" || sec.title.toLowerCase().includes(searchCategory.toLowerCase()) || sec.items.some(item => item.toLowerCase().includes(searchCategory.toLowerCase()));
                          if (!secMatch && !mainCat.title.toLowerCase().includes(searchCategory.toLowerCase())) return null;

                          return (
                            <React.Fragment key={sIdx}>
                              <div className="group-sub">{sec.title}</div>
                              <ul className="category-list">
                                {sec.items.map((item, iIdx) => {
                                  if (searchCategory && !item.toLowerCase().includes(searchCategory.toLowerCase()) && !sec.title.toLowerCase().includes(searchCategory.toLowerCase()) && !mainCat.title.toLowerCase().includes(searchCategory.toLowerCase())) return null;
                                  const isSelected = selectedCategory === item;
                                  return (
                                    <li 
                                      key={iIdx} 
                                      onClick={() => setSelectedCategory(isSelected ? "" : item)}
                                      className={isSelected ? "active-item" : ""}
                                    >
                                      <span>{item}</span>
                                      <ChevronRight size={12} className="list-chevron" />
                                    </li>
                                  );
                                })}
                              </ul>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    );
                  } else {
                    return (
                      <ul className="parent-categories" key={idx}>
                        <li onClick={() => setActiveMainCategory(mainCat.title)}>
                          <span>{mainCat.title}</span>
                          <ChevronRight size={14} />
                        </li>
                      </ul>
                    );
                  }
                })}

              </div>
            </aside>

            {/* RIGHT JOB LIST */}
            <main className="job-list">
              {filteredProjects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>No jobs found.</div>
              )}
              {filteredProjects.map((job) => (
                <div className="job-card" key={job.id} onClick={() => openModal(job)}>
                  <div className="job-header-row">
                    <div className="job-title-area">
                      <div className="circle" style={{ backgroundColor: job.circleBg || '#10B981' }}>{job.circle}</div>
                      <div>
                        <h3 className="job-role">{job.role}</h3>
                        <p className="job-company">{job.title}</p>
                      </div>
                    </div>
                    <div className="job-salary">{job.salary}</div>
                  </div>

                  <div className="job-skills-section">
                    <p className="skills-label">SKILLS REQUIRED</p>
                    <div className="skills-row">
                      {job.skills.slice(0, 4).map((s, i) => (
                        <span key={i} className="skill-pill pill-mixed">
                          {s}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="skill-pill more-pill">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="job-desc">{job.description}</p>

                  <div className="job-footer">
                    <div className="job-meta">
                      <span className="meta-item"><span className="eye-icon">👁</span> {job.impressions} views</span>
                      <span className="meta-item"><span className="clock-icon">🕒</span> {job.time}</span>
                    </div>
                    <div className="job-actions">
                      <button className="bookmark-btn" onClick={(e) => handleSaveJob(e, job)}>
                        <Bookmark size={16} color={savedJobs.includes(job.id) ? "#7C3AED" : "#6B7280"} fill={savedJobs.includes(job.id) ? "#7C3AED" : "none"} />
                      </button>
                      <button className="apply-now-btn">Apply Now →</button>
                    </div>
                  </div>
                </div>
              ))}
            </main>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedJob && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            <p className="modal-small-title">Project Details</p>
            <h2 className="modal-main-title">{selectedJob.role}</h2>
            <p className="modal-role">{selectedJob.title}</p>

            <div className="modal-info-grid">
              <div><p className="label">Budget</p><p className="value">{selectedJob.salary}</p></div>
              <div><p className="label">Timeline</p><p className="value">N/A</p></div>
              <div><p className="label">Location</p><p className="value">Remote/Hybrid</p></div>
            </div>

            <h4 className="section-title">Skills Required</h4>
            <div className="skill-chip-row">
              {selectedJob.skills.map((s, i) => <span key={i} className="yellow-skill-chip">{s}</span>)}
            </div>

            <h4 className="section-title">Project Description</h4>
            <p className="modal-description">{selectedJob.description}</p>

            <button className="apply-btn" onClick={() => alert("Apply (demo)")}>Apply for this Project</button>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; font-family: Inter, -apple-system, sans-serif; }

        .browse-wrapper {
          background: #FAFAFA;
          min-height: 100vh;
          width: 100%;
        }

        .top-right-header {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 16px 32px;
          gap: 16px;
          background: #FAFAFA;
        }

        .ai-assistant-btn {
          background: #7C3AED;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .icon-btn {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4B5563;
          cursor: pointer;
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

        .avatar-header {
          background: #7C3AED;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .page-content {
          padding: 0 40px 40px 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          font-size: 14px;
          color: #6B7280;
          margin: 0 0 24px 0;
        }

        .tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .tab {
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid #E5E7EB;
          background: white;
          color: #4B5563;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }

        .tab.active {
          background: #7C3AED;
          color: white;
          border-color: #7C3AED;
        }

        .search-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          margin-bottom: 24px;
          border: 1px solid #F3F4F6;
        }

        .search-box {
          display: flex;
          align-items: center;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 6px 0;
          margin-bottom: 16px;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          padding: 0 16px;
          font-size: 14px;
          color: #111827;
          margin: 0;
        }

        .search-box input::placeholder {
          color: #9CA3AF;
        }

        .search-btn {
          background: #7C3AED;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0 24px;
          height: 36px;
          margin-right: 6px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          text-align: center;
          line-height: 36px;
        }

        .search-filters-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .filter-pills {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .pill {
          padding: 6px 14px;
          border-radius: 16px;
          border: 1px solid #E5E7EB;
          background: white;
          color: #4B5563;
          font-size: 13px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .active-pill {
          background: #7C3AED;
          color: white;
          border-color: #7C3AED;
        }

        .pill-purple { background: #F3E8FF; color: #7C3AED; border-color: #F3E8FF; }
        .pill-yellow { background: #FEF3C7; color: #D97706; border-color: #FEF3C7; }
        .pill-green { background: #D1FAE5; color: #059669; border-color: #D1FAE5; }

        .filters-count {
          font-size: 13px;
          color: #7C3AED;
          font-weight: 600;
          margin-left: 8px;
        }

        .clear-all {
          font-size: 13px;
          color: #7C3AED;
          font-weight: 600;
          cursor: pointer;
        }

        .right-filters {
          display: flex;
          gap: 12px;
          position: relative;
        }

        .secondary-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid #E5E7EB;
          background: white;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #4B5563;
          cursor: pointer;
        }

        .sort-popup {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          min-width: 160px;
          z-index: 100;
        }
        
        .sort-item {
          padding: 10px 16px;
          font-size: 13px;
          cursor: pointer;
        }
        .sort-item:hover { background: #F3F4F6; }

        .main-layout {
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }

        /* LEFT SIDEBAR */
        .filters-sidebar {
          width: 280px;
          flex-shrink: 0;
          background: #FFFFFF;
          border: 1px solid #EDE8FF;
          border-radius: 24px;
          padding: 24px;
          box-sizing: border-box;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .filters-header h3 { font-size: 16px; font-weight: 700; color: #111827; margin: 0; }

        .categories-section h4 {
          font-size: 11px;
          font-weight: 600;
          color: #9CA3AF;
          letter-spacing: 0.05em;
          margin: 0 0 12px 0;
          text-transform: uppercase;
        }

        .category-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F7F4EE;
          border-radius: 50px;
          padding: 9px 16px;
          margin-bottom: 24px;
        }
        .category-search input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 13px;
          width: 100%;
          color: #4B5563;
          padding: 0;
          margin: 0;
        }
        .category-search input::placeholder {
          color: #9CA3AF;
        }

        .category-group {
          margin-bottom: 16px;
        }

        .group-header {
          font-size: 14px;
          font-weight: 500;
          color: #7C3AED;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .group-sub {
          font-size: 11px;
          font-weight: 600;
          color: #A39DBA;
          margin: 16px 0 12px 0;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .category-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .category-list li {
          font-size: 13px;
          color: #4B5563;
          margin-bottom: 14px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: 4px;
        }
        .category-list li:hover { color: #111827; }
        
        .category-list li.active-item {
          color: #7C3AED;
          font-weight: 600;
        }

        .list-chevron {
          color: #D1D5DB;
        }

        .parent-categories {
          list-style: none;
          padding: 0;
          margin: 16px 0 0 0;
        }
        .parent-categories li {
          font-size: 14px;
          color: #4B5563;
          margin-bottom: 16px;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .parent-categories li:hover { color: #7C3AED; }

        /* RIGHT JOB LIST */
        .job-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .job-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #F3F4F6;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
          cursor: pointer;
        }

        .job-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .job-title-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .circle {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .job-role {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .job-company {
          font-size: 13px;
          color: #6B7280;
          margin: 0;
        }

        .job-salary {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .job-skills-section {
          margin-bottom: 16px;
        }

        .skills-label {
          font-size: 11px;
          font-weight: 600;
          color: #9CA3AF;
          letter-spacing: 0.05em;
          margin: 0 0 8px 0;
        }

        .skills-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .skill-pill {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .pill-colored {
          background: #FDF2F8;
          color: #DB2777;
        }
        
        .pill-mixed:nth-child(1) { background: #FDF2F8; color: #DB2777; }
        .pill-mixed:nth-child(2) { background: #EFF6FF; color: #2563EB; }
        .pill-mixed:nth-child(3) { background: #F3E8FF; color: #9333EA; }
        .pill-mixed:nth-child(4) { background: #ECFDF5; color: #059669; }

        .more-pill {
          background: #F3F4F6;
          color: #6B7280;
        }

        .job-desc {
          font-size: 13px;
          color: #4B5563;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .job-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .job-meta {
          display: flex;
          gap: 16px;
        }

        .meta-item {
          font-size: 12px;
          color: #6B7280;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .job-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bookmark-btn {
          background: transparent;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .apply-now-btn {
          background: #7C3AED;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }

        /* MODAL STYLES (Kept exactly identical functionality, minimal visual tweaks) */
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
          display: flex; justify-content: center; align-items: center; z-index: 999;
        }
        .modal-box {
          background: white; border-radius: 16px; padding: 32px; width: 600px; max-height: 90vh;
          overflow-y: auto; position: relative;
        }
        .modal-close { position: absolute; top: 20px; right: 20px; background: none; border: none; cursor: pointer; }
        .modal-small-title { font-size: 13px; color: #6B7280; margin: 0 0 8px; }
        .modal-main-title { font-size: 24px; font-weight: 600; margin: 0 0 8px; }
        .modal-role { font-size: 14px; color: #4B5563; margin: 0 0 24px; }
        .modal-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .label { font-size: 12px; color: #6B7280; margin: 0 0 4px; }
        .value { font-size: 14px; font-weight: 600; margin: 0; }
        .section-title { font-size: 14px; font-weight: 600; margin: 0 0 12px; }
        .skill-chip-row { display: flex; gap: 8px; margin-bottom: 24px; }
        .yellow-skill-chip { padding: 6px 12px; background: #F3F4F6; border-radius: 8px; font-size: 13px; }
        .modal-description { font-size: 14px; color: #4B5563; line-height: 1.6; margin-bottom: 24px; }
        .apply-btn { width: 100%; background: #7C3AED; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 500; cursor: pointer; }
      `}</style>
    </>
  );
}

