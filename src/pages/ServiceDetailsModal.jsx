// //ServiceDetailsModal.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db, auth } from "../firbase/Firebase";
// import { FiShare2, FiX } from "react-icons/fi";
// import { Bookmark } from "lucide-react";
// import { BsBookmarkFill } from "react-icons/bs";
// import share from "../assets/share.png";
// import ConnectPopup from "../Firebasejobs/Connectpop/Connectpop";

// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   getDocs,
//   arrayUnion,
//   arrayRemove,
//   doc,
//   getDoc,
//   updateDoc,
// } from "firebase/firestore";

// import "./serviceDetailsModel.css";

// const css = `
// *{font-family:'Inter', sans-serif;}
// .page-wrap{max-width:900px;margin:30px auto;background:#fff;border-radius:18px;box-shadow:0 8px 26px rgba(0,0,0,0.08);}
// .top-header{padding:20px 24px;display:flex;justify-content:space-between;align-items:center;}
// .top-left-title{font-size:22px;font-weight:700;}
// .top-icons{display:flex;gap:16px;font-size:20px;}
// .top-icons svg:hover{transform:scale(1.1);transition:0.2s ease;}
// .profile-box{padding:20px 24px;display:flex;gap:18px;}
// .profile-circle{width:58px;height:58px;border-radius:16px;background:linear-gradient(135deg,#7A4DFF,#B28DFF);display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;font-weight:600;}
// .profile-info .name{font-size:32px;font-weight:600;}
// .profile-info .role{font-size:18px;color:#7C3CFF;}
// .money-box{padding:20px 24px;display:flex;justify-content:space-between;}
// .range{font-size:22px;font-weight:700;}
// .view-btn{
//   background:#7A4DFF;
//   color:#fff;
//   border:none;
//   padding:12px 28px;
//   border-radius:12px;
//   cursor:pointer;
// }
// .view-btn:hover{
//   transform:translateY(-2px);
//   box-shadow:0 6px 16px rgba(122,77,255,0.3);
// }
// .skill-title,.desc-title{padding:10px 24px;font-size:20px;font-weight:700;}
// .skills-box{padding:8px 24px;display:flex;flex-wrap:wrap;gap:10px;}
// .skill-chip{
//   background:#FFF5CC;
//   border:1px solid #FFD84D;
//   padding:8px 14px;
//   border-radius:10px;
//   font-weight:500;
// }
// .desc-text{padding:10px 24px 20px;color:#444;line-height:1.6;}
// .footer-actions{padding:18px 24px;border-top:1px solid #eee;display:flex;gap:14px;}
// .cancel-btn,.connect-btn{flex:1;padding:14px;border-radius:12px;font-size:16px;font-weight:700;}
// .cancel-btn{border:2px solid #A58BFF;background:#fff;color:#7A4DFF;}
// .connect-btn{
//   border:none;
//   background:linear-gradient(135deg,#7A4DFF,#A258FF);
//   color:#fff;
//   transition:0.2s ease;
// }
// .connect-btn:hover{
//   transform:translateY(-2px);
//   box-shadow:0 6px 16px rgba(122,77,255,0.3);
// }
//   .top-iconss {
//   display: flex;
//   align-items: center;
//   gap: 18px;
// }

// .icon-btn {
//   width: 34px;
//   height: 34px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   border-radius: 8px;
//   transition: 0.2s ease;
// }



// .icon-btn img {
//   width: 18px;
//   height: 18px;
//   object-fit: contain;
// }
// `;

// export default function ServicePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [job, setJob] = useState(null);
//   const [clientServices, setClientServices] = useState([]);
//   const [connectOpen, setConnectOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [isSaved, setIsSaved] = useState(false);

//   // Inject CSS
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = css;
//     document.head.appendChild(style);
//     return () => style.remove();
//   }, []);

//   // Load Job
//   useEffect(() => {
//     if (!id) return;
//     const loadJob = async () => {
//       const snap = await getDoc(doc(db, "services", id));
//       if (snap.exists()) setJob({ ...snap.data(), _id: snap.id });
//     };
//     loadJob();
//   }, [id]);

//   // Load Saved Status
//   useEffect(() => {
//     if (!auth.currentUser || !id) return;
//     const loadSaved = async () => {
//       const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
//       const data = snap.data();
//       setIsSaved(data?.savedJobs?.includes(id) || false);
//     };
//     loadSaved();
//   }, [id]);

//   const handleToggleSave = async () => {
//     if (!auth.currentUser) return;
//     const userRef = doc(db, "users", auth.currentUser.uid);

//     if (isSaved) {
//       await updateDoc(userRef, { savedJobs: arrayRemove(id) });
//       setIsSaved(false);
//     } else {
//       await updateDoc(userRef, { savedJobs: arrayUnion(id) });
//       setIsSaved(true);
//     }
//   };

//   // Notifications
//   useEffect(() => {
//     if (!auth.currentUser) return;
//     const uid = auth.currentUser.uid;

//     const q1 = query(
//       collection(db, "notifications"),
//       where("clientUid", "==", uid),
//       orderBy("timestamp", "desc")
//     );

//     const unsubscribe = onSnapshot(q1, (snap) => {
//       setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     return () => unsubscribe();
//   }, []);

//   // Client Services
//   useEffect(() => {
//     if (!auth.currentUser) return;
//     getDocs(
//       query(collection(db, "services"), where("userId", "==", auth.currentUser.uid))
//     ).then((snap) =>
//       setClientServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );
//   }, []);
//   const handleShare = async () => {
//     try {
//       if (!job?._id) return;

//       const shareUrl = `${window.location.origin}/service/${job._id}`;

//       const shareData = {
//         title: job.title || "Service Details",
//         text: `Check out this service: ${job.title}`,
//         url: shareUrl,
//       };

//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         await navigator.clipboard.writeText(shareUrl);
//         alert("Link copied to clipboard!");
//       }
//     } catch (error) {
//       console.error("Share failed:", error);
//     }
//   };

//   const freelancerId = job?.freelancerId || job?.userId;

//   const currentNotification =
//     freelancerId && id
//       ? notifications.find(
//         (n) =>
//           n?.freelancerId === freelancerId &&
//           n?.serviceId === id
//       )
//       : null;

//   const initialMessage =
//     job && auth.currentUser
//       ? `HUZZLER_JOB_DATA:${JSON.stringify({
//         id: job._id,
//         title: job.title,
//         category: job.category,
//         budget_from: job.budget_from,
//         budget_to: job.budget_to,
//         deliveryDuration: job.deliveryDuration,
//         skills: job.skills || [],
//         description: job.description,
//         clientId: auth.currentUser.uid,
//         freelancerId,
//       })}`
//       : "";

//   if (!job) return <div style={{ padding: 40 }}>Loading...</div>;

//   return (
//     <div className="page-wrap">
//       <div className="top-header">
//         <div className="top-left-title">Project Details</div>
//         <div className="top-iconss">
//           <div className="icon-btn" onClick={handleToggleSave}>
//             {isSaved ? (
//               <BsBookmarkFill size={25} />
//             ) : (
//               <Bookmark size={30} />
//             )}
//           </div>

//           <div className="icon-btn" onClick={handleShare}>
//             <FiShare2 size={20} />
//           </div>

//           <div className="icon-btn" onClick={() => navigate(-1)}>
//             <FiX size={20} />
//           </div>
//         </div>
//       </div>

//       <div className="profile-box">
//         <div className="profile-circle">
//   {job.title
//     ?.split(" ")
//     .map(word => word[0])
//     .slice(0,2)
//     .join("")
//     .toUpperCase()}
// </div>
//         <div className="profile-info">
//           <div className="name">{job.title}</div>
//           <div className="role">{job.category}</div>
//         </div>
//       </div>

//       <div className="money-box">
//         <div>
//           <div className="range">₹{job.budget_from} - {job.budget_to}</div>
//           <div>Timeline: {job.deliveryDuration}</div>
//         </div>
//         <button
//           className="view-btn"
//           onClick={() =>
//             navigate(`/client-dashbroad2/freelancerblockSreen/${freelancerId}`)
//           }
//         >
//           View Profile
//         </button>
//       </div>

//       <div className="skill-title">Skills Required</div>
//       <div className="skills-box">
//         {(job.skills || []).map((s, i) => (
//           <div key={i} className="skill-chip">{s}</div>
//         ))}
//       </div>

