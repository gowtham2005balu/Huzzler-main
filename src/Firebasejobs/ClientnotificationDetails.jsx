// // ClientnotificationDetails.jsx
// // Full web equivalent of fullDetial.dart — works standalone via route
// // AND is used as an embedded drawer inside ClientHomePage.jsx

// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import {
//   doc,
//   getDoc,
//   getDocs,
//   addDoc,
//   updateDoc,
//   collection,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   serverTimestamp,
//   limit,
// } from "firebase/firestore";
// import { db, auth } from "../firbase/Firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { FiChevronLeft, FiExternalLink } from "react-icons/fi";

// // ──────────────────────────────────────────────────────────────────────────────
// //  HELPERS
// // ──────────────────────────────────────────────────────────────────────────────

// function extractList(data) {
//   if (Array.isArray(data)) return data.map(String);
//   return [];
// }

// function capitalize(str) {
//   if (!str) return str;
//   return str[0].toUpperCase() + str.slice(1);
// }

// async function fetchJobTitle(jobId) {
//   if (!jobId) return "Job Application";
//   try {
//     const jDoc = await getDoc(doc(db, "jobs", jobId));
//     if (jDoc.exists() && jDoc.data()?.title?.trim()) return jDoc.data().title;
//     const j24 = await getDoc(doc(db, "jobs_24h", jobId));
//     if (j24.exists() && j24.data()?.title?.trim()) return j24.data().title;
//   } catch (_) {}
//   return "Job Application";
// }

// async function fetchFreelancerMeta(freelancerId) {
//   try {
//     const uDoc = await getDoc(doc(db, "users", freelancerId));
//     if (uDoc.exists()) {
//       const d = uDoc.data();
//       return {
//         name: `${d.firstName || ""} ${d.lastName || ""}`.trim() || "Freelancer",
//         image: d.profileImage || "",
//       };
//     }
//   } catch (_) {}
//   return { name: "Freelancer", image: "" };
// }

// // ──────────────────────────────────────────────────────────────────────────────
// //  MAIN COMPONENT
// // ──────────────────────────────────────────────────────────────────────────────

// /**
//  * Props (when used as embedded drawer from ClientHomePage):
//  *   userId, jobId, onClose, onChatOpen
//  *
//  * Route params (when used standalone at /client-dashbroad2/freelancer/:userId):
//  *   useParams() → { userId }
//  *   useLocation().state → { jobId }
//  */
// export default function FullDetailScreen({
//   userId: propUserId,
//   jobId: propJobId,
//   onClose,
//   onChatOpen,
// }) {
//   const { userId: paramUserId, jobId: paramJobId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const userId = propUserId || paramUserId;
//   const jobId = propJobId || paramJobId || location?.state?.jobId || null;

//   // ── State ──────────────────────────────────────────────────────────────────
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAccepted, setIsAccepted] = useState(false);
//   const [portfolio, setPortfolio] = useState([]);
//   const [services, setServices] = useState([]);
//   const [services24h, setServices24h] = useState([]);
//   const [activeTab, setActiveTab] = useState("work");
//   const [accepting, setAccepting] = useState(false);
//   const [declining, setDeclining] = useState(false);
//   const [snack, setSnack] = useState(null); // { msg, color }
//   const [clientJobs, setClientJobs] = useState([]);
//   const [collabOpen, setCollabOpen] = useState(false);

//   // ── Snackbar ───────────────────────────────────────────────────────────────
//   function showSnack(msg, color = "#16a34a") {
//     setSnack({ msg, color });
//     setTimeout(() => setSnack(null), 3000);
//   }

//   // ── Data fetch ─────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!userId) return;

//     // Live user profile
//     const unsubUser = onSnapshot(doc(db, "users", userId), (snap) => {
//       if (snap.exists()) setUserData(snap.data());
//       setLoading(false);
//     });

//     // Portfolio
//     const unsubPortfolio = onSnapshot(
//       collection(db, "users", userId, "portfolio"),
//       (snap) => setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );

//     // Services
//     const tryService = (colName, setter) => {
//       try {
//         return onSnapshot(
//           query(
//             collection(db, "users", userId, colName),
//             orderBy("createdAt", "desc")
//           ),
//           (snap) => setter(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//         );
//       } catch {
//         return () => {};
//       }
//     };

//     const unsubSvc = tryService("services", setServices);
//     const unsubSvc24 = tryService("services_24h", setServices24h);

//     // Check already accepted
//     (async () => {
//       if (!jobId || !userId) return;
//       try {
//         const q = query(
//           collection(db, "notifications"),
//           where("jobId", "==", jobId),
//           where("freelancerId", "==", userId),
//           where("status", "==", "accepted"),
//           limit(1)
//         );
//         const snap = await getDocs(q);
//         if (!snap.empty) setIsAccepted(true);
//       } catch (_) {}
//     })();

//     return () => {
//       unsubUser();
//       unsubPortfolio();
//       unsubSvc();
//       unsubSvc24();
//     };
//   }, [userId, jobId]);

//   // ── Fetch client jobs for collaboration popup ──────────────────────────────
//   async function loadClientJobs() {
//     const uid = auth.currentUser?.uid;
//     if (!uid) return [];
//     const all = [];
//     try {
//       const [snap1, snap2] = await Promise.all([
//         getDocs(
//           query(collection(db, "jobs"), where("userId", "==", uid))
//         ),
//         getDocs(
//           query(collection(db, "jobs_24h"), where("userId", "==", uid))
//         ),
//       ]);
//       snap1.docs.forEach((d) =>
//         all.push({ ...d.data(), id: d.id, type: "services" })
//       );
//       snap2.docs.forEach((d) =>
//         all.push({ ...d.data(), id: d.id, type: "services_24h" })
//       );
//     } catch (e) {
//       console.error("loadClientJobs:", e);
//     }
//     setClientJobs(all);
//     return all;
//   }

//   // ── Accept ─────────────────────────────────────────────────────────────────
//   async function handleAccept() {
//     if (accepting || !jobId || !userId) return;
//     setAccepting(true);
//     try {
//       const q = query(
//         collection(db, "notifications"),
//         where("jobId", "==", jobId),
//         where("freelancerId", "==", userId),
//         limit(1)
//       );
//       const snap = await getDocs(q);
//       if (snap.empty) {
//         showSnack("No matching application found.", "#f97316");
//         setAccepting(false);
//         return;
//       }

//       await updateDoc(snap.docs[0].reference, {
//         status: "accepted",
//         read: true,
//       });

//       const { name: freelancerName, image: freelancerImage } =
//         await fetchFreelancerMeta(userId);
//       const jobTitle = await fetchJobTitle(jobId);

//       // accepted_jobs
//       await addDoc(collection(db, "accepted_jobs"), {
//         jobId,
//         freelancerId: userId,
//         freelancerName,
//         freelancerImage,
//         acceptedAt: serverTimestamp(),
//         status: "accepted",
//       });

//       // freelancer_notifications
//       await addDoc(collection(db, "freelancer_notifications"), {
//         freelancerId: userId,
//         freelancerName,
//         freelancerAvatar: freelancerImage,
//         jobId,
//         jobTitle,
//         status: "accepted",
//         createdAt: serverTimestamp(),
//         isRead: false,
//       });

//       setIsAccepted(true);
//       showSnack("Freelancer accepted successfully ✅", "#16a34a");
//     } catch (e) {
//       console.error("handleAccept:", e);
//       showSnack("Error accepting application.", "#ef4444");
//     }
//     setAccepting(false);
//   }

//   // ── Decline ────────────────────────────────────────────────────────────────
//   async function handleDecline() {
//     const confirmed = window.confirm(
//       "Are you sure you want to decline this application?"
//     );
//     if (!confirmed) return;

//     setDeclining(true);
//     try {
//       if (!jobId || !userId) return;

//       const q = query(
//         collection(db, "notifications"),
//         where("jobId", "==", jobId),
//         where("freelancerId", "==", userId)
//       );
//       const snap = await getDocs(q);
//       for (const d of snap.docs) {
//         await updateDoc(doc(db, "notifications", d.id), {
//           status: "declined",
//           read: true,
//         });
//       }

//       const { name: freelancerName, image: freelancerImage } =
//         await fetchFreelancerMeta(userId);
//       const jobTitle = await fetchJobTitle(jobId);

//       await addDoc(collection(db, "freelancer_notifications"), {
//         freelancerId: userId,
//         freelancerName,
//         freelancerAvatar: freelancerImage,
//         jobId,
//         jobTitle,
//         status: "declined",
//         createdAt: serverTimestamp(),
//         isRead: false,
//       });

