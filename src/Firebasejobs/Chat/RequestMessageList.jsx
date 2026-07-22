// FULL SINGLE-FILE REACT VERSION OF RequestChatListScreen (NO FIREBASE CONFIG)
// ---------------------------------------------------------------
// IMPORTANT:
// ❌ NO Firebase config added here (as you requested)
// ✅ Works only if Firebase app is already initialized in your project
// ---------------------------------------------------------------

import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { format, differenceInDays } from "date-fns";
import { getDatabase, ref as dbRef, onValue, get, query, orderByChild, limitToLast, remove } from "firebase/database";
import { getFirestore, doc, getDoc, getDocs, collection, query as fsQuery, where, limit } from "firebase/firestore";

// ---------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------
export default function RequestChatListScreen({ currentUid, openRequestChat }) {
  const db = getDatabase();
  const firestore = getFirestore();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userCache, setUserCache] = useState({});

  // ------------------ Fetch realtime request chats ------------------
  useEffect(() => {
    const refChats = dbRef(db, `userChats/${currentUid}`);
    const unsub = onValue(refChats, async (snapshot) => {
      if (!snapshot.exists() || !snapshot.val()) {
        setChats([]);
        setLoading(false);
        return;
      }

      const map = snapshot.val();
      const rawChats = Object.entries(map).map(([chatId, data]) => ({
        chatId,
        withUid: data.with || "",
        lastMessage: data.lastMessage || "",
        lastMessageTime: data.lastMessageTime || Date.now(),
      }));

      // Only job/request type messages allowed
      const finalChats = await Promise.all(
        rawChats.map(async (chat) => {
          if (!chat.lastMessage.startsWith("[Job]")) return null;

          // Extract jobId & messageId
          let parsed = null;
          try {
            parsed = JSON.parse(chat.lastMessage.replace("[Job] ", ""));
          } catch (e) {
            return null;
          }

          if (!parsed?.jobId || !parsed?.messageId) return null;

          // Check myWorks status
          const q = fsQuery(
            collection(firestore, "myWorks"),
            where("jobId", "==", parsed.jobId),
            where("messageId", "==", parsed.messageId),
            where("receiverId", "==", currentUid),
            limit(1)
          );
          const snap = await getDocs(q);

          if (!snap.empty) {
            const status = snap.docs[0].data().status;
            return status === "sent" ? chat : null;
          }
          return null;
        })
      );

      const filtered = finalChats.filter(Boolean);

      filtered.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

      setChats(filtered);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUid, db, firestore]);

  // ------------------ User Info Cache ------------------
  async function fetchUserData(uid) {
    if (userCache[uid]) return userCache[uid];
    const d = await getDoc(doc(firestore, "users", uid));
    if (d.exists()) {
      const data = d.data();
      setUserCache((c) => ({ ...c, [uid]: data }));
      return data;
    }
    return null;
  }

  // ------------------ Delete Chat ------------------
  async function deleteChat(chatId) {
    if (!window.confirm("Delete this chat?")) return;
    await remove(dbRef(db, `userChats/${currentUid}/${chatId}`));
    await remove(dbRef(db, `chats/${chatId}`));
    alert("Chat deleted");
  }

  // ------------------ Format Time ------------------
  function formatTime(ts) {
    const d = new Date(ts);
    const diff = differenceInDays(new Date(), d);
    if (diff === 0) return format(d, "h:mm a");
    if (diff === 1) return "Yesterday";
    if (diff < 7) return format(d, "EEEE");
    return format(d, "MMM d");
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="p-5 bg-yellow-200 rounded-b-2xl text-center text-xl font-semibold">
        Request Messages
      </div>

      {/* Search */}
      <div className="mt-4">
        <input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          className="w-full p-3 rounded-lg border"
        />
      </div>

      {/* List */}
      <div className="mt-5">
        {loading ? (
          <div className="text-center p-6">Loading...</div>
        ) : chats.length === 0 ? (
          <div className="text-center text-gray-400 p-10">No request messages</div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <RequestChatRow
                key={chat.chatId}
                chat={chat}
                fetchUserData={fetchUserData}
                searchQuery={searchQuery}
                formatTime={formatTime}
                openRequestChat={openRequestChat}
                deleteChat={deleteChat}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

RequestChatListScreen.propTypes = {
  currentUid: PropTypes.string.isRequired,
  openRequestChat: PropTypes.func, // (chatId, otherUid, name, image)
};

// ---------------------------------------------------------------
// CHILD: A single row
// ---------------------------------------------------------------
function RequestChatRow({ chat, fetchUserData, searchQuery, formatTime, openRequestChat, deleteChat }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const u = await fetchUserData(chat.withUid);
      setUser(u);
    })();
  }, [chat, fetchUserData]);

  if (!user) return null;

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  if (searchQuery && !fullName.toLowerCase().includes(searchQuery)) return null;

  return (
    <div className="flex items-center p-3 bg-white rounded shadow">
      <img
        src={user.imageUrl || "https://via.placeholder.com/60"}
        className="w-14 h-14 rounded-full object-cover"
      />

      <div
        className="flex-1 ml-3 cursor-pointer"
        onClick={() => openRequestChat && openRequestChat(chat.chatId, chat.withUid, fullName, user.imageUrl)}
      >
        <div className="flex justify-between">
          <div className="font-semibold">{fullName}</div>
          <div className="text-sm text-gray-500">{formatTime(chat.lastMessageTime)}</div>
        </div>
        <div className="text-gray-700 text-sm mt-1">{chat.lastMessage}</div>
      </div>

      <button onClick={() => deleteChat(chat.chatId)} className="text-red-500 ml-3">
        Delete
      </button>
    </div>
  );
}

RequestChatRow.propTypes = {
  chat: PropTypes.object.isRequired,
  fetchUserData: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  formatTime: PropTypes.func.isRequired,
  openRequestChat: PropTypes.func,
  deleteChat: PropTypes.func.isRequired,
};