//       <div className="desc-title">Project Description</div>
//       <div className="desc-text">{job.description}</div>

//       <div className="footer-actions">
//         <button className="cancel-btn" onClick={() => navigate(-1)}>
//           Cancel
//         </button>

//         {currentNotification ? (
//           currentNotification.read ? (
//             <button
//               className="connect-btn"
//               style={{ background: "#7A4DFF" }}
//               onClick={() => {
//   const initialMessage = `HUZZLER_JOB_DATA:${JSON.stringify({
//     id: job._id,
//     title: job.title,
//     category: job.category,
//     budget_from: job.budget_from,
//     budget_to: job.budget_to,
//     deliveryDuration: job.deliveryDuration,
//     skills: job.skills || [],
//     description: job.description,
//     clientId: auth.currentUser.uid,
//     freelancerId,
//     is24Hour: false,
//   })}`;

//   navigate("/chat", {
//     state: {
//       currentUid: auth.currentUser.uid,
//       otherUid: freelancerId,
//       otherName: job.title,
//       initialMessage,
//     },
//   });
// }}
//             >
//               Start Message
//             </button>
//           ) : (
//             <button className="connect-btn" disabled style={{ background: "#BDBDBD" }}>
//               Request Sent
//             </button>
//           )
//         ) : (
//           <button className="connect-btn" onClick={() => setConnectOpen(true)}>
//             Hire Now
//           </button>
//         )}
//       </div>

//       <ConnectPopup
//         open={connectOpen}
//         onClose={() => setConnectOpen(false)}
//         freelancerId={freelancerId}
//         freelancerName={job.title}
//         services={clientServices}
//         serviceId={job._id}
//       />
//     </div>
//   );
// }






// // ServiceDetailsModal.jsx
// // Fully ported from servicefullDetailScreen.dart — feature-for-feature parity
// // UI design kept exactly as original web version

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db, auth } from "../firbase/Firebase";
// import { FiShare2, FiX } from "react-icons/fi";
// import { Bookmark } from "lucide-react";
// import { BsBookmarkFill } from "react-icons/bs";
// import ConnectPopup from "../Firebasejobs/Connectpop/Connectpop";

// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   getDocs,
//   arrayUnion,
//   arrayRemove,
//   doc,
//   getDoc,
//   updateDoc,
// } from "firebase/firestore";

// import "./serviceDetailsModel.css";

// // ─── CSS (kept exactly from original) ───────────────────────────────────────
// const css = `
// *{font-family:'Inter', sans-serif;}
// .page-wrap{max-width:900px;margin:30px auto;background:#fff;border-radius:18px;box-shadow:0 8px 26px rgba(0,0,0,0.08);}
// .top-header{padding:20px 24px;display:flex;justify-content:space-between;align-items:center;}
// .top-left-title{font-size:22px;font-weight:700;}
// .top-icons{display:flex;gap:16px;font-size:20px;}
// .top-icons svg:hover{transform:scale(1.1);transition:0.2s ease;}
// .profile-box{padding:20px 24px;display:flex;gap:18px;}
// .profile-circle{width:58px;height:58px;border-radius:16px;background:linear-gradient(135deg,#7A4DFF,#B28DFF);display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;font-weight:600;}
// .profile-info .name{font-size:32px;font-weight:600;}
// .profile-info .role{font-size:18px;color:#7C3CFF;}
// .money-box{padding:20px 24px;display:flex;justify-content:space-between;}
// .range{font-size:22px;font-weight:700;}
// .view-btn{
//   background:#7A4DFF;
//   color:#fff;
//   border:none;
//   padding:12px 28px;
//   border-radius:12px;
//   cursor:pointer;
// }
// .view-btn:hover{
//   transform:translateY(-2px);
//   box-shadow:0 6px 16px rgba(122,77,255,0.3);
// }
// .skill-title,.desc-title{padding:10px 24px;font-size:20px;font-weight:700;}
// .skills-box{padding:8px 24px;display:flex;flex-wrap:wrap;gap:10px;}
// .skill-chip{
//   background:#FFF5CC;
//   border:1px solid #FFD84D;
//   padding:8px 14px;
//   border-radius:10px;
//   font-weight:500;
// }
// .desc-text{padding:10px 24px 20px;color:#444;line-height:1.6;}
// .footer-actions{padding:18px 24px;border-top:1px solid #eee;display:flex;gap:14px;}
// .cancel-btn,.connect-btn{flex:1;padding:14px;border-radius:12px;font-size:16px;font-weight:700;}
// .cancel-btn{border:2px solid #A58BFF;background:#fff;color:#7A4DFF;}
// .connect-btn{
//   border:none;
//   background:linear-gradient(135deg,#7A4DFF,#A258FF);
//   color:#fff;
//   transition:0.2s ease;
// }
// .connect-btn:hover{
//   transform:translateY(-2px);
//   box-shadow:0 6px 16px rgba(122,77,255,0.3);
// }
// .top-iconss {
//   display: flex;
//   align-items: center;
//   gap: 18px;
// }
// .icon-btn {
//   width: 34px;
//   height: 34px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   border-radius: 8px;
//   transition: 0.2s ease;
// }
// .icon-btn img {
//   width: 18px;
//   height: 18px;
//   object-fit: contain;
// }
// /* ── About Freelancer section (mirrors Dart _buildAboutSection) ── */
// .about-section{padding:10px 24px 20px;}
// .about-title{font-size:20px;font-weight:700;margin-bottom:14px;}
// .freelancer-row{display:flex;align-items:center;gap:14px;margin-bottom:14px;}
// .fl-avatar{
//   width:55px;height:55px;border-radius:10px;
//   background:#5359FF;
//   display:flex;align-items:center;justify-content:center;
//   color:#C4C6FF;font-size:20px;font-weight:500;flex-shrink:0;
// }
// .fl-name{font-size:16px;font-weight:500;}
// .fl-title{font-size:16px;color:#7C3CFF;font-weight:500;}
// .fl-meta{display:flex;justify-content:space-between;font-size:14px;color:#333;margin-top:4px;}
// .view-profile-btn{
//   margin-left:auto;
//   background:#7C3CFF;color:#fff;border:none;
//   padding:8px 18px;border-radius:20px;cursor:pointer;
//   font-size:13px;font-weight:500;white-space:nowrap;
// }
// .view-profile-btn:hover{opacity:0.88;}
// /* meta info row inside yellow card */
// .meta-info{padding:0 24px 16px;display:flex;gap:8px;color:#555;font-size:13px;}
// .meta-info span{display:flex;align-items:center;gap:4px;}
// `;

// // ─── HELPERS (mirrors Dart helpers) ─────────────────────────────────────────

// /** Mirrors timeAgo() in Dart */
// function timeAgo(date) {
//   if (!date) return "";
//   const diff = Date.now() - date.getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return "just now";
//   if (mins < 60) return `${mins} min ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs} hr ago`;
//   const days = Math.floor(hrs / 24);
//   return `${days} day${days > 1 ? "s" : ""} ago`;
// }

// /** Mirrors formatAmount() in Dart */
// function formatAmount(value) {
//   const n = Number(value) || 0;
//   if (n >= 1000000) {
//     return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
//   } else if (n >= 1000) {
//     return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
//   }
//   return String(n);
// }

// /** Build initials from first + last name */
// function buildInitials(first = "", last = "") {
//   return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "U";
// }

// // ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
// export default function ServicePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // ── Data state ──────────────────────────────────────────────────────────
//   const [job, setJob]                       = useState(null);
//   const [isSaved, setIsSaved]               = useState(false);
//   const [connectOpen, setConnectOpen]       = useState(false);

//   // Freelancer user data (mirrors getUserData + FutureBuilder in Dart)
//   const [freelancerData, setFreelancerData] = useState(null);
//   const [servicePostedCount, setServicePostedCount] = useState(0);

//   // Notification state (mirrors currentNotification logic)
//   // status: null | 'sent' | 'read'
//   const [notifState, setNotifState]         = useState(null); // null = no request, 'sent' = pending, 'read' = accepted

//   const [clientServices, setClientServices] = useState([]);

//   // ── Inject CSS ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = css;
//     document.head.appendChild(style);
//     return () => style.remove();
//   }, []);

//   // ── Load job from BOTH collections (mirrors StreamBuilder fallback in Dart)
//   // Tries `services` first; if not found, falls back to `service_24h`
//   useEffect(() => {
//     if (!id) return;
//     let unsubServices = null;
//     let unsubService24 = null;
//     let foundInServices = false;

