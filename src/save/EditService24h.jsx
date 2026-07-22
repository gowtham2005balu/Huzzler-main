// // EditService24h.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import Select from "react-select";

// export default function EditService24h() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const jobId = location?.state?.jobId || null;
//   const jobData = location?.state?.jobData || null;

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [tools, setTools] = useState([]);
//   const [notes, setNotes] = useState("");
//   const [budget, setBudget] = useState("");
//   const [category, setCategory] = useState(null);

//   const [saving, setSaving] = useState(false);

//   // Options
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

//   const skillOptions = jobData?.skills?.map(s => ({ label: s, value: s })) || [];
//   const toolOptions = jobData?.tools?.map(t => ({ label: t, value: t })) || [];

//   // Prefill
//   useEffect(() => {
//     if (jobData) {
//       setTitle(jobData.title || "");
//       setDescription(jobData.description || "");
//       setSkills((jobData.skills || []).map(s => ({ label: s, value: s })));
//       setTools((jobData.tools || []).map(t => ({ label: t, value: t })));
//       setNotes(jobData.notes || "");
//       setBudget(jobData.budget || "");
//       setCategory(
//         jobData.category ? { label: jobData.category, value: jobData.category } : null
//       );
//     }
//   }, [jobData]);

//   // Save
//   const handleSave = async () => {
//     if (!jobId) return alert("Invalid job ID");

//     if (!title.trim()) return alert("Title required");
//     if (!description.trim()) return alert("Description required");
//     if (!category) return alert("Category required");

//     setSaving(true);

//     try {
//       await updateDoc(doc(db, "service_24h", jobId), {
//         title: title.trim(),
//         description: description.trim(),
//         category: category.value,
//         skills: skills.map(s => s.value),
//         tools: tools.map(t => t.value),
//         notes,
//         budget,
//         updatedAt: new Date(),
//       });

//       alert("24 Hour Service updated!");
//       navigate(-1);
//     } catch (error) {
//       console.error("Error updating 24h service:", error);
//       alert("Update failed: " + error.message);
//     }

//     setSaving(false);
//   };

//   return (
//     <div style={styles.wrapper}>
//       <h2>Edit 24-Hour Service</h2>

//       <label style={styles.label}>Title</label>
//       <input
//         style={styles.input}
//         value={title}
//         onChange={e => setTitle(e.target.value)}
//       />

//       <label style={styles.label}>Description</label>
//       <textarea
//         style={styles.textarea}
//         value={description}
//         onChange={e => setDescription(e.target.value)}
//       />

//       <label style={styles.label}>Category</label>
//       <Select
//         value={category}
//         onChange={setCategory}
//         options={categoryOptions}
//       />

//       <label style={styles.label}>Skills</label>
//       <Select
//         isMulti
//         options={skillOptions}
//         value={skills}
//         onChange={setSkills}
//       />

//       <label style={styles.label}>Tools</label>
//       <Select
//         isMulti
//         options={toolOptions}
//         value={tools}
//         onChange={setTools}
//       />

//       <label style={styles.label}>Budget</label>
//       <input
//         style={styles.input}
//         value={budget}
//         onChange={e => setBudget(e.target.value)}
//       />

//       <label style={styles.label}>Notes</label>
//       <textarea
//         style={styles.textarea}
//         value={notes}
//         onChange={e => setNotes(e.target.value)}
//       />

//       <div style={styles.btnRow}>
//         <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
//           Cancel
//         </button>

