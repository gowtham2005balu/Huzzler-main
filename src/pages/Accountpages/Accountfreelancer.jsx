
// // ClientProfileMenuScreen.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import pause from "../../assets/icons/paused.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import logoutIcon from "../../assets/icons/logout.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";

// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   // 🔹 RESPONSIVE FLAG
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   // ⭐ SIDEBAR COLLAPSE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);

//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//   if (!user) return null;

//   const fullName =
//     `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Helen Angel";

//   return (
//     <div
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-160px" : "100px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={pageStyles.page}>
//         {/* HEADER */}
//         <div
//           style={{
//             ...pageStyles.titleWrap,
//             flexWrap: "wrap",
//           }}
//         >
//           <div
//             style={{
//               ...pageStyles.backBtn,
//               marginLeft: isMobile ? "0px" : "-60px",
//             }}
//             onClick={() => navigate(-1)}
//           >
//             <img src={backarrow} alt="back" width={20} />
//           </div>

//           <div style={{ marginLeft: 12 }}>
//             <h1 style={pageStyles.title}>Profile</h1>
//             <p style={pageStyles.subtitle}>
//               Manage your account and preferences.
//             </p>
//           </div>
//         </div>

//         {/* PROFILE CARD */}
//         <div
//           style={{
//             ...pageStyles.profileCard,
//             marginLeft: isMobile ? "0px" : "30px",
//             flexDirection: isMobile ? "column" : "row",
//             textAlign: isMobile ? "center" : "left",
//           }}
//         >
//           <div style={{ position: "relative" }}>
//             <img
//               src={profileImage || profilePlaceholder}
//               style={pageStyles.avatar}
//               alt=""
//             />
//             <label style={pageStyles.editBtn}>
//               <img src={editIcon} width={40} />
//               <input type="file" hidden onChange={handleImageUpload} />
//             </label>
//             {isUploading && <div style={pageStyles.uploadOverlay} />}
//           </div>

//           <div style={{ marginTop: isMobile ? 12 : 0 }}>
//             <div style={{ fontSize: 18, fontWeight: 600 }}>{fullName}</div>
//             <div style={{ color: "#6b7280", marginTop: 4 }}>{user.email}</div>
//           </div>
//         </div>

//         {/* SECTIONS */}
//         {[{
//           title: "My Account",
//           items: [
//             ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//             ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//             ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//             ["Invite friends ",invite, ""],
//             ["Notifications", notification],
//             ["Account Settings", settings, "/freelance-dashboard/settings"],
//           ]
//         },
//         {
//           title: "Support",
//           items: [
//             ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//             ["terms of Service", helpcenter],
//             ["Privacy Policy", helpcenter, "/freelance-dashboard/settings"],
//             ["Sign out", Logout, "/firelogin"],
//           ]
//         }].map((sec, i) => (
//           <div
//             key={i}
//             style={{
//               ...pageStyles.section,
//               marginLeft: isMobile ? "0px" : "30px",
//             }}
//           >
//             <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>
//             {sec.items.map(([t, ic, path], idx) => (
//               <MenuItem key={idx} title={t} icon={ic} onClick={() => path && navigate(path)} />
//             ))}
//             {sec.title === "Settings" && (
//               <div style={pageStyles.logoutRow} onClick={handleLogout}>
//                 <img src={logoutIcon} width={18} />

//                 <img src={arrow} width={16} style={{ marginLeft: "auto", opacity: 0.3 }} />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} width={16} style={{ opacity: 0.2 }} />
//     </div>
//   );
// }

// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "'Rubik', Inter, system-ui",
//   },
//   titleWrap: {
//     width: "100%",
//     maxWidth: 1160,
//     display: "flex",
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//     cursor: "pointer",
//   },
//   title: { fontSize: 28, margin: 0, fontWeight: 700 },
//   subtitle: { marginTop: 6, fontSize: 13, color: "#6b7280" },

//   profileCard: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
//     marginBottom: 20,
//   },

//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },

//   editBtn: {
//     position: "absolute",
//     right: -5,
//     bottom: -10,
//     cursor: "pointer",
//   },

//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//     marginBottom: 20,
//   },

//   sectionTitle: { fontSize: 14, color: "#6b7280" },

//   menuItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 6px",
//     cursor: "pointer",
//     borderTop: "1px solid rgba(15,15,15,0.05)",
//   },

//   menuLeft: { display: "flex", alignItems: "center", gap: 12 },

//   logoutRow: {
//     display: "flex",
//     alignItems: "center",
//     padding: "12px 6px",
//     cursor: "pointer",
//   },
// };


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import pause from "../../assets/icons/paused.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import logoutIcon from "../../assets/icons/logout.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";
// import blocked from "../../assets/blocked.png";

// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   // ===============================
//   // RESPONSIVE FLAG (UNCHANGED)
//   // ===============================
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   // ===============================
//   // ⭐ SIDEBAR COLLAPSE (STANDARD)
//   // ===============================
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // ===============================
//   // AUTH + PROFILE LOAD (UNCHANGED)
//   // ===============================
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);

//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//   if (!user) return null;

//   const fullName =
//     `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Helen Angel";

//   return (
//     // ===============================
//     // 🔥 SIDEBAR WRAPPER (ADDED)
//     // ===============================
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-160px" : "100px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={pageStyles.page}>
//         {/* HEADER */}
//         <div style={{ ...pageStyles.titleWrap, flexWrap: "wrap" }}>
//           <div
//             style={{
//               ...pageStyles.backBtn,
//               marginLeft: isMobile ? "0px" : "-60px",
//             }}
//             onClick={() => navigate(-1)}
//           >
//             <img src={backarrow} alt="back" width={20} />
//           </div>

//           <div style={{ marginLeft: 12 }}>
//             <h1 style={pageStyles.title}>Profile</h1>
//             <p style={pageStyles.subtitle}>
//               Manage your account and preferences.
//             </p>
//           </div>
//         </div>

//         {/* PROFILE CARD */}
//         <div
//           style={{
//             ...pageStyles.profileCard,
//             marginLeft: isMobile ? "0px" : "30px",
//             flexDirection: isMobile ? "column" : "row",
//             textAlign: isMobile ? "center" : "left",
//           }}
//         >
//           <div style={{ position: "relative" }}>
//             <img
//               src={profileImage || profilePlaceholder}
//               style={pageStyles.avatar}
//               alt=""
//             />
//             <label style={pageStyles.editBtn}>
//               <img src={editIcon} width={40} />
//               <input type="file" hidden onChange={handleImageUpload} />
//             </label>
//             {isUploading && <div style={pageStyles.uploadOverlay} />}
//           </div>

//           <div style={{ marginTop: isMobile ? 12 : 0 }}>
//             <div style={{ fontSize: 18, fontWeight: 600 }}>{fullName}</div>
//             <div style={{ color: "#6b7280", marginTop: 4 }}>{user.email}</div>
//           </div>
//         </div>

//         {/* SECTIONS */}
//         {[
//           {
//             title: "My Account",
//             items: [
//               ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//               ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//               ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//               ["Invite friends", invite, ""],
//               ["Notifications", notification],
//               ["Account Settings", settings, "/freelance-dashboard/settings"],
//               ["Blocked", blocked, "/freelance-dashboard/blocked"],
//             ],
//           },
//           {
//             title: "Support",
//             items: [
//               ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//               ["Terms of Service", helpcenter,"/termsofservice"],
//               ["Privacy Policy", helpcenter, "/privacypolicy"],
//               ["Sign out", Logout, "/firelogin"],
//             ],
//           },
//         ].map((sec, i) => (
//           <div
//             key={i}
//             style={{
//               ...pageStyles.section,
//               marginLeft: isMobile ? "0px" : "30px",
//             }}
//           >
//             <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>

//             {sec.items.map(([t, ic, path], idx) => (
//               <MenuItem
//                 key={idx}
//                 title={t}
//                 icon={ic}
//                 onClick={() => path && navigate(path)}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} width={16} style={{ opacity: 0.2 }} />
//     </div>
//   );
// }

// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "'Rubik', Inter, system-ui",
//   },
//   titleWrap: {
//     width: "100%",
//     maxWidth: 1160,
//     display: "flex",
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//     cursor: "pointer",
//   },
//   title: { fontSize: 28, margin: 0, fontWeight: 700 },
//   subtitle: { marginTop: 6, fontSize: 13, color: "#6b7280" },

//   profileCard: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
//     marginBottom: 20,
//   },

//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },

//   editBtn: {
//     position: "absolute",
//     right: -5,
//     bottom: -10,
//     cursor: "pointer",
//   },

//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//     marginBottom: 20,
//   },

//   sectionTitle: { fontSize: 14, color: "#6b7280" },

//   menuItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 6px",
//     cursor: "pointer",
//     borderTop: "1px solid rgba(15,15,15,0.05)",
//   },

//   menuLeft: { display: "flex", alignItems: "center", gap: 12 },
// };






// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import pause from "../../assets/icons/paused.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import logoutIcon from "../../assets/icons/logout.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";
// import blocked from "../../assets/blocked.png";


// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   // ===============================
//   // RESPONSIVE FLAG (UNCHANGED)
//   // ===============================
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   // ===============================
//   // ⭐ SIDEBAR COLLAPSE (STANDARD)
//   // ===============================
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // ===============================
//   // AUTH + PROFILE LOAD (UNCHANGED)
//   // ===============================
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);

//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//   if (!user) return null;

//   const fullName =
//     `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Helen Angel";

//   return (
//     // ===============================
//     // 🔥 SIDEBAR WRAPPER (ADDED)
//     // ===============================
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-160px" : "100px",
//          marginTop: isMobile ? "30px" : collapsed ? "0px" : "0px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={pageStyles.page}>
//         {/* HEADER */}
//         <div style={{ ...pageStyles.titleWrap, flexWrap: "wrap" }}>
//           <div
//             style={{
//               ...pageStyles.backBtn,
//               marginLeft: isMobile ? "0px" : "-60px",
//             }}
//             onClick={() => navigate(-1)}
//           >
//             <img src={backarrow} alt="back" width={20} />
//           </div>

//           <div style={{ marginLeft: 12 }}>
//             <h1 style={pageStyles.title}>Profile</h1>
//             <p style={pageStyles.subtitle}>
//               Manage your account and preferences.
//             </p>
//           </div>
//         </div>

//         {/* PROFILE CARD */}
//         <div
//           style={{
//             ...pageStyles.profileCard,
//             marginLeft: isMobile ? "0px" : "30px",
//             flexDirection: isMobile ? "column" : "row",
//             textAlign: isMobile ? "center" : "left",
//           }}
//         >
//           <div style={{ position: "relative" }}>
//             <img
//               src={profileImage || profilePlaceholder}
//               style={pageStyles.avatar}
//               alt=""
//             />
//             <label style={pageStyles.editBtn}>
//               <img src={editIcon} width={40} />
//               <input type="file" hidden onChange={handleImageUpload} />
//             </label>
//             {isUploading && <div style={pageStyles.uploadOverlay} />}
//           </div>

//           <div style={{ marginTop: isMobile ? 12 : 0 }}>
//             <div style={{ fontSize: 18, fontWeight: 600 }}>{fullName}</div>
//             <div style={{ color: "#6b7280", marginTop: 4 }}>{user.email}</div>
//           </div>
//         </div>