//     // Listen to `services` doc
//     unsubServices = onSnapshot(doc(db, "services", id), (snap) => {
//       if (snap.exists()) {
//         foundInServices = true;
//         setJob({ ...snap.data(), _id: snap.id, _collection: "services" });
//         if (unsubService24) unsubService24(); // stop listening to 24h if found in services
//       } else if (!foundInServices) {
//         // Not in `services`, start listening to `service_24h`
//         unsubService24 = onSnapshot(doc(db, "service_24h", id), (snap24) => {
//           if (snap24.exists()) {
//             setJob({ ...snap24.data(), _id: snap24.id, _collection: "service_24h" });
//           }
//         });
//       }
//     });

//     return () => {
//       if (unsubServices) unsubServices();
//       if (unsubService24) unsubService24();
//     };
//   }, [id]);

//   // ── Load saved status (mirrors StreamBuilder on users doc in Dart) ──────
//   // Real-time so bookmark icon stays in sync
//   useEffect(() => {
//     if (!auth.currentUser || !id) return;

//     const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (snap) => {
//       const data = snap.data() || {};
//       const savedJobs = Array.isArray(data.savedJobs) ? data.savedJobs : [];
//       setIsSaved(savedJobs.includes(id));
//     });

//     return () => unsub();
//   }, [id]);

//   // ── Load freelancer data + service counts (mirrors getUserData + getServicePostedCount) ──
//   useEffect(() => {
//     if (!job) return;
//     const userId = job.userId || job.freelancerId || "";
//     if (!userId) return;

//     // Fetch user profile
//     getDoc(doc(db, "users", userId)).then((snap) => {
//       if (snap.exists()) setFreelancerData(snap.data());
//     });

//     // Count services from both collections (mirrors getServicePostedCount)
//     Promise.all([
//       getDocs(query(collection(db, "services"), where("userId", "==", userId))),
//       getDocs(query(collection(db, "service_24h"), where("userId", "==", userId))),
//     ]).then(([s1, s2]) => {
//       setServicePostedCount(s1.size + s2.size);
//     });
//   }, [job]);

//   // ── Listen to notification / request state (mirrors StreamBuilder on collaboration_requests) ──
//   // Mirrors: if status == 'accepted' → show Message; if status == 'sent' → show Requested; else show Connect
//   useEffect(() => {
//     if (!auth.currentUser || !job) return;
//     const currentUid = auth.currentUser.uid;
//     const freelancerId = job.userId || job.freelancerId || "";
//     if (!freelancerId) return;

//     // Listen to collaboration_requests for this client + freelancer + serviceId
//     const q = query(
//       collection(db, "collaboration_requests"),
//       where("clientId", "==", currentUid),
//       where("freelancerId", "==", freelancerId),
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       if (snap.empty) {
//         setNotifState(null);
//         return;
//       }
//       // Find doc matching this serviceId if possible, otherwise any
//       const matching = snap.docs.find((d) => d.data().jobId === id) || snap.docs[0];
//       const status = matching.data().status || "sent";
//       setNotifState(status); // 'sent' | 'accepted'
//     });

//     return () => unsub();
//   }, [job, id]);

//   // ── Also listen via notifications collection (fallback for read state) ──
//   useEffect(() => {
//     if (!auth.currentUser || !id) return;
//     const uid = auth.currentUser.uid;

//     const q = query(
//       collection(db, "notifications"),
//       where("type", "==", "hire_request"),
//       where("serviceId", "==", id),
//       where("clientUid", "==", uid)
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       if (snap.empty) return; // don't clear — collaboration_requests is source of truth
//       const n = snap.docs[0].data();
//       // Only upgrade to 'accepted' state if read == true
//       if (n.read === true) setNotifState("accepted");
//     });

//     return () => unsub();
//   }, [id]);

//   // ── Load client's own services (for ConnectPopup) ────────────────────────
//   useEffect(() => {
//     if (!auth.currentUser) return;
//     getDocs(
//       query(collection(db, "services"), where("userId", "==", auth.currentUser.uid))
//     ).then((snap) =>
//       setClientServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );
//   }, []);

//   // ── Actions ──────────────────────────────────────────────────────────────

//   /** Mirrors bookmark toggle in Dart (arrayUnion / arrayRemove on savedJobs) */
//   const handleToggleSave = async () => {
//     if (!auth.currentUser) return;
//     const userRef = doc(db, "users", auth.currentUser.uid);
//     try {
//       if (isSaved) {
//         await updateDoc(userRef, { savedJobs: arrayRemove(id) });
//       } else {
//         await updateDoc(userRef, { savedJobs: arrayUnion(id) });
//       }
//     } catch (err) {
//       console.error("toggle save error:", err);
//     }
//   };

//   /** Mirrors _shareProfile in Dart (shares Play Store link) */
//   const handleShare = async () => {
//     const playStoreLink =
//       "https://play.google.com/store/apps/details?id=com.huzzler.app";
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: "Huzzler App",
//           text: "Download the app here:",
//           url: playStoreLink,
//         });
//       } else {
//         await navigator.clipboard.writeText(playStoreLink);
//         alert("Link copied to clipboard!");
//       }
//     } catch (e) {
//       console.error("share error:", e);
//     }
//   };

//   /** Navigate to chat (mirrors ChatScreen push in Dart) */
//   const handleStartChat = () => {
//     if (!job || !auth.currentUser) return;
//     const freelancerId = job.userId || job.freelancerId || "";
//     const freelancerName =
//       freelancerData
//         ? `${freelancerData.firstName || freelancerData.first_name || ""} ${freelancerData.lastName || freelancerData.last_name || ""}`.trim()
//         : job.title || "";

//     const initialMessage = `HUZZLER_JOB_DATA:${JSON.stringify({
//       id: job._id,
//       title: job.title,
//       category: job.category,
//       budget_from: job.budget_from,
//       budget_to: job.budget_to,
//       deliveryDuration: job.deliveryDuration,
//       skills: job.skills || [],
//       description: job.description,
//       clientId: auth.currentUser.uid,
//       freelancerId,
//       is24Hour: job._collection === "service_24h",
//     })}`;

//     navigate("/chat", {
//       state: {
//         currentUid: auth.currentUser.uid,
//         otherUid: freelancerId,
//         otherName: freelancerName,
//         initialMessage,
//       },
//     });
//   };

//   // ── Loading ──────────────────────────────────────────────────────────────
//   if (!job) {
//     return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
//   }

//   // ── Derived values ───────────────────────────────────────────────────────
//   const freelancerId   = job.userId || job.freelancerId || "";
//   const budgetFrom     = formatAmount(job.budget_from ?? 0);
//   const budgetTo       = formatAmount(job.budget_to ?? 0);
//   const createdAt      = job.createdAt?.toDate ? job.createdAt.toDate() : null;
//   const timeText       = timeAgo(createdAt);
//   const impressions    = job.impressions ?? 0;
//   const deliveryDuration = job.deliveryDuration || "24 Hours";
//   const location       = job.location || "Remote";
//   const skills         = Array.isArray(job.skills) ? job.skills : [];
//   const tools          = Array.isArray(job.tools) ? job.tools : [];

//   // Freelancer display values
//   const flFirst        = freelancerData?.firstName || freelancerData?.first_name || "";
//   const flLast         = freelancerData?.lastName  || freelancerData?.last_name  || "";
//   const flFullName     = `${flFirst} ${flLast}`.trim() || "User";
//   const flInitials     = buildInitials(flFirst, flLast);
//   const flTitle        = freelancerData?.professional_title || "Freelancer";
//   const flCompleted    = freelancerData?.completedProjects ?? 0;

//   // Title initials for profile circle
//   const titleInitials = (job.title || "")
//     .split(" ")
//     .map((w) => w[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

//   return (
//     <div className="page-wrap">
//       {/* ── HEADER ── */}
//       <div className="top-header">
//         <div className="top-left-title">Project Details</div>
//         <div className="top-iconss">
//           {/* Bookmark — real-time (mirrors StreamBuilder in Dart) */}
//           <div className="icon-btn" onClick={handleToggleSave}>
//             {isSaved ? <BsBookmarkFill size={22} /> : <Bookmark size={24} />}
//           </div>

//           {/* Share — mirrors _shareProfile (Play Store link) */}
//           <div className="icon-btn" onClick={handleShare}>
//             <FiShare2 size={20} />
//           </div>

//           {/* Close */}
//           <div className="icon-btn" onClick={() => navigate(-1)}>
//             <FiX size={20} />
//           </div>
//         </div>
//       </div>

//       {/* ── PROFILE / TITLE ── */}
//       <div className="profile-box">
//         <div className="profile-circle">{titleInitials || "JB"}</div>
//         <div className="profile-info">
//           <div className="name">{job.title}</div>
//           <div className="role">{job.category}</div>
//         </div>
//       </div>

//       {/* ── YELLOW INFO CARD (Budget / Timeline / Location / Proposed / Time) ── */}
//       <div style={{ padding: "0 24px 20px" }}>
//         <div
//           style={{
//             background: "#FFFFEA",
//             borderRadius: 20,
//             border: "1.2px solid #e0e0e0",
//             padding: 20,
//           }}
//         >
//           {/* Title inside card */}
//           <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 12 }}>
//             {job.title}
//           </div>

//           {/* Budget / Timeline / Location row */}
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
//             <div>
//               <div style={{ fontSize: 16, color: "#333", marginBottom: 6 }}>Budget</div>
//               <div style={{ fontSize: 16, fontWeight: 500, color: "#673ab7" }}>
//                 ₹{budgetFrom} – ₹{budgetTo}
//               </div>
//             </div>
//             <div>
//               <div style={{ fontSize: 16, color: "#333", marginBottom: 6 }}>Timeline</div>
//               <div style={{ fontSize: 16, fontWeight: 500 }}>{deliveryDuration}</div>
//             </div>
//             <div>
//               <div style={{ fontSize: 16, color: "#333", marginBottom: 6 }}>Location</div>
//               <div style={{ fontSize: 16, fontWeight: 500 }}>{location}</div>
//             </div>
//           </div>

//           {/* Proposed + TimeAgo row */}
//           <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#333" }}>
//             <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
//               👤 {impressions} Proposed
//             </span>
//             <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
//               🕐 {timeText}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ── SKILLS REQUIRED (mirrors skills + tools chips) ── */}
//       <div className="skill-title">Skills Required</div>
//       <div className="skills-box">
//         {[...skills, ...tools].map((s, i) => (
//           <div key={i} className="skill-chip">{s}</div>
//         ))}
//       </div>

//       {/* ── PROJECT DESCRIPTION ── */}
//       <div className="desc-title">Project Description</div>
//       <div className="desc-text">{job.description}</div>

//       {/* ── ABOUT THE FREELANCER (mirrors FutureBuilder section in Dart) ── */}
//       {freelancerData && (
//         <div className="about-section">
//           <div className="about-title">About the Freelancers</div>

//           {/* Avatar + Name + View Profile button */}
//           <div className="freelancer-row">
//             <div className="fl-avatar">{flInitials}</div>
//             <div style={{ flex: 1 }}>
//               <div className="fl-name">{flFullName}</div>
//               <div className="fl-title">{flTitle}</div>
//             </div>
//             <button
//               className="view-profile-btn"
//               onClick={() =>
//                 navigate(
//                   `/client-dashbroad2/freelancerblockSreen/${freelancerId}`
//                 )
//               }
//             >
//               View Profile
//             </button>
//           </div>

//           {/* Service Posted + Completed Projects (mirrors FutureBuilder<int>) */}
//           <div className="fl-meta">
//             <span>Service Posted: {servicePostedCount}</span>
//             <span>Completed Projects: {flCompleted}</span>
//           </div>
//         </div>
//       )}

//       {/* ── FOOTER ACTIONS (mirrors Dart button states) ── */}
//       <div className="footer-actions">
//         <button className="cancel-btn" onClick={() => navigate(-1)}>
//           Cancel
//         </button>

//         {/* STATE 1: No request yet → Hire Now */}
//         {!notifState && (
//           <button className="connect-btn" onClick={() => setConnectOpen(true)}>
//             Hire Now
//           </button>
//         )}

//         {/* STATE 2: Request sent, pending → Requested (disabled) */}
//         {notifState === "sent" && (
//           <button
//             className="connect-btn"
//             disabled
//             style={{ background: "#BDBDBD", cursor: "not-allowed" }}
//           >
//             Requested
//           </button>
//         )}

//         {/* STATE 3: Accepted → Start Message */}
//         {notifState === "accepted" && (
//           <button
//             className="connect-btn"
//             style={{ background: "#7A4DFF" }}
//             onClick={handleStartChat}
//           >
//             Start Message
//           </button>
//         )}
//       </div>

//       {/* ConnectPopup */}
//       <ConnectPopup
//         open={connectOpen}
//         onClose={() => setConnectOpen(false)}
//         freelancerId={freelancerId}
//         freelancerName={
//           freelancerData
//             ? `${flFirst} ${flLast}`.trim() || "Freelancer"
//             : job.title || "Freelancer"
//         }
//         services={clientServices}
//         serviceId={job._id}
//       />
//     </div>
//   );
// }



// // ServiceDetailsModal.jsx
// // Full port from servicefullDetailScreen.dart — feature-for-feature parity

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db, auth } from "../firbase/Firebase";
// import { FiShare2 } from "react-icons/fi";
// import { Bookmark, BookmarkCheck, ArrowLeft, PersonStanding } from "lucide-react";
// import ConnectPopup from "../Firebasejobs/Connectpop/Connectpop";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   getDocs,
//   arrayUnion,
//   arrayRemove,
//   doc,
//   getDoc,
//   updateDoc,
// } from "firebase/firestore";

