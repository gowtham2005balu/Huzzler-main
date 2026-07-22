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
// import backarrow from "../../../assets/backarrow.png"
// import Select from "react-select";



// export default function ClientEditJob() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const jobData = location.state?.jobData || {};

//   // ---------------- STATE ----------------
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const [budgetFrom, setBudgetFrom] = useState("");
//   const [budgetTo, setBudgetTo] = useState("");
//   const [timeline, setTimeline] = useState("");

//   const [isSaving, setIsSaving] = useState(false);



//   // ---------------- PREFILL ----------------
//   useEffect(() => {
//     if (!jobData) return;

//     setTitle(jobData.title || "");
//     setDescription(jobData.description || "");

//     if (Number(budgetFrom) > Number(budgetTo)) {
//       alert("Budget From cannot be greater than Budget To");
//       return;
//     }


//     setCategory(
//       jobData.category
//         ? { label: jobData.category, value: jobData.category }
//         : null
//     );

//     setSkills(
//       (jobData.skills || []).map(s => ({ label: s, value: s }))
//     );

//     setTools(
//       (jobData.tools || []).map(t => ({ label: t, value: t }))
//     );

//     setBudgetFrom(jobData.budget_from || "");
//     setBudgetTo(jobData.budget_to || "");
//     setTimeline(jobData.timeline || "");
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


//   // ---------------- SAVE ----------------
//   const handleSave = async () => {
//     if (!title || !category) {
//       alert("Title and Category are required");
//       return;
//     }
//     if (!title.trim()) {
//       alert("Job title is required");
//       return;
//     }

//     if (!category) {
//       alert("Category is required");
//       return;
//     }

//     if (!budgetFrom || !budgetTo) {
//       alert("Budget range is required");
//       return;
//     }

//     if (Number(budgetFrom) > Number(budgetTo)) {
//       alert("Budget From cannot be greater than Budget To");
//       return;
//     }
//     s

//     setIsSaving(true);

//     const jobPayload = {
//       title,
//       description,

//       category: category?.value || null,

//       budget_from: budgetFrom ? Number(budgetFrom) : null,
//       budget_to: budgetTo ? Number(budgetTo) : null,

//       timeline,

//       skills: skills.map(s => s.value),
//       tools: tools.map(t => t.value),

//       updated_at: serverTimestamp(),
//     };


//     try {
//       if (jobData.id) {
//         await setDoc(
//           doc(db, "jobs", jobData.id),
//           jobPayload,
//           { merge: true }
//         );


//       } else {
//         await addDoc(collection(db, "jobs"), {
//           ...jobPayload,
//           created_at: serverTimestamp(),
//         });
//       }
//       alert("Job saved successfully!");
//       navigate(-1);
//     } catch (err) {
//       console.error(err);
//       alert("Error saving job.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <>
//       {/* ------------ PAGE ------------ */}
//       <div className="editJobWrapper">
//         <div className="editJobCard">

//           {/* HEADER */}
//           <div className="editJobHeader">
//             <div className="backbtn" onClick={() => navigate(-1)} >
//               <img src={backarrow} alt="back arrow" height={20} className="backarrow" />
//             </div>
//             <div className="editJobTitle">
//               {jobData.id ? "Edit Job Proposal" : "Job Proposal"}
//             </div>
//           </div>

//           {/* FORM */}
//           <label>Job Title*</label>
//           <input
//             className="formInput"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter Job Title"
//           />

//           <label>Description*</label>
//           <textarea
//             className="formInput"
//             style={{ height: 100 }}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Describe your project"
//           />



//           <label>Budget From*</label>
//           <input
//             type="number"
//             className="formInput"
//             value={budgetFrom}
//             onChange={(e) => setBudgetFrom(e.target.value)}
//             placeholder="₹ From"
//           />

//           <label>Budget To*</label>
//           <input
//             type="number"
//             className="formInput"
//             value={budgetTo}
//             onChange={(e) => setBudgetTo(e.target.value)}
//             placeholder="₹ To"
//           />

//           <label>Timeline*</label>
//           <input
//             className="formInput"
//             value={timeline}
//             onChange={(e) => setTimeline(e.target.value)}
//             placeholder="e.g. 3 days"
//           />


//           <div style={styles.section}>
//             <label style={styles.label}>Category</label>
//             <Select
//               value={category}
//               onChange={setCategory}
//               options={categoryOptions}
//             />
//           </div>

//           <div style={styles.section}>
//             <label style={styles.label}>Skills</label>
//             <Select
//               isMulti
//               options={skillOptions}
//               value={skills}
//               onChange={setSkills}
//             />
//           </div>


