//FreelanceAddservice24hour.jsx




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firbase/Firebase"; // 👉 adjust path to your firebase file
import backarrow from "../assets/backarrow.png";

// --------------------------------------------------
// INLINE CSS (same file)
// --------------------------------------------------
if (
  typeof document !== "undefined" &&
  !document.getElementById("add-service-style")
) {
  const style = document.createElement("style");
  style.id = "add-service-style";
  style.innerHTML = `
  :root {
    --as-yellow-bg: #fffccf;
    --as-yellow-border: #fff7b9;
    --as-purple: #7C3CFF;
    --as-purple-hover: #7C3CFF;
    --as-gray-text: #6b7280;
  }

  body {
    font-family: 'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  }

  .add-service-page {
    min-height: 100vh;
    background: var(--as-page-bg);
    padding: 20px 16px;
    display: flex;
    justify-content: center;
  }

  .add-service-wrapper {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }

  .as-header {
    display: flex;
    align-items: center;
    gap: 1px;
    margin-bottom: 16px;
  }

  .as-back-btn {
    width: 36px;
    height: 36px;
    border-radius: 500px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .as-back-btn:hover {
    background: #f3f4f6;
  }

  .as-title {
    font-size: 22px;
    font-weight: 600;
    color: #111827;
  }

  .as-subtitle {
    font-size: 12px;
    color: var(--as-gray-text);
    margin-top: 2px;
  }

  /* Tabs pill */
  .as-tab-bar {
    width: 100%;
    background: #ffffff;
    border-radius: 999px;
    padding: 10px 12px;
    display: flex;
    gap: 8px;
    margin-bottom: 18px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.10);
  }

  .as-tab-btn {
    width: 165.7937px;      /* 🔥 Figma width */
    height: 29px;           /* 🔥 Figma height */
    border-radius: 14px;    /* 🔥 Figma radius */
    border: 0.8px solid #e5e7eb;
    padding: 10px 24px;     /* 🔥 Figma padding */
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;               /* 🔥 Figma gap */
    font-size: 14px;
    font-weight: 500;
    color: var(--as-gray-text);
    background: transparent;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease,
      border-color 0.15s ease;
  }

  .as-tab-btn--active {
    background: #FDFD96;
    color: #010308ff;
    border-color: #f4e98a;
    box-shadow: 0 4px 12px rgba(0,0,0,0.18);
  }

  /* Main card */
  .as-card {
    background: #ffffff;
    border-radius: 32px;
    padding: 34px 44px 46px;
    box-shadow: 0 14px 40px rgba(0,0,0,0.12);
  }

  .as-message {
    margin-bottom: 16px;
    font-size: 13px;
    border-radius: 10px;
    padding: 8px 12px;
  }
  .as-message-error {
    background: #fef2f2;
    color: #b91c1c;
  }
  .as-message-success {
    background: #ecfdf3;
    color: #166534;
  }

  .as-section-label {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    margin-bottom: 4px;
  }

  .as-required {
    color: #ef4444;
    margin-left: 2px;
  }

  .as-yellow-box {
  background: #FFFECC !important;   /* exact pale yellow from screenshot */
  border: 1px solid #E8E4C6 !important;  /* thin soft border */
  border-radius: 12px !important;   /* smoother curve */
  padding: 14px 16px !important;    /* perfect inner spacing */
  box-shadow: none !important;      /* screenshot = NO shadow */
  display: flex;
  align-items: flex-start;          /* text starts at top-left */
}


  .as-input,
  .as-textarea,
  .as-select {
    width: 100%;
    font-size: 14px;
    color: #6B6767;
    border: none;
    outline: none;
    background: transparent;
  }

  .as-textarea {
    resize: none;
    line-height: 1.5;
  }

  .as-select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .as-inline-row {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  @media (min-width: 640px) {
    .as-inline-row {
      flex-direction: row;
      align-items: center;
    }
  }

  .as-inline-row > .as-flex-1 {
    flex: 1;
  }

  .as-to-text {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    text-align: center;
  }

  .as-helper-text {
    font-size: 11px;
    color: #6b7280;
    margin-top: 3px;
    text-align: right;
  }

  /* Skills & Tools chips */
  .as-chip-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }

  .as-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    padding: 4px 10px;
    font-size: 11px;
    color: #111827;
  }

  .as-chip-remove {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 12px;
    color: #6b7280;
  }

  .as-chip-remove:hover {
    color: #111827;
  }

  /* Skills/tools select row */
  .as-skill-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  @media (min-width: 640px) {
    .as-skill-row {
      flex-direction: row;
      align-items: center;
    }
  }

  .as-skill-row .as-search-input {
    flex: 1;
  }

  .as-skill-row .as-dropdown {
    width: 100%;
    max-width: 260px;
    background: rgba(255,255,255,0.9);
    border-radius: 10px;
    border: 1px solid #d1d5db;
    padding: 6px 8px;
    font-size: 12px;
    outline: none;
  }

.as-buttons {
  margin-top: 26px;
  display: flex;
  flex-direction: row;
  gap: 14px;
  width: 100%;
}

  @media (min-width: 640px) {
    .as-buttons {
      flex-direction: row;
    }
  }

  .as-btn {
    flex: 1;
    border-radius: 999px;
    padding: 10px 0;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease,
      opacity 0.15s ease,
      transform 0.07s ease;
  }

  .as-btn-cancel {
    background: #ffffff;
    border: 1px solid #d1d5db;
    color: #374151;
  }
  .as-btn-cancel:hover {
    background: #f9fafb;
  }

  .as-btn-save {
    background: var(--as-purple);
    color: #ffffff;
    box-shadow: 0 7px 16px rgba(155, 106, 255, 0.7);
  }
  .as-btn-save:hover {
    background: var(--as-purple-hover);
  }
  .as-btn-save:active {
    transform: translateY(1px);
    box-shadow: 0 4px 10px rgba(155, 106, 255, 0.6);
  }
  .as-btn-save[disabled] {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .as-spinner {
    width: 16px;
    height: 16px;
    border-radius: 999px;
    border: 2px solid #ffffff;
    border-top-color: transparent;
    animation: as-spin 0.7s linear infinite;
  }

  @keyframes as-spin {
    to { transform: rotate(360deg); }
  }

  .backbtn{
    width:30px;
    height:30px; 
    border-radius:14px;
    border:0.8px solid #ccc;
    display: flex;
    justify-content:center;
    align-items:center;
    cursor:pointer; 
    font-size:20px;
    opacity: 1; 
    flex-shrink: 0;
    margin-bottom:12px;
  }
    /* Common dropdown arrow for .as-select and .as-dropdown */
.as-select,
.as-dropdown {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%236B7280' stroke-width='2'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px 7px;
  padding-right: 30px; /* add space for the arrow */
  cursor: pointer;
}

  `;
  document.head.appendChild(style);
}

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

