// //WebMessage_list.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// import { db, auth, rtdb } from "../../firbase/Firebase";

// import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";

// import {
//   ref as rRef,
//   onValue,
//   get,
//   query as rQuery,
//   orderByChild,
//   limitToLast,
//   update as rUpdate,
//   set as rSet,
//   remove as rRemove,
// } from "firebase/database";

// import { v4 as uuidv4 } from "uuid";
// import search1 from "../../assets/search.png";
// import backarrow from "../../assets/backarrow.png";

// // ---------------- CSS INJECTION (NEW UI) ----------------
// const css = `
// .chatlist-page {
//   min-height: 100vh;
//   width: 100vw;
//   margin-left:10px;
//   display: flex;
//   justify-content: center;
//   align-items: flex-start;
//   padding: 32px 16px;
//   box-sizing: border-box;
//   font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
// }

// /* Wrapper that holds header + search + white card */
// .chatlist-shell {
//   width: 920px;
//   max-width: 100%;
// }

// /* Main white card (ONLY list area like in screenshot) */
// .chatlist-card {
//   width: 100%;
//   background: #ffffff;
//   border-radius: 28px;
//   padding: 18px 18px 16px;
//   margin-top: 22px;
//   box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
//   box-sizing: border-box;
// }

// /* Header row (on yellow bg, outside card) */
// .chatlist-header {
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   margin-bottom: 20px;
// }

// .chatlist-back-btn {
//   width: 36px;
//   height: 36px;
//   border-radius: 999px;
//   border: none;
//   background: #ffffff;
//   box-shadow: 0 5px 18px rgba(0,0,0,0.18);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
// }

// .chatlist-back-icon {
//   width: 0;
//   height: 0;
//   border-top: 5px solid transparent;
//   border-bottom: 5px solid transparent;
//   border-right: 7px solid #111827;
//   transform: translateX(-1px);
// }

// .chatlist-title-wrapper {
//   display: flex;
//   flex-direction: column;
// }

// .chatlist-title {
//   font-size: 28px;
//   font-weight: 700;
//   color: #111827;
// }

// /* Search bar (floating card like screenshot) */
// .chatlist-search-wrapper {
//   margin-bottom: 10px;

// }

// .chatlist-search-wrapper-inner {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   border-radius: 20px;
//   padding: 11px 16px;
//   box-shadow: 0 10px 26px rgba(0,0,0,0.14);
// }

// .chatlist-search-icon img {
//   display: block;
// }

// .chatlist-search-input {
//   flex: 1;
//   border: none;
//   outline: none;
//   font-size: 14px;
//   color: #111827;
//   background: transparent;
// }

// .chatlist-search-input::placeholder {
//   color: #9ca3af;
// }

// .chatlist-search-clear {
//   font-size: 14px;
//   cursor: pointer;
//   opacity: 0.5;
// }

// /* Request text on right top of list (inside white card) */
// .chatlist-request-row {
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
//   margin-bottom: 8px;
// }

// .chatlist-request-pill {
//   font-size: 13px;
//   font-weight: 600;
//   color: #7c3aed;
//   cursor: pointer;
// }

// /* List area */
// .chatlist-list {
//   max-height: 520px;
//   overflow-y: auto;
//   padding: 4px 4px 4px 2px;
// }

// /* Single row */
// .chatlist-item {
//   display: flex;
//   align-items: center;
//   padding: 12px 4px;
//   border-bottom: 1px solid #eef0f4;
//   cursor: pointer;
// }

// .chatlist-avatar-wrapper {
//   margin-right: 10px;
// }

// .chatlist-avatar {
//   width: 40px;
//   height: 40px;
//   border-radius: 999px;
//   object-fit: cover;
//   box-shadow: 0 4px 10px rgba(0,0,0,0.12);
// }

// .chatlist-item-content {
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   gap: 3px;
// }

// .chatlist-name-row {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// }

// .chatlist-name {
//   font-size: 14px;
//   font-weight: 600;
//   color: #111827;
// }

// .chatlist-time {
//   font-size: 11px;
//   color: #9ca3af;
// }

// .chatlist-lastmsg {
//   font-size: 12px;
//   color: #6b7280;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }

// /* Right column – role + ticks */
// .chatlist-right-col {
//   display: flex;
//   flex-direction: column;
//   align-items: flex-end;
//   gap: 6px;
//   margin-left: 8px;
// }

// .chatlist-role {
//   font-size: 11px;
//   color: #9ca3af;
// }

// .chatlist-tick-icon {
//   font-size: 14px;
// }

// /* Loading / empty states */
// .chatlist-loading-wrapper {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 40px 0;
// }

// .chatlist-spinner {
//   width: 26px;
//   height: 26px;
//   border-radius: 999px;
//   border: 3px solid #e5e7eb;
//   border-top-color: #7c3aed;
//   animation: chatlist-spin 0.8s linear infinite;
// }

// .chatlist-empty-inner {
//   padding: 28px 0;
//   text-align: center;
//   font-size: 13px;
//   color: #9ca3af;
// }

// /* Delete modal */
// .chatlist-modal-backdrop {
//   position: fixed;
//   inset: 0;
//   background: rgba(15,23,42,0.45);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 40;
// }

// .chatlist-modal {
//   width: 320px;
//   background: #ffffff;
//   border-radius: 18px;
//   box-shadow: 0 18px 40px rgba(0,0,0,0.40);
//   padding: 18px 18px 14px;
//   box-sizing: border-box;
// }

// .chatlist-modal-title-row {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin-bottom: 8px;
// }

// .chatlist-modal-title-icon {
//   width: 28px;
//   height: 28px;
//   border-radius: 999px;
//   background: #fef2f2;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// .chatlist-modal-title-text {
//   font-size: 16px;
//   font-weight: 600;
// }