//           <div style={styles.section}>
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
//             <button
//               className="saveBtn"
//               onClick={handleSave}
//               disabled={isSaving}
//             >
//               {isSaving ? "Saving..." : "Save"}
//             </button>

//             <button className="cancelBtn" onClick={() => navigate(-1)}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ------------ INLINE CSS ------------ */}
//       <style>{`
//       .editJobWrapper {
//   min-height: 100vh;
//   padding: 30px 0;

//   /* Proper Rubik font family */
//   font-family: 'Rubik', system-ui, -apple-system, BlinkMacSystemFont,
//     'Segoe UI', Inter, sans-serif;

//   display: flex;
//   justify-content: center;

//   /* Prevent horizontal scrolling */
//   width: 100%;
//   overflow-x: hidden;
// }


//         .editJobCard {
//           width: 90%;
//           max-width: 760px;
//           background: #ffffff;
//           padding: 30px;
//           border-radius: 20px;
//           box-shadow: 0 12px 40px rgba(0,0,0,0.08);
//         }

//         .editJobHeader {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-bottom: 25px;
//         }

//         .backarrow {
//       margin-top:2px;
//       margin-left:1px;
//         }


//         // .backArrow:hover {
//         //   background: #e4dba9;
//         // }



// .backbtn{
//           width: 36px;
//     height: 36px;
//     border-radius: 14px;
//     border: 0.8px solid #ccc;
//     display: flex;
//     justifyContent: center;
//     alignItems: center;
//     cursor: pointer;
//     fontSize: 20px;
//     opacity: 1;
//     flexShrink: 0;
  
//       }

//         .editJobTitle {
//           font-size: 24px;
//           font-weight: 700;
//           color: #333;
//         }

//         label {
//           display: block;
//           font-weight: 600;
//           margin-bottom: 6px;
//           font-size: 15px;
//           color: #444;
//         }

//         .formInput {
//           width: 100%;
//           padding: 14px;
//           background: #fffce8;
//           border-radius: 12px;
//           border: none;
//           margin-bottom: 18px;
//           font-size: 14px;
//           outline: none;
//         }

//         .formInput:focus {
//           box-shadow: 0 0 0 2px #7c3cff40;
//         }

//        .btnRow {
//   display: flex;
//   justify-content: center; /* Center on small screens */
//   margin-top: 20px;
//   gap: 15px;
//   flex-wrap: wrap; /* Wrap buttons if needed */
// }

// .saveBtn,
// .cancelBtn {
//   flex: 1 1 140px; /* Allow buttons to grow/shrink */
//   max-width: 150px; /* Limit maximum width */
//   min-width: 120px; /* Minimum width */
// }

// @media (max-width: 480px) {
//   .saveBtn,
//   .cancelBtn {
//     width: 45%; /* Two buttons side by side on small screens */
//   }

//   .btnRow {
//     gap: 10px;
//   }
// }


        
// .cancelBtn{
//   width:130px;
//   padding:13px;
//   border-radius:25px;
//   border:2px solid #7C3CFF;
//   background:transparent;
//   color:#7C3CFF;
//   font-size:16px;
//   font-weight:600;
//   cursor:pointer;
// }

// .saveBtn{
//   width:130px;
//   padding:13px;
//   border-radius:25px;
//   border:none;
//   background:#7C3CFF;
//   color:#fff;
//   font-size:16px;
//   font-weight:600;
//   cursor:pointer;
// }

//       `}
//       </style>


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
import backarrow from "../../../assets/backarrow.png"
import Select from "react-select";



