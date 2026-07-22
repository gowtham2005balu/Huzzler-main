


// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Chip,
//   Box,
//   Typography,
//   MenuItem,
//   CircularProgress,
// } from "@mui/material";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { db, auth } from "../firbase/Firebase";
// import { useAuthState } from "react-firebase-hooks/auth";

// const skillOptions = [
//   "Logo Design",
//   "Website Design",
//   "App Design",
//   "UX Design",
//   "Game Art",
// ];

// const toolOptions = [
//   "Adobe Illustrator",
//   "Figma",
//   "Canva",
//   "Photoshop",
//   "Flutter",
// ];

// const AddPortfolioPopup = ({ open, onClose }) => {
//   const [user] = useAuthState(auth);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [url, setUrl] = useState("");
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [selectedTools, setSelectedTools] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleAddSkill = (skill) => {
//     if (!selectedSkills.includes(skill) && selectedSkills.length < 3) {
//       setSelectedSkills([...selectedSkills, skill]);
//     }
//   };

//   const handleAddTool = (tool) => {
//     if (!selectedTools.includes(tool) && selectedTools.length < 5) {
//       setSelectedTools([...selectedTools, tool]);
//     }
//   };

//   const handleDeleteSkill = (skill) => {
//     setSelectedSkills(selectedSkills.filter((s) => s !== skill));
//   };

//   const handleDeleteTool = (tool) => {
//     setSelectedTools(selectedTools.filter((t) => t !== tool));
//   };

//   const validateUrl = (url) => {
//     const urlPattern = /^(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
//     return urlPattern.test(url);
//   };

//   const handleSave = async () => {
//     if (!user) return alert("You must be logged in");
//     if (!title.trim()) return alert("Project title is required");
//     if (description.trim().length < 120)
//       return alert("Project description must be at least 120 characters");
//     if (selectedSkills.length < 3) return alert("Please select at least 3 skills");
//     if (selectedTools.length < 3) return alert("Please select at least 3 tools");
//     if (!url.trim() || !validateUrl(url))
//       return alert("Please enter a valid project link (http/https)");

//     setLoading(true);
//     try {
//       const portfolioRef = collection(db, "users", user.uid, "portfolio");
//       await addDoc(portfolioRef, {
//         title: title.trim(),
//         description: description.trim(),
//         skills: selectedSkills,
//         tools: selectedTools,
//         projectUrl: url.trim(),
//         createdAt: serverTimestamp(),
//       });
//       alert("Portfolio saved successfully");
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Error saving portfolio: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullScreen
//       PaperProps={{
//         sx: {
//           backgroundColor: "transparent",
//           boxShadow: "none",
//         },
//       }}
//     >
//       {/* Blur background */}
//       <Box
//         sx={{
//           position: "fixed",
//           inset: 0,
//           backdropFilter: "blur(8px)",
//           backgroundColor: "rgba(255,255,255,0.3)",
//         }}
//         onClick={onClose}
//       />

//       {/* Centered card */}
//       <Box
//         sx={{
//           position: "relative",
//           margin: "auto",
//           maxWidth: 600,
//           width: "95%",
//           maxHeight: "90vh",
//           overflowY: "auto",
//           bgcolor: "rgba(255,255,255,0.85)",   // 🔥 opacity added
//           backdropFilter: "blur(6px)",         // 🔥 glass effect
//           borderRadius: 3,
//           p: 3,
//           zIndex: 10,
//         }}
//       >
//         <Typography variant="h5" fontWeight={500} mb={2}>
//           Add Portfolio
//         </Typography>

//         {/* All TextFields updated with borderRadius */}
//         <TextField
//           label="Project Title"
//           fullWidth
//           margin="normal"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           sx={{
//             "& .MuiOutlinedInput-root": { borderRadius: "12px" },
//           }}
//         />

//         <TextField
//           label="Project Description"
//           fullWidth
//           margin="normal"
//           multiline
//           minRows={3}
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           sx={{
//             "& .MuiOutlinedInput-root": { borderRadius: "12px" },
//           }}
//         />

//         <Typography variant="subtitle1" mt={2}>
//           Skills ({selectedSkills.length}/3)
//         </Typography>
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
//           {selectedSkills.map((skill) => (
//             <Chip key={skill} label={skill} onDelete={() => handleDeleteSkill(skill)} />
//           ))}
//         </Box>

//         <TextField
//           select
//           fullWidth
//           label="Select Skill"
//           value=""
//           onChange={(e) => handleAddSkill(e.target.value)}
//           sx={{
//             "& .MuiOutlinedInput-root": { borderRadius: "12px" },
//           }}
//         >
//           {skillOptions.map((skill) => (
//             <MenuItem key={skill} value={skill}>
//               {skill}
//             </MenuItem>
//           ))}
//         </TextField>

//         <Typography variant="subtitle1" mt={2}>
//           Tools ({selectedTools.length}/5)
//         </Typography>
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
//           {selectedTools.map((tool) => (
//             <Chip key={tool} label={tool} onDelete={() => handleDeleteTool(tool)} />
//           ))}
//         </Box>

//         <TextField
//           select
//           fullWidth
//           label="Select Tool"
//           value=""
//           onChange={(e) => handleAddTool(e.target.value)}
//           sx={{
//             "& .MuiOutlinedInput-root": { borderRadius: "12px" },
//           }}
//         >
//           {toolOptions.map((tool) => (
//             <MenuItem key={tool} value={tool}>
//               {tool}
//             </MenuItem>
//           ))}
//         </TextField>

//         <TextField
//           label="Project URL"
//           fullWidth
//           margin="normal"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           sx={{
//             "& .MuiOutlinedInput-root": { borderRadius: "12px" },
//           }}
//         />

//         <DialogActions sx={{ px: 0, mt: 3 }}>
//           <Button
//             onClick={onClose}
//             variant="outlined"
//             sx={{
//               width: "120px",  
//               borderColor: "rgba(124, 60, 255, 1)",
//               borderRadius: "8px",
//               color: "rgba(124, 60, 255, 1)",
//             }}
//           >
//             Cancel
//           </Button>

//           <Button
//             onClick={handleSave}
//             variant="contained"
//             disabled={loading}
//             startIcon={loading && <CircularProgress size={20} />}
//             sx={{
//               width: "120px",  
//               borderRadius: "8px",
//               bgcolor: "rgba(124, 60, 255, 1)",
//               color: "#fff",
         
//             }}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Box>
//     </Dialog>
//   );
// };

// export default AddPortfolioPopup;


import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Box,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firbase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
  
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
const AddPortfolioPopup = ({ open, onClose }) => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddSkill = (skill) => {
    if (!selectedSkills.includes(skill) && selectedSkills.length < 3) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddTool = (tool) => {
    if (!selectedTools.includes(tool) && selectedTools.length < 5) {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleDeleteSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleDeleteTool = (tool) => {
    setSelectedTools(selectedTools.filter((t) => t !== tool));
  };

  const validateUrl = (url) => {
    const urlPattern = /^(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    return urlPattern.test(url);
  };

  const handleSave = async () => {
    if (!user) return alert("You must be logged in");
    if (!title.trim()) return alert("Project title is required");
    if (description.trim().length < 120)
      return alert("Project description must be at least 120 characters");
    if (selectedSkills.length < 3) return alert("Please select at least 3 skills");
    if (selectedTools.length < 3) return alert("Please select at least 3 tools");
    if (!url.trim() || !validateUrl(url))
      return alert("Please enter a valid project link (http/https)");

    setLoading(true);
    try {
      const portfolioRef = collection(db, "users", user.uid, "portfolio");
      await addDoc(portfolioRef, {
        title: title.trim(),
        description: description.trim(),
        skills: selectedSkills,
        tools: selectedTools,
        projectUrl: url.trim(),
        createdAt: serverTimestamp(),
      });
        // ✅ Reset form
    setTitle("");
    setDescription("");
    setUrl("");
    setSelectedSkills([]);
    setSelectedTools([]);
      alert("Portfolio saved successfully");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving portfolio: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      {/* Blur background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255,255,255,0.3)",
        }}
        onClick={onClose}
      />

      {/* Centered card */}
      <Box
        sx={{
          position: "relative",
          margin: "auto",
          maxWidth: 600,
          width: "95%",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "rgba(255,255,255,0.85)",   // 🔥 opacity added
          backdropFilter: "blur(6px)",         // 🔥 glass effect
          borderRadius: 3,
          p: 3,
          zIndex: 10,
        }}
      >
        <Typography variant="h5" fontWeight={500} mb={2}>
          Add Portfolio
        </Typography>

        {/* All TextFields updated with borderRadius */}
        <TextField
          label="Project Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />

        <TextField
          label="Project Description"
          fullWidth
          margin="normal"
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />

        <Typography variant="subtitle1" mt={2}>
          Skills ({selectedSkills.length}/3)
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {selectedSkills.map((skill) => (
            <Chip key={skill} label={skill} onDelete={() => handleDeleteSkill(skill)} />
          ))}
        </Box>

        <TextField
          select
          fullWidth
          label="Select Skill"
          value=""
          onChange={(e) => handleAddSkill(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        >
          {skillOptions.map((skill) => (
            <MenuItem key={skill} value={skill}>
              {skill}
            </MenuItem>
          ))}
        </TextField>

        <Typography variant="subtitle1" mt={2}>
          Tools ({selectedTools.length}/5)
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {selectedTools.map((tool) => (
            <Chip key={tool} label={tool} onDelete={() => handleDeleteTool(tool)} />
          ))}
        </Box>

        <TextField
          select
          fullWidth
          label="Select Tool"
          value=""
          onChange={(e) => handleAddTool(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        >
          {toolOptions.map((tool) => (
            <MenuItem key={tool} value={tool}>
              {tool}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Project URL"
          fullWidth
          margin="normal"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />

        <DialogActions sx={{ px: 0, mt: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              width: "120px",  
              borderColor: "rgba(124, 60, 255, 1)",
              borderRadius: "8px",
              color: "rgba(124, 60, 255, 1)",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              width: "120px",  
              borderRadius: "8px",
              bgcolor: "rgba(124, 60, 255, 1)",
              color: "#fff",
         
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddPortfolioPopup;