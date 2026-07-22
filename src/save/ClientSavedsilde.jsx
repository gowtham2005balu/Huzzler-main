
// import React, { useEffect, useMemo, useState, useRef } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   runTransaction,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   Timestamp,
//   query,
//   where,
//   getDoc,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { db } from "../firbase/Firebase";
// import { useNavigate, Link } from "react-router-dom";
// import { FiEye, FiMessageCircle, FiBell } from "react-icons/fi";
// import FilterScreen, { JobFilter } from "../firebaseClientScreen/Postjob/Filter";
// import { Bookmark, Clock } from "lucide-react";
// import { BsBookmarkFill } from "react-icons/bs";
// // import "./clientsideCategorypage.css";
// import sortimg from "../assets/sort.png";
// import backarrow from "../assets/backarrow.png";
// import profile from "../assets/profile.png";
// import message from "../assets/message.png";
// import notifiaction from "../assets/notification.png";
// import filter1 from "../assets/Filter.png";
// import search1 from "../assets/search.png";


// const formatCurrency = (value = 0) => {
//   const v = Number(value) || 0;
//   if (v >= 100000) return (v / 100000).toFixed(1) + "L";
//   if (v >= 1000) return (v / 1000).toFixed(1) + "K";
//   return v.toString();
// };

// const skillColor = (skill) => {
//   const colors = [
//     "#FFC1B6",
//     "#BDF4FF",
//     "#E6C9FF",
//     "#C6F7D6",
//     "#FFF3B0",
//     "#FFD6E8",
//     "#D7E3FC",
//   ];
//   return colors[skill.length % colors.length];
// };

// export default function CategoryPage({ initialTab = "Saved" })
//  {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   const [tab, setTab] = useState(initialTab);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("");

//   const [filter, setFilter] = useState(new JobFilter());
//   const [showFilter, setShowFilter] = useState(false);
//   const isMobile = window.innerWidth <= 768;

//   const [services, setServices] = useState([]);
//   const [services24, setServices24] = useState([]);
//   const [savedIds, setSavedIds] = useState([]);
//   const [userProfile, setUserProfile] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [showSort, setShowSort] = useState(false);
//   const sortRef = useRef(null);

//   const pending = notifications.filter((n) => !n.read).length;

//   const getJobDate = (date) => {
//     if (!date) return null;

//     if (date instanceof Timestamp) {
//       return date.toDate();
//     }

//     if (date?.seconds) {
//       return new Date(date.seconds * 1000);
//     }

//     if (date instanceof Date) return date;

//     const parsed = new Date(date);
//     if (!isNaN(parsed)) return parsed;

//     return null;
//   };

//   function timeAgo(ts) {
//     if (!ts) return "Just now";
//     const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
//     const diff = (Date.now() - d.getTime()) / 1000;

//     if (diff < 60) return `${Math.floor(diff)}s ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//     return `${Math.floor(diff / 86400)}d ago`;
//   }

//   useEffect(() => {
//     function handleOutsideClick(e) {
//       if (sortRef.current && !sortRef.current.contains(e.target)) {
//         setShowSort(false);
//       }
//     }

//     if (showSort) {
//       document.addEventListener("mousedown", handleOutsideClick);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [showSort]);

//   useEffect(() => {
//     if (!user) return;

//     const unsub1 = onSnapshot(collection(db, "services"), (snap) => {
//       setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
//       setServices24(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     const unsubUser = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setSavedIds(snap.data()?.savedJobs || []);
//     });

//     return () => {
//       unsub1();
//       unsub2();
//       unsubUser();
//     };
//   }, [user]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;

//       const userRef = doc(db, "users", currentUser.uid);
//       const snap = await getDoc(userRef);

//       if (snap.exists()) {
//         setUserProfile(snap.data());
//       }
//     });

//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const q = query(
//       collection(db, "notifications"),
//       where("clientUid", "==", user.uid)
//     );

//     return onSnapshot(q, (snap) => {
//       setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });
//   }, []);

//   async function acceptNotif(item) {
//     try {
//       await updateDoc(doc(db, "notifications", item.id), { read: true });

//       navigate("/chat", {
//         state: {
//           currentUid: auth.currentUser.uid,
//           otherUid: item.freelancerId,
//           otherName: item.freelancerName,
//           otherImage: item.freelancerImage,
//           initialMessage: `Your application for ${item.jobTitle} accepted!`,
//         },
//       });
//     } catch (error) {
//       console.error("Error accepting notification:", error);
//     }
//   }

