
// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   doc,
//   setDoc,
//   addDoc,
//   collection,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../../../firbase/Firebase";
// import Select from "react-select";



// export default function ClientEdit24Hours() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const jobData = location.state?.jobData || {};
//   const jobId = location.state?.jobId || null;

//   // ---------------- FULL JOB STATE (ALL FIELDS) ----------------
//   const [fullJob, setFullJob] = useState({});

//   // ----------- Editable Fields ----------
//   const [title, setTitle] = useState("");

//   const [budgetFrom, setBudgetFrom] = useState("");
//   const [budgetTo, setBudgetTo] = useState("")
//   const [description, setDescription] = useState("");
//   const [subCategory, setSubCategory] = useState("");
//   const [isSaving, setIsSaving] = useState(false);

//   // ---------- LOAD FULL JOB ---------
//   useEffect(() => {
//     if (!jobData) return;

//     setTitle(jobData.title || "");
//     setDescription(jobData.description || "");

//     if (jobData.category) {
//       setCategory({ label: jobData.category, value: jobData.category });
//     }

//     setSkills((jobData.skills || []).map(s => ({ label: s, value: s })));
//     setTools((jobData.tools || []).map(t => ({ label: t, value: t })));

//     setBudgetFrom(jobData.budget_from || "");
//     setBudgetTo(jobData.budget_to || "");
//   }, [jobData]);



//   const [category, setCategory] = useState(null);
//   const [skills, setSkills] = useState([]);
//   const [tools, setTools] = useState([]);

//   const categoryOptions = [
//     "Graphics & Design",
//     "Programming & Tech",
//     "Digital Marketing",
//     "Writing & Translation",
//     "Video & Animation",
//     "Music & Audio",
//     "AI Services",
//     "Data",
//     "Business",
//     "Finance",
//     "Photography",
//     "Lifestyle",
//     "Consulting",
//   ].map(e => ({ label: e, value: e }));

//   const skillOptions = [
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
//   ].map(e => ({ label: e, value: e }));

//   const toolOptions = [
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
//   ].map(e => ({ label: e, value: e }));

//   // ---------- SAVE JOB (Keeps all fields) -------
//   const handleSave = async () => {
//     if (!title.trim()) {
//       alert("Title is required");
//       return;
//     }

//     if (!category) {
//       alert("Category is required");
//       return;
//     }

//     if (!budgetFrom || !budgetTo) {
//       alert("Budget is required");
//       return;
//     }

//     if (Number(budgetFrom) > Number(budgetTo)) {
//       alert("Budget From cannot be greater than Budget To");
//       return;
//     }


//     setIsSaving(true);

//     const updatedFields = {
//       title,
//       description,

//       category: category?.value || null,
//       subCategory: subCategory || null,

//       budget_from: budgetFrom ? Number(budgetFrom) : null,
//       budget_to: budgetTo ? Number(budgetTo) : null,

//       skills: skills.map(s => s.value),
//       tools: tools.map(t => t.value),

//       is24: true,
//       updated_at: serverTimestamp(),
//     };

//     try {
//       if (jobId) {
//         await setDoc(
//           doc(db, "jobs_24h", jobId),
//           updatedFields,
//           { merge: true }
//         );

//       } else {
//         await addDoc(collection(db, "jobs_24h"), {
//           ...updatedFields,
//           created_at: serverTimestamp(),
//         });
//       }

//       alert("24h Job saved successfully!");
//       navigate(-1);
//     } catch (err) {
//       console.error(err);
//       alert("Error saving 24h job.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <>
//       <div className="editWrapper">
//         <div className="editCard">

//           <div className="editHeader">
//             <div className="backArrow" onClick={() => navigate(-1)}>
//               ←
//             </div>
//             <div className="editTitle">
//               {jobId ? "Edit 24 Hours Job" : "Post 24 Hours Job"}
//             </div>
//           </div>

//           {/* FIELDS */}
//           <label>Job Title*</label>
//           <input
//             className="formInput"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           <label>Description*</label>
//           <textarea
//             className="formInput"
//             style={{ height: "100px" }}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />

         


