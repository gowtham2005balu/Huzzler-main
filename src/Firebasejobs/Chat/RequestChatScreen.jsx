// // components/RequestChatScreen.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { getDatabase, ref as dbRef, onValue, push, set, update } from "firebase/database";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// /**
//  * This screen shows request-type chats (notifications) for freelancer,
//  * and allows opening a chat route (and seeds initial message if needed).
//  *
//  * It assumes 'notifications' Firestore collection exists.
//  */

// export default function RequestChatScreen() {
//   const firestore = getFirestore();
//   const db = getDatabase();
//   const navigate = useNavigate();

//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Example: get current user UID from your auth (simplified)
//   // Replace with your auth.currentUser
//   const currentUid = (typeof window !== "undefined" && window.__CURRENT_UID) || null;

//   useEffect(() => {
//     // Listener for user's notifications (for freelancer)
//     // For demo: we read all notifications collection where receiver is currentUid
//     if (!currentUid) {
//       setLoading(false);
//       return;
//     }

//     // Here we use Firestore snapshot in your app; since we use getFirestore above,
//     // you should implement a Firestore listener. For brevity we skip realtime code.
//     (async () => {
//       try {
//         // naive fetch: all notifications where freelancerId == currentUid
//         // Replace with real query + onSnapshot in production
//         // Example assumes you know how to query; using getDoc not shown here
//         setLoading(false);
//         setRequests([]); // fill with fetched requests
//       } catch (e) {
//         setLoading(false);
//       }
//     })();
//   }, [currentUid, firestore]);

//   async function openOrCreateChat(clientUid, initialMessage) {
//     if (!currentUid) return;
//     if (!clientUid) return;
//     const chatId = [currentUid, clientUid].sort().join("_");

//     // Ensure last message meta and initial message exist
//     // Write initial message if chat/messages empty
//     const messagesRef = dbRef(db, `chats/${chatId}/messages`);
//     const newMsgRef = push(messagesRef);
//     const now = Date.now();
//     const payload = {
//       id: newMsgRef.key,
//       text: initialMessage || "Hi, I accepted your request",
//       senderId: clientUid, // who initiated: client
//       receiverId: currentUid,
//       timestamp: now,
//       type: "text",
//     };
//     await set(newMsgRef, payload);

//     // update userChats meta for both
//     const metaA = { with: currentUid, lastMessage: payload.text, lastMessageTime: now };
//     const metaB = { with: clientUid, lastMessage: payload.text, lastMessageTime: now };
//     await update(dbRef(db, `userChats/${clientUid}/${chatId}`), metaA);
//     await update(dbRef(db, `userChats/${currentUid}/${chatId}`), metaB);

//     // navigate to chat
//     navigate("/chat", { state: { chatId, currentUid, otherUid: clientUid, otherName: "Client" } });
//   }

//   return (
//     <div style={{ padding: 16 }}>
//       <h2>Request Chats</h2>
//       <div>
//         {loading ? <div>Loading...</div> : requests.length === 0 ? <div>No requests</div> : requests.map((r) => (
//           <div key={r.id} style={{ padding: 12, border: "1px solid #eee", marginBottom: 8 }}>
//             <div style={{ fontWeight: 600 }}>{r.title}</div>
//             <div style={{ color: "#666", marginTop: 6 }}>{r.description}</div>
//             <div style={{ marginTop: 8 }}>
//               <button onClick={() => openOrCreateChat(r.clientUid, r.initialMessage)} style={{ padding: "8px 12px", background: "#0b93f6", color: "#fff", borderRadius: 8 }}>
//                 Open Chat
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



// RequestChatscreen.jsx
// Full conversion of RequestChatscreen.dart → React Web
// Features: job cards, accept/decline, image upload, file upload,
// emoji picker, search, delete (context menu), seen/sent ticks,
// date headers, online status, hire prompt, scroll-to-bottom

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  getDatabase,
  ref as dbRef,
  onValue,
  set,
  update,
  remove,
  query as dbQuery,
  orderByChild,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  query as fsQuery,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  setDoc,
  serverTimestamp,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db as firestoreDb } from "../../firbase/Firebase"; // adjust path
import { useLocation, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { v4 as uuidv4 } from "uuid";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDateHeader = (date) => {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yest  = new Date(today); yest.setDate(yest.getDate() - 1);
  const d     = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (d.getTime() === today.getTime()) return "Today";
  if (d.getTime() === yest.getTime())  return "Yesterday";
  return date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
};

const generateChatId = (u1, u2) => (u1 < u2 ? `${u1}_${u2}` : `${u2}_${u1}`);

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

// ─── Guard wrapper ─────────────────────────────────────────────────────────────

export default function RequestChatscreen() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  if (!state?.currentUid || !state?.otherUid) {
    return (
      <div style={S.errorFull}>
        ⚠ Chat cannot open — missing UID values.
      </div>
    );
  }

  return (
    <RequestChatInner
      currentUid={state.currentUid}
      otherUid={state.otherUid}
      otherName={state.otherName || "User"}
      otherImage={state.otherImage || ""}
      initialMessage={state.initialMessage || null}
      navigate={navigate}
    />
  );
}

// ─── Inner chat ────────────────────────────────────────────────────────────────

