import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firbase/Firebase"; // adjust path if needed
import {
  onAuthStateChanged,
  signOut,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  orderBy,
  limit,
  addDoc,
  FieldValue,
} from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


const initialState = {
  user: null,
  profile: {
    name: "",
    profileImageUrl: null,
    profileCompleted: false,
    serviceCreated: false,
  },
  jobs: [],
  popularSkills: [],
  notifications: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case "SET_JOBS":
      return { ...state, jobs: action.payload };
    case "UPDATE_JOB": {
      const updated = state.jobs.map((j) => (j.id === action.payload.id ? action.payload : j));
      return { ...state, jobs: updated };
    }
    case "SET_POPULAR_SKILLS":
      return { ...state, popularSkills: action.payload };
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };
    case "PUSH_NOTIFICATION":
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

/* -------------------- Helper utilities -------------------- */
function formatAmount(amount) {
  if (amount == null) return "0";
  const num = Number(amount);
  if (isNaN(num)) return amount;
  if (num < 1000) return num.toFixed(0);
  if (num < 1000000) {
    const v = num / 1000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  const v = num / 1000000;
  return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

/* -------------------- Provider -------------------- */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        dispatch({ type: "SET_USER", payload: user });
        // Load profile from Firestore
        try {
          const docRef = doc(db, "users", user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            dispatch({
              type: "SET_PROFILE",
              payload: {
                name: (data.first_name || data.displayName || "").trim(),
                profileImageUrl: data.profileImage || data.profile_url || null,
                profileCompleted: !!data.profileCompleted,
                serviceCreated: !!data.serviceCreated,
              },
            });
          }
        } catch (e) {
          console.error("load profile error", e);
        }
      } else {
        dispatch({ type: "SET_USER", payload: null });
        dispatch({ type: "SET_PROFILE", payload: initialState.profile });
      }
    });

    return () => unsub();
  }, []);

  // Real-time listeners for jobs
  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    const jobsCol = collection(db, "jobs");
    const q = query(jobsCol, orderBy("created_at", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || "",
            description: data.description || "",
            budget_from: data.budget_from || 0,
            budget_to: data.budget_to || 0,
            timeline: data.timeline || "",
            skills: Array.isArray(data.skills) ? data.skills : [],
            tools: Array.isArray(data.tools) ? data.tools : [],
            views: data.views || 0,
            applicants_count: data.applicants_count || 0,
            created_at: data.created_at ? data.created_at.toDate?.() || data.created_at : Date.now(),
          };
        });
        dispatch({ type: "SET_JOBS", payload: list });
        dispatch({ type: "SET_LOADING", payload: false });
      },
      (err) => {
        console.error("jobs snapshot error", err);
        dispatch({ type: "SET_ERROR", payload: err.message });
        dispatch({ type: "SET_LOADING", payload: false });
      }
    );

    return () => unsub();
  }, []);

  // Fetch popular skills (one-time)
  useEffect(() => {
    async function fetchSkills() {
      try {
        const snap = await getDocs(collection(db, "services"));
        const skillCount = {};
        snap.docs.forEach((d) => {
          const data = d.data();
          const skills = Array.isArray(data.skills) ? data.skills : [];
          skills.forEach((s) => (skillCount[s] = (skillCount[s] || 0) + 1));
        });
        const sorted = Object.entries(skillCount)
          .sort((a, b) => b[1] - a[1])
          .map((e) => e[0])
          .slice(0, 20);
        dispatch({ type: "SET_POPULAR_SKILLS", payload: sorted });
      } catch (e) {
        console.error("popular skills", e);
      }
    }
    fetchSkills();
  }, []);

  // FCM (web) token and foreground messages
  useEffect(() => {
    async function initMessaging() {
      try {
        const messaging = getMessaging();
        const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY || null;
        if (!vapidKey) return console.warn("VAPID key missing for FCM web");

        const currentToken = await getToken(messaging, { vapidKey });
        if (currentToken && state.user) {
          // Save token to user doc
          await updateDoc(doc(db, "users", state.user.uid), { fcmToken: currentToken }).catch(() => {});
        }

        onMessage(messaging, (payload) => {
          console.log("onMessage payload", payload);
          const notif = {
            id: payload.data?.id || Date.now(),
            title: payload.notification?.title || payload.data?.title || "Notification",
            body: payload.notification?.body || payload.data?.body || "",
            raw: payload,
          };
          dispatch({ type: "PUSH_NOTIFICATION", payload: notif });
        });
      } catch (e) {
        console.warn("FCM init failed", e);
      }
    }

    initMessaging();
  }, [state.user]);

  const value = { state, dispatch };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* -------------------- HomeScreen Component -------------------- */