// // ─── CHIP GRADIENT PALETTE (mirrors _chipGradients in Dart) ────────────────
// const CHIP_GRADIENTS = [
//   "#FFD6C9", // Peach
//   "#D7F5FF", // Sky Blue
//   "#EAD9FF", // Lavender
//   "#D9FFE3", // Mint Green
//   "#E3F0FF", // Soft Blue
//   "#FFD9E0", // Rose
//   "#FFF3C4", // Soft Yellow
//   "#E8F5E9", // Light Green
//   "#F3E5F5", // Soft Purple
//   "#E1F5FE", // Baby Blue
//   "#FFEBEE", // Blush Pink
//   "#F1F8E9", // Pale Lime
//   "#E0F2F1", // Aqua Mint
//   "#FFFDE7", // Cream
// ];

// function getChipColor(label) {
//   let hash = 0;
//   for (let i = 0; i < label.length; i++) hash = label.charCodeAt(i) + ((hash << 5) - hash);
//   return CHIP_GRADIENTS[Math.abs(hash) % CHIP_GRADIENTS.length];
// }

// // ─── HELPERS (mirror Dart helpers) ──────────────────────────────────────────

// function timeAgo(date) {
//   if (!date) return "";
//   const diff = Date.now() - date.getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return "just now";
//   if (mins < 60) return `${mins} min ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs} hr ago`;
//   const days = Math.floor(hrs / 24);
//   return `${days} day${days > 1 ? "s" : ""} ago`;
// }

// function formatAmount(value) {
//   const n = Number(value) || 0;
//   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
//   if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`;
//   return String(n);
// }

// function buildInitials(first = "", last = "") {
//   return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "U";
// }

// // ─── SKILL CHIP ──────────────────────────────────────────────────────────────
// function TagChip({ label }) {
//   const bg = getChipColor(label);
//   return (
//     <span
//       style={{
//         display: "inline-block",
//         padding: "7px 16px",
//         borderRadius: 30,
//         background: bg,
//         fontSize: 13,
//         fontWeight: 500,
//         color: "#1A1A1A",
//         fontFamily: "'Rubik', sans-serif",
//       }}
//     >
//       {label}
//     </span>
//   );
// }

// // ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
// export default function ServiceDetailsModal() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [job, setJob] = useState(null);
//   const [isSaved, setIsSaved] = useState(false);
//   const [connectOpen, setConnectOpen] = useState(false);
//   const [freelancerData, setFreelancerData] = useState(null);
//   const [servicePostedCount, setServicePostedCount] = useState(0);
//   const [notifState, setNotifState] = useState(null); // null | 'sent' | 'accepted'
//   const [clientServices, setClientServices] = useState([]);

//   // ── Load Rubik font ────────────────────────────────────────────────────────
//   useEffect(() => {
//     const link = document.createElement("link");
//     link.href =
//       "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600&display=swap";
//     link.rel = "stylesheet";
//     document.head.appendChild(link);
//     return () => link.remove();
//   }, []);