function RequestChatInner({ currentUid, otherUid, otherName, otherImage, initialMessage, navigate }) {
  const chatId  = generateChatId(currentUid, otherUid);
  const db      = getDatabase();
  const storage = getStorage();
  const auth    = getAuth();

  // ── State ──
  const [messages,        setMessages]        = useState([]);
  const [inputText,       setInputText]       = useState("");
  const [showEmoji,       setShowEmoji]       = useState(false);
  const [isSending,       setIsSending]       = useState(false);
  const [isSearching,     setIsSearching]     = useState(false);
  const [searchQuery,     setSearchQuery]     = useState("");
  const [lastActiveInfo,  setLastActiveInfo]  = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [myWorkStatuses,  setMyWorkStatuses]  = useState({});    // messageId → myWorks data
  const [uploadProgress,  setUploadProgress]  = useState({});    // msgId → 0..1
  const [contextMenu,     setContextMenu]     = useState(null);  // {msg, x, y}
  const [deleteTarget,    setDeleteTarget]    = useState(null);
  const [hireDialogData,  setHireDialogData]  = useState(null);  // {myWorksDocId, jobId, jobTitle}
  const [showFreelancerHireConfirm, setShowFreelancerHireConfirm] = useState(null);

  // ── Refs ──
  const scrollRef       = useRef(null);
  const inputRef        = useRef(null);
  const initialSentRef  = useRef(false);
  const myWorkUnsubsRef = useRef({});

  // ── Fetch current user role ────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    getDoc(doc(firestoreDb, "users", currentUid)).then((snap) => {
      if (!active || !snap.exists()) return;
      setCurrentUserRole((snap.data()?.role ?? "").toLowerCase());
    });
    return () => { active = false; };
  }, [currentUid]);

  // ── Last active / online status ────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    getDoc(doc(firestoreDb, "users", otherUid)).then((snap) => {
      if (!active || !snap.exists()) return;
      const data = snap.data();
      const la   = data?.lastActive;
      if (!la) return;
      const ms = la?.seconds ? la.seconds * 1000 : (typeof la === "number" ? la : null);
      if (ms) setLastActiveInfo(new Date(ms));
    });
    return () => { active = false; };
  }, [otherUid]);

  // ── Messages listener ───────────────────────────────────────────────────────
  useEffect(() => {
    const msgQ = dbQuery(
      dbRef(db, `chats/${chatId}/messages`),
      orderByChild("timestamp")
    );
    return onValue(msgQ, (snap) => {
      const raw  = snap.val() || {};
      const list = Object.values(raw).sort((a, b) => a.timestamp - b.timestamp);
      setMessages(list);
      requestAnimationFrame(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }));
    });
  }, [db, chatId]);

  // ── Mark received messages as seen ─────────────────────────────────────────
  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.receiverId === currentUid && msg.status === "sent" && msg.id) {
        update(dbRef(db, `chats/${chatId}/messages/${msg.id}`), { status: "seen" });
      }
    });
  }, [messages, chatId, currentUid, db]);

  // ── Subscribe myWorks for job messages ─────────────────────────────────────
  useEffect(() => {
    messages
      .filter((m) => m.type === "job")
      .forEach((msg) => {
        const mid = msg.id;
        if (!mid || myWorkUnsubsRef.current[mid]) return;
        const q = fsQuery(
          collection(firestoreDb, "myWorks"),
          where("messageId", "==", mid),
          limit(1)
        );
        const unsub = onSnapshot(q, (snap) => {
          if (!snap.empty) {
            setMyWorkStatuses((prev) => ({ ...prev, [mid]: snap.docs[0].data() }));
          }
        });
        myWorkUnsubsRef.current[mid] = unsub;
      });
  }, [messages]);

  useEffect(() => () => Object.values(myWorkUnsubsRef.current).forEach((u) => u()), []);

  // ── Send initial job message (once) ────────────────────────────────────────
  useEffect(() => {
    if (!initialMessage || initialSentRef.current) return;
    initialSentRef.current = true;
    sendInitialJobMessage(initialMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Chat meta update ────────────────────────────────────────────────────────
  const updateChatMeta = useCallback(async (lastMessage, timestamp) => {
    await update(dbRef(db, `userChats/${currentUid}/${chatId}`), {
      with: otherUid, lastMessage, lastMessageTime: timestamp,
    });
    await update(dbRef(db, `userChats/${otherUid}/${chatId}`), {
      with: currentUid, lastMessage, lastMessageTime: timestamp,
    });
  }, [db, chatId, currentUid, otherUid]);

  const storeRequestChat = useCallback(async (message, now) => {
    let jobTitle = "";
    if (message.includes("[Job]")) {
      jobTitle = message.replace("[Job]", "").trim();
    }
    const common = { requestStatus: "pending", requestedAt: now, ...(jobTitle ? { jobTitle } : {}) };
    await update(dbRef(db), {
      [`requestChats/${currentUid}/${chatId}`]: { ...common, requestedTo: otherUid },
      [`requestChats/${otherUid}/${chatId}`]:   { ...common, requestedBy: currentUid },
    });
  }, [db, chatId, currentUid, otherUid]);

  // ── Send initial job message ────────────────────────────────────────────────
  const sendInitialJobMessage = async (message) => {
    if (!message.trim()) return;
    try {
      let jobData = null;
      if (message.startsWith("📢 Job shared:")) {
        const raw = message.substring("📢 Job shared:".length).trim();
        try { jobData = JSON.parse(raw); } catch (_) {}
      }

      const msgId = uuidv4();
      const now   = Date.now();
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      if (jobData?.id) {
        await set(dbRef(db, `chats/${chatId}/messages/${msgId}`), {
          id: msgId, senderId: currentUid, receiverId: otherUid,
          type: "job", jobData, timestamp: now, status: "sent",
          reactions: {}, actionTaken: false, accepted: false,
        });
        await setDoc(doc(firestoreDb, "myWorks", uuidv4()), {
          jobId: jobData.id, jobData, status: "sent",
          senderId: userId, receiverId: otherUid,
          chatId, messageId: msgId, sentAt: now,
        });
        const lm = `[Job] ${JSON.stringify({ jobId: jobData.id, messageId: msgId, title: jobData.title ?? "Job Shared" })}`;
        await updateChatMeta(lm, now);
        await storeRequestChat(lm, now);
      } else {
        await set(dbRef(db, `chats/${chatId}/messages/${msgId}`), {
          id: msgId, senderId: currentUid, receiverId: otherUid,
          type: "text", text: message, timestamp: now, status: "sent",
          reactions: {}, actionTaken: false, accepted: false,
        });
        await updateChatMeta(message, now);
        await storeRequestChat(message, now);
      }
    } catch (e) {
      console.error("Error sending initial message:", e);
    }
  };

  // ── Send text message ───────────────────────────────────────────────────────
  const sendTextMessage = async () => {
    const text = inputText.trim();
    if (!text || isSending) return;
    setIsSending(true);
    setInputText("");
    const msgId = uuidv4();
    const now   = Date.now();
    try {
      await set(dbRef(db, `chats/${chatId}/messages/${msgId}`), {
        id: msgId, senderId: currentUid, receiverId: otherUid,
        type: "text", text, timestamp: now, status: "sent", reactions: {},
      });
      await updateChatMeta(text, now);
    } catch (e) {
      console.error("Send error:", e);
    } finally {
      setIsSending(false);
    }
  };

  // ── Send image ──────────────────────────────────────────────────────────────
  const sendImage = async (file) => {
    if (!file) return;
    const msgId    = uuidv4();
    const now      = Date.now();
    const fileName = `${msgId}.jpg`;
    const sRef     = storageRef(storage, `chat_media/${chatId}/${fileName}`);
    const task     = uploadBytesResumable(sRef, file);

    task.on("state_changed", (snap) => {
      const p = snap.bytesTransferred / (snap.totalBytes || 1);
      setUploadProgress((prev) => ({ ...prev, [msgId]: p }));
    });

    try {
      await task;
      const url = await getDownloadURL(sRef);
      await set(dbRef(db, `chats/${chatId}/messages/${msgId}`), {
        id: msgId, senderId: currentUid, receiverId: otherUid,
        type: "image", fileUrl: url, fileName,
        fileSize: file.size, timestamp: now, status: "sent", reactions: {},
      });
      await updateChatMeta("[Image]", now);
      setUploadProgress((prev) => { const n = { ...prev }; delete n[msgId]; return n; });
    } catch (e) {
      console.error("Image upload error:", e);
    }
  };

  // ── Send file ───────────────────────────────────────────────────────────────
  const sendFile = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("File too large. Max 5MB."); return; }
    const msgId    = uuidv4();
    const now      = Date.now();
    const safeName = file.name.replace(/\s+/g, "_");
    const sRef     = storageRef(storage, `chat_media/${chatId}/${msgId}_${safeName}`);
    const task     = uploadBytesResumable(sRef, file);

    task.on("state_changed", (snap) => {
      const p = snap.bytesTransferred / (snap.totalBytes || 1);
      setUploadProgress((prev) => ({ ...prev, [msgId]: p }));
    });

    try {
      await task;
      const url = await getDownloadURL(sRef);
      await set(dbRef(db, `chats/${chatId}/messages/${msgId}`), {
        id: msgId, senderId: currentUid, receiverId: otherUid,
        type: "file", fileUrl: url, fileName: safeName,
        fileSize: file.size, timestamp: now, status: "sent", reactions: {},
      });
      await updateChatMeta(`[File] ${safeName}`, now);
      setUploadProgress((prev) => { const n = { ...prev }; delete n[msgId]; return n; });
    } catch (e) {
      console.error("File upload error:", e);
    }
  };

  // ── Delete message ──────────────────────────────────────────────────────────
  const deleteMessage = async (msgId) => {
    try { await remove(dbRef(db, `chats/${chatId}/messages/${msgId}`)); }
    catch (e) { console.error("Delete error:", e); }
  };

  // ── Emoji reaction ──────────────────────────────────────────────────────────
  const addReaction = async (msgId, emoji) => {
    const rRef = dbRef(db, `chats/${chatId}/messages/${msgId}/reactions/${uuidv4()}`);
    await set(rRef, { emoji, userId: currentUid, timestamp: Date.now() });
  };

  // ── Fetch full job ──────────────────────────────────────────────────────────
  const fetchFullJob = async (jobId) => {
    try {
      let snap = await getDoc(doc(firestoreDb, "jobs", jobId));
      if (snap.exists()) return snap.data();
      snap = await getDoc(doc(firestoreDb, "jobs_24h", jobId));
      if (snap.exists()) return { ...snap.data(), is24h: true };
    } catch (e) { console.error("Fetch job error:", e); }
    return null;
  };

  // ── Job accept ──────────────────────────────────────────────────────────────
  const handleJobAccept = async (msg, jobId, messageId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    try {
      const snap = await getDocs(fsQuery(
        collection(firestoreDb, "myWorks"),
        where("jobId",     "==", jobId),
        where("chatId",    "==", chatId),
        where("messageId", "==", messageId),
        where("receiverId","==", userId),
        limit(1)
      ));
      if (snap.empty) { alert("No matching job request found"); return; }

      await updateDoc(doc(firestoreDb, "myWorks", snap.docs[0].id), {
        status: "accepted", freelancerId: userId, acceptedAt: serverTimestamp(),
      });
      await update(dbRef(db, `chats/${chatId}/messages/${messageId}`), {
        actionTaken: true, accepted: true,
      });
      const now = Date.now();
      await update(dbRef(db), {
        [`userChats/${currentUid}/${chatId}/lastMessage`]: "Freelancer accepted your job ✅",
        [`userChats/${currentUid}/${chatId}/lastMessageTime`]: now,
        [`userChats/${otherUid}/${chatId}/lastMessage`]: "You accepted the job 🎉",
        [`userChats/${otherUid}/${chatId}/lastMessageTime`]: now,
      });
      alert("Job accepted successfully");
    } catch (e) {
      console.error("Accept error:", e);
      alert("Failed to accept job");
    }
  };

  // ── Job decline ─────────────────────────────────────────────────────────────
  const handleJobDecline = async (msg, jobId, messageId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    try {
      const snap = await getDocs(fsQuery(
        collection(firestoreDb, "myWorks"),
        where("jobId",     "==", jobId),
        where("chatId",    "==", chatId),
        where("messageId", "==", messageId),
        where("receiverId","==", userId),
        limit(1)
      ));
      if (snap.empty) { alert("No matching job request found"); return; }

      await updateDoc(doc(firestoreDb, "myWorks", snap.docs[0].id), {
        status: "rejected", freelancerId: userId, declinedAt: serverTimestamp(),
      });
      await update(dbRef(db, `chats/${chatId}/messages/${messageId}`), {
        actionTaken: true, accepted: false,
      });
      alert("Job declined successfully");
    } catch (e) {
      console.error("Decline error:", e);
      alert("Failed to decline job");
    }
  };

  // ── Hire prompt (client only) ───────────────────────────────────────────────
  const showHirePrompt = async () => {
    const jobMsgs = [...messages].reverse()
      .filter((m) => m.type === "job" && m.senderId === currentUid);
    if (!jobMsgs.length) { alert("No job found in this chat to hire for"); return; }

    const latestJob = jobMsgs[0];
    const jobId     = latestJob.jobData?.id?.toString();
    const messageId = latestJob.id;
    if (!jobId || !messageId) { alert("Invalid job data"); return; }

    const snap = await getDocs(fsQuery(
      collection(firestoreDb, "myWorks"),
      where("jobId",     "==", jobId),
      where("chatId",    "==", chatId),
      where("messageId", "==", messageId),
      limit(1)
    ));
    if (snap.empty) { alert("No matching job request found"); return; }

    setHireDialogData({
      myWorksDocId: snap.docs[0].id,
      jobId,
      messageId,
      jobTitle: latestJob.jobData?.title ?? "Untitled Job",
    });
  };

  const confirmHire = async () => {
    if (!hireDialogData) return;
    try {
      await updateDoc(doc(firestoreDb, "myWorks", hireDialogData.myWorksDocId), {
        status: "pending_hire", clientConfirmedAt: serverTimestamp(),
      });
      setHireDialogData(null);
      setShowFreelancerHireConfirm({
        myWorksDocId: hireDialogData.myWorksDocId,
        jobId: hireDialogData.jobId,
        messageId: hireDialogData.messageId,
        jobTitle: hireDialogData.jobTitle,
      });
    } catch (e) {
      console.error("Hire confirm error:", e);
      alert("Failed to send hire request");
    }
  };

  const freelancerAcceptHire = async () => {
    if (!showFreelancerHireConfirm) return;
    const { myWorksDocId, messageId } = showFreelancerHireConfirm;
    try {
      await updateDoc(doc(firestoreDb, "myWorks", myWorksDocId), {
        status: "hired", hiredAt: serverTimestamp(), freelancerId: otherUid,
      });
      await update(dbRef(db, `chats/${chatId}/messages/${messageId}`), {
        actionTaken: true, accepted: true,
      });
      setShowFreelancerHireConfirm(null);
      alert("You have been hired for the job!");
    } catch (e) {
      console.error("Freelancer accept hire error:", e);
    }
  };

  const freelancerDeclineHire = async () => {
    if (!showFreelancerHireConfirm) return;
    const { myWorksDocId, messageId } = showFreelancerHireConfirm;
    try {
      await updateDoc(doc(firestoreDb, "myWorks", myWorksDocId), {
        status: "rejected", declinedAt: serverTimestamp(), freelancerId: otherUid,
      });
      await update(dbRef(db, `chats/${chatId}/messages/${messageId}`), {
        actionTaken: true, accepted: false,
      });
      setShowFreelancerHireConfirm(null);
      alert("You have declined the job.");
    } catch (e) {
      console.error("Freelancer decline hire error:", e);
    }
  };

  // ── Online status widget ────────────────────────────────────────────────────
  const renderOnlineStatus = () => {
    if (!lastActiveInfo) return <span style={S.statusText}>Offline</span>;
    const diffMs  = Date.now() - lastActiveInfo.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 5) return <span style={{ ...S.statusText, color: "#10B981" }}>Online</span>;
    if (diffMin < 1440) {
      const h = Math.floor(diffMin / 60), m = diffMin % 60;
      return <span style={S.statusText}>Last seen {h}h {m}m ago</span>;
    }
    return (
      <span style={S.statusText}>
        Last seen {lastActiveInfo.toLocaleDateString([], { month: "short", day: "numeric" })},{" "}
        {lastActiveInfo.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    );
  };

  // ── Build grouped items ─────────────────────────────────────────────────────
  const buildGrouped = (msgs) => {
    const items = []; let lastDay = null;
    for (const msg of msgs) {
      const d   = new Date(msg.timestamp);
      const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (!lastDay || day.getTime() !== lastDay.getTime()) {
        items.push({ type: "date", date: day }); lastDay = day;
      }
      items.push({ type: "message", data: msg });
    }
    return items;
  };

  const displayMessages = searchQuery
    ? messages.filter((m) =>
        (m.text || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.fileName || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const grouped = buildGrouped(displayMessages);

  // ── Job card ────────────────────────────────────────────────────────────────
  const renderJobCard = (msg, isMe) => {
    const jobData   = msg.jobData;
    const messageId = msg.id;
    if (!jobData) return <div style={S.errorCard}>⚠ Invalid job data</div>;

    const jobId    = jobData.id?.toString();
    const jobTitle = jobData.title || "Untitled Job";
    const category = jobData.category || "";
    const subCat   = jobData.sub_category || "";
    const budgetFrom = jobData.budget_from || "";
    const budgetTo   = jobData.budget_to   || "";
    const budget     = budgetFrom && budgetTo ? `₹${budgetFrom} – ₹${budgetTo}` : "";
    const is24h      = jobData.is24h === true;
    let timeline     = "";
    if (is24h) {
      const rawTs = jobData.startDateTime;
      const ms    = typeof rawTs === "number" ? rawTs : ((rawTs?.seconds || 0) * 1000);
      timeline    = ms ? new Date(ms).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "No date";
    } else {
      timeline = jobData.timeline || "";
    }

    const mw            = myWorkStatuses[messageId];
    const currentStatus = mw?.status;
    const actionTaken   = msg.actionTaken === true;
    const accepted      = msg.accepted    === true;

    let statusText  = "";
    let showButtons = false;

    if (mw) {
      if (currentStatus === "accepted") statusText = "I'm interested in this project";
      else if (currentStatus === "rejected") statusText = "Not interested in this project";
      else if (currentStatus === "sent" && currentUserRole === "client" && isMe) statusText = "Job sent";
    } else if (currentUserRole === "client" && isMe && !actionTaken) {
      statusText = "Job sent";
    }

    if (currentUserRole === "freelancer" && !actionTaken && !isMe) {
      showButtons = true;
    }

    return (
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", marginBottom: 4 }}
        onContextMenu={(e) => { e.preventDefault(); setContextMenu({ msg, x: e.clientX, y: e.clientY }); }}
      >
        <div style={{ ...S.jobCard, maxWidth: "min(85%, 460px)", margin: isMe ? "4px 8px 4px auto" : "4px auto 4px 8px" }}>
          {/* Header */}
          <div style={{ padding: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={S.jobIconBox}>🏢</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={S.jobTitle}>{jobTitle}</div>
              {(category || subCat) && (
                <div style={S.jobCategory}>{category && subCat ? `${category} > ${subCat}` : category || subCat}</div>
              )}
            </div>
          </div>

          {/* Budget + Timeline + View more */}
          {(budget || timeline) && (
            <div style={{ padding: "0 12px 0", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1 }}>
                {budget && (
                  <div style={S.infoBadge}><span>₹</span><span>{budget}</span></div>
                )}
                {timeline && (
                  <div style={{ ...S.infoBadge, marginTop: 4 }}><span>⏰</span><span>{timeline}</span></div>
                )}
              </div>
              <button
                style={S.viewMoreBtn}
                onClick={async () => {
                  const full = await fetchFullJob(jobId);
                  if (full) {
                    navigate(`/freelance-dashboard/serviceviewdetails/${jobId}`, {
                      state: { jobData: full, fromChat: true, currentUid, otherUid, chatId },
                    });
                  }
                }}
              >
                View more
              </button>
            </div>
          )}

          <div style={{ height: 16 }} />

          {/* Action bar */}
          <div style={S.actionBar}>
            {showButtons ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button style={S.acceptBtn} onClick={() => handleJobAccept(msg, jobId, messageId)}>Accept</button>
                <button style={S.declineBtn} onClick={() => handleJobDecline(msg, jobId, messageId)}>Decline</button>
              </div>
            ) : statusText ? (
              <span style={S.statusChipText}>{statusText}</span>
            ) : (
              <span style={S.statusChipText}>
                {currentUserRole === "client" && isMe ? "Job sent" : "Waiting for action"}
              </span>
            )}
          </div>
        </div>

        {/* Time + tick */}
        <div style={{ ...S.timeRow, justifyContent: isMe ? "flex-end" : "flex-start", padding: isMe ? "2px 20px 6px 0" : "2px 0 6px 20px" }}>
          <span style={S.timeText}>{formatTime(msg.timestamp)}</span>
          {isMe && <TickIcon status={msg.status} />}
        </div>
      </div>
    );
  };

  // ── Image bubble ────────────────────────────────────────────────────────────
  const renderImageBubble = (msg, isMe) => {
    const progress    = uploadProgress[msg.id];
    const isUploading = !!progress;
    return (
      <div
        style={{ maxWidth: "min(65%, 300px)", borderRadius: 12, overflow: "hidden", position: "relative", cursor: "pointer" }}
        onClick={() => msg.fileUrl && window.open(msg.fileUrl, "_blank")}
      >
        {msg.fileUrl && (
          <img
            src={msg.fileUrl}
            alt="img"
            style={{ width: "100%", display: "block", borderRadius: 12 }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}
        {isUploading && (
          <div style={S.uploadOverlay}>
            <div style={S.uploadCircle}>
              <svg viewBox="0 0 36 36" width="48" height="48">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#ccc" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none" stroke="#7C3AED" strokeWidth="3"
                  strokeDasharray={`${(progress || 0) * 94.2} 94.2`}
                  strokeLinecap="round" transform="rotate(-90 18 18)"
                />
              </svg>
              <span style={{ color: "white", fontSize: 12, marginTop: 4 }}>{Math.round((progress || 0) * 100)}%</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── File bubble ─────────────────────────────────────────────────────────────
  const renderFileBubble = (msg, isMe) => {
    const progress    = uploadProgress[msg.id];
    const isUploading = !!progress;
    return (
      <div style={{ maxWidth: "min(65%, 320px)", padding: "12px 14px", borderRadius: 12, background: isMe ? "#EDE9FE" : "#F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>📄</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {msg.fileName || "file"}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{formatFileSize(msg.fileSize || 0)}</div>
          </div>
          {msg.fileUrl && !isUploading && (
            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#7C3AED", fontSize: 20 }}>⬇</a>
          )}
        </div>
        {isUploading && (
          <div style={{ marginTop: 8, height: 4, background: "#E5E7EB", borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${(progress || 0) * 100}%`, background: "#7C3AED", borderRadius: 4 }} />
          </div>
        )}
      </div>
    );
  };

  // ── Text bubble ─────────────────────────────────────────────────────────────
  const renderTextBubble = (msg, isMe) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", marginBottom: 2 }}
      onContextMenu={(e) => { e.preventDefault(); setContextMenu({ msg, x: e.clientX, y: e.clientY }); }}
    >
      {!isMe && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, margin: "2px 8px" }}>
          <img
            src={otherImage || "https://i.ibb.co/sqsJwP0/user.png"}
            alt={otherName}
            style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
        </div>
      )}
      <div style={{ maxWidth: "min(75%, 420px)", margin: isMe ? "2px 8px 2px auto" : "2px auto 2px 46px",
        background: isMe ? "#DBEAFE" : "#E5E7EB",
        padding: "10px 14px", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        fontFamily: "'Poppins', sans-serif", fontSize: 15, lineHeight: 1.5, wordBreak: "break-word",
        color: "#111827",
      }}>
        {msg.type === "image" ? renderImageBubble(msg, isMe)
          : msg.type === "file" ? renderFileBubble(msg, isMe)
          : msg.text}
      </div>
      <div style={{ ...S.timeRow, justifyContent: isMe ? "flex-end" : "flex-start",
        padding: isMe ? "2px 20px 6px 0" : "2px 0 6px 46px" }}>
        <span style={S.timeText}>{formatTime(msg.timestamp)}</span>
        {isMe && <TickIcon status={msg.status} />}
      </div>
    </div>
  );

  // ── Message dispatcher ──────────────────────────────────────────────────────
  const renderMessage = (msg) => {
    const isMe = msg.senderId === currentUid;
    if (msg.type === "job") return renderJobCard(msg, isMe);
    return renderTextBubble(msg, isMe);
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const displayName = otherName.length > 15 ? otherName.slice(0, 15) + "…" : otherName;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={S.root} onClick={() => { setContextMenu(null); setShowEmoji(false); }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Rubik:wght@500;600&display=swap');
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:4px}
      `}</style>

      {/* ── AppBar ── */}
      <div style={S.appBar}>
        <button style={S.iconBtn} onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
        </button>

        {isSearching ? (
          <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages…" style={S.searchInput} />
        ) : (
          <div style={S.titleBlock}>
            <span style={S.titleName}>{displayName}</span>
            {renderOnlineStatus()}
          </div>
        )}

        {/* Hire button (client only) */}
        {!isSearching && currentUserRole === "client" && (
          <button style={S.iconBtn} title="Hire Freelancer" onClick={showHirePrompt}>
            💼
          </button>
        )}

        <button style={S.iconBtn} onClick={() => { setIsSearching((s) => !s); if (isSearching) setSearchQuery(""); }}>
          {isSearching ? <CloseIcon /> : <SearchIcon />}
        </button>
      </div>

      <div style={{ height: 1, background: "#E5E7EB", flexShrink: 0 }} />

      {/* ── Messages ── */}
      <div style={S.messagesList}>
        {grouped.length === 0 ? (
          <div style={S.emptyState}>
            <span style={{ fontSize: 52, opacity: 0.15 }}>💬</span>
            <span style={S.emptyText}>{searchQuery ? "No messages found" : "No messages yet"}</span>
          </div>
        ) : (
          grouped.map((item, idx) => {
            if (item.type === "date") {
              return (
                <div key={`d-${idx}`} style={S.dateWrap}>
                  <div style={S.datePill}>{formatDateHeader(item.date)}</div>
                </div>
              );
            }
            return <div key={item.data.id || idx}>{renderMessage(item.data)}</div>;
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* ── Waiting for response banner ── */}
      <div style={S.waitingBanner}>
        <span style={S.waitingText}>Waiting for freelancer's Response</span>
        <div style={S.waitingIcon}>⏰</div>
      </div>

      {/* ── Input bar ── */}
      <div style={{ flexShrink: 0, background: "white" }}>
        <div style={{ height: 1, background: "#E5E7EB" }} />
        <div style={S.inputBar}>
          <button style={{ ...S.iconBtn, color: "#7C3AED" }} onClick={(e) => { e.stopPropagation(); setShowEmoji((s) => !s); }}>
            <EmojiIconSvg />
          </button>

       

          <div style={S.textareaWrap}>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendTextMessage(); } }}
              placeholder="Message…"
              rows={1}
              style={S.textarea}
            />
          </div>

          <button
            onClick={sendTextMessage}
            disabled={!inputText.trim() || isSending}
            style={{ ...S.sendBtn, background: inputText.trim() ? "linear-gradient(135deg,#8B5CF6,#7C3AED)" : "rgba(124,58,237,0.3)", cursor: inputText.trim() ? "pointer" : "default" }}
          >
            <SendIcon />
          </button>
        </div>

        {showEmoji && (
          <div style={{ padding: "0 12px 12px" }} onClick={(e) => e.stopPropagation()}>
            <EmojiPicker
              onEmojiClick={(obj) => { setInputText((p) => p + obj.emoji); inputRef.current?.focus(); }}
              height={260} width="100%"
              searchPlaceholder="Search emoji…"
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>

      {/* ── Context menu ── */}
      {contextMenu && (
        <div
          style={{ ...S.ctxMenu, top: contextMenu.y, left: Math.min(contextMenu.x, window.innerWidth - 180) }}
          onClick={(e) => e.stopPropagation()}
        >
          {["reply", "copy", "react"].map((action) => (
            <button key={action} style={S.ctxItem}
              onClick={() => {
                if (action === "copy" && contextMenu.msg.text) navigator.clipboard.writeText(contextMenu.msg.text);
                if (action === "react") {
                  const emoji = prompt("Enter emoji (e.g. 👍)");
                  if (emoji) addReaction(contextMenu.msg.id, emoji);
                }
                setContextMenu(null);
              }}
            >
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
          ))}
          {contextMenu.msg.senderId === currentUid && (
            <button style={{ ...S.ctxItem, color: "#EF4444" }}
              onClick={() => { deleteMessage(contextMenu.msg.id); setContextMenu(null); }}>
              Delete
            </button>
          )}
        </div>
      )}

      {/* ── Hire dialog (client) ── */}
      {hireDialogData && (
        <div style={S.modalOverlay} onClick={() => setHireDialogData(null)}>
          <div style={S.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={S.modalTitle}>Hire Freelancer</h3>
            <p style={S.modalBody}>
              Would you like to hire <b>{otherName}</b> for the job "<b>{hireDialogData.jobTitle}</b>"?
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button style={S.modalAcceptBtn} onClick={confirmHire}>Hire</button>
              <button style={S.modalCancelBtn} onClick={() => setHireDialogData(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hire confirmation (freelancer) ── */}
      {showFreelancerHireConfirm && (
        <div style={S.modalOverlay} onClick={() => setShowFreelancerHireConfirm(null)}>
          <div style={S.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={S.modalTitle}>Hire Confirmation</h3>
            <p style={S.modalBody}>
              The client wants to hire you for the job "<b>{showFreelancerHireConfirm.jobTitle}</b>". Do you accept?
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button style={S.modalAcceptBtn} onClick={freelancerAcceptHire}>Accept</button>
              <button style={S.modalCancelBtn} onClick={freelancerDeclineHire}>Decline</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function TickIcon({ status }) {
  const color = status === "seen" ? "#3B82F6" : "#9CA3AF";
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" style={{ marginLeft: 4 }}>
      <path d="M1 5L4.5 8.5L10 2" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      {status === "seen" && (
        <path d="M6 5L9.5 8.5L15 2" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

const ArrowLeftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const EmojiIconSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Styles ────────────────────────────────────────────────────────────────────

const S = {
  root: { height: "100vh", display: "flex", flexDirection: "column", background: "white", fontFamily: "'Poppins', sans-serif", overflow: "hidden" },
  errorFull: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#EF4444", fontSize: 16, fontFamily: "'Poppins', sans-serif" },
  appBar: { background: "white", padding: "10px 4px", display: "flex", alignItems: "center", gap: 4, flexShrink: 0, boxShadow: "0 1px 0 rgba(0,0,0,0.06)", zIndex: 10 },
  iconBtn: { background: "none", border: "none", cursor: "pointer", padding: "8px 10px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#111827", flexShrink: 0 },
  titleBlock: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  titleName: { fontWeight: 600, fontSize: 15, color: "#111827", fontFamily: "'Poppins', sans-serif" },
  statusText: { fontSize: 12, color: "#9CA3AF", fontFamily: "'Poppins', sans-serif" },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: 15, fontFamily: "'Poppins', sans-serif", color: "#111827", padding: "4px 0" },
  messagesList: { flex: 1, overflowY: "auto", padding: "8px 0" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16 },
  emptyText: { color: "#9CA3AF", fontSize: 16, fontWeight: 500 },
  dateWrap: { display: "flex", justifyContent: "center", margin: "10px 0" },
  datePill: { background: "#E5E7EB", borderRadius: 16, padding: "6px 16px", fontSize: 12, color: "#6B7280", fontWeight: 500 },
  jobCard: { background: "#7C3CFF", borderRadius: 20, boxShadow: "0 4px 12px rgba(124,60,255,0.18)", overflow: "hidden" },
  jobIconBox: { background: "white", borderRadius: 8, padding: 8, fontSize: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 38, minHeight: 38 },
  jobTitle: { fontWeight: 600, fontSize: 14, color: "white", fontFamily: "'Rubik', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  jobCategory: { fontSize: 12, color: "rgba(255,255,255,0.82)", marginTop: 2 },
  viewMoreBtn: { border: "1px solid white", borderRadius: 20, padding: "4px 12px", background: "transparent", color: "white", cursor: "pointer", fontSize: 12, fontWeight: 500, flexShrink: 0, whiteSpace: "nowrap" },
  infoBadge: { display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.9)", fontSize: 12 },
  actionBar: { background: "#FDFD96", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 46 },
  acceptBtn: { background: "#FFF9C4", border: "none", borderRadius: 30, padding: "7px 20px", cursor: "pointer", fontWeight: 600, fontSize: 13 },
  declineBtn: { background: "transparent", border: "1px solid #1F2937", borderRadius: 30, padding: "7px 20px", cursor: "pointer", fontWeight: 500, fontSize: 13 },
  statusChipText: { fontWeight: 500, fontSize: 13, color: "#1F2937", textAlign: "center", fontFamily: "'Rubik', sans-serif" },
  errorCard: { background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 16, padding: "12px 16px", color: "#B91C1C", fontSize: 13, margin: "4px 8px" },
  timeRow: { display: "flex", alignItems: "center", gap: 4 },
  timeText: { fontSize: 11, color: "#9CA3AF", fontFamily: "'Poppins', sans-serif" },
  uploadOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12 },
  uploadCircle: { display: "flex", flexDirection: "column", alignItems: "center" },
  waitingBanner: { background: "white", padding: "14px 24px", borderTop: "1px solid #F3F4F6", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 },
  waitingText: { fontSize: 15, fontWeight: 500, color: "#111827", textAlign: "center" },
  waitingIcon: { width: 38, height: 38, background: "#FDFD96", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
  inputBar: { padding: "10px 12px", display: "flex", alignItems: "flex-end", gap: 6 },
  textareaWrap: { flex: 1, background: "#F3F4F6", borderRadius: 24, display: "flex", alignItems: "center" },
  textarea: { flex: 1, border: "none", outline: "none", background: "transparent", padding: "12px 16px", fontSize: 15, fontFamily: "'Poppins', sans-serif", resize: "none", maxHeight: 120, overflowY: "auto", lineHeight: 1.4, color: "#111827", display: "block", width: "100%" },
  sendBtn: { width: 44, height: 44, borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  ctxMenu: { position: "fixed", zIndex: 1000, background: "white", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: "6px 0", minWidth: 160 },
  ctxItem: { display: "block", width: "100%", background: "none", border: "none", padding: "10px 16px", cursor: "pointer", textAlign: "left", fontFamily: "'Poppins', sans-serif", fontSize: 14, color: "#1F2937" },
  modalOverlay: { position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" },
  modalBox: { background: "white", borderRadius: 20, padding: "28px 24px", maxWidth: 400, width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" },
  modalTitle: { margin: "0 0 12px", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 18, color: "#111827" },
  modalBody: { margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: 14, color: "#4B5563", lineHeight: 1.6 },
  modalAcceptBtn: { flex: 1, background: "#7C3AED", color: "white", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'Poppins', sans-serif" },
  modalCancelBtn: { flex: 1, background: "#F3F4F6", color: "#111827", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "'Poppins', sans-serif" },
};