export default function HomeScreen() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  // Local UI state
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const profile = state.profile;

  useEffect(() => {
    // nothing extra for now
  }, []);

  const openJob = (jobId) => {
    navigate(`/job/${jobId}`); // assumes you have a route
  };

  const toggleBookmark = async (jobId, isSaved) => {
    const user = state.user;
    if (!user) return navigate("/login");
    const userRef = doc(db, "users", user.uid);
    try {
      if (isSaved) {
        await updateDoc(userRef, { favoriteJobs: arrayRemove(jobId) });
      } else {
        await updateDoc(userRef, { favoriteJobs: arrayUnion(jobId) });
      }
    } catch (e) {
      console.error("toggleBookmark error", e);
    }
  };

  const incrementView = async (jobId) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      await updateDoc(jobRef, { views: FieldValue.increment(1) });
    } catch (e) {
      console.error("increment view", e);
    }
  };

  // Derived data
  const jobs = state.jobs;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={styles.avatarWrap}>
              {profile.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="avatar" style={styles.avatar} />
              ) : (
                <div style={styles.avatarPlaceholder}>{profile.name ? profile.name.charAt(0) : "U"}</div>
              )}
            </div>
            <div>
              <div style={styles.welcome}>Welcome,</div>
              <div style={styles.username}>{profile.name || ""}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={styles.iconBtn} onClick={() => setNotifOpen(true)}>
              <img src="/assets/notification icon.png" alt="notif" style={{ width: 28, height: 28 }} />
              {state.notifications.length > 0 && <span style={styles.badge}>{state.notifications.length > 9 ? "9+" : state.notifications.length}</span>}
            </button>

            <button
              style={styles.iconBtn}
              onClick={async () => {
                await signOut(getAuth());
                navigate("/login");
              }}
            >
              Sign out
            </button>
          </div>
        </div>

        <div style={styles.searchWrap}>
          <input
            style={styles.searchInput}
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => navigate("/search")}
          />
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Popular Skills</h3>
          <div style={styles.skillRow}>
            {state.popularSkills.map((s) => (
              <button key={s} style={styles.skillChip} onClick={() => navigate(`/skills/${encodeURIComponent(s)}`)}>
                {s}
              </button>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.actionRow}>
            <ActionCard
              title={`Explore\nJobs`}
              onClick={() => navigate("/explore")}
              icon={"/assets/explore jobs.png"}
            />
            <ActionCard
              title={`Create\nService`}
              onClick={() => navigate("/create-service")}
              icon={"/assets/+ icon.png"}
            />
          </div>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Top Recommendation for You</h3>
          <div>
            {state.loading && <div style={{ padding: 12 }}>Loading jobs...</div>}
            {!state.loading && jobs.length === 0 && <div style={{ padding: 12 }}>No jobs available</div>}

            <div style={styles.jobList}>
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onOpen={() => {
                    incrementView(job.id);
                    openJob(job.id);
                  }}
                  onToggleFav={async (isSaved) => await toggleBookmark(job.id, isSaved)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {notifOpen && <NotificationDrawer onClose={() => setNotifOpen(false)} notifications={state.notifications} />}
    </div>
  );
}

/* -------------------- Subcomponents -------------------- */

function ActionCard({ title, icon, onClick }) {
  return (
    <div style={styles.actionCard} onClick={onClick} role="button">
      <img src={icon} alt="icon" style={{ width: 56, height: 56, objectFit: "contain" }} />
      <div style={{ height: 8 }} />
      <div style={{ whiteSpace: "pre-line", textAlign: "center", fontWeight: 600 }}>{title}</div>
    </div>
  );
}

function JobCard({ job, onOpen, onToggleFav }) {
  const [isSaved, setIsSaved] = useState(false);
  const [userFavs, setUserFavs] = useState([]);

  useEffect(() => {
    // subscribe to user's favoriteJobs doc
    const unsub = onSnapshot(doc(db, "users", (auth.currentUser && auth.currentUser.uid) || "-"), (snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      const favs = Array.isArray(d?.favoriteJobs) ? d.favoriteJobs : [];
      setUserFavs(favs);
      setIsSaved(favs.includes(job.id));
    });
    return () => unsub();
  }, [job.id]);

  return (
    <div style={styles.jobCard} onClick={onOpen}>
      <div style={styles.jobCardHeader}>
        <div style={{ flex: 1 }}>
          <div style={styles.jobTitle}>{job.title}</div>
          <div style={styles.jobMetaRow}>
            <div style={styles.metaItem}>{job.views} views</div>
            <div style={styles.metaItem}>{timeAgo(job.created_at)}</div>
          </div>
        </div>

        <div style={{ marginLeft: 12, display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div style={styles.budgetBox}>
            <div style={styles.budgetTop}>₹{formatAmount(job.budget_from)} - ₹{formatAmount(job.budget_to)}</div>
            <div style={styles.budgetBottom}>{job.timeline}</div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(isSaved);
            }}
            style={{ ...styles.iconBtn, alignSelf: "flex-start" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isSaved ? "#9560ff" : "none"} stroke={isSaved ? "#9560ff" : "#666"} strokeWidth="1.5">
              <path d="M6 2h12v20l-6-4-6 4V2z" />
            </svg>
          </button>
        </div>
      </div>

      <div style={styles.description}>{job.description}</div>

      <div style={styles.tagRow}>
        {[...job.skills.slice(0, 2), ...job.tools.slice(0, 1)].slice(0, 2).map((t) => (
          <div key={t} style={styles.tag}>{t}</div>
        ))}

        {job.skills.length + job.tools.length - 2 > 0 && (
          <div style={{ ...styles.tag, background: "#d1d1d1" }}>+{job.skills.length + job.tools.length - 2}</div>
        )}
      </div>
    </div>
  );
}

function NotificationDrawer({ onClose, notifications }) {
  return (
    <div style={styles.drawerBackdrop} onClick={onClose}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.drawerHeader}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Notifications</div>
          <button style={styles.iconBtn} onClick={onClose}>Close</button>
        </div>

        <div style={{ padding: 12, overflow: "auto" }}>
          {notifications.length === 0 && <div style={{ color: "#666" }}>No notifications yet</div>}
          {notifications.map((n) => (
            <div key={n.id} style={styles.notificationItem}>
              <div style={{ fontWeight: 600 }}>{n.title}</div>
              <div style={{ color: "#555", marginTop: 6 }}>{n.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Basic styles (React-ish, modern) -------------------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #fff 0%, #fffaf0 100%)",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    color: "#111827",
  },
  header: {
    background: "#fff59d",
    padding: "20px 24px",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    position: "relative",
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 999,
    overflow: "hidden",
    background: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { width: "100%", height: "100%", objectFit: "cover" },
  avatarPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  welcome: { fontSize: 14, color: "#111" },
  username: { fontSize: 20, fontWeight: 700 },
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", position: "relative" },
  badge: { position: "absolute", right: -6, top: -6, background: "#ef4444", color: "white", borderRadius: 999, padding: "2px 6px", fontSize: 11 },
  searchWrap: { marginTop: 16, display: "flex", justifyContent: "center" },
  searchInput: { width: "88%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e5e7eb" },
  main: { padding: 20, maxWidth: 1100, margin: "0 auto" },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 12 },
  skillRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  skillChip: { padding: "8px 12px", borderRadius: 999, border: "1px solid #eee", background: "white", cursor: "pointer" },
  actionRow: { display: "flex", gap: 16, justifyContent: "space-between" },
  actionCard: { flex: 1, background: "#fff", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
  jobList: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 12 },
  jobCard: { background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 },
  jobCardHeader: { display: "flex", alignItems: "flex-start", gap: 12 },
  jobTitle: { fontSize: 16, fontWeight: 700 },
  jobMetaRow: { display: "flex", gap: 12, marginTop: 8, color: "#666", fontSize: 13 },
  metaItem: { display: "inline-block" },
  budgetBox: { minWidth: 120, borderRadius: 10, border: "1px solid #eee", overflow: "hidden", textAlign: "center" },
  budgetTop: { padding: 8, fontWeight: 700 },
  budgetBottom: { background: "#fff59d", padding: 6, fontWeight: 700 },
  description: { color: "#444", fontSize: 14, maxHeight: 88, overflow: "hidden", textOverflow: "ellipsis" },
  tagRow: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  tag: { padding: "6px 10px", background: "#f3f4f6", borderRadius: 12, fontSize: 13 },
  drawerBackdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", justifyContent: "flex-end", zIndex: 60 },
  drawer: { width: 420, maxWidth: "100%", background: "#fff", height: "100%", padding: 12, boxShadow: "-10px 0 30px rgba(0,0,0,0.12)" },
  drawerHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid #eee" },
  notificationItem: { borderRadius: 12, background: "#fafafa", padding: 12, marginBottom: 12 },
};