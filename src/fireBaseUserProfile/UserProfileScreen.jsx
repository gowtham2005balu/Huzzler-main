// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { doc, collection, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firbase/Firebase";
import "./UserProfile.css"; // Optional for custom styles

export default function UserProfile() {
  const userId = "4IN9UoJogkPHw8s5ib84dYF1LDl2";

  const [userData, setUserData] = useState(null);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    // Listen to user document
    const unsubscribeUser = onSnapshot(doc(db, "services", userId), (docSnap) => {
      if (docSnap.exists()) setUserData(docSnap.data());
    });

    // Listen to portfolio collection
    const unsubscribePortfolio = onSnapshot(
      collection(db, "users", userId, "portfolio"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPortfolio(data);
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribePortfolio();
    };
  }, [userId]);

  if (!userData) return <div className="loader">Loading...</div>;

  return (
    <div className="profile-container">
      {/* 🔍 Search + Notifications */}
      <div className="search-bar">
        <input type="text" placeholder="Search" />
        <button className="notification-btn">🔔</button>
      </div>

      {/* 🖼 Profile Card */}
      <div className="profile-card">
        <img
          src="/assets/profile.jpg"
          alt="Profile"
          className="profile-avatar"
        />
        <h2>{userData.name || "Unknown User"}</h2>
        <p>{userData.location || ""}</p>
        <button className="contact-btn">Get in Touch</button>
      </div>

      {/* Section Cards */}
      <SectionCard title="Professional Title" content={userData.title} chipColor="#A8E6CF" />
      <SectionCard title="About" content={userData.about} />
      <SectionCard
        title="Skills & Tools"
        chips={[...(userData.skills || []), ...(userData.tools || [])]}
      />

      {/* Portfolio */}
      <div className="portfolio-section">
        <h3>Portfolio</h3>
        {portfolio.map((p) => (
          <div key={p.id} className="portfolio-card">
            <h4>{p.title}</h4>
            <p>{p.description}</p>
            <div className="chip-row">
              {[...(p.skills || []), ...(p.tools || [])].map((item, idx) => (
                <span key={idx} className="chip">{item}</span>
              ))}
            </div>
            {p.projectUrl && (
              <a href={p.projectUrl} target="_blank" rel="noreferrer" className="view-btn">
                View Project
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 🔹 Section Card Component
function SectionCard({ title, content, chips, chipColor }) {
  return (
    <div className="section-card">
      <h4>{title}</h4>
      {content && <p>{content}</p>}
      {chips && chips.length > 0 && (
        <div className="chip-row">
          {chips.map((item, idx) => (
            <span key={idx} className="chip" style={{ backgroundColor: chipColor || "#eee" }}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