// .chatlist-modal-body {
//   font-size: 14px;
//   color: #4b5563;
//   margin-bottom: 14px;
// }

// .chatlist-modal-actions {
//   display: flex;
//   justify-content: flex-end;
//   gap: 10px;
// }

// .chatlist-btn {
//   padding: 8px 14px;
//   border-radius: 999px;
//   border: none;
//   font-size: 13px;
//   cursor: pointer;
// }

// .chatlist-btn-ghost {
//   background: #f3f4f6;
//   color: #111827;
// }

// .chatlist-btn-danger {
//   background: #ef4444;
//   color: #ffffff;
// }

// /* spinner keyframes */
// @keyframes chatlist-spin {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }

// /* Scrollbar subtle */
// .chatlist-list::-webkit-scrollbar {
//   width: 4px;
// }
// .chatlist-list::-webkit-scrollbar-track {
//   background: transparent;
// }
// .chatlist-list::-webkit-scrollbar-thumb {
//   background: #e5e7eb;
//   border-radius: 999px;
// }
// `;

// if (
//   typeof document !== "undefined" &&
//   !document.getElementById("chatlist-screen-styles")
// ) {
//   const style = document.createElement("style");
//   style.id = "chatlist-screen-styles";
//   style.innerHTML = css;
//   document.head.appendChild(style);
// }

// // ---------------- HELPERS ----------------
// function convertTimestampsJS(value) {
//   if (value === null || value === undefined) return value;

//   if (typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
//     return typeof value.toMillis === "function"
//       ? value.toMillis()
//       : value.seconds * 1000;
//   }

//   if (value instanceof Date) return value.getTime();
//   if (Array.isArray(value)) return value.map(convertTimestampsJS);

//   if (typeof value === "object") {
//     const o = {};
//     Object.entries(value).forEach(([k, v]) => {
//       o[k] = convertTimestampsJS(v);
//     });
//     return o;
//   }

//   return value;
// }

// function formatTimeLabel(ts) {
//   if (!ts) return "";
//   const date = new Date(ts);
//   const now = new Date();
//   const diff = now - date;
//   const days = diff / 86400000;

//   if (days < 1)
//     return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
//   if (days < 2) return "Yesterday";
//   if (days < 7) return date.toLocaleDateString([], { weekday: "long" });
//   return date.toLocaleDateString([], { month: "short", day: "numeric" });
// }

// // ------------------------------------------------------------
// //                     MAIN COMPONENT
// // ------------------------------------------------------------

// export default function ChatListScreen({ currentUid: propUid, sharedJob = null }) {
//   const navigate = useNavigate();
//   const currentUid = propUid || auth.currentUser?.uid || null;

//   // ⭐ 1️⃣ SIDEBAR COLLAPSED STATE (NEW)
//   const [collapsed, setCollapsed] = useState(
//     typeof window !== "undefined" &&
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   const [userRole, setUserRole] = useState("");
//   const [search, setSearch] = useState("");
//   const [requestCount, setRequestCount] = useState(0);

//   const [chats, setChats] = useState([]);
//   const [chatItems, setChatItems] = useState([]);
//   const [loadingChats, setLoadingChats] = useState(true);
//   const [chatError, setChatError] = useState("");

//   const [deleteState, setDeleteState] = useState({
//     open: false,
//     chat: null,
//     name: "",
//   });

//   const userCacheRef = useRef({}); // FULL USER PROFILE CACHE

//   // ⭐ 2️⃣ LISTEN FOR SIDEBAR TOGGLE EVENT (NEW)
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // ------------------------------------------------------------
//   //                 LOAD USER ROLE
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid) return;

//     const load = async () => {
//       try {
//         const snap = await getDoc(doc(db, "users", currentUid));
//         if (snap.exists()) {
//           const role = (snap.data().role || "").toLowerCase();
//           setUserRole(role);
//         }
//       } catch (e) {
//         console.log("role error", e);
//       }
//     };

//     load();
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //             REQUEST COUNT LISTENER
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid) return;

//     const colRef = collection(db, "requests", currentUid, "users");
//     const unsub = onSnapshot(colRef, (s) => setRequestCount(s.size));

//     return () => unsub();
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //             LISTEN TO ALL CHATS (Realtime DB)
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!currentUid || !rtdb) return;

//     setLoadingChats(true);

//     const refUserChats = rRef(rtdb, `userChats/${currentUid}`);
//     let cancelled = false;

//     const unsub = onValue(
//       refUserChats,
//       async (snapshot) => {
//         if (cancelled) return;

//         const val = snapshot.val();
//         if (!val) {
//           setChats([]);
//           setLoadingChats(false);
//           return;
//         }

//         const entries = Object.entries(val);

//         const list = await Promise.all(
//           entries.map(async ([chatId, raw]) => {
//             const withUid = raw.withUid || raw.with || "";
//             let lastMessage = raw.lastMessage || "";
//             let lastMessageTime = raw.lastMessageTime || 0;

//             try {
//               const msgQuery = rQuery(
//                 rRef(rtdb, `chats/${chatId}/messages`),
//                 orderByChild("timestamp"),
//                 limitToLast(1)
//               );

//               const msgSnap = await get(msgQuery);

//               if (msgSnap.exists()) {
//                 const first = Object.values(msgSnap.val())[0];

//                 if (first.type === "job") {
//                   const jobTitle =
//                     first.jobData?.title ||
//                     first.jobData?.sub_category ||
//                     "Job Shared";
//                   lastMessage = `[Job] ${jobTitle}`;
//                 } else {
//                   lastMessage = first.text || "[Attachment]";
//                 }

