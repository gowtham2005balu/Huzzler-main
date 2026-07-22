
import React, { useEffect, useState } from "react";
import { AlertTriangle, Plus, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firbase/Firebase";

export default function Service() {
  const [activeTab, setActiveTab] = useState("Work");
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch all services for logged-in user
  useEffect(() => {
    const fetchServices = () => {
      const email = localStorage.getItem("userEmail");
      if (!email) return;

      const q = query(collection(db, "services"), where("userEmail", "==", email));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          _id: doc.id,
          ...doc.data()
        }));
        // Sort by createdAt descending locally if needed, or just set it
        data.sort((a, b) => {
           const timeA = a.createdAt?.seconds || 0;
           const timeB = b.createdAt?.seconds || 0;
           return timeB - timeA;
        });
        setServices(data);
      }, (error) => {
        console.error("Fetch services error:", error);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchServices();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="service-page-wrapper">
      <style>{`
        .service-page-wrapper {
          min-height: 100vh;
          background-color: #F5F5F5;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
        }
        .service-header {
          width: 100%;
          background: white;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .service-header h1 {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin: 0;
          color: #111827;
        }
        .header-icons {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #4B5563;
        }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #D1D5DB;
        }
        .service-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          padding: 40px 24px;
        }
        .service-content {
          width: 100%;
          max-width: 896px;
        }
        .service-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #111827;
        }
        .service-tabs {
          display: flex;
          gap: 32px;
          margin-bottom: 24px;
          border-bottom: 1px solid #E5E7EB;
        }
        .service-tab {
          padding-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
        }
        .service-tab.active {
          border-bottom: 2px solid black;
          color: black;
        }
        .service-tab.inactive {
          color: #6B7280;
        }
        .service-tab.inactive:hover {
          color: black;
        }
        .add-service-card {
          background: #FFFFE0;
          border: 1px solid #FDE047;
          border-radius: 6px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .add-service-card:hover {
          background: #FEF08A;
        }
        .add-icon-wrapper {
          background: #FACC15;
          border-radius: 50%;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .no-services-box {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          text-align: center;
        }
        .service-item {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          padding: 16px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 16px;
          transition: box-shadow 0.2s;
        }
        .service-item:hover {
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .service-thumbnail {
          width: 160px;
          height: 112px;
          object-fit: cover;
          border-radius: 6px;
        }
        .service-info {
          flex: 1;
        }
        .service-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
        .tag {
          background: #F3F4F6;
          color: #374151;
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 9999px;
        }
        .view-more-btn {
          background: #FDE047;
          color: black;
          font-size: 12px;
          padding: 6px 16px;
          border-radius: 6px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .view-more-btn:hover {
          background: #FACC15;
        }
      `}</style>

      {/* 🔹 Header */}
      <header className="service-header">
        <h1>HUZZLER</h1>
        <div className="header-icons">
          <i className="ri-notification-3-line" style={{ fontSize: '20px', cursor: 'pointer' }}></i>
          <i className="ri-chat-3-line" style={{ fontSize: '20px', cursor: 'pointer' }}></i>
          <div className="avatar"></div>
        </div>
      </header>

      {/* 🔸 Main Section */}
      <main className="service-main">
        <div className="service-content">
          <h2 className="service-title">Your Services</h2>

          {/* 🔸 Tabs */}
          <div className="service-tabs">
            {["Work", "24 hour"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`service-tab ${activeTab === tab ? "active" : "inactive"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 🔸 Add Service Card */}
          <div
            onClick={() => navigate("/add-service")}
            className="add-service-card"
          >
            <div className="add-icon-wrapper">
              <Plus size={20} color="black" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '14px', margin: 0, color: '#111827' }}>Add Service</h3>
              <p style={{ fontSize: '12px', color: '#4B5563', margin: '4px 0 0 0' }}>
                Adding a standout service listing helps clients understand what you offer.
              </p>
            </div>
          </div>

          {/* 🟡 If No Services */}
          {services.length === 0 ? (
            <div className="no-services-box">
              <AlertTriangle color="#EAB308" size={45} style={{ margin: '0 auto 12px auto' }} />
              <h2 style={{ fontWeight: 600, fontSize: '18px', margin: '0 0 8px 0', color: '#111827' }}>
                It looks like you haven’t added any services yet.
              </h2>
              <p style={{ color: '#4B5563', fontSize: '14px', margin: 0 }}>
                Create a service offering to highlight your skills and attract the right clients.
              </p>
            </div>
          ) : (
            /* 🟢 Show User Services */
            services.map((s) => (
              <div
                key={s._id}
                className="service-item"
              >
                {/* Thumbnail */}
                <img
                  src={s.images?.[0] || "https://via.placeholder.com/150"}
                  alt="Service"
                  className="service-thumbnail"
                />

                {/* Info Section */}
                <div className="service-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '16px', margin: 0, color: '#111827' }}>{s.title}</h3>
                    <MoreHorizontal size={18} color="#6B7280" style={{ cursor: 'pointer' }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', color: '#4B5563', fontSize: '14px' }}>
                    <p style={{ margin: 0 }}>₹ {s.price}</p>
                    <span>•</span>
                    <p style={{ margin: 0 }}>{s.deliveryDays} Days</p>
                  </div>

                  <div className="service-tags">
                    {[...(s.skills || []), ...(s.tools || [])].map((tag, idx) => (
                      <span
                        key={idx}
                        className="tag"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View More Button */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                  <button
                    onClick={() => navigate(`/view-service/${s._id}`)}
                    className="view-more-btn"
                  >
                    View more
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