//           <label>Budget*</label>
//           <div style={{ display: "flex", gap: "10px" }}>
//             <input
//               className="formInput"
//               type="number"
//               placeholder="From"
//               value={budgetFrom}
//               onChange={(e) => setBudgetFrom(e.target.value)}
//             />
//             <input
//               className="formInput"
//               type="number"
//               placeholder="To"
//               value={budgetTo}
//               onChange={(e) => setBudgetTo(e.target.value)}
//             />
//           </div>


//           <div style={styles.section}   className="formInput">
//             <label style={styles.label}>Category</label>
//             <Select
//               value={category}
//               onChange={setCategory}
//               options={categoryOptions}
//             />
//           </div>

//           <div style={styles.section}   className="formInput">
//             <label style={styles.label}>Skills</label>
//             <Select
//               isMulti
//               options={skillOptions}
//               value={skills}
//               onChange={setSkills}
//             />
//           </div>


//           <div style={styles.section}   className="formInput">
//             <label style={styles.label}>Tools</label>
//             <Select
//               isMulti
//               options={toolOptions}
//               value={tools}
//               onChange={setTools}
//             />
//           </div>

//           {/* BUTTONS */}
//           <div className="btnRow">
//             <button className="saveBtn" onClick={handleSave} disabled={isSaving}>
//               {isSaving ? "Saving..." : "Save"}
//             </button>

//             <button className="cancelBtn" onClick={() => navigate(-1)}>
//               Cancel
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* INLINE CSS */}
//       <style>{`
//         .editWrapper {
//           min-height: 100vh;
//           padding: 30px 0;
//           display: flex;
//           justify-content: center;
//         }

//         .editCard {
//           width: 90%;
//           max-width: 760px;
//           background: #fff;
//           padding: 30px;
//           border-radius: 20px;
//           box-shadow: 0 12px 40px rgba(0,0,0,0.08);
//         }

//         .editHeader {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//           margin-bottom: 25px;
//         }

//         .backArrow {
//           width: 40px;
//           height: 40px;
//           background: #fdeb61;
//           border-radius: 10px;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           cursor: pointer;
//           font-size: 20px;
//         }

//         label {
//           margin-top: 15px;
//           font-weight: 600;
//         }

//         .formInput {
//           width: 100%;
//           padding: 12px;
//           border-radius: 10px;
//           margin-top: 6px;
//           background: #f5f0c0;
//           border: 1px solid #ddd;
//         }

//         .btnRow {
//           display: flex;
//           justify-content: flex-end;
//           margin-top: 25px;
//           gap: 15px;
//         }

//         .saveBtn {
//           padding: 13px 25px;
//           background: #7C3CFF;
//           border: none;
//           color: white;
//           border-radius: 25px;
//           cursor: pointer;
//           font-weight: 600;
//         }

//         .cancelBtn {
//           padding: 13px 25px;
//           border: 2px solid #7C3CFF;
//           color: #7C3CFF;
//           background: none;
//           border-radius: 25px;
//           cursor: pointer;
//         }
//       `}</style>
//     </>
//   );
// }



// const styles = {
//   wrapper: {
//     width: "100%",
//     maxWidth: "800px", // max width for desktop
//     margin: "0 auto",
//     background: "#fff",
//     borderRadius: "16px",
//     boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//     fontFamily: "Rubik, sans-serif",
//     padding: "22px",
//     boxSizing: "border-box",
//   },
//   heading: {
//     textAlign: "center",
//     fontWeight: 700,
//     marginBottom: "30px",
//     color: "#000",
//   },
//   section: {
//     marginBottom: "20px",

//   },
//   row: {
//     display: "flex",
//     gap: "10px",
//     marginBottom: "20px",
//     flexWrap: "wrap",
//   },
//   label: {
//     display: "block",
//     fontWeight: 600,
//     color: "#555",
//     marginBottom: "6px",
//     fontSize: "15px",
//   },
//   input: {
//     width: "100%",
//     padding: "12px 14px",
//     borderRadius: "12px",
//     border: "1px solid #ccc",
//     background: "rgba(254, 254, 215, 1)",
//     fontSize: "15px",
//     outline: "none",
//   },
//   textarea: {
//     width: "100%",
//     padding: "12px 14px",
//     borderRadius: "12px",
//     border: "1px solid #ccc",
//     background: "rgba(254, 254, 215, 1)",
//     minHeight: "120px",
//     resize: "vertical",
//     outline: "none",
//   },
//   updateBtn: {
//     width: "100%",
//     padding: "16px",
//     fontSize: "17px",
//     fontWeight: 700,
//     borderRadius: "14px",
//     backgroundColor: "#A259FF",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//     marginTop: "10px",
//   },
// };