//                 lastMessageTime = first.timestamp || lastMessageTime;
//               }
//             } catch (e) {
//               console.log("msg error", e);
//             }

//             return { chatId, withUid, lastMessage, lastMessageTime };
//           })
//         );

//         const sorted = list.sort(
//           (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
//         );

//         setChats(sorted);
//         setLoadingChats(false);
//       },
//       (err) => {
//         console.log("listen error", err);
//         if (!cancelled) {
//           setChats([]);
//           setLoadingChats(false);
//           setChatError("Error loading chats");
//         }
//       }
//     );

//     return () => {
//       cancelled = true;
//       unsub();
//     };
//   }, [currentUid]);

//   // ------------------------------------------------------------
//   //                FETCH USER DATA FOR EACH CHAT
//   // ------------------------------------------------------------
//   useEffect(() => {
//     const load = async () => {
//       if (!chats.length) return setChatItems([]);

//       const res = await Promise.all(
//         chats.map(async (chat) => {
//           if (!chat.withUid) return null;

//           if (!userCacheRef.current[chat.withUid]) {
//             const snap = await getDoc(doc(db, "users", chat.withUid));
//             userCacheRef.current[chat.withUid] = snap.exists()
//               ? snap.data()
//               : {};
//           }

//           return { chat, userData: userCacheRef.current[chat.withUid] };
//         })
//       );

//       setChatItems(res.filter(Boolean));
//     };

//     load();
//   }, [chats]);

//   // ------------------------------------------------------------
//   //                       SEARCH FILTER
//   // ------------------------------------------------------------
//   function filteredChatItems() {
//     let list = chatItems;

//     // remove job-only rows for this screen (UI matches screenshot – only people)
//     list = list.filter(
//       (i) => !String(i.chat.lastMessage || "").startsWith("[Job]")
//     );

//     if (!search.trim()) return list;

//     const q = search.trim().toLowerCase();

//     return list.filter((i) => {
//       const full = `${i.userData.first_name || ""} ${i.userData.last_name || ""
//         }`
//         .trim()
//         .toLowerCase();
//       return full.includes(q);
//     });
//   }


//   async function isPendingRequest(chat) {
//   if (!chat.lastMessage?.startsWith("[Job]")) return false;

//   try {
//     const snapshot = await get(
//       rRef(rtdb, `chats/${chat.chatId}/messages`)
//     );

//     if (!snapshot.exists()) return false;

//     const messages = Object.values(snapshot.val());
//     const lastMsg = messages[messages.length - 1];

//     if (lastMsg.type === "job") {
//       const jobId = lastMsg.jobData?.id;
//       const messageId = lastMsg.id;

//       const q = collection(db, "myWorks");

//       // 🔥 IMPORTANT → filter manually
//       const snap = await getDocs(q);

//       const match = snap.docs.find(
//         (d) =>
//           d.data().jobId === jobId &&
//           d.data().receiverId === currentUid &&
//           d.data().messageId === messageId
//       );

//       return match?.data()?.status === "sent";
//     }
//   } catch (e) {
//     console.log("pending check error", e);
//   }

//   return false;
// }

//   // ------------------------------------------------------------
//   //          SHARE JOB MESSAGE (IF SHAREDJOB EXISTS)
//   // ------------------------------------------------------------
//   async function sendJobMessageToChat(chatId, receiverId, job) {
//     try {
//       const now = Date.now();
//       const msgId = uuidv4();

//       const msgRef = rRef(rtdb, `chats/${chatId}/messages/${msgId}`);

//       await rSet(msgRef, {
//         id: msgId,
//         type: "job",
//         jobData: convertTimestampsJS(job),
//         senderId: currentUid,
//         receiverId,
//         timestamp: now,
//         status: "sent",
//       });

//       const title = job.title || job.sub_category || "Job";
//       const text = `[Job] ${title}`;

//       const updates = {};
//       updates[`userChats/${currentUid}/${chatId}`] = {
//         withUid: receiverId,
//         lastMessage: text,
//         lastMessageTime: now,
//       };
//       updates[`userChats/${receiverId}/${chatId}`] = {
//         withUid: currentUid,
//         lastMessage: text,
//         lastMessageTime: now,
//       };

//       await rUpdate(rRef(rtdb), updates);
//     } catch (e) {
//       console.log("job share error", e);
//     }
//   }

//   // ------------------------------------------------------------
//   //                       DELETE CHAT
//   // ------------------------------------------------------------
//   async function deleteChat(chat) {
//     await rRemove(rRef(rtdb, `userChats/${currentUid}/${chat.chatId}`));
//     await rRemove(rRef(rtdb, `chats/${chat.chatId}`));
//     setDeleteState({ open: false, chat: null, name: "" });
//   }

//   // ------------------------------------------------------------
//   //                       RENDER
//   // ------------------------------------------------------------

//   const list = filteredChatItems();

//   if (!currentUid) {
//     return (
//       <div
//         style={{
//           marginLeft: collapsed ? "-120px" : "-110px",
//           transition: "margin-left 0.25s ease",
//         }}
//       >
//         <div className="chatlist-page">
//           <div className="chatlist-shell">
//             <div className="chatlist-header">
//               <button
//                 className="chatlist-back-btn"
//                 onClick={() => navigate(-1)}
//               >
//                 <span className="chatlist-back-icon" />
//               </button>
//               <div className="chatlist-title-wrapper">
//                 <div className="chatlist-title">Message</div>
//               </div>
//             </div>

//             <div className="chatlist-search-wrapper">
//               <div className="chatlist-search-wrapper-inner">
//                 <span className="chatlist-search-icon">
//                   <img src={search1} style={{ width: "18px" }} alt="search" />
//                 </span>
//                 <input
//                   className="chatlist-search-input"
//                   placeholder="Search"
//                   disabled
//                 />
//               </div>
//             </div>