//       showSnack("Application declined ❌", "#ef4444");

//       // Go back after brief delay
//       setTimeout(() => {
//         if (onClose) onClose();
//         else navigate(-1);
//       }, 1500);
//     } catch (e) {
//       console.error("handleDecline:", e);
//       showSnack("Error declining application.", "#ef4444");
//     }
//     setDeclining(false);
//   }

//   // ── Open chat ──────────────────────────────────────────────────────────────
//   async function openChat() {
//     const currentUid = auth.currentUser?.uid;
//     if (!userData || !userId || !currentUid) return;

//     const name =
//       `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
//       "Freelancer";
//     const image = userData.profileImage || "";

//     if (onChatOpen) {
//       onChatOpen(userId, name, image);
//     } else {
//      navigate(`/chat/${currentUid}/${userId}`, {
//   state: {
//     currentUid,
//     otherUid: userId,
//     otherName: name,
//     otherImage: image,
//   },
// });
//     }
//   }

//   // ── Go back ────────────────────────────────────────────────────────────────
//   function goBack() {
//     if (onClose) onClose();
//     else navigate(-1);
//   }

//   // ── Collaboration popup ────────────────────────────────────────────────────
//   async function openCollabPopup() {
//     await loadClientJobs();
//     setCollabOpen(true);
//   }

//   // ──────────────────────────────────────────────────────────────────────────
//   //  RENDER
//   // ──────────────────────────────────────────────────────────────────────────

//   if (loading) {
//     return (
//       <div className="fds-page">
//         <div className="fds-center">
//           <div className="fds-spinner" />
//         </div>
//         <FdsStyles />
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div className="fds-page">
//         <div className="fds-center" style={{ flexDirection: "column", gap: 16 }}>
//           <span style={{ fontSize: 48 }}>⚠️</span>
//           <p className="fds-muted">User profile not found.</p>
//           <button className="fds-btn-yellow" onClick={goBack}>
//             Go Back
//           </button>
//         </div>
//         <FdsStyles />
//       </div>
//     );
//   }

//   const firstName = userData.firstName || "";
//   const lastName = userData.lastName || "";
//   const fullName = `${firstName} ${lastName}`.trim() || "User";
//   const about = userData.about || "";
//   const profileImage = userData.profileImage || "";
//   const coverImage = userData.coverImage || "";
//   const skills = extractList(userData.skills);
//   const tools = extractList(userData.tools);
//   const links = userData.links || {};

//   return (
//     <div className="fds-page">
//       <div className="fds-scroll">
//         {/* ── COVER ── */}
//         <div className="fds-cover-wrap">
//           <div
//             className="fds-cover"
//             style={{
//               backgroundImage: coverImage ? `url(${coverImage})` : undefined,
//             }}
//           >
//             <button className="fds-back-btn" onClick={goBack}>
//               <FiChevronLeft size={20} />
//             </button>
//           </div>

//           <div className="fds-avatar-row">
//             <div className="fds-avatar-wrap">
//               {profileImage ? (
//                 <img
//                   src={profileImage}
//                   alt={fullName}
//                   className="fds-avatar-img"
//                   onError={(e) => {
//                     e.target.style.display = "none";
//                   }}
//                 />
//               ) : (
//                 <div className="fds-avatar-placeholder">
//                   <span style={{ fontSize: 44, color: "#bbb" }}>👤</span>
//                 </div>
//               )}
//               <div className="fds-freelancer-badge">Freelancer</div>
//             </div>
//           </div>
//         </div>

//         {/* ── NAME + ACTIONS ── */}
//         <div className="fds-name-section">
//           <h2 className="fds-fullname">{fullName}</h2>

//           <div className="fds-action-row">
//             {isAccepted ? (
//               <button
//                 className="fds-btn-yellow fds-btn-full"
//                 onClick={openChat}
//               >
//                 💬 Message
//               </button>
//             ) : (
//               <>
//                 <button
//                   className="fds-btn-yellow"
//                   onClick={handleAccept}
//                   disabled={accepting}
//                   style={{ flex: 1 }}
//                 >
//                   {accepting ? "Accepting..." : "Accept"}
//                 </button>
//                 <button
//                   className="fds-btn-outline"
//                   onClick={handleDecline}
//                   disabled={declining}
//                   style={{ flex: 1 }}
//                 >
//                   {declining ? "Declining..." : "Decline"}
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Links */}
//           {Object.keys(links).length > 0 && (
//             <div className="fds-links-row">
//               {Object.entries(links)
//                 .filter(([, v]) => typeof v === "string" && v.trim())
//                 .map(([k, v]) => (
//                   <a
//                     key={k}
//                     href={v.startsWith("http") ? v : `https://${v}`}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="fds-link"
//                   >
//                     {capitalize(k)}
//                   </a>
//                 ))}
//             </div>
//           )}
//         </div>

//         {/* ── ABOUT ── */}
//         <div className="fds-section">
//           <h3 className="fds-section-title">About</h3>
//           <p className="fds-about-text">
//             {about || "No about info provided."}
//           </p>

//           {(skills.length > 0 || tools.length > 0) && (
//             <>
//               <h3 className="fds-section-title" style={{ marginTop: 24 }}>
//                 Skills & Tools
//               </h3>
//               <div className="fds-chips-wrap">
//                 {[...skills, ...tools].map((s, i) => (
//                   <span key={i} className={`fds-chip fds-chip-${i % 14}`}>
//                     {s}
//                   </span>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* ── PORTFOLIO ── */}
//         <div className="fds-section">
//           <h3 className="fds-section-title">Portfolio</h3>
//           {portfolio.length === 0 ? (
//             <p className="fds-muted">No portfolio items yet.</p>
//           ) : (
//             <div className="fds-portfolio-scroll">
//               {portfolio.map((p) => (
//                 <PortfolioCard key={p.id} item={p} />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ── SERVICES TABS ── */}
//         <div className="fds-section fds-section-pb">
//           <div className="fds-tabs">
//             <button
//               className={`fds-tab ${activeTab === "work" ? "fds-tab-active" : ""}`}
//               onClick={() => setActiveTab("work")}
//             >
//               Work
//             </button>
//             <button
//               className={`fds-tab ${activeTab === "24h" ? "fds-tab-active" : ""}`}
//               onClick={() => setActiveTab("24h")}
//             >
//               24 Hour
//             </button>
//           </div>

//           <div className="fds-services-list">
//             {(activeTab === "work" ? services : services24h).length === 0 ? (
//               <div className="fds-empty-state">
//                 <span style={{ fontSize: 48 }}>💼</span>
//                 <p className="fds-muted">No services added yet.</p>
//               </div>
//             ) : (
//               (activeTab === "work" ? services : services24h).map((svc) => (
//                 <ServiceCard key={svc.id} service={svc} />
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── SNACKBAR ── */}
//       {snack && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 32,
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: snack.color,
//             color: "#fff",
//             padding: "12px 28px",
//             borderRadius: 10,
//             fontFamily: "Rubik, sans-serif",
//             fontSize: 14,
//             fontWeight: 500,
//             boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
//             zIndex: 99999,
//             whiteSpace: "nowrap",
//             animation: "fds-snack-in 0.3s ease",
//           }}
//         >
//           {snack.msg}
//         </div>
//       )}

//       {/* ── COLLABORATION POPUP ── */}
//       {collabOpen && (
//         <CollaborationPopup
//           clientJobs={clientJobs}
//           receiverId={userId}
//           receiverName={fullName}
//           receiverImage={profileImage}
//           onClose={() => setCollabOpen(false)}
//           onSuccess={(chatState) => {
//             setCollabOpen(false);
//             if (onChatOpen) {
//               onChatOpen(
//                 chatState.otherUid,
//                 chatState.otherName,
//                 chatState.otherImage
//               );
//             } else {
//               navigate("/client-dashbroad2/chat", { state: chatState });
//             }
//           }}
//           showSnack={showSnack}
//         />
//       )}

//       <FdsStyles />
//     </div>
//   );
// }

// // ──────────────────────────────────────────────────────────────────────────────
// //  PORTFOLIO CARD
// // ──────────────────────────────────────────────────────────────────────────────
// function PortfolioCard({ item }) {
//   const title = item.title || "Untitled";
//   const description = item.description || "";
//   const imageUrl = item.imageUrl || "";
//   const projectUrl = item.projectUrl || "";
//   const all = [...extractList(item.skills), ...extractList(item.tools)];

