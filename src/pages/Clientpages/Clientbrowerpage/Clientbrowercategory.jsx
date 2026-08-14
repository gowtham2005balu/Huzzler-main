// import React, { useEffect, useMemo, useState } from "react";

// import {
//   getFirestore,
//   collection,
//   doc,
//   onSnapshot,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   getDoc,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FiBell, FiEye, FiMessageCircle, FiSettings } from "react-icons/fi";
// import { Bookmark, Clock, SaveIcon, Search, TimerIcon, User } from "lucide-react";
// import "./clientbrower.css"
// import backarrow from "../../../assets/backarrow.png";
// import { MdSavedSearch } from "react-icons/md";
// import { BsBookmarkFill } from "react-icons/bs";
// import Searchjob from "../../../assets/Searchjob.png"
// import { color } from "framer-motion";
// import categoryImg from "../../../assets/categories.png";
// import message from "../../../assets/message.png";
// import notification from "../../../assets/notification.png";
// /* ======================================================
//    FIREBASE
// ====================================================== */
// const db = getFirestore();
// const auth = getAuth();
// const PAGE_PADDING = "16px";

// /* ======================================================
//    CATEGORY DATA
// ====================================================== */

// const jobCategories1 = {
//   'Graphics & Design': [
//     'Logo Design',
//     'Brand Style Guides',
//     'Business Cards & Stationery',
//     'Illustration',
//     'Pattern Design',
//     'Website Design',
//     'App Design',
//     'UX Design',
//     'Game Art',
//     'NFTs & Collectibles',
//     'Industrial & Product Design',
//     'Architecture & Interior Design',
//     'Landscape Design',
//     'Fashion Design',
//     'Jewelry Design',
//     'Presentation Design',
//     'Infographic Design',
//     'Vector Tracing',
//     'Car Wraps',
//     'Image Editing',
//     'Photoshop Editing',
//     'T-Shirts & Merchandise',
//     'Packaging Design',
//     'Book Design',
//     'Album Cover Design',
//     'Podcast Cover Art',
//     'Menu Design',
//     'Invitation Design',
//     'Brochure Design',
//     'Poster Design',
//     'Signage Design',
//     'Flyer Design',
//     'Social Media Design',
//     'Print Design',
//   ],

//   'Programming & Tech': [
//     'Website Development',
//     'Website Builders & CMS',
//     'Web Programming',
//     'E-Commerce Development',
//     'Game Development',
//     'Mobile Apps (iOS & Android)',
//     'Desktop Applications',
//     'Chatbots',
//     'QA & Review',
//     'User Testing',
//     'Support & IT',
//     'Data Analysis & Reports',
//     'Convert Files',
//     'Databases',
//     'Cybersecurity ',
//     ' Data Protection',
//     'Cloud Computing',
//     'DevOps',
//     'AI Development',
//     'Machine Learning',
//     'Blockchain & NFTs',
//     'Scripts & Automation',
//     'Software Customization',
//   ],

//   'Digital Marketing': [
//     'Social Media Marketing',
//     'SEO',
//     'Content Marketing',
//     'Video Marketing',
//     'Email Marketing',
//     'SEM (Search Engine Marketing)',
//     'Influencer Marketing',
//     'Local SEO',
//     'Affiliate Marketing',
//     'Mobile Marketing & Advertising',
//     'Display Advertising',
//     'E-Commerce Marketing',
//     'Text Message Marketing',
//     'Crowdfunding',
//     'Marketing Strategy',
//     'Web Analytics',
//     'Domain Research',
//     'Music Promotion',
//     'Book & eBook Marketing',
//     'Podcast Marketing',
//     'Community Management',
//     'Marketing Consulting',
//   ],

//   'Writing & Translation': [
//     'Articles & Blog Posts',
//     'Proofreading & Editing',
//     'Translation',
//     'Website Content',
//     'Technical Writing',
//     'Copywriting',
//     'Brand Voice & Tone',
//     'Resume Writing',
//     'Cover Letters',
//     'LinkedIn Profiles',
//     'Press Releases',
//     'Product Descriptions',
//     'Case Studies',
//     'White Papers',
//     'Scriptwriting',
//     'Speechwriting',
//     'Creative Writing',
//     'Book Editing',
//     'Beta Reading',
//     'Grant Writing',
//     'UX Writing',
//     'Email Copy',
//     'Business Names & Slogans',
//     'Transcription',
//     'Legal Writing',
//   ],

//   'Video & Animation': [
//     'Whiteboard & Animated Explainers',
//     'Video Editing',
//     'Short Video Ads',
//     'Logo Animation',
//     'Character Animation',
//     '2D/3D Animation',
//     'Intros & Outros',
//     'Lyric & Music Videos',
//     'Visual Effects',
//     'Spokesperson Videos',
//     'App & Website Previews',
//     'Product Photography & Demos',
//     'Subtitles & Captions',
//     'Live Action Explainers',
//     'Unboxing Videos',
//     'Slideshow Videos',
//     'Animation for Kids',
//     'Trailers & Teasers',
//   ],

//   'Music & Audio': [
//     'Voice Over',
//     'Mixing & Mastering',
//     'Producers & Composers',
//     'Singers & Vocalists',
//     'Session Musicians',
//     'Songwriters',
//     'Audiobook Production',
//     'Sound Design',
//     'Audio Editing',
//     'Jingles & Intros',
//     'Podcast Editing',
//     'Music Transcription',
//     'Dialogue Editing',
//     'DJ Drops & Tags',
//     'Music Promotion',
//   ],

//   'AI Services': [
//     'AI Artists',
//     'AI Applications',
//     'AI Video Generators',
//     'AI Music Generation',
//     'AI Chatbot Development',
//     'AI Website Builders',
//     'Custom GPT & LLMs',
//     'AI Training Data Preparation',
//     'Text-to-Speech / Voice Cloning',
//     'Prompt Engineering',
//   ],

//   'Data': [
//     'Data Entry',
//     'Data Mining & Scraping',
//     'Data Analytics & Reports',
//     'Database Design',
//     'Data Visualization',
//     'Dashboards',
//     'Excel / Google Sheets',
//     'Statistical Analysis',
//     'Data Engineering',
//     'Machine Learning Models',
//     'Data Cleaning',
//   ],

//   'Business': [
//     'Business Plans',
//     'Market Research',
//     'Branding Services',
//     'Legal Consulting',
//     'Financial Consulting',
//     'Career Counseling',
//     'Project Management',
//     'Supply Chain Management',
//     'HR Consulting',
//     'E-Commerce Management',
//     'Business Consulting',
//     'Presentations',
//     'Virtual Assistant',
//   ],

