
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  doc,
  onSnapshot,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";
import { Bookmark, Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { FiEye } from "react-icons/fi";

const getInitials = (title) => {
  if (!title) return "";
  const w = title.split(" ");
  return (w[0][0] + (w[1]?.[0] || "")).toUpperCase();
};

export default function ServiceFullDetailScreen() {
  const { id } = useParams();
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const ref = doc(db, "services", id);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setService(null);
        setLoading(false);
        return;
      }

      const data = snap.data();
      setService({
        id: snap.id,
        title: data.title || "",
        description: data.description || "",
        budgetFrom: data.budget_from ?? 0,
        budgetTo: data.budget_to ?? 0,
        skills: data.skills || [],
        createdAt: data.createdAt?.toDate?.() || new Date(),
        userId: data.userId,
      });

      setLoading(false);
    });

    return () => unsub();
  }, [id, db]);


  const handleShare = async () => {
  const shareUrl = window.location.href;
  const shareData = {
    title: service?.title || "Service Details",
    text: "Check out this service",
    url: shareUrl,
  };

  // ✅ Modern browsers & mobile
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error("Share cancelled or failed", err);
    }
  } 
  // ✅ Fallback for desktop
  else {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard 📋");
    } catch (err) {
      alert("Unable to copy link");
    }
  }
};



  const handleDelete = async () => {
    if (!window.confirm("Delete this service?")) return;
    await deleteDoc(doc(db, "services", id));
    alert("Service deleted");
    navigate(-1);
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!service) return <div style={{ padding: 40 }}>Service not found ❌</div>;

  const isOwner = auth.currentUser?.uid === service.userId;
  const daysAgo = Math.floor(
    (Date.now() - service.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div style={overlay}>
      <div style={card}>
        {/* HEADER */}
        <div style={topBar}>
          <span style={heading}>Project Details</span>

          <div style={iconRow}>
            {/* <div style={iconBtn}><Bookmark size={16} /></div> */}
            <div style={iconBtn} onClick={handleShare}>
              <Share2 size={16} />
            </div>

            <div style={iconBtn} onClick={() => navigate(-1)}>✕</div>
          </div>
        </div>
        <br />

        {/* TITLE */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "linear-gradient(135deg,#7B3CFF,#9B42FF)",
            color: "#FFF",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          {getInitials(service.title)}


        </div>
        <br />
        <h1 style={title}>{service.title}</h1>
        {/* META */}
        <div style={metaRow}>
          <div>
            <span style={metaLabel}>Budget</span>
            <p style={metaValue}>₹{service.budgetFrom} - ₹{service.budgetTo}</p>
          </div>
          <div>
            <span style={metaLabel}>Timeline</span>
            <p style={metaValue}><Calendar size={16} />2 - 3 weeks</p>
          </div>
          <div>
            <span style={metaLabel}>Location</span>
            <p style={metaValue}><MapPin size={16} />Remote</p>
          </div>
        </div>

        {/* IMPRESSION */}
        <div style={impression}>
          <span><FiEye /> 29 Impression</span>
          <span><Clock size={13} /> {daysAgo} days ago</span>
        </div>

        {/* SKILLS */}
        {service.skills.length > 0 && (
          <>
            <h3 style={sectionTitle}>Skills Required</h3>
            <div style={skills}>
              {service.skills.map((s, i) => (
                <span key={i} style={skillChip}>{s}</span>
              ))}
            </div>
          </>
        )}
        <br />

        {/* DESCRIPTION (SCROLLABLE) */}
        <h3 style={sectionTitle}>Project Description</h3>
        <div style={descBox}>
          <p style={desc}>{service.description}</p>
        </div>

      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const overlay = {
  minHeight: "100vh",
  // background: "rgba(0,0,0,0.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
};

const card = {
  width: "100%",
  maxWidth: 520,
  height: "90vh",
  background: "#fff",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  display: "flex",
  flexDirection: "column",
  marginTop:'60px'
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const heading = {
  fontSize: 24,
  fontWeight: 400,
  color: "#6b7280",
};

const iconRow = {
  display: "flex",
  gap: 10,
};

const iconBtn = {
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const title = {
  fontSize: 24,
  fontWeight: 400,

};

const metaRow = {
  display: "flex",
  justifyContent: "space-between",
  // background: "#f9fafb",
  padding: 14,
  borderRadius: 12,
  marginTop: 14,
};

const metaLabel = {
  fontSize: 12,
  color: "#6b7280",
};

const metaValue = {
  fontSize: 20,
  fontWeight: 400,
};

const impression = {
  marginTop: 10,
  fontSize: 13,
  color: "#6b7280",
  display: "flex",
  gap: 12,
};

const sectionTitle = {
  marginTop: 18,
  marginBottom: 15,
  fontSize: 20,
  fontWeight: 400,
};

const skills = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  fontSize: 20,
  fontWeight: 400,
};

const skillChip = {
  background: "rgba(255, 240, 133, 0.7)",
  padding: "6px 12px",
  borderRadius: "8px",
  fontSize: 13,
  fontWeight: 500,
};

const descBox = {
  flex: 1,
  overflowY: "auto",
  paddingRight: 6,
};

const desc = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "#374151",
  whiteSpace: "pre-line",
};

const actions = {
  marginTop: 16,
  display: "flex",
  gap: 12,
};

const editBtn = {
  flex: 1,
  background: "#7c3aed",
  color: "#fff",
  border: "none",
  padding: "12px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};

const deleteBtn = {
  flex: 1,
  background: "#fff",
  color: "#7c3aed",
  border: "1px solid #c4b5fd",
  padding: "12px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};