//         {/* SECTIONS */}
//         {[
//           {
//             title: "My Account",
//             items: [
//               ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//               ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//               ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//               ["Invite friends", invite, ""],
//               ["Notifications", notification],
//               ["Account Settings", settings, "/freelance-dashboard/settings"],
//               ["Blocked", blocked, "/freelance-dashboard/blocked"],
//             ],
//           },
//           {
//             title: "Support",
//             items: [
//               ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//               ["Terms of Service", helpcenter,"/termsofservice"],
//               ["Privacy Policy", helpcenter, "/privacypolicy"],
//               ["Sign out", Logout, "/firelogin"],
//             ],
//           },
//         ].map((sec, i) => (
//           <div
//             key={i}
//             style={{
//               ...pageStyles.section,
//               marginLeft: isMobile ? "0px" : "30px",
//             }}
//           >
//             <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>

//             {sec.items.map(([t, ic, path], idx) => (
//               <MenuItem
//                 key={idx}
//                 title={t}
//                 icon={ic}
//                 onClick={() => path && navigate(path)}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} width={16} style={{ opacity: 0.2 }} />
//     </div>
//   );
// }

// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "'Rubik', Inter, system-ui",
//   },
//   titleWrap: {
//     width: "100%",
//     maxWidth: 1160,
//     display: "flex",
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//     cursor: "pointer",
//   },
//   title: { fontSize: 28, margin: 0, fontWeight: 700 },
//   subtitle: { marginTop: 6, fontSize: 13, color: "#6b7280" },

//   profileCard: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
//     marginBottom: 20,
//   },

//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },

//   editBtn: {
//     position: "absolute",
//     right: -5,
//     bottom: -10,
//     cursor: "pointer",
//   },

//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//     marginBottom: 20,
//   },

//   sectionTitle: { fontSize: 14, color: "#6b7280" },

//   menuItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 6px",
//     cursor: "pointer",
//     borderTop: "1px solid rgba(15,15,15,0.05)",
//   },

//   menuLeft: { display: "flex", alignItems: "center", gap: 12 },
// };


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc, getFirestore, deleteDoc } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import pause from "../../assets/icons/paused.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import logoutIcon from "../../assets/icons/logout.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";
// import blocked from "../../assets/blocked.png";

// import { deleteUser } from "firebase/auth";

// import { deleteObject } from "firebase/storage";




// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   // ===============================
//   // RESPONSIVE FLAG (UNCHANGED)
//   // ===============================
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   // ===============================
//   // ⭐ SIDEBAR COLLAPSE (STANDARD)
//   // ===============================
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   // ===============================
//   // AUTH + PROFILE LOAD (UNCHANGED)
//   // ===============================
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");

//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);

//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//  const handleDeleteAccount = async () => {
//   const confirmDelete = window.confirm(
//     "Are you sure you want to permanently delete your account?"
//   );

//   if (!confirmDelete) return;

//   try {
//     const currentUser = auth.currentUser;
//     if (!currentUser) return;

//     const uid = currentUser.uid;

//     // 🗑 Delete profile image (optional)
//     try {
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await deleteObject(imageRef);
//     } catch (e) {
//       // ignore if image does not exist
//     }

//     // 🗑 Delete Firestore user document
//     await deleteDoc(doc(db, "users", uid));

//     // 🗑 Delete Firebase Authentication user
//     await deleteUser(currentUser);

//     alert("Your account has been deleted successfully.");
//     navigate("/firelogin");
//   } catch (error) {
//     if (error.code === "auth/requires-recent-login") {
//       alert("Please log in again to delete your account.");
//       navigate("/firelogin");
//     } else {
//       console.error(error);
//       alert("Unable to delete account.");
//     }
//   }
// };



//   if (!user) return null;

//   const fullName =
//     `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Helen Angel";

//   return (
//     // ===============================
//     // 🔥 SIDEBAR WRAPPER (ADDED)
//     // ===============================
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-200px" : "-120px",
//         marginTop: isMobile ? "50px" : collapsed ? "0px" : "0px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={pageStyles.page}>
//         {/* HEADER */}
//         <div style={{ ...pageStyles.titleWrap, flexWrap: "wrap" }}>
//           <div
//             style={{
//               ...pageStyles.backBtn,
//               // marginLeft: isMobile ? "0px" : "10px",
//               marginLeft: isMobile ? "0px" : collapsed ? "-100px" : "10px",

//             }}
//             onClick={() => navigate(-1)}
//           >
//             <img src={backarrow} alt="back" width={20} />
//           </div>

//           <div style={{ marginLeft: 12 }}>
//             <h1 style={pageStyles.title}>Profile</h1>
//             <p style={pageStyles.subtitle}>
//               Manage your account and preferences.
//             </p>
//           </div>
//         </div>

//         {/* PROFILE CARD */}
//         <div
//           style={{
//             ...pageStyles.profileCard,
//             marginLeft: isMobile ? "0px" : "30px",
//             flexDirection: isMobile ? "column" : "row",
//             textAlign: isMobile ? "center" : "left",
//           }}
//         >
//           <div style={{ position: "relative" }}>
//             <img
//               src={profileImage || profilePlaceholder}
//               style={pageStyles.avatar}
//               alt=""
//             />
//             <label style={pageStyles.editBtn}>
//               <img src={editIcon} width={40} />
//               <input type="file" hidden onChange={handleImageUpload} />
//             </label>
//             {isUploading && <div style={pageStyles.uploadOverlay} />}
//           </div>

//           <div style={{ marginTop: isMobile ? 12 : 0 }}>
//             <div style={{ fontSize: 18, fontWeight: 600 }}>{fullName}</div>
//             <div style={{ color: "#6b7280", marginTop: 4 }}>{user.email}</div>
//           </div>`
//         </div>

//         {/* SECTIONS */}
//         {[
//           {
//             title: "My Account",
//             items: [
//               ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//               ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//               ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//               ["Invite friends", invite, ""],
//               ["Notifications", notification],
//               ["Account Settings", settings, "/freelance-dashboard/settings"],
//               ["Blocked", blocked, "/freelance-dashboard/blocked"],
//             ],
//           },
//           {
//             title: "Support",
//             items: [
//               ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//               ["Terms of Service", helpcenter, "/termsofservice"],
//               ["Privacy Policy", helpcenter, "/privacypolicy"],
//               ["Sign out", Logout, handleLogout],
//               ["delete account", Logout, handleDeleteAccount]


//             ],
//           },
//         ].map((sec, i) => (
//           <div
//             key={i}
//             style={{
//               ...pageStyles.section,
//               marginLeft: isMobile ? "0px" : "30px",
//             }}
//           >
//             <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>

//             {sec.items.map(([t, ic, path], idx) => (
//               <MenuItem
//                 key={idx}
//                 title={t}
//                 icon={ic}
//                 onClick={() => {
//                   if (typeof path === "function") {
//                     path();
//                   } else if (path) {
//                     navigate(path);
//                   }
//                 }}

//               />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} alt="" />
//         <span>{title}</span>
//       </div>

//       {/* RIGHT ARROW */}
//       <img
//         src={arrow}
//         width={16}
//         alt=""
//         style={pageStyles.menuArrow}
//       />
//     </div>
//   );
// }


// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "'Rubik', Inter, system-ui",
//   },
//   titleWrap: {
//     width: "100%",
//     maxWidth: 1160,
//     display: "flex",
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//     cursor: "pointer",
//   },
//   title: { fontSize: 28, margin: 0, fontWeight: 700 },
//   subtitle: { marginTop: 6, fontSize: 13, color: "#6b7280", },

//   profileCard: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
//     marginBottom: 20,
//   },

//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },

//   editBtn: {
//     position: "absolute",
//     right: -5,
//     bottom: -10,
//     cursor: "pointer",
//   },

//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     width: "100%",
//     maxWidth: 1160,
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//     marginBottom: 20,
//   },

//   sectionTitle: { fontSize: 14, color: "#000" },

//   menuItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "22px 6px",
//     cursor: "pointer",
//     // borderTop: "1px solid rgba(15,15,15,0.05)",
//   },

//   menuLeft: { display: "flex", alignItems: "center", gap: 12 },
// };



// // ClientProfileMenuScreen.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged, deleteUser } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   getFirestore,
//   deleteDoc,
// } from "firebase/firestore";
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";
// import blocked from "../../assets/blocked.png";

// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);

//   /* RESPONSIVE FLAG */
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   /* SIDEBAR COLLAPSE */
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     const handleToggle = (e) => setCollapsed(e.detail);
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   /* AUTH */
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");
//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//   const handleDeleteAccount = async () => {
//     if (!window.confirm("Delete your account permanently?")) return;
//     const currentUser = auth.currentUser;
//     const uid = currentUser.uid;

//     try {
//       try {
//         await deleteObject(ref(storage, `users/${uid}/profile.jpg`));
//       } catch {}
//       await deleteDoc(doc(db, "users", uid));
//       await deleteUser(currentUser);
//       navigate("/firelogin");
//     } catch (e) {
//       alert("Please login again to delete account");
//       navigate("/firelogin");
//     }
//   };

//   if (!user) return null;

//   const fullName =
//     `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Helen Angel";

//   return (
//     /* SIDEBAR WRAPPER */
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? 0 : collapsed ? -150 : -100,
//         marginTop: isMobile ? 60 : collapsed ? 10 : 10,

//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       {/* 🔥 CENTER PAGE CONTAINER */}
//       <div style={pageStyles.page}>
//         <div style={pageStyles.centerWrap}>
//           {/* HEADER */}
//           <div style={pageStyles.titleWrap}>
//             <div style={pageStyles.backBtn} onClick={() => navigate(-1)}>
//               <img src={backarrow} alt="back" width={20} />
//             </div>
//             <div>
//               <h1 style={pageStyles.title}>Profile</h1>
//               <p style={pageStyles.subtitle}>
//                 Manage your account and preferences.
//               </p>
//             </div>
//           </div>

//           {/* PROFILE CARD */}
//           <div
//             style={{
//               ...pageStyles.profileCard,
//               flexDirection: isMobile ? "column" : "row",
//               textAlign: isMobile ? "center" : "left",
//             }}
//           >
//             <div style={{ position: "relative" }}>
//               <img
//                 src={profileImage || profilePlaceholder}
//                 style={pageStyles.avatar}
//                 alt=""
//               />
//               <label style={pageStyles.editBtn}>
//                 <img src={editIcon} width={36} />
//                 <input type="file" hidden onChange={handleImageUpload} />
//               </label>
//               {isUploading && <div style={pageStyles.uploadOverlay} />}
//             </div>

//             <div>
//               <div style={{ fontSize: 30, fontWeight: 400,paddingBottom:"10px" }}>{fullName}</div>
//               <div style={{fontSize: 16, fontWeight: 400, color: "#6b7280" }}>{user.email}</div>
//             </div>
//           </div>