//   return (
//     <div
//       className="fds-portfolio-card"
//       onClick={() => {
//         if (projectUrl) {
//           const url = projectUrl.startsWith("http")
//             ? projectUrl
//             : `https://${projectUrl}`;
//           window.open(url, "_blank");
//         }
//       }}
//       style={{ cursor: projectUrl ? "pointer" : "default" }}
//     >
//       <img
//         src={
//           imageUrl ||
//           "https://via.placeholder.com/120x140?text=Portfolio"
//         }
//         alt={title}
//         className="fds-portfolio-thumb"
//         onError={(e) => {
//           e.target.src =
//             "https://via.placeholder.com/120x140?text=Portfolio";
//         }}
//       />
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <p className="fds-portfolio-title">{title}</p>
//         <p className="fds-portfolio-desc">{description}</p>
//         {all.length > 0 && (
//           <div className="fds-chips-wrap" style={{ marginTop: 8 }}>
//             {all.slice(0, 4).map((s, i) => (
//               <span key={i} className="fds-yellow-chip">
//                 {s}
//               </span>
//             ))}
//           </div>
//         )}
//         {projectUrl && (
//           <div
//             style={{
//               marginTop: 10,
//               display: "flex",
//               alignItems: "center",
//               gap: 4,
//               color: "#2563eb",
//               fontSize: 12,
//               fontFamily: "Rubik, sans-serif",
//             }}
//           >
//             <FiExternalLink size={12} /> View Project
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ──────────────────────────────────────────────────────────────────────────────
// //  SERVICE CARD
// // ──────────────────────────────────────────────────────────────────────────────
// function ServiceCard({ service }) {
//   const all = [
//     ...extractList(service.skills),
//     ...extractList(service.tools),
//   ];
//   const visible = all.slice(0, 4);
//   const extra = all.length - visible.length;

//   return (
//     <div className="fds-service-card">
//       <div className="fds-service-header">
//         <span className="fds-service-title">
//           {service.title || ""}
//         </span>
//         <span className="fds-service-budget">
//           ₹ {service.budget_from || "0"}/per day
//         </span>
//       </div>

//       <p className="fds-skills-label">Skills Required</p>

//       <div className="fds-chips-wrap" style={{ marginBottom: 14 }}>
//         {visible.map((s, i) => (
//           <span key={i} className="fds-yellow-chip-lg">
//             {s}
//           </span>
//         ))}
//         {extra > 0 && (
//           <span className="fds-yellow-chip-lg fds-chip-extra">
//             {extra}+
//           </span>
//         )}
//       </div>

//       <p className="fds-service-desc">{service.description || ""}</p>
//     </div>
//   );
// }

