// ChatPage.jsx
// Full conversion of ChatScreenIn.dart → React Web
// Mirrors every feature: job cards, accept/decline, presence, search,
// delete popup, date headers, seen/sent ticks, emoji picker, scroll-to-bottom

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
  limitToLast,
} from "firebase/database";
import {
  collection,
  query as fsQuery,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  setDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db as firestoreDb } from "../../firbase/Firebase"; // adjust path as needed
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { v4 as uuidv4 } from "uuid";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDateHeader = (date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (d.getTime() === today.getTime()) return "Today";
  if (d.getTime() === yesterday.getTime()) return "Yesterday";
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const generateChatId = (uid1, uid2) =>
  uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;

// ─── Guard wrapper ─────────────────────────────────────────────────────────────

export default function WebChatPage() {
  const { state } = useLocation();
  const { uid1, uid2 } = useParams();
  const navigate = useNavigate();

  const currentUid = state?.currentUid;
  const otherUid   = state?.otherUid;

  if (!currentUid || !otherUid) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "'Poppins', sans-serif",
          color: "#EF4444",
          fontSize: 16,
        }}
      >
        ⚠ Chat cannot open — missing UID values.
      </div>
    );
  }

  return (
    <ChatScreenInner
      currentUid={currentUid}
      otherUid={otherUid}
      otherName={state?.otherName || "User"}
      otherImage={state?.otherImage || ""}
      initialMessage={state?.initialMessage || null}
      navigate={navigate}
    />
  );
}

// ─── Inner chat (all hooks live here, after the guard) ─────────────────────────