//         <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
//           {saving ? "Saving..." : "Save Changes"}
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   wrapper: {
//     maxWidth: "700px",
//     margin: "0 auto",
//     padding: "20px",
//   },
//   label: {
//     fontWeight: "bold",
//     marginTop: "15px",
//   },
//   input: {
//     width: "100%",
//     padding: "8px",
//     marginTop: "5px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   textarea: {
//     width: "100%",
//     minHeight: "140px",
//     padding: "8px",
//     marginTop: "5px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   btnRow: {
//     marginTop: "20px",
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   cancelBtn: {
//     padding: "10px 18px",
//     background: "gray",
//     color: "white",
//     borderRadius: "5px",
//     border: "none",
//     cursor: "pointer",
//   },
//   saveBtn: {
//     padding: "10px 18px",
//     background: "#007bff",
//     color: "white",
//     borderRadius: "5px",
//     border: "none",
//     cursor: "pointer",
//   },
// };


// // EditService24h.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import Select from "react-select";

// export default function EditService24h() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const jobId = location?.state?.jobId || null;
//   const jobData = location?.state?.jobData || null;

//   // ⭐ 1️⃣ SIDEBAR COLLAPSED STATE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ⭐ 2️⃣ LISTEN FOR SIDEBAR TOGGLE EVENT
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [tools, setTools] = useState([]);
//   const [notes, setNotes] = useState("");
//   const [budget, setBudget] = useState("");
//   const [category, setCategory] = useState(null);

//   const [saving, setSaving] = useState(false);

//   // Options
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
//   ].map((e) => ({ label: e, value: e }));

//   const skillOptions =
//     jobData?.skills?.map((s) => ({ label: s, value: s })) || [];
//   const toolOptions =
//     jobData?.tools?.map((t) => ({ label: t, value: t })) || [];

//   useEffect(() => {
//     if (jobData) {
//       setTitle(jobData.title || "");
//       setDescription(jobData.description || "");
//       setSkills((jobData.skills || []).map((s) => ({ label: s, value: s })));
//       setTools((jobData.tools || []).map((t) => ({ label: t, value: t })));
//       setNotes(jobData.notes || "");
//       setBudget(jobData.budget || "");
//       setCategory(
//         jobData.category
//           ? { label: jobData.category, value: jobData.category }
//           : null
//       );
//     }
//   }, [jobData]);

//   const handleSave = async () => {
//     if (!jobId) return alert("Invalid job ID");

//     if (!title.trim()) return alert("Title required");
//     if (!description.trim()) return alert("Description required");
//     if (!category) return alert("Category required");

//     setSaving(true);

//     try {
//       await updateDoc(doc(db, "service_24h", jobId), {
//         title: title.trim(),
//         description: description.trim(),
//         category: category.value,
//         skills: skills.map((s) => s.value),
//         tools: tools.map((t) => t.value),
//         notes,
//         budget,
//         updatedAt: new Date(),
//       });

//       alert("24 Hour Service updated!");
//       navigate(-1);
//     } catch (error) {
//       console.error("Error updating 24h service:", error);
//       alert("Update failed: " + error.message);
//     }

//     setSaving(false);
//   };

//   // ⭐ 3️⃣ WRAP WHOLE UI IN MARGIN-LEFT SIDEBAR ANIMATION
//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={styles.wrapper}>
//         <h2>Edit 24-Hour Service</h2>

//         <label style={styles.label}>Title</label>
//         <input
//           style={styles.input}
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <label style={styles.label}>Description</label>
//         <textarea
//           style={styles.textarea}
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <label style={styles.label}>Category</label>
//         <Select value={category} onChange={setCategory} options={categoryOptions} />

//         <label style={styles.label}>Skills</label>
//         <Select isMulti options={skillOptions} value={skills} onChange={setSkills} />

//         <label style={styles.label}>Tools</label>
//         <Select isMulti options={toolOptions} value={tools} onChange={setTools} />

//         <label style={styles.label}>Budget</label>
//         <input
//           style={styles.input}
//           value={budget}
//           onChange={(e) => setBudget(e.target.value)}
//         />

//         <label style={styles.label}>Notes</label>
//         <textarea
//           style={styles.textarea}
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//         />

//         <div style={styles.btnRow}>
//           <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
//             Cancel
//           </button>

//           <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
//             {saving ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // -------------------------------------
// // STYLES — unchanged
// // -------------------------------------

// const styles = {
//   wrapper: {
//     maxWidth: "700px",
//     margin: "0 auto",
//     padding: "20px",
//   },
//   label: {
//     fontWeight: "bold",
//     marginTop: "15px",
//   },
//   input: {
//     width: "100%",
//     padding: "8px",
//     marginTop: "5px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   textarea: {
//     width: "100%",
//     minHeight: "140px",
//     padding: "8px",
//     marginTop: "5px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   btnRow: {
//     marginTop: "20px",
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   cancelBtn: {
//     padding: "10px 18px",
//     background: "gray",
//     color: "white",
//     borderRadius: "5px",
//     border: "none",
//     cursor: "pointer",
//   },
//   saveBtn: {
//     padding: "10px 18px",
//     background: "#007bff",
//     color: "white",
//     borderRadius: "5px",
//     border: "none",
//     cursor: "pointer",
//   },
// };




// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import Select from "react-select";
// import { useParams } from "react-router-dom";
// import { getDoc } from "firebase/firestore";




// export default function EditService24h() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();

//   const jobId = location?.state?.jobId || null;
//   const jobData = location?.state?.jobData || null;

//   // ⭐ 1️⃣ SIDEBAR COLLAPSED STATE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ⭐ 2️⃣ LISTEN FOR SIDEBAR TOGGLE EVENT
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);




//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [tools, setTools] = useState([]);
//   const [notes, setNotes] = useState("");
//   const [budgetFrom, setBudgetFrom] = useState("");
//   const [budgetTo, setBudgetTo] = useState("");

//   const [category, setCategory] = useState(null);

//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (jobData || !id) return;

//     const fetchService = async () => {
//       const snap = await getDoc(doc(db, "service_24h", id));

//       if (snap.exists()) {
//         const data = snap.data();

//         setTitle(data.title || "");
//         setDescription(data.description || "");
//         setSkills((data.skills || []).map(s => ({ label: s, value: s })));
//         setTools((data.tools || []).map(t => ({ label: t, value: t })));
//         setNotes(data.clientRequirements || "");

//         setBudgetFrom(data.budget_from || "");
//         setBudgetTo(data.budget_to || "");

//         setCategory(
//           data.category
//             ? { label: data.category, value: data.category }
//             : null
//         );
//       }
//     };

//     fetchService();
//   }, [id, jobData]);




//   // Options
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
//   ].map((e) => ({ label: e, value: e }));

//   const skillOptions =
//     jobData?.skills?.map((s) => ({ label: s, value: s })) || [];
//   const toolOptions =
//     jobData?.tools?.map((t) => ({ label: t, value: t })) || [];

//   useEffect(() => {
//     if (jobData) {
//       setTitle(jobData.title || "");
//       setDescription(jobData.description || "");
//       setSkills((jobData.skills || []).map((s) => ({ label: s, value: s })));
//       setTools((jobData.tools || []).map((t) => ({ label: t, value: t })));
//       setNotes(jobData.notes || "");
//       setBudget(jobData.budget || "");
//       setCategory(
//         jobData.category
//           ? { label: jobData.category, value: jobData.category }
//           : null
//       );
//     }
//   }, [jobData]);

//   const handleSave = async () => {
//     if (!id) return alert("Invalid service ID");

//     if (!title.trim()) return alert("Title required");
//     if (!description.trim()) return alert("Description required");
//     if (!category) return alert("Category required");

//     setSaving(true);

//     try {
//       await updateDoc(doc(db, "service_24h", id), {
//         title: title.trim(),
//         description: description.trim(),
//         category: category.value,
//         skills: skills.map(s => s.value),
//         tools: tools.map(t => t.value),
//         clientRequirements: notes,
//         budget_from: Number(budgetFrom),
//         budget_to: Number(budgetTo),
//         updatedAt: new Date(),
//       });

//       alert("24 Hour Service updated!");
//       navigate(-1);
//     } catch (error) {
//       console.error("Update failed:", error);
//       alert(error.message);
//     }

//     setSaving(false);
//   };

//   // ⭐ 3️⃣ WRAP WHOLE UI IN MARGIN-LEFT SIDEBAR ANIMATION
//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={styles.wrapper}>
//         <h2>Edit 24-Hour Service</h2>

//         <label style={styles.label}>Title</label>
//         <input
//           style={styles.input}
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <label style={styles.label}>Description</label>
//         <textarea
//           style={styles.textarea}
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <label style={styles.label}>Category</label>
//         <Select value={category} onChange={setCategory} options={categoryOptions} />

//         <label style={styles.label}>Skills</label>
//         <Select isMulti options={skillOptions} value={skills} onChange={setSkills} />

//         <label style={styles.label}>Tools</label>
//         <Select isMulti options={toolOptions} value={tools} onChange={setTools} />

//         <label style={styles.label}>Budget From</label>
//         <input
//           type="number"
//           style={styles.input}
//           value={budgetFrom}
//           onChange={(e) => setBudgetFrom(e.target.value)}
//         />

//         <label style={styles.label}>Budget To</label>
//         <input
//           type="number"
//           style={styles.input}
//           value={budgetTo}
//           onChange={(e) => setBudgetTo(e.target.value)}
//         />


//         <label style={styles.label}>Notes</label>
//         <textarea
//           style={styles.textarea}
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//         />

//         <div style={styles.btnRow}>
//           <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
//             Cancel
//           </button>

//           <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
//             {saving ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // -------------------------------------
// // STYLES — unchanged
// // -------------------------------------

// const styles = {
//   wrapper: {
//     maxWidth: "700px",
//     margin: "0 auto",
//     padding: "20px",
//   },
//   label: {
//     fontWeight: "bold",
//     marginTop: "15px",
//   },
//   input: {
//     width: "100%",
//     padding: "8px",
//     marginTop: "5px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   textarea: {
//     width: "100%",
//     minHeight: "140px",
//     padding: "8px",
//     marginTop: "5px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   btnRow: {
//     marginTop: "20px",
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   cancelBtn: {
//     padding: "10px 18px",
//     background: "gray",
//     color: "white",
//     borderRadius: "5px",
//     border: "none",
//     cursor: "pointer",
//   },
//   saveBtn: {
//     padding: "10px 18px",
//     background: "#007bff",
//     color: "white",
//     borderRadius: "5px",
//     border: "none",
//     cursor: "pointer",
//   },
// };




import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firbase/Firebase";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { getDoc } from "firebase/firestore";




export default function EditService24h() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const jobId = location?.state?.jobId || null;
    const jobData = location?.state?.jobData || null;

    // ⭐ 1️⃣ SIDEBAR COLLAPSED STATE
    const [collapsed, setCollapsed] = useState(
        localStorage.getItem("sidebar-collapsed") === "true"
    );

    // ⭐ 2️⃣ LISTEN FOR SIDEBAR TOGGLE EVENT
    useEffect(() => {
        function handleToggle(e) {
            setCollapsed(e.detail);
        }
        window.addEventListener("sidebar-toggle", handleToggle);
        return () => window.removeEventListener("sidebar-toggle", handleToggle);
    }, []);




    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [budgetFrom, setBudgetFrom] = useState("");
    const [budgetTo, setBudgetTo] = useState("");

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



    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (jobData || !id) return;

        const fetchService = async () => {
            const snap = await getDoc(doc(db, "service_24h", id));

            if (snap.exists()) {
                const data = snap.data();

                setTitle(data.title || "");
                setDescription(data.description || "");
                setSkills((data.skills || []).map(s => ({ label: s, value: s })));
                setTools((data.tools || []).map(t => ({ label: t, value: t })));
                setNotes(data.clientRequirements || "");

                setBudgetFrom(data.budget_from || "");
                setBudgetTo(data.budget_to || "");

                setCategory(
                    data.category
                        ? { label: data.category, value: data.category }
                        : null
                );

                setCategory(
                    data.category ? { label: data.category, value: data.category } : null
                );

                setSkills((data.skills || []).map(s => ({ label: s, value: s })));
                setTools((data.tools || []).map(t => ({ label: t, value: t })));

            }
        };


        fetchService();
    }, [id, jobData]);



    useEffect(() => {
        if (jobData) {
            setTitle(jobData.title || "");
            setDescription(jobData.description || "");
            setSkills((jobData.skills || []).map((s) => ({ label: s, value: s })));
            setTools((jobData.tools || []).map((t) => ({ label: t, value: t })));
            setNotes(jobData.notes || "");
            setBudget(jobData.budget || "");
            setCategory(
                jobData.category
                    ? { label: jobData.category, value: jobData.category }
                    : null
            );
        }
    }, [jobData]);

    const handleSave = async () => {
        if (!id) return alert("Invalid service ID");

        if (!title.trim()) return alert("Title required");
        if (!description.trim()) return alert("Description required");
        if (!category) return alert("Category required");

        setSaving(true);

        try {
            await updateDoc(doc(db, "service_24h", id), {
                title: title.trim(),
                description: description.trim(),
                category: category.value,
                skills: skills.map(s => s.value),
                tools: tools.map(t => t.value),
                clientRequirements: notes,
                budget_from: Number(budgetFrom),
                budget_to: Number(budgetTo),
                updatedAt: new Date(),
            });

            alert("24 Hour Service updated!");
            navigate(-1);
        } catch (error) {
            console.error("Update failed:", error);
            alert(error.message);
        }

        setSaving(false);
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
        <div
            className="freelance-wrapper"
            style={{
                marginLeft: collapsed ? "-110px" : "10px",
                transition: "margin-left 0.25s ease",
            }}
        >
            <div style={styles.wrapper}>
                <h2>Edit 24-Hour Services</h2>

                <label style={styles.label}>Title</label>
                <input
                    style={styles.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label style={styles.label}>Description</label>
                <textarea
                    style={styles.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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


                <label style={styles.label}>Budget From</label>
                <input
                    type="number"
                    style={styles.input}
                    value={budgetFrom}
                    onChange={(e) => setBudgetFrom(e.target.value)}
                />

                <label style={styles.label}>Budget To</label>
                <input
                    type="number"
                    style={styles.input}
                    value={budgetTo}
                    onChange={(e) => setBudgetTo(e.target.value)}
                />


                <label style={styles.label}>Notes</label>
                <textarea
                    style={styles.textarea}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                <div style={styles.btnRow}>
                    {/* <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
 Cancel
 </button> */}

                    <button style={styles.updateBtn} onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Update Service"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        fontFamily: "Rubik, sans-serif",
        padding: "22px",
        boxSizing: "border-box",
        marginTop:"30px",
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