export default function ClientEditJob() {
  const location = useLocation();
  const navigate = useNavigate();
  const jobData = location.state?.jobData || {};

  // ---------------- STATE ----------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("");
  const [timeline, setTimeline] = useState("");

  const [isSaving, setIsSaving] = useState(false);



  // ---------------- PREFILL ----------------
  useEffect(() => {
    if (!jobData) return;

    setTitle(jobData.title || "");
    setDescription(jobData.description || "");

    if (Number(budgetFrom) > Number(budgetTo)) {
      alert("Budget From cannot be greater than Budget To");
      return;
    }


    setCategory(
      jobData.category
        ? { label: jobData.category, value: jobData.category }
        : null
    );

    setSkills(
      (jobData.skills || []).map(s => ({ label: s, value: s }))
    );

    setTools(
      (jobData.tools || []).map(t => ({ label: t, value: t }))
    );

    setBudgetFrom(jobData.budget_from || "");
    setBudgetTo(jobData.budget_to || "");
    setTimeline(jobData.timeline || "");
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


  // ---------------- SAVE ----------------
  const handleSave = async () => {
    if (!title || !category) {
      alert("Title and Category are required");
      return;
    }
    if (!title.trim()) {
      alert("Job title is required");
      return;
    }

    if (!category) {
      alert("Category is required");
      return;
    }

    if (!budgetFrom || !budgetTo) {
      alert("Budget range is required");
      return;
    }

    if (Number(budgetFrom) > Number(budgetTo)) {
      alert("Budget From cannot be greater than Budget To");
      return;
    }
    

    setIsSaving(true);

    const jobPayload = {
      title,
      description,

      category: category?.value || null,

      budget_from: budgetFrom ? Number(budgetFrom) : null,
      budget_to: budgetTo ? Number(budgetTo) : null,

      timeline,

      skills: skills.map(s => s.value),
      tools: tools.map(t => t.value),

      updated_at: serverTimestamp(),
    };


    try {
      if (jobData.id) {
        await setDoc(
          doc(db, "jobs", jobData.id),
          jobPayload,
          { merge: true }
        );


      } else {
        await addDoc(collection(db, "jobs"), {
          ...jobPayload,
          created_at: serverTimestamp(),
        });
      }
      alert("Job saved successfully!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error saving job.");
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
      {/* ------------ PAGE ------------ */}
      <div className="editJobWrapper">
        <div className="editJobCard">

          {/* HEADER */}
          <div className="editJobHeader">
            <div className="backbtn" onClick={() => navigate(-1)} >
              <img src={backarrow} alt="back arrow" height={20} className="backarrow" />
            </div>
            <div className="editJobTitle">
              {jobData.id ? "Edit Job Proposal" : "Job Proposal"}
            </div>
          </div>

          {/* FORM */}
          <label>Job Title*</label>
          <input
            className="formInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Job Title"
          />

          <label>Description*</label>
          <textarea
            className="formInput"
            style={{ height: 100 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project"
          />



          <label>Budget From*</label>
          <input
            type="number"
            className="formInput"
            value={budgetFrom}
            onChange={(e) => setBudgetFrom(e.target.value)}
            placeholder="₹ From"
          />

          <label>Budget To*</label>
          <input
            type="number"
            className="formInput"
            value={budgetTo}
            onChange={(e) => setBudgetTo(e.target.value)}
            placeholder="₹ To"
          />

          <label>Timeline*</label>
          <input
            className="formInput"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. 3 days"
          />


          <div style={styles.section}>
            <label style={styles.label}>Category</label>
            <Select
              value={category}
              onChange={setCategory}
              options={categoryOptions}
                styles={customSelectStyles}
            />
          </div>

          <div style={styles.section}>
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
            <button
              className="saveBtn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>

            <button className="cancelBtn" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* ------------ INLINE CSS ------------ */}
      <style>{`
      .editJobWrapper {
  min-height: 100vh;
  padding: 30px 0;

  /* Proper Rubik font family */
  font-family: 'Rubik', system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, sans-serif;

  display: flex;
  justify-content: center;

  /* Prevent horizontal scrolling */
  width: 100%;
  overflow-x: hidden;
}


        .editJobCard {
          width: 90%;
          max-width: 760px;
          background: #ffffff;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }

        .editJobHeader {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .backarrow {
      margin-top:2px;
      margin-left:1px;
        }


        // .backArrow:hover {
        //   background: #e4dba9;
        // }



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

        .editJobTitle {
          font-size: 24px;
          font-weight: 700;
          color: #333;
        }

        label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
          font-size: 15px;
          color: #444;
        }

        .formInput {
          width: 100%;
          padding: 14px;
            background-color: rgb(255, 252, 209);
          border-radius: 12px;
          border: none;
          margin-bottom: 18px;
          font-size: 14px;
          outline: none;
        }

        .formInput:focus {
          box-shadow: 0 0 0 2px #7c3cff40;
        }

       .btnRow {
  display: flex;
  justify-content: center; /* Center on small screens */
  margin-top: 20px;
  gap: 15px;
  flex-wrap: wrap; /* Wrap buttons if needed */
}

.saveBtn,
.cancelBtn {
  flex: 1 1 140px; /* Allow buttons to grow/shrink */
  max-width: 150px; /* Limit maximum width */
  min-width: 120px; /* Minimum width */
}

@media (max-width: 480px) {
  .saveBtn,
  .cancelBtn {
    width: 45%; /* Two buttons side by side on small screens */
  }

  .btnRow {
          display: flex;
          justify-content: flex-end;
          margin-top: 25px;
          gap: 15px;
        }
}


        
.cancelBtn{
   padding: 13px 25px;
          border: 2px solid #7C3CFF;
          color: #7C3CFF;
          background: none;
          border-radius: 25px;
          cursor: pointer;
}

.saveBtn{
   padding: 13px 25px;
          background: #7C3CFF;
          border: none;
          color: white;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
}

      `}
      </style>


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