
// // BuildProfileScreenWithEdit.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   setDoc,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
//   where,
//   serverTimestamp,
// } from "firebase/firestore";
// import "./profilebuild.css";
// import {
//   Button,
//   TextField,
//   Box,
//   Typography,
//   IconButton,
//   Autocomplete,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import editimg from "../assets/edit.png";
// import { FiEdit2, FiTrash2 } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// import AddPortfolioPopup from "../Firebaseaddporfoilo/AddPortfolioPopup.jsx";
// import { Pencil } from "lucide-react";
// import company from "../assets/comany.jpg"

// // -----------------------------------------------------------------------------
// // Single file contains:
// // - BuildProfileScreen (main)
// // - EditPortfolioPopup (modal)
// // - Sidebar helper + Posted Jobs cards (Works & 24 Hours) — built-in
// // -----------------------------------------------------------------------------

// // ----------------- SIDEBAR SUPPORT (copied from your Card.jsx) -----------------
// const useSidebar = () => {
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

//   return collapsed;
// };

// const isMobile = window.innerWidth <= 768;
// // ---------------------------- STYLES (in-file) ----------------------------
// const pageStyles = {
//   pageWrapper: {
//     width: "80%",
//     minHeight: "100vh",
//     // background: "#F5F6FA",
//     marginTop: '60px',
//     paddingBottom: 80,
//     boxSizing: "border-box",

//   },
//   content: {

//     maxWidth: 1120,
//     margin: "0 auto",
//     padding: "24px 16px",
//     boxSizing: "border-box",
//   },

//   // Posted Jobs styles (adapted from Card.jsx)
//   jobsContainer: {
//     marginTop: 28,
//     background: "#fff",
//     borderRadius: 16,
//     padding: 18,
//     boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
//     border: "1px solid #c9c5c5",
//   },

//   toggleBarWrapper: {
//     width: "100%",
//     minHeight: 52,
//     borderRadius: 16,
//     padding: "6px 8px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "flex-start", // 👈 LEFT aligned
//     backgroundColor: "#FFF8E1",
//     boxShadow: "0 2px 8px rgba(16,24,40,0.04)",

//   },
//   toggleGroup: {
//     display: "flex",
//     gap: 6,
//     borderRadius: 14,
//     alignItems: "center",
//   },

//   toggleButton: (active) => ({
//     width: 180,
//     height: 36,
//     borderRadius: 12,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: active ? "#FFFFFF" : "transparent",
//     fontSize: 14,
//     fontWeight: 600,
//     cursor: "pointer",
//     boxShadow: active ? "0 4px 10px rgba(124,60,255,0.06)" : "none",
//   }),

//   searchSortRow: {
//     display: "flex",
//     gap: 12,
//     alignItems: "center",
//     marginTop: 16,
//   },

//   searchContainer: {
//     flex: 1,
//     height: 44,
//     borderRadius: 14,
//     border: "1px solid #DADADA",
//     paddingLeft: 14,
//     paddingRight: 14,
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#FFF",
//     paddingTop: "15px",
//   },

//   cardsWrap: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
//     gap: 24,
//     marginTop: 20,
//   },

//   card: {
//     width: "100%",
//     minHeight: 220,
//     borderRadius: 24,
//     border: "0.8px solid #DADADA",
//     backgroundColor: "#FFFFFF",
//     padding: 20,
//     boxShadow: "0 8px 20px rgba(16,24,40,0.04)",
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     position: "relative",
//   },

//   avatarBox: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 14,
//     background:
//       "linear-gradient(135deg, #51A2FF, #9B42FF 60%, #AD46FF)",
//     color: "#FFF",
//     fontWeight: 700,
//   },

//   skillChip: {
//     padding: "4px 12px",
//     borderRadius: 20,
//     border: "1px solid rgba(255,255,190,1)",
//     backgroundColor: "rgba(255,255,190,1)",
//     fontSize: 14,
//     whiteSpace: "nowrap",
//     flexShrink: 0, // 👈 VERY IMPORTANT
//     marginLeft: "2px",
//   },


//   moreChip: {
//     padding: "4px 25px",
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,190,1)",
//     fontSize: 11,
//   },

//   // small helpers
//   label: { fontSize: 15 },
//   value: { marginTop: 4, fontSize: 13, fontWeight: 500 },
//   valueHighlight: { color: "rgba(124,60,255,1)" },

//   emptyWrap: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginTop: 40,
//     gridColumn: "1 / -1",
//   },

//   fab: {
//     position: "fixed",
//     right: 32,
//     bottom: 32,
//     width: 64,
//     height: 64,
//     borderRadius: "50%",
//     backgroundColor: "rgba(124,60,255,1)",
//     color: "#FFF",
//     fontSize: 32,
//     border: "none",
//     cursor: "pointer",
//     boxShadow: "0 8px 16px rgba(124,60,255,0.4)",
//   },
// };

// // ---------------------------- helpers ----------------------------
// function formatBudget(val) {
//   if (!val) return 0;
//   const num = Number(val);
//   if (num >= 100000) return (num / 100000).toFixed(1) + "L";
//   if (num >= 1000) return (num / 1000).toFixed(1) + "k";
//   return num;
// }

// function getInitials(title) {
//   if (!title) return "";
//   const w = title.trim().split(" ");
//   if (w.length > 1) return (w[0][0] + w[1][0]).toUpperCase();
//   return w[0][0].toUpperCase();
// }

// // ---------------------------- MAIN COMPONENT ----------------------------
// export default function BuildProfileScreenWithEdit() {
//   const auth = getAuth();
//   const db = getFirestore();
//   const navigate = useNavigate();

//   const collapsed = useSidebar();

//   // Profile state
//   const [user, setUser] = useState(null);

//   const [profileData, setProfileData] = useState({
//     first_name: "",
//     last_name: "",
//     title: "",
//     about: "",
//     skills: [],
//     tools: [],
//     profileImage: "",
//     location: "",

//   });

//   console.log(profileData.professional_title)
//   // Portfolio
//   const [portfolio, setPortfolio] = useState([]);
//   const [isPortfolioPopupOpen, setIsPortfolioPopupOpen] = useState(false);

//   // Inline edit states
//   const [editingAbout, setEditingAbout] = useState(false);
//   const [editingSkillsTools, setEditingSkillsTools] = useState(false);
//   const [tempAbout, setTempAbout] = useState("");
//   const [tempSkills, setTempSkills] = useState([]);
//   const [tempTools, setTempTools] = useState([]);
//     const skillOptions = [
//     // Graphics & Design
//     "Logo Design",
//     "Brand Style Guides",
//     "Business Cards & Stationery",
//     "Illustration",
//     "Pattern Design",
//     "Website Design",
//     "App Design",
//     "UX Design",
//     "Game Art",
//     "NFTs & Collectibles",
//     "Industrial & Product Design",
//     "Architecture & Interior Design",
//     "Landscape Design",
//     "Fashion Design",
//     "Jewelry Design",
//     "Presentation Design",
//     "Infographic Design",
//     "Vector Tracing",
//     "Car Wraps",
//     "Image Editing",
//     "Photoshop Editing",
//     "T-Shirts & Merchandise",
//     "Packaging Design",
//     "Book Design",
//     "Album Cover Design",
//     "Podcast Cover Art",
//     "Menu Design",
//     "Invitation Design",
//     "Brochure Design",
//     "Poster Design",
//     "Signage Design",
//     "Flyer Design",
//     "Social Media Design",
//     "Print Design",

//     // Programming & Tech
//     "Website Development",
//     "Website Builders & CMS",
//     "Web Programming",
//     "E-Commerce Development",
//     "Game Development",
//     "Mobile Apps (iOS & Android)",
//     "Desktop Applications",
//     "Chatbots",
//     "QA & Review",
//     "User Testing",
//     "Support & IT",
//     "Data Analysis & Reports",
//     "Convert Files",
//     "Databases",
//     "Cybersecurity & Data Protection",
//     "Cloud Computing",
//     "DevOps",
//     "AI Development",
//     "Machine Learning Models",
//     "Blockchain & NFTs",
//     "Scripts & Automation",
//     "Software Customization",

//     // Digital Marketing
//     "Social Media Marketing",
//     "SEO",
//     "Content Marketing",
//     "Video Marketing",
//     "Email Marketing",
//     "SEM (Search Engine Marketing)",
//     "Influencer Marketing",
//     "Local SEO",
//     "Affiliate Marketing",
//     "Mobile Marketing & Advertising",
//     "Display Advertising",
//     "E-Commerce Marketing",
//     "Text Message Marketing",
//     "Crowdfunding",
//     "Web Analytics",
//     "Domain Research",
//     "Music Promotion",
//     "Book & eBook Marketing",
//     "Podcast Marketing",
//     "Community Management",
//     "Marketing Consulting",

//     // Writing & Translation
//     "Articles & Blog Posts",
//     "Proofreading & Editing",
//     "Translation",
//     "Website Content",
//     "Technical Writing",
//     "Copywriting",
//     "Brand Voice & Tone",
//     "Resume Writing",
//     "Cover Letters",
//     "LinkedIn Profiles",
//     "Press Releases",
//     "Product Descriptions",
//     "Case Studies",
//     "White Papers",
//     "Scriptwriting",
//     "Speechwriting",
//     "Creative Writing",
//     "Book Editing",
//     "Beta Reading",
//     "Grant Writing",
//     "UX Writing",
//     "Email Copy",
//     "Business Names & Slogans",
//     "Transcription",
//     "Legal Writing",

//     // Video & Animation
//     "Whiteboard & Animated Explainers",
//     "Video Editing",
//     "Short Video Ads",
//     "Logo Animation",
//     "Character Animation",
//     "2D/3D Animation",
//     "Intros & Outros",
//     "Lyric & Music Videos",
//     "Visual Effects",
//     "Spokesperson Videos",
//     "App & Website Previews",
//     "Product Photography & Demos",
//     "Subtitles & Captions",
//     "Live Action Explainers",
//     "Unboxing Videos",
//     "Slideshow Videos",
//     "Animation for Kids",
//     "Trailers & Teasers",

//     // Music & Audio
//     "Voice Over",
//     "Mixing & Mastering",
//     "Producers & Composers",
//     "Singers & Vocalists",
//     "Session Musicians",
//     "Songwriters",
//     "Audiobook Production",
//     "Sound Design",
//     "Audio Editing",
//     "Jingles & Intros",
//     "Podcast Editing",
//     "Music Transcription",
//     "Dialogue Editing",
//     "DJ Drops & Tags",

//     // AI Services (sample)
//     "AI Artists",
//     "AI Applications",
//     "AI Video Generators",
//     "AI Music Generation",
//     "AI Chatbot Development",
//     "AI Website Builders",
//     "Custom GPT & LLMs",
//     "AI Training Data Preparation",
//     "Text-to-Speech / Voice Cloning",
//     "Prompt Engineering",

//     // Data (sample)
//     "Data Entry",
//     "Data Mining & Scraping",
//     "Database Design",
//     "Data Visualization",
//     "Dashboards",
//     "Excel / Google Sheets",
//     "Statistical Analysis",
//     "Data Engineering",
//     "Data Cleaning",

