import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firbase/Firebase"; // adjust path
import { useNavigate, useParams } from "react-router-dom";

// ---------------------- Helpers ----------------------
function timeAgo(date) {
  if (!date) return "";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function safeListExtraction(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data.map((x) => String(x));
  return [];
}

function insertCssOnce() {
  if (document.getElementById("ffds-style")) return;
  const style = document.createElement("style");
  style.id = "ffds-style";
  style.innerHTML = `
    .ffds-page { background:#f5f5f5; min-height:100vh; font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial; }
    .ffds-max { max-width:1100px; margin:0 auto; }
    .ffds-header-wrap { position:relative; padding-bottom:80px; }
    .ffds-cover { height:220px; border-radius:0 0 30px 30px; overflow:hidden; background:linear-gradient(135deg,#FDFD96,#FDFD96); position:relative; }
    .ffds-cover-img { width:100%; height:100%; object-fit:cover; }
    .ffds-header-card { position:absolute; left:50%; bottom:-60px; transform:translateX(-50%); background:#fff; border-radius:20px; box-shadow:0 10px 25px rgba(0,0,0,0.15); padding:70px 20px 20px 20px; width:calc(100% - 56px); max-width:500px; text-align:center; }
    .ffds-avatar-wrap { position:absolute; left:50%; top:130px; transform:translateX(-50%); border-radius:50%; border:4px solid #fff; box-shadow:0 8px 20px rgba(0,0,0,0.2); overflow:hidden; width:100px; height:100px; background:#eee; display:flex; align-items:center; justify-content:center; font-size:40px; color:#888; }
    .ffds-name { font-size:20px; font-weight:600; color:#1b1b1b; }
    .ffds-location { font-size:12px; color:#777; display:flex; align-items:center; justify-content:center; gap:4px; margin-top:4px; }
    .ffds-action-row { margin-top:18px; display:flex; justify-content:center; gap:12px; flex-wrap:wrap; }
    .ffds-btn { border-radius:10px; border:none; padding:8px 18px; font-size:14px; font-weight:500; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px; }
    .ffds-btn-primary { background:#FFF7C2; color:#000; }
    .ffds-btn-disabled { background:#ccc; color:#fff; cursor:not-allowed; }
    .ffds-btn-outline { background:#fff; border:1px solid #ddd; color:#222; }
    .ffds-main { margin-top:90px; padding:0 20px 32px 20px; }
    .ffds-card { background:#fff; border-radius:20px; border:1px solid #e0e0e0; padding:20px; margin-bottom:24px; }
    .ffds-card-title { font-size:18px; font-weight:700; margin-bottom:10px; color:#1b1b1b; }
    .ffds-body-text { font-size:14px; line-height:1.6; color:#333; white-space:pre-line; }
    .ffds-skill-chip { display:inline-flex; padding:8px 14px; border-radius:12px; background:#FFF7C2; font-size:13px; font-weight:500; color:#111; margin:0 8px 8px 0; }
    .ffds-section-title { font-size:22px; font-weight:600; margin-bottom:12px; color:#111; }
    .ffds-portfolio-card { background:#fff; border-radius:16px; border:1px solid #e0e0e0; padding:14px; display:flex; gap:16px; margin-bottom:16px; }
    .ffds-portfolio-img { width:120px; height:160px; border-radius:8px; object-fit:cover; background:#eee; flex-shrink:0; }
    .ffds-portfolio-title { font-size:16px; font-weight:600; color:#111; margin-bottom:4px; }
    .ffds-portfolio-desc { font-size:14px; color:#555; margin-bottom:10px; }
    .ffds-chip-grey { display:inline-flex; padding:4px 8px; border-radius:12px; background:#eee; font-size:11px; margin:0 6px 6px 0; color:#555; }
    .ffds-empty-center { padding:40px 20px; text-align:center; color:#777; font-size:14px; }
    .ffds-tabs { display:flex; gap:24px; border-bottom:1px solid #e0e0e0; margin-bottom:12px; }
    .ffds-tab { padding-bottom:8px; cursor:pointer; font-size:16px; font-weight:400; color:#555; border-bottom:3px solid transparent; }
    .ffds-tab-active { color:#000; font-weight:700; border-color:#FFD600; }
    .ffds-service-card { display:flex; height:190px; border-radius:16px; background:#FFFFD8; margin:0 0 12px 0; overflow:hidden; }
    .ffds-service-col-left { width:30%; background:#FDFD96; padding:12px; display:flex; flex-direction:column; align-items:center; }
    .ffds-service-img { width:100%; height:90px; border-radius:12px; object-fit:cover; background:#eee; }
    .ffds-price { margin-top:12px; font-weight:600; font-size:15px; }
    .ffds-duration { font-size:13px; font-weight:500; }
    .ffds-service-col-right { flex:1; padding:12px; display:flex; flex-direction:column; }
    .ffds-service-title-row { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
    .ffds-service-title { font-size:16px; font-weight:600; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .ffds-service-desc { font-size:14px; color:#333; font-weight:500; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .ffds-chip-row-scroll { overflow-x:auto; padding-bottom:4px; }
    .ffds-chip-row-scroll::-webkit-scrollbar { height:4px; }
    .ffds-chip-row-scroll::-webkit-scrollbar-thumb { background:#ddd; border-radius:2px; }
    .ffds-chip { display:inline-flex; align-items:center; padding:4px 10px; border-radius:20px; background:#fff; border:1px solid #ddd; font-size:11px; margin-right:6px; white-space:nowrap; }
    .ffds-service-footer { margin-top:auto; display:flex; justify-content:flex-end; }
    .ffds-ghost-btn { border:none; background:#FDFD96; padding:6px 16px; border-radius:20px; font-size:11px; font-weight:bold; cursor:pointer; }
    .ffds-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:999; }
    .ffds-modal { width:90%; max-width:520px; max-height:80vh; background:linear-gradient(to bottom,#FFFDE1,#FFF5B2); border-radius:24px; box-shadow:0 10px 30px rgba(0,0,0,0.25); padding:20px; display:flex; flex-direction:column; gap:14px; }
    .ffds-input,.ffds-textarea,.ffds-select { width:100%; border-radius:14px; border:none; padding:10px 14px; font-size:14px; background:#fff; outline:none; box-sizing:border-box; }
    .ffds-textarea { min-height:120px; resize:vertical; }
    .ffds-modal-footer { display:flex; justify-content:center; gap:14px; margin-top:10px; }
    /* Buttons */
.ffds-btn {
  border-radius: 10px;
  border: none;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease-in-out;
}

/* Primary Connect button */
.ffds-btn-primary {
  background: #FFF7C2;
  color: #000;
}

.ffds-btn-primary:hover {
  background: #FFE066;
}

/* Requested / Disabled state */
.ffds-btn-disabled {
  background: #ccc;
  color: #fff;
  cursor: not-allowed;
}

/* Outline button (LinkedIn / Share) */
.ffds-btn-outline {
  background: #fff;
  border: 1px solid #ddd;
  color: #222;
}
.ffds-btn-outline:hover {
  background: #f5f5f5;
}

    @media (max-width:768px){.ffds-service-card{height:auto;flex-direction:row;}}
  `;
  document.head.appendChild(style);
}

// ---------------------- Main Component ----------------------
export default function FreelancerFullDetailScreen(props) {
  insertCssOnce();

  const navigate = useNavigate();
  const params = useParams();

  const uid = useMemo(() => props.userId ?? params.userId ?? auth.currentUser?.uid ?? null, [props.userId, params.userId]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [services24h, setServices24h] = useState([]);
  const [isConnectOpen, setConnectOpen] = useState(false);
  const [jobsForPopup, setJobsForPopup] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [popupLoading, setPopupLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("work");
  const [isRequested, setIsRequested] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const showToast = useCallback((msg, color = "#333") => console.log(msg), []);

  // ----------------------- Fetch Profile -----------------------
  useEffect(() => {
    if (!uid) { setProfileError("No user logged in"); setLoading(false); return; }

    const unsubList = [];
    const userRef = doc(db, "users", uid);
    unsubList.push(
      onSnapshot(userRef, snap => {
        if (!snap.exists()) { setProfileError("User profile not found"); setProfileData(null); }
        else setProfileData({ id: snap.id, ...snap.data() });
        setLoading(false);
      })
    );

    const portRef = collection(db, "users", uid, "portfolio");
    unsubList.push(onSnapshot(portRef, snap => setPortfolio(snap.docs.map(d => ({ id: d.id, ...d.data() })))));

    const svcRef = collection(db, "users", uid, "services");
    unsubList.push(onSnapshot(query(svcRef, orderBy("createdAt", "desc")), snap => setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })))));

    const svc24Ref = collection(db, "users", uid, "services_24h");
    unsubList.push(onSnapshot(query(svc24Ref, orderBy("createdAt", "desc")), snap => setServices24h(snap.docs.map(d => ({ id: d.id, ...d.data() })))));

    return () => unsubList.forEach(fn => fn && fn());
  }, [uid]);

  // ----------------------- Connect Flow -----------------------
  const fetchUserJobs = useCallback(async () => {
    if (!auth.currentUser?.uid) return [];
    const allJobs = [];
    const jobsSnap = await getDocs(query(collection(db, "jobs"), where("userId", "==", auth.currentUser.uid)));
    jobsSnap.forEach(d => allJobs.push({ ...d.data(), id: d.id, type: "services" }));
    const jobs24Snap = await getDocs(query(collection(db, "jobs_24h"), where("userId", "==", auth.currentUser.uid)));
    jobs24Snap.forEach(d => allJobs.push({ ...d.data(), id: d.id, type: "services_24h" }));
    return allJobs;
  }, []);

  const openConnectPopup = useCallback(async () => {
    setPopupLoading(true);
    const list = await fetchUserJobs();
    setJobsForPopup(list);
    setPopupLoading(false);
    setConnectOpen(true);
  }, [fetchUserJobs]);

  const closeConnectPopup = useCallback(() => {
    setConnectOpen(false);
    setSelectedJob(null);
    setProjectTitle("");
    setProjectDesc("");
  }, []);

  const continueAfterSuccess = useCallback(async (receiverName, receiverImage, otherUid) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;

    // Set requested immediately
    setIsRequested(true);
    setPopupLoading(true);

    const data = {
      clientId: currentUid,
      freelancerId: otherUid,
      title: projectTitle.trim(),
      description: projectDesc.trim(),
      status: "sent",
      timestamp: serverTimestamp()
    };
    if (selectedJob?.id && selectedJob?.type) {
      data.jobId = selectedJob.id;
      data.jobType = selectedJob.type;
    }

    try {
      await addDoc(collection(db, "collaboration_requests"), data);
      closeConnectPopup();

      let initialMessage;
      if (selectedJob?.id && selectedJob?.type) {
        const colName = selectedJob.type === "services_24h" ? "jobs_24h" : "jobs";
        const jobDoc = await getDoc(doc(db, colName, selectedJob.id));
        if (jobDoc.exists()) {
          const jd = jobDoc.data() || {};
          const jobTitle = jd.title || "Untitled";
          const jobDesc = jd.description || "No description";
          const category = jd.category || "General";
          const skills = (jd.skills || []).join(", ");
          initialMessage = `📢 Jobs shared: { id:${selectedJob.id}, title:${jobTitle}, category:${category}, description:${jobDesc}, skills:[${skills}] }`;
        } else {
          initialMessage = `Collaboration request: ${projectTitle.trim()}\nDescription: ${projectDesc.trim()}`;
        }
      } else {
        initialMessage = `Collaboration request: ${projectTitle.trim()}\nDescription: ${projectDesc.trim()}`;
      }

      navigate("/chat", { state: { currentUid, otherUid, otherName: receiverName, otherImage: receiverImage, initialMessage } });
    } catch (err) {
      console.error(err);
      showToast("Failed to send request", "red");
      setIsRequested(false);
    } finally {
      setPopupLoading(false);
    }
  }, [navigate, projectTitle, projectDesc, selectedJob, closeConnectPopup, showToast]);

  // ----------------------- Render -----------------------
  if (!uid) return <div className="ffds-page"><div className="ffds-max" style={{ padding: "40px 20px" }}><div style={{ textAlign: "center", color: "#777" }}>No user logged in.</div></div></div>;
  if (loading || !profileData) return <div className="ffds-page"><div className="ffds-max" style={{ paddingTop: 120, textAlign: "center" }}>Loading profile...</div></div>;

  const { profileImage = "", coverImage = "", professional_title = "No Title", about = "No About Info", skills: rawSkills, tools: rawTools, first_name = "", last_name = "", location = "Location not set", linkedin = "" } = profileData;
  const fullName = `${first_name} ${last_name}`.trim() || "User";
  const skills = safeListExtraction(rawSkills);
  const tools = safeListExtraction(rawTools);

  return (
    <div className="ffds-page">
      <div className="ffds-max">
        {/* HEADER */}
        <div className="ffds-header-wrap">
          <div className="ffds-cover">{coverImage && <img src={coverImage} className="ffds-cover-img" />}</div>
          <div className="ffds-avatar-wrap">{profileImage ? <img src={profileImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>👤</span>}</div>
          <div className="ffds-header-card">
            <div className="ffds-name">{fullName}</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#444" }}>{professional_title}</div>
            <div className="ffds-location">📍 {location}</div>
            <div className="ffds-action-row">
              {isAccepted ? (
                <button className="ffds-btn ffds-btn-primary" onClick={() => navigate("/chat", { state: { currentUid: auth.currentUser?.uid, otherUid: uid, otherName: fullName, otherImage: profileImage } })}>
                  💬 Message
                </button>
              ) : isRequested ? (
                <button className="ffds-btn ffds-btn-disabled">Requested</button>
              ) : (
                <button className="ffds-btn ffds-btn-primary" onClick={openConnectPopup}>
                  🔗 Connect
                </button>
              )}

              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ffds-btn ffds-btn-outline"
                  style={{ textDecoration: "none" }}
                >
                  🔗 LinkedIn
                </a>
              )}

              <button
                className="ffds-btn ffds-btn-outline"
                onClick={() => {
                  const shareData = {
                    title: fullName,
                    text: `Check out ${fullName}'s profile`,
                    url: window.location.href,
                  };
                  if (navigator.share) {
                    navigator.share(shareData).catch((err) => console.log(err));
                  } else {
                    navigator.clipboard.writeText(shareData.url);
                    alert("Profile URL copied to clipboard!");
                  }
                }}
              >
                📤 Share
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="ffds-main">
          <div className="ffds-card">
            <div className="ffds-card-title">About</div>
            <div className="ffds-body-text">{about}</div>
          </div>

          {skills.length > 0 && <div className="ffds-card">
            <div className="ffds-card-title">Skills</div>
            {skills.map((s, i) => <span key={i} className="ffds-skill-chip">{s}</span>)}
          </div>}

          {tools.length > 0 && <div className="ffds-card">
            <div className="ffds-card-title">Tools</div>
            {tools.map((t, i) => <span key={i} className="ffds-skill-chip">{t}</span>)}
          </div>}

          <div className="ffds-card">
            <div className="ffds-card-title">Portfolio</div>
            {portfolio.length === 0 && <div className="ffds-empty-center">No portfolio items yet</div>}
            {portfolio.map(p =>
              <div key={p.id} className="ffds-portfolio-card">
                {p.image ? <img src={p.image} className="ffds-portfolio-img" /> : <div className="ffds-portfolio-img" />}
                <div style={{ flex: 1 }}>
                  <div className="ffds-portfolio-title">{p.title || "Untitled"}</div>
                  <div className="ffds-portfolio-desc">{p.description || ""}</div>
                  {(p.tags || []).map((tg, i) => <span key={i} className="ffds-chip-grey">{tg}</span>)}
                </div>
              </div>
            )}
          </div>

          <div className="ffds-card">
            <div className="ffds-tabs">
              <div className={`ffds-tab ${activeTab === "work" ? "ffds-tab-active" : ""}`} onClick={() => setActiveTab("work")}>Work</div>
              <div className={`ffds-tab ${activeTab === "24h" ? "ffds-tab-active" : ""}`} onClick={() => setActiveTab("24h")}>24h</div>
            </div>
            {(activeTab === "work" ? services : services24h).map(s =>
              <div key={s.id} className="ffds-service-card">
                <div className="ffds-service-col-left">
                  {s.image ? <img src={s.image} className="ffds-service-img" /> : <div className="ffds-service-img" />}
                  <div className="ffds-price">₹{s.price}</div>
                  <div className="ffds-duration">{s.deliveryDays} days</div>
                </div>
                <div className="ffds-service-col-right">
                  <div className="ffds-service-title-row">
                    <div className="ffds-service-title">{s.title}</div>
                  </div>
                  <div className="ffds-service-desc">{s.description}</div>
                  <div className="ffds-chip-row-scroll">{(s.skills || []).map((sk, i) => <span key={i} className="ffds-chip">{sk}</span>)}</div>
                </div>
              </div>
            )}
            {(activeTab === "work" ? services : services24h).length === 0 && <div className="ffds-empty-center">No services yet</div>}
          </div>
        </div>
      </div>

      {/* CONNECT POPUP */}
      {isConnectOpen && <div className="ffds-modal-backdrop" onClick={closeConnectPopup}>
        <div className="ffds-modal" onClick={e => e.stopPropagation()}>
          <div className="ffds-card-title">Connect with {fullName}</div>

          <select className="ffds-select" value={selectedJob?.id || ""} onChange={e => { const j = jobsForPopup.find(j => j.id === e.target.value); setSelectedJob(j || null); }}>
            <option value="">-- Select your job/project (optional) --</option>
            {jobsForPopup.map(j => <option key={j.id} value={j.id}>{j.title || "Untitled"}</option>)}
          </select>

          <input className="ffds-input" placeholder="Project title (optional)" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} />
          <textarea className="ffds-textarea" placeholder="Project description (optional)" value={projectDesc} onChange={e => setProjectDesc(e.target.value)} />

          <div className="ffds-modal-footer">
            <button className="ffds-btn ffds-btn-outline" onClick={closeConnectPopup}>Cancel</button>
            <button className="ffds-btn ffds-btn-primary" onClick={() => continueAfterSuccess(fullName, profileImage, uid)} disabled={popupLoading}>Send Request</button>
          </div>
        </div>
      </div>}
    </div>
  );
}