//   async function declineNotif(item) {
//     try {
//       await deleteDoc(doc(db, "notifications", item.id));
//     } catch (error) {
//       console.error("Error declining notification:", error);
//     }
//   }

//   const incrementViewOnce = async (collectionName, jobId) => {
//     try {
//       const ref = doc(db, collectionName, jobId);

//       await runTransaction(db, async (tx) => {
//         const snap = await tx.get(ref);
//         if (!snap.exists()) return;

//         const viewedBy = snap.data().viewedBy || [];
//         if (viewedBy.includes(user.uid)) return;

//         tx.update(ref, {
//           views: (snap.data().views || 0) + 1,
//           viewedBy: arrayUnion(user.uid),
//         });
//       });
//     } catch (error) {
//       console.error("Error incrementing view:", error);
//     }
//   };

//   const applyFilter = (jobs) => {
//     return jobs
//       .filter((j) => {
//         const title = (j.title || "").toLowerCase();
//         const category = (j.category || "").toLowerCase();
//         const skills = j.skills || [];

//         if (search) {
//           const q = search.toLowerCase();
//           if (
//             !title.includes(q) &&
//             !category.includes(q) &&
//             !skills.some((s) => s.toLowerCase().includes(q))
//           )
//             return false;
//         }

//         if (filter.categories.length && !filter.categories.includes(j.category))
//           return false;

//         if (
//           filter.skills.length &&
//           !skills.some((s) => filter.skills.includes(s))
//         )
//           return false;

//         const from = Number(j.budget_from ?? j.budget ?? 0);
//         const to = Number(j.budget_to ?? j.budget ?? from);

//         if (filter.minPrice !== null && to < filter.minPrice) return false;
//         if (filter.maxPrice !== null && from > filter.maxPrice) return false;

//         if (filter.deliveryTime) {
//           const createdDate = getJobDate(j.createdAt || j.postedAt);

//           if (!createdDate) return true;

//           const now = new Date();
//           const diffDays =
//             (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

//           if (filter.deliveryTime === "today") {
//             const startOfToday = new Date();
//             startOfToday.setHours(0, 0, 0, 0);
//             return createdDate >= startOfToday;
//           }

//           if (filter.deliveryTime === "3d") return diffDays <= 3;
//           if (filter.deliveryTime === "7d") return diffDays <= 7;
//           if (filter.deliveryTime === "30d") return diffDays <= 30;
//         }

//         return true;
//       })
//       .sort((a, b) => {
//         if (sort === "Newest")
//           return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
//         if (sort === "Oldest")
//           return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
//         return 0;
//       });
//   };

//   const jobs = useMemo(() => {
//     if (tab === "Work") return applyFilter(services.map(j => ({ ...j, _type: "WORK" })));
//     if (tab === "24 Hours") return applyFilter(services24.map(j => ({ ...j, _type: "24H" })));

//     return [...services.map(j => ({ ...j, _type: "WORK" })),
//     ...services24.map(j => ({ ...j, _type: "24H" }))]
//       .filter((j) => savedIds.includes(j.id));
//   }, [tab, services, services24, savedIds, search, filter, sort]);


//   const toggleSave = async (jobId, isSaved) => {
//     try {
//       await updateDoc(doc(db, "users", user.uid), {
//         savedJobs: isSaved ? arrayRemove(jobId) : arrayUnion(jobId),
//       });
//     } catch (error) {
//       console.error("Error toggling save:", error);
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: isMobile ? "16px" : 210,
//         marginTop: isMobile ? "0px" : "-160px",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//         <div
//           onClick={() => navigate(-1)}
//           style={{
//             width: 36,
//             height: 36,
//             borderRadius: 14,
//             border: "0.8px solid #E0E0E0",
//             backgroundColor: "#FFFFFF",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
//             flexShrink: 0,
//           }}
//         >
//           <img
//             src={backarrow}
//             alt="Back"
//             style={{
//               width: 16,
//               height: 18,
//               objectFit: "contain",
//             }}
//           />
//         </div>

//         <div>
//           <div style={{ fontSize: 32, fontWeight: 400 }}>
//             Explore Freelancer
//           </div>
//         </div>
//       </div>