// // ──────────────────────────────────────────────────────────────────────────────
// //  COLLABORATION POPUP  (mirrors _showCollaborationPopup in Flutter)
// // ──────────────────────────────────────────────────────────────────────────────
// function CollaborationPopup({
//   clientJobs,
//   receiverId,
//   receiverName,
//   receiverImage,
//   onClose,
//   onSuccess,
//   showSnack,
// }) {
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   async function handleSubmit() {
//     if (!title.trim()) return;
//     setSubmitting(true);
//     try {
//       const currentUid = auth.currentUser?.uid;
//       if (!currentUid) {
//         showSnack("User not logged in.", "#ef4444");
//         setSubmitting(false);
//         return;
//       }

//       // Save collaboration request
//       await addDoc(collection(db, "collaboration_requests"), {
//         clientId: currentUid,
//         freelancerId: receiverId,
//         title: title.trim(),
//         description: desc.trim(),
//         status: "sent",
//         timestamp: serverTimestamp(),
//         ...(selectedJob?.id ? { jobId: selectedJob.id } : {}),
//         ...(selectedJob?.type ? { jobType: selectedJob.type } : {}),
//       });

//       let initialMessage = `Collaboration request: ${title.trim()}\nDescription: ${desc.trim()}`;

//       // If a job is selected, build HUZZLER_JOB_DATA payload
//       if (selectedJob?.id && selectedJob?.type) {
//         const col =
//           selectedJob.type === "services" ? "jobs" : "jobs_24h";
//         const jobDoc = await getDoc(doc(db, col, selectedJob.id));
//         if (jobDoc.exists()) {
//           const jd = jobDoc.data();
//           const payload = {
//             id: selectedJob.id,
//             title: jd.title?.toString() ?? "Untitled",
//             description: jd.description?.toString() ?? "",
//             category: jd.category?.toString() ?? "General",
//             sub_category: jd.sub_category?.toString() ?? "",
//             budget_from: jd.budget_from?.toString() ?? "",
//             budget_to: jd.budget_to?.toString() ?? "",
//             price: jd.price?.toString() ?? "",
//             skills: Array.isArray(jd.skills) ? jd.skills : [],
//             is24h: jd.is24h === true,
//           };
//           initialMessage = `HUZZLER_JOB_DATA:${JSON.stringify(payload)}`;
//         }
//       }

//       onSuccess({
//         currentUid,
//         otherUid: receiverId,
//         otherName: receiverName,
//         otherImage: receiverImage,
//         initialMessage,
//       });

//       showSnack("Request sent successfully! ✅", "#16a34a");
//     } catch (e) {
//       console.error("handleSubmit collab:", e);
//       showSnack("Error sending request.", "#ef4444");
//     }
//     setSubmitting(false);
//   }

//   return (
//     <>
//       <div
//         onClick={onClose}
//         style={{
//           position: "fixed",
//           inset: 0,
//           background: "rgba(0,0,0,0.5)",
//           zIndex: 20000,
//         }}
//       />
//       <div
//         style={{
//           position: "fixed",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: "min(92vw, 480px)",
//           maxHeight: "80vh",
//           background: "#FFFDE1",
//           borderRadius: 24,
//           boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
//           padding: 24,
//           zIndex: 20001,
//           display: "flex",
//           flexDirection: "column",
//           gap: 14,
//           overflowY: "auto",
//         }}
//       >
//         <h3
//           style={{
//             margin: 0,
//             fontFamily: "Rubik, sans-serif",
//             fontSize: 20,
//             fontWeight: 600,
//           }}
//         >
//           Collaborate and Turn Ideas into Reality!
//         </h3>

//         {/* Job dropdown */}
//         <select
//           className="fds-input"
//           value={selectedJob?.id || ""}
//           onChange={(e) => {
//             const found = clientJobs.find((j) => j.id === e.target.value);
//             setSelectedJob(found || null);
//             setTitle(found?.title || "");
//           }}
//         >
//           <option value="">Select a Service</option>
//           {clientJobs.map((j) => (
//             <option key={j.id} value={j.id}>
//               {j.title || "Untitled"}
//             </option>
//           ))}
//         </select>

//         <input
//           className="fds-input"
//           placeholder="Project Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <textarea
//           className="fds-input"
//           placeholder="Project Description"
//           value={desc}
//           onChange={(e) => setDesc(e.target.value)}
//           rows={5}
//           style={{ resize: "vertical" }}
//         />

//         <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
//           <button
//             className="fds-btn-yellow"
//             onClick={handleSubmit}
//             disabled={!title.trim() || submitting}
//             style={{ padding: "12px 32px", borderRadius: 24 }}
//           >
//             {submitting ? "Sending..." : "Submit"}
//           </button>
//           <button
//             onClick={onClose}
//             style={{
//               padding: "12px 32px",
//               borderRadius: 24,
//               border: "1px solid #ccc",
//               background: "#fff",
//               cursor: "pointer",
//               fontFamily: "Rubik, sans-serif",
//               fontWeight: 600,
//             }}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// // ──────────────────────────────────────────────────────────────────────────────
// //  STYLES
// // ──────────────────────────────────────────────────────────────────────────────
// function FdsStyles() {
//   return (
//     <style>{`
// /* ── PAGE LAYOUT ── */
// .fds-page {
//   position: relative;
//   min-height: 100vh;
//   background: #f5f5f5;
//   font-family: Rubik, sans-serif;
// }
// .fds-center {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: 80vh;
// }
// .fds-spinner {
//   width: 44px; height: 44px;
//   border: 3px solid #eee;
//   border-top-color: #9050FF;
//   border-radius: 50%;
//   animation: fds-spin 0.8s linear infinite;
// }
// @keyframes fds-spin { to { transform: rotate(360deg); } }
// @keyframes fds-snack-in {
//   from { opacity: 0; transform: translateX(-50%) translateY(10px); }
//   to   { opacity: 1; transform: translateX(-50%) translateY(0); }
// }

// /* ── SCROLL CONTAINER ── */
// .fds-scroll {
//   max-width: 800px;
//   margin: 0 auto;
//   min-height: 100vh;
//   background: #f5f5f5;
// }

// /* ── COVER ── */
// .fds-cover-wrap { position: relative; }
// .fds-cover {
//   height: 220px;
//   width: 100%;
//   background: linear-gradient(135deg, #e0e7ff 0%, #fef9c3 100%);
//   background-size: cover;
//   background-position: center;
// }
// .fds-back-btn {
//   position: absolute;
//   top: 18px; left: 16px;
//   width: 38px; height: 38px;
//   border-radius: 50%; border: none;
//   background: rgba(0,0,0,0.35);
//   color: #fff; cursor: pointer;
//   display: flex; align-items: center; justify-content: center;
//   transition: background 0.2s;
// }
// .fds-back-btn:hover { background: rgba(0,0,0,0.55); }
// .fds-avatar-row {
//   display: flex;
//   justify-content: center;
//   margin-top: -55px;
// }
// .fds-avatar-wrap {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   position: relative;
// }
// .fds-avatar-img {
//   width: 110px; height: 110px;
//   border-radius: 50%;
//   object-fit: cover;
//   border: 5px solid #fff;
//   box-shadow: 0 10px 30px rgba(0,0,0,0.15);
// }
// .fds-avatar-placeholder {
//   width: 110px; height: 110px;
//   border-radius: 50%;
//   background: #eee;
//   border: 5px solid #fff;
//   display: flex; align-items: center; justify-content: center;
//   box-shadow: 0 10px 30px rgba(0,0,0,0.12);
// }
// .fds-freelancer-badge {
//   margin-top: -14px;
//   padding: 5px 16px;
//   background: linear-gradient(90deg, #0047FF, #00E5FF);
//   color: #fff;
//   border-radius: 24px;
//   font-size: 12px;
//   border: 3px solid #fff;
//   white-space: nowrap;
// }

// /* ── NAME SECTION ── */
// .fds-name-section {
//   background: #fff;
//   padding: 20px 20px 28px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 18px;
//   border-bottom: 8px solid #f3f3f3;
// }
// .fds-fullname {
//   font-size: 22px;
//   font-weight: 500;
//   color: #111;
//   margin: 0;
//   text-align: center;
// }
// .fds-action-row {
//   display: flex;
//   gap: 14px;
//   width: 100%;
//   max-width: 420px;
// }
// .fds-btn-yellow {
//   padding: 13px 24px;
//   border-radius: 30px;
//   border: none;
//   background: #FDFD96;
//   color: #111;
//   font-weight: 600;
//   font-size: 14px;
//   cursor: pointer;
//   font-family: Rubik, sans-serif;
//   transition: opacity 0.2s;
// }
// .fds-btn-yellow:hover:not(:disabled) { opacity: 0.85; }
// .fds-btn-yellow:disabled { opacity: 0.5; cursor: not-allowed; }
// .fds-btn-yellow.fds-btn-full { width: 100%; }
// .fds-btn-outline {
//   padding: 13px 24px;
//   border-radius: 30px;
//   border: 1.5px solid #111;
//   background: #fff;
//   color: #111;
//   font-weight: 600;
//   font-size: 14px;
//   cursor: pointer;
//   font-family: Rubik, sans-serif;
//   transition: background 0.2s;
// }
// .fds-btn-outline:hover:not(:disabled) { background: #f8f8f8; }
// .fds-btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }

// .fds-links-row { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
// .fds-link {
//   font-size: 15px;
//   font-weight: 500;
//   color: #2563eb;
//   text-decoration: underline;
// }
// .fds-link:hover { color: #1d4ed8; }

// /* ── SECTIONS ── */
// .fds-section {
//   background: #fff;
//   margin-top: 8px;
//   padding: 20px 20px;
// }
// .fds-section-pb { padding-bottom: 48px; }
// .fds-section-title {
//   font-size: 18px;
//   font-weight: 500;
//   color: #111;
//   margin: 0 0 12px;
// }
// .fds-about-text {
//   font-size: 14px;
//   line-height: 1.65;
//   color: #222;
//   margin: 0;
// }
// .fds-muted { font-size: 14px; color: #888; margin: 0; }

// /* ── CHIPS ── */
// .fds-chips-wrap { display: flex; flex-wrap: wrap; gap: 10px; }
// .fds-chip {
//   padding: 8px 14px;
//   border-radius: 24px;
//   font-size: 13px;
//   color: #222;
// }
// .fds-chip-0  { background: #FFD6C9; }
// .fds-chip-1  { background: #D7F5FF; }
// .fds-chip-2  { background: #EAD9FF; }
// .fds-chip-3  { background: #D9FFE3; }
// .fds-chip-4  { background: #E3F0FF; }
// .fds-chip-5  { background: #FFD9E0; }
// .fds-chip-6  { background: #FFF3C4; }
// .fds-chip-7  { background: #E8F5E9; }
// .fds-chip-8  { background: #F3E5F5; }
// .fds-chip-9  { background: #E1F5FE; }
// .fds-chip-10 { background: #FFEBEE; }
// .fds-chip-11 { background: #F1F8E9; }
// .fds-chip-12 { background: #E0F2F1; }
// .fds-chip-13 { background: #FFFDE7; }
// .fds-yellow-chip {
//   background: #FFF7C2;
//   padding: 4px 10px;
//   border-radius: 12px;
//   font-size: 11px;
// }
// .fds-yellow-chip-lg {
//   background: #FFFFBE;
//   padding: 6px 12px;
//   border-radius: 20px;
//   font-size: 13px;
//   font-weight: 500;
// }
// .fds-chip-extra { background: #FFFFA8; }

// /* ── PORTFOLIO ── */
// .fds-portfolio-scroll {
//   display: flex;
//   gap: 16px;
//   overflow-x: auto;
//   padding-bottom: 8px;
//   scrollbar-width: none;
// }
// .fds-portfolio-scroll::-webkit-scrollbar { display: none; }
// .fds-portfolio-card {
//   flex-shrink: 0;
//   width: 320px;
//   border: 1px solid #e5e7eb;
//   border-radius: 16px;
//   background: #fff;
//   padding: 14px;
//   gap: 14px;
//   display: flex;
//   align-items: flex-start;
// }
// .fds-portfolio-thumb {
//   width: 110px;
//   height: 130px;
//   border-radius: 8px;
//   object-fit: cover;
//   flex-shrink: 0;
// }
// .fds-portfolio-title {
//   margin: 0 0 6px;
//   font-weight: 600;
//   font-size: 15px;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }
// .fds-portfolio-desc {
//   margin: 0;
//   font-size: 13px;
//   color: #555;
//   display: -webkit-box;
//   -webkit-line-clamp: 3;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// }

// /* ── SERVICES TABS ── */
// .fds-tabs {
//   display: flex;
//   margin-bottom: 16px;
//   border-bottom: 2px solid #eee;
// }
// .fds-tab {
//   padding: 10px 28px;
//   background: none;
//   border: none;
//   border-bottom: 6px solid transparent;
//   font-size: 16px;
//   font-weight: 500;
//   color: #888;
//   cursor: pointer;
//   margin-bottom: -2px;
//   transition: all 0.2s;
// }
// .fds-tab-active { color: #111; border-bottom-color: #FFFFA8; }
// .fds-services-list { display: flex; flex-direction: column; gap: 4px; }
// .fds-empty-state {
//   display: flex; flex-direction: column; align-items: center;
//   gap: 12px; padding: 48px;
// }

// /* ── SERVICE CARD ── */
// .fds-service-card {
//   background: #FFFFEA;
//   border-radius: 24px;
//   border: 1px solid #CECECE;
//   padding: 20px 20px 22px;
//   margin-bottom: 4px;
// }
// .fds-service-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   gap: 12px;
// }
// .fds-service-title {
//   font-size: 16px;
//   font-weight: 500;
//   flex: 1;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }
// .fds-service-budget {
//   font-size: 14px;
//   font-weight: 500;
//   white-space: nowrap;
// }
// .fds-skills-label {
//   margin: 14px 0 10px;
//   font-size: 10px;
//   color: #888;
// }
// .fds-service-desc {
//   margin: 0;
//   font-size: 12px;
//   line-height: 1.6;
//   color: #333;
//   display: -webkit-box;
//   -webkit-line-clamp: 3;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// }

// /* ── COLLAB INPUT ── */
// .fds-input {
//   width: 100%;
//   padding: 12px 14px;
//   border: none;
//   border-radius: 14px;
//   background: #fff;
//   font-size: 14px;
//   font-family: Rubik, sans-serif;
//   outline: none;
//   box-sizing: border-box;
//   color: #111;
// }
// .fds-input::placeholder { color: #aaa; }

// /* ── RESPONSIVE ── */
// @media (max-width: 600px) {
//   .fds-cover { height: 160px; }
//   .fds-section { padding: 16px; }
//   .fds-portfolio-card { width: 260px; }
// }
//     `}</style>
//   );
// }



// ClientNotificationDetails.jsx
// Full web equivalent of fullDetail.dart — works standalone via route
// AND is used as an embedded drawer inside ClientHomePage.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db, auth } from "../firbase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { FiChevronLeft, FiExternalLink, FiMessageSquare, FiCheck, FiX, FiLink } from "react-icons/fi";

// ──────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ──────────────────────────────────────────────────────────────────────────────

function extractList(data) {
  if (Array.isArray(data)) return data.map(String);
  return [];
}

function capitalize(str) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

async function fetchJobTitle(jobId) {
  if (!jobId) return "Job Application";
  try {
    const jDoc = await getDoc(doc(db, "jobs", jobId));
    if (jDoc.exists() && jDoc.data()?.title?.trim()) return jDoc.data().title;
    const j24 = await getDoc(doc(db, "jobs_24h", jobId));
    if (j24.exists() && j24.data()?.title?.trim()) return j24.data().title;
  } catch (_) {}
  return "Job Application";
}

async function fetchFreelancerMeta(freelancerId) {
  try {
    const uDoc = await getDoc(doc(db, "users", freelancerId));
    if (uDoc.exists()) {
      const d = uDoc.data();
      const fn = d?.first_name || d?.firstName || d?.name || "";
      const ln = d?.last_name || d?.lastName || "";
      const fullName = `${fn} ${ln}`.trim() || "Freelancer";
      const pImage = d?.profileImage || d?.profile_pic || d?.imageUrl || d?.photoURL || "";
      return {
        name: fullName,
        image: pImage,
      };
    }
  } catch (_) {}
  return { name: "Freelancer", image: "" };
}

// ──────────────────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Props (when used as embedded drawer from ClientHomePage):
 *   userId, jobId, onClose, onChatOpen
 *
 * Route params (when used standalone at /client-dashbroad2/freelancer/:userId):
 *   useParams() → { userId }
 *   useLocation().state → { jobId }
 */
export default function FullDetailScreen({
  userId: propUserId,
  jobId: propJobId,
  onClose,
  onChatOpen,
}) {
  const { userId: paramUserId, jobId: paramJobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const userId = propUserId || paramUserId;
  const jobId = propJobId || paramJobId || location?.state?.jobId || null;

  // ── State ──────────────────────────────────────────────────────────────────
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [services24h, setServices24h] = useState([]);
  const [activeTab, setActiveTab] = useState("work");
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [snack, setSnack] = useState(null);
  const [clientJobs, setClientJobs] = useState([]);
  const [collabOpen, setCollabOpen] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);

  // ── Snackbar ───────────────────────────────────────────────────────────────
  function showSnack(msg, color = "#16a34a") {
    setSnack({ msg, color });
    setTimeout(() => setSnack(null), 3000);
  }

  // ── Data fetch ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    const unsubUser = onSnapshot(doc(db, "users", userId), (snap) => {
      if (snap.exists()) setUserData(snap.data());
      setLoading(false);
    });

    const unsubPortfolio = onSnapshot(
      collection(db, "users", userId, "portfolio"),
      (snap) => setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const tryService = (colName, setter) => {
      try {
        return onSnapshot(
          query(
            collection(db, "users", userId, colName),
            orderBy("createdAt", "desc")
          ),
          (snap) => setter(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        );
      } catch {
        return () => {};
      }
    };

    const unsubSvc = tryService("services", setServices);
    const unsubSvc24 = tryService("services_24h", setServices24h);

    (async () => {
      if (!jobId || !userId) return;
      try {
        const q = query(
          collection(db, "notifications"),
          where("jobId", "==", jobId),
          where("freelancerId", "==", userId),
          where("status", "==", "accepted"),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) setIsAccepted(true);
      } catch (_) {}
    })();

    return () => {
      unsubUser();
      unsubPortfolio();
      unsubSvc();
      unsubSvc24();
    };
  }, [userId, jobId]);

  // ── Fetch client jobs for collaboration popup ──────────────────────────────
  async function loadClientJobs() {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    const all = [];
    try {
      const [snap1, snap2] = await Promise.all([
        getDocs(query(collection(db, "jobs"), where("userId", "==", uid))),
        getDocs(query(collection(db, "jobs_24h"), where("userId", "==", uid))),
      ]);
      snap1.docs.forEach((d) => all.push({ ...d.data(), id: d.id, type: "services" }));
      snap2.docs.forEach((d) => all.push({ ...d.data(), id: d.id, type: "services_24h" }));
    } catch (e) {
      console.error("loadClientJobs:", e);
    }
    setClientJobs(all);
    return all;
  }

  // ── Accept ─────────────────────────────────────────────────────────────────
  async function handleAccept() {
    if (accepting || !jobId || !userId) return;
    setAccepting(true);
    try {
      const q = query(
        collection(db, "notifications"),
        where("jobId", "==", jobId),
        where("freelancerId", "==", userId),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        showSnack("No matching application found.", "#f97316");
        setAccepting(false);
        return;
      }

      await updateDoc(snap.docs[0].reference, { status: "accepted", read: true });

      const { name: freelancerName, image: freelancerImage } = await fetchFreelancerMeta(userId);
      const jobTitle = await fetchJobTitle(jobId);

      await addDoc(collection(db, "accepted_jobs"), {
        jobId,
        freelancerId: userId,
        freelancerName,
        freelancerImage,
        acceptedAt: serverTimestamp(),
        status: "accepted",
      });

      await addDoc(collection(db, "freelancer_notifications"), {
        freelancerId: userId,
        freelancerName,
        freelancerAvatar: freelancerImage,
        jobId,
        jobTitle,
        status: "accepted",
        createdAt: serverTimestamp(),
        isRead: false,
      });

      setIsAccepted(true);
      showSnack("Freelancer accepted successfully ✅", "#16a34a");
    } catch (e) {
      console.error("handleAccept:", e);
      showSnack("Error accepting application.", "#ef4444");
    }
    setAccepting(false);
  }

  // ── Decline ────────────────────────────────────────────────────────────────
  async function handleDecline() {
    const confirmed = window.confirm("Are you sure you want to decline this application?");
    if (!confirmed) return;

    setDeclining(true);
    try {
      if (!jobId || !userId) return;

      const q = query(
        collection(db, "notifications"),
        where("jobId", "==", jobId),
        where("freelancerId", "==", userId)
      );
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await updateDoc(doc(db, "notifications", d.id), { status: "declined", read: true });
      }

      const { name: freelancerName, image: freelancerImage } = await fetchFreelancerMeta(userId);
      const jobTitle = await fetchJobTitle(jobId);

      await addDoc(collection(db, "freelancer_notifications"), {
        freelancerId: userId,
        freelancerName,
        freelancerAvatar: freelancerImage,
        jobId,
        jobTitle,
        status: "declined",
        createdAt: serverTimestamp(),
        isRead: false,
      });

      showSnack("Application declined ❌", "#ef4444");

      setTimeout(() => {
        if (onClose) onClose();
        else navigate(-1);
      }, 1500);
    } catch (e) {
      console.error("handleDecline:", e);
      showSnack("Error declining application.", "#ef4444");
    }
    setDeclining(false);
  }

  // ── Open chat ──────────────────────────────────────────────────────────────
  async function openChat() {
    const currentUid = auth.currentUser?.uid;
    if (!userData || !userId || !currentUid) return;

    const name = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "Freelancer";
    const image = userData.profileImage || "";

    if (onChatOpen) {
      onChatOpen(userId, name, image);
    } else {
      navigate(`/chat/${currentUid}/${userId}`, {
        state: { currentUid, otherUid: userId, otherName: name, otherImage: image },
      });
    }
  }

  // ── Go back ────────────────────────────────────────────────────────────────
  function goBack() {
    if (onClose) onClose();
    else navigate(-1);
  }

  // ── Collaboration popup ────────────────────────────────────────────────────
  async function openCollabPopup() {
    await loadClientJobs();
    setCollabOpen(true);
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ──────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="fds-page">
        <div className="fds-center">
          <div className="fds-loader-wrap">
            <div className="fds-loader-ring" />
            <div className="fds-loader-ring fds-loader-ring--2" />
            <div className="fds-loader-dot" />
          </div>
        </div>
        <FdsStyles />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="fds-page">
        <div className="fds-center" style={{ flexDirection: "column", gap: 20 }}>
          <div className="fds-error-icon">⚠️</div>
          <p className="fds-error-text">User profile not found.</p>
          <button className="fds-btn-primary" onClick={goBack}>← Go Back</button>
        </div>
        <FdsStyles />
      </div>
    );
  }

  const firstName = userData?.first_name || userData?.firstName || userData?.name || "";
  const lastName = userData?.last_name || userData?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "User";
  const about = userData.about || "";
  const profileImage = userData?.profileImage || userData?.profile_pic || userData?.imageUrl || userData?.photoURL || "";
  const coverImage = userData.coverImage || "";
  const skills = extractList(userData.skills);
  const tools = extractList(userData.tools);
  const links = userData.links || {};
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "?";

  return (
    <div className="fds-page">
      <div className="fds-scroll">

        {/* ── HERO COVER ── */}
        <div className="fds-hero">
          <div
            className="fds-cover"
            style={{ backgroundImage: coverImage ? `url(${coverImage})` : undefined }}
          >
            <div className="fds-cover-overlay" />
            <button className="fds-back-btn" onClick={goBack} aria-label="Go back">
              <FiChevronLeft size={22} />
            </button>
          </div>

          {/* ── AVATAR ── */}
          <div className="fds-avatar-anchor">
            <div className="fds-avatar-ring">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={fullName}
                  className="fds-avatar-img"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="fds-avatar-fallback">{initials}</div>
              )}
            </div>
            <div className="fds-badge">Freelancer</div>
          </div>
        </div>

        {/* ── NAME + ACTIONS ── */}
        <div className="fds-identity">
          <h1 className="fds-name">{fullName}</h1>

          {/* Links */}
          {Object.keys(links).length > 0 && (
            <div className="fds-links-row">
              {Object.entries(links)
                .filter(([, v]) => typeof v === "string" && v.trim())
                .map(([k, v]) => (
                  <a
                    key={k}
                    href={v.startsWith("http") ? v : `https://${v}`}
                    target="_blank"
                    rel="noreferrer"
                    className="fds-link-pill"
                  >
                    <FiExternalLink size={11} />
                    {capitalize(k)}
                  </a>
                ))}
            </div>
          )}

          {/* Actions */}
          <div className="fds-actions">
            {isAccepted ? (
              <button className="fds-btn-primary fds-btn-wide" onClick={openChat}>
                <FiMessageSquare size={16} />
                Message
              </button>
            ) : (
              <>
                <button
                  className="fds-btn-primary"
                  onClick={handleAccept}
                  disabled={accepting}
                >
                  <FiCheck size={16} />
                  {accepting ? "Accepting…" : "Accept"}
                </button>
                <button
                  className="fds-btn-ghost"
                  onClick={handleDecline}
                  disabled={declining}
                >
                  <FiX size={16} />
                  {declining ? "Declining…" : "Decline"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── ABOUT ── */}
        <section className="fds-card fds-card--about">
          <h2 className="fds-section-title">About</h2>
          <p className="fds-about-body">{about || "No about info provided."}</p>

          {(skills.length > 0 || tools.length > 0) && (
            <div className="fds-skills-block">
              <h3 className="fds-subsection-title">Skills & Tools</h3>
              <div className="fds-chips-wrap">
                {[...skills, ...tools].map((s, i) => (
                  <span key={i} className={`fds-chip fds-chip-${i % 14}`}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── PORTFOLIO ── */}
        <section className="fds-card">
          <h2 className="fds-section-title">Portfolio</h2>
          {portfolio.length === 0 ? (
            <div className="fds-empty">
              <span className="fds-empty-icon">🗂️</span>
              <p className="fds-empty-text">No portfolio items yet.</p>
            </div>
          ) : (
            <div className="fds-portfolio-track">
              {portfolio.map((p) => (
                <PortfolioCard key={p.id} item={p} />
              ))}
            </div>
          )}
        </section>

        {/* ── SERVICES ── */}
        <section className="fds-card fds-card--last">
          <div className="fds-tabs-header">
            {["work", "24h"].map((tab) => (
              <button
                key={tab}
                className={`fds-tab${activeTab === tab ? " fds-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "work" ? "Work" : "24 Hour"}
              </button>
            ))}
          </div>

          <div className="fds-services-list">
            {(activeTab === "work" ? services : services24h).length === 0 ? (
              <div className="fds-empty">
                <span className="fds-empty-icon">💼</span>
                <p className="fds-empty-text">No services added yet.</p>
              </div>
            ) : (
              (activeTab === "work" ? services : services24h).map((svc) => (
                <ServiceCard key={svc.id} service={svc} />
              ))
            )}
          </div>
        </section>
      </div>

      {/* ── SNACKBAR ── */}
      {snack && (
        <div className="fds-snack" style={{ background: snack.color }}>
          {snack.msg}
        </div>
      )}

      {/* ── COLLABORATION POPUP ── */}
      {collabOpen && (
        <CollaborationPopup
          clientJobs={clientJobs}
          receiverId={userId}
          receiverName={fullName}
          receiverImage={profileImage}
          onClose={() => setCollabOpen(false)}
          onSuccess={(chatState) => {
            setCollabOpen(false);
            if (onChatOpen) {
              onChatOpen(chatState.otherUid, chatState.otherName, chatState.otherImage);
            } else {
              navigate("/client-dashbroad2/chat", { state: chatState });
            }
          }}
          showSnack={showSnack}
        />
      )}

      <FdsStyles />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
//  PORTFOLIO CARD
// ──────────────────────────────────────────────────────────────────────────────
function PortfolioCard({ item }) {
  const title = item.title || "Untitled";
  const description = item.description || "";
  const imageUrl = item.imageUrl || "";
  const projectUrl = item.projectUrl || "";
  const all = [...extractList(item.skills), ...extractList(item.tools)];

  function handleClick() {
    if (!projectUrl) return;
    const url = projectUrl.startsWith("http") ? projectUrl : `https://${projectUrl}`;
    window.open(url, "_blank");
  }

  return (
    <div
      className={`fds-portfolio-card${projectUrl ? " fds-portfolio-card--clickable" : ""}`}
      onClick={handleClick}
    >
      <div className="fds-portfolio-img-wrap">
        <img
          src={imageUrl || "https://via.placeholder.com/260x160?text=Portfolio"}
          alt={title}
          className="fds-portfolio-img"
          onError={(e) => { e.target.src = "https://via.placeholder.com/260x160?text=Portfolio"; }}
        />
        {projectUrl && (
          <div className="fds-portfolio-overlay">
            <FiExternalLink size={20} color="#fff" />
          </div>
        )}
      </div>
      <div className="fds-portfolio-body">
        <p className="fds-portfolio-title">{title}</p>
        {description && <p className="fds-portfolio-desc">{description}</p>}
        {all.length > 0 && (
          <div className="fds-chips-wrap" style={{ marginTop: 10 }}>
            {all.slice(0, 4).map((s, i) => (
              <span key={i} className="fds-chip-accent">{s}</span>
            ))}
          </div>
        )}
        {projectUrl && (
          <span className="fds-view-project">
            <FiExternalLink size={11} /> View Project
          </span>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
//  SERVICE CARD
// ──────────────────────────────────────────────────────────────────────────────
function ServiceCard({ service }) {
  const all = [...extractList(service.skills), ...extractList(service.tools)];
  const visible = all.slice(0, 4);
  const extra = all.length - visible.length;

  return (
    <div className="fds-service-card">
      <div className="fds-service-top">
        <span className="fds-service-title">{service.title || ""}</span>
        <span className="fds-service-rate">
          ₹{service.budget_from || "0"}
          <span className="fds-service-rate-unit">/day</span>
        </span>
      </div>

      {visible.length > 0 && (
        <>
          <p className="fds-skills-label">Skills Required</p>
          <div className="fds-chips-wrap">
            {visible.map((s, i) => (
              <span key={i} className="fds-chip-accent">{s}</span>
            ))}
            {extra > 0 && (
              <span className="fds-chip-accent fds-chip-extra">+{extra}</span>
            )}
          </div>
        </>
      )}

      {service.description && (
        <p className="fds-service-desc">{service.description}</p>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
//  COLLABORATION POPUP
// ──────────────────────────────────────────────────────────────────────────────
function CollaborationPopup({
  clientJobs,
  receiverId,
  receiverName,
  receiverImage,
  onClose,
  onSuccess,
  showSnack,
}) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const currentUid = auth.currentUser?.uid;
      if (!currentUid) {
        showSnack("User not logged in.", "#ef4444");
        setSubmitting(false);
        return;
      }

      await addDoc(collection(db, "collaboration_requests"), {
        clientId: currentUid,
        freelancerId: receiverId,
        title: title.trim(),
        description: desc.trim(),
        status: "sent",
        timestamp: serverTimestamp(),
        ...(selectedJob?.id ? { jobId: selectedJob.id } : {}),
        ...(selectedJob?.type ? { jobType: selectedJob.type } : {}),
      });

      let initialMessage = `Collaboration request: ${title.trim()}\nDescription: ${desc.trim()}`;

      if (selectedJob?.id && selectedJob?.type) {
        const col = selectedJob.type === "services" ? "jobs" : "jobs_24h";
        const jobDoc = await getDoc(doc(db, col, selectedJob.id));
        if (jobDoc.exists()) {
          const jd = jobDoc.data();
          const payload = {
            id: selectedJob.id,
            title: jd.title?.toString() ?? "Untitled",
            description: jd.description?.toString() ?? "",
            category: jd.category?.toString() ?? "General",
            sub_category: jd.sub_category?.toString() ?? "",
            budget_from: jd.budget_from?.toString() ?? "",
            budget_to: jd.budget_to?.toString() ?? "",
            price: jd.price?.toString() ?? "",
            skills: Array.isArray(jd.skills) ? jd.skills : [],
            is24h: jd.is24h === true,
          };
          initialMessage = `HUZZLER_JOB_DATA:${JSON.stringify(payload)}`;
        }
      }

      onSuccess({
        currentUid,
        otherUid: receiverId,
        otherName: receiverName,
        otherImage: receiverImage,
        initialMessage,
      });

      showSnack("Request sent successfully! ✅", "#16a34a");
    } catch (e) {
      console.error("handleSubmit collab:", e);
      showSnack("Error sending request.", "#ef4444");
    }
    setSubmitting(false);
  }

  return (
    <>
      <div className="fds-modal-backdrop" onClick={onClose} />
      <div className="fds-modal" role="dialog" aria-modal="true">
        <div className="fds-modal-header">
          <h3 className="fds-modal-title">Collaborate & Turn Ideas into Reality</h3>
          <button className="fds-modal-close" onClick={onClose} aria-label="Close">
            <FiX size={18} />
          </button>
        </div>

        <div className="fds-modal-body">
          <div className="fds-field">
            <label className="fds-label">Select a Job (optional)</label>
            <select
              className="fds-input"
              value={selectedJob?.id || ""}
              onChange={(e) => {
                const found = clientJobs.find((j) => j.id === e.target.value);
                setSelectedJob(found || null);
                setTitle(found?.title || "");
              }}
            >
              <option value="">— None —</option>
              {clientJobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title || "Untitled"}</option>
              ))}
            </select>
          </div>

          <div className="fds-field">
            <label className="fds-label">Project Title <span className="fds-required">*</span></label>
            <input
              className="fds-input"
              placeholder="e.g. Mobile App Redesign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="fds-field">
            <label className="fds-label">Description</label>
            <textarea
              className="fds-input fds-textarea"
              placeholder="Describe what you need…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <div className="fds-modal-footer">
          <button className="fds-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="fds-btn-primary"
            onClick={handleSubmit}
            disabled={!title.trim() || submitting}
          >
            {submitting ? "Sending…" : "Send Request"}
          </button>
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
//  STYLES
// ──────────────────────────────────────────────────────────────────────────────
function FdsStyles() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,400&display=swap');

/* ── TOKENS ── */
:root {
  --fds-yellow: #F5F200;
  --fds-yellow-soft: #FEFDE0;
  --fds-yellow-mid: #FFFAB0;
  --fds-black: #0D0D0D;
  --fds-grey-100: #F7F7F5;
  --fds-grey-200: #EFEFED;
  --fds-grey-400: #B0B0AD;
  --fds-grey-600: #6B6B67;
  --fds-grey-800: #2E2E2B;
  --fds-blue: #0047FF;
  --fds-radius-sm: 10px;
  --fds-radius-md: 18px;
  --fds-radius-lg: 28px;
  --fds-shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --fds-shadow-md: 0 6px 24px rgba(0,0,0,0.10);
  --fds-shadow-lg: 0 16px 48px rgba(0,0,0,0.14);
  --fds-font: 'DM Sans', system-ui, sans-serif;
  --fds-display: 'Fraunces', Georgia, serif;
}

/* ── RESET & BASE ── */
*, *::before, *::after { box-sizing: border-box; }

/* ── PAGE ── */
.fds-page {
  position: relative;
  min-height: 100vh;
  background: var(--fds-grey-100);
  font-family: var(--fds-font);
  color: var(--fds-black);
}
.fds-center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* ── LOADER ── */
.fds-loader-wrap {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fds-loader-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2.5px solid transparent;
  border-top-color: var(--fds-black);
  animation: fds-spin 1s linear infinite;
}
.fds-loader-ring--2 {
  inset: 10px;
  border-top-color: var(--fds-yellow);
  animation-duration: 0.7s;
  animation-direction: reverse;
}
.fds-loader-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--fds-black);
}
@keyframes fds-spin { to { transform: rotate(360deg); } }

/* ── ERROR ── */
.fds-error-icon { font-size: 52px; }
.fds-error-text {
  font-size: 16px;
  color: var(--fds-grey-600);
  margin: 0;
}

/* ── SCROLL CONTAINER ── */
.fds-scroll {
  max-width: 780px;
  margin: 0 auto;
  padding-bottom: 64px;
}

/* ── HERO ── */
.fds-hero {
  position: relative;
  margin-bottom: 70px;
}
.fds-cover {
  height: 240px;
  width: 100%;
  background: linear-gradient(135deg, #e8e0ff 0%, #fdf5c3 50%, #d0f5e8 100%);
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 0 0 var(--fds-radius-lg) var(--fds-radius-lg);
  overflow: hidden;
}
.fds-cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.28) 100%);
}
.fds-back-btn {
  position: absolute;
  top: 20px;
  left: 18px;
  z-index: 10;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.22);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.15s;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
}
.fds-back-btn:hover { background: rgba(255,255,255,0.38); transform: scale(1.06); }

/* ── AVATAR ── */
.fds-avatar-anchor {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.fds-avatar-ring {
  width: 118px;
  height: 118px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, var(--fds-yellow) 0%, #ffffff 60%, var(--fds-blue) 100%);
  box-shadow: var(--fds-shadow-lg);
}
.fds-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
}
.fds-avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--fds-grey-200);
  border: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  color: var(--fds-grey-600);
  font-family: var(--fds-display);
  letter-spacing: -1px;
}
.fds-badge {
  margin-top: 8px;
  padding: 5px 18px;
  background: var(--fds-black);
  color: var(--fds-yellow);
  border-radius: 30px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: var(--fds-shadow-sm);
}

/* ── IDENTITY BLOCK ── */
.fds-identity {
  background: #fff;
  padding: 20px 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--fds-grey-200);
  margin-bottom: 12px;
}
.fds-name {
  font-family: var(--fds-display);
  font-size: 28px;
  font-weight: 600;
  color: var(--fds-black);
  margin: 0;
  text-align: center;
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.fds-links-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
.fds-link-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 30px;
  border: 1.5px solid var(--fds-grey-200);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--fds-blue);
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;
}
.fds-link-pill:hover { background: #f0f5ff; border-color: var(--fds-blue); }

/* ── ACTION BUTTONS ── */
.fds-actions {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 400px;
}
.fds-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex: 1;
  padding: 13px 24px;
  border-radius: var(--fds-radius-lg);
  border: none;
  background: var(--fds-yellow);
  color: var(--fds-black);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  font-family: var(--fds-font);
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
  box-shadow: 0 3px 12px rgba(245,242,0,0.35);
}
.fds-btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(245,242,0,0.45);
}
.fds-btn-primary:active:not(:disabled) { transform: translateY(0); }
.fds-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.fds-btn-primary.fds-btn-wide { max-width: 260px; flex: none; }

.fds-btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex: 1;
  padding: 13px 24px;
  border-radius: var(--fds-radius-lg);
  border: 1.5px solid var(--fds-grey-200);
  background: #fff;
  color: var(--fds-black);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  font-family: var(--fds-font);
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
}
.fds-btn-ghost:hover:not(:disabled) {
  border-color: var(--fds-grey-400);
  background: var(--fds-grey-100);
  transform: translateY(-1px);
}
.fds-btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── CARDS ── */
.fds-card {
  background: #fff;
  border-radius: var(--fds-radius-md);
  padding: 24px;
  margin-bottom: 12px;
  box-shadow: var(--fds-shadow-sm);
}
.fds-card--about {}
.fds-card--last { margin-bottom: 0; padding-bottom: 40px; }

/* ── SECTION TITLES ── */
.fds-section-title {
  font-family: var(--fds-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--fds-black);
  margin: 0 0 14px;
  letter-spacing: -0.3px;
}
.fds-subsection-title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--fds-grey-600);
  margin: 20px 0 10px;
}