//   'Finance': [
//     'Accounting & Bookkeeping',
//     'Financial Forecasting',
//     'Financial Modeling',
//     'Tax Consulting',
//     'Crypto & NFT Consulting',
//     'Business Valuation',
//     'Pitch Decks',
//   ],

//   'Photography': [
//     'Product Photography',
//     'Real Estate Photography',
//     'Portraits',
//     'Image Retouching',
//     'Food Photography',
//     'Drone Photography',
//     'Lifestyle Photography',
//     'AI Image Enhancement',
//   ],

//   'Lifestyle': [
//     'Gaming',
//     'Astrology & Psychics',
//     'Online Tutoring',
//     'Arts & Crafts',
//     'Fitness Lessons',
//     'Nutrition',
//     'Relationship Advice',
//     'Personal Styling',
//     'Cooking Lessons',
//     'Life Coaching',
//     'Travel Advice',
//     'Wellness & Meditation',
//     'Language Lessons',
//   ],

//   'Consulting': [
//     'Management Consulting',
//     'Business Strategy',
//     'HR & Leadership',
//     'Financial Advisory',
//     'Legal Consulting',
//     'Technology Consulting',
//     'Cybersecurity Consulting',
//     'Marketing Strategy',
//   ],

//   'Personal Growth & Hobbies': [
//     'Life Coaching',
//     'Productivity Coaching',
//     'Study Skills',
//     'Language Learning',
//     'Public Speaking',
//     'Career Mentoring',
//     'Mindfulness & Meditation',
//     'Confidence Coaching',
//   ],
// };

// /* ======================================================
//    HELPERS
// ====================================================== */
// const timeAgo = (date) => {
//   const diff = Date.now() - date.getTime();
//   const sec = Math.floor(diff / 1000);
//   if (sec < 60) return `${sec}s ago`;
//   const min = Math.floor(sec / 60);
//   if (min < 60) return `${min} min ago`;
//   const hr = Math.floor(min / 60);
//   if (hr < 24) return `${hr}h ago`;
//   const day = Math.floor(hr / 24);
//   return `${day}d ago`;
// };

// const skillColor = (text) => {
//   const colors = ["#E3F2FD", "#FFF9C4", "#E1F5FE", "#F3E5F5"];
//   return colors[text.length % colors.length];
// };

// /* ======================================================
//    MAIN CLIENT COMPONENT
// ====================================================== */
// export default function Client() {
//   const location = useLocation();
//   const [screen, setScreen] = useState("CATEGORIES"); // CATEGORIES | SUB
//   const [category, setCategory] = useState(null);
//   const [skill, setSkill] = useState(null);
//   const navigate = useNavigate();
//   const [catSearch, setCatSearch] = useState("");
//   const [subSearch, setSubSearch] = useState("");
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );
//   const [userProfile, setUserProfile] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   const [userInfo, setUserInfo] = useState({
//     first_name: "",
//     last_name: "",
//     role: "",
//     profileImage: "",
//   });
//   const fetchUserProfile = async (uid) => {
//     try {
//       const snap = await getDoc(doc(db, "users", uid));
//       if (snap.exists()) {
//         setUserProfile(snap.data());
//       } else {
//         console.log("User profile not found");
//       }
//     } catch (e) {
//       console.error("Profile fetch error:", e);
//     }
//   };

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;
//     fetchUserProfile(user.uid);
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) return;
//       try {
//         const userRef = doc(db, "users", currentUser.uid);
//         const snap = await getDoc(userRef);
//         if (snap.exists()) {
//           const data = snap.data();
//           setUserInfo({
//             first_name: data.first_name || "",
//             last_name: data.last_name || "",
//             role: data.role || "",
//             profileImage: data.profileImage || "",
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     });
//     return unsubscribe;
//   }, []);
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   /* ---------- DEFAULT AUTO SELECT ---------- */
//   useEffect(() => {
//     if (screen === "SUB" && category) {
//       const list = jobCategories1[category] || [];
//       if (list.length && !skill) setSkill(list[0]);
//     }
//   }, [screen, category]);

//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () =>
//       window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   /* ---------- FILTERS ---------- */
//   const categories = useMemo(() => {
//     if (!catSearch) return Object.keys(jobCategories1);
//     return Object.keys(jobCategories1).filter((c) =>
//       c.toLowerCase().includes(catSearch.toLowerCase())
//     );
//   }, [catSearch]);

//   const subCategories = useMemo(() => {
//     if (!category) return [];
//     const list = jobCategories1[category];
//     if (!subSearch) return list;
//     return list.filter((s) =>
//       s.toLowerCase().includes(subSearch.toLowerCase())
//     );
//   }, [subSearch, category]);

//   useEffect(() => {
//     if (location.state?.category) {
//       setCategory(location.state.category);
//       setScreen("SUB");
//     }
//   }, [location.state]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "auto" });
//   }, [location.pathname]);

//   /* ======================================================
//      UI
//   ====================================================== */
//   return (
//     <div
//       id="fh-e"
//       style={{
//         marginLeft: collapsed ? "-0px" : "-0px",
//         transition: "margin-left 0.25s ease",
//         width: "100%",
//         minHeight: "100vh",
//         boxSizing: "border-box",
//         marginTop: isMobile ? "-20px" : "-70px",
//       }}
//     >

//       <div
//         style={{
//           width: "100%",
//           maxWidth: "1400px",   // 🔑 desktop & laptop perfect
//           margin: "0 auto",     // 🔑 center align
//           paddingLeft: "16px",
//           paddingRight: "16px",
//           boxSizing: "border-box",
//         }}
//       >

//         <div style={styles.page}>
//           {/* HEADER */}
//           {/* HEADER */}
//           <div style={styles.appBarr}>

//             <div style={{ marginLeft: isMobile ? "-10px" : "-5px", }}>
//               <h3 style={styles.title1}>
//                 {screen === "CATEGORIES" ? "Welcome," : category}
//                 <div style={{ fontSize: 20 }}>{userInfo.first_name || "Huzzlers"}</div>
//               </h3>

//             </div>


//             {/* TOP RIGHT ICONS */}
//             <div
//               style={{
//                 ...styles.headerIcons,
//                 position: isMobile ? "absolute" : "static",
//                 top: isMobile ? "-5px" : "auto",
//                 right: isMobile ? "-44px" : "auto",
//               }}
//             >


//               <img src={message} onClick={() => navigate("/client-dashbroad2/messages")} alt="message" style={{ width: "23px", cursor: "pointer" }} />
//               <img src={notification} alt="Notification" style={{ width: "23px", cursor: "pointer" }} />

//             </div>
//           </div>

//           <div style={{ marginTop: "1px" }}>