//       <div
//         id="fh-header-right"
//         className="fh-header-right"
//         style={{
//           marginTop: "1px",
//           marginRight: isMobile ? "0px" : "190px",
//         }}
//       >
//         <img
//           onClick={() => navigate("/client-dashbroad2/messages")}
//           style={{ width: "26px", cursor: "pointer" }}
//           src={message}
//           alt="message"
//         />

//         <div
//           className="ibtan"
//           onClick={() => setNotifOpen(true)}
//           style={{ cursor: "pointer" }}
//         >
//           <img src={notifiaction} alt="notification" />
//           {pending > 0 && (
//             <span
//               style={{
//                 width: 8,
//                 height: 8,
//                 borderRadius: "50%",
//                 background: "red",
//                 position: "absolute",
//                 top: 6,
//                 right: 5,
//               }}
//             />
//           )}
//         </div>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: "12px",
//           width: "100%",
//         }}
//       >
//         {/* LEFT – SEARCH */}
//         <div
//           style={{
//             display: "flex",
//             marginTop: "34px",
//             alignItems: "center",
//             gap: "8px",
//             border: "1px solid #ddd",
//             borderRadius: "10px",
//             width: "100%",
//             height: "44px",
//           }}
//         >
//           <img
//             src={search1}
//             alt="search"
//             style={{
//               width: 18,
//               height: 18,
//               opacity: 0.6,
//               marginLeft: "13px",
//             }}
//           />

//           <input
//             id="job-search"
//             placeholder="Search"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{
//               flex: 1,
//               border: "none",
//               outline: "none",
//               fontSize: "14px",
//               marginLeft: "0px",
//               height: "19px",
//               lineHeight: "21px",
//               padding: "0",
//               marginTop: "12px",
//             }}
//           />
//         </div>
//       </div>

//       {showSort && (
//         <div
//           ref={sortRef}
//           id="sort-wrapper"
//           style={{
//             position: "absolute",
//             marginLeft: isMobile ? "0px" : "470px",
//             marginTop: isMobile ? "70px" : "130px",
//             background: "#fff",
//             borderRadius: "30px",
//             boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
//             padding: "16px",
//             zIndex: 1000,
//             width: isMobile ? "90%" : "360px",
//             left: isMobile ? "5%" : "auto",
//           }}
//         >
//           {["Newest", "Oldest", "Availability"].map((s, i) => (
//             <button
//               key={s}
//               onClick={() => {
//                 setSort(s);
//                 setShowSort(false);
//               }}
//               style={{
//                 width: "100%",
//                 textAlign: "left",
//                 padding: "12px 14px",
//                 marginBottom: "10px",
//                 border: "none",
//                 borderRadius: "10px",
//                 cursor: "pointer",
//                 fontWeight: 500,
//                 background: sort === s ? "#7C3CFF" : "#f9f9f9",
//                 color: sort === s ? "#fff" : "#333",
//                 opacity: showSort ? 1 : 0,
//                 transform: showSort ? "translateY(0px)" : "translateY(10px)",
//                 transition: "all 0.35s ease",
//                 transitionDelay: `${i * 0.12}s`,
//               }}
//             >
//               {s}
//             </button>
//           ))}
//         </div>
//       )}

//       <div
//         style={{
//           width: "100%",
//           padding: "12px 16px",
//           borderRadius: "18px",
//           boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
//           marginTop: "30px",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "14px",
//           }}
//         >
//           {["Work", "24 Hours", "Saved"].map((t) => {
//             const isActive = tab === t;

//             return (
//               <span
//                 key={t}
//                 onClick={() => setTab(t)}
//                 style={{
//                   padding: "7px 28px",
//                   borderRadius: "999px",
//                   cursor: "pointer",
//                   fontSize: "14px",
//                   fontWeight: isActive ? 600 : 500,
//                   color: isActive ? "#FFFFFF" : "#333",
//                   background: isActive ? "#7C3CFF" : "transparent",
//                   boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.15)" : "none",
//                   transition: "all 0.25s ease",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {t}
//               </span>
//             );
//           })}
//         </div>
//       </div>

//       {notifOpen && (
//         <div
//           onClick={() => setNotifOpen(false)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.25)",
//             backdropFilter: "blur(2px)",
//             zIndex: 9999,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           {/* POPUP CARD */}
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "92%",
//               maxWidth: 420,
//               background: "#fff",
//               borderRadius: 20,
//               padding: 18,
//               boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
//             }}
//           >
//             {/* TITLE */}
//             <div
//               style={{
//                 fontSize: 18,
//                 fontWeight: 600,
//                 marginBottom: 14,
//               }}
//             >
//               Notifications
//             </div>