//     // Business / Finance / Consulting / Lifestyle (sample)
//     "Business Plans",
//     "Market Research",
//     "Branding Services",
//     "Financial Consulting",
//     "Career Counseling",
//     "Project Management",
//     "Supply Chain Management",
//     "HR Consulting",
//     "E-Commerce Management",
//     "Business Consulting",
//     "Presentations",
//     "Virtual Assistant",
//     "Accounting & Bookkeeping",
//     "Financial Forecasting",
//     "Financial Modeling",
//     "Tax Consulting",
//     "Crypto & NFT Consulting",
//     "Business Valuation",
//     "Pitch Decks",
//     "Product Photography",
//     "Real Estate Photography",
//     "Portraits",
//     "Image Retouching",
//     "Food Photography",
//     "Drone Photography",
//     "Lifestyle Photography",
//     "AI Image Enhancement",
//     "Gaming",
//     "Astrology & Psychics",
//     "Online Tutoring",
//     "Arts & Crafts",
//     "Fitness Lessons",
//     "Nutrition",
//     "Relationship Advice",
//     "Personal Styling",
//     "Cooking Lessons",
//     "Life Coaching",
//     "Travel Advice",
//     "Wellness & Meditation",
//     "Language Lessons",
//     "Management Consulting",
//     "Business Strategy",
//     "HR & Leadership",
//     "Financial Advisory",
//     "Technology Consulting",
//     "Cybersecurity Consulting",
//     "Productivity Coaching",
//     "Study Skills",
//     "Language Learning",
//     "Public Speaking",
//     "Career Mentoring",
//     "Mindfulness & Meditation",
//     "Confidence Coaching",
//   ];
//   const toolOptions = [
//     // Design tools
//     "Adobe Illustrator",
//     "CorelDRAW",
//     "Affinity Designer",
//     "Canva",
//     "Figma",
//     "Gravit Designer",
//     "Inkscape",
//     "Adobe InDesign",
//     "Notion",
//     "Milanote",
//     "Frontify",
//     "VistaCreate",
//     "Procreate",
//     "Clip Studio Paint",
//     "Corel Painter",
//     "Krita",
//     "Repper",
//     "Patterninja",
//     "Adobe XD",
//     "Sketch",
//     "Webflow",
//     "Framer",
//     "InVision Studio",
//     "ProtoPie",
//     "Marvel",
//     "Miro",
//     "Balsamiq",
//     "Axure RP",
//     "Lucidchart",
//     "Adobe Photoshop",
//     "Blender",
//     "ZBrush",
//     "Substance Painter",
//     "Unity",
//     "Unreal Engine",
//     "NFT Art Generator",
//     "SolidWorks",
//     "Autodesk Fusion 360",
//     "Rhino 3D",
//     "KeyShot",
//     "AutoCAD",
//     "SketchUp",
//     "Revit",
//     "Lumion",
//     "3ds Max",
//     "CLO 3D",
//     "Marvelous Designer",
//     "TUKAcad",
//     "RhinoGold",
//     "MatrixGold",
//     "PowerPoint",
//     "Google Slides",
//     "Prezi",
//     "Keynote",
//     "Piktochart",
//     "Visme",
//     "Venngage",
//     "Vector Magic",
//     "FlexiSIGN",
//     "SAi Sign Design Software",
//     "Easysign Studio",
//     "Adobe Express",
//     "Crello",
//     "Buffer Pablo",
//     "QuarkXPress",

//     // Dev tools
//     "Visual Studio Code",
//     "Sublime Text",
//     "Atom",
//     "Git",
//     "GitHub",
//     "GitLab",
//     "Node.js",
//     "React",
//     "Angular",
//     "Vue.js",
//     "HTML",
//     "CSS",
//     "JavaScript",
//     "Bootstrap",
//     "Tailwind CSS",
//     "WordPress",
//     "Elementor",
//     "Divi",
//     "Wix",
//     "Squarespace",
//     "Shopify",
//     "Joomla",
//     "Drupal",
//     "IntelliJ IDEA",
//     "PyCharm",
//     "PHPStorm",
//     "Django",
//     "Flask",
//     "Laravel",
//     "ASP.NET Core",
//     "Express.js",
//     "WooCommerce",
//     "Magento",
//     "BigCommerce",
//     "OpenCart",
//     "PrestaShop",
//     "Stripe",
//     "PayPal",
//     "Godot",
//     "C#",
//     "C++",
//     "Android Studio",
//     "Xcode",
//     "Flutter",
//     "React Native",
//     "Kotlin",
//     "Java",
//     "Swift",
//     "SwiftUI",
//     "Firebase",
//     "Expo",
//     "Electron.js",
//     "PyQt",
//     "Tkinter",
//     ".NET",
//     "WPF",
//     "JavaFX",
//     "C++ with Qt",

//     // Testing / QA
//     "Selenium",
//     "Postman",
//     "JMeter",
//     "Cypress",
//     "TestRail",
//     "Bugzilla",
//     "Jira",
//     "Appium",
//     "Hotjar",
//     "Maze",
//     "UserTesting.com",
//     "Lookback",
//     "Zendesk",
//     "Freshdesk",
//     "Jira Service Management",
//     "ServiceNow",
//     "TeamViewer",
//     "AnyDesk",
//     "Microsoft Intune",

//     // Data / ML
//     "Python",
//     "Pandas",
//     "NumPy",
//     "Matplotlib",
//     "R Studio",
//     "Power BI",
//     "Tableau",
//     "Excel",
//     "Google Sheets",
//     "SQL",
//     "Jupyter Notebook",
//     "MySQL",
//     "PostgreSQL",
//     "MongoDB",
//     "SQLite",
//     "Firebase Firestore",
//     "Redis",
//     "Microsoft SQL Server",
//     "TensorFlow",
//     "PyTorch",
//     "OpenAI API",
//     "Hugging Face Transformers",
//     "LangChain",
//     "Google Vertex AI",
//     "Azure AI Studio",
//     "Scikit-learn",
//     "XGBoost",
//     "LightGBM",

//     // Cloud / DevOps
//     "AWS",
//     "Microsoft Azure",
//     "Google Cloud Platform",
//     "DigitalOcean",
//     "Heroku",
//     "IBM Cloud",
//     "Docker",
//     "Kubernetes",
//     "Jenkins",
//     "GitHub Actions",
//     "GitLab CI/CD",
//     "Terraform",
//     "Ansible",
//     "Prometheus",
//     "Grafana",

//     // Automation / Scraping
//     "Python Automation Scripts",
//     "PowerShell",
//     "Bash",
//     "AutoHotkey",
//     "Puppeteer",
//     "Playwright",
//     "Zapier",
//     "Make",

//     // AI / Content / Tools
//     "ChatGPT",
//     "Jasper",
//     "SurferSEO",
//     "Grammarly",
//     "Hemingway Editor",
//     "ProWritingAid",
//     "LanguageTool",
//     "QuillBot",
//     "DeepL Translator",
//     "Vyond",
//     "Animaker",
//     "Adobe After Effects",
//     "Adobe Premiere Pro",
//     "Final Cut Pro",
//     "DaVinci Resolve",
//     "CapCut",
//     "Filmora",
//     "Vegas Pro",
//     "Audacity",
//     "Adobe Audition",
//     "GarageBand",
//     "FL Studio",
//     "Ableton Live",
//     "Cubase",
//     "Studio One",
//     "Spotify for Artists",
//     "SoundCloud",
//     "DALL·E",
//     "MidJourney",
//     "Stable Diffusion",
//     "Adobe Firefly",
//     "Leonardo AI",
//     "Runway ML",
//     "Descript",
//     "ElevenLabs",
//     "Trello",
//     "Asana",
//     "ClickUp",
//     "Slack",
//     "Zoom",
//     "Teams",
//     "Xero",
//     "Tally",
//     "Notion",
//   ];

//   // Portfolio edit popup
//   const [editingPortfolio, setEditingPortfolio] = useState(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);

//   // Posted Jobs (Works + 24 Hours)
//   const [selectedJobsTab, setSelectedJobsTab] = useState("Works");
//   const [searchText, setSearchText] = useState("");
//   const [sortOption, setSortOption] = useState("newest");
//   const [services, setServices] = useState([]);
//   const [jobs24, setJobs24] = useState([]);
//   const [servicesLoading, setServicesLoading] = useState(true);
//   const [jobs24Loading, setJobs24Loading] = useState(true);
//   const [showAll, setShowAll] = useState(false);



//   // ------------------ auth + profile + portfolio listeners ------------------
//   useEffect(() => {
//     const unsubAuth = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//     });

//     return () => unsubAuth();
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     const userRef = doc(db, "users", user.uid);

//     // fetch user profile once
//     getDoc(userRef).then((snap) => {
//       if (snap.exists()) {
//         setProfileData((prev) => ({ ...prev, ...snap.data() }));
//       }
//     });

//     // portfolio realtime
//     const q = query(
//       collection(db, "users", user.uid, "portfolio"),
//       orderBy("createdAt", "desc")
//     );
//     const unsub = onSnapshot(q, (snap) => {
//       setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });

//     return () => unsub();
//   }, [user, db]);

//   // ------------------ services (Works) listener ------------------
//   useEffect(() => {
//     if (!user) return;
//     setServicesLoading(true);

//     const q = query(collection(db, "services"), where("userId", "==", user.uid));
//     const unsub = onSnapshot(q, (snap) => {
//       const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       arr.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
//       setServices(arr);
//       setServicesLoading(false);
//     });

//     return () => unsub();
//   }, [user, db]);

//   // ------------------ service_24h listener ------------------
//   useEffect(() => {
//     if (!user) return;
//     setJobs24Loading(true);

//     const q = query(collection(db, "service_24h"), where("userId", "==", user.uid));
//     const unsub = onSnapshot(q, (snap) => {
//       const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       arr.sort(
//         (a, b) =>
//           (b.created_at?.seconds || b.createdAt?.seconds || 0) -
//           (a.created_at?.seconds || a.createdAt?.seconds || 0)
//       );
//       setJobs24(arr);
//       setJobs24Loading(false);
//     });

//     return () => unsub();
//   }, [user, db]);

//   // ------------------ updateField util ------------------
//   const updateField = async (field, value) => {
//     if (!user) return;
//     const userRef = doc(db, "users", user.uid);
//     await setDoc(userRef, { [field]: value }, { merge: true });
//     setProfileData((prev) => ({ ...prev, [field]: value }));
//   };

//   // ------------------ LaunchURL ------------------
//   const LaunchURL = (url) => url && window.open(url, "_blank");

//   // ------------------ About handlers ------------------
//   const startEditAbout = () => {
//     setTempAbout(profileData.about || "");
//     setEditingAbout(true);
//     setEditingSkillsTools(false);
//   };
//   const cancelEditAbout = () => {
//     setTempAbout("");
//     setEditingAbout(false);
//   };
//   const saveEditAbout = async () => {
//     await updateField("about", tempAbout);
//     setTempAbout("");
//     setEditingAbout(false);
//   };