//             <div className="chatlist-card">
//               <div className="chatlist-loading-wrapper">
//                 Login to see messages
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         marginLeft: collapsed ? "-110px" : "-10x",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       {/* Delete Modal */}
//       {deleteState.open && (
//         <div className="chatlist-modal-backdrop">
//           <div className="chatlist-modal">
//             <div className="chatlist-modal-title-row">
//               <div className="chatlist-modal-title-icon">🗑</div>
//               <div className="chatlist-modal-title-text">Delete Chat</div>
//             </div>
//             <div className="chatlist-modal-body">
//               Delete chat with <b>{deleteState.name}</b>?
//             </div>
//             <div className="chatlist-modal-actions">
//               <button
//                 className="chatlist-btn chatlist-btn-ghost"
//                 onClick={() =>
//                   setDeleteState({ open: false, chat: null, name: "" })
//                 }
//               >
//                 Cancel
//               </button>
//               <button
//                 className="chatlist-btn chatlist-btn-danger"
//                 onClick={() => deleteChat(deleteState.chat)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Layout */}
//       <div className="chatlist-page">
//         <div className="chatlist-shell">
//           {/* Header on gradient */}
//           <div className="chatlist-header">
//             <div style={{ display: "flex", alignItems: "center", gap: 12, }}>
//               <div
//                 onClick={() => navigate(-1)}
//                 style={{
//                   width: 36,
//                   height: 36,
//                   borderRadius: 14,
//                   border: "0.8px solid #E0E0E0",
//                   backgroundColor: "#FFFFFF",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   cursor: "pointer",
//                   boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
//                   flexShrink: 0,

//                 }}
//               >
//                 <img
//                   src={backarrow}
//                   alt="Back"
//                   style={{
//                     width: 16,
//                     height: 18,
//                     objectFit: "contain",
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="chatlist-title-wrapper">
//               <div className="chatlist-title">Message</div>
//             </div>
//           </div>

//           {/* Search on gradient */}
//           <div className="chatlist-search-wrapper">
//             <div className="chatlist-search-wrapper-inner">
//               <span className="chatlist-search-icon">
//                 <img src={search1} style={{ width: "18px" }} alt="search" />
//               </span>
//               <input
//                 className="chatlist-search-input"
//                 placeholder="Search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               {search.trim() && (
//                 <span
//                   className="chatlist-search-clear"
//                   onClick={() => setSearch("")}
//                 >
//                   ✕
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* White Card with Request + List */}
//           <div className="chatlist-card">
//             {userRole === "freelancer" && (
//               <div className="chatlist-request-row">
//                 <div
//                   className="chatlist-request-pill"
//                   onClick={() =>
//                     navigate("/request-chats", { state: { currentUid } })
//                   }
//                 >

//                   {requestCount > 0 && (
//                     <span className="chatlist-request-badge">
//                       ({requestCount})
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}

//             <div className="chatlist-list">
//               {loadingChats ? (
//                 <div className="chatlist-loading-wrapper">
//                   <div className="chatlist-spinner" />
//                 </div>
//               ) : chatError ? (
//                 <div className="chatlist-empty-inner">Error loading chats</div>
//               ) : !list.length ? (
//                 <div className="chatlist-empty-inner">No messages</div>
//               ) : (
//                 list.map(({ chat, userData }) => {
//                  const firstName =
//   userData.firstName || userData.first_name || "";

// const lastName =
//   userData.lastName || userData.last_name || "";

// const name = `${firstName} ${lastName}`.trim();
//                   const imageUrl = userData.profileImage || "";
//                   const time = formatTimeLabel(chat.lastMessageTime);

//                   const onRowClick = async () => {
//                     if (sharedJob) {
//                       await sendJobMessageToChat(
//                         chat.chatId,
//                         chat.withUid,
//                         sharedJob
//                       );
//                       alert("Job shared");
//                       navigate(-1);
//                       return;
//                     }

//                     navigate("/chat", {
//                       state: {
//                         currentUid,
//                         otherUid: chat.withUid,
//                         otherProfile: userData,
//                         otherName: name,
//                         otherImage: imageUrl,
//                       },
//                     });
//                   };

//                   return (
//                     <div
//                       key={chat.chatId}
//                       className="chatlist-item"
//                       onClick={onRowClick}
//                       onContextMenu={(e) => {
//                         e.preventDefault();
//                         setDeleteState({
//                           open: true,
//                           chat,
//                           name: first_name || first_name,
//                         });
//                       }}
//                     >
//                       <div className="chatlist-avatar-wrapper">
//                         <img
//                           src={
//                             imageUrl || "https://i.ibb.co/sqsJwP0/user.png"
//                           }
//                           className="chatlist-avatar"
//                           alt="profile"
//                         />
//                       </div>

//                       <div className="chatlist-item-content">
//                         <div className="chatlist-name-row">
//                           <div className="chatlist-name">
//                             {name || "Users"}
//                           </div>
//                           <div className="chatlist-time">{time}</div>
//                         </div>

//                       </div>

//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// WebMessage_list.jsx
// Fully converted from message_list.dart — feature-for-feature parity

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth, rtdb } from "../../firbase/Firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  limit,
} from "firebase/firestore";
import {
  ref as rRef,
  onValue,
  get,
  query as rQuery,
  orderByChild,
  limitToLast,
  update as rUpdate,
  set as rSet,
  remove as rRemove,
} from "firebase/database";
import { v4 as uuidv4 } from "uuid";

// ─────────────────────────────────────────────────────────────────────────────
//  CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ml-root {
  font-family: 'Rubik', sans-serif;
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  padding: 0;
}

.ml-shell {
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  background: #fff;
  min-height: 100vh;
}

