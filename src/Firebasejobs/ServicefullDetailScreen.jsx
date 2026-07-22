import React, { useEffect, useState } from "react";
import { db, auth } from "../firbase/Firebase"; // adjust path
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

export default function JbfullDetailScreen() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Works");

  useEffect(() => {
    if (!jobId) return;

    const unsub = onSnapshot(doc(db, "services", jobId), (snap) => {
      if (snap.exists()) setData(snap.data());
    });

    if (currentUser) {
      const u = onSnapshot(doc(db, "users", currentUser.uid), (snap) => {
        if (snap.exists()) {
          const ud = snap.data();
          setUserData(ud);
          setIsSaved((ud.savedJobs || []).includes(jobId));
        }
      });
      return () => u();
    }

    return () => unsub();
  }, [jobId]);

  const timeAgo = (d) => {
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const toggleSave = async () => {
    if (!currentUser) return;
    const ref = doc(db, "users", currentUser.uid);
    await updateDoc(ref, {
      savedJobs: isSaved ? arrayRemove(jobId) : arrayUnion(jobId),
    });
  };

  if (!data) return <div>Loading...</div>;

  const {
    title,
    description,
    price,
    deliveryDuration,
    skills = [],
    tools = [],
    impressions,
    createdAt,
    userId,
    image,
  } = data;

  return (
    <div style={{ background: "#fff", paddingBottom: 80 }}>
      <div style={{ background: "#FDFD96", padding: 25, borderRadius: "0 0 30px 30px" }}>
        <h2 style={{ textAlign: "center" }}>Explore jobs</h2>
      </div>

      <div style={{ marginTop: 20, padding: 16 }}>
        <h3 onClick={() => setSelectedTab("Works")} style={{ cursor: "pointer" }}>Works</h3>
        <hr />

        {image && (
          <img src={image} alt="job" style={{ width: "100%", borderRadius: 10, marginTop: 12 }} />
        )}

        <h2 style={{ marginTop: 15 }}>{title}</h2>
        <p>👁 {impressions} views • ⏱ {createdAt ? timeAgo(createdAt.toDate()) : ""}</p>
        <p style={{ marginTop: 10 }}>{description}</p>

        <h3 style={{ marginTop: 20 }}>Skills & Tools</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {skills.map((s, i) => (
            <span key={i} style={{ padding: "6px 14px", border: "1px solid #ccc", borderRadius: 20 }}>{s}</span>
          ))}
          {tools.map((t, i) => (
            <span key={i} style={{ padding: "6px 14px", border: "1px solid #ccc", borderRadius: 20 }}>{t}</span>
          ))}
        </div>

        <div style={{ marginTop: 30, padding: 20, background: "#FFFFF1", border: "2px solid #FFE066", borderRadius: 20 }}>
          <h2>₹{price}</h2>
          <p>Delivery in {deliveryDuration}</p>

          <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
            <button
              onClick={() => navigate(`/freelancer/${userId}`)}
              style={{ padding: "10px 20px", borderRadius: 30, background: "#FFEB3B", border: 0 }}
            >
              Get In Touch
            </button>

            <button
              onClick={toggleSave}
              style={{ padding: "10px 20px", borderRadius: 30, border: `2px solid ${isSaved ? "red" : "gray"}` }}
            >
              {isSaved ? "❤️ Saved" : "🤍 Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}