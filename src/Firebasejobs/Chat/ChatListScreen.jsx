// components/ChatListScreen.jsx
import React, { useEffect, useState } from "react";
import { getDatabase, ref as dbRef, onValue, get as rtdbGet } from "firebase/database";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// requires Firebase app initialization elsewhere AND exports:
 // rtdb = getDatabase(app)
 // db = getFirestore(app)
// In this file we use getDatabase/getFirestore directly.

export default function ChatListScreen({ currentUid }) {
  const db = getDatabase();
  const firestore = getFirestore();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUid) return;
    setLoading(true);

    const userChatsRef = dbRef(db, `userChats/${currentUid}`);
    const unsub = onValue(userChatsRef, async (snap) => {
      const val = snap.val();
      if (!val) {
        setChats([]);
        setLoading(false);
        return;
      }

      // build list of entries
      const list = await Promise.all(
        Object.entries(val).map(async ([chatId, meta]) => {
          // fetch other user's profile if possible (non-blocking)
          const withUid = (meta.with || meta.otherUid);
          let profile = null;
          try {
            if (withUid) {
              const ud = await getDoc(doc(firestore, "users", withUid));
              if (ud.exists()) profile = ud.data();
            }
          } catch (e) {
            // ignore
          }

          // get last message from RTDB (best-effort)
          let lastMessage = meta.lastMessage || "";
          let lastTs = meta.lastMessageTime || 0;
          try {
            const msgsSnap = await rtdbGet(dbRef(db, `chats/${chatId}/messages`));
            if (msgsSnap.exists()) {
              const msgs = Object.values(msgsSnap.val());
              msgs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
              const last = msgs[msgs.length - 1];
              if (last) {
                lastMessage = last.type === "job" ? `[Job] ${last.jobData?.title || "Job"}` : (last.text || last.message || meta.lastMessage);
                lastTs = last.timestamp || lastTs;
              }
            }
          } catch (e) {}

          return {
            chatId,
            withUid,
            name: profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || meta.name || "User" : meta.name || "User",
            image: profile?.profileImage || meta.otherImage || "",
            lastMessage,
            lastTs,
            rawMeta: meta,
          };
        })
      );

      list.sort((a, b) => (b.lastTs || 0) - (a.lastTs || 0));
      setChats(list);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUid, db, firestore]);

  function openChat(chat) {
    navigate("/chat", {
      state: {
        chatId: chat.chatId,
        currentUid,
        otherUid: chat.withUid,
        otherName: chat.name,
        otherImage: chat.image,
      },
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div style={{ padding: 20, borderBottom: "1px solid #eee" }}>
        <h2>Messages</h2>
      </div>

      <div style={{ padding: 16 }}>
        {loading ? (
          <div>Loading...</div>
        ) : chats.length === 0 ? (
          <div>No chats yet</div>
        ) : (
          chats.map((c) => (
            <div
              key={c.chatId}
              style={{
                display: "flex",
                gap: 12,
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
                cursor: "pointer",
                border: "1px solid #f1f1f1",
                marginBottom: 8,
              }}
              onClick={() => openChat(c)}
            >
              <img src={c.image || "/mnt/data/Screenshot from 2025-11-24 21-39-53.png"} alt={c.name} style={{ width: 56, height: 56, borderRadius: 999, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ color: "#888", fontSize: 12 }}>{c.lastTs ? new Date(c.lastTs).toLocaleTimeString() : ""}</div>
                </div>
                <div style={{ color: "#666", marginTop: 6 }}>{c.lastMessage}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ChatListScreen.propTypes = {
  currentUid: PropTypes.string.isRequired,
};