function ChatScreenInner({ currentUid, otherUid, otherName, otherImage, initialMessage, navigate }) {
  const chatId = generateChatId(currentUid, otherUid);

  const db   = getDatabase();
  const auth = getAuth();

  // ── State ──
  const [messages,         setMessages]         = useState([]);
  const [inputText,        setInputText]        = useState("");
  const [showEmoji,        setShowEmoji]        = useState(false);
  const [isSending,        setIsSending]        = useState(false);
  const [isSearching,      setIsSearching]      = useState(false);
  const [searchQuery,      setSearchQuery]      = useState("");
  const [selectedMsgId,    setSelectedMsgId]    = useState(null);
  const [otherPresence,    setOtherPresence]    = useState(null);
  const [currentUserRole,  setCurrentUserRole]  = useState("");
  const [deleteTarget,     setDeleteTarget]     = useState(null); // msg to delete
  const [myWorkStatuses,   setMyWorkStatuses]   = useState({});   // messageId → myWorksDoc data

  // ── Refs ──
  const scrollRef      = useRef(null);
  const inputRef       = useRef(null);
  const initialSentRef = useRef(false);
  const myWorkUnsubRef = useRef({});   // messageId → unsubscribe fn

  // ── Fetch current user role ────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    getDoc(doc(firestoreDb, "users", currentUid)).then((snap) => {
      if (!active) return;
      if (snap.exists()) {
        const role = (snap.data()?.role ?? "").toLowerCase();
        setCurrentUserRole(role);
      }
    });
    return () => { active = false; };
  }, [currentUid]);

  // ── Other user's online presence ────────────────────────────────────────────
  useEffect(() => {
    const presRef = dbRef(db, `status/${otherUid}`);
    return onValue(presRef, (snap) => setOtherPresence(snap.val()));
  }, [db, otherUid]);

  // ── Messages listener ───────────────────────────────────────────────────────
  useEffect(() => {
    const msgQ = dbQuery(
      dbRef(db, `chats/${chatId}/messages`),
      orderByChild("timestamp"),
      limitToLast(100)
    );
    return onValue(msgQ, (snap) => {
      const raw = snap.val() || {};
      const list = Object.values(raw).sort((a, b) => a.timestamp - b.timestamp);
      setMessages(list);
      requestAnimationFrame(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }));
    });
  }, [db, chatId]);

  // ── Mark received messages as seen ─────────────────────────────────────────
  useEffect(() => {
    if (!messages.length) return;
    messages.forEach((msg) => {
      if (msg.receiverId === currentUid && msg.status === "sent" && msg.id) {
        update(dbRef(db, `chats/${chatId}/messages/${msg.id}`), { status: "seen" });
      }
    });
  }, [messages, chatId, currentUid, db]);

  // ── Subscribe to myWorks for each job message ───────────────────────────────
  useEffect(() => {
    const jobMsgs = messages.filter(
      (m) => m.type === "job" || (m.text && m.text.startsWith("HUZZLER_JOB_DATA:"))
    );

    jobMsgs.forEach((msg) => {
      const mid = msg.id;
      if (!mid || myWorkUnsubRef.current[mid]) return; // already subscribed

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
      myWorkUnsubRef.current[mid] = unsub;
    });

    return () => {
      // Clean up only unneeded listeners when component unmounts
    };
  }, [messages]);

  // Cleanup all myWorks listeners on unmount
  useEffect(() => {
    return () => {
      Object.values(myWorkUnsubRef.current).forEach((u) => u());
    };
  }, []);

  // ── Send initial job message (once) ────────────────────────────────────────
 useEffect(() => {
  if (!initialMessage || initialSentRef.current) return;
  initialSentRef.current = true;
  sendInitialJobMessage(initialMessage);
}, []);

  // ── Chat meta update ────────────────────────────────────────────────────────
  const updateChatMeta = useCallback(
    async (lastMessage, timestamp) => {
      await update(dbRef(db, `userChats/${currentUid}/${chatId}`), {
        withUid: otherUid, otherName, otherImage, lastMessage, lastMessageTime: timestamp,
      });
      await update(dbRef(db, `userChats/${otherUid}/${chatId}`), {
        withUid: currentUid, lastMessage, lastMessageTime: timestamp,
      });
    },
    [db, chatId, currentUid, otherUid, otherName, otherImage]
  );

  // ── Send initial job message ────────────────────────────────────────────────
  const sendInitialJobMessage = async (message) => {
    if (!message.trim()) return;
    try {
      let jobData = null;
      if (message.startsWith("HUZZLER_JOB_DATA:")) {
        try {
          jobData = JSON.parse(message.substring("HUZZLER_JOB_DATA:".length));
        } catch (e) {
          console.error("JSON decode failed:", e);
        }
      }
      if (!jobData?.id) return;

      const msgId  = uuidv4();
      const now    = Date.now();
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await set(dbRef(db, `chats/${chatId}/messages/${msgId}`), {
        id: msgId,
        senderId: currentUid,
        receiverId: otherUid,
        type: "job",
        jobData,
        timestamp: now,
        status: "sent",
        reactions: {},
      });

      await setDoc(doc(firestoreDb, "myWorks", uuidv4()), {
        jobId: jobData.id,
        jobData,
        status: "sent",
        senderId: userId,
        receiverId: otherUid,
        chatId,
        messageId: msgId,
        sentAt: now,
      });

      await updateChatMeta(
        `[Job] ${JSON.stringify({ jobId: jobData.id, messageId: msgId, title: jobData.title ?? "Job Shared" })}`,
        now
      );
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
        id: msgId,
        senderId: currentUid,
        receiverId: otherUid,
        type: "text",
        text,
        timestamp: now,
        status: "sent",
        reactions: {},
      });
      await updateChatMeta(text, now);
    } catch (e) {
      console.error("Send error:", e);
    } finally {
      setIsSending(false);
    }
  };

  // ── Delete handlers ─────────────────────────────────────────────────────────
  const handleDeleteForMe = async (msg) => {
    await remove(dbRef(db, `chats/${chatId}/messages/${msg.id}`));
    setDeleteTarget(null);
  };

  const handleDeleteForEveryone = async (msg) => {
    await remove(dbRef(db, `chats/${chatId}/messages/${msg.id}`));
    await updateChatMeta("Message deleted", msg.timestamp);
    setDeleteTarget(null);
  };

  // ── Job accept ──────────────────────────────────────────────────────────────
  const handleJobAccept = async (msg, jobId, messageId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    try {
      const snap = await getDocs(
        fsQuery(
          collection(firestoreDb, "myWorks"),
          where("messageId", "==", messageId),
          where("receiverId", "==", userId),
          limit(1)
        )
      );
      if (snap.empty) { alert("No matching job request found"); return; }

      const docData  = snap.docs[0].data();
      const clientId = docData.senderId;

      await updateDoc(doc(firestoreDb, "myWorks", snap.docs[0].id), {
        status: "accepted",
        freelancerId: userId,
        acceptedAt: serverTimestamp(),
      });

      // Update collaboration_requests
      const reqSnap = await getDocs(
        fsQuery(
          collection(firestoreDb, "collaboration_requests"),
          where("clientId", "==", clientId),
          where("freelancerId", "==", userId),
          where("jobId", "==", jobId),
          limit(1)
        )
      );
      if (!reqSnap.empty) {
        await updateDoc(
          doc(firestoreDb, "collaboration_requests", reqSnap.docs[0].id),
          { status: "accepted", acceptedAt: serverTimestamp() }
        );
      }

      // Write to accepted_jobs
      await addDoc(collection(firestoreDb, "accepted_jobs"), {
        clientId,
        freelancerId: userId,
        jobId,
        acceptedAt: serverTimestamp(),
      });

      alert("✓ Job accepted successfully");
    } catch (e) {
      console.error("Error accepting job:", e);
      alert("Failed to accept job");
    }
  };

  // ── Job decline ─────────────────────────────────────────────────────────────
  const handleJobDecline = async (msg, jobId, messageId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    try {
      const snap = await getDocs(
        fsQuery(
          collection(firestoreDb, "myWorks"),
          where("messageId", "==", messageId),
          where("receiverId", "==", userId),
          limit(1)
        )
      );
      if (snap.empty) { alert("No matching job request found"); return; }

      await updateDoc(doc(firestoreDb, "myWorks", snap.docs[0].id), {
        status: "rejected",
        freelancerId: userId,
        declinedAt: serverTimestamp(),
      });
      alert("Job declined");
    } catch (e) {
      console.error("Error declining job:", e);
      alert("Failed to decline job");
    }
  };

  // ── Fetch full job ──────────────────────────────────────────────────────────
  const fetchFullJob = async (jobId) => {
    try {
      let snap = await getDoc(doc(firestoreDb, "jobs", jobId));
      if (snap.exists()) return snap.data();
      snap = await getDoc(doc(firestoreDb, "jobs_24h", jobId));
      if (snap.exists()) return { ...snap.data(), is24h: true };
    } catch (e) {
      console.error("Error fetching full job:", e);
    }
    return null;
  };

  // ── Build grouped message list ──────────────────────────────────────────────
  const buildGroupedItems = (msgs) => {
    const items = [];
    let lastDate = null;
    for (const msg of msgs) {
      const d   = new Date(msg.timestamp);
      const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (!lastDate || day.getTime() !== lastDate.getTime()) {
        items.push({ type: "date", date: day });
        lastDate = day;
      }
      items.push({ type: "message", data: msg });
    }
    return items;
  };

  const displayMessages = searchQuery
    ? messages.filter((m) =>
        (m.text || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const groupedItems = buildGroupedItems(displayMessages);

  // ── Presence widget ─────────────────────────────────────────────────────────
  const renderPresence = () => {
    if (!otherPresence) return null;
    const { state: pState, lastChanged } = otherPresence;
    if (pState === "online") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
          <span style={S.onlineText}>Online</span>
        </div>
      );
    }
    if (lastChanged) {
      const d = new Date(lastChanged);
      return (
        <span style={S.lastSeenText}>
          Last seen{" "}
          {d.toLocaleDateString([], { month: "short", day: "numeric" }) +
            ", " +
            d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      );
    }
    return <span style={S.lastSeenText}>Offline</span>;
  };

  // ── Job card renderer ───────────────────────────────────────────────────────
  const renderJobCard = (msg, isMe) => {
    let jobData = msg.jobData;
    const messageId = msg.id;

    if (!jobData && msg.text?.startsWith("HUZZLER_JOB_DATA:")) {
      try {
        jobData = JSON.parse(msg.text.substring("HUZZLER_JOB_DATA:".length));
      } catch (_) {}
    }

    if (!jobData) {
      return (
        <div style={S.errorCard}>
          <span style={{ fontSize: 20 }}>⚠</span>
          <span>Invalid job data</span>
        </div>
      );
    }

    const jobId      = jobData.id?.toString();
    const jobTitle   = jobData.title || "Untitled Job";
    const category   = jobData.category || "";
    const subCat     = jobData.sub_category || "";
    const budgetFrom = jobData.budget_from || "";
    const budgetTo   = jobData.budget_to   || "";
    const budget     = budgetFrom && budgetTo ? `₹${budgetFrom} – ₹${budgetTo}` : "";
    const skills     = (jobData.skills || []).slice(0, 10);
    const is24h      = jobData.is24h === true;

    let timelineOrDate = "";
    if (is24h) {
      const rawTs = jobData.startDateTime;
      const ms    = typeof rawTs === "number" ? rawTs : ((rawTs?.seconds || 0) * 1000);
      timelineOrDate = new Date(ms).toLocaleDateString([], {
        month: "short", day: "numeric", year: "numeric",
      });
    } else {
      timelineOrDate = jobData.timeline || "";
    }

    // myWorks status
    const mw = myWorkStatuses[messageId];
    let statusText = "";
    let showButtons = false;

    if (mw) {
      const currentStatus = mw.status;
      const receiverId    = mw.receiverId;

      if (currentUserRole === "freelancer" && receiverId === currentUid) {
        if (currentStatus === "sent")     showButtons = true;
        else if (currentStatus === "accepted") statusText = "I'm interested in this project";
        else if (currentStatus === "rejected") statusText = "Not interested in this project";
        else if (currentStatus === "hired")    statusText = "You have been hired";
      } else if (currentUserRole === "client" && isMe) {
        if (currentStatus === "accepted") statusText = "Freelancer is interested";
        else if (currentStatus === "rejected") statusText = "Freelancer declined";
        else if (currentStatus === "hired")    statusText = "Freelancer hired";
        else if (currentStatus === "sent")     statusText = "Job sent";
      }
    }

    const isSelected = selectedMsgId === messageId;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isMe ? "flex-end" : "flex-start",
          marginBottom: 4,
        }}
        onClick={() => setSelectedMsgId((p) => (p === messageId ? null : messageId))}
        onContextMenu={(e) => { e.preventDefault(); setDeleteTarget(msg); }}
      >
        {/* Card */}
        <div
          style={{
            background: "#7C3CFF",
            borderRadius: 20,
            maxWidth: "min(85%, 480px)",
            margin: "4px 8px",
            boxShadow: "0 4px 12px rgba(124,60,255,0.18)",
            overflow: "hidden",
          }}
        >
          {/* Header row */}
          <div style={{ padding: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={S.jobIconBox}>🏢</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={S.jobTitle}>{jobTitle}</div>
              {(category || subCat) && (
                <div style={S.jobCategory}>
                  {category && subCat ? `${category} › ${subCat}` : category || subCat}
                </div>
              )}
            </div>
            <button
              style={S.viewMoreBtn}
             onClick={async (e) => {
  e.stopPropagation();

  const fullJob = await fetchFullJob(jobId); // ✅ use existing function

  if (!fullJob) {
    alert("Job not found");
    return;
  }

  navigate(`/work-details/${jobId}`, {
    state: {
      job: fullJob,   // ✅ IMPORTANT (match WorkDetailsPage)
      currentUid,
      otherUid,
    },
  });
}}
            >
              View more
            </button>
          </div>

          {/* Budget + Timeline */}
          {(budget || timelineOrDate) && (
            <div style={{ padding: "0 12px 0", display: "flex", gap: 14, flexWrap: "wrap" }}>
              {budget && (
                <div style={S.infoBadge}>
                  <span>💰</span><span>{budget}</span>
                </div>
              )}
              {timelineOrDate && (
                <div style={S.infoBadge}>
                  <span>⏰</span><span>{timelineOrDate}</span>
                </div>
              )}
            </div>
          )}

          <div style={{ height: 12 }} />

          {/* Skills */}
          {skills.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                padding: "0 12px",
                overflowX: "auto",
                scrollbarWidth: "none",
              }}
            >
              {skills.map((skill, i) => (
                <div key={i} style={S.skillChip}>{skill}</div>
              ))}
            </div>
          )}

          <div style={{ height: 12 }} />

          {/* Action bar */}
          <div style={S.actionBar}>
            {showButtons ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  style={S.acceptBtn}
                  onClick={(e) => { e.stopPropagation(); handleJobAccept(msg, jobId, messageId); }}
                >
                  Accept
                </button>
                <button
                  style={S.declineBtn}
                  onClick={(e) => { e.stopPropagation(); handleJobDecline(msg, jobId, messageId); }}
                >
                  Decline
                </button>
              </div>
            ) : statusText ? (
              <span style={S.statusText}>{statusText}</span>
            ) : (
              <div style={{ height: 6 }} />
            )}
          </div>
        </div>

        {/* Tap-to-reveal time + tick */}
        {isSelected && (
          <div
            style={{
              ...S.timeRow,
              justifyContent: isMe ? "flex-end" : "flex-start",
              padding: isMe ? "2px 20px 6px 0" : "2px 0 6px 20px",
            }}
          >
            <span style={S.timeText}>{formatTime(msg.timestamp)}</span>
            {isMe && <TickIcon status={msg.status} />}
          </div>
        )}
      </div>
    );
  };

  // ── Text bubble renderer ────────────────────────────────────────────────────
  const renderTextBubble = (msg, isMe) => {
    const messageId  = msg.id;
    const isSelected = selectedMsgId === messageId;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isMe ? "flex-end" : "flex-start",
          marginBottom: 2,
        }}
        onClick={() => setSelectedMsgId((p) => (p === messageId ? null : messageId))}
        onContextMenu={(e) => { e.preventDefault(); setDeleteTarget(msg); }}
      >
        <div
          style={{
            maxWidth: "min(75%, 420px)",
            margin: "2px 8px",
            padding: "10px 14px",
            borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isMe
              ? "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
              : "#F3F4F6",
            color: isMe ? "#fff" : "#111827",
            fontSize: 15,
            lineHeight: 1.5,
            fontFamily: "'Poppins', sans-serif",
            wordBreak: "break-word",
            boxShadow: isMe ? "0 2px 8px rgba(124,58,237,0.22)" : "none",
          }}
        >
          {msg.text}
        </div>

        {isSelected && (
          <div
            style={{
              ...S.timeRow,
              justifyContent: isMe ? "flex-end" : "flex-start",
              padding: isMe ? "2px 20px 6px 0" : "2px 0 6px 20px",
            }}
          >
            <span style={S.timeText}>{formatTime(msg.timestamp)}</span>
            {isMe && <TickIcon status={msg.status} />}
          </div>
        )}
      </div>
    );
  };

  // ── Message dispatcher ──────────────────────────────────────────────────────
  const renderMessage = (msg) => {
    const isMe = msg.senderId === currentUid;
    if (msg.type === "job") return renderJobCard(msg, isMe);
    if (msg.type === "text" && msg.text?.startsWith("HUZZLER_JOB_DATA:"))
      return renderJobCard(msg, isMe);
    return renderTextBubble(msg, isMe);
  };

  // ── Delete popup ────────────────────────────────────────────────────────────
  const renderDeleteModal = () => {
    if (!deleteTarget) return null;
    const isMe = deleteTarget.senderId === currentUid;
    return (
      <div
        style={S.modalOverlay}
        onClick={() => setDeleteTarget(null)}
      >
        <div style={S.modalSheet} onClick={(e) => e.stopPropagation()}>
          {/* Handle */}
          <div style={S.dragHandle} />

          <h3 style={S.modalTitle}>Delete Message</h3>
          <p style={S.modalSubtitle}>This message will be permanently removed.</p>

          {/* Delete for me */}
          <button
            style={S.deleteRow}
            onClick={() => handleDeleteForMe(deleteTarget)}
          >
            <span style={{ fontSize: 18 }}>🗑️</span>
            <span>Delete for me</span>
          </button>

          {/* Delete for everyone */}
          {isMe && (
            <button
              style={{ ...S.deleteRow, marginTop: 12, fontWeight: 600 }}
              onClick={() => handleDeleteForEveryone(deleteTarget)}
            >
              <span style={{ fontSize: 18 }}>🗑️</span>
              <span>Delete for everyone</span>
            </button>
          )}

          {/* Cancel */}
          <button
            style={S.cancelBtn}
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const displayName =
    otherName.length > 20 ? otherName.slice(0, 20) + "…" : otherName;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={S.root}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Rubik:wght@500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }
      `}</style>

      {/* ── AppBar ── */}
      <div style={S.appBar}>
        {/* Back */}
        <button style={S.iconBtn} onClick={() => navigate(-1)} aria-label="Back">
          <ArrowLeftIcon />
        </button>

        {/* Title or Search */}
        {isSearching ? (
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages…"
            style={S.searchInput}
          />
        ) : (
          <div style={S.titleBlock}>
            <span style={S.titleName}>{displayName}</span>
            {renderPresence()}
          </div>
        )}

        {/* Search toggle */}
        <button
          style={S.iconBtn}
          aria-label={isSearching ? "Close search" : "Search"}
          onClick={() => {
            setIsSearching((s) => !s);
            if (isSearching) setSearchQuery("");
          }}
        >
          {isSearching ? <CloseIcon /> : <SearchIcon />}
        </button>
      </div>

      <div style={{ height: 1, background: "#E5E7EB", flexShrink: 0 }} />

      {/* ── Messages list ── */}
      <div style={S.messagesList}>
        {groupedItems.length === 0 ? (
          <div style={S.emptyState}>
            <span style={{ fontSize: 56, opacity: 0.18 }}>💬</span>
            <span style={S.emptyText}>
              {searchQuery ? "No messages found" : "Start the conversation"}
            </span>
          </div>
        ) : (
          groupedItems.map((item, idx) => {
            if (item.type === "date") {
              return (
                <div key={`date-${idx}`} style={S.dateHeaderWrap}>
                  <div style={S.dateHeaderPill}>
                    {formatDateHeader(item.date)}
                  </div>
                </div>
              );
            }
            return (
              <div key={item.data.id || idx}>
                {renderMessage(item.data)}
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* ── Input area ── */}
      <div style={{ flexShrink: 0, background: "white" }}>
        <div style={{ height: 1, background: "#E5E7EB" }} />

        <div style={S.inputBar}>
          {/* Emoji toggle */}
          <button
            style={{ ...S.iconBtn, color: "#7C3AED" }}
            onClick={() => setShowEmoji((s) => !s)}
            aria-label="Emoji"
          >
            <EmojiIcon />
          </button>

          {/* Text area */}
          <div style={S.textareaWrap}>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                // auto-grow
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendTextMessage();
                }
              }}
              placeholder="Message…"
              rows={1}
              style={S.textarea}
            />
          </div>

          {/* Send button */}
          <button
            onClick={sendTextMessage}
            disabled={!inputText.trim() || isSending}
            aria-label="Send"
            style={{
              ...S.sendBtn,
              background: inputText.trim()
                ? "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
                : "linear-gradient(135deg, rgba(139,92,246,0.35) 0%, rgba(124,58,237,0.35) 100%)",
              cursor: inputText.trim() ? "pointer" : "default",
            }}
          >
            <SendIcon />
          </button>
        </div>

        {/* Emoji picker */}
        {showEmoji && (
          <div style={{ padding: "0 12px 12px" }}>
            <EmojiPicker
              onEmojiClick={(obj) => {
                setInputText((p) => p + obj.emoji);
                inputRef.current?.focus();
              }}
              height={260}
              width="100%"
              searchPlaceholder="Search emoji…"
              previewConfig={{ showPreview: false }}
              skinTonesDisabled={false}
            />
          </div>
        )}
      </div>

      {/* ── Delete modal ── */}
      {renderDeleteModal()}
    </div>
  );
}

// ─── Tick icon component ───────────────────────────────────────────────────────

function TickIcon({ status }) {
  if (!status) return null;
  const isSeen  = status === "seen";
  const color   = isSeen ? "#3B82F6" : "#9CA3AF";
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" style={{ marginLeft: 4 }}>
      {/* First tick */}
      <path d="M1 5L4.5 8.5L10 2" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      {/* Second tick (only for double-tick) */}
      {isSeen && (
        <path d="M6 5L9.5 8.5L15 2" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

// ─── SVG icon components ───────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EmojiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// ─── Style constants ───────────────────────────────────────────────────────────

const S = {
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "white",
    fontFamily: "'Poppins', sans-serif",
    overflow: "hidden",
  },
  appBar: {
    background: "white",
    padding: "10px 4px",
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
    boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
    zIndex: 10,
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 10px",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#111827",
    flexShrink: 0,
    transition: "background 150ms",
  },
  titleBlock: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  titleName: {
    fontWeight: 600,
    fontSize: 15,
    color: "#111827",
    fontFamily: "'Poppins', sans-serif",
  },
  onlineText: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
  },
  lastSeenText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "'Poppins', sans-serif",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 15,
    fontFamily: "'Poppins', sans-serif",
    color: "#111827",
    padding: "4px 0",
  },
  messagesList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 16,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
  },
  dateHeaderWrap: {
    display: "flex",
    justifyContent: "center",
    margin: "10px 0",
  },
  dateHeaderPill: {
    background: "#E5E7EB",
    borderRadius: 16,
    padding: "6px 16px",
    fontSize: 12,
    color: "#6B7280",
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
  },
  // Job card internals
  jobIconBox: {
    background: "white",
    borderRadius: 8,
    padding: 8,
    fontSize: 20,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 38,
    minHeight: 38,
  },
  jobTitle: {
    fontWeight: 600,
    fontSize: 14,
    color: "white",
    fontFamily: "'Rubik', sans-serif",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  jobCategory: {
    fontSize: 12,
    color: "rgba(255,255,255,0.82)",
    marginTop: 2,
    fontFamily: "'Poppins', sans-serif",
  },
  viewMoreBtn: {
    border: "1px solid #FDFD96",
    borderRadius: 20,
    padding: "4px 12px",
    background: "transparent",
    color: "white",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    flexShrink: 0,
    fontFamily: "'Poppins', sans-serif",
    whiteSpace: "nowrap",
  },
  infoBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontFamily: "'Poppins', sans-serif",
    flexShrink: 0,
  },
  skillChip: {
    background: "#FFF9C4",
    border: "1px solid #FFE082",
    borderRadius: 30,
    padding: "3px 12px",
    fontSize: 11,
    fontWeight: 500,
    color: "#1a1a1a",
    whiteSpace: "nowrap",
    flexShrink: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  actionBar: {
    background: "#FDFD96",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
  },
  acceptBtn: {
    background: "#FFF9C4",
    border: "none",
    borderRadius: 8,
    padding: "7px 20px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    fontFamily: "'Poppins', sans-serif",
    color: "#111827",
  },
  declineBtn: {
    background: "transparent",
    border: "1px solid #6B7280",
    borderRadius: 8,
    padding: "7px 20px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 13,
    fontFamily: "'Poppins', sans-serif",
    color: "#111827",
  },
  statusText: {
    fontWeight: 500,
    fontSize: 14,
    color: "#1a1a1a",
    fontFamily: "'Rubik', sans-serif",
    textAlign: "center",
  },
  errorCard: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: 16,
    padding: "12px 16px",
    color: "#B91C1C",
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "4px 8px",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
  },
  timeRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "'Poppins', sans-serif",
  },
  // Input bar
  inputBar: {
    padding: "10px 12px",
    display: "flex",
    alignItems: "flex-end",
    gap: 6,
  },
  textareaWrap: {
    flex: 1,
    background: "#F3F4F6",
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
  },
  textarea: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "12px 16px",
    fontSize: 15,
    fontFamily: "'Poppins', sans-serif",
    resize: "none",
    maxHeight: 120,
    overflowY: "auto",
    lineHeight: 1.4,
    color: "#111827",
    display: "block",
    width: "100%",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "opacity 150ms ease, background 150ms ease",
  },
  // Delete modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    background: "rgba(0,0,0,0.38)",
  },
  modalSheet: {
    background: "#F9FAFB",
    borderRadius: "28px 28px 0 0",
    padding: "18px 22px 24px",
    width: "100%",
    maxWidth: 480,
    boxShadow: "0 -8px 30px rgba(0,0,0,0.08)",
  },
  dragHandle: {
    width: 40,
    height: 4,
    background: "#D1D5DB",
    borderRadius: 20,
    margin: "0 auto 22px",
  },
  modalTitle: {
    textAlign: "center",
    margin: "0 0 8px",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: 18,
    color: "#111827",
  },
  modalSubtitle: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
    fontFamily: "'Poppins', sans-serif",
    margin: "0 0 28px",
  },
  deleteRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#E5E7EB",
    borderRadius: 16,
    padding: "14px 16px",
    cursor: "pointer",
    width: "100%",
    border: "none",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
    color: "#1F2937",
    textAlign: "left",
    fontWeight: 500,
  },
  cancelBtn: {
    background: "white",
    borderRadius: 14,
    padding: "14px 16px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: 14,
    color: "#111827",
    width: "100%",
    border: "none",
    marginTop: 12,
  },
};