import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firbase/Firebase";
import Select from "react-select";
import backarrow from "../../../assets/backarrow.png"


export default function ClientEdit24Hours() {
  const location = useLocation();
  const navigate = useNavigate();

  const jobData = location.state?.jobData || {};
  const jobId = location.state?.jobId || null;

  // ---------------- FULL JOB STATE (ALL FIELDS) ----------------
  const [fullJob, setFullJob] = useState({});

  // ----------- Editable Fields ----------
  const [title, setTitle] = useState("");

  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("")
  const [description, setDescription] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // ---------- LOAD FULL JOB ---------
  useEffect(() => {
    if (!jobData) return;

    setTitle(jobData.title || "");
    setDescription(jobData.description || "");

    if (jobData.category) {
      setCategory({ label: jobData.category, value: jobData.category });
    }

    setSkills((jobData.skills || []).map(s => ({ label: s, value: s })));
    setTools((jobData.tools || []).map(t => ({ label: t, value: t })));

    setBudgetFrom(jobData.budget_from || "");
    setBudgetTo(jobData.budget_to || "");
  }, [jobData]);



  const [category, setCategory] = useState(null);
  const [skills, setSkills] = useState([]);
  const [tools, setTools] = useState([]);

  const categoryOptions = [
    "Graphics & Design",
    "Programming & Tech",
    "Digital Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio",
    "AI Services",
    "Data",
    "Business",
    "Finance",
    "Photography",
    "Lifestyle",
    "Consulting",
  ].map(e => ({ label: e, value: e }));

  const skillOptions = [
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
  ].map(e => ({ label: e, value: e }));

  const toolOptions = [
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
  ].map(e => ({ label: e, value: e }));

  // ---------- SAVE JOB (Keeps all fields) -------
  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!category) {
      alert("Category is required");
      return;
    }

    if (!budgetFrom || !budgetTo) {
      alert("Budget is required");
      return;
    }

    if (Number(budgetFrom) > Number(budgetTo)) {
      alert("Budget From cannot be greater than Budget To");
      return;
    }


    setIsSaving(true);

    const updatedFields = {
      title,
      description,

      category: category?.value || null,
      subCategory: subCategory || null,

      budget_from: budgetFrom ? Number(budgetFrom) : null,
      budget_to: budgetTo ? Number(budgetTo) : null,

      skills: skills.map(s => s.value),
      tools: tools.map(t => t.value),

      is24: true,
      updated_at: serverTimestamp(),
    };

    try {
      if (jobId) {
        await setDoc(
          doc(db, "jobs_24h", jobId),
          updatedFields,
          { merge: true }
        );

      } else {
        await addDoc(collection(db, "jobs_24h"), {
          ...updatedFields,
          created_at: serverTimestamp(),
        });
      }

      alert("24h Job saved successfully!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error saving 24h job.");
    } finally {
      setIsSaving(false);
    }
  };
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgb(255, 252, 209)",
      borderRadius: "10px",
      border: "1px solid #ddd",
      padding: "4px",
      boxShadow: "none",
      minHeight: "45px",
      "&:hover": {
        border: "1px solid #ccc",
      },
    }),

    menu: (provided) => ({
      ...provided,
      borderRadius: "10px",
      overflow: "hidden",
      zIndex: 9999,
    }),

    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#7c6c9c20",
      borderRadius: "8px",
    }),

    multiValueLabel: (provided) => ({
      ...provided,
      color: "#000",
      fontWeight: 500,
    }),

    multiValueRemove: (provided) => ({
      ...provided,
      color: "#2a292b",
      ":hover": {
        backgroundColor: "#2f2e2f",
        color: "#fff",
      },
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#666",
    }),
  };

  return (
    <>
      <div className="editWrapper">
        <div className="editCard">

          <div className="editHeader">
            <div className="backbtn" onClick={() => navigate(-1)} >
              <img src={backarrow} alt="back arrow" height={20} className="backarrow" />
            </div>
            <div className="editTitle">
              {jobId ? "Edit 24 Hours Job" : "Post 24 Hours Job"}
            </div>
          </div>

          {/* FIELDS */}
          <label>Job Title*</label>
          <input
            className="formInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description*</label>
          <textarea
            className="formInput"
            style={{ height: "100px" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />




          <label>Budget*</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              className="formInput"
              type="number"
              placeholder="From"
              value={budgetFrom}
              onChange={(e) => setBudgetFrom(e.target.value)}
            />
            <input
              className="formInput"
              type="number"
              placeholder="To"
              value={budgetTo}
              onChange={(e) => setBudgetTo(e.target.value)}
            />
          </div>


          <div style={styles.section}>
            <label style={styles.label}>Category</label>
            <Select
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              styles={customSelectStyles}
            />

          </div>

          <div style={styles.section} >
            <label style={styles.label}>Skills</label>
            <Select
              isMulti
              options={skillOptions}
              value={skills}
              onChange={setSkills}
              styles={customSelectStyles}
            />

          </div>


          <div style={styles.section}>
            <label style={styles.label}>Tools</label>
            <Select
              isMulti
              options={toolOptions}
              value={tools}
              onChange={setTools}
              styles={customSelectStyles}
            />

          </div>

          {/* BUTTONS */}
          <div className="btnRow">
            <button className="saveBtn" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>

            <button className="cancelBtn" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>

        </div>
      </div>

      {/* INLINE CSS */}
      <style>{`
        .editWrapper {
          min-height: 100vh;
          padding: 30px 0;
          display: flex;
          justify-content: center;
        }

        .editCard {
          width: 90%;
          max-width: 760px;
          background: #fff;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
.editTitle{
  font-size: 24px;
          font-weight: 700;
          color: #333;
}
        .editHeader {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }
          .backbtn{
          width: 36px;
    height: 36px;
    border-radius: 14px;
    border: 0.8px solid #ccc;
    display: flex;
    justifyContent: center;
    alignItems: center;
    cursor: pointer;
    fontSize: 20px;
    opacity: 1;
    flexShrink: 0;
  
      }

              .backarrow {
      margin-top:2px;
      margin-left:1px;
        }

        label {
          margin-top: 15px;
          font-weight: 600;
        }

        .formInput {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          margin-top: 6px;
             background-color: rgb(255, 252, 209);
          border: 1px solid #ddd;
        }

        .btnRow {
          display: flex;
          justify-content: flex-end;
          margin-top: 25px;
          gap: 15px;
        }

        .saveBtn {
          padding: 13px 50px;
          background: #7C3CFF;
          border: none;
          color: white;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
        }

        .cancelBtn {
          padding: 13px 40px;
          border: 2px solid #7C3CFF;
          color: #7C3CFF;
          background: none;
          border-radius: 25px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}



const styles = {
  wrapper: {
    width: "100%",
    maxWidth: "800px", // max width for desktop
    margin: "0 auto",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
    fontFamily: "Rubik, sans-serif",
    padding: "22px",
    boxSizing: "border-box",
  },
  heading: {
    textAlign: "center",
    fontWeight: 700,
    marginBottom: "30px",
    color: "#000",
  },
  section: {
    marginBottom: "20px",

  },
  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  label: {
    display: "block",
    fontWeight: 600,
    color: "#555",
    marginBottom: "6px",
    fontSize: "15px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    background: "rgba(254, 254, 215, 1)",
    fontSize: "15px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    background: "rgba(254, 254, 215, 1)",
    minHeight: "120px",
    resize: "vertical",
    outline: "none",
  },
  updateBtn: {
    width: "100%",
    padding: "16px",
    fontSize: "17px",
    fontWeight: 700,
    borderRadius: "14px",
    backgroundColor: "#A259FF",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
};
