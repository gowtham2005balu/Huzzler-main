// ExploreJobsPage_FULL.js
// Single-file React conversion of your Flutter ExploreclientJobScreen
// Requires: react, firebase (v9 modular), date-fns, react-router-dom (optional)
// npm: npm i firebase date-fns react-router-dom

import React, { useEffect, useMemo, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  runTransaction,
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { formatDistanceToNowStrict } from "date-fns";


const timeAgo = (date) => {
  if (!date) return "";
  try {
    return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
};

const formatAmount = (amount) => {
  if (amount == null) return "0";
  const n = Number(amount);
  if (Number.isNaN(n)) return amount.toString();
  if (n < 1000) return n.toString();
  if (n < 1000000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
};

// ----------------------- STYLES (inline — keep single-file) -----------------------
const S = {
  page: { background: "#f6f7fb", minHeight: "100vh", fontFamily: "Rubik, sans-serif" },
  headerWrap: { position: "relative", paddingBottom: 34 },
  header: {
    background: "#FDFD96",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: "20px 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: 600 },
  searchBarContainer: {
    position: "absolute",
    left: "12%",
    right: "12%",
    bottom: -26,
  },
  searchBar: {
    height: 52,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
  },
  tabsRow: { display: "flex", gap: 30, padding: "18px 20px 10px 20px" },
  tabText: (active) => ({ fontSize: 16, fontWeight: 700, color: active ? "#111" : "#7b7b7b", cursor: "pointer" }),
  tabUnderline: (active) => ({ height: 3, width: 56, background: active ? "#f7d84b" : "transparent", marginTop: 6, borderRadius: 3 }),
  listWrap: { padding: "8px 0", marginTop: 8 },
  card: {
    margin: "12px 16px",
    borderRadius: 14,
    padding: 16,
    background: "#fff",
    boxShadow: "0 6px 18px rgba(17,24,39,0.04)",
    border: "1px solid #eef2f6",
  },
  leftCol: {
    minWidth: 120,
    maxWidth: 140,
    background: "#FDFD96",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  chips: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 },
  chip: { padding: "6px 10px", borderRadius: 12, background: "#efefef", fontSize: 12 },
  badge: { padding: "6px 10px", borderRadius: 8, fontWeight: 700, background: "#f7d84b" },
  btnPrimary: { background: "#FDFD96", border: "none", padding: "8px 12px", borderRadius: 18, cursor: "pointer", fontWeight: 700 },
  saveBtn: { cursor: "pointer", border: "none", background: "transparent", fontSize: 18 },
  emptyWrap: { padding: 36, textAlign: "center", color: "#6b7280" },
};

// ----------------------- SMALL UI HELPERS -----------------------
function EmptyState({ title, subtitle, buttonText, onClick }) {
  return (
    <div style={S.emptyWrap}>
      <div style={{ width: 160, height: 120, margin: "0 auto 8px" }}>
        <svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect rx="10" width="100%" height="100%" fill="#f3f4f6" />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#9ca3af">No items</text>
        </svg>
      </div>
      <h3 style={{ margin: 8 }}>{title}</h3>
      <p style={{ marginTop: 6, marginBottom: 14 }}>{subtitle}</p>
      {buttonText && <button style={S.btnPrimary} onClick={onClick}>{buttonText}</button>}
    </div>
  );
}

function Chips({ items = [], limit = 3 }) {
  const visible = items.slice(0, limit);
  const hidden = Math.max(0, items.length - visible.length);
  return (
    <div style={S.chips}>
      {visible.map((t, i) => <div key={i} style={S.chip}>{t}</div>)}
      {hidden > 0 && <div style={{ ...S.chip, background: "#d1d5db" }}>+{hidden}</div>}
    </div>
  );
}

// ----------------------- MAIN PAGE -----------------------
export default function ExploreJobsPage_FULL() {
  const mountedRef = useRef(true);

  // tabs: "Works" | "24 hour" | "Saved"
  const [tab, setTab] = useState("Works");
  const [search, setSearch] = useState("");

  // data streams
  const [services, setServices] = useState([]);
  const [services24, setServices24] = useState([]);
  const [userDoc, setUserDoc] = useState(null); // current user document
  const [savedIds, setSavedIds] = useState(new Set());
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const user = auth.currentUser;

  // subscribe to services
  useEffect(() => {
    const q = query(collection(db, "services"));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (mountedRef.current) setServices(docs);
    }, err => console.error("services onSnapshot error:", err));
    return () => unsub();
  }, []);

  // subscribe to service_24h ordered by createdAt desc
  useEffect(() => {
    const q = query(collection(db, "service_24h"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (mountedRef.current) setServices24(docs);
    }, err => console.error("service_24h onSnapshot error:", err));
    return () => unsub();
  }, []);

  // user doc realtime
  useEffect(() => {
    if (!user) {
      setUserDoc(null);
      setSavedIds(new Set());
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        setUserDoc(null);
        setSavedIds(new Set());
        return;
      }
      const d = snap.data();
      setUserDoc(d);
      const saved = new Set([...(d.savedJobs || []), ...(d.favoriteJobs || [])]);
      setSavedIds(saved);
    }, err => console.error("user doc onSnapshot error:", err));
    return () => unsub();
  }, [user]);

  // notifications (simple)
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const q = query(collection(db, "notifications"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotifications(docs);
    }, err => console.error("notifications onSnapshot:", err));
    return () => unsub();
  }, [user]);

  useEffect(() => () => { mountedRef.current = false; }, []);

  // ----------------------- ACTIONS -----------------------
  async function toggleSaved(jobId) {
    if (!auth.currentUser) {
      alert("Please sign-in to save jobs.");
      return;
    }
    const userRef = doc(db, "users", auth.currentUser.uid);
    const isSaved = savedIds.has(jobId);
    try {
      if (isSaved) {
        await updateDoc(userRef, { savedJobs: arrayRemove(jobId) });
      } else {
        await updateDoc(userRef, { savedJobs: arrayUnion(jobId) });
      }
    } catch (e) {
      // If document doesn't exist, create it
      try {
        await setDoc(userRef, { savedJobs: isSaved ? [] : [jobId] }, { merge: true });
      } catch (err) {
        console.error("toggleSaved error:", err);
      }
    }
  }

  async function toggleFavorite(jobId) {
    if (!auth.currentUser) {
      alert("Please sign-in to favourite jobs.");
      return;
    }
    const userRef = doc(db, "users", auth.currentUser.uid);
    const isFav = savedIds.has(jobId);
    try {
      if (isFav) {
        await updateDoc(userRef, { favoriteJobs: arrayRemove(jobId) });
      } else {
        await updateDoc(userRef, { favoriteJobs: arrayUnion(jobId) });
      }
    } catch (e) {
      try {
        await setDoc(userRef, { favoriteJobs: isFav ? [] : [jobId] }, { merge: true });
      } catch (err) {
        console.error("toggleFavorite error:", err);
      }
    }
  }

  async function incrementImpression(collectionName, docId) {
    const ref = doc(db, collectionName, docId);
    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) return;
        const data = snap.data();
        const viewedBy = data.viewedBy || [];
        const uid = auth.currentUser ? auth.currentUser.uid : "anonymous";
        if (!viewedBy.includes(uid)) {
          tx.update(ref, {
            impressions: (data.impressions || 0) + 1,
            viewedBy: arrayUnion(uid),
          });
        }
      });
    } catch (e) {
      console.error("incrementImpression error:", e);
    }
  }

  async function pauseJob(collectionName, docId) {
    try {
      const ref = doc(db, collectionName, docId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data();
      await setDoc(doc(db, "pausedJobs", docId), { ...data, id: docId, pausedAt: serverTimestamp() });
      await deleteDoc(ref);
    } catch (e) {
      console.error("pauseJob error:", e);
    }
  }

  async function deleteJob(collectionName, docId) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
    } catch (e) {
      console.error("deleteJob error:", e);
    }
  }

  // ----------------------- RENDER CARDS -----------------------
  function WorkCard({ job }) {
    const jobId = job.id;
    const title = job.title || "";
    const desc = job.description || "";
    const price = job.price ?? job.budget ?? job.budget_from ?? "";
    const delivery = job.deliveryDuration ?? job.timeline ?? "";
    const createdAt = job.createdAt ? (job.createdAt.seconds ? new Date(job.createdAt.seconds * 1000) : new Date(job.createdAt)) : null;
    const timeText = createdAt ? timeAgo(createdAt) : "";
    const impressions = job.impressions ?? 0;
    const skills = job.skills ?? [];
    const tools = job.tools ?? [];
    const isSaved = savedIds.has(jobId);

    const onClick = async () => {
      await incrementImpression("services", jobId);
      // Replace with your detailed view navigation
      alert(`Open Work Detail: ${title}`);
    };

    return (
      <div style={S.card} key={jobId}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={S.leftCol}>
            <div style={{ width: "100%", height: 84, overflow: "hidden", borderRadius: 8 }}>
              <img src={job.image || "/assets/gallery.png"} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ marginTop: 8, textAlign: "center" }}>
              <div style={{ fontWeight: 800 }}>₹{job.budget_from ?? price}</div>
              <div style={{ fontSize: 13 }}>{delivery || "N/A"}</div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ maxWidth: "70%" }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
                <div style={{ marginTop: 10, color: "#6b7280", fontSize: 13 }}>
                  {impressions} views • {timeText}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div>
                  <button style={S.saveBtn} title="Favorite" onClick={() => toggleFavorite(jobId)}>
                    {isSaved ? "★" : "☆"}
                  </button>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={S.badge}>{delivery || "N/A"}</div>
                </div>
              </div>
            </div>

            <p style={{ marginTop: 12, color: "#111" }}>{desc}</p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <Chips items={[...(skills || []).slice(0, 2), ...(tools || []).slice(0, 1)]} />
              <div>
                <button style={S.btnPrimary} onClick={onClick}>View more</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Service24Card({ job }) {
    const jobId = job.id;
    const title = job.title || "";
    const desc = job.description || "";
    const budget = job.budget ?? 0;
    const timeline = job.timeline || "24 Hours";
    const createdAt = job.createdAt ? (job.createdAt.seconds ? new Date(job.createdAt.seconds * 1000) : new Date(job.createdAt)) : null;
    const timeText = createdAt ? timeAgo(createdAt) : "";
    const views = job.views ?? 0;
    const skills = job.skills ?? [];
    const tools = job.tools ?? [];
    const isSaved = savedIds.has(jobId);

    const onClick = async () => {
      await incrementImpression("service_24h", jobId);
      alert(`Open 24h Detail: ${title}`);
    };

    return (
      <div style={S.card} key={jobId}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={S.leftCol}>
            <div style={{ width: "100%", height: 84, overflow: "hidden", borderRadius: 8 }}>
              <img src={job.image || "/assets/gallery.png"} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 800 }}>₹{formatAmount(budget)}</div>
              <div style={{ fontSize: 13 }}>{timeline}</div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
                <div style={{ marginTop: 10, color: "#6b7280" }}>{views} views • {timeText}</div>
              </div>
              <div>
                <button style={S.saveBtn} title="Save" onClick={() => toggleSaved(jobId)}>{isSaved ? "★" : "☆"}</button>
              </div>
            </div>

            <p style={{ marginTop: 12 }}>{desc}</p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <Chips items={[...(skills || []).slice(0, 2), ...(tools || []).slice(0, 1)]} />
              <div>
                <button style={S.btnPrimary} onClick={onClick}>View more</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------- FILTERS / MERGES -----------------------
  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return services;
    return services.filter(s => (s.title || "").toLowerCase().includes(q) || (s.description || "").toLowerCase().includes(q));
  }, [services, search]);

  const filtered24 = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return services24;
    return services24.filter(s => (s.title || "").toLowerCase().includes(q) || (s.description || "").toLowerCase().includes(q));
  }, [services24, search]);

  // saved merged
  const savedMerged = useMemo(() => {
    const all = [...services.map(s => ({ ...s, _type: "services" })), ...services24.map(s => ({ ...s, _type: "service_24h" }))];
    return all.filter(a => savedIds.has(a.id));
  }, [services, services24, savedIds]);

  // ----------------------- RENDER -----------------------
  return (
    <div style={S.page}>
      <div style={S.headerWrap}>
        <div style={S.header}><div style={S.headerTitle}>Explore jobs</div></div>

        <div style={S.searchBarContainer}>
          <div style={S.searchBar}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" style={{ flex: 1, border: "none", outline: "none", fontSize: 16 }} />
            <button onClick={() => alert("Open search")} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 18 }}>🔍</button>
          </div>
        </div>
      </div>

      <div style={{ height: 28 }} />

      <div style={S.tabsRow}>
        <div onClick={() => setTab("Works")}>
          <div style={S.tabText(tab === "Works")}>Works</div>
          <div style={S.tabUnderline(tab === "Works")}></div>
        </div>

        <div onClick={() => setTab("24 hour")}>
          <div style={S.tabText(tab === "24 hour")}>24 hour</div>
          <div style={S.tabUnderline(tab === "24 hour")}></div>
        </div>

        <div onClick={() => setTab("Saved")}>
          <div style={S.tabText(tab === "Saved")}>Saved</div>
          <div style={S.tabUnderline(tab === "Saved")}></div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => setNotifOpen(true)} style={{ ...S.btnPrimary, padding: "6px 10px" }}>Notifications ({notifications.length})</button>
          <AuthButtons />
        </div>
      </div>

      <div style={{ height: 6, borderTop: "1px solid #eef2f6" }} />

      <div style={S.listWrap}>
        {tab === "Works" && (
          filteredServices.length === 0 ? (
            <EmptyState title="No services found" subtitle="Create a service to attract freelancers" buttonText="Post a Service" onClick={() => alert("Navigate to PostService")} />
          ) : (
            filteredServices.map(s => <WorkCard key={s.id} job={s} />)
          )
        )}

        {tab === "24 hour" && (
          filtered24.length === 0 ? (
            <EmptyState title="No 24 hour services" subtitle="Post a 24h job to get quick responses" buttonText="Post 24h Job" onClick={() => alert("Navigate to Add24Hours")} />
          ) : (
            filtered24.map(s => <Service24Card key={s.id} job={s} />)
          )
        )}

        {tab === "Saved" && (
          savedMerged.length === 0 ? (
            <EmptyState title="No saved jobs yet" subtitle="Tap the bookmark icon to save jobs" buttonText="Explore Jobs" onClick={() => setTab("Works")} />
          ) : (
            savedMerged.map(s => s._type === "services" ? <WorkCard key={s.id} job={s} /> : <Service24Card key={s.id} job={s} />)
          )
        )}
      </div>

      <NotificationModal open={notifOpen} onClose={() => setNotifOpen(false)} notifications={notifications} onClear={async () => {
        if (!auth.currentUser) return;
        // delete notifications server-side
        try {
          const q = query(collection(db, "notifications"), where("userId", "==", auth.currentUser.uid));
          const snaps = await getDocs(q);
          const deletes = snaps.docs.map(d => deleteDoc(doc(db, "notifications", d.id)));
          await Promise.all(deletes);
          setNotifOpen(false);
        } catch (e) { console.error("clear notifications error", e); }
      }} />
    </div>
  );
}

