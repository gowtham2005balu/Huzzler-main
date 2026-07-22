// // screens/Service24hFullDetailScreen.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//   doc,
//   onSnapshot,
//   deleteDoc,
//   getFirestore,
// } from "firebase/firestore";

// export default function Service24hFullDetailScreen() {
//   const { id } = useParams();
//   const auth = getAuth();
//   const db = getFirestore();
//   const navigate = useNavigate();

//   const [service, setService] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const ref = doc(db, "services_24h", id);
//     const unsub = onSnapshot(ref, (snap) => {
//       if (!snap.exists()) {
//         setService(null);
//         setLoading(false);
//         return;
//       }

//       const data = snap.data();
//       setService({
//         id: snap.id,
//         title: data.title,
//         description: data.description,
//         price: data.price,
//         category: data.category,
//         skills: data.skills || [],
//         createdAt: data.created_at?.toDate?.() || new Date(),
//         userId: data.userId,
//       });
//       setLoading(false);
//     });

//     return () => unsub();
//   }, [id, db]);

//   if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
//   if (!service) return <div style={{ padding: 40 }}>Service not found ❌</div>;

//   const isOwner = auth.currentUser?.uid === service.userId;

//   return (
//     <div style={container}>
//       <h1>
//         ⚡ {service.title}
//         <span style={badge}>24h Service</span>
//       </h1>

//       <div style={priceBox}>💰 ₹{service.price}</div>

//       <p style={dateText}>
//         Must be completed within 24 hours
//       </p>

//       <h3>Description</h3>
//       <p style={desc}>{service.description}</p>

//       {service.skills.length > 0 && (
//         <div style={chipWrap}>
//           {service.skills.map((s, i) => (
//             <span key={i} style={chip}>{s}</span>
//           ))}
//         </div>
//       )}

//       {isOwner && (
//         <button style={deleteBtn} onClick={async () => {
//           if (!window.confirm("Delete this 24h service?")) return;
//           await deleteDoc(doc(db, "services_24h", id));
//           navigate(-1);
//         }}>
//           Delete
//         </button>
//       )}
//     </div>
//   );
// }

// const badge = {
//   marginLeft: 10,
//   background: "#ff5722",
//   color: "#fff",
//   padding: "4px 8px",
//   borderRadius: 6,
//   fontSize: 12,
// };




// screens/Service24hFullDetailScreen.jsx
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

export default function Service24hFullDetailScreen() {
  const { id } = useParams();
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const getInitials = (title) => {
    if (!title) return "";
    const w = title.split(" ");
    return (w[0][0] + (w[1]?.[0] || "")).toUpperCase();
  };


  const handleDelete = async () => {
    if (!window.confirm("Delete this service?")) return;
    await deleteDoc(doc(db, "services", id));
    alert("Service deleted");
    navigate(-1);
  };



  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "service_24h", id);
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

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!service) return <div style={{ padding: 40 }}>Service not found ❌,,</div>;

  const isOwner = auth.currentUser?.uid === service.userId;

  

  console.log(service)


const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check this job",
        text: "Super job opportunity da macha 😎",
        url: window.location.href, // current page link
      });
      console.log("Shared successfully");
    } catch (err) {
      console.log("Share cancelled", err);
    }
  } else {
    alert("Share not supported in this browser");
  }
};


  return (
    <div style={overlay}>
      <div style={card}>
        {/* HEADER */}
        <div style={topBar}>
          <span style={heading}>Project Details</span>

          <div style={iconRow}>
            <div
              style={iconBtn}
              onClick={() => handleShare()}
            >
              <Share2 size={16} />
            </div>
            <div style={iconBtn} onClick={() => navigate(-1)}>✕</div>
          </div>
        </div>

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
          <span><Clock size={13} /> days ago</span>
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

        {/* DESCRIPTION (SCROLLABLE) */}
        <h3 style={sectionTitle}>Project Description</h3>
        <div style={descBox}>
          <p style={desc}>{service.description}</p>
        </div>

        {/* ACTIONS */}
        {isOwner && (
          <div style={actions}>
            <button style={deleteBtn} onClick={handleDelete}>
              Delete this service
            </button>
            <button
              style={editBtn}
              onClick={() =>
                navigate(
                  `/freelance-dashboard/freelanceredit-service24h/${service.id}`,
                  { state: { service } }
                )
              }
            >
              Edit Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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
  // borderRadius: "50%",
  // border: "1px solid #e5e7eb",
  // background: "#fff",
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