//   // ------------------ Skills/Tools handlers ------------------
//   const startEditSkillsTools = () => {
//     setTempSkills(Array.isArray(profileData.skills) ? profileData.skills : []);
//     setTempTools(Array.isArray(profileData.tools) ? profileData.tools : []);
//     setEditingSkillsTools(true);
//     setEditingAbout(false);
//   };
//   const cancelEditSkillsTools = () => {
//     setTempSkills([]);
//     setTempTools([]);
//     setEditingSkillsTools(false);
//   };
//   const saveEditSkillsTools = async () => {
//     await updateField("skills", tempSkills || []);
//     await updateField("tools", tempTools || []);
//     setTempSkills([]);
//     setTempTools([]);
//     setEditingSkillsTools(false);
//   };

//   // ------------------ Portfolio edit / delete ------------------
//   const handleOpenEdit = (p, e) => {
//     if (e && e.stopPropagation) e.stopPropagation();
//     setEditingPortfolio(p);
//     setIsEditOpen(true);
//   };

//   const handleDelete = async (p, e) => {
//     if (e && e.stopPropagation) e.stopPropagation();
//     try {
//       const ok = window.confirm("Delete this portfolio item? This cannot be undone.");
//       if (!ok) return;
//       await deleteDoc(doc(db, "users", user.uid, "portfolio", p.id));
//       alert("Deleted");
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert("Delete failed");
//     }
//   };

//   const handleSaveEdit = async (updated) => {
//     try {
//       const ref = doc(db, "users", user.uid, "portfoli0", updated.id);
//       const toUpdate = { ...updated };
//       delete toUpdate.id;
//       await updateDoc(ref, toUpdate);
//       setIsEditOpen(false);
//       setEditingPortfolio(null);
//       alert("Portfolio updated");
//     } catch (err) {
//       console.error("Update failed:", err);
//       alert("Update failed");
//     }
//   };

//   // ------------------ Posted Jobs helpers ------------------
//   async function togglePause(job, collectionName, e) {
//     if (e && e.stopPropagation) e.stopPropagation();
//     try {
//       await updateDoc(doc(db, collectionName, job.id), {
//         paused: !job.paused,
//         pausedAt: !job.paused ? serverTimestamp() : null,
//       });
//     } catch (err) {
//       console.error("togglePause failed", err);
//     }
//   }

//   const filterSearch = (arr) => {
//     if (!searchText) return arr;
//     const t = searchText.toLowerCase();
//     return arr.filter((i) => (i.title || "").toLowerCase().includes(t));
//   };

//   const sortArr = (arr) => {
//     if (sortOption === "paused") return arr.filter((i) => i.paused);

//     if (sortOption === "oldest")
//       return [...arr].sort(
//         (a, b) =>
//           (a.createdAt?.seconds || a.created_at?.seconds || 0) -
//           (b.createdAt?.seconds || b.created_at?.seconds || 0)
//       );

//     return [...arr].sort(
//       (a, b) =>
//         (b.createdAt?.seconds || b.created_at?.seconds || 0) -
//         (a.createdAt?.seconds || a.created_at?.seconds || 0)
//     );
//   };

//   const finalServices = sortArr(filterSearch(services));
//   const final24 = sortArr(filterSearch(jobs24));

//   const renderEmptyState = (btnText, onClick) => (
//     <div style={pageStyles.emptyWrap}>
//       <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{btnText === "Create Service" ? "No services yet" : "No 24h services yet"}</div>
//       <div style={{ color: "#666", marginBottom: 12, textAlign: "center", maxWidth: 600 }}>
//         Add your service to show in Posted Jobs. Clients can view and hire you.
//       </div>
//       <button
//         onClick={onClick}
//         style={{
//           height: 44,
//           padding: "0 22px",
//           borderRadius: 30,
//           backgroundColor: "rgba(253,253,150,1)",
//           border: "none",
//           color: "#000",
//           cursor: "pointer",
//           fontWeight: 600,
//         }}
//       >
//         {btnText}
//       </button>
//     </div>
//   );

//   // ------------------ WorkCard & Card24 components (inline) ------------------
//   const WorkCard = (job) => {
//     const initials = getInitials(job.title);

//     return (
//       <div
//         key={job.id}
//         style={pageStyles.card}
//         onClick={() =>
//           navigate(`/serviceDetailsModel/${job.id}`, { state: { job } })
//         }
//       >
//         {/* right arrow icon placeholder (you had an image in Card.jsx) */}
//         <div style={{ position: "absolute", top: 18, right: 18, width: 16, height: 16 }} />

//         <div style={{ display: "flex" }}>
//           <div
//             style={{
//               ...pageStyles.avatarBox,
//               width: 56,
//               height: 60,
//               fontSize: 20,
//               marginLeft: "1px",
//               paddingLeft: "1px",
//               textAlign: "center",
//             }}
//           >
//             {initials}
//           </div>

//           <div style={{ flex: 1, marginLeft: 27 }}>
//             <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 16, textTransform: "uppercase" }}>
//               {job.title}
//             </div>

//             <div className="skill-scroll">
//               {(job.skills || [])
//                 .slice(0, window.innerWidth >= 769 ? 3 : job.skills.length)
//                 .map((s, i) => (
//                   <div key={i} style={pageStyles.skillChip}>
//                     {s}
//                   </div>
//                 ))}

//               {/* +X only on desktop */}
//               {window.innerWidth >= 769 &&
//                 job.skills &&
//                 job.skills.length > 3 && (
//                   <div style={pageStyles.moreChip}>
//                     +{job.skills.length - 3}
//                   </div>
//                 )}
//             </div>

//           </div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
//           <div>
//             <div style={pageStyles.label}>Budget</div>
//             <div style={{ ...pageStyles.value, ...pageStyles.valueHighlight }}>
//               ₹{formatBudget(job.budget_from || job.budget_to)}
//             </div>
//           </div>

//           <div>
//             <div style={pageStyles.label}>Timeline</div>
//             <div style={pageStyles.value}>{job.deliveryDuration || "N/A"}</div>
//           </div>

//           <div>
//             <div style={pageStyles.label}>Location</div>
//             <div style={pageStyles.value}>{job.location || "Remote"}</div>
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
//           <button
//             style={{
//               flex: 1,
//               height: 40,
//               borderRadius: 30,
//               border: "1px solid #BDBDBD",
//               backgroundColor: "#FFFFFF",
//               fontSize: 13,
//               fontWeight: 600,
//             }}
//             onClick={(e) => togglePause(job, "services", e)}
//           >
//             {job.paused ? "Unpause" : "Pause Service"}
//           </button>

//           <button
//             style={{
//               flex: 1,
//               height: 40,
//               borderRadius: 30,
//               border: "none",
//               backgroundColor: "rgba(253,253,150,1)",
//               fontWeight: 700,
//             }}
//             onClick={(e) => {
//               e.stopPropagation();
              