/* ── AppBar ── */
.ml-appbar {
  background: #fff;
  padding: 20px 20px 12px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
}
.ml-appbar-title {
  font-size: 22px;
  font-weight: 500;
  color: #1a1a1a;
}

/* ── Search Bar ── */
.ml-search-wrap {
  padding: 10px 16px 6px;
}
.ml-search-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #bdbdbd;
  border-radius: 10px;
  padding: 10px 14px;
  background: #fff;
  transition: border-color 0.2s;
}
.ml-search-inner:focus-within {
  border-color: #9e9e9e;
  border-width: 1.5px;
}
.ml-search-icon {
  color: #736f6f;
  font-size: 18px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.ml-search-input {
  flex: 1;
  border: none;
  outline: none;
  font-family: 'Rubik', sans-serif;
  font-size: 16px;
  color: #1a1a1a;
  background: transparent;
}
.ml-search-input::placeholder { color: #736f6f; }
.ml-search-clear {
  cursor: pointer;
  color: #736f6f;
  font-size: 16px;
  display: flex;
  align-items: center;
  padding: 2px 4px;
}
.ml-search-clear:hover { color: #333; }

/* ── Requests Button (freelancer only) ── */
.ml-requests-row {
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px 4px;
}
.ml-requests-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  user-select: none;
}
.ml-requests-pill:hover {
  background: #f5f8ff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.ml-requests-label {
  font-size: 14px;
  font-weight: 500;
  color: #1976d2;
}
.ml-requests-badge {
  background: #e51e1e;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  padding: 1px 7px;
  min-width: 20px;
  text-align: center;
  line-height: 18px;
}

/* ── Chat List ── */
.ml-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

/* ── Chat Item ── */
.ml-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.12s;
  position: relative;
}
.ml-item:hover { background: #fafafa; }
.ml-item:active { background: #f0f0f0; }

.ml-divider {
  height: 1px;
  background: #e0e0e0;
  margin-left: 72px;
  margin-right: 16px;
}

.ml-avatar-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fdfd96;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 12px;
}
.ml-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  background: #eeeeee;
}
.ml-avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
  font-size: 26px;
}

.ml-content {
  flex: 1;
  min-width: 0;
}
.ml-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ml-last-msg {
  font-size: 14px;
  font-weight: 400;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 3px;
}

.ml-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  margin-left: 12px;
  flex-shrink: 0;
}
.ml-time {
  font-size: 12px;
  color: #9e9e9e;
}
.ml-tick {
  font-size: 14px;
  color: #64b5f6;
}

/* ── Empty State ── */
.ml-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
  gap: 0;
}
.ml-empty-icon {
  font-size: 80px;
  opacity: 0.18;
  margin-bottom: 20px;
  line-height: 1;
}
.ml-empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}
.ml-empty-sub {
  font-size: 14px;
  color: #757575;
  line-height: 1.5;
}

/* ── Loading ── */
.ml-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.ml-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e0e0e0;
  border-top-color: #1976d2;
  border-radius: 50%;
  animation: ml-spin 0.75s linear infinite;
}
@keyframes ml-spin { to { transform: rotate(360deg); } }