export default function AddServiceForm({ jobData = null, jobId = null }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // -------------------- BASIC STATE -------------------- //
const [selectedTab, setSelectedTab] = useState("24 Hours");  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("");
  const [sampleUrl, setSampleUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const [clientReq, setClientReq] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [skillSearch, setSkillSearch] = useState("");
  const [toolSearch, setToolSearch] = useState("");



  const deliveryOptions = [
    "1-7 days",
    "7-15 days",
    "15-30 days",
    "1-2 months",
    "2-3 months",
    "3-6 months",
    "6+ months",
  ];

  const expertiseOptions = [
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
    "Personal Growth & Hobbies",
  ];


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




  useEffect(() => {
    if (jobData) {
      setTitle(jobData.title || "");
      setDesc(jobData.description || "");
      setBudgetFrom(
        jobData.budget_from != null ? String(jobData.budget_from) : ""
      );
      setBudgetTo(
        jobData.budget_to != null ? String(jobData.budget_to) : ""
      );
      setSampleUrl(jobData.sampleProjectUrl || "");
      setClientReq(jobData.clientRequirements || "");
      setSelectedCategory(jobData.category || "");
      setSelectedDuration(jobData.deliveryDuration || "");
      setSelectedSkills(Array.isArray(jobData.skills) ? jobData.skills : []);
      setSelectedTools(Array.isArray(jobData.tools) ? jobData.tools : []);
      if (jobData.is24Hour) {
        setSelectedTab("24 Hours");
      }
    }
  }, [jobData]);

  // -------------------- HELPERS -------------------- //

  const addSkill = (skill) => {
    if (!skill) return;
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => [...prev, skill]);
    }
    setSelectedSkill("");
    setSkillSearch("");
  };

  const addTool = (tool) => {
    if (!tool) return;
    if (!selectedTools.includes(tool)) {
      setSelectedTools((prev) => [...prev, tool]);
    }
    setSelectedTool("");
    setToolSearch("");
  };

  const removeSkill = (skill) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const removeTool = (tool) => {
    setSelectedTools((prev) => prev.filter((t) => t !== tool));
  };

  const filteredSkills = skillOptions.filter((s) =>
    s.toLowerCase().includes(skillSearch.toLowerCase())
  );
  const filteredTools = toolOptions.filter((t) =>
    t.toLowerCase().includes(toolSearch.toLowerCase())
  );

  // -------------------- VALIDATION + SAVE -------------------- //

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");


    if (!isValidHttpsUrl(sampleUrl)) {
      alert("invalid URLs are not allowed for sample projects link");
      return;
    }

    if (!title.trim()) {
      setErrorMsg("Please enter a service title");
      return;
    }
    if (!desc.trim()) {
      setErrorMsg("Please enter a description");
      return;
    }
    if (!budgetFrom.trim() || isNaN(Number(budgetFrom))) {
      setErrorMsg("Please enter a valid 'from' price");
      return;
    }
    if (!budgetTo.trim() || isNaN(Number(budgetTo))) {
      setErrorMsg("Please enter a valid 'to' price");
      return;
    }

    if (selectedTab === "Work") {
      if (!selectedCategory) {
        setErrorMsg("Please select a category");
        return;
      }
      if (!selectedDuration) {
        setErrorMsg("Please select delivery duration");
        return;
      }
    }

    if (selectedSkills.length < 3) {
      setErrorMsg("Please select at least 3 skills");
      return;
    }
    if (selectedTools.length < 3) {
      setErrorMsg("Please select at least 3 tools");
      return;
    }

    if (!sampleUrl.trim().startsWith("https://")) {
      setErrorMsg("Please enter a valid https:// project URL");
      return;
    }

    const user = currentUser || auth.currentUser;
    if (!user) {
      setErrorMsg("User not logged in");
      return;
    }

    setSaving(true);
    try {
      const data = {
        title: title.trim(),
        description: desc.trim(),
        budget_from: Number(budgetFrom.trim()),
        budget_to: Number(budgetTo.trim()),
        category: selectedCategory || null,
        skills: selectedSkills,
        tools: selectedTools,
        sampleProjectUrl: sampleUrl.trim(),
        clientRequirements: clientReq.trim(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
      };

      let collectionName = "services";

      if (selectedTab === "24 Hours") {
        data.is24Hour = true;
        data.timeline = "24 Hours";
        collectionName = "service_24h";
      } else {
        data.deliveryDuration = selectedDuration || null;
      }

      if (jobId) {
        const mainRef = doc(collection(db, collectionName), jobId);
        const userRef = doc(
          collection(db, "users", user.uid, collectionName),
          jobId
        );
        await updateDoc(mainRef, data);
        await updateDoc(userRef, data);
        setSuccessMsg("Service updated successfully");
      } else {
        data.createdAt = serverTimestamp();
        const mainRef = doc(collection(db, collectionName));
        await setDoc(mainRef, data);
        const userRef = doc(
          collection(db, "users", user.uid, collectionName),
          mainRef.id
        );
        await setDoc(userRef, data);
        setSuccessMsg("Service added successfully");
      }

      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save service: " + err.message);
    } finally {
      setSaving(false);
    }
  };


  const isValidHttpsUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  // -------------------- RENDER -------------------- //

  return (
    <div className="add-service-page" style={{ marginTop: "40px" }}>
      <div className="add-service-wrapper">
        {/* Header */}
        <div className="as-header">
          <button onClick={() => navigate(-1)} className="as-back-btn">
            <span className="material-icons" style={{ fontSize: 20 }}>
              {/* back icon optional */}
            </span>
          </button>

          <div>
            {/* Left side header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 0px",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                  cursor: "pointer",
                }}
                onClick={() => navigate(-1)}
              >
                <img src={backarrow} style={{ width: "20px" }} alt="back" />
              </div>

              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  fontFamily:
                    "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  color: "#000",
                }}
              >
                Create Service ...
              </span>
            </div>
            <div className="as-subtitle">
              Show what you do — create your service here....
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="as-tab-bar">
          <button
            className={
              "as-tab-btn " +
              (selectedTab === "Work" ? "as-tab-btn--active" : "")
            }
            onClick={() => setSelectedTab("Work")}
          >
            Work
          </button>
          <button
            className={
              "as-tab-btn " +
              (selectedTab === "24 Hours" ? "as-tab-btn--active" : "")
            }
            onClick={() => setSelectedTab("24 Hours")}
          >
            24 Hours
          </button>
        </div>

        {/* Main card */}
        <div className="as-card">
          {(errorMsg || successMsg) && (
            <div
              className={
                "as-message " +
                (errorMsg ? "as-message-error" : "as-message-success")
              }
            >
              {errorMsg || successMsg}
            </div>
          )}

          {/* Service Title */}
          <SectionLabel label="Service Title" required />
          <div className="as-yellow-box">
            <input
              type="text"
              className="as-input"
              placeholder="e.g. Logo Design That Pops and Defines Your Brand"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <SectionLabel label="Description" required className="mt-5" />
          <div className="as-yellow-box" style={{ alignItems: "flex-start" }}>
            <textarea
              className="as-textarea"
              rows={4}
              placeholder="Describe your service and showcase your uniqueness"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          {/* Category */}
          <SectionLabel label="Category" required className="mt-5" />
          <div className="as-yellow-box">
            <select
              className="as-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {expertiseOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <SectionLabel label="Price Range" required className="mt-5" />
          <div className="as-inline-row">
            <div className="as-flex-1">
              <div className="as-yellow-box">
                <input
                  type="number"
                  className="as-input"
                  value={budgetFrom}
                  onChange={(e) => setBudgetFrom(e.target.value)}
                />
              </div>
            </div>
            <div className="as-to-text">To</div>
            <div className="as-flex-1">
              <div className="as-yellow-box">
                <input
                  type="number"
                  className="as-input"
                  value={budgetTo}
                  onChange={(e) => setBudgetTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Delivery Days - only Work */}
          {selectedTab === "Work" && (
            <>
              <SectionLabel label="Delivery days" required className="mt-5" />
              <div className="as-yellow-box">
                <select
                  className="as-select"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  <option value="">In days</option>
                  {deliveryOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Skills */}
          <SectionLabel label="Skills" required className="mt-5" />
          <div>
            <div className="as-yellow-box">
              <select
                className="as-select"
                value=""
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) addSkill(val);
                }}
              >
                <option value="">Select a skill</option>
                {skillOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="as-helper-text">Add at least 3 skills</div>
            <ChipWrap items={selectedSkills} onRemove={removeSkill} />
          </div>

          {/* Tools */}
          <SectionLabel label="Tools" required className="mt-5" />
          <div>
            <div className="as-yellow-box">
              <select
                className="as-select"
                value=""
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) addTool(val);
                }}
              >
                <option value="">Select a tool</option>
                {toolOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="as-helper-text">Add at least 3 tools</div>
            <ChipWrap items={selectedTools} onRemove={removeTool} />
          </div>

          {/* Sample Projects */}
          <SectionLabel label="Sample Projects" required className="mt-5" />
          <div className="as-yellow-box">
            <input
              type="url"
              className="as-input"
              placeholder="e.g. Logo Design That Pops and Defines Your Brand"
              value={sampleUrl}
              onChange={(e) => {
                const value = e.target.value;
                setSampleUrl(value);

                if (!value) {
                  setUrlError("");
                } else if (!isValidHttpsUrl(value)) {
                  setUrlError("Please enter a valid HTTPS URL (https://)");
                } else {
                  setUrlError("");
                }
              }}
            />
          </div>

          {/* Client Requirements */}
          <SectionLabel label="Client Requirements" className="mt-5" />
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 3 }}>
            (Optional)
          </div>
          <div
            className="as-yellow-box"
            style={{
              alignItems: "flex-start",
              border: "2px solid #FEFED7",
            }}
          >
            <textarea
              rows={4}
              className="as-textarea"
              placeholder="Describe what you need and specific details"
              value={clientReq}
              onChange={(e) => setClientReq(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="as-buttons">
            <button
              type="button"
              className="as-btn as-btn-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="as-btn as-btn-save"
              disabled={saving}
              onClick={handleSave}
            >
              {saving && <span className="as-spinner" />}
              <span style={{ marginLeft: saving ? 6 : 0 }}>
                {saving ? "Saving..." : "Save"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- SMALL UI SUBCOMPONENTS -------------------- */

function SectionLabel({ label, required = false, className = "" }) {
  return (
    <div
      className={`as-section-label ${className}`}
      style={{ marginTop: className?.includes("mt-5") ? 20 : 0 }}
    >
      {label}
      {required && <span className="as-required">*</span>}
    </div>
  );
}

function ChipWrap({ items, onRemove }) {
  if (!items || !items.length) return null;
  return (
    <div className="as-chip-wrap">
      {items.map((item) => (
        <div key={item} className="as-chip">
          <span>{item}</span>
          <button
            type="button"
            className="as-chip-remove"
            onClick={() => onRemove(item)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

