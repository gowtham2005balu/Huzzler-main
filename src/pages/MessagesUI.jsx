// MessagesUI.jsx
import React, { useEffect, useState, useRef } from "react";
import { Search, Bell, Star, MessageSquare, ArrowRight, Phone, Video, Monitor, Paperclip, Smile, Send, PenSquare, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db as firestoreDb, auth, rtdb } from "../firbase/Firebase";
import {
  ref as dbRef,
  onValue,
  set,
  update,
  query as dbQuery,
  orderByChild,
  limitToLast,
  get
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
  serverTimestamp,
  limit
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Helpers
function formatTimeLabel(ts) {
  if (!ts) return "";
  const date = new Date(ts);
  const now = new Date();
  const diff = now - date;
  const days = diff / 86400000;

  if (days < 1) return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (days < 2) return "Yesterday";
  if (days < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function MessagesUI() {
  const currentUid = auth.currentUser?.uid;
  const navigate = useNavigate();

  const [activeChat, setActiveChat] = useState(null); 
  const [currentView, setCurrentView] = useState("chats"); 
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [userInfo, setUserInfo] = useState({ first_name: "", last_name: "", profileImage: "" });
  const [requestCount, setRequestCount] = useState(0);

  const [rawChats, setRawChats] = useState([]);
  const [chatItems, setChatItems] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [search, setSearch] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [listSearch, setListSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [myWorkStatuses, setMyWorkStatuses] = useState({});
  const myWorkUnsubRef = useRef({});

  const userCacheRef = useRef({});
  const scrollRef = useRef(null);

  // 1. Load user role & requests
  useEffect(() => {
    if (!currentUid) return;
    const loadRole = async () => {
      try {
        const snap = await getDoc(doc(firestoreDb, "users", currentUid));
        if (snap.exists()) {
          const data = snap.data();
          setCurrentUserRole((data.role || "").toLowerCase());
          setUserInfo({
            first_name: data.first_name || data.firstName || data.name || auth.currentUser?.displayName?.split(" ")[0] || "",
            last_name: data.last_name || data.lastName || auth.currentUser?.displayName?.split(" ").slice(1).join(" ") || "",
            profileImage: data.profileImage || ""
          });
        } else {
          const fSnap = await getDoc(doc(firestoreDb, "freelancers", currentUid));
          if (fSnap.exists()) {
             const data = fSnap.data();
             setCurrentUserRole((data.role || "freelancer").toLowerCase());
             setUserInfo({
               first_name: data.first_name || data.firstName || data.name || auth.currentUser?.displayName?.split(" ")[0] || "",
               last_name: data.last_name || data.lastName || auth.currentUser?.displayName?.split(" ").slice(1).join(" ") || "",
               profileImage: data.profileImage || ""
             });
          }
        }
      } catch (e) {}
    };
    loadRole();

    const colRef = collection(firestoreDb, "requests", currentUid, "users");
    const unsub = onSnapshot(colRef, (s) => setRequestCount(s.size));
    return () => unsub();
  }, [currentUid]);

  // 2. Load Chat List
  useEffect(() => {
    if (!currentUid || !rtdb) return;
    const refUserChats = dbRef(rtdb, `userChats/${currentUid}`);
    let cancelled = false;
    const unsub = onValue(refUserChats, async (snapshot) => {
      if (cancelled) return;
      const val = snapshot.val();
      if (!val) { setRawChats([]); return; }
      
      const entries = Object.entries(val);
      const list = await Promise.all(
        entries.map(async ([chatId, raw]) => {
          const withUid = raw.withUid || raw.with || "";
          let lastMessage = raw.lastMessage || "";
          let lastMessageTime = raw.lastMessageTime || 0;
          try {
            const msgSnap = await get(dbQuery(dbRef(rtdb, `chats/${chatId}/messages`), orderByChild("timestamp"), limitToLast(1)));
            if (msgSnap.exists()) {
              const first = Object.values(msgSnap.val())[0];
              if (first.type === "job") {
                const jobTitle = first.jobData?.title || first.jobData?.sub_category || "Job Shared";
                lastMessage = `[Job] ${jobTitle}`;
              } else {
                lastMessage = first.text || "[Attachment]";
              }
              lastMessageTime = first.timestamp || lastMessageTime;
            }
          } catch (e) {}
          return { chatId, withUid, lastMessage, lastMessageTime };
        })
      );
      const sorted = list.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
      setRawChats(sorted);
    });
    return () => { cancelled = true; unsub(); };
  }, [currentUid]);

  // 3. Resolve user data for chat list
  useEffect(() => {
    const load = async () => {
      if (!rawChats.length) return setChatItems([]);
      const res = await Promise.all(
        rawChats.map(async (chat) => {
          if (!chat.withUid) return null;
          if (!userCacheRef.current[chat.withUid]) {
             const snap = await getDoc(doc(firestoreDb, "users", chat.withUid));
             userCacheRef.current[chat.withUid] = snap.exists() ? snap.data() : {};
          }
          return { chat, userData: userCacheRef.current[chat.withUid] };
        })
      );
      setChatItems(res.filter(Boolean));
    };
    load();
  }, [rawChats]);

  // 4. Load Active Chat Messages
  const activeChatId = activeChat?.chat?.chatId;
  const otherUid = activeChat?.chat?.withUid;
  const otherUserData = activeChat?.userData;

  useEffect(() => {
    if (!activeChatId) return;
    const msgQ = dbQuery(dbRef(rtdb, `chats/${activeChatId}/messages`), orderByChild("timestamp"), limitToLast(100));
    const unsub = onValue(msgQ, (snap) => {
      const raw = snap.val() || {};
      const list = Object.values(raw).sort((a, b) => a.timestamp - b.timestamp);
      setMessages(list);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
    return () => unsub();
  }, [activeChatId]);

  // 5. Mark messages as seen
  useEffect(() => {
    if (!messages.length || !activeChatId) return;
    messages.forEach((msg) => {
      if (msg.receiverId === currentUid && msg.status === "sent" && msg.id) {
        update(dbRef(rtdb, `chats/${activeChatId}/messages/${msg.id}`), { status: "seen" });
      }
    });
  }, [messages, activeChatId, currentUid]);

  // 6. Listen to myWorks for jobs
  useEffect(() => {
    const jobMsgs = messages.filter((m) => m.type === "job" || (m.text && m.text.startsWith("HUZZLER_JOB_DATA:")));
    jobMsgs.forEach((msg) => {
      const mid = msg.id;
      if (!mid || myWorkUnsubRef.current[mid]) return;
      const q = fsQuery(collection(firestoreDb, "myWorks"), where("messageId", "==", mid), limit(1));
      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          setMyWorkStatuses((prev) => ({ ...prev, [mid]: snap.docs[0].data() }));
        }
      });
      myWorkUnsubRef.current[mid] = unsub;
    });
  }, [messages]);

  // Actions
  const sendTextMessage = async () => {
    const text = inputText.trim();
    if (!text || !activeChatId) return;
    setInputText("");

    const msgId = uuidv4();
    const now   = Date.now();
    try {
      await set(dbRef(rtdb, `chats/${activeChatId}/messages/${msgId}`), {
        id: msgId,
        senderId: currentUid,
        receiverId: otherUid,
        type: "text",
        text,
        timestamp: now,
        status: "sent",
        reactions: {},
      });
      await update(dbRef(rtdb, `userChats/${currentUid}/${activeChatId}`), {
        withUid: otherUid, lastMessage: text, lastMessageTime: now,
      });
      await update(dbRef(rtdb, `userChats/${otherUid}/${activeChatId}`), {
        withUid: currentUid, lastMessage: text, lastMessageTime: now,
      });
    } catch (e) {
      console.error("Send error:", e);
    }
  };

  const handleJobAccept = async (jobId, messageId) => {
    if (!currentUid) return;
    try {
      const snap = await getDocs(fsQuery(collection(firestoreDb, "myWorks"), where("messageId", "==", messageId), where("receiverId", "==", currentUid), limit(1)));
      if (snap.empty) { alert("No matching job request found"); return; }
      
      const docData  = snap.docs[0].data();
      const clientId = docData.senderId;

      await updateDoc(doc(firestoreDb, "myWorks", snap.docs[0].id), {
        status: "accepted",
        freelancerId: currentUid,
        acceptedAt: serverTimestamp(),
      });

      const reqSnap = await getDocs(fsQuery(collection(firestoreDb, "collaboration_requests"), where("clientId", "==", clientId), where("freelancerId", "==", currentUid), where("jobId", "==", jobId), limit(1)));
      if (!reqSnap.empty) {
        await updateDoc(doc(firestoreDb, "collaboration_requests", reqSnap.docs[0].id), { status: "accepted", acceptedAt: serverTimestamp() });
      }

      await addDoc(collection(firestoreDb, "accepted_jobs"), {
        clientId,
        freelancerId: currentUid,
        jobId,
        acceptedAt: serverTimestamp(),
      });
      alert("✓ Job accepted successfully");
    } catch (e) {
      alert("Failed to accept job");
    }
  };

  const handleJobDecline = async (jobId, messageId) => {
    if (!currentUid) return;
    try {
      const snap = await getDocs(fsQuery(collection(firestoreDb, "myWorks"), where("messageId", "==", messageId), where("receiverId", "==", currentUid), limit(1)));
      if (snap.empty) { alert("No matching job request found"); return; }
      await updateDoc(doc(firestoreDb, "myWorks", snap.docs[0].id), {
        status: "rejected",
        freelancerId: currentUid,
        declinedAt: serverTimestamp(),
      });
      alert("Job declined");
    } catch (e) {
      alert("Failed to decline job");
    }
  };


  const filteredListItems = chatItems.filter(i => {
    if (!listSearch.trim()) return true;
    const name = `${i.userData.firstName || i.userData.first_name || ""} ${i.userData.lastName || i.userData.last_name || ""}`.toLowerCase();
    return name.includes(listSearch.toLowerCase());
  });

  const getInitials = (first, last) => {
    return `${(first || "U").substring(0,1)}${(last || "").substring(0,1)}`.toUpperCase();
  };

  const activeName = otherUserData ? `${otherUserData.firstName || otherUserData.first_name || ""} ${otherUserData.lastName || otherUserData.last_name || ""}`.trim() : "";
  const activeInitials = getInitials(otherUserData?.firstName || otherUserData?.first_name, otherUserData?.lastName || otherUserData?.last_name);

  // Layout Renders
  const renderFullList = () => {
    return (
      <div className="msg-full-list-container">
        <div className="msg-list-header-row">
          <div>
            <h1 className="msg-main-title">Messages</h1>
            <p className="msg-main-subtitle">4 unread conversations</p>
          </div>
          <button className="msg-new-btn">
            New Message
          </button>
        </div>

        <div className="msg-list-search-wrapper">
          <Search size={18} color="#9CA3AF" className="msg-list-search-icon" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="msg-list-search-input"
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
          />
        </div>

        <div className="msg-list-tabs">
          <button className={`msg-list-tab ${activeTab === 'All' ? 'active' : ''}`} onClick={() => setActiveTab('All')}>All ({chatItems.length})</button>
          <button className={`msg-list-tab ${activeTab === 'Unread' ? 'active' : ''}`} onClick={() => setActiveTab('Unread')}>Unread (4)</button>
          <button className={`msg-list-tab ${activeTab === 'Archived' ? 'active' : ''}`} onClick={() => setActiveTab('Archived')}>Archived</button>
        </div>

        <div className="msg-list-items-wrapper">
          {filteredListItems.map((item, index) => {
            const { chat, userData } = item;
            const name = `${userData.firstName || userData.first_name || ""} ${userData.lastName || userData.last_name || ""}`.trim() || "Unknown";
            const avatarText = getInitials(userData.firstName || userData.first_name, userData.lastName || userData.last_name);
            const isUnread = index < 2; // Mocking unread status visually
            
            return (
              <div key={chat.chatId} className={`msg-list-row ${isUnread ? 'unread-row' : ''}`} onClick={() => setActiveChat(item)}>
                <div className="msg-list-avatar" style={{ background: index % 2 === 0 ? "#7C4EF5" : "#F59E0B" }}>
                  {userData.profileImage ? <img src={userData.profileImage} alt={name} /> : avatarText}
                </div>
                <div className="msg-list-text-col">
                  <div className="msg-list-name-row">
                    <span className="msg-list-name">{name}</span>
                    {isUnread && <div className="msg-list-unread-dot"></div>}
                  </div>
                  <div className="msg-list-preview">{chat.lastMessage || "Sounds great! I'll send over the revised Figma file by tomorrow morning..."}</div>
                  <div className="msg-list-time">{formatTimeLabel(chat.lastMessageTime) || "Just now"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="msg-page-container">
      {/* Top Navigation Bar */}
      <div className="msg-topbar">
        <div className="msg-search-container">
          <Search size={16} color="#9CA3AF" />
          <input 
            type="text" 
            placeholder="Search freelancers, jobs, services..." 
            className="msg-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="msg-topbar-right">
          <button className="msg-ai-btn" onClick={() => navigate("/freelance-dashboard/aigenerator")}>
            <Star size={14} fill="white" color="white" />
            AI Assistant
          </button>
          
          <button className="msg-bell-btn" onClick={() => navigate(currentUserRole === 'client' ? '/client-dashbroad2/clientNotification' : '/freelance-dashboard/notifications')}>
            <Bell size={18} color="#6B7280" />
            {requestCount > 0 && <div className="msg-bell-dot">{requestCount}</div>}
          </button>

          <button className="msg-new-service-btn">
            + New Service
          </button>

          <div className="msg-avatar-top">
            {userInfo.profileImage ? (
              <img src={userInfo.profileImage} style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} alt="" />
            ) : (
              getInitials(userInfo.first_name, userInfo.last_name) || "U"
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="msg-content-layout">
        
        {!activeChat ? (
          renderFullList()
        ) : (
          <>
            {/* Left Sidebar (Chat List) for Split View */}
            <div className="msg-sidebar">
              <div className="msg-sidebar-header">
                <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                  <button onClick={() => setActiveChat(null)} className="msg-back-btn">←</button>
                  <h2 className="msg-sidebar-title" style={{margin: 0}}>Messages</h2>
                </div>
                
                <div className="msg-sidebar-search">
                  <Search size={14} color="#9CA3AF" />
                  <input 
                    type="text" 
                    placeholder="Search messages..." 
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="msg-chat-list">
                {chatItems.map((item) => {
                  const { chat, userData } = item;
                  const isActive = activeChatId === chat.chatId;
                  const name = `${userData.firstName || userData.first_name || ""} ${userData.lastName || userData.last_name || ""}`.trim() || "Unknown";
                  const avatarText = getInitials(userData.firstName || userData.first_name, userData.lastName || userData.last_name);
                  
                  return (
                    <div 
                      key={chat.chatId} 
                      className={`msg-chat-item ${isActive ? "active" : ""}`}
                      onClick={() => setActiveChat(item)}
                    >
                      <div className="msg-chat-avatar" style={{ background: "#7C4EF5" }}>
                        {userData.profileImage ? <img src={userData.profileImage} style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} alt={name} /> : avatarText}
                      </div>
                      
                      <div className="msg-chat-info">
                        <div className="msg-chat-top">
                          <span className="msg-chat-name">{name}</span>
                        </div>
                        <p className="msg-chat-preview">{chat.lastMessage}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Area (Active Chat) */}
            <div className="msg-active-chat-wrapper">
              
              {/* Center Chat Window */}
              <div className="msg-chat-center">
                
                {/* Chat Header */}
                <div className="msg-chat-header">
                  <div className="msg-chat-header-left">
                    <div className="msg-chat-header-avatar" style={{background: "#7C4EF5"}}>
                      {otherUserData?.profileImage ? <img src={otherUserData.profileImage} style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} alt={activeName} /> : activeInitials}
                    </div>
                    <div className="msg-chat-header-info">
                      <span className="msg-chat-header-name">{activeName}</span>
                      <span className="msg-chat-header-status">
                        <span className="msg-online-dot-small"></span> Online
                      </span>
                    </div>
                  </div>
                  <div className="msg-chat-header-right">
                    <button className="chat-icon-btn"><Phone size={18} color="#6B7280" /></button>
                    <button className="chat-icon-btn"><Video size={18} color="#6B7280" /></button>
                    <button className="chat-ai-btn">
                      <Star size={14} color="#7C4EF5" fill="transparent" /> AI Summarize
                    </button>
                  </div>
                </div>

                {/* Chat History Area */}
                <div className="msg-chat-history">
                  <div className="chat-date-separator"><span>Conversation Started</span></div>

                  {messages.map((msg) => {
                    const isMe = msg.senderId === currentUid;
                    
                    // Handle Job Cards
                    if (msg.type === "job" || msg.text?.startsWith("HUZZLER_JOB_DATA:")) {
                      let jobData = msg.jobData;
                      if (!jobData && msg.text?.startsWith("HUZZLER_JOB_DATA:")) {
                        try { jobData = JSON.parse(msg.text.substring("HUZZLER_JOB_DATA:".length)); } catch(e){}
                      }
                      if (!jobData) return null;
                      
                      const mw = myWorkStatuses[msg.id];
                      let statusText = mw?.status;

                      return (
                        <div key={msg.id} className={`chat-msg ${isMe ? "outgoing" : "incoming"}`}>
                            <div className="chat-project-card">
                              <div className="chat-project-header">
                                <Monitor size={14} color="white" />
                                <span className="chat-project-label">PROJECT</span>
                              </div>
                              <span className="chat-project-title">{jobData.title || jobData.category || "Job Request"}</span>
                              <button className="chat-view-more-btn">View more</button>
                            </div>
                            
                            {!isMe && (!statusText || statusText === "sent") && currentUserRole === 'freelancer' && (
                              <div className="chat-bubble yellow-bubble action-bubble" style={{marginTop: 8}}>
                                <span>The client would like to hire you</span>
                                <div className="chat-bubble-actions">
                                  <button className="chat-accept-btn" onClick={() => handleJobAccept(jobData.id, msg.id)}>Accept</button>
                                  <button className="chat-decline-btn" onClick={() => handleJobDecline(jobData.id, msg.id)}>Decline</button>
                                </div>
                              </div>
                            )}
                            {!isMe && statusText && statusText !== "sent" && (
                              <div className="chat-bubble yellow-bubble" style={{marginTop: 8, fontSize: 12}}>
                                Status: {statusText}
                              </div>
                            )}
                        </div>
                      );
                    }

                    // Handle Text Messages
                    return (
                      <div key={msg.id} className={`chat-msg ${isMe ? "outgoing" : "incoming"}`}>
                        <div className={`chat-bubble ${isMe ? "purple-bubble" : "yellow-bubble"}`}>
                          {msg.text}
                        </div>
                        <span className="chat-time">{formatTimeLabel(msg.timestamp)} {isMe && (msg.status === "seen" ? "✓✓" : "✓")}</span>
                      </div>
                    );
                  })}
                  <div ref={scrollRef} />
                </div>

                {/* Chat Input Area */}
                <div className="msg-chat-input-area">
                  <div className="chat-input-wrapper">
                    <button className="chat-input-icon"><Paperclip size={18} color="#6B7280" /></button>
                    <button className="chat-input-icon"><Smile size={18} color="#6B7280" /></button>
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="chat-input-field" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendTextMessage()}
                    />
                    <button className="chat-send-btn" onClick={sendTextMessage}><Send size={16} color="#ffffff" /></button>
                  </div>
                </div>

              </div>

              {/* Right Details Sidebar */}
              <div className="msg-chat-details-sidebar">
                
                <div className="chat-details-profile">
                  <div className="chat-details-avatar" style={{background: "#7C4EF5"}}>
                    {otherUserData?.profileImage ? <img src={otherUserData.profileImage} style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} alt={activeName} /> : activeInitials}
                  </div>
                  <h3 className="chat-details-name">{activeName}</h3>
                  <p className="chat-details-role">{otherUserData?.role || "Member"}</p>
                  <div className="chat-details-badges">
                    <span className="badge-verified">Verified</span>
                    <span className="badge-top-client">Top Client</span>
                  </div>
                </div>

                <div className="chat-details-section">
                  <h4 className="chat-details-section-title">ACTIVE PROJECT</h4>
                  <div className="active-project-card">
                    <h5 className="active-project-title">Current Engagement</h5>
                    <p className="active-project-meta">Status: Active</p>
                    <div className="active-project-progress">
                      <div className="progress-fill" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');

        .msg-page-container {
          width: 100%;
          min-height: 100vh;
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* Topbar */
        .msg-topbar {
          height: 70px;
          border-bottom: 1px solid #EEEDF3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          flex-shrink: 0;
          background: #ffffff;
        }

        .msg-search-container {
          display: flex;
          align-items: center;
          background: #F9FAFB;
          border-radius: 8px;
          padding: 0 16px;
          height: 40px;
          width: 400px;
          border: 1px solid #F3F4F6;
        }

        .msg-search-input {
          border: none;
          background: transparent;
          outline: none;
          margin-left: 8px;
          width: 100%;
          font-size: 13px;
          color: #111827;
        }
        .msg-search-input::placeholder {
          color: #9CA3AF;
        }

        .msg-topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .msg-ai-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #7C4EF5;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .msg-bell-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #E5E7EB;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
        }
        .msg-bell-dot {
          background: #EF4444;
          border-radius: 10px;
          position: absolute;
          top: -4px;
          right: -4px;
          border: 2px solid white;
          color: white;
          font-size: 10px;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        .msg-new-service-btn {
          background: #EAB308;
          color: #854D0E;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .msg-avatar-top {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #7C4EF5;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
        }

        /* Layout */
        .msg-content-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
          background: #FAFAFC;
        }

        /* Full Width List View */
        .msg-full-list-container {
          width: 100%;
          padding: 32px 40px;
          overflow-y: auto;
          background: #FAFAFC;
        }

        .msg-list-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .msg-main-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px 0;
          font-family: 'Sora', sans-serif;
        }

        .msg-main-subtitle {
          font-size: 13px;
          color: #6B7280;
          margin: 0;
        }

        .msg-new-btn {
          background: #7C4EF5;
          color: #FFF;
          border: none;
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(124, 78, 245, 0.2);
        }

        .msg-list-search-wrapper {
          position: relative;
          margin-bottom: 24px;
        }

        .msg-list-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
        }

        .msg-list-search-input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          border-radius: 12px;
          border: 1px solid #E5E7EB;
          background: #FFF;
          font-size: 14px;
          outline: none;
          color: #111827;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }

        .msg-list-search-input::placeholder {
          color: #9CA3AF;
        }

        .msg-list-tabs {
          display: inline-flex;
          background: #FFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }

        .msg-list-tab {
          padding: 8px 20px;
          background: transparent;
          border: none;
          font-size: 13px;
          font-weight: 600;
          color: #6B7280;
          cursor: pointer;
          border-radius: 8px;
        }

        .msg-list-tab.active {
          background: #F3F4F6;
          color: #111827;
        }

        .msg-list-items-wrapper {
          background: #FFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .msg-list-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          border-bottom: 1px solid #F3F4F6;
          cursor: pointer;
          transition: background 0.2s;
        }

        .msg-list-row:last-child {
          border-bottom: none;
        }

        .msg-list-row:hover {
          background: #FAFAFC;
        }

        .msg-list-row.unread-row {
          background: #F5F3FF;
        }

        .msg-list-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
          overflow: hidden;
        }

        .msg-list-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .msg-list-text-col {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .msg-list-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .msg-list-name {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
        }

        .msg-list-unread-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7C4EF5;
        }

        .msg-list-preview {
          font-size: 13px;
          color: #6B7280;
          margin-bottom: 6px;
        }

        .msg-list-time {
          font-size: 11px;
          color: #9CA3AF;
          font-weight: 500;
        }

        /* SPLIT VIEW - Left Sidebar */
        .msg-sidebar {
          width: 320px;
          border-right: 1px solid #EEEDF3;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          flex-shrink: 0;
        }

        .msg-back-btn {
          background: none;
          border: none;
          font-size: 18px;
          color: #6B7280;
          cursor: pointer;
        }

        .msg-sidebar-header {
          padding: 24px 24px 16px 24px;
          border-bottom: 1px solid #EEEDF3;
        }

        .msg-sidebar-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          font-family: 'Sora', sans-serif;
        }

        .msg-sidebar-search {
          display: flex;
          align-items: center;
          background: #F9FAFB;
          border-radius: 8px;
          padding: 10px 14px;
          border: 1px solid #E5E7EB;
        }
        
        .msg-sidebar-search input {
          border: none;
          background: transparent;
          outline: none;
          margin-left: 8px;
          width: 100%;
          font-size: 13px;
        }

        .msg-chat-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .msg-chat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border-bottom: 1px solid #F3F4F6;
          cursor: pointer;
          transition: background 0.2s;
        }

        .msg-chat-item:hover {
          background: #FAFAFC;
        }

        .msg-chat-item.active {
          background: #F5F2FF;
          border-left: 4px solid #7C4EF5;
          padding-left: 20px;
        }

        .msg-chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .msg-chat-info {
          flex: 1;
          min-width: 0;
        }

        .msg-chat-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .msg-chat-preview {
          font-size: 12px;
          color: #6B7280;
          margin: 4px 0 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* --- Active Chat View --- */
        .msg-active-chat-wrapper {
          display: flex;
          flex: 1;
          overflow: hidden;
          background: #ffffff;
        }

        /* Center Chat Window */
        .msg-chat-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #EEEDF3;
          min-width: 0;
        }

        .msg-chat-header {
          height: 72px;
          border-bottom: 1px solid #EEEDF3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          flex-shrink: 0;
        }

        .msg-chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .msg-chat-header-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .msg-chat-header-info {
          display: flex;
          flex-direction: column;
        }

        .msg-chat-header-name {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
        }

        .msg-chat-header-status {
          font-size: 12px;
          color: #10B981;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }

        .msg-online-dot-small {
          width: 6px;
          height: 6px;
          background: #10B981;
          border-radius: 50%;
        }

        .msg-chat-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #E5E7EB;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .chat-ai-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #E5E7EB;
          background: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #4B5563;
          cursor: pointer;
        }

        .msg-chat-history {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chat-date-separator {
          text-align: center;
          position: relative;
          margin: 16px 0;
        }
        
        .chat-date-separator span {
          background: #F3F4F6;
          color: #6B7280;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 12px;
        }

        .chat-msg {
          display: flex;
          flex-direction: column;
          max-width: 70%;
        }

        .chat-msg.incoming {
          align-self: flex-start;
          align-items: flex-start;
        }

        .chat-msg.outgoing {
          align-self: flex-end;
          align-items: flex-end;
        }

        .chat-project-card {
          background: #7C4EF5;
          color: white;
          padding: 16px 20px;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
        }

        .chat-project-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .chat-project-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .chat-project-title {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
          display: block;
        }

        .chat-bubble {
          padding: 14px 20px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
        }

        .yellow-bubble {
          background: #FAFAFC;
          border: 1px solid #E5E7EB;
          color: #111827;
          border-bottom-left-radius: 4px;
        }

        .purple-bubble {
          background: #7C4EF5;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .chat-view-more-btn {
          background: white;
          border: 1px solid #E5E7EB;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #4B5563;
          margin-top: 12px;
          cursor: pointer;
        }

        .chat-time {
          font-size: 11px;
          color: #9CA3AF;
          margin-top: 6px;
        }

        .action-bubble {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 10px 10px 10px 20px;
        }

        .chat-bubble-actions {
          display: flex;
          gap: 8px;
        }

        .chat-accept-btn {
          background: #7C4EF5;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .chat-decline-btn {
          background: #F3F4F6;
          color: #4B5563;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .msg-chat-input-area {
          padding: 24px;
          border-top: 1px solid #EEEDF3;
          flex-shrink: 0;
        }

        .chat-input-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid #E5E7EB;
          border-radius: 30px;
          padding: 8px 16px;
          background: #FAFAFC;
        }

        .chat-input-icon {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-right: 8px;
        }

        .chat-input-field {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          color: #111827;
        }

        .chat-send-btn {
          background: #7C4EF5;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* Right Details Sidebar */
        .msg-chat-details-sidebar {
          width: 280px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          padding: 32px 24px;
          overflow-y: auto;
          background: #ffffff;
        }

        .chat-details-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 32px;
        }

        .chat-details-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          color: white;
          font-size: 24px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .chat-details-name {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .chat-details-role {
          font-size: 13px;
          color: #6B7280;
          margin: 0 0 16px 0;
        }

        .chat-details-badges {
          display: flex;
          gap: 8px;
        }

        .badge-verified {
          background: #D1FAE5;
          color: #059669;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 12px;
        }

        .badge-top-client {
          background: #F5F2FF;
          color: #7C4EF5;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 12px;
        }

        .chat-details-section {
          margin-bottom: 24px;
        }

        .chat-details-section-title {
          font-size: 11px;
          font-weight: 700;
          color: #4B5563;
          margin: 0 0 16px 0;
          letter-spacing: 0.5px;
        }

        .active-project-card {
          background: #F5F2FF;
          border: 1px solid #EBE5FF;
          padding: 16px;
          border-radius: 12px;
        }

        .active-project-title {
          font-size: 14px;
          font-weight: 700;
          color: #7C4EF5;
          margin: 0 0 8px 0;
        }

        .active-project-meta {
          font-size: 12px;
          color: #9CA3AF;
          line-height: 1.5;
          margin: 0 0 12px 0;
        }

        .active-project-progress {
          width: 100%;
          height: 6px;
          background: #EBE5FF;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #7C4EF5;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