//   // ── Load job from BOTH collections (mirrors StreamBuilder fallback in Dart) ─
//   useEffect(() => {
//     if (!id) return;
//     let unsubService24 = null;
//     let foundInServices = false;

//     const unsubServices = onSnapshot(doc(db, "services", id), (snap) => {
//       if (snap.exists()) {
//         foundInServices = true;
//         setJob({ ...snap.data(), _id: snap.id, _collection: "services" });
//         if (unsubService24) unsubService24();
//       } else if (!foundInServices) {
//         unsubService24 = onSnapshot(doc(db, "service_24h", id), (snap24) => {
//           if (snap24.exists()) {
//             setJob({ ...snap24.data(), _id: snap24.id, _collection: "service_24h" });
//           }
//         });
//       }
//     });

//     return () => {
//       unsubServices();
//       if (unsubService24) unsubService24();
//     };
//   }, [id]);

//   // ── Saved status — real-time (mirrors StreamBuilder on users in Dart) ──────
//   useEffect(() => {
//     if (!auth.currentUser || !id) return;
//     const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (snap) => {
//       const data = snap.data() || {};
//       const savedJobs = Array.isArray(data.savedJobs) ? data.savedJobs : [];
//       setIsSaved(savedJobs.includes(id));
//     });
//     return () => unsub();
//   }, [id]);

//   // ── Freelancer data + service counts (mirrors getUserData + getServicePostedCount) ─
//   useEffect(() => {
//     if (!job) return;
//     const userId = job.userId || job.freelancerId || "";
//     if (!userId) return;

//     getDoc(doc(db, "users", userId)).then((snap) => {
//       if (snap.exists()) setFreelancerData(snap.data());
//     });

//     Promise.all([
//       getDocs(query(collection(db, "services"), where("userId", "==", userId))),
//       getDocs(query(collection(db, "service_24h"), where("userId", "==", userId))),
//     ]).then(([s1, s2]) => setServicePostedCount(s1.size + s2.size));
//   }, [job]);

//   // ── Collaboration request state (mirrors StreamBuilder on collaboration_requests) ─
//   useEffect(() => {
//     if (!auth.currentUser || !job) return;
//     const currentUid = auth.currentUser.uid;
//     const freelancerId = job.userId || job.freelancerId || "";
//     if (!freelancerId) return;

//     const q = query(
//       collection(db, "collaboration_requests"),
//       where("clientId", "==", currentUid),
//       where("freelancerId", "==", freelancerId)
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       if (snap.empty) { setNotifState(null); return; }
//       const matching = snap.docs.find((d) => d.data().jobId === id) || snap.docs[0];
//       setNotifState(matching.data().status || "sent");
//     });
//     return () => unsub();
//   }, [job, id]);

//   // ── notifications fallback for accepted state ─────────────────────────────
//   useEffect(() => {
//     if (!auth.currentUser || !id) return;
//     const uid = auth.currentUser.uid;
//     const q = query(
//       collection(db, "notifications"),
//       where("type", "==", "hire_request"),
//       where("serviceId", "==", id),
//       where("clientUid", "==", uid)
//     );
//     const unsub = onSnapshot(q, (snap) => {
//       if (snap.empty) return;
//       const n = snap.docs[0].data();
//       if (n.read === true) setNotifState("accepted");
//     });
//     return () => unsub();
//   }, [id]);

//   // ── Client's own services for ConnectPopup ────────────────────────────────
//   useEffect(() => {
//     if (!auth.currentUser) return;
//     getDocs(
//       query(collection(db, "services"), where("userId", "==", auth.currentUser.uid))
//     ).then((snap) =>
//       setClientServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );
//   }, []);

//   // ── Toggle bookmark (mirrors arrayUnion/arrayRemove in Dart) ──────────────
//   const handleToggleSave = async () => {
//     if (!auth.currentUser) return;
//     const userRef = doc(db, "users", auth.currentUser.uid);
//     try {
//       if (isSaved) await updateDoc(userRef, { savedJobs: arrayRemove(id) });
//       else await updateDoc(userRef, { savedJobs: arrayUnion(id) });
//     } catch (err) {
//       console.error("toggle save error:", err);
//     }
//   };

//   // ── Share (mirrors _shareProfile — Play Store link) ────────────────────────
//   const handleShare = async () => {
//     const link = "https://play.google.com/store/apps/details?id=com.huzzler.app";
//     try {
//       if (navigator.share) {
//         await navigator.share({ title: "Huzzler App", text: "Download the app here:", url: link });
//       } else {
//         await navigator.clipboard.writeText(link);
//         alert("Link copied to clipboard!");
//       }
//     } catch (e) { console.error(e); }
//   };

//   // ── Navigate to chat (mirrors ChatScreen push for accepted state) ──────────
//   const handleStartChat = () => {
//     if (!job || !auth.currentUser) return;
//     const freelancerId = job.userId || job.freelancerId || "";
//     const freelancerName = freelancerData
//       ? `${freelancerData.firstName || ""} ${freelancerData.lastName || ""}`.trim()
//       : job.title || "";

//     const initialMessage = `HUZZLER_JOB_DATA:${JSON.stringify({
//       id: job._id,
//       title: job.title,
//       category: job.category,
//       budget_from: job.budget_from,
//       budget_to: job.budget_to,
//       deliveryDuration: job.deliveryDuration,
//       skills: job.skills || [],
//       description: job.description,
//       clientId: auth.currentUser.uid,
//       freelancerId,
//       is24Hour: job._collection === "service_24h",
//     })}`;

//     navigate("/chat", {
//       state: {
//         currentUid: auth.currentUser.uid,
//         otherUid: freelancerId,
//         otherName: freelancerName,
//         initialMessage,
//       },
//     });
//   };

//   // ── Loading / not found ───────────────────────────────────────────────────
//   if (!job) {
//     return (
//       <div style={S.center}>
//         <div style={S.spinner} />
//       </div>
//     );
//   }

//   // ── Derived values ────────────────────────────────────────────────────────
//   const freelancerId   = job.userId || job.freelancerId || "";
//   const budgetFrom     = formatAmount(job.budget_from ?? 0);
//   const budgetTo       = formatAmount(job.budget_to ?? 0);
//   const createdAt      = job.createdAt?.toDate ? job.createdAt.toDate() : null;
//   const timeText       = timeAgo(createdAt);
//   const impressions    = job.impressions ?? 0;
//   const deliveryDuration = job.deliveryDuration || "24 Hours";
//   const location       = job.location || "Remote";
//   const skills         = Array.isArray(job.skills) ? job.skills : [];
//   const tools          = Array.isArray(job.tools) ? job.tools : [];

//   // Freelancer display
//   const flFirst    = freelancerData?.firstName || "";
//   const flLast     = freelancerData?.lastName  || "";
//   const flFullName = `${flFirst} ${flLast}`.trim() || "User";
//   const flInitials = buildInitials(flFirst, flLast);
//   const flTitle    = freelancerData?.professional_title || "Freelancer";
//   const flCompleted = freelancerData?.completedProjects ?? 0;

//   return (
//     <div style={S.page}>
//       {/* ── HEADER (mirrors top row with back + bookmark + share in Dart) ── */}
//       <div style={S.header}>
//         <button style={S.iconBtn} onClick={() => navigate(-1)}>
//           <ArrowLeft size={22} />
//         </button>
//         <div style={S.headerRight}>
//           {/* Bookmark — real-time (mirrors StreamBuilder in Dart) */}
//           <button style={S.iconBtn} onClick={handleToggleSave} title={isSaved ? "Unsave" : "Save"}>
//             {isSaved
//               ? <BookmarkCheck size={24} color="#1A1A1A" fill="#1A1A1A" />
//               : <Bookmark size={24} color="#1A1A1A" />
//             }
//           </button>
//           {/* Share — mirrors _shareProfile */}
//           <button style={S.iconBtn} onClick={handleShare} title="Share">
//             <FiShare2 size={22} />
//           </button>
//         </div>
//       </div>

//       <div style={S.scrollBody}>

//         {/* ── YELLOW INFO CARD (mirrors Container with color 0xffFFFFEA) ── */}
//         <div style={S.yellowCard}>
//           {/* Title inside card */}
//           <div style={S.cardTitle}>{job.title}</div>

