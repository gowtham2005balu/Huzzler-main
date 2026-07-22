// ServicePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firbase/Firebase";
import { Search, Plus, MoreVertical, Star, Clock, Briefcase } from "lucide-react";

export default function FreelancerMyjob() {
  const [selectedTab, setSelectedTab] = useState("Works");
  const [currentUser, setCurrentUser] = useState(() => auth.currentUser);
  const [services, setServices] = useState([]);
  const [jobs24h, setJobs24h] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const colRef = collection(db, "services");
    const q = query(colRef, where("userId", "==", currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() || {}),
      }));
      setServices(list);
    });
    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const colRef = collection(db, "users", currentUser.uid, "service_24h");
    const unsub = onSnapshot(colRef, (snap) => {
      const list = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() || {}),
      }));
      setJobs24h(list);
    });
    return () => unsub();
  }, [currentUser]);

  const handleShareService = useCallback(async (job) => {
    if (!currentUser) return;
    try {
      const chatId = "someChatId";
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: currentUser.uid,
        type: "job",
        jobId: job.id,
        title: job.title || "",
        description: job.description || "",
        timestamp: new Date(),
      });
      console.log("Job shared!");
    } catch (err) {
      console.error("Share error:", err);
    }
  }, [currentUser]);

  const handleDeleteService = useCallback(async (job) => {
    if (!currentUser || !job?.id) return;
    try {
      await deleteDoc(doc(db, "services", job.id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }, [currentUser]);

  const handleDelete24h = useCallback(async (job) => {
    if (!currentUser || !job?.id) return;
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "service_24h", job.id));
    } catch (err) {
      console.error("Delete 24h failed:", err);
    }
  }, [currentUser]);

  const filteredServices = services.filter((s) => s.title?.toLowerCase().includes(search.toLowerCase()));
  const filteredJobs24h = jobs24h.filter((s) => s.title?.toLowerCase().includes(search.toLowerCase()));

  const ServiceCard = ({ job, is24h }) => {
    const allChips = [...((job.skills || []).map(String) || []), ...((job.tools || []).map(String) || [])];
    
    return (
      <div className="service-card">
        <div className="service-image-container">
          <img src={job.image || "/assets/gallery.png"} alt="Service" className="service-image" />
          <div className="service-price">₹{job.price || job.budget || "0"}</div>
        </div>
        <div className="service-content">
          <div className="service-header">
            <h3 className="service-title">{job.title || "Untitled Service"}</h3>
            <div className="service-menu-wrapper">
              <button className="menu-btn" onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}>
                <MoreVertical size={18} />
              </button>
              {openMenuId === job.id && (
                <div className="popup-menu">
                  <button className="popup-item" onClick={() => {
                    setOpenMenuId(null);
                    navigate(is24h ? "/freelance-dashboard/edit-24h-service" : "/freelance-dashboard/edit-service", { state: { job, jobId: job.id } });
                  }}>Edit</button>
                  <button className="popup-item" onClick={() => { setOpenMenuId(null); handleShareService(job); }}>Share</button>
                  <div className="popup-divider"></div>
                  <button className="popup-item delete" onClick={() => { setOpenMenuId(null); is24h ? handleDelete24h(job) : handleDeleteService(job); }}>Delete</button>
                </div>
              )}
            </div>
          </div>
          <div className="service-meta">
            {is24h ? (
              <span className="meta-tag"><Clock size={14}/> 24 Hour Service</span>
            ) : (
              <span className="meta-tag"><Briefcase size={14}/> {job.deliveryDuration || "Delivery time not set"}</span>
            )}
          </div>
          <p className="service-desc">{job.description || "No description provided."}</p>
          <div className="chips-container">
            {allChips.slice(0, 4).map((chip, idx) => (
              <span key={idx} className="chip">{chip}</span>
            ))}
            {allChips.length > 4 && <span className="chip">+{allChips.length - 4}</span>}
          </div>
          <button className="view-more-btn" onClick={() => navigate(is24h ? "/freelance-dashboard/24h-service-detail" : "/freelance-dashboard/service-detail", { state: { job } })}>
            View details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="my-services-container">
      <style>{`
        .my-services-container {
          background: #FAFAFA;
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
          padding: 32px;
          display: flex;
          flex-direction: column;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .page-title {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 16px;
        }

        .search-wrapper {
          position: relative;
          width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
        }

        .search-input {
          width: 100%;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 12px 16px 12px 42px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #7C3AED;
        }

        .btn-create {
          background: #7C3AED;
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          padding: 0 20px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-create:hover {
          background: #6D28D9;
        }

        .tabs-container {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid #E5E7EB;
          padding-bottom: 16px;
        }

        .tab-button {
          background: transparent;
          border: none;
          padding: 8px 16px;
          font-size: 15px;
          font-weight: 600;
          color: #6B7280;
          cursor: pointer;
          position: relative;
        }

        .tab-button.active {
          color: #7C3AED;
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -17px;
          left: 0;
          right: 0;
          height: 3px;
          background: #7C3AED;
          border-radius: 3px 3px 0 0;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .service-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.06);
        }

        .service-image-container {
          position: relative;
          width: 100%;
          height: 180px;
          background: #F3F4F6;
        }

        .service-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .service-price {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(17, 24, 39, 0.85);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          backdrop-filter: blur(4px);
        }

        .service-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .service-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0;
          line-height: 1.4;
        }

        .service-menu-wrapper {
          position: relative;
        }

        .menu-btn {
          background: none;
          border: none;
          color: #9CA3AF;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
        }

        .menu-btn:hover {
          background: #F3F4F6;
          color: #4B5563;
        }

        .popup-menu {
          position: absolute;
          right: 0;
          top: 100%;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          width: 120px;
          z-index: 10;
          overflow: hidden;
        }

        .popup-item {
          width: 100%;
          text-align: left;
          padding: 10px 16px;
          background: none;
          border: none;
          font-size: 13px;
          font-weight: 500;
          color: #4B5563;
          cursor: pointer;
        }

        .popup-item:hover {
          background: #F9FAFB;
        }

        .popup-item.delete {
          color: #EF4444;
        }

        .popup-divider {
          height: 1px;
          background: #E5E7EB;
        }

        .service-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .meta-tag {
          font-size: 12px;
          color: #6B7280;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }

        .service-desc {
          font-size: 13px;
          color: #6B7280;
          line-height: 1.5;
          margin: 0 0 16px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: auto;
          margin-bottom: 16px;
        }

        .chip {
          background: #F3F4F6;
          color: #4B5563;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .view-more-btn {
          width: 100%;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          color: #111827;
          padding: 10px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .view-more-btn:hover {
          background: #F3F4F6;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 20px;
          text-align: center;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          background: #F3E8FF;
          color: #7C3AED;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .empty-desc {
          font-size: 14px;
          color: #6B7280;
          max-width: 400px;
          line-height: 1.5;
          margin: 0 0 24px 0;
        }

        @media (max-width: 768px) {
          .my-services-container {
            padding: 20px;
          }
          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          .search-wrapper {
            width: 100%;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">My Services</h1>
        <div className="header-actions">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search your services..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-create" onClick={() => navigate("/freelance-dashboard/add-service-form")}>
            <Plus size={18} /> New
          </button>
        </div>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-button ${selectedTab === 'Works' ? 'active' : ''}`}
          onClick={() => setSelectedTab('Works')}
        >
          Active Services ({services.length})
        </button>
        <button 
          className={`tab-button ${selectedTab === '24 hour' ? 'active' : ''}`}
          onClick={() => setSelectedTab('24 hour')}
        >
          24 Hour Jobs ({jobs24h.length})
        </button>
      </div>

      <div className="services-grid">
        {selectedTab === "Works" ? (
          filteredServices.length > 0 ? (
            filteredServices.map(job => <ServiceCard key={job.id} job={job} is24h={false} />)
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <div className="empty-icon">
                <Briefcase size={32} />
              </div>
              <h3 className="empty-title">Start your first service today!</h3>
              <p className="empty-desc">Showcase your skills with a service offering that attracts the right clients. Start now and turn your expertise into opportunities!</p>
              <button className="btn-create" onClick={() => navigate("/freelance-dashboard/add-service-form")}>
                <Plus size={18} /> Add Service
              </button>
            </div>
          )
        ) : (
          filteredJobs24h.length > 0 ? (
            filteredJobs24h.map(job => <ServiceCard key={job.id} job={job} is24h={true} />)
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <div className="empty-icon">
                <Clock size={32} />
              </div>
              <h3 className="empty-title">All set – just add your first 24h job!</h3>
              <p className="empty-desc">Post a 24-hour job with clear details so clients can respond quickly.</p>
              <button className="btn-create" onClick={() => navigate("/freelance-dashboard/add-24h-service")}>
                <Plus size={18} /> Post 24h Job
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}