// ----------------------- Auth buttons (small) -----------------------
function AuthButtons() {
  const [userState, setUserState] = useState(auth.currentUser);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUserState(u));
    return () => unsub();
  }, []);

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("google sign in", e);
      alert("Google sign-in failed");
    }
  };

  const githubSignIn = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("github sign in", e);
      alert("GitHub sign-in failed");
    }
  };

  const doSignOut = async () => {
    await signOut(auth);
  };

  if (!userState) {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={googleSignIn} style={{ padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>Google</button>
        <button onClick={githubSignIn} style={{ padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>GitHub</button>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ fontSize: 13 }}>{userState.email}</div>
      <button onClick={doSignOut} style={{ padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>Sign out</button>
    </div>
  );
}

// ----------------------- Notification Modal -----------------------
function NotificationModal({ open, onClose, notifications = [], onClear }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", left: 0, right: 0, top: 0, bottom: 0,
      background: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000
    }}>
      <div style={{ width: "92%", maxWidth: 820, background: "#fff", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, background: "#FDFD96" }}>
          <div style={{ fontWeight: 800 }}>Notifications</div>
          <div style={{ marginLeft: "auto" }}>
            <button onClick={onClear} style={{ marginRight: 10 }}>Clear All</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>

        <div style={{ maxHeight: 420, overflow: "auto", padding: 12 }}>
          {notifications.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>No notifications yet</div>
          ) : notifications.map((n) => (
            <div key={n.id} style={{ padding: 12, borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ fontWeight: 700 }}>{n.title}</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>{n.body}</div>
              <div style={{ color: "#9ca3af", marginTop: 6, fontSize: 12 }}>{timeAgo(n.timestamp?.toDate ? n.timestamp.toDate() : n.timestamp)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}