//           {/* Budget / Timeline / Location row */}
//           <div style={S.infoRow}>
//             <div style={S.infoCol}>
//               <div style={S.infoLabel}>Budget</div>
//               <div style={S.infoValue}>
//                 <span style={{ color: "#673ab7" }}>₹{budgetFrom} – ₹{budgetTo}</span>
//               </div>
//             </div>
//             <div style={S.infoCol}>
//               <div style={S.infoLabel}>Timeline</div>
//               <div style={S.infoValue}>{deliveryDuration}</div>
//             </div>
//             <div style={S.infoCol}>
//               <div style={S.infoLabel}>Location</div>
//               <div style={S.infoValue}>{location}</div>
//             </div>
//           </div>

//           {/* Proposed + TimeAgo row (mirrors bottom row inside card) */}
//           <div style={S.metaRow}>
//             <span style={S.metaItem}>
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
//               &nbsp;{impressions} Proposed
//             </span>
//             <span style={S.metaItem}>
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
//               &nbsp;{timeText}
//             </span>
//           </div>
//         </div>

//         {/* ── SKILLS REQUIRED (mirrors Wrap of skills + tools chips) ── */}
//         <div style={S.sectionTitle}>Skills Required</div>
//         <div style={S.chipsWrap}>
//           {[...skills, ...tools].map((s, i) => <TagChip key={i} label={s} />)}
//         </div>

//         {/* ── PROJECT DESCRIPTION ── */}
//         <div style={S.sectionTitle}>Project Description</div>
//         <div style={S.descText}>{job.description}</div>

//         {/* ── ABOUT THE FREELANCER (mirrors FutureBuilder section in Dart) ── */}
//         {freelancerData && (
//           <div style={S.aboutSection}>
//             <div style={S.sectionTitle}>About the Freelancers</div>

//             {/* Avatar + Name + Title + View Profile button */}
//             <div style={S.freelancerRow}>
//               {/* Avatar box — mirrors Container with color 0xff5359FF */}
//               <div style={S.flAvatar}>{flInitials}</div>

//               <div style={{ flex: 1 }}>
//                 <div style={S.flName}>{flFullName}</div>
//                 <div style={S.flProfTitle}>{flTitle}</div>
//               </div>

//               {/* View Profile button — mirrors ElevatedButton in Dart */}
//               <button
//                 style={S.viewProfileBtn}
//                 onClick={() =>
//                   navigate(`/client-dashbroad2/freelancerblockSreen/${freelancerId}`)
//                 }
//               >
//                 View Profile
//               </button>
//             </div>

//             {/* Service Posted + Completed Projects (mirrors FutureBuilder<int>) */}
//             <div style={S.flMeta}>
//               <span>Service Posted: {servicePostedCount}</span>
//               <span>Completed Projects: {flCompleted}</span>
//             </div>
//           </div>
//         )}

//         {/* ── FOOTER ACTIONS (mirrors Dart button states) ── */}
//         <div style={S.footerActions}>
//           <button style={S.cancelBtn} onClick={() => navigate(-1)}>
//             Cancel
//           </button>

//           {/* STATE 1: No request → Hire Now (mirrors Connect button) */}
//           {!notifState && (
//             <button style={S.hireBtn} onClick={() => setConnectOpen(true)}>
//               Hire Now
//             </button>
//           )}

//           {/* STATE 2: sent/pending → Requested (disabled) */}
//           {notifState === "sent" && (
//             <button style={{ ...S.hireBtn, background: "#BDBDBD", cursor: "not-allowed" }} disabled>
//               Requested
//             </button>
//           )}

//           {/* STATE 3: accepted → Start Message */}
//           {notifState === "accepted" && (
//             <button style={S.hireBtn} onClick={handleStartChat}>
//               Start Message
//             </button>
//           )}
//         </div>

//       </div>

//       {/* ConnectPopup */}
//       <ConnectPopup
//         open={connectOpen}
//         onClose={() => setConnectOpen(false)}
//         freelancerId={freelancerId}
//         freelancerName={
//           freelancerData
//             ? `${flFirst} ${flLast}`.trim() || "Freelancer"
//             : job.title || "Freelancer"
//         }
//         services={clientServices}
//         serviceId={job._id}
//       />
//     </div>
//   );
// }

// // ─── STYLES ──────────────────────────────────────────────────────────────────
// const S = {
//   page: {
//     maxWidth: 720,
//     margin: "0 auto",
//     background: "#fff",
//     minHeight: "100vh",
//     fontFamily: "'Rubik', sans-serif",
//   },
//   center: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//   },
//   spinner: {
//     width: 40,
//     height: 40,
//     border: "3px solid #e5e5e5",
//     borderTop: "3px solid #7C3CFF",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },

//   // ── Header
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "14px 16px",
//     position: "sticky",
//     top: 0,
//     background: "#fff",
//     zIndex: 10,
//     borderBottom: "1px solid #f0f0f0",
//   },
//   headerRight: {
//     display: "flex",
//     gap: 16,
//     alignItems: "center",
//   },
//   iconBtn: {
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 6,
//     borderRadius: 8,
//     color: "#1A1A1A",
//   },

//   scrollBody: {
//     padding: "0 0 40px",
//   },

//   // ── Yellow card (mirrors Container color 0xffFFFFEA)
//   yellowCard: {
//     margin: "16px 16px 0",
//     background: "#FFFFEA",
//     borderRadius: 20,
//     border: "1.2px solid #e0e0e0",
//     padding: 20,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: 500,
//     marginBottom: 14,
//     color: "#1A1A1A",
//   },
//   infoRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: 16,
//     gap: 8,
//   },
//   infoCol: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   infoLabel: {
//     fontSize: 15,
//     color: "#333",
//     marginBottom: 6,
//   },
//   infoValue: {
//     fontSize: 15,
//     fontWeight: 500,
//     color: "#1A1A1A",
//   },
//   metaRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     fontSize: 13,
//     color: "#444",
//   },
//   metaItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: 4,
//   },

//   // ── Sections
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 500,
//     padding: "20px 16px 10px",
//     color: "#1A1A1A",
//   },
//   chipsWrap: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 10,
//     padding: "0 16px",
//   },
//   descText: {
//     padding: "0 16px",
//     fontSize: 15,
//     lineHeight: 1.6,
//     color: "#333",
//   },

//   // ── About Freelancer section
//   aboutSection: {
//     padding: "0 16px",
//   },
//   freelancerRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//     marginBottom: 14,
//     marginTop: 4,
//   },
//   // Avatar box — mirrors Container with color 0xff5359FF, borderRadius 10
//   flAvatar: {
//     width: 55,
//     height: 55,
//     borderRadius: 10,
//     background: "#5359FF",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#C4C6FF",
//     fontSize: 20,
//     fontWeight: 500,
//     flexShrink: 0,
//   },
//   flName: {
//     fontSize: 16,
//     fontWeight: 500,
//     color: "#1A1A1A",
//     marginBottom: 4,
//   },
//   flProfTitle: {
//     fontSize: 15,
//     color: "#7C3CFF",
//     fontWeight: 500,
//   },
//   // View Profile button — mirrors ElevatedButton with color 0xFF7C3CFF
//   viewProfileBtn: {
//     background: "#7C3CFF",
//     color: "#fff",
//     border: "none",
//     padding: "8px 18px",
//     borderRadius: 20,
//     cursor: "pointer",
//     fontSize: 13,
//     fontWeight: 500,
//     whiteSpace: "nowrap",
//     flexShrink: 0,
//   },
//   flMeta: {
//     display: "flex",
//     justifyContent: "space-between",
//     fontSize: 14,
//     color: "#333",
//     marginTop: 4,
//     flexWrap: "wrap",
//     gap: 8,
//   },

//   // ── Footer actions
//   footerActions: {
//     display: "flex",
//     gap: 14,
//     padding: "20px 16px 0",
//     borderTop: "1px solid #eee",
//     marginTop: 24,
//   },
//   cancelBtn: {
//     flex: 1,
//     padding: "14px 0",
//     borderRadius: 30,
//     border: "2px solid #A58BFF",
//     background: "#fff",
//     color: "#7C3CFF",
//     fontSize: 15,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontFamily: "'Rubik', sans-serif",
//   },
//   hireBtn: {
//     flex: 1,
//     padding: "14px 0",
//     borderRadius: 30,
//     border: "none",
//     background: "linear-gradient(135deg, #7A4DFF, #A258FF)",
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontFamily: "'Rubik', sans-serif",
//   },
// };