//             <div style={{ fontSize: "16px", fontWeight: "400", color: "#0A0A0A", marginTop: "22px", padding: "0 10px" }}>Discover projects that match your skills</div>
//           </div>
//           {/* SEARCH */}
//           <div style={styles.searchWrap}>
//             <div style={styles.searchBar}>
//               <Search size={16} style={styles.searchIcon} />

//               <input
//                 placeholder="Search"
//                 value={screen === "CATEGORIES" ? catSearch : subSearch}
//                 onChange={(e) =>
//                   screen === "CATEGORIES"
//                     ? setCatSearch(e.target.value)
//                     : setSubSearch(e.target.value)
//                 }
//                 style={styles.searchInput}
//               />
//             </div>
//           </div>
//           {screen === "CATEGORIES" && (
//             <div style={{ marginTop: "10px" }}>
//               {/* TOP ROW : Arrow + Title */}
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 12,
//                 }}
//               >
//                 {/* BACK ARROW */}
//                 <div
//                   onClick={() => navigate(-1)}
//                   style={{
//                     width: 36,
//                     height: 36,
//                     borderRadius: 14,
//                     border: "0.8px solid #E0E0E0",
//                     backgroundColor: "#FFFFFF",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     cursor: "pointer",
//                     boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
//                     flexShrink: 0,
//                   }}
//                 >
//                   <img src={backarrow} alt="back" style={{ width: 16, height: 16 }} />
//                 </div>

//                 {/* TITLE */}
//                 <h1 style={styles.title}>Browse Project</h1>
//               </div>

//               {/* TEXT BELOW ARROW */}
//               <div
//                 style={{
//                   marginLeft: isMobile ? "0px" : "48px",
//                   marginTop: "12px",
//                 }}
//               >
//                 <p
//                   style={{
//                     fontWeight: "400",
//                     marginBottom: "8px",
//                     marginLeft: isMobile ? "0px" : "-38px",
//                   }}
//                 >
//                   What Are You Looking For?
//                 </p>

//                 <p
//                   style={{
//                     color: "#0A0A0A",
//                     fontSize: "16px",
//                     fontWeight: "400",
//                     marginLeft: isMobile ? "0px" : "-38px",
//                   }}
//                 >
//                   Choose your a category
//                 </p>
//               </div>
//             </div>

//           )}




//           {/* CONTENT */}
//           {screen === "CATEGORIES" && (
//             <div
//               className="category-grid"
//               style={{
//                 display: "grid",
//                 gap: 24,
//                 padding: "26px 8px",
//                 gridTemplateColumns: isMobile
//                   ? "repeat(1, 1fr)"   // 2 cards per row on mobile
//                   : "repeat(auto-fill, minmax(230px, 1fr))", // desktop
//               }}
//             >
//               {categories
//                 .filter((c) =>
//                   c.toLowerCase().includes(catSearch.toLowerCase())
//                 )
//                 .map((category) => (
//                   <div
//                     key={category}
//                     style={styles.categoryCard}
//                     onClick={() => {
//                       setCategory(category);
//                       setSkill(null);
//                       setScreen("SUB");
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.transform = "translateY(-2px)";
//                       e.currentTarget.style.boxShadow =
//                         "0 12px 28px rgba(0,0,0,0.12)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.transform = "translateY(0)";
//                       e.currentTarget.style.boxShadow =
//                         "0 8px 20px rgba(0,0,0,0.08)";
//                     }}
//                   >
//                     <div style={styles.categoryCardTop}>
//                       <img
//                         src={categoryImg}
//                         alt={category}
//                         style={styles.categoryImage}
//                       />
//                     </div>

//                     <div style={styles.categoryCardBottom}>
//                       {category}
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           )}
//           {screen === "SUB" && (
//             <>
//               {/* SUB SKILLS */}
//               <div style={{ ...styles.skillsRow }} className="skillsRow">

//                 {subCategories.map((s) => (
//                   <div
//                     key={s}
//                     onClick={() => setSkill(s)}
//                     style={{
//                       ...styles.skillChip,
//                       background: skill === s ? "rgba(124, 60, 255, 1)" : "#eee",
//                       color: skill === s ? "#fff" : "#000",
//                     }}
//                   >
//                     {s}
//                   </div>
//                 ))}
//               </div>

//               {/* JOBS */}
//               {skill && <JobsScreen skill={skill} />}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ======================================================
//    JOBS SCREEN
// ====================================================== */
// function JobsScreen({ skill }) {
//   const [tab, setTab] = useState("WORKS");
//   const [jobs, setJobs] = useState([]);
//   const [jobs24, setJobs24] = useState([]);
//   const [saved, setSaved] = useState([]);


//   const uid = auth.currentUser?.uid;

//   useEffect(() => {
//     const u1 = onSnapshot(collection(db, "services"), (snap) =>
//       setJobs(processJobs(snap.docs))
//     );
//     const u2 = onSnapshot(collection(db, "service_24h"), (snap) =>
//       setJobs24(processJobs(snap.docs, "24H"))
//     );


//     if (!uid) return;
//     const u3 = onSnapshot(doc(db, "users", uid), (snap) =>
//       setSaved(snap.data()?.favoriteJobs || [])
//     );

//     return () => {
//       u1();
//       u2();
//       u3 && u3();
//     };
//   }, [uid]);

//   const filter = (list) =>
//     list.filter((j) =>
//       [...j.skills, ...j.tools].some((x) =>
//         x.toLowerCase().includes(skill.toLowerCase())
//       )
//     );

//   const renderList =
//     tab === "WORKS"
//       ? filter(jobs)
//       : tab === "24H"
//         ? filter(jobs24)
//         : [...jobs, ...jobs24].filter((j) => saved.includes(j.id));

//   return (
//     <>

//       <div style={styles.tabWrap}>
//         {["Work", "24 Hours", "Saved"].map((t) => (
//           <div
//             className="pill"
//             key={t}
//             onClick={() => setTab(t === "Work" ? "WORKS" : t === "24 Hours" ? "24H" : "SAVED")}
//             style={{
//               ...styles.tabPill,
//               background: tab === (t === "Work" ? "WORKS" : t === "24 Hours" ? "24H" : "SAVED")
//                 ? "#efeaeaff"
//                 : "transparent",
//             }}
//           >
//             {t}
//           </div>
//         ))}
//       </div>




//       {/* TABS */}

//       {/* LIST */}
//       <div>
//         {renderList.length === 0 ? (
//           <Empty />
//         ) : (
//           renderList.map((job) => (
//             <JobCard
//               key={job.id}
//               job={job}
//               saved={saved.includes(job.id)}
//             />
//           ))
//         )}
//       </div>
//     </>
//   );
// }

// /* ======================================================
//    JOB CARD
// ====================================================== */
// function JobCard({ job, saved }) {
//   const uid = auth.currentUser?.uid;
//   const navigate = useNavigate();   // ✅ ADD THIS

