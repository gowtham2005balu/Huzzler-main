// src/pages/PausedJobs.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";


export default function PausedJobs() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pausedJobs, setPausedJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("Work"); // Work | 24hour

  // auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, [auth]);

  // subscribe to pausedJobs for current user
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "pausedJobs"), where("userId", "==", user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));
        setPausedJobs(docs);
        setLoading(false);
      },
      (err) => {
        console.error("pausedJobs snapshot error", err);
        setError(err.message || "Failed to load paused jobs");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [db, user]);

  // filter jobs by tab and search
  const filteredJobs = useMemo(() => {
    const lower = search.trim().toLowerCase();
    return pausedJobs
      .filter((job) => {
        const is24 = !!job.is24;
        return selectedTab === "Work" ? !is24 : is24;
      })
      .filter((job) => {
        if (!lower) return true;
        const title = (job.title || "").toString().toLowerCase();
        const category = (job.category || "").toString().toLowerCase();
        const skills = (job.skills || []).join(" ").toLowerCase();
        return title.includes(lower) || category.includes(lower) || skills.includes(lower);
      });
  }, [pausedJobs, selectedTab, search]);

  // helper to convert Firestore-like timestamps to Date
  const tsToDate = (ts) => {
    if (!ts) return null;
    if (typeof ts.toDate === "function") return ts.toDate();
    if (ts.seconds) return new Date(ts.seconds * 1000);
    if (typeof ts === "string") return new Date(ts);
    return null;
  };

  // restore job: move to jobs or jobs_24h then delete pausedJobs doc
  const handleRestore = async (job) => {
    if (!window.confirm("Restore this job to active jobs?")) return;
    try {
      const is24 = !!job.is24;
      const collectionName = is24 ? "jobs_24h" : "jobs";
      await setDoc(doc(db, collectionName, job.id), job);
      await deleteDoc(doc(db, "pausedJobs", job.id));
      alert("Job restored successfully");
    } catch (err) {
      console.error("Failed to restore job:", err);
      alert("Failed to restore job: " + (err?.message || err));
    }
  };

  const handleViewMore = (job) => {
    navigate("/job-detail", { state: { job } });
  };

  if (!user) {
    return (
      <div style={styles.center}>
        <p>Please log in to view your paused projects.</p>
      </div>
    );
  }

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (error) return <div style={styles.center}><p style={{ color: "red" }}>Error: {error}</p></div>;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ width: 40 }} />
        <div style={styles.headerTitle}>Paused Projects</div>
        <button style={styles.iconBtn} title="Notifications">🔔</button>
      </div>

      {/* Search */}
      <div style={styles.searchArea}>
        <div style={styles.searchBox}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.innerTabs}>
        <button
          onClick={() => setSelectedTab("Work")}
          style={selectedTab === "Work" ? styles.tabSelected : styles.tabUnselected}
        >
          Work
        </button>
        <button
          onClick={() => setSelectedTab("24hour")}
          style={selectedTab === "24hour" ? styles.tabSelected : styles.tabUnselected}
        >
          24 hour
        </button>
      </div>

      {/* List */}
      <div style={{ padding: 16 }}>
        {filteredJobs.length === 0 ? (
          <EmptyState />
        ) : (
          filteredJobs.map((job) => (
            <WorkCard
              key={job.id}
              job={job}
              onViewMore={() => handleViewMore(job)}
              onRestore={() => handleRestore(job)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function WorkCard({ job, onViewMore, onRestore }) {
  // convert acceptedAt (Firestore timestamp-like) to Date
  const acceptedAtDate = tsToDateLocal(job.acceptedAt);

  // use timeago.format here INSIDE component
  const timeAgo = acceptedAtDate ? timeago.format(acceptedAtDate) : "Recently";

  const priceRange =
    job?.budget_from != null || job?.budget_to != null
      ? `${job.budget_from ?? "—"} - ${job.budget_to ?? "—"}`
      : "—";

  return (
    <div style={styles.card}>
      <div style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={styles.iconBox}><span style={{ fontSize: 18 }}>💼</span></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={styles.cardTitle}>{job.title || "Untitled Job"}</div>
              <PopupMenu onRestore={onRestore} />
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
              <span style={{ fontSize: 12, color: "#666" }}>⏱</span>
              <span style={{ fontSize: 13, color: "#666" }}>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 600, color: "#111" }}>₹ {priceRange}</div>
        <button style={styles.viewBtn} onClick={onViewMore}>View more</button>
      </div>
    </div>
  );
}

// small helper local to WorkCard (keeps WorkCard simple)
function tsToDateLocal(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();
  if (ts.seconds) return new Date(ts.seconds * 1000);
  if (typeof ts === "string") return new Date(ts);
  return null;
}

function PopupMenu({ onRestore }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((v) => !v)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
        ⋮
      </button>

      {open && (
        <div style={styles.popupMenu} onMouseLeave={() => setOpen(false)}>
          <div style={styles.popupItem} onClick={() => { setOpen(false); onRestore(); }}>
            Restore
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: 32, textAlign: "center", color: "#666" }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>No works yet</h2>
      <p style={{ maxWidth: 560, margin: "0 auto", lineHeight: 1.5 }}>
        You haven't accepted any work projects yet. Start browsing jobs to find your next opportunity!
      </p>
    </div>
  );
}

/* ---------- Styles ---------- */
const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFFCA8",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: "#111",
  },
  iconBtn: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
  },
  searchArea: {
    backgroundColor: "#FFFCA8",
    padding: "12px 16px",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  searchBox: {
    maxWidth: 720,
    margin: "0 auto",
  },
  searchInput: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #e3e3e3",
    outline: "none",
  },
  innerTabs: {
    display: "flex",
    background: "#fff",
    padding: 8,
    justifyContent: "center",
    gap: 12,
    borderBottom: "1px solid #eee",
  },
  tabSelected: {
    padding: "8px 16px",
    borderRadius: 6,
    background: "#111",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  tabUnselected: {
    padding: "8px 16px",
    borderRadius: 6,
    background: "#fff",
    color: "#666",
    border: "1px solid #eee",
    cursor: "pointer",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
    marginBottom: 12,
    overflow: "hidden",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#f2f2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111",
  },
  viewBtn: {
    background: "#FFFCA8",
    border: "none",
    padding: "8px 14px",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: 500,
  },
  popupMenu: {
    position: "absolute",
    right: 0,
    top: 22,
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 8,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    zIndex: 40,
    minWidth: 120,
  },
  popupItem: {
    padding: "10px 12px",
    cursor: "pointer",
    borderBottom: "1px solid #f3f3f3",
  },
  center: {
    display: "flex",
    minHeight: "60vh",
    alignItems: "center",
    justifyContent: "center",
  },
};