// // Spinner keyframes
// const styleTag = document.createElement("style");
// styleTag.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
// document.head.appendChild(styleTag);



// ServiceDetailsModal.jsx
// Converted from servicefullDetailScreen.dart — full React.js version



import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  collection,
  getDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  updateDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "../firbase/Firebase"; // adjust path as needed
import { ArrowLeft, Bookmark, BookmarkCheck, Share2, User, Clock } from "lucide-react";
import FreelancerFullDetailScreen from "./FreelancerFullDetailScreen.jsx"; // for navigation

// ─── Chip Gradients ────────────────────────────────────────────────────────────
const CHIP_GRADIENTS = [
  ["#FFD6C9", "#FFD6C9"], ["#D7F5FF", "#D7F5FF"], ["#EAD9FF", "#EAD9FF"],
  ["#D9FFE3", "#D9FFE3"], ["#E3F0FF", "#E3F0FF"], ["#FFD9E0", "#FFD9E0"],
  ["#FFF3C4", "#FFF3C4"], ["#E8F5E9", "#E8F5E9"], ["#F3E5F5", "#F3E5F5"],
  ["#E1F5FE", "#E1F5FE"], ["#FFEBEE", "#FFEBEE"], ["#F1F8E9", "#F1F8E9"],
  ["#E0F2F1", "#E0F2F1"], ["#FFFDE7", "#FFFDE7"],
];

function getChipGradient(label) {
  const idx = Math.abs(label.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % CHIP_GRADIENTS.length;
  return CHIP_GRADIENTS[idx];
}

function TagChip({ label }) {
  const [c1, c2] = getChipGradient(label);
  return (
    <span style={{
      padding: "8px 16px",
      borderRadius: 30,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      fontSize: 13,
      fontWeight: 500,
      color: "#1A1A1A",
      fontFamily: "Rubik, sans-serif",
      display: "inline-block",
    }}>{label}</span>
  );
}

// ─── Time Ago helper ───────────────────────────────────────────────────────────
function timeAgo(date) {
  if (!date) return "";
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  const days = Math.floor(diff / 86400);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

// ─── Format amount ─────────────────────────────────────────────────────────────
function formatAmount(value) {
  const n = Number(value);
  if (isNaN(n)) return String(value);
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

// ─── Snackbar ──────────────────────────────────────────────────────────────────
function Snackbar({ message, color, onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [message]);
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: color || "#333", color: "#fff", padding: "12px 24px",
      borderRadius: 10, fontFamily: "Rubik, sans-serif", zIndex: 9999, fontSize: 14,
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    }}>{message}</div>
  );
}