//   const toggleSave = async (e) => {
//     e.stopPropagation(); // ✅ card click block panna
//     if (!uid) return;

//     await updateDoc(doc(db, "users", uid), {
//       favoriteJobs: saved ? arrayRemove(job.id) : arrayUnion(job.id),
//     });
//   };

//   const is24h = job.timeline === "24H" || job.is24h === true; // optional

//   return (
//     <div
//       style={styles.jobCard}
//       onClick={() => {
//         // ✅ navigate based on collection type
//         if (job.type === "24H") {
//           navigate(`/client-dashbroad2/service-24h/${job.id}`);
//         } else {
//           navigate(`/client-dashbroad2/service/${job.id}`);
//         }
//       }}
//     >
//       <div style={styles.cardTop}>
//         <div>
//           <p style={styles.role}>{job.title}</p>
//         </div>

//         <div style={styles.priceWrap}>
//           <div style={styles.price}>₹ {job.budget_from || 0}</div>

//           <span onClick={toggleSave} style={styles.bookmark}>
//             {saved ? <BsBookmarkFill size={16} /> : <Bookmark size={18} />}
//           </span>
//         </div>
//       </div>

//       <p style={{ opacity: "70%", fontSize: "14px", fontWeight: "400" }}>
//         Skills Required
//       </p>

//       <div style={styles.tagRow}>
//         {job.skills.slice(0, 4).map((s) => (
//           <span key={s} style={styles.tag}>
//             {s}
//           </span>
//         ))}
//       </div>

//       <p style={styles.desc}>{job.description}</p>

//       <div style={styles.cardFooter}>
//         <FiEye size={15} /> <span>{job.views} Impression</span>
//         <Clock size={15} /> <span>{timeAgo(job.created_at)}</span>
//       </div>
//     </div>
//   );
// }

// /* ======================================================
//    DATA NORMALIZER
// ====================================================== */
// function processJobs(docs, type = "WORK") {
//   return docs
//     .map((d) => {
//       const data = d.data();
//       if (!data.title || !data.description) return null;

//       return {
//         id: d.id,
//         title: data.title,
//         description: data.description,
//         skills: data.skills || [],
//         tools: data.tools || [],
//         views: data.views || 0,
//         created_at: data.created_at?.toDate?.() || new Date(),
//         type: type, // ✅ ADD THIS
//       };
//     })
//     .filter(Boolean);
// }


// /* ======================================================
//    SMALL UI
// ====================================================== */
// const Row = ({ text, onClick }) => (
//   <div style={styles.row} onClick={onClick}>
//     <span>{text}</span>
//     <span>›</span>
//   </div>
// );

// const Empty = () => (
//   <div style={styles.empty}>
//     <div style={{ fontSize: 48 }}><img src={Searchjob} height={"200px"} /></div>
//     <p>No jobs found</p>
//   </div>
// );

// /* ======================================================
//    STYLES
// ====================================================== */
// const styles = {
//   page: {
//     fontFamily: "system-ui",
//     background: "#fff",
//     padding: "10%",
//     minHeight: "100dvh",
//     width: "100%",
//     maxWidth: "1400px",     // 🔥 laptop + desktop
//     margin: "0 auto",      // 🔥 center
//     overflowY: "auto",
//     boxSizing: "border-box",
//   },

//   appBarr: {
//     height: 56,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     position: "relative",
//     padding: "0 16px",
//     overflow: "visible",              // responsive padding
//   },

//   title: {
//     fontSize: "clamp(18px, 4vw, 36px)", // responsive font
//     fontWeight: 400,
//     fontSize: "20px",
//     marginTop: "5px",
//     flex: 1,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     color: "#0A0A0A",
//     whiteSpace: "nowrap",
//     textAlign: "left",
//     marginLeft: screen === "SUB" ? "60px" : "-6px",
//   },

//   title1: {
//     fontSize: "clamp(20px, 4vw, 36px)",
//     fontWeight: 400,
//     marginTop: "5px",
//     marginBottom: "8px",
//     color: "#0A0A0A",
//     textAlign: "left",
//     marginLeft: screen === "SUB" ? "50px" : "0px",

//     whiteSpace: "normal",
//     overflow: "visible",
//   }
//   ,
//   headerIcons: {

//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//   },

//   icon: {
//     cursor: "pointer",
//     color: "#444",
//   },

//   backbtn: {
//     position: "absolute",
//     left: 12,
//     width: 36,
//     height: 36,
//     borderRadius: 12,
//     border: "0.8px solid #ccc",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//   },


//   searchWrap: {
//     padding: "12px 0",
//     marginTop: "14px"
//   },

//   searchBar: {
//     position: "relative",          // 🔑 needed
//     display: "flex",
//     alignItems: "center",
//     background: "#fff",
//     borderRadius: 14,
//     height: 40,
//     // boxShadow: "1px 4px 8px rgba(0,0,0,0.2)",
//     border: "1px solid #ece5e5"
//   },

//   searchIcon: {
//     position: "absolute",          // 🔑 icon inside input
//     left: 14,
//     top: "50%",
//     transform: "translateY(-50%)",
//     color: "#888",
//     pointerEvents: "none",         // so clicks go to input
//   },

//   searchInput: {
//     width: "100%",
//     height: "100%",
//     border: "none",
//     outline: "none",
//     fontSize: 14,
//     padding: "12px 14px 0 40px",      // 🔑 space for icon
//     borderRadius: 14,
//     background: "transparent",
//   },


//   tabWrap: {
//     display: "flex",
//     justifyContent: "flex-start",
//     background: "transparent",
//     borderRadius: 14,
//     margin: "12px 0",
//     padding: 7,
//     gap: 56,
//     boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//   },


//   tabPill: {

//     textAlign: "center",
//     padding: "10px 20px",
//     borderRadius: "14px",
//     fontSize: 14,
//     cursor: "pointer",

//   },



//   list: { paddingBottom: 80, },
//   row: {
//     padding: 14,
//     display: "flex",
//     justifyContent: "space-between",
//     borderBottom: "1px solid #eee",
//     cursor: "pointer",
//   },
//   skillsRow: {
//     display: "flex",
//     gap: 10,
//     padding: "10px 0",
//     overflowX: "auto",
//     overflowY: "hidden",
//     whiteSpace: "nowrap",
//     minHeight: 56,
//     alignItems: "center",
//     boxSizing: "border-box",
//   },

//   skillChip: {
//     padding: "8px 14px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//     flexShrink: 0,
//     fontSize: 13,

//   },

//   tabs: {
//     display: "flex",
//     justifyContent: "space-around",
//     borderBottom: "1px solid #eee",
//     marginTop: 6,
//   },

