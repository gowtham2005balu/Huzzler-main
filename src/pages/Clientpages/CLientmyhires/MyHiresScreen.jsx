import React, { useState, useEffect } from "react";
import { Search, ArrowLeft, Star, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firbase/Firebase";

export default function MyHiresScreen() {
  const navigate = useNavigate();
  const auth = getAuth();
  
  const [activeTab, setActiveTab] = useState("all");
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [freelancerProfiles, setFreelancerProfiles] = useState({});
  const [search, setSearch] = useState("");

  const fetchFreelancerProfile = async (freelancerId) => {
    if (!freelancerId || freelancerProfiles[freelancerId]) return;
    try {
      let profileDoc = await getDoc(doc(db, "users", freelancerId));
      if (!profileDoc.exists()) {
        profileDoc = await getDoc(doc(db, "freelancers", freelancerId));
      }
      if (profileDoc.exists()) {
        setFreelancerProfiles((prev) => ({
          ...prev,
          [freelancerId]: profileDoc.data(),
        }));
      }
    } catch (err) {
      console.error("Error fetching freelancer profile:", err);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(
          collection(db, "notifications"),
          where("clientUid", "==", user.uid),
          where("type", "==", "hire_request"),
          orderBy("timestamp", "desc")
        );

        const unsub = onSnapshot(q, (snap) => {
          const data = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

          setRequests(data);

          data.forEach((item) => {
            if (item.freelancerId) {
              fetchFreelancerProfile(item.freelancerId);
            }
          });
        });

        return () => unsub();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const applicants = requests.map((req, index) => {
    const profile = freelancerProfiles[req.freelancerId] || {};
    const service = req.service || {};
    
    let nameStr = typeof req.freelancerName === 'string' ? req.freelancerName : "Freelancer";
    if (!nameStr || nameStr.trim() === "") nameStr = "Unknown";
    
    const initials = nameStr.substring(0, 2).toUpperCase();
    const colors = ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];
    const color = colors[index % colors.length];
    
    let roleStr = typeof profile.role === 'string' ? profile.role : (typeof service.category === 'string' ? service.category : "Freelancer");
    const rate = `₹${service.from || 900}/day`; 
    const rating = profile.rating || 4.8;
    const reviews = profile.reviewsCount || 42;
    const projects = profile.projectsCount || 28;
    const exp = profile.experience || "3yr";
    
    let skillsList = Array.isArray(service.skills) ? service.skills : [];
    if (skillsList.length === 0) {
       skillsList = ["Figma", "UX", "Web Design", "UI Design", "Graphic Design", "Prototyping"];
    }

    const coverNote = req.coverNote || profile.coverNote || "Hi! I'd love to work on your mobile app project. I have 3 years of experience designing intuitive mobile interfaces...";
    
    return {
      id: req.id,
      name: nameStr,
      initials,
      color,
      role: roleStr,
      rate,
      rating,
      reviews,
      projects,
      exp,
      skills: skillsList,
      coverNote,
      _originalReq: req,
      _originalProfile: profile
    };
  });

  const filteredApplicants = applicants.filter(app => {
     if (search && !app.name.toLowerCase().includes(search.toLowerCase())) return false;
     return true;
  });

  const selectedApplicant = filteredApplicants.find(a => a.id === selectedApplicantId) || filteredApplicants[0];

  return (
    <div className="applicants-page-container">
      <style>{`
        .applicants-page-container {
          background: #FAFAFA;
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .header-left {
          display: flex;
          flex-direction: column;
        }

        .page-title {
          font-family: 'Sora', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .page-subtitle {
          font-size: 13px;
          color: #6B7280;
          margin: 0;
        }

        .btn-back {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-back:hover {
          background: #F9FAFB;
        }

        .search-container {
          position: relative;
          margin-bottom: 24px;
        }

        .search-input {
          width: 100%;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 14px 16px 14px 44px;
          font-size: 14px;
          outline: none;
          color: #111827;
          box-sizing: border-box;
        }
        .search-input::placeholder {
          color: #9CA3AF;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          top: 0;
          bottom: 0;
          margin: auto;
          color: #9CA3AF;
        }

        .tabs-container {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .tab-button {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-button.active {
          color: #111827;
          border-color: #D1D5DB;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .split-layout {
          display: flex;
          gap: 24px;
          flex: 1;
        }

        /* --- LEFT PANE (LIST) --- */
        .list-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .applicant-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .applicant-card.selected {
          border-color: #3B82F6;
          border-width: 2px;
          padding: 19px; /* adjust for thicker border */
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }

        .card-info {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .avatar-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 15px;
          flex-shrink: 0;
        }

        .card-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-name {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
        }

        .card-meta {
          font-size: 12px;
          color: #6B7280;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rating-star {
          color: #FBBF24;
          width: 12px;
          height: 12px;
        }

        .card-skills {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }

        .skill-badge {
          background: #F3F4F6;
          color: #4B5563;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
        }
        .skill-badge.purple { background: #F3E8FF; color: #7C3AED; }
        .skill-badge.blue { background: #E0F2FE; color: #0284C7; }
        .skill-badge.orange { background: #FFEDD5; color: #C2410C; }
        .skill-badge.green { background: #DCFCE7; color: #15803D; }

        .card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-accept {
          background: #F3E8FF;
          color: #7C3AED;
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        .btn-reject {
          background: #FEE2E2;
          color: #EF4444;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* --- RIGHT PANE (DETAILS) --- */
        .details-pane {
          flex: 1;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 80px);
          position: sticky;
          top: 24px;
          overflow-y: auto;
        }

        .details-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 24px;
        }

        .avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 28px;
          margin-bottom: 16px;
        }

        .details-name {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .details-role {
          font-size: 13px;
          color: #6B7280;
          margin-bottom: 12px;
        }

        .badges-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .rating-badge {
          background: #FEF9C3;
          color: #854D0E;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .top-rated-badge {
          background: #DCFCE7;
          color: #166534;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .stats-row {
          display: flex;
          justify-content: space-around;
          border-bottom: 1px solid #E5E7EB;
          padding-bottom: 24px;
          margin-bottom: 24px;
          width: 100%;
        }

        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .stat-label {
          font-size: 11px;
          color: #6B7280;
          font-weight: 500;
        }

        .section-container {
          margin-bottom: 24px;
          width: 100%;
        }

        .section-title {
          font-size: 11px;
          font-weight: 700;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cover-note-text {
          font-size: 13px;
          color: #4B5563;
          line-height: 1.6;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .portfolio-btn {
          background: #F3E8FF;
          color: #7C3AED;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .portfolio-btn:hover { background: #E9D5FF; }

        .actions-bottom {
          display: flex;
          gap: 12px;
          margin-top: auto;
          padding-top: 24px;
        }

        .btn-bottom-decline {
          flex: 1;
          background: #FFFFFF;
          border: 1px solid #7C3AED;
          color: #7C3AED;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-bottom-hire {
          flex: 2;
          background: #7C3AED;
          color: #FFFFFF;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .applicants-page-container {
            padding: 20px;
            margin-left: 0 !important;
          }
          .split-layout {
            flex-direction: column;
          }
          .details-pane {
            position: relative;
            height: auto;
            top: 0;
            margin-top: 24px;
          }
          .header-row {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="header-row">
        <div className="header-left">
          <h1 className="page-title">Applicants ({filteredApplicants.length})</h1>
          <p className="page-subtitle">UI/UX Designer &bull; Mobile App Project</p>
        </div>
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* SEARCH */}
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search applicants..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABS */}
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({filteredApplicants.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'shortlisted' ? 'active' : ''}`}
          onClick={() => setActiveTab('shortlisted')}
        >
          Shortlisted (3)
        </button>
        <button 
          className={`tab-button ${activeTab === 'declined' ? 'active' : ''}`}
          onClick={() => setActiveTab('declined')}
        >
          Declined (1)
        </button>
      </div>

      {/* MAIN SPLIT LAYOUT */}
      <div className="split-layout">
        
        {/* LEFT LIST */}
        <div className="list-pane">
          {filteredApplicants.map((app) => (
            <div 
              key={app.id} 
              className={`applicant-card ${selectedApplicantId === app.id ? 'selected' : ''}`}
              onClick={() => setSelectedApplicantId(app.id)}
            >
              <div className="card-info">
                <div className="avatar-circle" style={{ backgroundColor: app.color }}>
                  {app.initials}
                </div>
                <div className="card-details">
                  <div className="card-name">{app.name}</div>
                  <div className="card-meta">
                    {app.role} &bull; {app.rate} &bull; <Star className="rating-star" fill="currentColor" /> {app.rating}
                  </div>
                  <div className="card-skills">
                    {app.skills.slice(0, 2).map((skill, idx) => {
                       // alternate classes for a little color variety like the screenshot
                       let colorClass = idx === 0 ? "purple" : "blue";
                       if (app.id === 3 && idx === 0) colorClass = "orange";
                       if (app.id === 4 && idx === 0) colorClass = "green";
                       
                       return (
                         <span key={idx} className={`skill-badge ${colorClass}`}>
                           {skill}
                         </span>
                       );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="card-actions">
                <button className="btn-accept"><Check size={14} /> Accept</button>
                <button className="btn-reject"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT DETAILS */}
        {selectedApplicant && (
          <div className="details-pane">
            
            <div className="details-header">
              <div className="avatar-large" style={{ backgroundColor: selectedApplicant.color }}>
                {selectedApplicant.initials}
              </div>
              <h2 className="details-name">{selectedApplicant.name}</h2>
              <div className="details-role">{selectedApplicant.role} &bull; Freelancer</div>
              
              <div className="badges-row">
                <div className="rating-badge">
                  <Star size={12} fill="currentColor" /> {selectedApplicant.rating} ({selectedApplicant.reviews} reviews)
                </div>
                <div className="top-rated-badge">Top Rated</div>
              </div>

              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-value">{selectedApplicant.projects}</div>
                  <div className="stat-label">Projects</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{selectedApplicant.rate.split('/')[0]}</div>
                  <div className="stat-label">Per Day</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{selectedApplicant.exp}</div>
                  <div className="stat-label">Exp.</div>
                </div>
              </div>
            </div>

            <div className="section-container">
              <div className="section-title">Skills</div>
              <div className="skills-grid">
                {selectedApplicant.skills.map((skill, idx) => {
                  let colorClass = "";
                  if (idx === 0) colorClass = "purple";
                  if (idx === 1) colorClass = "blue";
                  if (idx === 2) colorClass = "green";
                  if (idx === 3) colorClass = "orange";
                  if (idx === 4) colorClass = "purple";
                  if (idx === 5) colorClass = "blue";

                  return (
                    <span key={idx} className={`skill-badge ${colorClass}`}>
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="section-container">
              <div className="section-title">Cover Note</div>
              <div className="cover-note-text">
                {selectedApplicant.coverNote}
              </div>
            </div>

            <div className="section-container">
              <div className="section-title">Portfolio</div>
              <div className="portfolio-grid">
                <button className="portfolio-btn">App Design</button>
                <button className="portfolio-btn">Dashboard UI</button>
              </div>
            </div>

            <div className="actions-bottom">
              <button className="btn-bottom-decline">Decline</button>
              <button className="btn-bottom-hire">Hire &rarr;</button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}