// ─── Loading Spinner ───────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{
        width: 40, height: 40, border: "3px solid #7C3CFF",
        borderTopColor: "transparent", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ServiceFullDetailScreen({ jobId: propJobId }) {
  const navigate = useNavigate();
  const params = useParams();
const jobId = propJobId || params.id;

  const currentUser = auth.currentUser;
  const currentUid = currentUser?.uid;

  // Service data
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // User data (poster)
  const [userData, setUserData] = useState(null);
  const [servicePostedCount, setServicePostedCount] = useState(0);

  // Save state
  const [isSaved, setIsSaved] = useState(false);
  const [savingInProgress, setSavingInProgress] = useState(false);

  // Snackbar
  const [snack, setSnack] = useState({ msg: "", color: "#333" });
  const showSnack = (msg, color = "#333") => setSnack({ msg, color });

  // ── Fetch service from both collections ────────────────────────────────────
  useEffect(() => {
    if (!jobId) return;
    setLoading(true);

    let unsubServices, unsubService24h;
    let hasData = false;

    // Listen to "services" collection
    unsubServices = onSnapshot(doc(db, "services", jobId), snap => {
      if (snap.exists()) {
        hasData = true;
        setServiceData({ id: snap.id, ...snap.data(), _collection: "services" });
        setLoading(false);
      }
    });

    // Listen to "service_24h" collection
    unsubService24h = onSnapshot(doc(db, "service_24h", jobId), snap => {
      if (snap.exists() && !hasData) {
        hasData = true;
        setServiceData({ id: snap.id, ...snap.data(), _collection: "service_24h" });
        setLoading(false);
      }
    });

    // If neither found after a delay
    const timer = setTimeout(() => {
      if (!hasData) {
        setNotFound(true);
        setLoading(false);
      }
    }, 4000);

    return () => {
      unsubServices && unsubServices();
      unsubService24h && unsubService24h();
      clearTimeout(timer);
    };
  }, [jobId]);

  // ── Fetch user's saved jobs ────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUid) return;
    const unsub = onSnapshot(doc(db, "users", currentUid), snap => {
      const data = snap.data() || {};
      const saved = data.savedJobs || [];
      setIsSaved(saved.includes(jobId));
    });
    return unsub;
  }, [currentUid, jobId]);

  // ── Fetch poster's user data ───────────────────────────────────────────────
  const finalUserId = serviceData?.userId || serviceData?.uid || serviceData?.freelancerId || "";
  useEffect(() => {
    if (!finalUserId) return;
    const fetchUser = async () => {
      const snap = await getDoc(doc(db, "users", finalUserId));
      if (snap.exists()) setUserData({ id: snap.id, ...snap.data() });
    };
    fetchUser();
  }, [finalUserId]);

  // ── Fetch service posted count ─────────────────────────────────────────────
  useEffect(() => {
    if (!finalUserId) return;
    const countServices = async () => {
      const [s1, s2] = await Promise.all([
        getDocs(query(collection(db, "services"), where("userId", "==", finalUserId))),
        getDocs(query(collection(db, "service_24h"), where("userId", "==", finalUserId))),
      ]);
      setServicePostedCount(s1.size + s2.size);
    };
    countServices();
  }, [finalUserId]);

  // ── Toggle save ────────────────────────────────────────────────────────────
  const toggleSave = async () => {
    if (!currentUid || savingInProgress) return;
    setSavingInProgress(true);
    try {
      const userRef = doc(db, "users", currentUid);
      if (isSaved) {
        await updateDoc(userRef, { savedJobs: arrayRemove(jobId) });
      } else {
        await updateDoc(userRef, { savedJobs: arrayUnion(jobId) });
      }
    } catch (e) {
      showSnack("Failed to update saved status", "red");
    }
    setSavingInProgress(false);
  };

  // ── Share ──────────────────────────────────────────────────────────────────
  const shareService = async () => {
    const url = "https://play.google.com/store/apps/details?id=com.huzzler.app";
    if (navigator.share) {
      navigator.share({ title: "Huzzler App", url });
    } else {
      await navigator.clipboard.writeText(url);
      showSnack("Link copied!", "green");
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (loading) return <Spinner />;
  if (notFound || !serviceData) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Rubik, sans-serif", color: "#555" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
      <div style={{ fontSize: 16 }}>Service not found</div>
      <button onClick={() => navigate(-1)} style={{ marginTop: 20, background: "#7C3CFF", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer" }}>Go Back</button>
    </div>
  );

  const {
    title = "",
    description = "",
    deliveryDuration = "24 Hours",
    skills = [],
    tools = [],
    impressions = 0,
    createdAt,
    userId = "",
    location: serviceLocation = "Remote",
    budget_from,
    budget_to,
  } = serviceData;

  const budgetFrom = Number(budget_from) || 0;
  const budgetTo = Number(budget_to) || 0;
  const createdDate = createdAt?.toDate ? createdAt.toDate() : createdAt ? new Date(createdAt) : null;
  const timeText = timeAgo(createdDate);

  const posterFirstName = userData?.first_name || userData?.firstName || userData?.name || "";
  const posterLastName = userData?.last_name || userData?.lastName || "";
  const posterFullName = `${posterFirstName} ${posterLastName}`.trim() || userData?.displayName || "User";
  const posterInitials = posterFullName !== "User" 
    ? posterFullName.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase().substring(0, 2)
    : "U";
  const professionalTitle = userData?.professional_title || userData?.title || "Freelancer";
  const posterImage = userData?.profile_image || userData?.profileImage || userData?.photoURL || userData?.profilePic || userData?.profile_pic || "";
  const completedProjects = userData?.completedProjects || 0;

  // Mock Data
  const mockPortfolio = [
    { title: "E-commerce App", color: "#F4F0FF", icon: "🛒", textColor: "#6C3EEB" },
    { title: "Dashboard UI", color: "#E8F1FF", icon: "📊", textColor: "#3E84F8" },
    { title: "Travel App", color: "#E8FBF0", icon: "✈️", textColor: "#15975A" },
    { title: "Fintech Design", color: "#FFF8E5", icon: "💰", textColor: "#B88E00" },
  ];

  const mockReviews = [
    {
      initials: "CS",
      name: "Creativo Studio",
      project: "Mobile App Project",
      review: "James delivered exceptional work. The design system was pixel-perfect and handoff was seamless.",
      rating: 5,
      color: "#6C3EEB"
    },
    {
      initials: "TS",
      name: "TechStart Inc.",
      project: "SaaS Dashboard",
      review: "Great communication and very professional. Would definitely hire again for our next project.",
      rating: 5,
      color: "#3E84F8"
    }
  ];

  const statProjects = completedProjects || 28;
  const statPerDay = budgetFrom ? `₹${formatAmount(budgetFrom)}` : '₹900';
  const statExp = "3yr";
  const statOnTime = "100%";

  const getSkillStyle = (skill) => {
    const themes = [
      { bg: "#F4F0FF", text: "#8A5CFF" }, // Purple
      { bg: "#E8F1FF", text: "#3E84F8" }, // Blue
      { bg: "#FFF0F3", text: "#FF5A79" }, // Pink
      { bg: "#FFF3EB", text: "#F88A3E" }, // Orange
      { bg: "#E8FBF0", text: "#15975A" }, // Green
      { bg: "#FFF8E5", text: "#B88E00" }, // Yellow
    ];
    return themes[skill.length % themes.length];
  };

  return (
    <div style={{ background: "#FCFBFF", minHeight: "100vh", padding: "32px 48px", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@600;700&display=swap" rel="stylesheet" />

      {/* Breadcrumb */}
      <div style={{ fontSize: "14px", color: "#8A8599", marginBottom: "24px", display: "flex", gap: "8px", alignItems: "center" }}>
        <span>Browse Talent</span>
        <span style={{ fontSize: "10px" }}>▶</span>
        <span style={{ color: "#1A1433", fontWeight: 600 }}>{posterFullName}</span>
      </div>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
        
        {/* LEFT COLUMN */}
        <div style={{ flex: "1 1 600px", background: "white", borderRadius: "16px", border: "1px solid #EBE5F2", padding: "40px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          
          {/* Header */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "32px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#8A5CFF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: 700, marginBottom: "16px", overflow: "hidden" }}>
              {posterImage ? (
                <img src={posterImage} alt={posterFullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                posterInitials
              )}
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1A1433", margin: "0 0 4px 0", fontFamily: "'Sora', sans-serif" }}>
              {posterFullName}
            </h1>
            <div style={{ fontSize: "15px", color: "#8A8599", marginBottom: "16px" }}>
              {professionalTitle}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ background: "#FFF8E5", color: "#B88E00", padding: "4px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                ⭐ 4.8
              </span>
              <span style={{ background: "#F4F0FF", color: "#8A5CFF", padding: "4px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: 700 }}>
                Top Rated
              </span>
              <span style={{ background: "#E8FBF0", color: "#15975A", padding: "4px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: 700 }}>
                Available
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "40px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#1A1433" }}>{statProjects}</div>
              <div style={{ fontSize: "13px", color: "#8A8599", marginTop: "4px" }}>Projects</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#1A1433" }}>{statPerDay}</div>
              <div style={{ fontSize: "13px", color: "#8A8599", marginTop: "4px" }}>Per Day</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#1A1433" }}>{statExp}</div>
              <div style={{ fontSize: "13px", color: "#8A8599", marginTop: "4px" }}>Exp.</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#1A1433" }}>{statOnTime}</div>
              <div style={{ fontSize: "13px", color: "#8A8599", marginTop: "4px" }}>On Time</div>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #EBE5F2", margin: "0 0 32px 0" }} />

          {/* About */}
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#8A8599", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>About</h2>
            <div style={{ fontSize: "14px", color: "#6B6B8A", lineHeight: "1.6" }}>
              {description || "3+ years designing mobile and web products for startups and mid-size companies. Passionate about user-centered design, accessibility, and clean interactions. I specialize in creating design systems and building Figma component libraries that scale."}
            </div>
          </div>

          {/* Skills & Tools */}
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#8A8599", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Skills & Tools</h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(skills.length > 0 || tools.length > 0 ? [...skills, ...tools] : ["Figma", "Web Design", "UI Design", "Prototyping", "Adobe XD", "Sketch", "InVision", "Design Systems"]).map((skill, idx) => {
                const style = getSkillStyle(skill);
                return (
                  <span key={idx} style={{ background: style.bg, color: style.text, padding: "6px 14px", borderRadius: "16px", fontSize: "12px", fontWeight: 700 }}>
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Portfolio */}
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#8A8599", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Portfolio</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
              {mockPortfolio.map((item, idx) => (
                <div key={idx} style={{ background: item.color, borderRadius: "12px", padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: item.textColor, fontWeight: 600, fontSize: "14px", cursor: "pointer", transition: "transform 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <span>{item.icon}</span> {item.title}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#8A8599", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Recent Reviews</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {mockReviews.map((rev, idx) => (
                <div key={idx} style={{ background: "#FCFBFF", borderRadius: "12px", padding: "24px", border: "1px solid #EBE5F2" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: rev.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>
                        {rev.initials}
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#1A1433" }}>{rev.name}</div>
                        <div style={{ fontSize: "12px", color: "#8A8599" }}>{rev.project}</div>
                      </div>
                    </div>
                    <div style={{ color: "#FFB800", fontSize: "12px", letterSpacing: "2px" }}>
                      {"★".repeat(rev.rating)}
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", color: "#6B6B8A", lineHeight: "1.5" }}>
                    {rev.review}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (STICKY) */}
        <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "24px", position: "sticky", top: "24px" }}>
          
          {/* Hire Card */}
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #EBE5F2", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "32px", fontWeight: 700, color: "#1A1433", fontFamily: "'Sora', sans-serif" }}>{statPerDay}</div>
              <div style={{ fontSize: "13px", color: "#8A8599" }}>per day</div>
            </div>
            
            <button style={{ width: "100%", background: "linear-gradient(90deg, #6C3EEB 0%, #8A5CFF 100%)", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer", marginBottom: "12px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
              Hire {posterFirstName || "James"} →
            </button>
            
            <button style={{ width: "100%", background: "white", color: "#6C3EEB", border: "1px solid #6C3EEB", padding: "14px", borderRadius: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer", marginBottom: "24px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
              💬 Message
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "13px", color: "#6B6B8A" }}>
                <span>⚡</span> Responds within 2 hours
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "13px", color: "#6B6B8A" }}>
                <span>📅</span> Available from Jan 20
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "13px", color: "#6B6B8A" }}>
                <span>🌍</span> Open to remote work
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "13px", color: "#6B6B8A" }}>
                <span style={{ background: "#E8FBF0", color: "#15975A", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✓</span> 
                {statProjects} successful projects
              </div>
            </div>
          </div>

          {/* Share Card */}
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #EBE5F2", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1A1433", margin: "0 0 16px 0" }}>Share Profile</h3>
            <button onClick={shareService} style={{ width: "100%", background: "#FCFBFF", color: "#1A1433", border: "1px solid #EBE5F2", padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              🔗 Copy profile link
            </button>
            <button style={{ width: "100%", background: "#FCFBFF", color: "#1A1433", border: "1px solid #EBE5F2", padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              ✉️ Send via email
            </button>
          </div>

        </div>

      </div>

      <Snackbar message={snack.msg} color={snack.color} onDone={() => setSnack({ msg: "", color: "#333" })} />
    </div>
  );
}

// ─── Info Column ───────────────────────────────────────────────────────────────
function InfoColumn({ label, value, valueColor = "#1A1A1A" }) {
  return (
    <div>
      <div style={{ fontSize: 15, color: "#555", marginBottom: 8, fontFamily: "Rubik, sans-serif" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: valueColor, fontFamily: "Rubik, sans-serif" }}>{value}</div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const iconBtn = {
  background: "none", border: "none", cursor: "pointer", padding: 4,
  display: "flex", alignItems: "center", justifyContent: "center",
};