//             {/* EMPTY */}
//             {notifications.length === 0 && (
//               <div
//                 style={{
//                   padding: 30,
//                   textAlign: "center",
//                   color: "#777",
//                 }}
//               >
//                 No notifications
//               </div>
//             )}

//             {/* LIST */}
//             {notifications.map((item) => (
//               <div
//                 key={item.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 12,
//                   background: "#f7f7f7",
//                   padding: 12,
//                   borderRadius: 14,
//                   marginBottom: 12,
//                 }}
//               >
//                 <img
//                   src={
//                     item.freelancerImage ||
//                     "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                   }
//                   alt="freelancer"
//                   style={{
//                     width: 46,
//                     height: 46,
//                     borderRadius: "50%",
//                     objectFit: "cover",
//                   }}
//                 />

//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontWeight: 600 }}>{item.freelancerName}</div>
//                   <div style={{ fontSize: 13, color: "#555" }}>
//                     applied for {item.jobTitle}
//                   </div>
//                 </div>

//                 {!item.read ? (
//                   <>
//                     <button
//                       onClick={() => acceptNotif(item)}
//                       style={{
//                         background: "#000",
//                         color: "#fff",
//                         border: "none",
//                         padding: "6px 12px",
//                         borderRadius: 8,
//                         cursor: "pointer",
//                       }}
//                     >
//                       Chat
//                     </button>

//                     <button
//                       onClick={() => declineNotif(item)}
//                       style={{
//                         background: "transparent",
//                         border: "1px solid #ccc",
//                         padding: "6px 10px",
//                         borderRadius: 8,
//                         cursor: "pointer",
//                       }}
//                     >
//                       ✕
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     onClick={() => acceptNotif(item)}
//                     style={{
//                       background: "#000",
//                       color: "#fff",
//                       border: "none",
//                       padding: "6px 14px",
//                       borderRadius: 8,
//                       cursor: "pointer",
//                     }}
//                   >
//                     Chat
//                   </button>
//                 )}
//               </div>
//             ))}

//             {/* CLOSE */}
//             <button
//               onClick={() => setNotifOpen(false)}
//               style={{
//                 marginTop: 6,
//                 width: "100%",
//                 padding: 12,
//                 borderRadius: 12,
//                 border: "none",
//                 background: "#000",
//                 color: "#fff",
//                 cursor: "pointer",
//                 fontWeight: 500,
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* FILTER + SORT BAR */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: isMobile ? "space-between" : "flex-end",
//           width: "100%",
//           padding: "10px 14px",
//           marginTop: "15px",
//           flexWrap: "wrap",
//           gap: "10px",
//         }}
//       >
//         {/* LEFT – FILTER */}
//         <div
//           onClick={() => setShowFilter(true)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "6px",
//             cursor: "pointer",
//             fontWeight: 500,
//           }}
//         >
//           <img src={filter1} alt="Filter" style={{ width: 18, height: 18 }} />
//           <span>Filter</span>
//         </div>

//         {/* RIGHT – SORT */}
//         <div
//           onClick={() => setShowSort(!showSort)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "6px",
//             cursor: "pointer",
//             fontWeight: 500,
//           }}
//         >
//           <img src={sortimg} alt="Sort" style={{ width: 18, height: 18 }} />
//           <span>Sort</span>
//         </div>
//       </div>

//       <div style={{ marginTop: 20 }}>
//         {jobs.length === 0 && <p>No jobs found</p>}

//         {jobs.map((job) => {
//           const isSaved = savedIds.includes(job.id);
//           return (
//             <div
//               key={job.id}
//               onClick={() => {
//                 const is24 = job._type === "24H";

//                 incrementViewOnce(is24 ? "service_24h" : "services", job.id);

//                 if (is24) {
//                   navigate(`/client-dashbroad2/service-24h/${job.id}`);
//                 } else {
//                   navigate(`/client-dashbroad2/service/${job.id}`);
//                 }
//               }}



//               style={{
//                 background: "#fff",
//                 borderRadius: 20,
//                 padding: "22px",
//                 marginBottom: 22,
//                 cursor: "pointer",
//                 boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
//                 position: "relative",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "flex-start",
//                 }}
//               >
//                 <h3 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
//                   {job.title}
//                 </h3>