/* ── ABOUT ── */
.fds-about-body {
  font-size: 14.5px;
  line-height: 1.75;
  color: var(--fds-grey-800);
  margin: 0;
}
.fds-skills-block {}

/* ── CHIPS ── */
.fds-chips-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.fds-chip {
  padding: 7px 14px;
  border-radius: 30px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--fds-grey-800);
}
.fds-chip-0  { background: #FFE4DC; }
.fds-chip-1  { background: #D7F3FF; }
.fds-chip-2  { background: #EBD9FF; }
.fds-chip-3  { background: #D5FFDF; }
.fds-chip-4  { background: #E0EEFF; }
.fds-chip-5  { background: #FFD6DF; }
.fds-chip-6  { background: var(--fds-yellow-mid); }
.fds-chip-7  { background: #E4F8E6; }
.fds-chip-8  { background: #F0E5FF; }
.fds-chip-9  { background: #E2F5FE; }
.fds-chip-10 { background: #FFECEE; }
.fds-chip-11 { background: #F0F8E6; }
.fds-chip-12 { background: #E1F5F2; }
.fds-chip-13 { background: #FFFBE5; }
.fds-chip-accent {
  background: var(--fds-yellow-soft);
  border: 1px solid rgba(200,190,0,0.2);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: var(--fds-grey-800);
}
.fds-chip-extra {
  background: var(--fds-grey-200);
  color: var(--fds-grey-600);
}

/* ── EMPTY STATE ── */
.fds-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 0;
}
.fds-empty-icon { font-size: 40px; }
.fds-empty-text { font-size: 14px; color: var(--fds-grey-400); margin: 0; }

/* ── PORTFOLIO ── */
.fds-portfolio-track {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.fds-portfolio-card {
  border: 1px solid var(--fds-grey-200);
  border-radius: var(--fds-radius-md);
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}
.fds-portfolio-card--clickable { cursor: pointer; }
.fds-portfolio-card--clickable:hover {
  transform: translateY(-3px);
  box-shadow: var(--fds-shadow-md);
}
.fds-portfolio-img-wrap {
  position: relative;
  height: 158px;
  overflow: hidden;
  background: var(--fds-grey-100);
}
.fds-portfolio-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.fds-portfolio-card--clickable:hover .fds-portfolio-img { transform: scale(1.04); }
.fds-portfolio-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.fds-portfolio-card--clickable:hover .fds-portfolio-overlay { opacity: 1; }
.fds-portfolio-body { padding: 14px 16px 16px; flex: 1; display: flex; flex-direction: column; }
.fds-portfolio-title {
  margin: 0 0 6px;
  font-weight: 600;
  font-size: 14.5px;
  color: var(--fds-black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fds-portfolio-desc {
  margin: 0;
  font-size: 12.5px;
  color: var(--fds-grey-600);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.fds-view-project {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  font-size: 11.5px;
  color: var(--fds-blue);
  font-weight: 500;
}

/* ── SERVICES TABS ── */
.fds-tabs-header {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--fds-grey-200);
  margin-bottom: 20px;
}
.fds-tab {
  padding: 10px 26px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  font-size: 14.5px;
  font-weight: 500;
  color: var(--fds-grey-400);
  cursor: pointer;
  font-family: var(--fds-font);
  transition: color 0.2s, border-color 0.2s;
}
.fds-tab:hover { color: var(--fds-grey-800); }
.fds-tab--active { color: var(--fds-black); border-bottom-color: var(--fds-black); font-weight: 600; }

.fds-services-list { display: flex; flex-direction: column; gap: 12px; }

/* ── SERVICE CARD ── */
.fds-service-card {
  background: var(--fds-yellow-soft);
  border: 1px solid rgba(200,190,0,0.18);
  border-radius: var(--fds-radius-md);
  padding: 20px 22px 22px;
  transition: box-shadow 0.2s;
}
.fds-service-card:hover { box-shadow: var(--fds-shadow-sm); }
.fds-service-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}
.fds-service-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--fds-black);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}
.fds-service-rate {
  font-size: 15px;
  font-weight: 700;
  color: var(--fds-black);
  white-space: nowrap;
  flex-shrink: 0;
}
.fds-service-rate-unit {
  font-size: 11px;
  font-weight: 400;
  color: var(--fds-grey-600);
  margin-left: 2px;
}
.fds-skills-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fds-grey-400);
  margin: 0 0 10px;
}
.fds-service-desc {
  margin: 14px 0 0;
  font-size: 13px;
  line-height: 1.65;
  color: var(--fds-grey-800);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── SNACKBAR ── */
.fds-snack {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  padding: 13px 28px;
  border-radius: 30px;
  font-family: var(--fds-font);
  font-size: 14px;
  font-weight: 500;
  box-shadow: var(--fds-shadow-lg);
  z-index: 99999;
  white-space: nowrap;
  animation: fds-snack-in 0.28s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes fds-snack-in {
  from { opacity: 0; transform: translateX(-50%) translateY(14px) scale(0.95); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

/* ── MODAL ── */
.fds-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(13,13,13,0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 20000;
  animation: fds-fade-in 0.2s ease;
}
@keyframes fds-fade-in { from { opacity: 0; } to { opacity: 1; } }
.fds-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(94vw, 500px);
  max-height: 88vh;
  background: #fff;
  border-radius: var(--fds-radius-lg);
  box-shadow: var(--fds-shadow-lg);
  z-index: 20001;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fds-modal-in 0.28s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes fds-modal-in {
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
.fds-modal-header {
  padding: 22px 24px 18px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--fds-grey-200);
}
.fds-modal-title {
  margin: 0;
  font-family: var(--fds-display);
  font-size: 19px;
  font-weight: 600;
  color: var(--fds-black);
  line-height: 1.25;
  letter-spacing: -0.3px;
}
.fds-modal-close {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid var(--fds-grey-200);
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fds-grey-600);
  transition: background 0.2s, color 0.2s;
}
.fds-modal-close:hover { background: var(--fds-grey-100); color: var(--fds-black); }
.fds-modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}
.fds-modal-footer {
  padding: 16px 24px 22px;
  border-top: 1px solid var(--fds-grey-200);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.fds-modal-footer .fds-btn-ghost { flex: none; }
.fds-modal-footer .fds-btn-primary { flex: none; }

/* ── FORM FIELDS ── */
.fds-field { display: flex; flex-direction: column; gap: 7px; }
.fds-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--fds-grey-600);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.fds-required { color: #ef4444; }
.fds-input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--fds-grey-200);
  border-radius: var(--fds-radius-sm);
  background: var(--fds-grey-100);
  font-size: 14px;
  font-family: var(--fds-font);
  color: var(--fds-black);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, background 0.2s;
  appearance: auto;
}
.fds-input:focus { border-color: var(--fds-black); background: #fff; }
.fds-input::placeholder { color: var(--fds-grey-400); }
.fds-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }

/* ── RESPONSIVE ── */
@media (max-width: 620px) {
  .fds-cover { height: 180px; border-radius: 0 0 20px 20px; }
  .fds-hero { margin-bottom: 76px; }
  .fds-avatar-ring { width: 100px; height: 100px; }
  .fds-avatar-fallback { font-size: 30px; }
  .fds-name { font-size: 23px; }
  .fds-card { padding: 18px 16px; border-radius: var(--fds-radius-sm); }
  .fds-portfolio-track { grid-template-columns: 1fr; }
  .fds-actions { flex-direction: column; }
  .fds-btn-primary, .fds-btn-ghost { flex: none; width: 100%; }
  .fds-modal-header { padding: 18px 18px 14px; }
  .fds-modal-body { padding: 16px 18px; }
  .fds-modal-footer { padding: 14px 18px 18px; flex-direction: column-reverse; }
  .fds-modal-footer .fds-btn-ghost,
  .fds-modal-footer .fds-btn-primary { width: 100%; }
}
    `}</style>
  );
}