//           {/* SECTIONS */}
//           {[
//             {
//               title: "My Account",
//               items: [
//                 ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//                 ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//                 ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//                 ["Invite friends", invite],
//                 // ["Notifications", notification],
//                 ["Account Settings", settings, "/freelance-dashboard/settings"],
//                 ["Blocked", blocked, "/freelance-dashboard/blocked"],
//               ],
//             },
//             {
//               title: "Support",
//               items: [
//                 ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//                 ["Terms of Service", helpcenter, "/termsofservice"],
//                 ["Privacy Policy", helpcenter, "/privacypolicy"],
//                 // <MenuItem title="Terms of Service" icon={helpcenter} onClick={() => navigate("/termsofservice")} />
//                 // <MenuItem title="Privacy Policy" icon={helpcenter} onClick={() => navigate("/privacypolicy")} />
//                 ["Sign out", Logout, handleLogout],
//                 ["Delete account", Logout, handleDeleteAccount],
//               ],
//             },
//           ].map((sec, i) => (
//             <div key={i} style={pageStyles.section}>
//               <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>
//               {sec.items.map(([t, ic, path], idx) => (
//                 <MenuItem
//                   key={idx}
//                   title={t}
//                   icon={ic}
//                   onClick={() =>
//                     typeof path === "function"
//                       ? path()
//                       : path && navigate(path)
//                   }
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} alt="" />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} width={16} alt="" />
//     </div>
//   );
// }

// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     justifyContent: "center",
//     fontFamily: "'Rubik', system-ui",
//   },
//   centerWrap: {
//     width: "100%",
//     maxWidth: 800,
//   },
//   titleWrap: {
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: "1px solid #BDBDBD",
//     cursor: "pointer",
//   },
//   title: { fontSize: 36, margin: 0, fontWeight: 400 },
//   subtitle: { fontSize: 13, color: "#6b7280" },

//   profileCard: {
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     // boxShadow:" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//     border: "1px solid #BDBDBD",
//     marginBottom: 20,
//   },
//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },
//   editBtn: {
//     position: "absolute",
//     right: -6,
//     bottom:-18,
//     cursor: "pointer",
//   },
//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     // boxShadow:" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//     marginBottom: 20,
//     border: "1px solid #BDBDBD",
//   },
//   sectionTitle: { fontSize: 20, fontWeight: 400 },

//   menuItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "20px 6px",
//     cursor: "pointer",
//   fontSize: 16,
//    fontWeight: 400 ,

//   },
//   menuLeft: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },
// };