//   tab: { padding: 12, cursor: "pointer" },
//   card: {
//     margin: 12,
//     padding: 16,
//     border: "1px solid #ddd",
//     borderRadius: 14,

//   },
//   skills: { display: "flex", gap: 6 },
//   skill: { padding: "4px 10px", borderRadius: 12, fontSize: 12 },
//   footer: { display: "flex", gap: 12, marginTop: 10 },
//   bookmark: { marginLeft: "auto", cursor: "pointer", fontSize: 20 },
//   empty: {
//     padding: 60,
//     textAlign: "center",
//     color: "#777",
//   },
//   jobCard: {
//     background: "#fff",
//     borderRadius: 18,
//     padding: 18,
//     margin: "16px 0",
//     boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//   },

//   cardTop: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },

//   company: {
//     margin: 0,
//     fontSize: 18,
//     fontWeight: 600,
//   },

//   role: {
//     margin: "4px 0 0",
//     color: "#555",
//   },

//   price: {
//     fontWeight: 400,
//     fontSize: "20px"
//   },

//   tagRow: {
//     display: "flex",
//     gap: 8,
//     margin: "12px 0",
//     flexWrap: "wrap",
//   },

//   tag: {
//     background: "#FFF4B8",
//     padding: "4px 10px",
//     borderRadius: 12,
//     fontSize: 12,
//   },

//   desc: {
//     fontSize: 14,
//     color: "#444",
//     lineHeight: 1.5,
//   },

//   cardFooter: {
//     display: "flex",
//     gap: 12,
//     alignItems: "center",
//     marginTop: 14,
//     fontSize: 12,
//     color: "#666",
//   },
//   rightTop: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "flex-end",
//     gap: 8,
//   },


//   priceWrap: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "flex-end",
//     gap: 6,
//   },

//   bookmark: {
//     fontSize: 20,
//     cursor: "pointer",
//     marginRight: "50px",
//   },




//   cardGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
//     gap: 24,
//     padding: "26px 8px",
//   },

//   categoryCard: {
//     background: "#fff",
//     borderRadius: 18,
//     cursor: "pointer",
//     transition: "all 0.25s ease",
//     boxShadow: "0 10px 26px rgba(0,0,0,0.10)",
//     overflow: "hidden",
//   },

//   categoryCardTop: {
//     height: 150,
//     width: "100%",
//     background: "#f3f4f6",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   categoryImage: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     borderRadius: "5px",
//   },

//   categoryCardBottom: {
//     padding: "16px 12px",
//     fontWeight: 600,
//     textAlign: "center",
//     fontSize: 15,
//     fontWeight: 400,
//     fontFamily: "Rubik, sans-serif",
//   },
// };


import React, { useEffect, useMemo, useState } from "react";

import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiEye, FiMessageCircle, FiSettings } from "react-icons/fi";
import { Bookmark, Clock, SaveIcon, Search, TimerIcon, User } from "lucide-react";
import "./clientbrower.css"
import backarrow from "../../../assets/backarrow.png";
import { MdSavedSearch } from "react-icons/md";
import { BsBookmarkFill } from "react-icons/bs";
import Searchjob from "../../../assets/Searchjob.png"
import { color } from "framer-motion";
import categoryImg from "../../../assets/categories.png";
import message from "../../../assets/message.png";
import notification from "../../../assets/notification.png";
/* ======================================================
   FIREBASE
====================================================== */
const db = getFirestore();
const auth = getAuth();
const PAGE_PADDING = "16px";

/* ======================================================
   CATEGORY DATA
====================================================== */