//                 <div id="job-budget" className="job-budget">
//                   ₹{job.budget_from || job.budget} - {job.budget_to || job.budget}
//                 </div>
//               </div>
//               <div
//                 style={{
//                   fontSize: "14",
//                   marginTop: "10px",
//                   color: "gray",
//                   fontWeight: "400",
//                 }}
//               >
//                 Skills Required
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   gap: 8,
//                   margin: "12px 0",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 {(job.skills || []).slice(0, 3).map((s) => (
//                   <span
//                     key={s}
//                     style={{
//                       background: "#FFF085B2",
//                       padding: isMobile ? "4px 10px" : "6px 14px",
//                       borderRadius: 999,
//                       fontSize: isMobile ? 11 : 13,
//                       fontWeight: 500,
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {s}
//                   </span>
//                 ))}

//                 {job.skills?.length > 3 && (
//                   <span
//                     style={{
//                       background: "#FFF085B2",
//                       padding: isMobile ? "4px 10px" : "6px 14px",
//                       borderRadius: 999,
//                       fontSize: isMobile ? 11 : 13,
//                       fontWeight: 500,
//                     }}
//                   >
//                     +{job.skills.length - 3}
//                   </span>
//                 )}
//               </div>

//               <p
//                 style={{
//                   fontSize: 14,
//                   color: "#555",
//                   lineHeight: 1.6,
//                   marginBottom: 14,
//                 }}
//               >
//                 {job.description?.slice(0, 320)}
//                 {job.description?.length > 200 ? "..." : ""}
//               </p>

//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 18,
//                     fontSize: 13,
//                     color: "#777",
//                   }}
//                 >
//                   <span
//                     style={{ display: "flex", gap: 6, alignItems: "center" }}
//                   >
//                     <FiEye /> {job.views || 0} Impression
//                   </span>
//                   <span
//                     style={{ display: "flex", gap: 6, alignItems: "center" }}
//                   >
//                     <Clock size={14} />
//                     {timeAgo(job.createdAt)}
//                   </span>
//                 </div>