// // ClientProfileMenuScreen.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged, deleteUser } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   getFirestore,
//   deleteDoc,
// } from "firebase/firestore";
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import {

//   reauthenticateWithPopup,
//   GoogleAuthProvider,
// } from "firebase/auth";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";
// import blocked from "../../assets/blocked.png";
// import delete_Account from "../../assets/delete_Account.png";

// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);


//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteReason, setDeleteReason] = useState("");
//   const [deleteDesc, setDeleteDesc] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);



//   /* RESPONSIVE FLAG */
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   /* SIDEBAR COLLAPSE */
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     const handleToggle = (e) => setCollapsed(e.detail);
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   /* AUTH */
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");
//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//   const handleDeleteAccount = async () => {
//     if (!deleteReason) {
//       alert("Please select a reason");
//       return;
//     }

//     const currentUser = auth.currentUser;
//     if (!currentUser) return;

//     setIsDeleting(true);

//     try {
//       const uid = currentUser.uid;

//       // 1️⃣ Save deletion reason
//       await addDoc(collection(db, "account_deletions"), {
//         uid,
//         email: currentUser.email,
//         reason: deleteReason,
//         description: deleteDesc || "",
//         createdAt: serverTimestamp(),
//       });

//       // 2️⃣ Delete profile image
//       try {
//         await deleteObject(ref(storage, `users/${uid}/profile.jpg`));
//       } catch { }

//       // 3️⃣ Delete Firestore user document
//       await deleteDoc(doc(db, "users", uid));

//       // 4️⃣ DELETE AUTH USER (SAFE)
//       try {
//         await deleteUser(currentUser);
//       } catch (err) {
//         // 🔁 Re-auth required
//         const provider = new GoogleAuthProvider();
//         await reauthenticateWithPopup(currentUser, provider);
//         await deleteUser(currentUser);
//       }

//       navigate("/firelogin");
//     } catch (err) {
//       console.error(err);
//       alert("Account deletion failed. Please login again.");
//       navigate("/firelogin");
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteModal(false);
//     }
//   };


//   if (!user) return null;

//   const fullName =
//     `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Helen Angel";

//   return (
//     /* SIDEBAR WRAPPER */
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? 0 : collapsed ? -150 : -100,
//         marginTop: isMobile ? 60 : collapsed ? 10 : 10,

//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       {/* 🔥 CENTER PAGE CONTAINER */}
//       <div style={pageStyles.page}>
//         <div style={pageStyles.centerWrap}>
//           {/* HEADER */}
//           <div style={pageStyles.titleWrap}>
//             <div style={pageStyles.backBtn} onClick={() => navigate(-1)}>
//               <img src={backarrow} alt="back" width={20} />
//             </div>
//             <div>
//               <h1 style={pageStyles.title}>Profile</h1>
//               <p style={pageStyles.subtitle}>
//                 Manage your account and preferences.
//               </p>
//             </div>
//           </div>

//           {/* PROFILE CARD */}
//           <div
//             style={{
//               ...pageStyles.profileCard,
//               flexDirection: isMobile ? "column" : "row",
//               textAlign: isMobile ? "center" : "left",
//             }}
//           >
//             <div style={{ position: "relative" }}>
//               <img
//                 src={profileImage || profilePlaceholder}
//                 style={pageStyles.avatar}
//                 alt=""
//               />
//               <label style={pageStyles.editBtn}>
//                 <img src={editIcon} width={36} />
//                 <input type="file" hidden onChange={handleImageUpload} />
//               </label>
//               {isUploading && <div style={pageStyles.uploadOverlay} />}
//             </div>

//             <div>
//               <div style={{ fontSize: 30, fontWeight: 400, paddingBottom: "10px" }}>{fullName}</div>
//               <div style={{ fontSize: 16, fontWeight: 400, color: "#6b7280" }}>{user.email}</div>
//             </div>
//           </div>

//           {/* SECTIONS */}
//           {[
//             {
//               title: "My Account",
//               items: [
//                 ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//                 ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//                 ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//                 ["Invite friends", invite],
//                 // ["Notifications", notification],
//                 ["Account Settings", settings, "/freelance-dashboard/settings"],
//                 ["Blocked", blocked, "/freelance-dashboard/blocked"],
//               ],
//             },
//             {
//               title: "Support",
//               items: [
//                 ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//                 ["Terms of Service", helpcenter, "/termsofservice"],
//                 ["Privacy Policy", helpcenter, "/privacypolicy"],
//                 // <MenuItem title="Terms of Service" icon={helpcenter} onClick={() => navigate("/termsofservice")} />
//                 // <MenuItem title="Privacy Policy" icon={helpcenter} onClick={() => navigate("/privacypolicy")} />
//                 ["Sign out", Logout, handleLogout],
//                 ["Delete account", Logout, () => setShowDeleteModal(true)],


//               ],
//             },
//           ].map((sec, i) => (
//             <div key={i} style={pageStyles.section}>
//               <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>
//               {sec.items.map(([t, ic, path], idx) => (
//                 <MenuItem
//                   key={idx}
//                   title={t}
//                   icon={ic}
//                   onClick={() =>
//                     typeof path === "function"
//                       ? path()
//                       : path && navigate(path)
//                   }
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* {showDeleteModal && (
//         <div style={deleteStyles.overlay}>
//           <div style={deleteStyles.modal}>
//             <div style={deleteStyles.icon}>⚠️</div>
//             <h2 style={deleteStyles.title}>Delete account</h2>

//             <p style={deleteStyles.desc}>
//               Are you sure you want to delete this account? This action{" "}
//               <span style={{ color: "#ef4444", fontWeight: 500 }}>
//                 cannot be undone
//               </span>
//           . Please tell us why you’d like to delete your huzzler account. this information will help us improve
//             </p>

//             <div style={deleteStyles.box}>
//               <p style={deleteStyles.boxTitle}>REASON FOR DELETION</p>

//               {[
//                 "Couldn’t find suitable freelancers",
//                 "Work outcomes didn’t meet expectations",
//                 "Communication and collaboration issues",
//                 "Platform experience was not effective",
//                 "Othe  (please specify)",
//               ].map((r) => (
//                 <label key={r} style={deleteStyles.radioRow}>
//                   <input
//                     type="radio"
//                     name="deleteReason"
//                     value={r}
//                     checked={deleteReason === r}
//                     onChange={() => setDeleteReason(r)}
//                   />
//                   {r}
//                 </label>
//               ))}

//               {deleteReason === "Other" && (
//                 <textarea
//                   style={deleteStyles.textarea}
//                   placeholder="Tell us a bit more..."
//                   value={deleteDesc}
//                   onChange={(e) => setDeleteDesc(e.target.value)}
//                 />
//               )}
//             </div>

//             <div style={deleteStyles.actions}>
//               <button
//                 style={deleteStyles.cancel}
//                 onClick={() => setShowDeleteModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 style={deleteStyles.confirm}
//                 onClick={handleDeleteAccount}
//                 disabled={isDeleting}
//               >
//                 {isDeleting ? "Deleting..." : "Confirm Deletion"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}
// {showDeleteModal && (
//   <div style={deleteStyles.overlay}>
//     <div style={deleteStyles.modal}>

//       {/* WARNING ICON */}
//       <div>
//       <img src={delete_Account} style={{width:'30px'}} alt="delete_Account" />
//       </div>

//       <h2 style={deleteStyles.title}>Delete account</h2>

//       <p style={deleteStyles.desc}>
//         Are you sure you want to delete this account? This action{" "}
//         <span style={{ color: "#ef4444", fontWeight: 500 }}>
//           cannot be undone
//         </span>
//         . Please tell us why you’d like to delete your huzzler account. this
//         information will help us improve
//       </p>

//       {/* REASON BOX */}
//       <div style={deleteStyles.box}>
//         <p style={deleteStyles.boxTitle}>REASON FOR DELETION</p>

//         {[
//           "Couldn’t find suitable freelancers",
//           "Project outcomes didn’t meet expectations",
//           "Communication and collaboration issues",
//           "Platform experience was not effective",
//           "Other (please specify)",
//         ].map((r) => (
//           <label key={r} style={deleteStyles.radioRow}>
//             <input
//               type="radio"
//               name="deleteReason"
//               value={r}
//               checked={deleteReason === r}
//               onChange={() => setDeleteReason(r)}
//             />
//             <span>{r}</span>
//           </label>
//         ))}

//         {deleteReason === "Other (please specify)" && (
//           <textarea
//             style={deleteStyles.textarea}
//             placeholder="Tell us a bit more..."
//             value={deleteDesc}
//             onChange={(e) => setDeleteDesc(e.target.value)}
//           />
//         )}
//       </div>

//       {/* ACTIONS */}
//       <div style={deleteStyles.actions}>
//         <button
//           style={deleteStyles.cancel}
//           onClick={() => setShowDeleteModal(false)}
//         >
//           Cancel
//         </button>

//         <button
//           style={deleteStyles.confirm}
//           onClick={handleDeleteAccount}
//           disabled={isDeleting}
//         >
//           {isDeleting ? "Deleting..." : "Confirm Deletion"}
//         </button>
//       </div>
//     </div>
//   </div>
// )}


//     </div>


//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick }) {
//   return (
//     <div style={pageStyles.menuItem} onClick={onClick}>
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} alt="" />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} width={16} alt="" />
//     </div>
//   );
// }

// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     justifyContent: "center",
//     fontFamily: "'Rubik', system-ui",
//   },
//   centerWrap: {
//     width: "100%",
//     maxWidth: 800,
//   },
//   titleWrap: {
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: "1px solid #BDBDBD",
//     cursor: "pointer",
//   },
//   title: { fontSize: 36, margin: 0, fontWeight: 400 },
//   subtitle: { fontSize: 13, color: "#6b7280" },

//   profileCard: {
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     // boxShadow:" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//     border: "1px solid #BDBDBD",
//     marginBottom: 20,
//   },
//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },
//   editBtn: {
//     position: "absolute",
//     right: -6,
//     bottom: -18,
//     cursor: "pointer",
//   },
//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     // boxShadow:" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//     marginBottom: 20,
//     border: "1px solid #BDBDBD",
//   },
//   sectionTitle: { fontSize: 20, fontWeight: 400 },

//   menuItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "20px 6px",
//     cursor: "pointer",
//     fontSize: 16,
//     fontWeight: 400,

//   },
//   menuLeft: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },
// };


// const deleteStyles = {
//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 999,
//     padding: 16,
//   },

//   modal: {
//     background: "#fff",
//     borderRadius: 22,
//     padding: "32px 26px",
//     width: "100%",
//     maxWidth: 560,
//     textAlign: "center",
//     boxShadow: "0 20px 45px rgba(0,0,0,0.15)",
//   },

//   warnIcon: {
//     width: 48,
//     height: 48,
//     margin: "0 auto 12px",
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: 600,
//     marginBottom: 8,
//     color: "#d10000",
//   },

//   desc: {
//     fontSize: 14,
//     color: "#444",
//     lineHeight: 1.6,
//     marginBottom: 26,
//   },

//   box: {
//     border: "1px solid #facc15",
//     borderRadius: 14,
//     padding: 18,
//     textAlign: "left",
//     background: "#fffbeb",
//   },

//   boxTitle: {
//     fontSize: 12,
//     fontWeight: 600,
//     marginBottom: 14,
//     color: "#6b7280",
//     letterSpacing: 0.6,
//   },

//   radioRow: {
//     display: "flex",
//     gap: 10,
//     alignItems: "center",
//     fontSize: 14,
//     marginBottom: 14,
//     cursor: "pointer",
//   },

//   textarea: {
//     width: "100%",
//     height: 110,
//     marginTop: 12,
//     padding: 14,
//     borderRadius: 10,
//     border: "none",
//     resize: "none",
//     fontSize: 14,
//     outline: "none",
//     background: "#f3f4f6",
//   },

//   actions: {
//     display: "flex",
//     justifyContent: "center",
//     gap: 18,
//     marginTop: 28,
//   },

//   cancel: {
//     padding: "11px 30px",
//     borderRadius: 999,
//     border: "1px solid #d1d5db",
//     background: "#fff",
//     cursor: "pointer",
//     fontSize: 14,
//   },

//   confirm: {
//     padding: "11px 34px",
//     borderRadius: 999,
//     border: "none",
//     background: "#6d28d9",
//     color: "#fff",
//     fontWeight: 600,
//     fontSize: 14,
//     cursor: "pointer",
//   },
// };





// // ClientProfileMenuScreen.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAuth, signOut, onAuthStateChanged, deleteUser } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   getFirestore,
//   deleteDoc,
// } from "firebase/firestore";
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import {

//   reauthenticateWithPopup,
//   GoogleAuthProvider,
// } from "firebase/auth";

// // assets
// import arrow from "../../assets/icons/arrow.png";
// import backarrow from "../../assets/icons/backarrow.png";
// import profilePlaceholder from "../../assets/icons/profile.png";
// import notification from "../../assets/kk.png";
// import MyServices from "../../assets/icons/MyServices.png";
// import invite from "../../assets/icons/invite.png";
// import settings from "../../assets/icons/settings.png";
// import helpcenter from "../../assets/icons/helpcenter.png";
// import editIcon from "../../assets/edit.png";
// import MyJobs from "../../assets/icons/myjobs.png";
// import Logout from "../../assets/icons/logout.png";
// import blocked from "../../assets/blocked.png";
// import delete_Account from "../../assets/blocked.png";

// export default function ClientProfileMenuScreen() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const storage = getStorage();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [isUploading, setUploading] = useState(false);


//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteReason, setDeleteReason] = useState("");
//   const [deleteDesc, setDeleteDesc] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);



//   /* RESPONSIVE FLAG */
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   /* SIDEBAR COLLAPSE */
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     const handleToggle = (e) => setCollapsed(e.detail);
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   /* AUTH */
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return navigate("/firelogin");
//       const snap = await getDoc(doc(db, "users", currentUser.uid));
//       if (snap.exists()) {
//         setUser(snap.data());
//         setProfileImage(snap.data().profileImage || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const uid = auth.currentUser.uid;
//       const imageRef = ref(storage, `users/${uid}/profile.jpg`);
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       await updateDoc(doc(db, "users", uid), { profileImage: url });
//       setProfileImage(url);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     if (!window.confirm("Logout?")) return;
//     await signOut(auth);
//     navigate("/firelogin");
//   };

//   const handleDeleteAccount = async () => {
//     if (!deleteReason) {
//       alert("Please select a reason");
//       return;
//     }

//     const currentUser = auth.currentUser;
//     if (!currentUser) return;

//     setIsDeleting(true);

//     try {
//       const uid = currentUser.uid;

//       // 1️⃣ Save deletion reason
//       await addDoc(collection(db, "account_deletions"), {
//         uid,
//         email: currentUser.email,
//         reason: deleteReason,
//         description: deleteDesc || "",
//         createdAt: serverTimestamp(),
//       });

//       // 2️⃣ Delete profile image
//       try {
//         await deleteObject(ref(storage, `users/${uid}/profile.jpg`));
//       } catch { }

//       // 3️⃣ Delete Firestore user document
//       await deleteDoc(doc(db, "users", uid));

//       // 4️⃣ DELETE AUTH USER (SAFE)
//       try {
//         await deleteUser(currentUser);
//       } catch (err) {
//         // 🔁 Re-auth required
//         const provider = new GoogleAuthProvider();
//         await reauthenticateWithPopup(currentUser, provider);
//         await deleteUser(currentUser);
//       }

//       navigate("/firelogin");
//     } catch (err) {
//       console.error(err);
//       alert("Account deletion failed. Please login again.");
//       navigate("/firelogin");
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteModal(false);
//     }
//   };


//   if (!user) return null;

//   const fullName =
//     `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Helen Angel";

//   return (
//     /* SIDEBAR WRAPPER */
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? 0 : collapsed ? -150 : -100,
//         marginTop: isMobile ? 60 : collapsed ? 10 : 10,

//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       {/* 🔥 CENTER PAGE CONTAINER */}
//       <div style={pageStyles.page}>
//         <div style={pageStyles.centerWrap}>
//           {/* HEADER */}
//           <div style={pageStyles.titleWrap}>
//             <div style={pageStyles.backBtn} onClick={() => navigate(-1)}>
//               <img src={backarrow} alt="back" width={20} />
//             </div>
//             <div>
//               <h1 style={pageStyles.title}>Profile</h1>
//               <p style={pageStyles.subtitle}>
//                 Manage your account and preferences.
//               </p>
//             </div>
//           </div>

//           {/* PROFILE CARD */}
//           <div
//             style={{
//               ...pageStyles.profileCard,
//               flexDirection: isMobile ? "column" : "row",
//               textAlign: isMobile ? "center" : "left",
//             }}
//           >
//             <div style={{ position: "relative" }}>
//               <img
//                 src={profileImage || profilePlaceholder}
//                 style={pageStyles.avatar}
//                 alt=""
//               />
//               <label style={pageStyles.editBtn}>
//                 <img src={editIcon} width={36} />
//                 <input type="file" hidden onChange={handleImageUpload} />
//               </label>
//               {isUploading && <div style={pageStyles.uploadOverlay} />}
//             </div>

//             <div>
//               <div style={{ fontSize: 30, fontWeight: 400, paddingBottom: "10px" }}>{fullName}</div>
//               <div style={{ fontSize: 16, fontWeight: 400, color: "#6b7280" }}>{user.email}</div>
//             </div>
//           </div>

//           {/* SECTIONS */}
//           {[
//             {
//               title: "My Account",
//               items: [
//                 ["Profile Summary", profilePlaceholder, "/freelance-dashboard/Profilebuilder"],
//                 ["My Services", MyServices, "/freelance-dashboard/sidebarsaved"],
//                 ["My Jobs", MyJobs, "/freelance-dashboard/freelancermyworks"],
//                 ["Invite friends", invite],
//                 // ["Notifications", notification],
//                 ["Account Settings", settings, "/freelance-dashboard/settings"],
//                 ["Blocked", blocked, "/freelance-dashboard/blocked"],
//               ],
//             },
//             {
//               title: "Support",
//               items: [
//                 ["Help Center", helpcenter, "/freelance-dashboard/helpcenter"],
//                 ["Terms of Service", helpcenter, "/termsofservice"],
//                 ["Privacy Policy", helpcenter, "/privacypolicy"],

//                 ["Sign out", Logout, handleLogout, { color: "#E7000B" }],


//               ],
//             },
//           ].map((sec, i) => (
//             <div key={i} style={pageStyles.section}>
//               <h3 style={pageStyles.sectionTitle}>{sec.title}</h3>
//               {sec.items.map(([t, ic, path], idx) => (
//                 <MenuItem
//                   key={idx}
//                   title={t}
//                   icon={ic}
//                   style={style}   // 👈 pass pannrom
//                   onClick={() =>
//                     typeof path === "function"
//                       ? path()
//                       : path && navigate(path)
//                   }
//                 />

//               ))}
//             </div>
//           ))}
//         </div>
//       </div>



//     </div>


//   );
// }

// /* MENU ITEM */
// function MenuItem({ title, icon, onClick, style }) {
//   return (
//     <div
//       style={{
//         ...pageStyles.menuItem,
//         ...style   // 🔥 Sign out ku red apply aagum
//       }}
//       onClick={onClick}
//     >
//       <div style={pageStyles.menuLeft}>
//         <img src={icon} width={18} alt="" />
//         <span>{title}</span>
//       </div>
//       <img src={arrow} width={16} alt="" />
//     </div>
//   );
// }


// /* STYLES */
// const pageStyles = {
//   page: {
//     minHeight: "100vh",
//     padding: 20,
//     display: "flex",
//     justifyContent: "center",
//     fontFamily: "'Rubik', system-ui",
//   },
//   centerWrap: {
//     width: "100%",
//     maxWidth: 800,
//   },
//   titleWrap: {
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//     marginBottom: 18,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     background: "#fff",
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: "1px solid #BDBDBD",
//     cursor: "pointer",
//   },
//   title: { fontSize: 36, margin: 0, fontWeight: 400 },
//   subtitle: { fontSize: 13, color: "#6b7280" },

//   profileCard: {
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     display: "flex",
//     alignItems: "center",
//     gap: 18,
//     // boxShadow:" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//     border: "1px solid #BDBDBD",
//     marginBottom: 20,
//   },
//   avatar: {
//     width: 75,
//     height: 75,
//     borderRadius: "50%",
//     objectFit: "cover",
//   },
//   editBtn: {
//     position: "absolute",
//     right: -6,
//     bottom: -18,
//     cursor: "pointer",
//   },
//   uploadOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     borderRadius: "50%",
//   },

//   section: {
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     // boxShadow:" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//     marginBottom: 20,
//     border: "1px solid #BDBDBD",
//   },
//   sectionTitle: { fontSize: 20, fontWeight: 400 },

//   menuItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "20px 6px",
//     cursor: "pointer",
//     fontSize: 16,
//     fontWeight: 400,

//   },
//   menuLeft: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },
// };


// const deleteStyles = {
//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.35)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 999,
//     padding: 16,
//   },

//   modal: {
//     background: "#fff",
//     borderRadius: 22,
//     padding: "32px 26px",
//     width: "100%",
//     maxWidth: 560,
//     textAlign: "left",
//     boxShadow: "0 20px 45px rgba(0,0,0,0.15)",
//   },

//   warnIcon: {
//     width: 48,
//     height: 48,
//     margin: "0 auto 12px",
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: 600,
//     marginBottom: 8,
//     color: "#d10000",
//   },
//   header: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",   // ✅ centers icon + title
//     textAlign: "center",
//     marginBottom: 12,
//   },

//   desc: {
//     fontSize: 14,
//     color: "#444",
//     lineHeight: 1.6,
//     marginBottom: 26,
//   },

//   box: {
//     border: "1px solid #facc15",
//     borderRadius: 14,
//     padding: 18,
//     textAlign: "left",

//   },

//   boxTitle: {
//     fontSize: 12,
//     fontWeight: 600,
//     marginBottom: 14,
//     color: "#6b7280",
//     letterSpacing: 0.6,
//   },


//   radioRow: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: 12,
//     fontSize: 14,
//     marginBottom: 14,
//     cursor: "pointer",
//     width: "100%",        // 👈 CRITICAL
//   },

//   radio: {
//     width: 16,          // ✅ fixed column
//     height: 16,
//     marginTop: 2,
//     flexShrink: 0,        // 👈 keeps radios in a straight column
//   },

//   radioText: {
//     lineHeight: "20px",
//     textAlign: "left",
//   },


//   textarea: {
//     width: "100%",
//     height: 110,
//     marginTop: 12,
//     padding: 14,
//     borderRadius: 10,
//     border: "none",
//     resize: "none",
//     fontSize: 14,
//     outline: "none",
//     background: "#f3f4f6",
//   },

//   actions: {
//     display: "flex",
//     justifyContent: "center",
//     gap: 18,
//     marginTop: 28,
//   },

//   cancel: {
//     padding: "11px 30px",
//     borderRadius: 999,
//     border: "1px solid #d1d5db",
//     background: "#fff",
//     cursor: "pointer",
//     fontSize: 14,
//   },

//   confirm: {
//     padding: "11px 34px",
//     borderRadius: 999,
//     border: "none",
//     background: "#6d28d9",
//     color: "#fff",
//     fontWeight: 600,
//     fontSize: 14,
//     cursor: "pointer",
//   },
// };


// ClientProfileMenuScreen.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileHeader from "../../components/ProfileHeader";

import { getAuth, signOut, onAuthStateChanged, deleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Layers,
  Eye,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  Plus,
  Search,
  Bell,
  Sparkles,
} from "lucide-react";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  reauthenticateWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

// assets
import arrow from "../../assets/icons/arrow.png";
import backarrow from "../../assets/icons/backarrow.png";
import profilePlaceholder from "../../assets/icons/profile.png";
import notification from "../../assets/kk.png";
import MyServices from "../../assets/icons/MyServices.png";
import invite from "../../assets/icons/invite.png";
import settings from "../../assets/icons/settings.png";
import helpcenter from "../../assets/icons/helpcenter.png";
import editIcon from "../../assets/edit.png";
import MyJobs from "../../assets/icons/myjobs.png";
import Logout from "../../assets/icons/logout.png";
import blocked from "../../assets/blocked.png";
import delete_Account from "../../assets/blocked.png";

import AddPortfolioPopup from "../../Firebaseaddporfoilo/AddPortfolioPopup";

export default function ClientProfileMenuScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setUploading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteDesc, setDeleteDesc] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangePwdModalOpen, setIsChangePwdModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPassword: "",
    retype: "",
    logoutOtherDevices: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [tfaEnabled, setTfaEnabled] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [marketingNotif, setMarketingNotif] = useState(false);

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "Profile Summary"
  );
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [pendingCount, setPendingCount] = useState(4);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [portfolio, setPortfolio] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [isPortfolioPopupOpen, setIsPortfolioPopupOpen] = useState(false);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    const authUser = auth.currentUser;
    if (!authUser) return;

    const colRef = collection(db, "services");
    const q = query(colRef, where("userId", "==", authUser.uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() || {}),
        }));
        setServices(list);
        setLoadingServices(false);
      },
      (err) => {
        console.error("Error listening to services in profile:", err);
        setLoadingServices(false);
      }
    );

    return () => unsub();
  }, [auth, db]);

  useEffect(() => {
    const authUser = auth.currentUser;
    if (!authUser) return;

    const q = query(
      collection(db, "notifications"),
      where("type", "==", "hire_request"),
      where("freelancerId", "==", authUser.uid),
      where("read", "==", false)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setPendingCount(snap.size || 0);
      },
      (err) => {
        console.error("Error fetching requests count:", err);
      }
    );

    return () => unsub();
  }, [auth, db]);

  useEffect(() => {
    const authUser = auth.currentUser;
    if (!authUser) {
      setLoadingPortfolio(false);
      return;
    }

    const portfolioRef = collection(db, "users", authUser.uid, "portfolio");
    const unsub = onSnapshot(
      portfolioRef,
      (snap) => {
        const list = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() || {}),
        }));
        setPortfolio(list);
        setLoadingPortfolio(false);
      },
      (err) => {
        console.error("Error listening to portfolio:", err);
        setLoadingPortfolio(false);
      }
    );

    return () => unsub();
  }, [auth, db]);

  const handlePauseToggle = async (job) => {
    const authUser = auth.currentUser;
    if (!authUser) return;

    const nextPaused = !job.isPaused;

    try {
      const mainRef = doc(db, "services", job.id);
      const userRef = doc(db, "users", authUser.uid, "services", job.id);

      await updateDoc(mainRef, { isPaused: nextPaused });
      await updateDoc(userRef, { isPaused: nextPaused });
    } catch (error) {
      console.error("Error toggling pause state:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDeleteService = async (job) => {
    const authUser = auth.currentUser;
    if (!authUser) return;

    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await deleteDoc(doc(db, "services", job.id));
      await deleteDoc(doc(db, "users", authUser.uid, "services", job.id));
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service.");
    }
  };

  const handleAvailabilityToggle = async () => {
    const authUser = auth.currentUser;
    if (!authUser) return;
    const nextAvailable = displayUser.isAvailable !== false ? false : true;
    try {
      await updateDoc(doc(db, "users", authUser.uid), { isAvailable: nextAvailable });
      setUser(prev => prev ? { ...prev, isAvailable: nextAvailable } : null);
    } catch (err) {
      console.error("Error toggling availability:", err);
    }
  };

  /* RESPONSIVE FLAG */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* SIDEBAR COLLAPSE */
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    const handleToggle = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  /* AUTH */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return navigate("/firelogin");
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setUser(snap.data());
        setProfileImage(snap.data().profileImage || "");
      }
    });
    return () => unsub();
  }, [auth, db, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uid = auth.currentUser.uid;
      const imageRef = ref(storage, `users/${uid}/profile.jpg`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "users", uid), { profileImage: url });
      setProfileImage(url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm("Are you sure you want to remove your photo?")) return;
    try {
      const uid = auth.currentUser.uid;
      await updateDoc(doc(db, "users", uid), { profileImage: "" });
      setProfileImage("");
    } catch (e) {
      console.error(e);
      alert("Failed to remove photo.");
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Logout?")) return;
    await signOut(auth);
    navigate("/freelance-dashboard");
  };

  const handleDeleteAccount = async () => {
    if (!deleteReason) {
      alert("Please select a reason");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) return navigate("/freelance-dashboard");

    setIsDeleting(true);

    try {
      const uid = currentUser.uid;

      await addDoc(collection(db, "account_deletions"), {
        uid,
        email: currentUser.email,
        reason: deleteReason,
        description: deleteDesc || "",
      });

      await deleteDoc(doc(db, "users", currentUser.uid));

      const providerId = currentUser.providerData[0]?.providerId;

      if (providerId === "password") {
        const password = prompt("Enter your password to confirm deletion:");
        if (!password) return;

        const cred = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, cred);
        await deleteUser(currentUser);
      } else {
        const provider =
          providerId === "google.com"
            ? new GoogleAuthProvider()
            : new GithubAuthProvider();

        await reauthenticateWithPopup(currentUser, provider);
        await deleteUser(currentUser);
      }

      navigate("/freelance-dashboard");
    } catch (err) {
      console.error(err);
      alert("Account deletion failed. Please login again.");
      navigate("/freelance-dashboard");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };


  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.current || !passwordForm.newPassword || !passwordForm.retype) {
      setPasswordError("Please fill in all fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.retype) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    const authUser = auth.currentUser;
    if (!authUser) {
      setPasswordError("You must be logged in.");
      return;
    }

    setIsChangingPassword(true);

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(authUser.email, passwordForm.current);
      await reauthenticateWithCredential(authUser, credential);

      // Update password
      await updatePassword(authUser, passwordForm.newPassword);

      setPasswordSuccess("Password updated successfully!");
      setPasswordForm({ current: "", newPassword: "", retype: "", logoutOtherDevices: false });

      setTimeout(() => {
        setIsChangePwdModalOpen(false);
        setPasswordSuccess("");
      }, 2000);

    } catch (error) {
      console.error("Error changing password:", error);
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-login-credentials" || error.code === "auth/invalid-credential") {
        setPasswordError("Incorrect current password.");
      } else if (error.code === "auth/user-mismatch") {
        setPasswordError("Authentication error. Please re-login.");
      } else {
        setPasswordError("Failed to update password. Please try again.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const displayUser = user || {
    first_name: "Helen",
    last_name: "Angel",
    email: "helen@example.com"
  };

  const fullName =
    `${displayUser.first_name || ""} ${displayUser.last_name || ""}`.trim() || "Helen Angel";

  const firstInit = displayUser.first_name?.[0] || displayUser.firstName?.[0] || "H";
  const lastInit = displayUser.last_name?.[0] || displayUser.lastName?.[0] || "A";
  const initials = `${firstInit}${lastInit}`.toUpperCase();
  const roleDisplay = displayUser.role || displayUser.professional_title || "UI/UX Designer • Freelancer";


  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    bio: "",
  });

  const handleEditPersonalInfoClick = () => {
    setEditForm({
      firstName: displayUser.first_name || displayUser.firstName || "",
      lastName: displayUser.last_name || displayUser.lastName || "",
      phone: displayUser.phone || "",
      location: displayUser.location || displayUser.city || "",
      bio: displayUser.about || displayUser.bio || "",
    });
    setIsEditingPersonalInfo(true);
  };

  const handleSavePersonalInfoClick = async () => {
    const authUser = auth.currentUser;
    if (!authUser) {
      alert("Not authenticated");
      return;
    }
    try {
      await updateDoc(doc(db, "users", authUser.uid), {
        first_name: editForm.firstName,
        last_name: editForm.lastName,
        phone: editForm.phone,
        location: editForm.location,
        about: editForm.bio,
      });
      setUser(prev => prev ? ({ ...prev, first_name: editForm.firstName, last_name: editForm.lastName, phone: editForm.phone, location: editForm.location, about: editForm.bio }) : null);
      setIsEditingPersonalInfo(false);
      alert("Profile updated successfully!");
    } catch (e) {
      console.error("Failed to update profile", e);
      alert("Failed to update profile.");
    }
  };

  const uniqueCategories = [...new Set(services.map((s) => s.category).filter(Boolean))];
  const activeServices = services.filter((s) => !s.isPaused);
  const pausedServices = services.filter((s) => s.isPaused);

  const filteredServices = services.filter((s) => {
    if (activeTab === "My Services") {
      if (statusFilter === "Active" && s.isPaused) return false;
      if (statusFilter === "Paused" && !s.isPaused) return false;
    } else {
      if (!s.isPaused) return false;
    }

    if (categoryFilter !== "All" && s.category !== categoryFilter) return false;

    if (priceFilter !== "All") {
      const price = s.price || s.budget_from || 0;
      if (priceFilter === "0-5000" && price >= 5000) return false;
      if (priceFilter === "5000-10000" && (price < 5000 || price > 10000)) return false;
      if (priceFilter === "10000+" && price <= 10000) return false;
    }
    return true;
  });

  const renderServiceCard = (job, idx) => {
    const serviceColors = [
      { bg: "linear-gradient(135deg, #8b5cf6, #a78bfa)", label: "UI/UX Design Service" },
      { bg: "linear-gradient(135deg, #10b981, #34d399)", label: "Mobile App Design" },
      { bg: "linear-gradient(135deg, #f97316, #fb923c)", label: "Brand Identity" }
    ];
    const designTheme = serviceColors[idx % serviceColors.length];
    const isJobPaused = !!job.isPaused;

    return (
      <div
        key={job.id}
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "default"
        }}
      >
        {/* Banner Area */}
        <div
          style={{
            background: designTheme.bg,
            height: "130px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box"
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "15px",
              textAlign: "center",
              letterSpacing: "0.2px"
            }}
          >
            {job.category || designTheme.label}
          </span>
        </div>

        {/* Content Area */}
        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Title */}
          <h4
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#1F2937",
              margin: "0 0 8px 0",
              lineHeight: "1.4",
              height: "42px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical"
            }}
          >
            {job.title}
          </h4>

          {/* Price */}
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#6C4DFF",
              marginBottom: "12px"
            }}
          >
            ₹{(job.price || job.budget_from || 0).toLocaleString()} <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 400 }}>/project</span>
          </div>

          {/* Duration & Views */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              color: "#6B7280",
              marginBottom: "16px"
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              ⏱ {job.deliveryDuration || "5 day delivery"}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              👁 {job.views || 0} views
            </span>
          </div>

          <div style={{ borderTop: "1px solid #F3F4F6", margin: "0 0 14px 0" }} />

          {/* Status Switch */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px"
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 500, color: "#4B5563" }}>Status</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: isJobPaused ? "#9CA3AF" : "#10B981"
                }}
              >
                {isJobPaused ? "Paused" : "Active"}
              </span>

              {/* Toggle Switch */}
              <label
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "42px",
                  height: "22px",
                  cursor: "pointer"
                }}
              >
                <input
                  type="checkbox"
                  checked={!isJobPaused}
                  onChange={() => handlePauseToggle(job)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: isJobPaused ? "#ccc" : "#6C4DFF",
                    transition: ".3s",
                    borderRadius: "34px"
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    height: "16px",
                    width: "16px",
                    left: "3px",
                    bottom: "3px",
                    backgroundColor: "white",
                    transition: ".3s",
                    borderRadius: "50%",
                    transform: isJobPaused ? "translateX(0)" : "translateX(20px)"
                  }}
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
            <button
              onClick={() => navigate(`/freelance-dashboard/freelanceredit-service/${job.id}`)}
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "6px",
                height: "36px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                background: "#fff",
                color: "#4B5563",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              <Edit2 size={13} /> Edit
            </button>
            <button
              onClick={() => handleDeleteService(job)}
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "6px",
                height: "36px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                background: "#fff",
                color: "#EF4444",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="freelance-wrapper"
        style={{
          background: "#F7F7F9",
          minHeight: "100vh",
          padding: 0,
          boxSizing: "border-box",
          width: "100%",
          display: "flex",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* TOP HEADER */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "16px 20px" : "16px 40px",
            borderBottom: "1px solid #E5E7EB",
            background: "white",
            boxSizing: "border-box",
            width: "100%"
          }}
        >
          {/* Search Bar */}
          <div style={{ position: "relative", width: "100%", maxWidth: "400px", height: "40px" }}>
            <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} size={16} />
            <input
              type="text"
              placeholder="Search freelancers, jobs, services..."
              style={{
                width: "100%",
                height: "100%",
                padding: "0 16px 0 42px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#F9FAFB",
                fontSize: "14px",
                color: "#1F2937",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Right Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Notification Bell */}
            <div
              style={{
                position: "relative",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#4B5563"
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "6px",
                  height: "6px",
                  background: "#EF4444",
                  borderRadius: "50%"
                }}
              />
            </div>

            {/* User Initials Circle */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#6C3EEB",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "14px",
                overflow: "hidden"
              }}
            >
              {profileImage ? (
                <img src={profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                initials
              )}
            </div>
          </div>
        </header>

        {/* CONTENT CONTAINER */}
        <div
          style={{
            padding: isMobile ? "20px" : "32px 40px",
            boxSizing: "border-box",
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 24
          }}
        >
          <ProfileHeader
            profile={displayUser}
            projectCount={services.length}
            onEditProfile={() => setActiveTab("Edit Profile")}
          />

          {activeTab === "Edit Profile" && (
            <div style={{ marginBottom: 24, marginTop: 16 }}>
              <h2 style={{ fontSize: 20, margin: "0 0 4px", color: "#111", fontWeight: 700 }}>Account Details</h2>
              <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Manage your personal info, security, and preferences</p>
            </div>
          )}

          {/* TWO COLUMN LAYOUT */}
          <div style={{ display: "flex", gap: 24, flexDirection: isMobile ? "column" : "row", alignItems: "flex-start", marginTop: activeTab === "Edit Profile" ? 0 : 32 }}>

            {/* LEFT MENU (SIDEBAR) - 240px width as per Figma */}
            <div
              style={{
                width: isMobile ? "100%" : 240,
                flexShrink: 0,
                background: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "16px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
              }}
            >
              {activeTab === "Edit Profile" ? (
                <>
                  <MenuItem
                    title="Personal Info"
                    icon={profilePlaceholder}
                    isActive={true}
                    onClick={() => { }}
                  />
                  <MenuItem
                    title="Privacy"
                    icon={settings}
                    isActive={activeTab === "Privacy"}
                    onClick={() => setActiveTab("Privacy")}
                  />
                </>
              ) : (
                <>
                  {[
                    ["Profile Summary", profilePlaceholder, () => setActiveTab("Profile Summary")],
                    ["Saved", MyServices, "/freelance-dashboard/sidebarsaved"],
                    ["My Services", MyServices, () => setActiveTab("My Services")],
                    ["My Works", MyJobs, "/freelance-dashboard/freelancermyworks"],
                    ["Paused Services", MyServices, () => setActiveTab("Paused Services")],
                  ].map(([t, ic, action], idx) => (
                    <MenuItem
                      key={idx}
                      title={t}
                      icon={ic}
                      isActive={t === activeTab}
                      onClick={() => typeof action === "function" ? action() : navigate(action)}
                    />
                  ))}

                  <div style={{ borderTop: "1px solid #E5E7EB", margin: "12px 4px" }} />

                  {[
                    ["Notifications", notification, "/freelance-dashboard/notifications"],
                    ["Account Settings", settings, "/freelance-dashboard/settings"],
                    ["Sign Out", Logout, handleLogout, { color: "#EF4444" }],
                  ].map(([t, ic, action, customStyle], idx) => (
                    <MenuItem
                      key={idx}
                      title={t}
                      icon={ic}
                      customStyle={customStyle}
                      isActive={t === activeTab}
                      onClick={() => typeof action === "function" ? action() : navigate(action)}
                    />
                  ))}
                </>
              )}
            </div>

            {/* RIGHT CONTENT */}
            <div style={{ flex: 1, maxWidth: 900, display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>

              {activeTab === "Edit Profile" && (
                <>
                  {/* Personal Information */}
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 32, position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                      <h3 style={{ fontSize: 16, margin: 0, color: "#111", fontWeight: 700 }}>Personal Information</h3>
                      {!isEditingPersonalInfo ? (
                        <button onClick={handleEditPersonalInfoClick} style={{ background: "none", border: "none", color: "#3B82F6", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Edit Profile</button>
                      ) : (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => setIsEditingPersonalInfo(false)} style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 16px", color: "#4B5563", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                          <button onClick={handleSavePersonalInfoClick} style={{ background: "#3B82F6", border: "none", borderRadius: 6, padding: "6px 16px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Profile</button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                      {profileImage ? (
                        <img src={profileImage} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#7C4EF5", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 600 }}>{initials}</div>
                      )}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                        <input type="file" id="profileImageInput" style={{ display: "none" }} accept="image/*" onChange={handleImageUpload} />
                        <button onClick={() => document.getElementById('profileImageInput').click()} disabled={isUploading} style={{ background: "#7C4EF5", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", opacity: isUploading ? 0.7 : 1 }}>
                          {isUploading ? "Uploading..." : "Change Photo"}
                        </button>
                        <button onClick={handleRemovePhoto} style={{ background: "#fff", color: "#4B5563", border: "1px solid #E5E7EB", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                          Remove Photo
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, marginBottom: 24 }}>
                      <div>
                        <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</p>
                        {!isEditingPersonalInfo ? (
                          <p style={{ fontSize: 14, color: "#111", margin: 0, fontWeight: 500 }}>{fullName}</p>
                        ) : (
                          <div style={{ display: "flex", gap: 8 }}>
                            <input value={editForm.firstName} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} placeholder="First Name" style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, outline: "none" }} />
                            <input value={editForm.lastName} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} placeholder="Last Name" style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, outline: "none" }} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</p>
                        <p style={{ fontSize: 14, color: "#111", margin: 0, fontWeight: 500 }}>{displayUser.email || "helen@huzzler.ai"}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone Number</p>
                        {!isEditingPersonalInfo ? (
                          <p style={{ fontSize: 14, color: "#111", margin: 0, fontWeight: 500 }}>{displayUser.phone || "+91 98765 43210"}</p>
                        ) : (
                          <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Phone Number" style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Location</p>
                        {!isEditingPersonalInfo ? (
                          <p style={{ fontSize: 14, color: "#111", margin: 0, fontWeight: 500 }}>{displayUser.location || displayUser.city || "Chennai, India"}</p>
                        ) : (
                          <input value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} placeholder="Location" style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                        )}
                      </div>
                    </div>

                    <div>
                      <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Bio</p>
                      {!isEditingPersonalInfo ? (
                        <p style={{ fontSize: 13, color: "#4B5563", margin: 0, lineHeight: 1.5 }}>
                          {displayUser.about || displayUser.bio || "Senior UI/UX Designer with 5+ years of experience creating intuitive and beautiful digital experiences. Specializing in fintech, SaaS, and mobile applications."}
                        </p>
                      ) : (
                        <textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Write a short bio..." rows={3} style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
                      )}
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 32 }}>
                    <h3 style={{ fontSize: 16, margin: "0 0 24px", color: "#111", fontWeight: 700 }}>Security Settings</h3>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #F3F4F6" }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Password</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Last changed 3 months ago</p>
                        </div>
                        <button onClick={() => setIsChangePwdModalOpen(true)} style={{ background: "none", border: "none", color: "#3B82F6", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Change Password</button>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #F3F4F6" }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Two-Factor Authentication</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Add an extra layer of security</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 13, color: tfaEnabled ? "#10B981" : "#6B7280", fontWeight: 600 }}>{tfaEnabled ? "Enabled" : "Disabled"}</span>
                          <div onClick={() => setTfaEnabled(!tfaEnabled)} style={{ width: 36, height: 20, background: tfaEnabled ? "#7C4EF5" : "#E5E7EB", borderRadius: 12, position: "relative", cursor: "pointer", transition: "background 0.2s ease" }}>
                            <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, right: tfaEnabled ? 2 : "auto", left: tfaEnabled ? "auto" : 2, border: tfaEnabled ? "none" : "1px solid #D1D5DB", transition: "all 0.2s ease" }}></div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #F3F4F6" }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Login Activity</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>3 active sessions</p>
                        </div>
                        <button style={{ background: "none", border: "none", color: "#3B82F6", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>View All</button>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16 }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Trusted Devices</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>MacBook Pro, iPhone 15</p>
                        </div>
                        <button style={{ background: "none", border: "none", color: "#3B82F6", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Manage</button>
                      </div>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 32 }}>
                    <h3 style={{ fontSize: 16, margin: "0 0 24px", color: "#111", fontWeight: 700 }}>Notification Preferences</h3>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #F3F4F6" }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Email Notifications</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>New orders, messages, and updates</p>
                        </div>
                        <div onClick={() => setEmailNotif(!emailNotif)} style={{ width: 36, height: 20, background: emailNotif ? "#7C4EF5" : "#E5E7EB", borderRadius: 12, position: "relative", cursor: "pointer", transition: "background 0.2s ease" }}>
                          <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, right: emailNotif ? 2 : "auto", left: emailNotif ? "auto" : 2, border: emailNotif ? "none" : "1px solid #D1D5DB", transition: "all 0.2s ease" }}></div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #F3F4F6" }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Push Notifications</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Real-time alerts on your device</p>
                        </div>
                        <div onClick={() => setPushNotif(!pushNotif)} style={{ width: 36, height: 20, background: pushNotif ? "#7C4EF5" : "#E5E7EB", borderRadius: 12, position: "relative", cursor: "pointer", transition: "background 0.2s ease" }}>
                          <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, right: pushNotif ? 2 : "auto", left: pushNotif ? "auto" : 2, border: pushNotif ? "none" : "1px solid #D1D5DB", transition: "all 0.2s ease" }}></div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16 }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Marketing Emails</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Tips, insights, and platform news</p>
                        </div>
                        <div onClick={() => setMarketingNotif(!marketingNotif)} style={{ width: 36, height: 20, background: marketingNotif ? "#7C4EF5" : "#E5E7EB", borderRadius: 12, position: "relative", cursor: "pointer", transition: "background 0.2s ease" }}>
                          <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, right: marketingNotif ? 2 : "auto", left: marketingNotif ? "auto" : 2, border: marketingNotif ? "none" : "1px solid #D1D5DB", transition: "all 0.2s ease" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "Privacy" && (
                <>
                  {/* Privacy Header */}
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 32, marginBottom: 24, position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <h3 style={{ fontSize: 16, margin: 0, color: "#111", fontWeight: 700 }}>Privacy Settings</h3>
                    </div>
                    <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Manage who can see your profile and control your data preferences.</p>
                  </div>

                  {/* Profile Visibility Card */}
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 32, marginBottom: 24 }}>
                    <h3 style={{ fontSize: 16, margin: "0 0 24px", color: "#111", fontWeight: 700 }}>Profile Visibility</h3>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #F3F4F6" }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Public Profile</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Allow clients to find you in search</p>
                        </div>
                        <div style={{ width: 36, height: 20, background: "#7C4EF5", borderRadius: 12, position: "relative", cursor: "pointer" }}>
                          <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, right: 2 }}></div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #F3F4F6" }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Show Online Status</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Let others see when you are active</p>
                        </div>
                        <div style={{ width: 36, height: 20, background: "#7C4EF5", borderRadius: 12, position: "relative", cursor: "pointer" }}>
                          <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, right: 2 }}></div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16 }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Search Engine Indexing</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Allow Google to index your profile</p>
                        </div>
                        <div style={{ width: 36, height: 20, background: "#E5E7EB", borderRadius: 12, position: "relative", cursor: "pointer" }}>
                          <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: 2, border: "1px solid #D1D5DB" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data & Analytics Card */}
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 32 }}>
                    <h3 style={{ fontSize: 16, margin: "0 0 24px", color: "#111", fontWeight: 700 }}>Data & Analytics</h3>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #F3F4F6" }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Usage Data</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Share anonymous usage data to help us improve</p>
                        </div>
                        <div style={{ width: 36, height: 20, background: "#7C4EF5", borderRadius: 12, position: "relative", cursor: "pointer" }}>
                          <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, right: 2 }}></div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16 }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#111", margin: "0 0 4px", fontWeight: 500 }}>Download Your Data</p>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Get a copy of everything you've shared on Huzzler</p>
                        </div>
                        <button style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 16px", color: "#4B5563", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Request Archive</button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "Profile Summary" && (
                <>
                  {/* About Me */}
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 32 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={{ fontSize: 18, margin: 0, color: "#111", fontWeight: 700 }}>About Me</h3>
                      <button
                        onClick={() => {
                          setActiveTab("Edit Profile");
                          setIsEditingPersonalInfo(true);
                        }}
                        style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 16px", color: "#6B7280", fontWeight: 500, cursor: "pointer", fontSize: 13 }}
                      >
                        Edit
                      </button>
                    </div>
                    <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.6, margin: 0 }}>
                      {displayUser.about || displayUser.bio || "Senior UI/UX Designer with 5+ years of experience creating intuitive and beautiful digital experiences. Specializing in fintech, SaaS, and mobile applications. Passionate about design systems, accessibility, and user research. Available for freelance projects globally."}
                    </p>
                  </div>

                  {/* Skills */}
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 32 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={{ fontSize: 18, margin: 0, color: "#111", fontWeight: 700 }}>Skills</h3>
                      <button
                        onClick={() => {
                          setActiveTab("Edit Profile");
                          setIsEditingPersonalInfo(true);
                        }}
                        style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 16px", color: "#6B7280", fontWeight: 500, cursor: "pointer", fontSize: 13 }}
                      >
                        Edit
                      </button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {displayUser.skills && Array.isArray(displayUser.skills) && displayUser.skills.length > 0 ? (
                        displayUser.skills.map((skill, index) => {
                          const skillColors = [
                            { bg: "#EFF6FF", color: "#3B82F6" },
                            { bg: "#ECFDF5", color: "#10B981" },
                            { bg: "#FEF2F2", color: "#EF4444" },
                            { bg: "#FEFCE8", color: "#EAB308" },
                            { bg: "#F5F3FF", color: "#8B5CF6" },
                            { bg: "#F1F5F9", color: "#64748B" }
                          ];
                          const theme = skillColors[index % skillColors.length];
                          return (
                            <span key={skill} style={{ padding: "6px 14px", background: theme.bg, color: theme.color, borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{skill}</span>
                          );
                        })
                      ) : (
                        [
                          { name: "UI Design", bg: "#EFF6FF", color: "#3B82F6" },
                          { name: "UX Research", bg: "#ECFDF5", color: "#10B981" },
                          { name: "Figma", bg: "#FEF2F2", color: "#EF4444" },
                          { name: "Prototyping", bg: "#EFF6FF", color: "#3B82F6" },
                          { name: "Design Systems", bg: "#FEFCE8", color: "#EAB308" },
                          { name: "Accessibility", bg: "#ECFDF5", color: "#10B981" },
                          { name: "Wireframing", bg: "#F5F3FF", color: "#8B5CF6" },
                          { name: "Adobe XD", bg: "#F1F5F9", color: "#64748B" },
                          { name: "User Testing", bg: "#ECFDF5", color: "#10B981" },
                          { name: "Interaction Design", bg: "#FEF2F2", color: "#EF4444" }
                        ].map(skill => (
                          <span key={skill.name} style={{ padding: "6px 14px", background: skill.bg, color: skill.color, borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{skill.name}</span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 32 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                      <h3 style={{ fontSize: 18, margin: 0, color: "#111", fontWeight: 700 }}>Portfolio</h3>
                      <button
                        onClick={() => setIsPortfolioPopupOpen(true)}
                        style={{ background: "#8B5CF6", border: "none", borderRadius: 6, padding: "8px 16px", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
                      >
                        + Add Work
                      </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
                      {portfolio.length > 0 ? (
                        portfolio.map((p, index) => {
                          const cardColors = ["#E0E7FF", "#FEF08A", "#D1FAE5", "#FBCFE8", "#BAE6FD", "#EDE9FE"];
                          const bg = cardColors[index % cardColors.length];
                          return (
                            <div
                              key={p.id}
                              onClick={() => p.projectUrl && window.open(p.projectUrl, "_blank")}
                              style={{
                                height: 160,
                                background: bg,
                                borderRadius: 8,
                                padding: "16px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                border: "1px solid rgba(0,0,0,0.05)",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
                              }}
                            >
                              <div>
                                <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 700, color: "#111827" }}>{p.title}</h4>
                                <p style={{ margin: 0, fontSize: "11px", color: "#4B5563", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.4" }}>{p.description}</p>
                              </div>
                              <span style={{ fontSize: "11px", color: "#6B7280", fontWeight: 500 }}>🔗 View Project</span>
                            </div>
                          );
                        })
                      ) : (
                        <>
                          <div style={{ height: 160, background: "#E0E7FF", borderRadius: 8 }}></div>
                          <div style={{ height: 160, background: "#FEF08A", borderRadius: 8 }}></div>
                          <div style={{ height: 160, background: "#D1FAE5", borderRadius: 8 }}></div>
                          <div style={{ height: 160, background: "#FBCFE8", borderRadius: 8 }}></div>
                          <div style={{ height: 160, background: "#BAE6FD", borderRadius: 8 }}></div>
                        </>
                      )}
                      <div
                        onClick={() => setIsPortfolioPopupOpen(true)}
                        style={{ height: 160, background: "#EDE9FE", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA", fontSize: 14, fontWeight: 500, border: "1px dashed #C4B5FD", cursor: "pointer" }}
                      >
                        + Add
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: 16, margin: "0 0 4px", color: "#111", fontWeight: 700 }}>Availability</h3>
                      <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Visible to clients when browsing</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 13, color: displayUser.isAvailable !== false ? "#10B981" : "#EF4444", fontWeight: 600 }}>
                        {displayUser.isAvailable !== false ? "Available for projects" : "Not Available"}
                      </span>
                      <div
                        onClick={handleAvailabilityToggle}
                        style={{
                          width: 44,
                          height: 24,
                          background: displayUser.isAvailable !== false ? "#8B5CF6" : "#ccc",
                          borderRadius: 20,
                          position: "relative",
                          cursor: "pointer",
                          transition: "background-color 0.3s"
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            background: "#fff",
                            borderRadius: "50%",
                            position: "absolute",
                            top: 2,
                            right: displayUser.isAvailable !== false ? 2 : "auto",
                            left: displayUser.isAvailable !== false ? "auto" : 2,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                            transition: "all 0.3s"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* MY SERVICES TAB */}
              {activeTab === "My Services" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
                  {/* Header Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 20, margin: 0, color: "#111", fontWeight: 700 }}>My Services</h3>
                      <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0 0" }}>Manage and track all your active service listings</p>
                    </div>
                    <button
                      onClick={() => navigate("/freelance-dashboard/createservice")}
                      style={{
                        background: "#6C4DFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Plus size={15} /> Create New Service
                    </button>
                  </div>

                  {/* Summary Cards */}
                  <div style={{ display: "flex", gap: 16, flexDirection: isMobile ? "column" : "row", width: "100%" }}>
                    {/* Active Services */}
                    <div style={{ flex: 1, background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "12px", background: "rgba(108, 77, 255, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6C4DFF" }}>
                        <Layers size={22} style={{ alignSelf: "center" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 700, letterSpacing: "0.5px" }}>ACTIVE SERVICES</div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "2px 0" }}>{activeServices.length}</div>
                        <div style={{ fontSize: "12px", color: "#6B7280" }}>{pausedServices.length} paused</div>
                      </div>
                    </div>

                    {/* Total Views */}
                    <div style={{ flex: 1, background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6" }}>
                        <Eye size={22} style={{ alignSelf: "center" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 700, letterSpacing: "0.5px" }}>TOTAL VIEWS</div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "2px 0" }}>
                          {services.reduce((acc, s) => acc + (s.views || 0), 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: "12px", color: "#10B981", fontWeight: 500 }}>+18% this week</div>
                      </div>
                    </div>

                    {/* Pending Requests */}
                    <div style={{ flex: 1, background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "12px", background: "rgba(249, 115, 22, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F97316" }}>
                        <CheckCircle size={22} style={{ alignSelf: "center" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 700, letterSpacing: "0.5px" }}>PENDING REQUESTS</div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "2px 0" }}>{pendingCount}</div>
                        <div style={{ fontSize: "12px", color: "#6B7280" }}>Awaiting review</div>
                      </div>
                    </div>
                  </div>

                  {/* Filters Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#fff",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      overflow: "hidden",
                      width: "100%",
                      maxWidth: "480px",
                      height: "42px",
                      boxSizing: "border-box"
                    }}
                  >
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{
                        flex: 1,
                        height: "100%",
                        border: "none",
                        borderRight: "1px solid #E2E8F0",
                        background: "transparent",
                        padding: "0 16px",
                        fontSize: "14px",
                        color: "#64748B",
                        fontWeight: 500,
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                    </select>

                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      style={{
                        flex: 1,
                        height: "100%",
                        border: "none",
                        borderRight: "1px solid #E2E8F0",
                        background: "transparent",
                        padding: "0 16px",
                        fontSize: "14px",
                        color: "#64748B",
                        fontWeight: 500,
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      <option value="All">All Categories</option>
                      {uniqueCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    <select
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      style={{
                        flex: 1,
                        height: "100%",
                        border: "none",
                        background: "transparent",
                        padding: "0 16px",
                        fontSize: "14px",
                        color: "#64748B",
                        fontWeight: 500,
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      <option value="All">Price Range</option>
                      <option value="0-5000">Under ₹5,000</option>
                      <option value="5000-10000">₹5,000 - ₹10,000</option>
                      <option value="10000+">Over ₹10,000</option>
                    </select>
                  </div>

                  {/* Grid */}
                  {loadingServices ? (
                    <div style={{ padding: "40px 0", textAlign: "center", color: "#6B7280" }}>Loading services...</div>
                  ) : filteredServices.length === 0 ? (
                    <div style={{ padding: "40px 0", textAlign: "center", color: "#6B7280", background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                      No services found matching the criteria.
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "24px"
                      }}
                    >
                      {filteredServices.map((job, idx) => renderServiceCard(job, idx))}
                    </div>
                  )}
                </div>
              )}

              {/* PAUSED SERVICES TAB */}
              {activeTab === "Paused Services" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
                  {/* Header Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 20, margin: 0, color: "#111", fontWeight: 700 }}>Paused Services</h3>
                      <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0 0" }}>Manage and track all your active service listings</p>
                    </div>
                    <button
                      onClick={() => navigate("/freelance-dashboard/createservice")}
                      style={{
                        background: "#7C4EF5",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 18px",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Plus size={15} /> Create New Service
                    </button>
                  </div>

                  {/* Grid of only paused services */}
                  {loadingServices ? (
                    <div style={{ padding: "40px 0", textAlign: "center", color: "#6B7280" }}>Loading services...</div>
                  ) : pausedServices.length === 0 ? (
                    <div style={{ padding: "40px 0", textAlign: "center", color: "#6B7280", background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                      No paused services found.
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "24px"
                      }}
                    >
                      {pausedServices.map((job, idx) => renderServiceCard(job, idx))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <AddPortfolioPopup
        open={isPortfolioPopupOpen}
        onClose={() => setIsPortfolioPopupOpen(false)}
      />

      {/* Change Password Modal */}
      {isChangePwdModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999 }}>
          <div style={{ background: "#fff", borderRadius: 19, border: "2px solid #9A9A9A", width: "100%", maxWidth: 480, padding: "32px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#000", margin: "0 0 4px", textAlign: "center" }}>Change password</h2>
            <p style={{ fontSize: 14, color: "#333", margin: "0 0 12px", textAlign: "center", lineHeight: 1.4 }}>
              Your password must be at least 6 character and<br />should include a combination of numbers, letter<br />and special characters(!$@%).
            </p>

            {passwordError && <div style={{ padding: "8px", background: "#FEE2E2", color: "#EF4444", borderRadius: 8, fontSize: 13, textAlign: "center", fontWeight: 500 }}>{passwordError}</div>}
            {passwordSuccess && <div style={{ padding: "8px", background: "#D1FAE5", color: "#10B981", borderRadius: 8, fontSize: 13, textAlign: "center", fontWeight: 500 }}>{passwordSuccess}</div>}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input type="password" value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} placeholder="Current password" style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #9A9A9A", outline: "none", fontSize: 14, boxSizing: "border-box", color: "#333" }} />
              <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="New password" style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #9A9A9A", outline: "none", fontSize: 14, boxSizing: "border-box", color: "#333" }} />
              <input type="password" value={passwordForm.retype} onChange={e => setPasswordForm({ ...passwordForm, retype: e.target.value })} placeholder="Retype new password" style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #9A9A9A", outline: "none", fontSize: 14, boxSizing: "border-box", color: "#333" }} />
            </div>

            <p style={{ margin: "4px 0 0" }}>
              <a href="#" style={{ color: "#8B5CF6", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>Forgotten your password?</a>
            </p>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 4, marginBottom: 16 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: "1px solid #8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: 2, flexShrink: 0 }} onClick={() => setPasswordForm({ ...passwordForm, logoutOtherDevices: !passwordForm.logoutOtherDevices })}>
                {passwordForm.logoutOtherDevices && <div style={{ width: 10, height: 10, background: "#8B5CF6", borderRadius: 2 }}></div>}
              </div>
              <p style={{ fontSize: 13, color: "#000", margin: 0, lineHeight: 1.4 }}>
                Log out of other device. choose this if someone else used your<br />account.
              </p>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setIsChangePwdModalOpen(false)} style={{ flex: 1, padding: "12px 0", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, color: "#666", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleChangePassword} disabled={isChangingPassword} style={{ flex: 1, padding: "12px 0", background: "#8B5CF6", border: "none", borderRadius: 8, color: "#fff", fontSize: 15, fontWeight: 600, cursor: isChangingPassword ? "not-allowed" : "pointer", opacity: isChangingPassword ? 0.7 : 1 }}>
                {isChangingPassword ? "Updating..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* MENU ITEM */
function MenuItem({ title, icon, onClick, customStyle, isActive }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        cursor: "pointer",
        borderRadius: 8,
        background: isActive ? "#EDE9FE" : "transparent",
        color: isActive ? "rgba(108, 77, 255, 1)" : (customStyle?.color || "#4B5563"),
        fontWeight: isActive ? 600 : 500,
        transition: "all 0.2s",
        fontSize: 14,
        ...(customStyle || {}),
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) { e.currentTarget.style.background = "rgba(108, 77, 255, 0.05)"; }
      }}
      onMouseLeave={(e) => {
        if (!isActive) { e.currentTarget.style.background = "transparent"; }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {icon && <img src={icon} width={18} alt="" style={{ opacity: isActive ? 1 : 0.6, filter: isActive ? "invert(35%) sepia(87%) saturate(2462%) hue-rotate(242deg) brightness(98%) contrast(93%)" : "none" }} />}
        <span>{title}</span>
      </div>
      {isActive && <span style={{ color: "rgba(108, 77, 255, 1)", fontWeight: "bold" }}>›</span>}
    </div>
  );
}

/* STYLES */
const pageStyles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    display: "flex",
    justifyContent: "center",
    fontFamily: "'Rubik', system-ui",
  },
  centerWrap: {
    width: "100%",
    maxWidth: 800,
  },
  titleWrap: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    background: "#fff",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #BDBDBD",
    cursor: "pointer",
  },
  title: { fontSize: 36, margin: 0, fontWeight: 400 },
  subtitle: { fontSize: 13, color: "#6b7280" },

  profileCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 18,
    border: "1px solid #BDBDBD",
    marginBottom: 20,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: "50%",
    objectFit: "cover",
  },
  editBtn: {
    position: "absolute",
    right: -6,
    bottom: -18,
    cursor: "pointer",
  },
  uploadOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    borderRadius: "50%",
  },

  section: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    border: "1px solid #BDBDBD",
  },
  sectionTitle: { fontSize: 20, fontWeight: 400 },

  menuItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 6px",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 400,
  },
  menuLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
};

const deleteStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: 16,
  },

  modal: {
    background: "#fff",
    borderRadius: 22,
    padding: "32px 26px",
    width: "100%",
    maxWidth: 560,
    textAlign: "left",
    boxShadow: "0 20px 45px rgba(0,0,0,0.15)",
  },

  warnIcon: {
    width: 48,
    height: 48,
    margin: "0 auto 12px",
  },

  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 8,
    color: "#d10000",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: 12,
  },

  desc: {
    fontSize: 14,
    color: "#444",
    lineHeight: 1.6,
    marginBottom: 26,
  },

  box: {
    border: "1px solid #facc15",
    borderRadius: 14,
    padding: 18,
    textAlign: "left",
  },

  boxTitle: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 14,
    color: "#6b7280",
    letterSpacing: 0.6,
  },

  radioRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    fontSize: 14,
    marginBottom: 14,
    cursor: "pointer",
    width: "100%",
  },

  radio: {
    width: 16,
    height: 16,
    marginTop: 2,
    flexShrink: 0,
  },

  radioText: {
    lineHeight: "20px",
    textAlign: "left",
  },

  textarea: {
    width: "100%",
    height: 110,
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    border: "none",
    resize: "none",
    fontSize: 14,
    outline: "none",
    background: "#f3f4f6",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: 18,
    marginTop: 28,
  },

  cancel: {
    padding: "11px 30px",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },

  confirm: {
    padding: "11px 34px",
    borderRadius: 999,
    border: "none",
    background: "#6d28d9",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
};