/* ── Delete Confirm Modal ── */
.ml-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.ml-modal {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.22);
}
.ml-modal-title {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
}
.ml-modal-body {
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.5;
}
.ml-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.ml-btn {
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-family: 'Rubik', sans-serif;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.15s;
}
.ml-btn:hover { opacity: 0.82; }
.ml-btn-cancel { background: #f0f0f0; color: #333; }
.ml-btn-delete { background: #e53935; color: #fff; }

/* ── Snackbar ── */
.ml-snack {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #ef5350;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Rubik', sans-serif;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0,0,0,0.22);
  animation: ml-snack-in 0.2s ease;
}
.ml-snack-success { background: #43a047; }
@keyframes ml-snack-in {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
`;

function injectCSS() {
  if (typeof document !== "undefined" && !document.getElementById("ml-styles")) {
    const el = document.createElement("style");
    el.id = "ml-styles";
    el.innerHTML = CSS;
    document.head.appendChild(el);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Recursively convert Firestore Timestamp objects to millisecond integers */
function convertTimestamps(value) {
  if (value === null || value === undefined) return value;
  if (
    typeof value === "object" &&
    "seconds" in value &&
    "nanoseconds" in value
  ) {
    return typeof value.toMillis === "function"
      ? value.toMillis()
      : value.seconds * 1000;
  }
  if (value instanceof Date) return value.getTime();
  if (Array.isArray(value)) return value.map(convertTimestamps);
  if (typeof value === "object") {
    const out = {};
    Object.entries(value).forEach(([k, v]) => {
      out[k] = convertTimestamps(v);
    });
    return out;
  }
  return value;
}

/** Format a millisecond timestamp the same way as message_list.dart */
function formatTime(ts) {
  if (!ts) return "";
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = diffMs / 86400000;

  if (diffDays < 1) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } else if (diffDays < 2) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "long" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

/** Deterministic chat ID matching the mobile getChatId helper */
function getChatId(uid1, uid2) {
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SNACKBAR HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useSnackbar() {
  const [snack, setSnack] = useState(null); // { msg, success }
  const timerRef = useRef(null);

  const show = useCallback((msg, success = false) => {
    clearTimeout(timerRef.current);
    setSnack({ msg, success });
    timerRef.current = setTimeout(() => setSnack(null), 3000);
  }, []);

  return { snack, show };
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ChatListScreen({
  currentUid: propUid,
  sharedJob = null,
}) {
  injectCSS();
  const navigate = useNavigate();

  // Resolve current user uid
  const currentUid = propUid || auth?.currentUser?.uid || null;

  // ── State ────────────────────────────────────────────────────────────────
  const [userRole, setUserRole]           = useState(""); // 'freelancer' | 'client' | ''
  const [searchQuery, setSearchQuery]     = useState("");
  const [pendingCount, setPendingCount]   = useState(0); // real-time badge from myWorks

  // Raw list from RTDB (mirrors userChatsProvider)
  const [chats, setChats]                 = useState([]);   // UserChatItem[]
  const [loadingChats, setLoadingChats]   = useState(true);
  const [chatError, setChatError]         = useState("");

  // Enriched list after userData + pending-filter resolution
  const [chatItems, setChatItems]         = useState([]);   // [{chat, userData}]
  const [loadingItems, setLoadingItems]   = useState(false);

  // Delete confirmation modal
  const [deleteModal, setDeleteModal]     = useState({ open: false, chat: null, name: "" });

  // Snackbar
  const { snack, show: showSnack }        = useSnackbar();

  // In-memory user profile cache (mirrors _userCache Map in Dart)
  const userCacheRef = useRef({});

  // ── Sidebar collapsed (kept from original web version) ───────────────────
  const [collapsed, setCollapsed]         = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("sidebar-collapsed") === "true"
  );
  useEffect(() => {
    const handler = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handler);
    return () => window.removeEventListener("sidebar-toggle", handler);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  //  1.  LOAD USER ROLE  (mirrors _loadUserRole)
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUid) return;
    getDoc(doc(db, "users", currentUid))
      .then((snap) => {
        if (snap.exists()) {
          setUserRole((snap.data().role || "").toLowerCase());
        }
      })
      .catch((e) => console.error("role load error:", e));
  }, [currentUid]);

  // ─────────────────────────────────────────────────────────────────────────
  //  2.  REAL-TIME PENDING COUNT BADGE  (mirrors StreamBuilder in Dart)
  //      Listens to myWorks where receiverId == currentUid && status == 'sent'
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUid) return;

    const q = query(
      collection(db, "myWorks"),
      where("receiverId", "==", currentUid),
      where("status", "==", "sent")
    );

    const unsub = onSnapshot(
      q,
      (snap) => setPendingCount(snap.size),
      (err) => console.error("pending count error:", err)
    );

    return () => unsub();
  }, [currentUid]);

  // ─────────────────────────────────────────────────────────────────────────
  //  3.  REAL-TIME CHAT LIST FROM RTDB  (mirrors userChatsProvider)
  //      - Listens to userChats/{uid}
  //      - For each chat, fetches the last message from chats/{chatId}/messages
  //      - Sorts descending by lastMessageTime
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUid || !rtdb) return;

    setLoadingChats(true);
    let cancelled = false;

    const userChatsRef = rRef(rtdb, `userChats/${currentUid}`);

    const unsub = onValue(
      userChatsRef,
      async (snapshot) => {
        if (cancelled) return;

        const val = snapshot.val();
        if (!val || typeof val !== "object") {
          setChats([]);
          setLoadingChats(false);
          return;
        }

        try {
          const entries = Object.entries(val);

          const chatList = await Promise.all(
            entries.map(async ([chatId, raw]) => {
              const chatData = raw || {};
              const withUid = chatData.withUid || chatData.with || "";
              let lastMessage = chatData.lastMessage || "";
              let lastMessageTime =
                typeof chatData.lastMessageTime === "number"
                  ? chatData.lastMessageTime
                  : 0;

              // Fetch last message from RTDB (same as Dart version)
              try {
                const msgQ = rQuery(
                  rRef(rtdb, `chats/${chatId}/messages`),
                  orderByChild("timestamp"),
                  limitToLast(1)
                );
                const msgSnap = await get(msgQ);

                if (msgSnap.exists() && typeof msgSnap.val() === "object") {
                  const lastMsgData = Object.values(msgSnap.val())[0];

                  if (lastMsgData.type === "job") {
                    const title =
                      lastMsgData.jobData?.title ||
                      lastMsgData.jobData?.sub_category ||
                      "Job Shared";
                    lastMessage = `[Job] ${title}`;
                  } else {
                    lastMessage = lastMsgData.text || "[Attachment]";
                  }

                  lastMessageTime = lastMsgData.timestamp || lastMessageTime;
                }
              } catch (e) {
                console.warn("last-msg fetch error for", chatId, e);
              }

              return { chatId, withUid, lastMessage, lastMessageTime };
            })
          );

          // Sort descending by lastMessageTime (same as Dart .sort)
          chatList.sort(
            (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
          );

          if (!cancelled) {
            setChats(chatList);
            setLoadingChats(false);
            setChatError("");
          }
        } catch (e) {
          console.error("userChats listener error:", e);
          if (!cancelled) {
            setLoadingChats(false);
            setChatError("Error loading chats");
          }
        }
      },
      (err) => {
        console.error("userChats onValue error:", err);
        if (!cancelled) {
          setLoadingChats(false);
          setChatError("Error loading chats");
        }
      }
    );

    return () => {
      cancelled = true;
      unsub();
    };
  }, [currentUid]);

  // ─────────────────────────────────────────────────────────────────────────
  //  4.  FETCH USER DATA + FILTER PENDING  (mirrors _buildChatList's FutureBuilder)
  //      For every chat:
  //        a) Call _isPendingRequest — if true, skip (belongs in Requests screen)
  //        b) Fetch user profile (with cache)
  //        c) Build enriched item
  // ─────────────────────────────────────────────────────────────────────────

  /** Mirrors _getUserData — fetches from Firestore with in-memory cache */
  const getUserData = useCallback(async (uid) => {
    if (!uid) return null;
    if (userCacheRef.current[uid]) return userCacheRef.current[uid];
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data();
        userCacheRef.current[uid] = data;
        return data;
      }
    } catch (e) {
      console.error("getUserData error for", uid, e);
    }
    return null;
  }, []);

  /**
   * Mirrors _isPendingRequest:
   * Returns true ONLY if lastMessage starts with '[Job]' AND
   * there is a myWorks doc with status == 'sent' matching jobId + messageId + receiverId.
   * These chats are EXCLUDED from the main list (shown in Requests screen instead).
   */
  const isPendingRequest = useCallback(
    async (chat) => {
      if (!chat.lastMessage?.startsWith("[Job]")) return false;

      let jobId = null;
      let messageId = null;

      // Attempt 1: parse from lastMessage JSON (same as Dart try-block)
      try {
        const jsonStr = chat.lastMessage.substring("[Job] ".length);
        const parsed = JSON.parse(jsonStr);
        jobId = parsed.jobId?.toString();
        messageId = parsed.messageId?.toString();
      } catch (_) {
        // Fallback: read last message directly from RTDB (same as Dart catch-block)
        try {
          const msgQ = rQuery(
            rRef(rtdb, `chats/${chat.chatId}/messages`),
            orderByChild("timestamp"),
            limitToLast(1)
          );
          const snap = await get(msgQ);
          if (snap.exists() && typeof snap.val() === "object") {
            const lastMsgData = Object.values(snap.val())[0];
            if (lastMsgData.type === "job" && lastMsgData.jobData) {
              jobId = lastMsgData.jobData.id?.toString();
              messageId = lastMsgData.id?.toString();
            }
          }
        } catch (e2) {
          console.warn("isPendingRequest fallback error:", e2);
          return false;
        }
      }

      if (!jobId || !messageId) return false;

      // Check myWorks with Firestore query (same as Dart)
      try {
        const q = query(
          collection(db, "myWorks"),
          where("jobId", "==", jobId),
          where("receiverId", "==", currentUid),
          where("messageId", "==", messageId),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const status = snap.docs[0].data().status?.toString();
          return status === "sent"; // true = still pending → exclude from main list
        }
      } catch (e) {
        console.error("isPendingRequest Firestore check error:", e);
      }

      return false;
    },
    [currentUid]
  );

  useEffect(() => {
    if (!chats.length) {
      setChatItems([]);
      return;
    }

    let cancelled = false;
    setLoadingItems(true);

    const resolve = async () => {
      const results = await Promise.all(
        chats.map(async (chat) => {
          // KEY FIX (same as Dart): skip pending requests
          const pending = await isPendingRequest(chat);
          if (pending) return null;

          const userData = await getUserData(chat.withUid);
          if (!userData) return null;

          return { chat, userData };
        })
      );

      if (!cancelled) {
        setChatItems(results.filter(Boolean));
        setLoadingItems(false);
      }
    };

    resolve().catch((e) => {
      console.error("resolve chatItems error:", e);
      if (!cancelled) setLoadingItems(false);
    });

    return () => {
      cancelled = true;
    };
  }, [chats, isPendingRequest, getUserData]);

  // ─────────────────────────────────────────────────────────────────────────
  //  5.  SEARCH FILTER  (mirrors the search filter in _buildChatList)
  // ─────────────────────────────────────────────────────────────────────────
  function filteredItems() {
    if (!searchQuery.trim()) return chatItems;
    const q = searchQuery.trim().toLowerCase();
    return chatItems.filter(({ userData }) => {
      const first = userData.firstName || userData.first_name || "";
      const last  = userData.lastName  || userData.last_name  || "";
      return `${first} ${last}`.toLowerCase().includes(q);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  6.  DELETE CHAT  (mirrors _deleteChat — only removes currentUser's ref)
  // ─────────────────────────────────────────────────────────────────────────
  async function deleteChat(chat) {
    try {
      await rRemove(
        rRef(rtdb, `userChats/${currentUid}/${chat.chatId}`)
      );
      setDeleteModal({ open: false, chat: null, name: "" });
      showSnack("Chat deleted successfully", false);
    } catch (e) {
      console.error("deleteChat error:", e);
      showSnack("Failed to delete chat", false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  7.  SEND JOB MESSAGE  (mirrors sendJobMessage in Dart)
  // ─────────────────────────────────────────────────────────────────────────
  async function sendJobMessage({ chatId, receiverId, job }) {
    const me = auth?.currentUser;
    if (!me) { console.error("sendJobMessage: not authenticated"); return; }

    try {
      const now   = Date.now();
      const msgId = uuidv4();

      let cleanedJob = convertTimestamps({ ...job });
      // Remove null values (same as Dart removeWhere)
      Object.keys(cleanedJob).forEach(
        (k) => cleanedJob[k] == null && delete cleanedJob[k]
      );
      if (!cleanedJob.createdAt) cleanedJob.createdAt = now;

      const messageData = {
        id:          msgId,
        type:        "job",
        jobData:     cleanedJob,
        senderId:    me.uid,
        receiverId,
        timestamp:   now,
        status:      "sent",
        reactions:   {},
        actionTaken: false,
        accepted:    false,
        acceptedBy:  "",
        acceptedAt:  "",
      };

      // Write to myWorks (Firestore)
      const myWorksId = uuidv4();
      const { setDoc } = await import("firebase/firestore");
      await setDoc(doc(db, "myWorks", myWorksId), {
        jobId:      cleanedJob.id,
        jobData:    cleanedJob,
        status:     "sent",
        senderId:   me.uid,
        receiverId,
        chatId,
        messageId:  msgId,
        sentAt:     now,
      });

      // Write message to RTDB
      await rSet(rRef(rtdb, `chats/${chatId}/messages/${msgId}`), messageData);

      // Update userChats for both users (same dual-write as Dart)
      const lastMessageText = `[Job] ${
        cleanedJob.title || cleanedJob.sub_category || "[Job]"
      }`;
      const updates = {
        [`userChats/${me.uid}/${chatId}`]: {
          lastMessage:     lastMessageText,
          lastMessageTime: now,
          with:            receiverId,
        },
        [`userChats/${receiverId}/${chatId}`]: {
          lastMessage:     lastMessageText,
          lastMessageTime: now,
          with:            me.uid,
        },
      };

      await rUpdate(rRef(rtdb), updates);
      console.log("Job shared message sent ✅");
    } catch (e) {
      console.error("sendJobMessage error:", e);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  function Avatar({ imageUrl, size = 56 }) {
    const [failed, setFailed] = useState(false);
    if (imageUrl && !failed) {
      return (
        <img
          src={imageUrl}
          alt="profile"
          className="ml-avatar"
          style={{ width: size, height: size }}
          onError={() => setFailed(true)}
        />
      );
    }
    return (
      <div className="ml-avatar-placeholder" style={{ width: size, height: size }}>
        <span>👤</span>
      </div>
    );
  }

  function EmptyState() {
    return (
      <div className="ml-empty">
        <div className="ml-empty-icon">💬</div>
        <div className="ml-empty-title">Start new message</div>
        <div className="ml-empty-sub">
          Once you start collaborating, your{"\n"}conversations will appear here.
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────
  const visibleItems = filteredItems();
  const isLoading    = loadingChats || loadingItems;

  return (
    <div
      style={{
        marginLeft: collapsed ? "-110px" : "0px",
        transition: "margin-left 0.25s ease",
      }}
    >
      {/* ── Delete Confirmation Modal ── */}
      {deleteModal.open && (
        <div className="ml-modal-backdrop">
          <div className="ml-modal">
            <div className="ml-modal-title">Delete Chat</div>
            <div className="ml-modal-body">
              Are you sure you want to delete the chat with{" "}
              <strong>{deleteModal.name}</strong>?
            </div>
            <div className="ml-modal-actions">
              <button
                className="ml-btn ml-btn-cancel"
                onClick={() =>
                  setDeleteModal({ open: false, chat: null, name: "" })
                }
              >
                Cancel
              </button>
              <button
                className="ml-btn ml-btn-delete"
                onClick={() => deleteChat(deleteModal.chat)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Snackbar ── */}
      {snack && (
        <div
          className={`ml-snack ${snack.success ? "ml-snack-success" : ""}`}
        >
          {snack.msg}
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className="ml-root">
        <div className="ml-shell">

          {/* AppBar */}
          <div className="ml-appbar">
            <span className="ml-appbar-title">Message</span>
          </div>

          {/* Search Bar */}
          <div className="ml-search-wrap">
            <div className="ml-search-inner">
              <span className="ml-search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#736f6f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                className="ml-search-input"
                placeholder="Search...."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <span
                  className="ml-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </span>
              )}
            </div>
          </div>

          {/* Requests Button — freelancer only (mirrors Dart conditional) */}
          {userRole === "freelancer" && (
            <div className="ml-requests-row">
              <div
                className="ml-requests-pill"
                onClick={() =>
                  navigate("/request-chats", { state: { currentUid } })
                }
              >
                <span className="ml-requests-label">Requests</span>
                {pendingCount > 0 && (
                  <span className="ml-requests-badge">
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Chat List */}
          {isLoading ? (
            <div className="ml-loading">
              <div className="ml-spinner" />
            </div>
          ) : chatError ? (
            <EmptyState />
          ) : visibleItems.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="ml-list">
              {visibleItems.map(({ chat, userData }, index) => {
                const firstName = userData.firstName || userData.first_name || "";
                const lastName  = userData.lastName  || userData.last_name  || "";
                const name      = `${firstName} ${lastName}`.trim() || "User";
                const imageUrl  = userData.profileImage || "";
                const time      = formatTime(chat.lastMessageTime);
                const lastMsg   = chat.lastMessage || "No messages yet";
                const isLast    = index === visibleItems.length - 1;

                const handleClick = async () => {
                  // If a sharedJob was passed, send it then go back (mirrors Dart sharedJob flow)
                  if (sharedJob) {
                    const chatId = getChatId(currentUid, chat.withUid);
                    await sendJobMessage({
                      chatId,
                      receiverId: chat.withUid,
                      job: sharedJob,
                    });
                    showSnack("Job shared!", true);
                    setTimeout(() => navigate(-1), 1000);
                    return;
                  }

                  navigate("/chat", {
                    state: {
                      currentUid,
                      otherUid:     chat.withUid,
                      otherProfile: userData,
                      otherName:    name,
                      otherImage:   imageUrl,
                    },
                  });
                };

                const handleLongPress = (e) => {
                  e.preventDefault();
                  setDeleteModal({ open: true, chat, name });
                };

                return (
                  <React.Fragment key={chat.chatId}>
                    <div
                      className="ml-item"
                      onClick={handleClick}
                      onContextMenu={handleLongPress}
                    >
                      {/* Avatar with yellow ring (mirrors Container + CircleAvatar in Dart) */}
                      <div className="ml-avatar-ring">
                        <Avatar imageUrl={imageUrl} size={56} />
                      </div>

                      {/* Name + Last Message */}
                      <div className="ml-content">
                        <div className="ml-name">{name}</div>
                        <div className="ml-last-msg">{lastMsg}</div>
                      </div>

                      {/* Time + Tick */}
                      <div className="ml-meta">
                        <span className="ml-time">{time}</span>
                        <span className="ml-tick">✓</span>
                      </div>
                    </div>

                    {/* Divider (mirrors ListView.separated in Dart) */}
                    {!isLast && <div className="ml-divider" />}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}