//                 <div
//                   style={{
//                     position: "absolute",
//                     top: 60,
//                     right: 20,
//                     cursor: "pointer",
//                     zIndex: 10,
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleSave(job.id, savedIds.includes(job.id));
//                   }}
//                 >
//                   {savedIds.includes(job.id) ? (
//                     <BsBookmarkFill size={20} />
//                   ) : (
//                     <Bookmark size={20} />
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {showFilter && (
//         <div style={modalStyle}>
//           <FilterScreen
//             initialFilter={filter}
//             onClose={() => setShowFilter(false)}
//             onApply={(appliedFilter) => {
//               setFilter(appliedFilter);
//               setShowFilter(false);
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// const modalStyle = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.35)",
//   zIndex: 999,
//   overflowY: "auto",
// };  


import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firbase/Firebase";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiMessageCircle, FiBell } from "react-icons/fi";
import FilterScreen, { JobFilter } from "../firebaseClientScreen/Postjob/Filter";
import { Bookmark, Clock } from "lucide-react";
import { BsBookmarkFill } from "react-icons/bs";
// import "./clientsideCategorypage.css";
import sortimg from "../assets/sort.png";
import backarrow from "../assets/backarrow.png";
import profile from "../assets/profile.png";
import message from "../assets/message.png";
import notifiaction from "../assets/notification.png";
import filter1 from "../assets/Filter.png";
import search1 from "../assets/search.png";


const formatCurrency = (value = 0) => {
  const v = Number(value) || 0;
  if (v >= 100000) return (v / 100000).toFixed(1) + "L";
  if (v >= 1000) return (v / 1000).toFixed(1) + "K";
  return v.toString();
};

const skillColor = (skill) => {
  const colors = [
    "#FFC1B6",
    "#BDF4FF",
    "#E6C9FF",
    "#C6F7D6",
    "#FFF3B0",
    "#FFD6E8",
    "#D7E3FC",
  ];
  return colors[skill.length % colors.length];
};

export default function CategoryPage({ initialTab = "Saved" })
 {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [filter, setFilter] = useState(new JobFilter());
  const [showFilter, setShowFilter] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const [services, setServices] = useState([]);
  const [services24, setServices24] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef(null);

  const pending = notifications.filter((n) => !n.read).length;

  const getJobDate = (date) => {
    if (!date) return null;

    if (date instanceof Timestamp) {
      return date.toDate();
    }

    if (date?.seconds) {
      return new Date(date.seconds * 1000);
    }

    if (date instanceof Date) return date;

    const parsed = new Date(date);
    if (!isNaN(parsed)) return parsed;

    return null;
  };

  function timeAgo(ts) {
    if (!ts) return "Just now";
    const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
    const diff = (Date.now() - d.getTime()) / 1000;

    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  useEffect(() => {
    function handleOutsideClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    }

    if (showSort) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showSort]);

  useEffect(() => {
    if (!user) return;

    const unsub1 = onSnapshot(collection(db, "services"), (snap) => {
      setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
      setServices24(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubUser = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedIds(snap.data()?.savedJobs || []);
    });

    return () => {
      unsub1();
      unsub2();
      unsubUser();
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setUserProfile(snap.data());
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setNotifications([]); // Clear notifications if logged out
        return;
      }

      // Set up your notifications listener here
      const q = query(collection(db, "notifications"), where("clientUid", "==", user.uid));

      const unsubscribeNotif = onSnapshot(q, (snap) => {
        const filtered = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((n) => n.type !== "hire_request");

        setNotifications(filtered);
      });

      // Cleanup listener when user logs out or component unmounts
      return () => unsubscribeNotif();
    });

    // Cleanup auth listener on unmount
    return () => unsubscribeAuth();
  }, []);

  async function acceptNotif(item) {
    try {
      await updateDoc(doc(db, "notifications", item.id), { read: true });

      navigate("/chat", {
        state: {
          currentUid: auth.currentUser.uid,
          otherUid: item.freelancerId,
          otherName: item.freelancerName,
          otherImage: item.freelancerImage,
          initialMessage: `Your application for ${item.jobTitle} accepted!`,
        },
      });
    } catch (error) {
      console.error("Error accepting notification:", error);
    }
  }

  async function declineNotif(item) {
    try {
      await deleteDoc(doc(db, "notifications", item.id));
    } catch (error) {
      console.error("Error declining notification:", error);
    }
  }

  const incrementViewOnce = async (collectionName, jobId) => {
    try {
      const ref = doc(db, collectionName, jobId);

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) return;

        const viewedBy = snap.data().viewedBy || [];
        if (viewedBy.includes(user.uid)) return;

        tx.update(ref, {
          views: (snap.data().views || 0) + 1,
          viewedBy: arrayUnion(user.uid),
        });
      });
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  };

  const applyFilter = (jobs) => {
    return jobs
      .filter((j) => {
        const title = (j.title || "").toLowerCase();
        const category = (j.category || "").toLowerCase();
        const skills = j.skills || [];

        if (search) {
          const q = search.toLowerCase();
          if (
            !title.includes(q) &&
            !category.includes(q) &&
            !skills.some((s) => s.toLowerCase().includes(q))
          )
            return false;
        }

        if (filter.categories.length && !filter.categories.includes(j.category))
          return false;

        if (
          filter.skills.length &&
          !skills.some((s) => filter.skills.includes(s))
        )
          return false;

        const from = Number(j.budget_from ?? j.budget ?? 0);
        const to = Number(j.budget_to ?? j.budget ?? from);

        if (filter.minPrice !== null && to < filter.minPrice) return false;
        if (filter.maxPrice !== null && from > filter.maxPrice) return false;

        if (filter.deliveryTime) {
          const createdDate = getJobDate(j.createdAt || j.postedAt);

          if (!createdDate) return true;

          const now = new Date();
          const diffDays =
            (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

          if (filter.deliveryTime === "today") {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            return createdDate >= startOfToday;
          }

          if (filter.deliveryTime === "3d") return diffDays <= 3;
          if (filter.deliveryTime === "7d") return diffDays <= 7;
          if (filter.deliveryTime === "30d") return diffDays <= 30;
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === "Newest")
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        if (sort === "Oldest")
          return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
        return 0;
      });
  };

  const jobs = useMemo(() => {
    if (tab === "Work") return applyFilter(services.map(j => ({ ...j, _type: "WORK" })));
    if (tab === "24 Hours") return applyFilter(services24.map(j => ({ ...j, _type: "24H" })));

    return [...services.map(j => ({ ...j, _type: "WORK" })),
    ...services24.map(j => ({ ...j, _type: "24H" }))]
      .filter((j) => savedIds.includes(j.id));
  }, [tab, services, services24, savedIds, search, filter, sort]);


  const toggleSave = async (jobId, isSaved) => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        savedJobs: isSaved ? arrayRemove(jobId) : arrayUnion(jobId),
      });
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  return (
    <div
      style={{
        padding: isMobile ? "16px" : 210,
        marginTop: isMobile ? "0px" : "-160px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          onClick={() => navigate(-1)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 14,
            border: "0.8px solid #E0E0E0",
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
            flexShrink: 0,
          }}
        >
          <img
            src={backarrow}
            alt="Back"
            style={{
              width: 16,
              height: 18,
              objectFit: "contain",
            }}
          />
        </div>

        <div>
          <div style={{ fontSize: 32, fontWeight: 400 }}>
            Explore Freelancer
          </div>
        </div>
      </div>

      <div
        id="fh-header-right"
        className="fh-header-right"
        style={{
          marginTop: "1px",
          marginRight: isMobile ? "0px" : "190px",
        }}
      >
        <img
          onClick={() => navigate("/client-dashbroad2/messages")}
          style={{ width: "26px", cursor: "pointer" }}
          src={message}
          alt="message"
        />

        <div
          className="ibtan"
          onClick={() => setNotifOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <img src={notifiaction} alt="notification" />
          {pending > 0 && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "red",
                position: "absolute",
                top: 6,
                right: 5,
              }}
            />
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          width: "100%",
        }}
      >
        {/* LEFT – SEARCH */}
        <div
          style={{
            display: "flex",
            marginTop: "34px",
            alignItems: "center",
            gap: "8px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            width: "100%",
            height: "44px",
          }}
        >
          <img
            src={search1}
            alt="search"
            style={{
              width: 18,
              height: 18,
              opacity: 0.6,
              marginLeft: "13px",
            }}
          />

          <input
            id="job-search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              marginLeft: "0px",
              height: "19px",
              lineHeight: "21px",
              padding: "0",
              marginTop: "12px",
            }}
          />
        </div>
      </div>

      {showSort && (
        <div
          ref={sortRef}
          id="sort-wrapper"
          style={{
            position: "absolute",
            marginLeft: isMobile ? "0px" : "470px",
            marginTop: isMobile ? "70px" : "130px",
            background: "#fff",
            borderRadius: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            padding: "16px",
            zIndex: 1000,
            width: isMobile ? "90%" : "360px",
            left: isMobile ? "5%" : "auto",
          }}
        >
          {["Newest", "Oldest", "Availability"].map((s, i) => (
            <button
              key={s}
              onClick={() => {
                setSort(s);
                setShowSort(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                marginBottom: "10px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 500,
                background: sort === s ? "#7C3CFF" : "#f9f9f9",
                color: sort === s ? "#fff" : "#333",
                opacity: showSort ? 1 : 0,
                transform: showSort ? "translateY(0px)" : "translateY(10px)",
                transition: "all 0.35s ease",
                transitionDelay: `${i * 0.12}s`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "18px",
          boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {["Work", "24 Hours", "Saved"].map((t) => {
            const isActive = tab === t;

            return (
              <span
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "7px 28px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#FFFFFF" : "#333",
                  background: isActive ? "#7C3CFF" : "transparent",
                  boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.15)" : "none",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </span>
            );
          })}
        </div>
      </div>

      {notifOpen && (
            <>
              {/* Overlay */}
              <div
                onClick={() => setNotifOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
    
                  zIndex: 9998,
                }}
              />
    
              {/* Panel */}
              <div
                style={{
                  position: "fixed",
                  top: 100,
                  right: 170,
                  width: 420,
                  maxHeight: "75vh",
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  zIndex: 9999,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #eee",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FiBell />
                    Notifications ({notifications.length})
                  </div>
                </div>
    
                {/* Scroll Area */}
                <div style={{ overflowY: "auto" }}>
                  {notifications.length === 0 && (
                    <div style={{ padding: 30, textAlign: "center", color: "#777" }}>
                      No notifications
                    </div>
                  )}
    
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: 16,
                        borderBottom: "1px solid #f2f2f2",
                        gap: 14,
                      }}
                    >
                      {/* Avatar */}
                      <img
                        src={
                          item.freelancerImage ||
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt=""
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
    
                      {/* Text */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>
                          {item.freelancerName}
                        </div>
                        <div style={{ fontSize: 13, color: "#666" }}>
                          Applied for {item.jobTitle}
                        </div>
                      </div>
    
                      {/* Action Buttons */}
                      {!item.read ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => acceptNotif(item)}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              border: "1px solid #d1fae5",
                              background: "#ecfdf5",
                              color: "#10b981",
                              cursor: "pointer",
                            }}
                          >
                            ✓
                          </button>
    
                          <button
                            onClick={() => declineNotif(item)}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              border: "1px solid #fee2e2",
                              background: "#fef2f2",
                              color: "#ef4444",
                              cursor: "pointer",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => acceptNotif(item)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 20,
                            border: "none",
                            background: "#9050FF",
                            color: "#fff",
                            fontSize: 13,
                            cursor: "pointer",
                          }}
                        >
                          Chat
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

      {/* FILTER + SORT BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "space-between" : "flex-end",
          width: "100%",
          padding: "10px 14px",
          marginTop: "15px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* LEFT – FILTER */}
        <div
          onClick={() => setShowFilter(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          <img src={filter1} alt="Filter" style={{ width: 18, height: 18 }} />
          <span>Filter</span>
        </div>

        {/* RIGHT – SORT */}
        <div
          onClick={() => setShowSort(!showSort)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          <img src={sortimg} alt="Sort" style={{ width: 18, height: 18 }} />
          <span>Sort</span>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {jobs.length === 0 && <p>No jobs found</p>}

        {jobs.map((job) => {
          const isSaved = savedIds.includes(job.id);
          return (
            <div
              key={job.id}
              onClick={() => {
                const is24 = job._type === "24H";

                incrementViewOnce(is24 ? "service_24h" : "services", job.id);

                if (is24) {
                  navigate(`/client-dashbroad2/service-24h/${job.id}`);
                } else {
                  navigate(`/client-dashbroad2/service/${job.id}`);
                }
              }}



              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "22px",
                marginBottom: 22,
                cursor: "pointer",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
                  {job.title}
                </h3>

                <div id="job-budget" className="job-budget">
                  ₹{job.budget_from || job.budget} - {job.budget_to || job.budget}
                </div>
              </div>
              <div
                style={{
                  fontSize: "14",
                  marginTop: "10px",
                  color: "gray",
                  fontWeight: "400",
                }}
              >
                Skills Required
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  margin: "12px 0",
                  flexWrap: "wrap",
                }}
              >
                {(job.skills || []).slice(0, 3).map((s) => (
                  <span
                    key={s}
                    style={{
                      background: "#FFF085B2",
                      padding: isMobile ? "4px 10px" : "6px 14px",
                      borderRadius: 999,
                      fontSize: isMobile ? 11 : 13,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s}
                  </span>
                ))}

                {job.skills?.length > 3 && (
                  <span
                    style={{
                      background: "#FFF085B2",
                      padding: isMobile ? "4px 10px" : "6px 14px",
                      borderRadius: 999,
                      fontSize: isMobile ? 11 : 13,
                      fontWeight: 500,
                    }}
                  >
                    +{job.skills.length - 3}
                  </span>
                )}
              </div>

              <p
                style={{
                  fontSize: 14,
                  color: "#555",
                  lineHeight: 1.6,
                  marginBottom: 14,
                }}
              >
                {job.description?.slice(0, 320)}
                {job.description?.length > 200 ? "..." : ""}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 18,
                    fontSize: 13,
                    color: "#777",
                  }}
                >
                  <span
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <FiEye /> {job.views || 0} Impression
                  </span>
                  <span
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <Clock size={14} />
                    {timeAgo(job.createdAt)}
                  </span>
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: 60,
                    right: 20,
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(job.id, savedIds.includes(job.id));
                  }}
                >
                  {savedIds.includes(job.id) ? (
                    <BsBookmarkFill size={20} />
                  ) : (
                    <Bookmark size={20} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showFilter && (
        <div style={modalStyle}>
          <FilterScreen
            initialFilter={filter}
            onClose={() => setShowFilter(false)}
            onApply={(appliedFilter) => {
              setFilter(appliedFilter);
              setShowFilter(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  zIndex: 999,
  overflowY: "auto",
};