const jobCategories1 = {
  'Graphics & Design': [
    'Logo Design',
    'Brand Style Guides',
    'Business Cards & Stationery',
    'Illustration',
    'Pattern Design',
    'Website Design',
    'App Design',
    'UX Design',
    'Game Art',
    'NFTs & Collectibles',
    'Industrial & Product Design',
    'Architecture & Interior Design',
    'Landscape Design',
    'Fashion Design',
    'Jewelry Design',
    'Presentation Design',
    'Infographic Design',
    'Vector Tracing',
    'Car Wraps',
    'Image Editing',
    'Photoshop Editing',
    'T-Shirts & Merchandise',
    'Packaging Design',
    'Book Design',
    'Album Cover Design',
    'Podcast Cover Art',
    'Menu Design',
    'Invitation Design',
    'Brochure Design',
    'Poster Design',
    'Signage Design',
    'Flyer Design',
    'Social Media Design',
    'Print Design',
  ],

  'Programming & Tech': [
    'Website Development',
    'Website Builders & CMS',
    'Web Programming',
    'E-Commerce Development',
    'Game Development',
    'Mobile Apps (iOS & Android)',
    'Desktop Applications',
    'Chatbots',
    'QA & Review',
    'User Testing',
    'Support & IT',
    'Data Analysis & Reports',
    'Convert Files',
    'Databases',
    'Cybersecurity ',
    ' Data Protection',
    'Cloud Computing',
    'DevOps',
    'AI Development',
    'Machine Learning',
    'Blockchain & NFTs',
    'Scripts & Automation',
    'Software Customization',
  ],

  'Digital Marketing': [
    'Social Media Marketing',
    'SEO',
    'Content Marketing',
    'Video Marketing',
    'Email Marketing',
    'SEM (Search Engine Marketing)',
    'Influencer Marketing',
    'Local SEO',
    'Affiliate Marketing',
    'Mobile Marketing & Advertising',
    'Display Advertising',
    'E-Commerce Marketing',
    'Text Message Marketing',
    'Crowdfunding',
    'Marketing Strategy',
    'Web Analytics',
    'Domain Research',
    'Music Promotion',
    'Book & eBook Marketing',
    'Podcast Marketing',
    'Community Management',
    'Marketing Consulting',
  ],

  'Writing & Translation': [
    'Articles & Blog Posts',
    'Proofreading & Editing',
    'Translation',
    'Website Content',
    'Technical Writing',
    'Copywriting',
    'Brand Voice & Tone',
    'Resume Writing',
    'Cover Letters',
    'LinkedIn Profiles',
    'Press Releases',
    'Product Descriptions',
    'Case Studies',
    'White Papers',
    'Scriptwriting',
    'Speechwriting',
    'Creative Writing',
    'Book Editing',
    'Beta Reading',
    'Grant Writing',
    'UX Writing',
    'Email Copy',
    'Business Names & Slogans',
    'Transcription',
    'Legal Writing',
  ],

  'Video & Animation': [
    'Whiteboard & Animated Explainers',
    'Video Editing',
    'Short Video Ads',
    'Logo Animation',
    'Character Animation',
    '2D/3D Animation',
    'Intros & Outros',
    'Lyric & Music Videos',
    'Visual Effects',
    'Spokesperson Videos',
    'App & Website Previews',
    'Product Photography & Demos',
    'Subtitles & Captions',
    'Live Action Explainers',
    'Unboxing Videos',
    'Slideshow Videos',
    'Animation for Kids',
    'Trailers & Teasers',
  ],

  'Music & Audio': [
    'Voice Over',
    'Mixing & Mastering',
    'Producers & Composers',
    'Singers & Vocalists',
    'Session Musicians',
    'Songwriters',
    'Audiobook Production',
    'Sound Design',
    'Audio Editing',
    'Jingles & Intros',
    'Podcast Editing',
    'Music Transcription',
    'Dialogue Editing',
    'DJ Drops & Tags',
    'Music Promotion',
  ],

  'AI Services': [
    'AI Artists',
    'AI Applications',
    'AI Video Generators',
    'AI Music Generation',
    'AI Chatbot Development',
    'AI Website Builders',
    'Custom GPT & LLMs',
    'AI Training Data Preparation',
    'Text-to-Speech / Voice Cloning',
    'Prompt Engineering',
  ],

  'Data': [
    'Data Entry',
    'Data Mining & Scraping',
    'Data Analytics & Reports',
    'Database Design',
    'Data Visualization',
    'Dashboards',
    'Excel / Google Sheets',
    'Statistical Analysis',
    'Data Engineering',
    'Machine Learning Models',
    'Data Cleaning',
  ],

  'Business': [
    'Business Plans',
    'Market Research',
    'Branding Services',
    'Legal Consulting',
    'Financial Consulting',
    'Career Counseling',
    'Project Management',
    'Supply Chain Management',
    'HR Consulting',
    'E-Commerce Management',
    'Business Consulting',
    'Presentations',
    'Virtual Assistant',
  ],

  'Finance': [
    'Accounting & Bookkeeping',
    'Financial Forecasting',
    'Financial Modeling',
    'Tax Consulting',
    'Crypto & NFT Consulting',
    'Business Valuation',
    'Pitch Decks',
  ],

  'Photography': [
    'Product Photography',
    'Real Estate Photography',
    'Portraits',
    'Image Retouching',
    'Food Photography',
    'Drone Photography',
    'Lifestyle Photography',
    'AI Image Enhancement',
  ],

  'Lifestyle': [
    'Gaming',
    'Astrology & Psychics',
    'Online Tutoring',
    'Arts & Crafts',
    'Fitness Lessons',
    'Nutrition',
    'Relationship Advice',
    'Personal Styling',
    'Cooking Lessons',
    'Life Coaching',
    'Travel Advice',
    'Wellness & Meditation',
    'Language Lessons',
  ],

  'Consulting': [
    'Management Consulting',
    'Business Strategy',
    'HR & Leadership',
    'Financial Advisory',
    'Legal Consulting',
    'Technology Consulting',
    'Cybersecurity Consulting',
    'Marketing Strategy',
  ],

  'Personal Growth & Hobbies': [
    'Life Coaching',
    'Productivity Coaching',
    'Study Skills',
    'Language Learning',
    'Public Speaking',
    'Career Mentoring',
    'Mindfulness & Meditation',
    'Confidence Coaching',
  ],
};

/* ======================================================
   HELPERS
====================================================== */
const timeAgo = (date) => {
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
};

const skillColor = (text) => {
  const colors = ["#E3F2FD", "#FFF9C4", "#E1F5FE", "#F3E5F5"];
  return colors[text.length % colors.length];
};

