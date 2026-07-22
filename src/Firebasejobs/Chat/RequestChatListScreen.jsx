// RequestMessageList.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getDatabase,
  ref as dbRef,
  onValue,
  remove,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db as firestoreDb } from "../../firbase/Firebase"; // adjust path
import { useNavigate } from "react-router-dom";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (ts) => {
  const date = new Date(ts);
  const now  = new Date();
  const diff = now - date;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (days === 1) return "Yesterday";
  if (days < 7)  return date.toLocaleDateString([], { weekday: "long" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const resolveName = (userData, fallback) => {
  const first = (userData?.firstName ?? userData?.first_name ?? userData?.fname ?? "").trim();
  const last  = (userData?.lastName  ?? userData?.last_name  ?? userData?.lname  ?? "").trim();
  const full  = (userData?.fullName  ?? userData?.full_name  ?? userData?.name   ?? userData?.displayName ?? userData?.username ?? "").trim();
  if (first || last) return `${first} ${last}`.trim();
  if (full) return full;
  return fallback;
};

const resolveImage = (userData) =>
  userData?.imageUrl ?? userData?.profileImage ?? userData?.image ?? "";

// ─── Component ─────────────────────────────────────────────────────────────────

export default function RequestMessageList() {
  const navigate = useNavigate();
  const db       = getDatabase();
  const auth     = getAuth();

  const [currentUid,   setCurrentUid]   = useState(null);
  const [loading,      setLoading]       = useState(true);
  const [chatItems,    setChatItems]     = useState([]);  // enriched chat rows
  const [searchQuery,  setSearchQuery]   = useState("");
  const [deleteDialog, setDeleteDialog]  = useState(null); // {chatId, name}
  const [collapsed,    setCollapsed]     = useState(localStorage.getItem("sidebar-collapsed") === "true");

  const userCache = useRef({});

  // ── Sidebar collapse sync ──
  useEffect(() => {
    const handler = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handler);
    return () => window.removeEventListener("sidebar-toggle", handler);
  }, []);

  // ── Auth ──
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setCurrentUid(u ? u.uid : null);
      setLoading(false);
    });
  }, [auth]);

  // ── Fetch & cache user data ────────────────────────────────────────────────
  const getUserData = useCallback(async (uid) => {
    if (userCache.current[uid]) return userCache.current[uid];
    try {
      const snap = await getDoc(doc(firestoreDb, "users", uid));
      if (snap.exists()) {
        userCache.current[uid] = snap.data();
        return snap.data();
      }
    } catch (e) { console.error("getUserData error:", e); }
    return null;
  }, []);

  // ── Main chat list listener ────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUid) return;

    // 1. Listen to RTDB userChats for this user
    const unsubRtdb = onValue(dbRef(db, `userChats/${currentUid}`), async (snap) => {
      const val = snap.val() || {};
      const entries = Object.entries(val);
      if (!entries.length) { setChatItems([]); return; }

      // 2. Enrich each chat entry
      const enriched = await Promise.all(
        entries.map(async ([chatId, chatData]) => {
          const withUid = chatData.with || chatData.withUid || "";
          if (!withUid) return null;

          const userData = await getUserData(withUid);
          if (!userData) return null;

          // 3. Check if this is a valid "pending" job request chat
          const isValid = await isChatValid({ chatId, withUid, lastMessage: chatData.lastMessage || "" }, currentUid);
          if (!isValid) return null;

          // Resolve display message
          let displayMessage = chatData.lastMessage || "";
          if (displayMessage.startsWith("[Job]")) {
            try {
              const jsonStr  = displayMessage.substring("[Job] ".length);
              const jsonData = JSON.parse(jsonStr);
              displayMessage = `[Job] ${jsonData.title ?? "Job Shared"}`;
            } catch (_) {}
          }

          return {
            chatId,
            withUid,
            lastMessage: displayMessage,
            lastMessageTime: chatData.lastMessageTime || 0,
            userData,
            displayName: resolveName(userData, withUid),
            imageUrl:    resolveImage(userData),
          };
        })
      );

      const filtered = enriched
        .filter(Boolean)
        .sort((a, b) => b.lastMessageTime - a.lastMessageTime);

      setChatItems(filtered);
    });

    return () => unsubRtdb();
  }, [currentUid, db, getUserData]);

  // ── Check if chat is valid (has a pending job request) ────────────────────
  const isChatValid = async (chat, uid) => {
    if (!chat.lastMessage.startsWith("[Job]")) return false;

    let jobId     = null;
    let messageId = null;

    try {
      const jsonStr  = chat.lastMessage.substring("[Job] ".length);
      const jsonData = JSON.parse(jsonStr);
      jobId     = jsonData.jobId?.toString();
      messageId = jsonData.messageId?.toString();
    } catch (_) {
      // Try fetching last message from RTDB
      try {
        const db2 = getDatabase();
        await new Promise((resolve) => {
          onValue(
            dbRef(db2, `chats/${chat.chatId}/messages`),
            (snap) => {
              const raw   = snap.val() || {};
              const msgs  = Object.values(raw).sort((a, b) => a.timestamp - b.timestamp);
              const last  = msgs[msgs.length - 1];
              if (last?.type === "job" && last?.jobData) {
                jobId     = last.jobData.id?.toString();
                messageId = last.id?.toString();
              }
              resolve();
            },
            { onlyOnce: true }
          );
        });
      } catch (_) { return false; }
    }

    if (!jobId || !messageId) return false;

    try {
      const { getDocs, query: fsQuery, collection: col, where: fw, limit: fl } = await import("firebase/firestore");
      const snap = await getDocs(fsQuery(
        col(firestoreDb, "myWorks"),
        fw("jobId",     "==", jobId),
        fw("receiverId","==", uid),
        fw("messageId", "==", messageId),
        fl(1)
      ));
      if (!snap.empty) {
        const status = snap.docs[0].data().status;
        return status === "sent";
      }
    } catch (_) {}
    return false;
  };

  // ── Delete chat ────────────────────────────────────────────────────────────
  const deleteChat = async (chatId) => {
    try {
      await remove(dbRef(db, `userChats/${currentUid}/${chatId}`));
      await remove(dbRef(db, `chats/${chatId}`));
      setChatItems((prev) => prev.filter((c) => c.chatId !== chatId));
    } catch (e) {
      console.error("Delete chat error:", e);
      alert("Failed to delete chat");
    } finally {
      setDeleteDialog(null);
    }
  };

  // ── Navigate to chat ───────────────────────────────────────────────────────
  const openChat = (item) => {
    navigate("/request-chat", {
      state: {
        currentUid,
        otherUid:   item.withUid,
        otherName:  item.displayName,
        otherImage: item.imageUrl,
      },
    });
  };

  // ── Filter by search ───────────────────────────────────────────────────────
  const displayItems = searchQuery
    ? chatItems.filter((c) => c.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
    : chatItems;

  // ── Render ────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={S.loadingScreen}>
        <div style={S.spinner} />
      </div>
    );
  }

  if (!currentUid) {
    return (
      <div style={S.loadingScreen}>
        <p style={{ color: "#6B7280" }}>Please log in to see message requests.</p>
      </div>
    );
  }

  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "90px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600&family=Poppins:wght@400;500;600&display=swap');
        .req-row:hover { background: #F9FAFB !important; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:4px}
      `}</style>

      <div style={S.root}>
        {/* ── AppBar ── */}
        <div style={S.appBar}>
          <button style={S.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
          </button>
          <h1 style={S.appBarTitle}>Message Requests</h1>
        </div>

        {/* ── Search bar ── */}
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>🔍</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search…"
            style={S.searchInput}
          />
          {searchQuery && (
            <button style={S.clearBtn} onClick={() => setSearchQuery("")}>✕</button>
          )}
        </div>

        {/* ── List ── */}
        <div style={S.list}>
          {displayItems.length === 0 ? (
            <EmptyState />
          ) : (
            displayItems.map((item) => (
              <ChatRow
                key={item.chatId}
                item={item}
                currentUid={currentUid}
                onOpen={() => openChat(item)}
                onDelete={() => setDeleteDialog({ chatId: item.chatId, name: item.displayName })}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Delete dialog ── */}
      {deleteDialog && (
        <div style={S.modalOverlay} onClick={() => setDeleteDialog(null)}>
          <div style={S.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>🗑️</span>
              <h3 style={S.modalTitle}>Delete Chat</h3>
            </div>
            <p style={S.modalBody}>
              Are you sure you want to delete your chat with <b>{deleteDialog.name}</b>?
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button style={S.deleteBtn} onClick={() => deleteChat(deleteDialog.chatId)}>Delete</button>
              <button style={S.cancelBtn} onClick={() => setDeleteDialog(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ChatRow ───────────────────────────────────────────────────────────────────

function ChatRow({ item, currentUid, onOpen, onDelete }) {
  const [hireNotif, setHireNotif] = useState(null);

  // Listen for pending hire notification for this chat's user
  useEffect(() => {
    const q = query(
      collection(firestoreDb, "notifications"),
      where("type",        "==", "hire_request"),
      where("clientUid",   "==", item.withUid),
      where("freelancerId","==", currentUid),
      where("read",        "==", false)
    );
    return onSnapshot(q, (snap) => {
      setHireNotif(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
    });
  }, [item.withUid, currentUid]);

  const hasPending = !!hireNotif;

  const handleClick = async () => {
    if (hasPending) {
      try {
        await updateDoc(doc(firestoreDb, "notifications", hireNotif.id), {
          read: true, status: "opened",
        });
      } catch (_) {}
    }
    onOpen();
  };

  return (
    <div
      className="req-row"
      style={S.row}
      onClick={handleClick}
      onContextMenu={(e) => { e.preventDefault(); onDelete(); }}
    >
      {/* Avatar with yellow ring */}
      <div style={S.avatarRing}>
        <img
          src={item.imageUrl || "https://i.ibb.co/sqsJwP0/user.png"}
          alt={item.displayName}
          style={S.avatar}
          onError={(e) => { e.target.src = "https://i.ibb.co/sqsJwP0/user.png"; }}
        />
        {hasPending && <div style={S.notifDot} />}
      </div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={S.rowTopLine}>
          <span style={S.rowName}>{item.displayName}</span>
          <span style={S.rowTime}>{formatTime(item.lastMessageTime)}</span>
        </div>
        <div style={{ marginTop: 4 }}>
          <span
            style={{
              fontSize: 13,
              fontFamily: "'Rubik', sans-serif",
              color: hasPending ? "#1D4ED8" : "#757575",
              fontWeight: hasPending ? 500 : 400,
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {hasPending && hireNotif?.title
              ? `📋 Hire request: ${hireNotif.title}`
              : item.lastMessage}
          </span>
        </div>
      </div>

      {/* Delete button (always visible on desktop hover) */}
      <button
        style={S.rowDeleteBtn}
        title="Delete chat"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      >
        🗑️
      </button>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={S.emptyWrap}>
      <div style={S.emptyIllustration}>
        <svg viewBox="0 0 120 120" width="120" height="120">
          <circle cx="60" cy="60" r="54" fill="#F3F4F6" />
          <rect x="28" y="44" width="64" height="40" rx="8" fill="#E5E7EB" />
          <rect x="36" y="54" width="32" height="4" rx="2" fill="#9CA3AF" />
          <rect x="36" y="64" width="48" height="4" rx="2" fill="#D1D5DB" />
          <circle cx="80" cy="44" r="14" fill="#7C3AED" />
          <path d="M74 44l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
      <h3 style={S.emptyTitle}>Start new message</h3>
      <p style={S.emptySubtitle}>
        Once you start collaborating, your{"\n"}conversations will appear here.
      </p>
    </div>
  );
}

// ─── SVG icons ─────────────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

// ─── Styles ────────────────────────────────────────────────────────────────────

const S = {
  loadingScreen: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "white" },
  spinner: { width: 36, height: 36, border: "3px solid #E5E7EB", borderTopColor: "#7C3AED", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  root: {
    minHeight: "100vh",
    background: "white",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Poppins', sans-serif",
  },
  appBar: {
    background: "white",
    padding: "16px 16px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    color: "#111827",
    flexShrink: 0,
  },
  appBarTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 500,
    color: "#111827",
    fontFamily: "'Poppins', sans-serif",
  },
  searchWrap: {
    margin: "12px 16px",
    background: "#F3F4F6",
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    padding: "10px 14px",
    gap: 8,
  },
  searchIcon: { fontSize: 16, flexShrink: 0, opacity: 0.5 },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 15,
    fontFamily: "'Poppins', sans-serif",
    color: "#111827",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9CA3AF",
    fontSize: 14,
    padding: "0 2px",
  },
  list: { flex: 1, overflowY: "auto" },
  row: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    gap: 12,
    cursor: "pointer",
    borderBottom: "1px solid #F3F4F6",
    transition: "background 150ms",
    position: "relative",
  },
  avatarRing: {
    padding: 1,
    borderRadius: "50%",
    background: "#F7F587",
    flexShrink: 0,
    position: "relative",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
  },
  notifDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#3B82F6",
    border: "2px solid white",
  },
  rowTopLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  rowName: {
    fontFamily: "'Rubik', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    color: "#1A1A1A",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
  rowTime: {
    fontFamily: "'Rubik', sans-serif",
    fontSize: 12,
    color: "#9E9E9E",
    flexShrink: 0,
  },
  rowDeleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 6,
    borderRadius: 8,
    fontSize: 16,
    opacity: 0,
    transition: "opacity 150ms",
    flexShrink: 0,
  },
  emptyWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    padding: 32,
    gap: 16,
  },
  emptyIllustration: { marginBottom: 8 },
  emptyTitle: { margin: 0, fontSize: 18, fontWeight: 600, color: "#111827", fontFamily: "'Poppins', sans-serif" },
  emptySubtitle: { margin: 0, fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 1.6, fontFamily: "'Poppins', sans-serif", whiteSpace: "pre-line" },
  modalOverlay: { position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" },
  modalBox: { background: "white", borderRadius: 20, padding: "24px 22px", maxWidth: 380, width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" },
  modalTitle: { margin: 0, fontFamily: "'Rubik', sans-serif", fontWeight: 600, fontSize: 18, color: "#111827" },
  modalBody: { margin: 0, fontFamily: "'Rubik', sans-serif", fontSize: 15, color: "#4B5563", lineHeight: 1.6 },
  deleteBtn: { flex: 1, background: "#EF4444", color: "white", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'Poppins', sans-serif" },
  cancelBtn: { flex: 1, background: "#F3F4F6", color: "#111827", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "'Poppins', sans-serif" },
};

// ─── Spinner keyframes (injected once) ─────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .req-row:hover > button:last-child { opacity: 0.5 !important; }
  .req-row:hover > button:last-child:hover { opacity: 1 !important; }
`;
document.head.appendChild(style);