//               navigate(`/freelance-dashboard/freelanceredit-service/${job.id}`, {
//                 state: { jobId: job.id, jobData: job },
//               });
//             }}
//           >
//             Edit Service
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const Card24 = (job) => {
//     const initials = getInitials(job.title);

//     return (
//       <div
//         key={job.id}
//         style={pageStyles.card}
//         onClick={() => navigate(`/service-24h/${job.id}`, { state: { job } })}
//       >
//         <div style={{ position: "absolute", top: 18, right: 18, width: 16, height: 16 }} />

//         <div style={{ display: "flex" }}>
//           <div
//             style={{
//               ...pageStyles.avatarBox,
//               width: 60,
//               height: 60,
//               fontSize: 22,
//             }}
//           >
//             {initials}
//           </div>

//           <div style={{ flex: 1, marginLeft: 12 }}>
//             <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 16 }}>{job.title}</div>

//             <div
//               style={{
//                 marginTop: 4,
//                 display: "flex",
//                 gap: 8,
//                 overflowX: "auto",
//                 whiteSpace: "nowrap",
//                 WebkitOverflowScrolling: "touch",

//                 /* hide scrollbar */
//                 scrollbarWidth: "none",
//                 msOverflowStyle: "none",
//               }}
//               className="skill-scroll"
//             >
//               {job.skills?.slice(0, 2).map((s, i) => (
//                 <div key={i} style={pageStyles.skillChip}>
//                   {s}
//                 </div>
//               ))}
//               {job.skills?.length > 2 && (
//                 <div style={pageStyles.moreChip}>+{job.skills.length - 2}</div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
//           <div>
//             <div style={pageStyles.label}>Budget</div>
//             <div style={{ ...pageStyles.value, ...pageStyles.valueHighlight }}>
//               ₹{formatBudget(job.budget_from || job.budget)}
//             </div>
//           </div>

//           <div>
//             <div style={pageStyles.label}>Timeline</div>
//             <div style={pageStyles.value}>{job.deliveryDuration || "N/A"}</div>
//           </div>

//           <div>
//             <div style={pageStyles.label}>Location</div>
//             <div style={pageStyles.value}>{job.location || "Remote"}</div>
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
//           <button
//             style={{
//               flex: 1,
//               height: 40,
//               borderRadius: 30,
//               border: "1px solid #BDBDBD",
//               backgroundColor: "#FFFFFF",
//               fontSize: 13,
//               fontWeight: 600,
//             }}
//             onClick={(e) => togglePause(job, "service_24h", e)}
//           >
//             {job.paused ? "Unpause" : "Pause Service"}
//           </button>

//           <button
//             style={{
//               flex: 1,
//               height: 40,
//               borderRadius: 30,
//               border: "none",
//               backgroundColor: "rgba(253,253,150,1)",
//               fontWeight: 700,
//             }}
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/service-24h-edit/${job.id}`, { state: { job } });
//             }}
//           >
//             Edit Service
//           </button>
//         </div>
//       </div>
//     );
//   };

//   <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Posted Jobs</Typography>

//   const renderPostedJobsPanel = () => {
//     const isMobile = window.innerWidth <= 768;

//     return (
//       <Box sx={{ mt: 4 }}>
//         <div >
//           <p style={{ marginLeft: isMobile ? "80%" : "90%", opacity: "70%", fontSize: 14, fontWeight: 400, cursor: "pointer" }} onClick={() => navigate("/freelance-dashboard/myjobs")}>View All</p>
//         </div>
//         <Box style={pageStyles.jobsContainer}>
//           {/* HEADER ROW */}
//           <Typography sx={{ fontSize: 24, fontWeight: 400, marginBottom: "15px" }}>
//             Posted Jobs
//           </Typography>
//           <Box
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: isMobile ? "flex-start" : "center",
//               flexDirection: isMobile ? "column" : "row",
//               gap: isMobile ? 12 : 0,

//             }}
//           >


//             <Box sx={{ width: "100%", overflow: "visible", mb: 2 }}>
//               <div style={pageStyles.toggleBarWrapper}>
//                 <div style={pageStyles.toggleGroup}>
//                   <div
//                     onClick={() => setSelectedJobsTab("Works")}
//                     style={pageStyles.toggleButton(selectedJobsTab === "Works")}
//                   >
//                     Works
//                   </div>

//                   <div
//                     onClick={() => setSelectedJobsTab("24 Hours")}
//                     style={pageStyles.toggleButton(selectedJobsTab === "24 Hours")}
//                   >
//                     24 Hours
//                   </div>
//                 </div>
//               </div>
//             </Box>

//           </Box>

//           {/* SEARCH + SORT */}
//           <Box
//             style={{
//               ...pageStyles.searchSortRow,
//               flexDirection: isMobile ? "column" : "row",
//               gap: isMobile ? 12 : 16,
//               alignItems: isMobile ? "stretch" : "center",
//             }}
//           >
//             <div
//               style={{
//                 ...pageStyles.searchContainer,
//                 marginTop: 8,
//                 width: "100%",
//               }}
//             >
//               <input
//                 style={{
//                   border: "none",
//                   outline: "none",
//                   flex: 1,
//                   fontSize: 14,



//                 }}
//                 placeholder="Search services"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//               />
//             </div>

//             <div style={{ minWidth: isMobile ? "100%" : 120 }}>
//               <select
//                 value={sortOption}
//                 onChange={(e) => setSortOption(e.target.value)}
//                 style={{
//                   width: "100%",
//                   height: 40,
//                   borderRadius: 12,
//                   border: "1px solid #E0E0E0",
//                   paddingLeft: 10,
//                   marginTop: "10px",
//                 }}
//               >
//                 <option value="newest">Newest</option>
//                 <option value="oldest">Oldest</option>
//                 <option value="paused">Paused</option>
//               </select>
//             </div>
//           </Box>

//           {/* CARDS */}
//           <div
//             style={{
//               ...pageStyles.cardsWrap,

//               /* ❌ center panna vendam */
//               justifyContent: "flex-start",

//               /* ✅ mobile la single column but card width same */
//               display: "grid",
//               gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",

//               gap: 20,
//               width: "100%",
//             }}
//           >
//             {selectedJobsTab === "Works" ? (
//               servicesLoading ? (
//                 <div style={{ marginTop: 40 }}>Loading...</div>
//               ) : finalServices.length === 0 ? (
//                 renderEmptyState("Create Service", () =>
//                   navigate("/freelance-dashboard/add-service-form")
//                 )
//               ) : (
//                 <>
//                   {(showAll ? finalServices : finalServices.slice(0, 2)).map((s) =>
//                     WorkCard(s)
//                   )}
//                 </>
//               )
//             ) : jobs24Loading ? (
//               <div style={{ marginTop: 40 }}>Loading...</div>
//             ) : final24.length === 0 ? (
//               renderEmptyState("Create 24h Service", () =>
//                 navigate("/freelance-dashboard/add-service-form")
//               )
//             ) : (
//               <>
//                 {(showAll ? final24 : final24.slice(0, 2)).map((j) =>
//                   Card24(j)
//                 )}
//               </>
//             )}
//           </div>

//         </Box>
//       </Box>
//     );
//   };


//   // ------------------ JSX return ------------------
//   return (
//     <Box
//       sx={{
//         ...pageStyles.pageWrapper,

//         marginLeft: isMobile
//           ? "10px"          // 👈 mobile left gap
//           : collapsed
//             ? "30px"
//             : "140px",

//         marginRight: isMobile ? "10px" : "0px", // 👈 mobile right also neat
//         width: isMobile ? "95%" : "80%",        // 👈 mobile full width
//         transition: "all 0.25s ease",
//       }}
//     >
//       <Box sx={pageStyles.content}>

//         <Box
//           sx={{
//             background: "linear-gradient(90deg, #f8ffb0, #e3ffd9)",
//             borderRadius: 3,
//             p: 4,
//             mb: 6,
//             display: "flex",
//             alignItems: "center",
//             gap: 3,
//             position: "relative",
//             border: "1px solid #c9c5c5",

//           }}
//         >
//           <img
//             src={profileData.profileImage || "/user-placeholder.jpg"}
//             alt="profile"
//             style={{
//               width: 95,
//               height: 95,
//               borderRadius: "50%",
//               border: "4px solid white",
//               objectFit: "cover",

//             }}
//           />
//           {/* <img src={editimg} width={50} style={{ cursor: "pointer", marginLeft: "-55px", paddingTop: "10px", marginTop: "50px" }} /> */}

//           <Box>
//             <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
//               {profileData.first_name} {profileData.last_name}
//             </Typography>
//             <Typography sx={{ color: "gray", fontSize: 15 }}>{profileData.location}</Typography>
//             <Typography
//               sx={{
//                 mt: 1,
//                 display: "inline-block",
//                 bgcolor: "#7C3CFF",
//                 color: "#fff",
//                 px: 2,
//                 py: 0.5,
//                 borderRadius: 1,
//                 fontWeight: 400,
//                 fontSize: 14,
//               }}
//             >{profileData.professional_title}


//               {profileData.title}
//             </Typography>
//           </Box>

//           {/* <Button
//             variant="contained"
//             sx={{ position: "absolute", right: 20, top: 20, borderRadius: 4, textTransform: "none" }}
//           >
//             Edit Profile
//           </Button> */}
//         </Box>

//         {/* MAIN ROW */}
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "flex-start", mb: 4 }}>
//           {/* ABOUT CARD */}
//           <Box
//             sx={{
//               background: "#fff",
//               borderRadius: "14px",
//               p: 3,
//               flex: "2 1 600px",
//               minWidth: 300,
//               // boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
//               position: "relative",
//               border: "1px solid #c9c5c5",

//             }}
//           >
//             <Typography sx={{ fontSize: 24, fontWeight: 400, mb: 1, }}>About</Typography>
//             <IconButton
//               sx={{ position: "absolute", right: 12, top: 12 }}
//               onClick={startEditAbout}
//               aria-label="edit about"
//             >
//               <FiEdit2 />
//             </IconButton>

//             <Box
//               sx={{
//                 height: 165,
//                 maxHeight: 165,            // 👈 adjust height as needed
//                 overflowY: "auto",
//                 pr: 1,                     // space so text doesn’t touch scrollbar
//               }}
//             >
//               <Typography sx={{ color: "#444", lineHeight: 1.6 }}>
//                 {profileData.about ||
//                   "Add a short description about yourself to let people know what you do."}
//               </Typography>
//             </Box>


//             {editingAbout && (
//               <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={5}
//                   value={tempAbout}
//                   onChange={(e) => setTempAbout(e.target.value)}
//                   placeholder="Write about yourself..."
//                 />
//                 <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//                   <Button variant="contained" onClick={saveEditAbout}>
//                     Save
//                   </Button>
//                   <Button variant="outlined" onClick={cancelEditAbout}>
//                     Cancel
//                   </Button>
//                 </Box>
//               </Box>
//             )}
//           </Box>

//           {/* SKILLS & TOOLS */}
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: "1 1 320px", minWidth: 300 }}>
//             <Box sx={{
//               border: "1px solid #c9c5c5",
//               background: "#fff", borderRadius: "14px", p: 2.5, border: "1px solid #BDBDBD", position: "relative"
//             }}>
//               <Typography sx={{ fontSize: 24, fontWeight: 400, }}>Skills & Tools</Typography>

//               <IconButton
//                 sx={{ position: "absolute", right: 12, top: 12 }}
//                 onClick={startEditSkillsTools}
//                 aria-label="edit skills and tools"
//               >
//                 <FiEdit2 />
//               </IconButton>

//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//                 <Box>
//                   <Typography sx={{ fontWeight: 400, fontSize: 18 }}>Skills</Typography>
//                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
//                     {Array.isArray(profileData.skills) && profileData.skills.length ? (
//                       profileData.skills.map((s) => (
//                         <Box key={s} sx={{ px: 1.5, py: 0.6, borderRadius: "12px", background: "#FFF8D9", fontWeight: 700, fontSize: 13, border: "1px solid rgba(0,0,0,0.06)" }}>
//                           {s}
//                         </Box>
//                       ))
//                     ) : (
//                       <Typography color="gray">No skills added</Typography>
//                     )}
//                   </Box>
//                 </Box>

//                 <Box>
//                   <Typography sx={{ fontWeight: 400, fontSize: 18 }}>Tools</Typography>
//                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
//                     {Array.isArray(profileData.tools) && profileData.tools.length ? (
//                       profileData.tools.map((t) => (
//                         <Box key={t} sx={{ px: 1.5, py: 0.6, borderRadius: "12px", background: "#E8F8FF", fontWeight: 700, fontSize: 13, border: "1px solid rgba(0,0,0,0.06)" }}>
//                           {t}
//                         </Box>
//                       ))
//                     ) : (
//                       <Typography color="gray">No tools added</Typography>
//                     )}
//                   </Box>
//                 </Box>
//               </Box>

//               {editingSkillsTools && (
//                 <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
//                   <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>Edit Skills</Typography>
//                   <Autocomplete
//                     multiple
//                     freeSolo
//                     options={skillOptions}
//                     value={tempSkills}
//                     onChange={(e, v) => setTempSkills(v)}
//                     renderInput={(params) => <TextField {...params} placeholder="Add skills (press Enter)" />}
//                   />

//                   <Typography sx={{ fontSize: 13, fontWeight: 600, mt: 2, mb: 1 }}>Edit Tools</Typography>
//                   <Autocomplete
//                     multiple
//                     freeSolo
//                     options={toolOptions}
//                     value={tempTools}
//                     onChange={(e, v) => setTempTools(v)}
//                     renderInput={(params) => <TextField {...params} placeholder="Add tools (press Enter)" />}
//                   />

//                   <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
//                     <Button variant="contained" onClick={saveEditSkillsTools}>Save</Button>
//                     <Button variant="outlined" onClick={cancelEditSkillsTools}>Cancel</Button>
//                   </Box>
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         </Box>

//         {/* PORTFOLIO SECTION */}
//         <Box sx={{
//           bgcolor: "#fff", borderRadius: 3, p: 3, border: "1px solid #c9c5c5",
//           // boxShadow: "0 8px 20px rgba(12,20,31,0.04)"
//           border: "1px solid #BDBDBD",
//         }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//             <Typography sx={{ fontSize: 24, fontWeight: 400, }}>Portfolio</Typography>
//             <Button variant="contained" size="small" sx={{ borderRadius: 4, textTransform: "none" }} onClick={() => setIsPortfolioPopupOpen(true)}>
//               Add Portfolio
//             </Button>
//           </Box>

//           <Box sx={{ display: "flex", gap: 2, overflowX: "auto", overflowY: "hidden", pb: 2, pl: 0, width: "100%", maxWidth: "100%", '&::-webkit-scrollbar': { height: 8 }, '&::-webkit-scrollbar-thumb': { background: "#ddd", borderRadius: 10 }, cursor: "pointer" }}>
//             {portfolio.map((p) => (
//               <Box
//                 key={p.id}
//                 sx={{
//                   width: 300,
//                   flexShrink: 0,
//                   bgcolor: "#00c2e8",
//                   borderRadius: 2,
//                   p: 0,
//                   // boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
//                   border: "1px solid #BDBDBD",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   overflow: "hidden",
//                   position: "relative",
//                   mr: 1.5,
//                 }}
//                 onClick={() => LaunchURL(p.projectUrl)}
//               >
//                 <Box sx={{ height: 140, bgcolor: "#00b7db" }}>
//                   <img src={company} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                 </Box>

//                 <Box sx={{ bgcolor: "#fff", p: 2, height: "100%", position: "relative" }}>
//                   <Box sx={{ position: "absolute", right: 8, top: 8, display: "flex", gap: 1 }}>
//                     <IconButton size="small" onClick={(e) => handleOpenEdit(p, e)} aria-label="edit portfolio"><FiEdit2 /></IconButton>
//                     <IconButton size="small" onClick={(e) => handleDelete(p, e)} aria-label="delete portfolio"><FiTrash2 color="#e53935" /></IconButton>
//                   </Box>

//                   <Typography sx={{ fontWeight: 700 }}>{p.title}</Typography>
//                   <Typography sx={{ fontSize: 13, color: "#555", mt: 1 }}>{p.description}</Typography>

//                   <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
//                     {(p.skills || []).map((s) => (
//                       <Box key={s} sx={{ px: 1, py: 0.5, bgcolor: "#FFF8D9", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{s}</Box>
//                     ))}
//                     {(p.tools || []).map((t) => (
//                       <Box key={t} sx={{ px: 1, py: 0.5, bgcolor: "#E8F8FF", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{t}</Box>
//                     ))}
//                   </Box>
//                 </Box>
//               </Box>
//             ))}
//           </Box>
//         </Box>

//         {/* AddPortfolioPopup (external component you already have) */}
//         <AddPortfolioPopup open={isPortfolioPopupOpen} onClose={() => setIsPortfolioPopupOpen(false)} portfolio={null} />

//         {/* EditPortfolioPopup */}
//         {isEditOpen && editingPortfolio && (
//           <EditPortfolioPopup
//             open={isEditOpen}
//             onClose={() => {
//               setIsEditOpen(false);
//               setEditingPortfolio(null);
//             }}
//             portfolio={editingPortfolio}
//             onSave={handleSaveEdit}
//           />
//         )}

//         {/* POSTED JOBS (Works | 24 Hours) */}
//         {renderPostedJobsPanel()}

//         {/* FAB (create service) */}
//         <button style={pageStyles.fab} onClick={() => navigate("/freelance-dashboard/add-service-form")}>+</button>
//       </Box>
//     </Box>
//   );
// }

// // --------------------------- EditPortfolioPopup (same as your file) ---------------------------
// function EditPortfolioPopup({ open, onClose, portfolio, onSave }) {
//   const [title, setTitle] = useState(portfolio?.title || "");
//   const [description, setDescription] = useState(portfolio?.description || "");
//   const [projectUrl, setProjectUrl] = useState(portfolio?.projectUrl || "");
//   const [imageUrl, setImageUrl] = useState(portfolio?.imageUrl || "");
//   const [skillsText, setSkillsText] = useState((portfolio?.skills || []).join(", "));
//   const [toolsText, setToolsText] = useState((portfolio?.tools || []).join(", "));

//   useEffect(() => {
//     // keep in sync when portfolio changes (e.g., open new item)
//     setTitle(portfolio?.title || "");
//     setDescription(portfolio?.description || "");
//     setProjectUrl(portfolio?.projectUrl || "");
//     setImageUrl(portfolio?.imageUrl || "");
//     setSkillsText((portfolio?.skills || []).join(", "));
//     setToolsText((portfolio?.tools || []).join(", "));
//   }, [portfolio]);

//   const handleSave = () => {
//     const skills = skillsText
//       .split(",")
//       .map((s) => s.trim())
//       .filter(Boolean);
//     const tools = toolsText
//       .split(",")
//       .map((t) => t.trim())
//       .filter(Boolean);

//     const updated = {
//       id: portfolio.id,
//       title: title.trim(),
//       description: description.trim(),
//       projectUrl: projectUrl.trim(),
//       imageUrl: imageUrl.trim(),
//       skills,
//       tools,
//     };

//     onSave(updated);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: "#ffffff", borderRadius: "20px", p: 1, border: "1px solid #BDBDBD", } }}>
//       <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>Edit Portfolio</DialogTitle>
//       <DialogContent>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//           <TextField label="Project Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
//           <TextField label="Project description" fullWidth multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project briefly" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
//           <TextField label="Project url" fullWidth value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="https://" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
//           <TextField label="Skills (comma separated)" fullWidth value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="React, Node, Figma" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
//           <TextField label="Tools (comma separated)" fullWidth value={toolsText} onChange={(e) => setToolsText(e.target.value)} placeholder="VSCode, Git" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 2 }}>
//         <Button variant="outlined" onClick={onClose} sx={{ borderColor: "rgba(124, 60, 255, 1)", borderRadius: "10px", color: "rgba(124, 60, 255, 1)", border: "2px solid #7C3CFF", textTransform: "none", width: "120px" }}>
//           Cancel
//         </Button>
//         <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "rgba(124, 60, 255, 1)", borderRadius: "10px", color: "white", textTransform: "none", width: "120px" }}>
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );



// }



// BuildProfileScreenWithEdit.jsx
import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import "./profilebuild.css";
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import editimg from "../assets/edit.png";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import AddPortfolioPopup from "../Firebaseaddporfoilo/AddPortfolioPopup.jsx";
import { Pencil } from "lucide-react";
import company from "../assets/comany.jpg"

// -----------------------------------------------------------------------------
// Single file contains:
// - BuildProfileScreen (main)
// - EditPortfolioPopup (modal)
// - Sidebar helper + Posted Jobs cards (Works & 24 Hours) — built-in
// -----------------------------------------------------------------------------

// ----------------- SIDEBAR SUPPORT (copied from your Card.jsx) -----------------
const useSidebar = () => {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }

    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  return collapsed;
};

const isMobile = window.innerWidth <= 768;
// ---------------------------- STYLES (in-file) ----------------------------
const pageStyles = {
  pageWrapper: {
    width: "80%",
    minHeight: "100vh",
    // background: "#F5F6FA",
    marginTop: '60px',
    paddingBottom: 80,
    boxSizing: "border-box",

  },
  content: {

    maxWidth: 1120,
    margin: "0 auto",
    padding: "24px 16px",
    boxSizing: "border-box",
  },

  // Posted Jobs styles (adapted from Card.jsx)
  jobsContainer: {
    marginTop: 28,
    background: "#fff",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
    border: "1px solid #c9c5c5",
  },

  toggleBarWrapper: {
    width: "100%",
    minHeight: 52,
    borderRadius: 16,
    padding: "6px 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // 👈 LEFT aligned
    backgroundColor: "#FFF8E1",
    boxShadow: "0 2px 8px rgba(16,24,40,0.04)",

  },
  toggleGroup: {
    display: "flex",
    gap: 6,
    borderRadius: 14,
    alignItems: "center",
  },

  toggleButton: (active) => ({
    width: 180,
    height: 36,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: active ? "#FFFFFF" : "transparent",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: active ? "0 4px 10px rgba(124,60,255,0.06)" : "none",
  }),

  searchSortRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 16,
  },

  searchContainer: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    border: "1px solid #DADADA",
    paddingLeft: 14,
    paddingRight: 14,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingTop: "15px",
  },

  cardsWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
    gap: 24,
    marginTop: 20,
  },

  card: {
    width: "100%",
    minHeight: 220,
    borderRadius: 24,
    border: "0.8px solid #DADADA",
    backgroundColor: "#FFFFFF",
    padding: 20,
    boxShadow: "0 8px 20px rgba(16,24,40,0.04)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },

  avatarBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    background:
      "linear-gradient(135deg, #51A2FF, #9B42FF 60%, #AD46FF)",
    color: "#FFF",
    fontWeight: 700,
  },

  skillChip: {
    padding: "4px 12px",
    borderRadius: 20,
    border: "1px solid rgba(255,255,190,1)",
    backgroundColor: "rgba(255,255,190,1)",
    fontSize: 14,
    whiteSpace: "nowrap",
    flexShrink: 0, // 👈 VERY IMPORTANT
    marginLeft: "2px",
  },


  moreChip: {
    padding: "4px 25px",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,190,1)",
    fontSize: 11,
  },

  // small helpers
  label: { fontSize: 15 },
  value: { marginTop: 4, fontSize: 13, fontWeight: 500 },
  valueHighlight: { color: "rgba(124,60,255,1)" },

  emptyWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 40,
    gridColumn: "1 / -1",
  },

  fab: {
    position: "fixed",
    right: 32,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: "50%",
    backgroundColor: "rgba(124,60,255,1)",
    color: "#FFF",
    fontSize: 32,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(124,60,255,0.4)",
  },
};

// ---------------------------- helpers ----------------------------
function formatBudget(val) {
  if (!val) return 0;
  const num = Number(val);
  if (num >= 100000) return (num / 100000).toFixed(1) + "L";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
}

function getInitials(title) {
  if (!title) return "";
  const w = title.trim().split(" ");
  if (w.length > 1) return (w[0][0] + w[1][0]).toUpperCase();
  return w[0][0].toUpperCase();
}

// ---------------------------- MAIN COMPONENT ----------------------------
export default function BuildProfileScreenWithEdit() {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const collapsed = useSidebar();

  // Profile state
  const [user, setUser] = useState(null);

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    title: "",
    about: "",
    skills: [],
    tools: [],
    profileImage: "",
    location: "",

  });

  console.log(profileData.professional_title)
  // Portfolio
  const [portfolio, setPortfolio] = useState([]);
  const [isPortfolioPopupOpen, setIsPortfolioPopupOpen] = useState(false);

  // Inline edit states
  const [editingAbout, setEditingAbout] = useState(false);
  const [editingSkillsTools, setEditingSkillsTools] = useState(false);
  const [tempAbout, setTempAbout] = useState("");
  const [tempSkills, setTempSkills] = useState([]);
  const [tempTools, setTempTools] = useState([]);
  
    const skillOptions = [
    // Graphics & Design
    "Logo Design",
    "Brand Style Guides",
    "Business Cards & Stationery",
    "Illustration",
    "Pattern Design",
    "Website Design",
    "App Design",
    "UX Design",
    "Game Art",
    "NFTs & Collectibles",
    "Industrial & Product Design",
    "Architecture & Interior Design",
    "Landscape Design",
    "Fashion Design",
    "Jewelry Design",
    "Presentation Design",
    "Infographic Design",
    "Vector Tracing",
    "Car Wraps",
    "Image Editing",
    "Photoshop Editing",
    "T-Shirts & Merchandise",
    "Packaging Design",
    "Book Design",
    "Album Cover Design",
    "Podcast Cover Art",
    "Menu Design",
    "Invitation Design",
    "Brochure Design",
    "Poster Design",
    "Signage Design",
    "Flyer Design",
    "Social Media Design",
    "Print Design",

    // Programming & Tech
    "Website Development",
    "Website Builders & CMS",
    "Web Programming",
    "E-Commerce Development",
    "Game Development",
    "Mobile Apps (iOS & Android)",
    "Desktop Applications",
    "Chatbots",
    "QA & Review",
    "User Testing",
    "Support & IT",
    "Data Analysis & Reports",
    "Convert Files",
    "Databases",
    "Cybersecurity & Data Protection",
    "Cloud Computing",
    "DevOps",
    "AI Development",
    "Machine Learning Models",
    "Blockchain & NFTs",
    "Scripts & Automation",
    "Software Customization",

    // Digital Marketing
    "Social Media Marketing",
    "SEO",
    "Content Marketing",
    "Video Marketing",
    "Email Marketing",
    "SEM (Search Engine Marketing)",
    "Influencer Marketing",
    "Local SEO",
    "Affiliate Marketing",
    "Mobile Marketing & Advertising",
    "Display Advertising",
    "E-Commerce Marketing",
    "Text Message Marketing",
    "Crowdfunding",
    "Web Analytics",
    "Domain Research",
    "Music Promotion",
    "Book & eBook Marketing",
    "Podcast Marketing",
    "Community Management",
    "Marketing Consulting",

    // Writing & Translation
    "Articles & Blog Posts",
    "Proofreading & Editing",
    "Translation",
    "Website Content",
    "Technical Writing",
    "Copywriting",
    "Brand Voice & Tone",
    "Resume Writing",
    "Cover Letters",
    "LinkedIn Profiles",
    "Press Releases",
    "Product Descriptions",
    "Case Studies",
    "White Papers",
    "Scriptwriting",
    "Speechwriting",
    "Creative Writing",
    "Book Editing",
    "Beta Reading",
    "Grant Writing",
    "UX Writing",
    "Email Copy",
    "Business Names & Slogans",
    "Transcription",
    "Legal Writing",

    // Video & Animation
    "Whiteboard & Animated Explainers",
    "Video Editing",
    "Short Video Ads",
    "Logo Animation",
    "Character Animation",
    "2D/3D Animation",
    "Intros & Outros",
    "Lyric & Music Videos",
    "Visual Effects",
    "Spokesperson Videos",
    "App & Website Previews",
    "Product Photography & Demos",
    "Subtitles & Captions",
    "Live Action Explainers",
    "Unboxing Videos",
    "Slideshow Videos",
    "Animation for Kids",
    "Trailers & Teasers",

    // Music & Audio
    "Voice Over",
    "Mixing & Mastering",
    "Producers & Composers",
    "Singers & Vocalists",
    "Session Musicians",
    "Songwriters",
    "Audiobook Production",
    "Sound Design",
    "Audio Editing",
    "Jingles & Intros",
    "Podcast Editing",
    "Music Transcription",
    "Dialogue Editing",
    "DJ Drops & Tags",

    // AI Services (sample)
    "AI Artists",
    "AI Applications",
    "AI Video Generators",
    "AI Music Generation",
    "AI Chatbot Development",
    "AI Website Builders",
    "Custom GPT & LLMs",
    "AI Training Data Preparation",
    "Text-to-Speech / Voice Cloning",
    "Prompt Engineering",

    // Data (sample)
    "Data Entry",
    "Data Mining & Scraping",
    "Database Design",
    "Data Visualization",
    "Dashboards",
    "Excel / Google Sheets",
    "Statistical Analysis",
    "Data Engineering",
    "Data Cleaning",

    // Business / Finance / Consulting / Lifestyle (sample)
    "Business Plans",
    "Market Research",
    "Branding Services",
    "Financial Consulting",
    "Career Counseling",
    "Project Management",
    "Supply Chain Management",
    "HR Consulting",
    "E-Commerce Management",
    "Business Consulting",
    "Presentations",
    "Virtual Assistant",
    "Accounting & Bookkeeping",
    "Financial Forecasting",
    "Financial Modeling",
    "Tax Consulting",
    "Crypto & NFT Consulting",
    "Business Valuation",
    "Pitch Decks",
    "Product Photography",
    "Real Estate Photography",
    "Portraits",
    "Image Retouching",
    "Food Photography",
    "Drone Photography",
    "Lifestyle Photography",
    "AI Image Enhancement",
    "Gaming",
    "Astrology & Psychics",
    "Online Tutoring",
    "Arts & Crafts",
    "Fitness Lessons",
    "Nutrition",
    "Relationship Advice",
    "Personal Styling",
    "Cooking Lessons",
    "Life Coaching",
    "Travel Advice",
    "Wellness & Meditation",
    "Language Lessons",
    "Management Consulting",
    "Business Strategy",
    "HR & Leadership",
    "Financial Advisory",
    "Technology Consulting",
    "Cybersecurity Consulting",
    "Productivity Coaching",
    "Study Skills",
    "Language Learning",
    "Public Speaking",
    "Career Mentoring",
    "Mindfulness & Meditation",
    "Confidence Coaching",
  ];
  const toolOptions = [
    // Design tools
    "Adobe Illustrator",
    "CorelDRAW",
    "Affinity Designer",
    "Canva",
    "Figma",
    "Gravit Designer",
    "Inkscape",
    "Adobe InDesign",
    "Notion",
    "Milanote",
    "Frontify",
    "VistaCreate",
    "Procreate",
    "Clip Studio Paint",
    "Corel Painter",
    "Krita",
    "Repper",
    "Patterninja",
    "Adobe XD",
    "Sketch",
    "Webflow",
    "Framer",
    "InVision Studio",
    "ProtoPie",
    "Marvel",
    "Miro",
    "Balsamiq",
    "Axure RP",
    "Lucidchart",
    "Adobe Photoshop",
    "Blender",
    "ZBrush",
    "Substance Painter",
    "Unity",
    "Unreal Engine",
    "NFT Art Generator",
    "SolidWorks",
    "Autodesk Fusion 360",
    "Rhino 3D",
    "KeyShot",
    "AutoCAD",
    "SketchUp",
    "Revit",
    "Lumion",
    "3ds Max",
    "CLO 3D",
    "Marvelous Designer",
    "TUKAcad",
    "RhinoGold",
    "MatrixGold",
    "PowerPoint",
    "Google Slides",
    "Prezi",
    "Keynote",
    "Piktochart",
    "Visme",
    "Venngage",
    "Vector Magic",
    "FlexiSIGN",
    "SAi Sign Design Software",
    "Easysign Studio",
    "Adobe Express",
    "Crello",
    "Buffer Pablo",
    "QuarkXPress",

    // Dev tools
    "Visual Studio Code",
    "Sublime Text",
    "Atom",
    "Git",
    "GitHub",
    "GitLab",
    "Node.js",
    "React",
    "Angular",
    "Vue.js",
    "HTML",
    "CSS",
    "JavaScript",
    "Bootstrap",
    "Tailwind CSS",
    "WordPress",
    "Elementor",
    "Divi",
    "Wix",
    "Squarespace",
    "Shopify",
    "Joomla",
    "Drupal",
    "IntelliJ IDEA",
    "PyCharm",
    "PHPStorm",
    "Django",
    "Flask",
    "Laravel",
    "ASP.NET Core",
    "Express.js",
    "WooCommerce",
    "Magento",
    "BigCommerce",
    "OpenCart",
    "PrestaShop",
    "Stripe",
    "PayPal",
    "Godot",
    "C#",
    "C++",
    "Android Studio",
    "Xcode",
    "Flutter",
    "React Native",
    "Kotlin",
    "Java",
    "Swift",
    "SwiftUI",
    "Firebase",
    "Expo",
    "Electron.js",
    "PyQt",
    "Tkinter",
    ".NET",
    "WPF",
    "JavaFX",
    "C++ with Qt",

    // Testing / QA
    "Selenium",
    "Postman",
    "JMeter",
    "Cypress",
    "TestRail",
    "Bugzilla",
    "Jira",
    "Appium",
    "Hotjar",
    "Maze",
    "UserTesting.com",
    "Lookback",
    "Zendesk",
    "Freshdesk",
    "Jira Service Management",
    "ServiceNow",
    "TeamViewer",
    "AnyDesk",
    "Microsoft Intune",

    // Data / ML
    "Python",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "R Studio",
    "Power BI",
    "Tableau",
    "Excel",
    "Google Sheets",
    "SQL",
    "Jupyter Notebook",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "SQLite",
    "Firebase Firestore",
    "Redis",
    "Microsoft SQL Server",
    "TensorFlow",
    "PyTorch",
    "OpenAI API",
    "Hugging Face Transformers",
    "LangChain",
    "Google Vertex AI",
    "Azure AI Studio",
    "Scikit-learn",
    "XGBoost",
    "LightGBM",

    // Cloud / DevOps
    "AWS",
    "Microsoft Azure",
    "Google Cloud Platform",
    "DigitalOcean",
    "Heroku",
    "IBM Cloud",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitHub Actions",
    "GitLab CI/CD",
    "Terraform",
    "Ansible",
    "Prometheus",
    "Grafana",

    // Automation / Scraping
    "Python Automation Scripts",
    "PowerShell",
    "Bash",
    "AutoHotkey",
    "Puppeteer",
    "Playwright",
    "Zapier",
    "Make",

    // AI / Content / Tools
    "ChatGPT",
    "Jasper",
    "SurferSEO",
    "Grammarly",
    "Hemingway Editor",
    "ProWritingAid",
    "LanguageTool",
    "QuillBot",
    "DeepL Translator",
    "Vyond",
    "Animaker",
    "Adobe After Effects",
    "Adobe Premiere Pro",
    "Final Cut Pro",
    "DaVinci Resolve",
    "CapCut",
    "Filmora",
    "Vegas Pro",
    "Audacity",
    "Adobe Audition",
    "GarageBand",
    "FL Studio",
    "Ableton Live",
    "Cubase",
    "Studio One",
    "Spotify for Artists",
    "SoundCloud",
    "DALL·E",
    "MidJourney",
    "Stable Diffusion",
    "Adobe Firefly",
    "Leonardo AI",
    "Runway ML",
    "Descript",
    "ElevenLabs",
    "Trello",
    "Asana",
    "ClickUp",
    "Slack",
    "Zoom",
    "Teams",
    "Xero",
    "Tally",
    "Notion",
  ];

  // Portfolio edit popup
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Posted Jobs (Works + 24 Hours)
  const [selectedJobsTab, setSelectedJobsTab] = useState("Works");
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [services, setServices] = useState([]);
  const [jobs24, setJobs24] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [jobs24Loading, setJobs24Loading] = useState(true);
  const [showAll, setShowAll] = useState(false);



  // ------------------ auth + profile + portfolio listeners ------------------
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    // fetch user profile once
    getDoc(userRef).then((snap) => {
      if (snap.exists()) {
        setProfileData((prev) => ({ ...prev, ...snap.data() }));
      }
    });

    // portfolio realtime
    const q = query(
      collection(db, "users", user.uid, "portfolio"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user, db]);

  // ------------------ services (Works) listener ------------------
  useEffect(() => {
    if (!user) return;
    setServicesLoading(true);

    const q = query(collection(db, "services"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setServices(arr);
      setServicesLoading(false);
    });

    return () => unsub();
  }, [user, db]);

  // ------------------ service_24h listener ------------------
  useEffect(() => {
    if (!user) return;
    setJobs24Loading(true);

    const q = query(collection(db, "service_24h"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr.sort(
        (a, b) =>
          (b.created_at?.seconds || b.createdAt?.seconds || 0) -
          (a.created_at?.seconds || a.createdAt?.seconds || 0)
      );
      setJobs24(arr);
      setJobs24Loading(false);
    });

    return () => unsub();
  }, [user, db]);

  // ------------------ updateField util ------------------
  const updateField = async (field, value) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { [field]: value }, { merge: true });
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // ------------------ LaunchURL ------------------
  const LaunchURL = (url) => url && window.open(url, "_blank");

  // ------------------ About handlers ------------------
  const startEditAbout = () => {
    setTempAbout(profileData.about || "");
    setEditingAbout(true);
    setEditingSkillsTools(false);
  };
  const cancelEditAbout = () => {
    setTempAbout("");
    setEditingAbout(false);
  };
  const saveEditAbout = async () => {
    await updateField("about", tempAbout);
    setTempAbout("");
    setEditingAbout(false);
  };

  // ------------------ Skills/Tools handlers ------------------
  const startEditSkillsTools = () => {
    setTempSkills(Array.isArray(profileData.skills) ? profileData.skills : []);
    setTempTools(Array.isArray(profileData.tools) ? profileData.tools : []);
    setEditingSkillsTools(true);
    setEditingAbout(false);
  };
  const cancelEditSkillsTools = () => {
    setTempSkills([]);
    setTempTools([]);
    setEditingSkillsTools(false);
  };
  const saveEditSkillsTools = async () => {
    await updateField("skills", tempSkills || []);
    await updateField("tools", tempTools || []);
    setTempSkills([]);
    setTempTools([]);
    setEditingSkillsTools(false);
  };

  // ------------------ Portfolio edit / delete ------------------
  const handleOpenEdit = (p, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setEditingPortfolio(p);
    setIsEditOpen(true);
  };

  const handleDelete = async (p, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      const ok = window.confirm("Delete this portfolio item? This cannot be undone.");
      if (!ok) return;
      await deleteDoc(doc(db, "users", user.uid, "portfolio", p.id));
      alert("Deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  const handleSaveEdit = async (updated) => {
    try {
      const ref = doc(db, "users", user.uid, "portfolio", updated.id);
      const toUpdate = { ...updated };
      delete toUpdate.id;
      await updateDoc(ref, toUpdate);
      setIsEditOpen(false);
      setEditingPortfolio(null);
      alert("Portfolio updated");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  // ------------------ Posted Jobs helpers ------------------
  async function togglePause(job, collectionName, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await updateDoc(doc(db, collectionName, job.id), {
        paused: !job.paused,
        pausedAt: !job.paused ? serverTimestamp() : null,
      });
    } catch (err) {
      console.error("togglePause failed", err);
    }
  }

  const filterSearch = (arr) => {
    if (!searchText) return arr;
    const t = searchText.toLowerCase();
    return arr.filter((i) => (i.title || "").toLowerCase().includes(t));
  };

  const sortArr = (arr) => {
    if (sortOption === "paused") return arr.filter((i) => i.paused);

    if (sortOption === "oldest")
      return [...arr].sort(
        (a, b) =>
          (a.createdAt?.seconds || a.created_at?.seconds || 0) -
          (b.createdAt?.seconds || b.created_at?.seconds || 0)
      );

    return [...arr].sort(
      (a, b) =>
        (b.createdAt?.seconds || b.created_at?.seconds || 0) -
        (a.createdAt?.seconds || a.created_at?.seconds || 0)
    );
  };

  const finalServices = sortArr(filterSearch(services));
  const final24 = sortArr(filterSearch(jobs24));

  const renderEmptyState = (btnText, onClick) => (
    <div style={pageStyles.emptyWrap}>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{btnText === "Create Service" ? "No services yet" : "No 24h services yet"}</div>
      <div style={{ color: "#666", marginBottom: 12, textAlign: "center", maxWidth: 600 }}>
        Add your service to show in Posted Jobs. Clients can view and hire you.
      </div>
      <button
        onClick={onClick}
        style={{
          height: 44,
          padding: "0 22px",
          borderRadius: 30,
          backgroundColor: "rgba(253,253,150,1)",
          border: "none",
          color: "#000",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {btnText}
      </button>
    </div>
  );

  // ------------------ WorkCard & Card24 components (inline) ------------------
  const WorkCard = (job) => {
    const initials = getInitials(job.title);

    return (
      <div
        key={job.id}
        style={pageStyles.card}
        onClick={() =>
          navigate(`/serviceDetailsModel/${job.id}`, { state: { job } })
        }
      >
        {/* right arrow icon placeholder (you had an image in Card.jsx) */}
        <div style={{ position: "absolute", top: 18, right: 18, width: 16, height: 16 }} />

        <div style={{ display: "flex" }}>
          <div
            style={{
              ...pageStyles.avatarBox,
              width: 56,
              height: 60,
              fontSize: 20,
              marginLeft: "1px",
              paddingLeft: "1px",
              textAlign: "center",
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1, marginLeft: 27 }}>
            <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 16, textTransform: "uppercase" }}>
              {job.title}
            </div>

            <div className="skill-scroll">
              {(job.skills || [])
                .slice(0, window.innerWidth >= 769 ? 3 : job.skills.length)
                .map((s, i) => (
                  <div key={i} style={pageStyles.skillChip}>
                    {s}
                  </div>
                ))}

              {/* +X only on desktop */}
              {window.innerWidth >= 769 &&
                job.skills &&
                job.skills.length > 3 && (
                  <div style={pageStyles.moreChip}>
                    +{job.skills.length - 3}
                  </div>
                )}
            </div>

          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <div>
            <div style={pageStyles.label}>Budget</div>
            <div style={{ ...pageStyles.value, ...pageStyles.valueHighlight }}>
              ₹{formatBudget(job.budget_from || job.budget_to)}
            </div>
          </div>

          <div>
            <div style={pageStyles.label}>Timeline</div>
            <div style={pageStyles.value}>{job.deliveryDuration || "N/A"}</div>
          </div>

          <div>
            <div style={pageStyles.label}>Location</div>
            <div style={pageStyles.value}>{job.location || "Remote"}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <button
            style={{
              flex: 1,
              height: 40,
              borderRadius: 30,
              border: "1px solid #BDBDBD",
              backgroundColor: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
            }}
            onClick={(e) => togglePause(job, "services", e)}
          >
            {job.paused ? "Unpause" : "Pause Service"}
          </button>

          <button
            style={{
              flex: 1,
              height: 40,
              borderRadius: 30,
              border: "none",
              backgroundColor: "rgba(253,253,150,1)",
              fontWeight: 700,
            }}
            onClick={(e) => {
              e.stopPropagation();
              
              navigate(`/freelance-dashboard/freelanceredit-service/${job.id}`, {
                state: { jobId: job.id, jobData: job },
              });
            }}
          >
            Edit Service
          </button>
        </div>
      </div>
    );
  };

  const Card24 = (job) => {
    const initials = getInitials(job.title);

    return (
      <div
        key={job.id}
        style={pageStyles.card}
        onClick={() => navigate(`/service-24h/${job.id}`, { state: { job } })}
      >
        <div style={{ position: "absolute", top: 18, right: 18, width: 16, height: 16 }} />

        <div style={{ display: "flex" }}>
          <div
            style={{
              ...pageStyles.avatarBox,
              width: 60,
              height: 60,
              fontSize: 22,
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1, marginLeft: 12 }}>
            <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 16 }}>{job.title}</div>

            <div
              style={{
                marginTop: 4,
                display: "flex",
                gap: 8,
                overflowX: "auto",
                whiteSpace: "nowrap",
                WebkitOverflowScrolling: "touch",

                /* hide scrollbar */
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="skill-scroll"
            >
              {job.skills?.slice(0, 2).map((s, i) => (
                <div key={i} style={pageStyles.skillChip}>
                  {s}
                </div>
              ))}
              {job.skills?.length > 2 && (
                <div style={pageStyles.moreChip}>+{job.skills.length - 2}</div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <div>
            <div style={pageStyles.label}>Budget</div>
            <div style={{ ...pageStyles.value, ...pageStyles.valueHighlight }}>
              ₹{formatBudget(job.budget_from || job.budget)}
            </div>
          </div>

          <div>
            <div style={pageStyles.label}>Timeline</div>
            <div style={pageStyles.value}>{job.deliveryDuration || "N/A"}</div>
          </div>

          <div>
            <div style={pageStyles.label}>Location</div>
            <div style={pageStyles.value}>{job.location || "Remote"}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <button
            style={{
              flex: 1,
              height: 40,
              borderRadius: 30,
              border: "1px solid #BDBDBD",
              backgroundColor: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
            }}
            onClick={(e) => togglePause(job, "service_24h", e)}
          >
            {job.paused ? "Unpause" : "Pause Service"}
          </button>

          <button
            style={{
              flex: 1,
              height: 40,
              borderRadius: 30,
              border: "none",
              backgroundColor: "rgba(253,253,150,1)",
              fontWeight: 700,
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/service-24h-edit/${job.id}`, { state: { job } });
            }}
          >
            Edit Service
          </button>
        </div>
      </div>
    );
  };

  <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Posted Jobs</Typography>

  const renderPostedJobsPanel = () => {
    const isMobile = window.innerWidth <= 768;

    return (
      <Box sx={{ mt: 4 }}>
        <div >
          <p style={{ marginLeft: isMobile ? "80%" : "90%", opacity: "70%", fontSize: 14, fontWeight: 400, cursor: "pointer" }} onClick={() => navigate("/freelance-dashboard/myjobs")}>View All</p>
        </div>
        <Box style={pageStyles.jobsContainer}>
          {/* HEADER ROW */}
          <Typography sx={{ fontSize: 24, fontWeight: 400, marginBottom: "15px" }}>
            Posted Jobs
          </Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 12 : 0,

            }}
          >


            <Box sx={{ width: "100%", overflow: "visible", mb: 2 }}>
              <div style={pageStyles.toggleBarWrapper}>
                <div style={pageStyles.toggleGroup}>
                  <div
                    onClick={() => setSelectedJobsTab("Works")}
                    style={pageStyles.toggleButton(selectedJobsTab === "Works")}
                  >
                    Works
                  </div>

                  <div
                    onClick={() => setSelectedJobsTab("24 Hours")}
                    style={pageStyles.toggleButton(selectedJobsTab === "24 Hours")}
                  >
                    24 Hours
                  </div>
                </div>
              </div>
            </Box>

          </Box>

          {/* SEARCH + SORT */}
          <Box
            style={{
              ...pageStyles.searchSortRow,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 12 : 16,
              alignItems: isMobile ? "stretch" : "center",
            }}
          >
            <div
              style={{
                ...pageStyles.searchContainer,
                marginTop: 8,
                width: "100%",
              }}
            >
              <input
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  fontSize: 14,



                }}
                placeholder="Search services"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div style={{ minWidth: isMobile ? "100%" : 120 }}>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  width: "100%",
                  height: 40,
                  borderRadius: 12,
                  border: "1px solid #E0E0E0",
                  paddingLeft: 10,
                  marginTop: "10px",
                }}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </Box>

          {/* CARDS */}
          <div
            style={{
              ...pageStyles.cardsWrap,

              /* ❌ center panna vendam */
              justifyContent: "flex-start",

              /* ✅ mobile la single column but card width same */
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",

              gap: 20,
              width: "100%",
            }}
          >
            {selectedJobsTab === "Works" ? (
              servicesLoading ? (
                <div style={{ marginTop: 40 }}>Loading...</div>
              ) : finalServices.length === 0 ? (
                renderEmptyState("Create Service", () =>
                  navigate("/freelance-dashboard/add-service-form")
                )
              ) : (
                <>
                  {(showAll ? finalServices : finalServices.slice(0, 2)).map((s) =>
                    WorkCard(s)
                  )}
                </>
              )
            ) : jobs24Loading ? (
              <div style={{ marginTop: 40 }}>Loading...</div>
            ) : final24.length === 0 ? (
              renderEmptyState("Create 24h Service", () =>
                navigate("/freelance-dashboard/add-service-form-24-hour")
              )
            ) : (
              <>
                {(showAll ? final24 : final24.slice(0, 2)).map((j) =>
                  Card24(j)
                )}
              </>
            )}
          </div>

        </Box>
      </Box>
    );
  };


  // ------------------ JSX return ------------------
  return (
    <Box
      sx={{
        ...pageStyles.pageWrapper,

        marginLeft: isMobile
          ? "10px"          // 👈 mobile left gap
          : collapsed
            ? "30px"
            : "140px",

        marginRight: isMobile ? "10px" : "0px", // 👈 mobile right also neat
        width: isMobile ? "95%" : "80%",        // 👈 mobile full width
        transition: "all 0.25s ease",
      }}
    >
      
      <Box sx={pageStyles.content}>

        <Box
          sx={{
            background: "linear-gradient(90deg, #f8ffb0, #e3ffd9)",
            borderRadius: 3,
            p: 4,
            mb: 6,
            display: "flex",
            alignItems: "center",
            gap: 3,
            position: "relative",
            border: "1px solid #c9c5c5",

          }}
        >
          <img
            src={profileData.profileImage || "/user-placeholder.jpg"}
            alt="profile"
            style={{
              width: 95,
              height: 95,
              borderRadius: "50%",
              border: "4px solid white",
              objectFit: "cover",

            }}
          />
          {/* <img src={editimg} width={50} style={{ cursor: "pointer", marginLeft: "-55px", paddingTop: "10px", marginTop: "50px" }} /> */}

          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
              {profileData.first_name} {profileData.last_name}
            </Typography>
            <Typography sx={{ color: "gray", fontSize: 15 }}>{profileData.location}</Typography>
            <Typography
              sx={{
                mt: 1,
                display: "inline-block",
                bgcolor: "#7C3CFF",
                color: "#fff",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 400,
                fontSize: 14,
              }}
            >{profileData.professional_title}


              {profileData.title}
            </Typography>
          </Box>

          {/* <Button
            variant="contained"
            sx={{ position: "absolute", right: 20, top: 20, borderRadius: 4, textTransform: "none" }}
          >
            Edit Profile
          </Button> */}
        </Box>

        {/* MAIN ROW */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "flex-start", mb: 4 }}>
          {/* ABOUT CARD */}
          <Box
            sx={{
              background: "#fff",
              borderRadius: "14px",
              p: 3,
              flex: "2 1 600px",
              minWidth: 300,
              // boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
              position: "relative",
              border: "1px solid #c9c5c5",

            }}
          >
            <Typography sx={{ fontSize: 24, fontWeight: 400, mb: 1, }}>About</Typography>
            <IconButton
              sx={{ position: "absolute", right: 12, top: 12 }}
              onClick={startEditAbout}
              aria-label="edit about"
            >
              <FiEdit2 />
            </IconButton>

            <Box
              sx={{
                height: 165,
                maxHeight: 165,            // 👈 adjust height as needed
                overflowY: "auto",
                pr: 1,                     // space so text doesn’t touch scrollbar
              }}
            >
              <Typography sx={{ color: "#444", lineHeight: 1.6 }}>
                {profileData.about ||
                  "Add a short description about yourself to let people know what you do."}
              </Typography>
            </Box>


            {editingAbout && (
              <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  value={tempAbout}
                  onChange={(e) => setTempAbout(e.target.value)}
                  placeholder="Write about yourself..."
                />
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Button variant="contained" onClick={saveEditAbout}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={cancelEditAbout}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* SKILLS & TOOLS */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: "1 1 320px", minWidth: 300 }}>
            <Box sx={{
              background: "#fff", borderRadius: "14px", p: 2.5, border: "1px solid #BDBDBD", position: "relative"
            }}>

              <Typography sx={{ fontSize: 24, fontWeight: 400, }}>Skills & Tools</Typography>

              <IconButton
                sx={{ position: "absolute", right: 12, top: 12 }}
                onClick={startEditSkillsTools}
                aria-label="edit skills and tools"
              >
                <FiEdit2 />
              </IconButton>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 400, fontSize: 18 }}>Skills</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {Array.isArray(profileData.skills) && profileData.skills.length ? (
                      profileData.skills.map((s) => (
                        <Box key={s} sx={{ px: 1.5, py: 0.6, borderRadius: "12px", background: "#FFF8D9", fontWeight: 700, fontSize: 13, border: "1px solid rgba(0,0,0,0.06)" }}>
                          {s}
                        </Box>
                      ))
                    ) : (
                      <Typography color="gray">No skills added</Typography>
                    )}
                    
                  </Box>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 400, fontSize: 18 }}>Tools</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {Array.isArray(profileData.tools) && profileData.tools.length ? (
                      profileData.tools.map((t) => (
                        <Box key={t} sx={{ px: 1.5, py: 0.6, borderRadius: "12px", background: "#E8F8FF", fontWeight: 700, fontSize: 13, border: "1px solid rgba(0,0,0,0.06)" }}>
                          {t}
                        </Box>
                      ))
                    ) : (
                      <Typography color="gray">No tools added</Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              {editingSkillsTools && (
                <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>Edit Skills</Typography>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={skillOptions}
                    value={tempSkills}
                    
                    onChange={(e, v) => setTempSkills(v)}
                    renderInput={(params) => <TextField {...params} placeholder="Add skills (press Enter)" />}
                  />

                  <Typography sx={{ fontSize: 13, fontWeight: 600, mt: 2, mb: 1 }}>Edit Tools</Typography>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={toolOptions}
                    value={tempTools}
                    onChange={(e, v) => setTempTools(v)}
                    
                    renderInput={(params) => <TextField {...params} placeholder="Add tools (press Enter)" />}
                  />

                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button variant="contained" onClick={saveEditSkillsTools}>Save</Button>
                    <Button variant="outlined" onClick={cancelEditSkillsTools}>Cancel</Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* PORTFOLIO SECTION */}
        <Box sx={{
          bgcolor: "#fff", borderRadius: 3, p: 3,
          border: "1px solid #BDBDBD",
        }}>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontSize: 24, fontWeight: 400, }}>Portfolio</Typography>
            <Button variant="contained" size="small" sx={{ borderRadius: 4, textTransform: "none" }} onClick={() => setIsPortfolioPopupOpen(true)}>
              Add Portfolio
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, overflowX: "auto", overflowY: "hidden", pb: 2, pl: 0, width: "100%", maxWidth: "100%", '&::-webkit-scrollbar': { height: 8 }, '&::-webkit-scrollbar-thumb': { background: "#ddd", borderRadius: 10 }, cursor: "pointer" }}>
            {portfolio.map((p) => (
              <Box
                key={p.id}
                sx={{
                  width: 300,
                  flexShrink: 0,
                  bgcolor: "#00c2e8",
                  borderRadius: 2,
                  p: 0,
                  // boxShadow: "0 8px 20px rgba(12,20,31,0.06)",
                  border: "1px solid #BDBDBD",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                  position: "relative",
                  mr: 1.5,
                }}
                onClick={() => LaunchURL(p.projectUrl)}
              >
                <Box sx={{ height: 140, bgcolor: "#00b7db" }}>
                  <img src={company} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>

                <Box sx={{ bgcolor: "#fff", p: 2, height: "100%", position: "relative" }}>
                  <Box sx={{ position: "absolute", right: 8, top: 8, display: "flex", gap: 1 }}>
                    <IconButton size="small" onClick={(e) => handleOpenEdit(p, e)} aria-label="edit portfolio"><FiEdit2 /></IconButton>
                    <IconButton size="small" onClick={(e) => handleDelete(p, e)} aria-label="delete portfolio"><FiTrash2 color="#e53935" /></IconButton>
                  </Box>

                  <Typography sx={{ fontWeight: 700 }}>{p.title}</Typography>
                  <Typography sx={{ fontSize: 13, color: "#555", mt: 1,    height: 200,              // 🔥 fixed height
    overflowY: "auto",     }}>{p.description}</Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                    {(p.skills || []).map((s) => (
                      <Box key={s} sx={{ px: 1, py: 0.5, bgcolor: "#FFF8D9", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{s}</Box>
                    ))}
                    {(p.tools || []).map((t) => (
                      <Box key={t} sx={{ px: 1, py: 0.5, bgcolor: "#E8F8FF", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{t}</Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* AddPortfolioPopup (external component you already have) */}
        <AddPortfolioPopup open={isPortfolioPopupOpen} onClose={() => setIsPortfolioPopupOpen(false)} portfolio={null} />

        {/* EditPortfolioPopup */}
        {isEditOpen && editingPortfolio && (
          <EditPortfolioPopup
            open={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              setEditingPortfolio(null);
            }}
            portfolio={editingPortfolio}
            onSave={handleSaveEdit}
          />
        )}

        {/* POSTED JOBS (Works | 24 Hours) */}
        {renderPostedJobsPanel()}

        {/* FAB (create service) */}
        <button style={pageStyles.fab} onClick={() => navigate("/freelance-dashboard/add-service-form")}>+</button>
      </Box>
    </Box>
  );
}

// --------------------------- EditPortfolioPopup (same as your file) ---------------------------
function EditPortfolioPopup({ open, onClose, portfolio, onSave }) {
  const [title, setTitle] = useState(portfolio?.title || "");
  const [description, setDescription] = useState(portfolio?.description || "");
  const [projectUrl, setProjectUrl] = useState(portfolio?.projectUrl || "");
  const [imageUrl, setImageUrl] = useState(portfolio?.imageUrl || "");
  const [skillsText, setSkillsText] = useState((portfolio?.skills || []).join(", "));
  const [toolsText, setToolsText] = useState((portfolio?.tools || []).join(", "));

  useEffect(() => {
    // keep in sync when portfolio changes (e.g., open new item)
    setTitle(portfolio?.title || "");
    setDescription(portfolio?.description || "");
    setProjectUrl(portfolio?.projectUrl || "");
    setImageUrl(portfolio?.imageUrl || "");
    setSkillsText((portfolio?.skills || []).join(", "));
    setToolsText((portfolio?.tools || []).join(", "));
  }, [portfolio]);

  const handleSave = () => {
    const skills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tools = toolsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updated = {
      id: portfolio.id,
      title: title.trim(),
      description: description.trim(),
      projectUrl: projectUrl.trim(),
      imageUrl: imageUrl.trim(),
      skills,
      tools,
    };

    onSave(updated);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: "#ffffff", borderRadius: "20px", p: 1, border: "1px solid #BDBDBD", } }}>
      <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>Edit Portfolio</DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Project Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <TextField label="Project description" fullWidth multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project briefly" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <TextField label="Project url" fullWidth value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="https://" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <TextField label="Skills (comma separated)" fullWidth value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="React, Node, Figma" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <TextField label="Tools (comma separated)" fullWidth value={toolsText} onChange={(e) => setToolsText(e.target.value)} placeholder="VSCode, Git" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose} sx={{ borderColor: "rgba(124, 60, 255, 1)", borderRadius: "10px", color: "rgba(124, 60, 255, 1)", border: "2px solid #7C3CFF", textTransform: "none", width: "120px" }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "rgba(124, 60, 255, 1)", borderRadius: "10px", color: "white", textTransform: "none", width: "120px" }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );



}