/* ======================================================
   MAIN CLIENT COMPONENT
====================================================== */
export default function Client() {
  const location = useLocation();
  const [screen, setScreen] = useState("CATEGORIES"); // CATEGORIES | SUB
  const [category, setCategory] = useState(null);
  const [skill, setSkill] = useState(null);
  const navigate = useNavigate();
  const [catSearch, setCatSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );
  const [userProfile, setUserProfile] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const pending = notifications.filter((n) => !n.read).length;
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    role: "",
    profileImage: "",
  });
  const fetchUserProfile = async (uid) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setUserProfile(snap.data());
      } else {
        console.log("User profile not found");
      }
    } catch (e) {
      console.error("Profile fetch error:", e);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    fetchUserProfile(user.uid);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setUserInfo({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            role: data.role || "",
            profileImage: data.profileImage || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- DEFAULT AUTO SELECT ---------- */
  useEffect(() => {
    if (screen === "SUB" && category) {
      const list = jobCategories1[category] || [];
      if (list.length && !skill) setSkill(list[0]);
    }
  }, [screen, category]);

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () =>
      window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  /* ---------- FILTERS ---------- */
  const categories = useMemo(() => {
    if (!catSearch) return Object.keys(jobCategories1);
    return Object.keys(jobCategories1).filter((c) =>
      c.toLowerCase().includes(catSearch.toLowerCase())
    );
  }, [catSearch]);

  const subCategories = useMemo(() => {
    if (!category) return [];
    const list = jobCategories1[category];
    if (!subSearch) return list;
    return list.filter((s) =>
      s.toLowerCase().includes(subSearch.toLowerCase())
    );
  }, [subSearch, category]);

  useEffect(() => {
    if (location.state?.category) {
      setCategory(location.state.category);
      setScreen("SUB");
    }
  }, [location.state]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setNotifications([]); // Clear notifications if logged out
        return;
      }

      // Set up your notifications listener here
      const q = query(collection(db, "notifications"), where("clientUid", "==", user.uid));

      const unsubscribeNotif = onSnapshot(q, (snap) => {
        console.log("Notification docs:", snap.docs.map(d => d.data()));
        const filtered = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((n) => n.type !== "hire_request");
        console.log("Filtered notifications:", filtered);
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
  /* ======================================================
     UI
  ====================================================== */
  return (
    <div
      id="fh-e"
      style={{
        marginLeft: collapsed ? "-0px" : "-0px",
        transition: "margin-left 0.25s ease",
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        marginTop: isMobile ? "-20px" : "-70px",
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "1400px",   // 🔑 desktop & laptop perfect
          margin: "0 auto",     // 🔑 center align
          paddingLeft: "16px",
          paddingRight: "16px",
          boxSizing: "border-box",
        }}
      >

        <div style={styles.page}>
          {/* HEADER */}
          {/* HEADER */}
          <div style={styles.appBarr}>

            <div style={{ marginLeft: isMobile ? "-10px" : "-5px", }}>
              <h3 style={styles.title1}>
                {screen === "CATEGORIES" ? "Welcome," : category}
                <div style={{ fontSize: 20 }}>{userInfo.first_name || "Huzzlers"}</div>
              </h3>

            </div>


            {/* TOP RIGHT ICONS */}
            <div
              style={{
                ...styles.headerIcons,
                position: isMobile ? "absolute" : "static",
                top: isMobile ? "-5px" : "auto",
                right: isMobile ? "-44px" : "auto",
              }}
            >


              <img src={message} onClick={() => navigate("/client-dashbroad2/messages")} alt="message" style={{ width: "23px", cursor: "pointer" }} />
              <div
                className="ibtan"
                onClick={() => setNotifOpen(true)}
                style={{ cursor: "pointer" }}
              >
                <img width={25} src={notification} alt="notification" />
                {pending > 0 && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "red",
                      position: "absolute",
                      top: 10,
                      right: 12,
                    }}
                  />
                )}
              </div>

            </div>
          </div>

          <div style={{ marginTop: "1px" }}>

            <div style={{ fontSize: "16px", fontWeight: "400", color: "#0A0A0A", marginTop: "22px", padding: "0 10px" }}>Discover projects that match your skills</div>
          </div>
          {/* SEARCH */}
          <div style={styles.searchWrap}>
            <div style={styles.searchBar}>
              <Search size={16} style={styles.searchIcon} />

              <input
                placeholder="Search"
                value={screen === "CATEGORIES" ? catSearch : subSearch}
                onChange={(e) =>
                  screen === "CATEGORIES"
                    ? setCatSearch(e.target.value)
                    : setSubSearch(e.target.value)
                }
                style={styles.searchInput}
              />
            </div>
          </div>
          {screen === "CATEGORIES" && (
            <div style={{ marginTop: "10px" }}>
              {/* TOP ROW : Arrow + Title */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {/* BACK ARROW */}
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
                  <img src={backarrow} alt="back" style={{ width: 16, height: 16 }} />
                </div>

                {/* TITLE */}
                <h1 style={styles.title}>Browse Project</h1>
              </div>

              {/* TEXT BELOW ARROW */}
              <div
                style={{
                  marginLeft: isMobile ? "0px" : "48px",
                  marginTop: "12px",
                }}
              >
                <p
                  style={{
                    fontWeight: "400",
                    marginBottom: "8px",
                    marginLeft: isMobile ? "0px" : "-38px",
                  }}
                >
                  What Are You Looking For?
                </p>

                <p
                  style={{
                    color: "#0A0A0A",
                    fontSize: "16px",
                    fontWeight: "400",
                    marginLeft: isMobile ? "0px" : "-38px",
                  }}
                >
                  Choose your a category
                </p>
              </div>
            </div>

          )}


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
                  top: 140,
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

          {/* CONTENT */}
          {screen === "CATEGORIES" && (
            <div
              className="category-grid"
              style={{
                display: "grid",
                gap: 24,
                padding: "26px 8px",
                gridTemplateColumns: isMobile
                  ? "repeat(1, 1fr)"   // 2 cards per row on mobile
                  : "repeat(auto-fill, minmax(230px, 1fr))", // desktop
              }}
            >
              {categories
                .filter((c) =>
                  c.toLowerCase().includes(catSearch.toLowerCase())
                )
                .map((category) => (
                  <div
                    key={category}
                    style={styles.categoryCard}
                    onClick={() => {
                      setCategory(category);
                      setSkill(null);
                      setScreen("SUB");
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 28px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0,0,0,0.08)";
                    }}
                  >
                    <div style={styles.categoryCardTop}>
                      <img
                        src={categoryImg}
                        alt={category}
                        style={styles.categoryImage}
                      />
                    </div>

                    <div style={styles.categoryCardBottom}>
                      {category}
                    </div>
                  </div>
                ))}
            </div>
          )}
          {screen === "SUB" && (
            <>
              {/* SUB SKILLS */}
              <div style={{ ...styles.skillsRow }} className="skillsRow">

                {subCategories.map((s) => (
                  <div
                    key={s}
                    onClick={() => setSkill(s)}
                    style={{
                      ...styles.skillChip,
                      background: skill === s ? "rgba(124, 60, 255, 1)" : "#eee",
                      color: skill === s ? "#fff" : "#000",
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>

              {/* JOBS */}
              {skill && <JobsScreen skill={skill} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   JOBS SCREEN
====================================================== */
function JobsScreen({ skill }) {
  const [tab, setTab] = useState("WORKS");
  const [jobs, setJobs] = useState([]);
  const [jobs24, setJobs24] = useState([]);
  const [saved, setSaved] = useState([]);


  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "services"), (snap) =>
      setJobs(processJobs(snap.docs))
    );
    const u2 = onSnapshot(collection(db, "service_24h"), (snap) =>
      setJobs24(processJobs(snap.docs, "24H"))
    );


    if (!uid) return;
    const u3 = onSnapshot(doc(db, "users", uid), (snap) =>
      setSaved(snap.data()?.favoriteJobs || [])
    );

    return () => {
      u1();
      u2();
      u3 && u3();
    };
  }, [uid]);

  const filter = (list) =>
    list.filter((j) =>
      [...j.skills, ...j.tools].some((x) =>
        x.toLowerCase().includes(skill.toLowerCase())
      )
    );

  const renderList =
    tab === "WORKS"
      ? filter(jobs)
      : tab === "24H"
        ? filter(jobs24)
        : [...jobs, ...jobs24].filter((j) => saved.includes(j.id));

  return (
    <>

      <div style={styles.tabWrap}>
        {["Work", "24 Hours", "Saved"].map((t) => (
          <div
            className="pill"
            key={t}
            onClick={() => setTab(t === "Work" ? "WORKS" : t === "24 Hours" ? "24H" : "SAVED")}
            style={{
              ...styles.tabPill,
              background: tab === (t === "Work" ? "WORKS" : t === "24 Hours" ? "24H" : "SAVED")
                ? "#efeaeaff"
                : "transparent",
            }}
          >
            {t}
          </div>
        ))}
      </div>




      {/* TABS */}

      {/* LIST */}
      <div>
        {renderList.length === 0 ? (
          <Empty />
        ) : (
          renderList.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              saved={saved.includes(job.id)}
            />
          ))
        )}
      </div>
    </>
  );
}

/* ======================================================
   JOB CARD
====================================================== */
function JobCard({ job, saved }) {
  const uid = auth.currentUser?.uid;
  const navigate = useNavigate();   // ✅ ADD THIS

  const toggleSave = async (e) => {
    e.stopPropagation(); // ✅ card click block panna
    if (!uid) return;

    await updateDoc(doc(db, "users", uid), {
      favoriteJobs: saved ? arrayRemove(job.id) : arrayUnion(job.id),
    });
  };

  const is24h = job.timeline === "24H" || job.is24h === true; // optional

  return (
    <div
      style={styles.jobCard}
      onClick={() => {
        // ✅ navigate based on collection type
        if (job.type === "24H") {
          navigate(`/client-dashbroad2/service-24h/${job.id}`);
        } else {
          navigate(`/client-dashbroad2/service/${job.id}`);
        }
      }}
    >
      <div style={styles.cardTop}>
        <div>
          <p style={styles.role}>{job.title}</p>
        </div>

        <div style={styles.priceWrap}>
          <div style={styles.price}>₹ {job.budget_from || 0}</div>

          <span onClick={toggleSave} style={styles.bookmark}>
            {saved ? <BsBookmarkFill size={16} /> : <Bookmark size={18} />}
          </span>
        </div>
      </div>

      <p style={{ opacity: "70%", fontSize: "14px", fontWeight: "400" }}>
        Skills Required
      </p>

      <div style={styles.tagRow}>
        {job.skills.slice(0, 4).map((s) => (
          <span key={s} style={styles.tag}>
            {s}
          </span>
        ))}
      </div>

      <p style={styles.desc}>{job.description}</p>

      <div style={styles.cardFooter}>
        <FiEye size={15} /> <span>{job.views} Impression</span>
        <Clock size={15} /> <span>{timeAgo(job.created_at)}</span>
      </div>
    </div>
  );
}

/* ======================================================
   DATA NORMALIZER
====================================================== */
function processJobs(docs, type = "WORK") {
  return docs
    .map((d) => {
      const data = d.data();
      if (!data.title || !data.description) return null;

      return {
        id: d.id,
        title: data.title,
        description: data.description,
        skills: data.skills || [],
        tools: data.tools || [],
        views: data.views || 0,
        created_at: data.created_at?.toDate?.() || new Date(),
        type: type, // ✅ ADD THIS
      };
    })
    .filter(Boolean);
}


/* ======================================================
   SMALL UI
====================================================== */
const Row = ({ text, onClick }) => (
  <div style={styles.row} onClick={onClick}>
    <span>{text}</span>
    <span>›</span>
  </div>
);

const Empty = () => (
  <div style={styles.empty}>
    <div style={{ fontSize: 48 }}><img src={Searchjob} height={"200px"} /></div>
    <p>No jobs found</p>
  </div>
);

/* ======================================================
   STYLES
====================================================== */
const styles = {
  page: {
    fontFamily: "system-ui",
    background: "#fff",
    padding: "10%",
    minHeight: "100dvh",
    width: "100%",
    maxWidth: "1400px",     // 🔥 laptop + desktop
    margin: "0 auto",      // 🔥 center
    overflowY: "auto",
    boxSizing: "border-box",
  },

  appBarr: {
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    padding: "0 16px",
    overflow: "visible",              // responsive padding
  },

  title: {
    fontSize: "clamp(18px, 4vw, 36px)", // responsive font
    fontWeight: 400,
    fontSize: "20px",
    marginTop: "5px",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#0A0A0A",
    whiteSpace: "nowrap",
    textAlign: "left",
    marginLeft: screen === "SUB" ? "60px" : "-6px",
  },

  title1: {
    fontSize: "clamp(20px, 4vw, 36px)",
    fontWeight: 400,
    marginTop: "5px",
    marginBottom: "8px",
    color: "#0A0A0A",
    textAlign: "left",
    marginLeft: screen === "SUB" ? "50px" : "0px",

    whiteSpace: "normal",
    overflow: "visible",
  }
  ,
  headerIcons: {

    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  icon: {
    cursor: "pointer",
    color: "#444",
  },

  backbtn: {
    position: "absolute",
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 12,
    border: "0.8px solid #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },


  searchWrap: {
    padding: "12px 0",
    marginTop: "14px"
  },

  searchBar: {
    position: "relative",          // 🔑 needed
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: 14,
    height: 40,
    // boxShadow: "1px 4px 8px rgba(0,0,0,0.2)",
    border: "1px solid #ece5e5"
  },

  searchIcon: {
    position: "absolute",          // 🔑 icon inside input
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#888",
    pointerEvents: "none",         // so clicks go to input
  },

  searchInput: {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    fontSize: 14,
    padding: "12px 14px 0 40px",      // 🔑 space for icon
    borderRadius: 14,
    background: "transparent",
  },


  tabWrap: {
    display: "flex",
    justifyContent: "flex-start",
    background: "transparent",
    borderRadius: 14,
    margin: "12px 0",
    padding: 7,
    gap: 56,
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },


  tabPill: {

    textAlign: "center",
    padding: "10px 20px",
    borderRadius: "14px",
    fontSize: 14,
    cursor: "pointer",

  },



  list: { paddingBottom: 80, },
  row: {
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  skillsRow: {
    display: "flex",
    gap: 10,
    padding: "10px 0",
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    minHeight: 56,
    alignItems: "center",
    boxSizing: "border-box",
  },

  skillChip: {
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
    fontSize: 13,

  },

  tabs: {
    display: "flex",
    justifyContent: "space-around",
    borderBottom: "1px solid #eee",
    marginTop: 6,
  },

  tab: { padding: 12, cursor: "pointer" },
  card: {
    margin: 12,
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 14,

  },
  skills: { display: "flex", gap: 6 },
  skill: { padding: "4px 10px", borderRadius: 12, fontSize: 12 },
  footer: { display: "flex", gap: 12, marginTop: 10 },
  bookmark: { marginLeft: "auto", cursor: "pointer", fontSize: 20 },
  empty: {
    padding: 60,
    textAlign: "center",
    color: "#777",
  },
  jobCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    margin: "16px 0",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  company: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  },

  role: {
    margin: "4px 0 0",
    color: "#555",
  },

  price: {
    fontWeight: 400,
    fontSize: "20px"
  },

  tagRow: {
    display: "flex",
    gap: 8,
    margin: "12px 0",
    flexWrap: "wrap",
  },

  tag: {
    background: "#FFF4B8",
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
  },

  desc: {
    fontSize: 14,
    color: "#444",
    lineHeight: 1.5,
  },

  cardFooter: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 14,
    fontSize: 12,
    color: "#666",
  },
  rightTop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },


  priceWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
  },

  bookmark: {
    fontSize: 20,
    cursor: "pointer",
    marginRight: "50px",
  },




  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: 24,
    padding: "26px 8px",
  },

  categoryCard: {
    background: "#fff",
    borderRadius: 18,
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 10px 26px rgba(0,0,0,0.10)",
    overflow: "hidden",
  },

  categoryCardTop: {
    height: 150,
    width: "100%",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  categoryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "5px",
  },

  categoryCardBottom: {
    padding: "16px 12px",
    textAlign: "center",
    fontSize: 15,
    fontWeight: 400,
    fontFamily: "Rubik, sans-serif",
  },

};