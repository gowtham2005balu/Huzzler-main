
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../firbase/Firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// export default function EditServiceForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);

//   // ⭐ 1️⃣ SIDEBAR COLLAPSED STATE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ⭐ 2️⃣ LISTEN FOR SIDEBAR TOGGLE
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     budget_from: "",
//     budget_to: "",
//     timeline: "",
//     category: "",
//     skills: "",
//     tools: "",
//     sample_project_url: "",
//     freelancer_requirements: "",
//   });

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const ref = doc(db, "services", id);
//         const snap = await getDoc(ref);

//         if (!snap.exists()) {
//           alert("Service not found");
//           return navigate(-1);
//         }

//         const data = snap.data();

//         setForm({
//           title: data.title || "",
//           description: data.description || "",
//           budget_from: data.budget_from || "",
//           budget_to: data.budget_to || "",
//           timeline: data.timeline || "",
//           category: data.category || "",
//           skills: (data.skills || []).join(", "),
//           tools: (data.tools || []).join(", "),
//           sample_project_url: data.sample_project_url || "",
//           freelancer_requirements: data.freelancer_requirements || "",
//         });

//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load service");
//       }
//     }

//     fetchData();
//   }, [id, navigate]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleUpdate = async () => {
//     try {
//       const ref = doc(db, "services", id);

//       const payload = {
//         title: form.title,
//         description: form.description,
//         budget_from: form.budget_from,
//         budget_to: form.budget_to,
//         timeline: form.timeline,
//         category: form.category,
//         sample_project_url: form.sample_project_url,
//         freelancer_requirements: form.freelancer_requirements,
//         skills: form.skills.split(",").map((s) => s.trim()),
//         tools: form.tools.split(",").map((t) => t.trim()),
//         updated_at: new Date(),
//       };

//       await updateDoc(ref, payload);
//       alert("Service updated successfully!");
//       navigate(-1);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to update service.");
//     }
//   };

//   if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

//   // ⭐ 3️⃣ WRAP ENTIRE UI WITH SIDEBAR MARGIN TRANSITION
//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div style={styles.wrapper}>
//         <h2 style={styles.heading}>Edit Service</h2>

//         {/* SERVICE TITLE */}
//         <div style={styles.section}>
//           <label style={styles.label}>Service Title</label>
//           <input
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             placeholder="Service Title"
//             style={styles.input}
//           />
//         </div>

//         {/* SERVICE DESCRIPTION */}
//         <div style={styles.section}>
//           <label style={styles.label}>Project Description</label>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Describe your service..."
//             style={styles.textarea}
//           />
//         </div>

//         {/* BUDGET */}
//         <div style={styles.row}>
//           <div style={{ flex: 1, marginRight: 10 }}>
//             <label style={styles.label}>Budget From</label>
//             <input
//               name="budget_from"
//               value={form.budget_from}
//               onChange={handleChange}
//               placeholder="₹0"
//               style={styles.input}
//             />
//           </div>
//           <div style={{ flex: 1, marginLeft: 10 }}>
//             <label style={styles.label}>Budget To</label>
//             <input
//               name="budget_to"
//               value={form.budget_to}
//               onChange={handleChange}
//               placeholder="₹0"
//               style={styles.input}
//             />
//           </div>
//         </div>

//         {/* TIMELINE */}
//         <div style={styles.section}>
//           <label style={styles.label}>Timeline</label>
//           <input
//             name="timeline"
//             value={form.timeline}
//             onChange={handleChange}
//             placeholder="Timeline"
//             style={styles.input}
//           />
//         </div>

//         {/* CATEGORY */}
//         <div style={styles.section}>
//           <label style={styles.label}>Category</label>
//           <input
//             name="category"
//             value={form.category}
//             onChange={handleChange}
//             placeholder="Category"
//             style={styles.input}
//           />
//         </div>

//         {/* SKILLS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Skills (comma separated)</label>
//           <input
//             name="skills"
//             value={form.skills}
//             onChange={handleChange}
//             placeholder="e.g., UI, UX, Figma"
//             style={styles.input}
//           />
//         </div>

//         {/* TOOLS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Tools (comma separated)</label>
//           <input
//             name="tools"
//             value={form.tools}
//             onChange={handleChange}
//             placeholder="e.g., Figma, Adobe XD"
//             style={styles.input}
//           />
//         </div>

//         {/* SAMPLE URL */}
//         <div style={styles.section}>
//           <label style={styles.label}>Sample Project URL</label>
//           <input
//             name="sample_project_url"
//             value={form.sample_project_url}
//             onChange={handleChange}
//             placeholder="https://example.com"
//             style={styles.input}
//           />
//         </div>

//         {/* REQUIREMENTS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Freelancer Requirements</label>
//           <textarea
//             name="freelancer_requirements"
//             value={form.freelancer_requirements}
//             onChange={handleChange}
//             placeholder="Specify requirements"
//             style={styles.textarea}
//           />
//         </div>

//         {/* UPDATE BUTTON */}
//         <button onClick={handleUpdate} style={styles.updateBtn}>
//           Update Service
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   wrapper: {
//     maxWidth: "700px",
//     margin: "40px auto",
//     padding: "30px",
//     background: "#fff",
//     borderRadius: "16px",
//     boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//     fontFamily: "Rubik, sans-serif",
//   },
//   heading: {
//     textAlign: "center",
//     fontSize: "26px",
//     fontWeight: 700,
//     marginBottom: "30px",
//   },
//   section: {
//     marginBottom: "20px",
//   },
//   row: {
//     display: "flex",
//     gap: "10px",
//     marginBottom: "20px",
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




// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../firbase/Firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// export default function EditServiceForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);

//   // ⭐ SIDEBAR STATE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ⭐ RESPONSIVE FLAG
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   // ⭐ LISTEN FOR SIDEBAR TOGGLE
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     budget_from: "",
//     budget_to: "",
//     timeline: "",
//     category: "",
//     skills: "",
//     tools: "",
//     sample_project_url: "",
//     freelancer_requirements: "",
//   });

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const ref = doc(db, "services", id);
//         const snap = await getDoc(ref);

//         if (!snap.exists()) {
//           alert("Service not found");
//           return navigate(-1);
//         }

//         const data = snap.data();

//         setForm({
//           title: data.title || "",
//           description: data.description || "",
//           budget_from: data.budget_from || "",
//           budget_to: data.budget_to || "",
//           timeline: data.timeline || "",
//           category: data.category || "",
//           skills: (data.skills || []).join(", "),
//           tools: (data.tools || []).join(", "),
//           sample_project_url: data.sample_project_url || "",
//           freelancer_requirements: data.freelancer_requirements || "",
//         });

//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load service");
//       }
//     }

//     fetchData();
//   }, [id, navigate]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleUpdate = async () => {
//     try {
//       const ref = doc(db, "services", id);

//       const payload = {
//         title: form.title,
//         description: form.description,
//         budget_from: form.budget_from,
//         budget_to: form.budget_to,
//         timeline: form.timeline,
//         category: form.category,
//         sample_project_url: form.sample_project_url,
//         freelancer_requirements: form.freelancer_requirements,
//         skills: form.skills.split(",").map((s) => s.trim()),
//         tools: form.tools.split(",").map((t) => t.trim()),
//         updated_at: new Date(),
//       };

//       await updateDoc(ref, payload);
//       alert("Service updated successfully!");
//       navigate(-1);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to update service.");
//     }
//   };

//   if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-110px" : "50px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div
//         style={{
//           ...styles.wrapper,
//           margin: isMobile ? "20px 12px" : "40px auto",
//           padding: isMobile ? "20px" : "30px",
//         }}
//       >
//         <h2
//           style={{
//             ...styles.heading,
//             fontSize: isMobile ? "22px" : "26px",
//           }}
//         >
//           Edit Service
//         </h2>

//         {/* SERVICE TITLE */}
//         <div style={styles.section}>
//           <label style={styles.label}>Service Title</label>
//           <input
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             placeholder="Service Title"
//             style={styles.input}
//           />
//         </div>

//         {/* DESCRIPTION */}
//         <div style={styles.section}>
//           <label style={styles.label}>Project Description</label>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Describe your service..."
//             style={styles.textarea}
//           />
//         </div>

//         {/* BUDGET */}
//         <div
//           style={{
//             ...styles.row,
//             flexDirection: isMobile ? "column" : "row",
//           }}
//         >
//           <div style={{ flex: 1 }}>
//             <label style={styles.label}>Budget From</label>
//             <input
//               name="budget_from"
//               value={form.budget_from}
//               onChange={handleChange}
//               placeholder="₹0"
//               style={styles.input}
//             />
//           </div>
//           <div style={{ flex: 1 }}>
//             <label style={styles.label}>Budget To</label>
//             <input
//               name="budget_to"
//               value={form.budget_to}
//               onChange={handleChange}
//               placeholder="₹0"
//               style={styles.input}
//             />
//           </div>
//         </div>

//         {/* TIMELINE */}
//         <div style={styles.section}>
//           <label style={styles.label}>Timeline</label>
//           <input
//             name="timeline"
//             value={form.timeline}
//             onChange={handleChange}
//             placeholder="Timeline"
//             style={styles.input}
//           />
//         </div>

//         {/* CATEGORY */}
//         <div style={styles.section}>
//           <label style={styles.label}>Category</label>
//           <input
//             name="category"
//             value={form.category}
//             onChange={handleChange}
//             placeholder="Category"
//             style={styles.input}
//           />
//         </div>

//         {/* SKILLS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Skills (comma separated)</label>
//           <input
//             name="skills"
//             value={form.skills}
//             onChange={handleChange}
//             placeholder="e.g., UI, UX, Figma"
//             style={styles.input}
//           />
//         </div>

//         {/* TOOLS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Tools (comma separated)</label>
//           <input
//             name="tools"
//             value={form.tools}
//             onChange={handleChange}
//             placeholder="e.g., Figma, Adobe XD"
//             style={styles.input}
//           />
//         </div>

//         {/* SAMPLE URL */}
//         <div style={styles.section}>
//           <label style={styles.label}>Sample Project URL</label>
//           <input
//             name="sample_project_url"
//             value={form.sample_project_url}
//             onChange={handleChange}
//             placeholder="https://example.com"
//             style={styles.input}
//           />
//         </div>

//         {/* REQUIREMENTS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Freelancer Requirements</label>
//           <textarea
//             name="freelancer_requirements"
//             value={form.freelancer_requirements}
//             onChange={handleChange}
//             placeholder="Specify requirements"
//             style={styles.textarea}
//           />
//         </div>

//         <button onClick={handleUpdate} style={styles.updateBtn}>
//           Update Service
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   wrapper: {
//     maxWidth: "700px",
//     background: "#fff",
//     borderRadius: "16px",
//     boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//     fontFamily: "Rubik, sans-serif",
//   },
//   heading: {
//     textAlign: "center",
//     fontWeight: 700,
//     marginBottom: "30px",
//   },
//   section: {
//     marginBottom: "20px",
//   },
//   row: {
//     display: "flex",
//     gap: "10px",
//     marginBottom: "20px",
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







// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../firbase/Firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { color } from "framer-motion";

// export default function EditServiceForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);

//   // ⭐ SIDEBAR STATE
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   // ⭐ RESPONSIVE FLAG
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const resize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   // ⭐ LISTEN FOR SIDEBAR TOGGLE
//   useEffect(() => {
//     function handleToggle(e) {
//       setCollapsed(e.detail);
//     }
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     budget_from: "",
//     budget_to: "",
//     timeline: "",
//     category: "",
//     skills: "",
//     tools: "",
//     sample_project_url: "",
//     freelancer_requirements: "",
//   });

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const ref = doc(db, "services", id);
//         const snap = await getDoc(ref);

//         if (!snap.exists()) {
//           alert("Service not found");
//           return navigate(-1);
//         }

//         const data = snap.data();

//         setForm({
//           title: data.title || "",
//           description: data.description || "",
//           budget_from: data.budget_from || "",
//           budget_to: data.budget_to || "",
//           timeline: data.timeline || "",
//           category: data.category || "",
//           skills: (data.skills || []).join(", "),
//           tools: (data.tools || []).join(", "),
//           sample_project_url: data.sample_project_url || "",
//           freelancer_requirements: data.freelancer_requirements || "",
//         });

//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load service");
//       }
//     }

//     fetchData();
//   }, [id, navigate]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleUpdate = async () => {
//     try {
//       const ref = doc(db, "services", id);

//       const payload = {
//         title: form.title,
//         description: form.description,
//         budget_from: form.budget_from,
//         budget_to: form.budget_to,
//         timeline: form.timeline,
//         category: form.category,
//         sample_project_url: form.sample_project_url,
//         freelancer_requirements: form.freelancer_requirements,
//         skills: form.skills.split(",").map((s) => s.trim()),
//         tools: form.tools.split(",").map((t) => t.trim()),
//         updated_at: new Date(),
//       };

//       await updateDoc(ref, payload);
//       alert("Service updated successfully!");
//       navigate(-1);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to update service.");
//     }
//   };

//   if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

//   return (
//     <div
//       className="freelance-wrapper"
//       style={{
//         marginLeft: isMobile ? "0px" : collapsed ? "-190px" : "-90px",
//         transition: "margin-left 0.25s ease",
//       }}
//     >
//       <div
//         style={{
//           ...styles.wrapper,
//           margin: isMobile ? "22px 12px" : "40px auto",
//           padding: isMobile ? "22px" : "30px",
//         }}
//       >
//         <h2
//           style={{
//             ...styles.heading,
//             fontSize: isMobile ? "22px" : "26px",
//           }}
//         >
//           Edit Service
//         </h2>

//         {/* SERVICE TITLE */}
//         <div style={styles.section}>
//           <label style={styles.label}>Service Title</label>
//           <input
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             placeholder="Service Title"
//             style={styles.input}
//           />
//         </div>

//         {/* DESCRIPTION */}
//         <div style={styles.section}>
//           <label style={styles.label}>Project Description</label>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Describe your service..."
//             style={styles.textarea}
//           />
//         </div>

//         {/* BUDGET */}
//         <div
//           style={{
//             ...styles.row,
//             flexDirection: isMobile ? "column" : "row",
//           }}
//         >
//           <div style={{ flex: 1 }}>
//             <label style={styles.label}>Budget From</label>
//             <input
//               name="budget_from"
//               value={form.budget_from}
//               onChange={handleChange}
//               placeholder="₹0"
//               style={styles.input}
//             />
//           </div>
//           <div style={{ flex: 1 }}>
//             <label style={styles.label}>Budget To</label>
//             <input
//               name="budget_to"
//               value={form.budget_to}
//               onChange={handleChange}
//               placeholder="₹0"
//               style={styles.input}
//             />
//           </div>
//         </div>

//         {/* TIMELINE */}
//         <div style={styles.section}>
//           <label style={styles.label}>Timeline</label>
//           <input
//             name="timeline"
//             value={form.timeline}
//             onChange={handleChange}
//             placeholder="Timeline"
//             style={styles.input}
//           />
//         </div>

//         {/* CATEGORY */}
//         <div style={styles.section}>
//           <label style={styles.label}>Category</label>
//           <input
//             name="category"
//             value={form.category}
//             onChange={handleChange}
//             placeholder="Category"
//             style={styles.input}
//           />
//         </div>

//         {/* SKILLS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Skills (comma separated)</label>
//           <input
//             name="skills"
//             value={form.skills}
//             onChange={handleChange}
//             placeholder="e.g., UI, UX, Figma"
//             style={styles.input}
//           />
//         </div>

//         {/* TOOLS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Tools (comma separated)</label>
//           <input
//             name="tools"
//             value={form.tools}
//             onChange={handleChange}
//             placeholder="e.g., Figma, Adobe XD"
//             style={styles.input}
//           />
//         </div>

//         {/* SAMPLE URL */}
//         <div style={styles.section}>
//           <label style={styles.label}>Sample Project URL</label>
//           <input
//             name="sample_project_url"
//             value={form.sample_project_url}
//             onChange={handleChange}
//             placeholder="https://example.com"
//             style={styles.input}
//           />
//         </div>

//         {/* REQUIREMENTS */}
//         <div style={styles.section}>
//           <label style={styles.label}>Freelancer Requirements</label>
//           <textarea
//             name="freelancer_requirements"
//             value={form.freelancer_requirements}
//             onChange={handleChange}
//             placeholder="Specify requirements"
//             style={styles.textarea}
//           />
//         </div>

//         <button onClick={handleUpdate} style={styles.updateBtn}>
//           Update Service
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   wrapper: {
//  width: "100%",
//   maxWidth: "800px", // max width for desktop
//   margin: "0 auto",
//   background: "#fff",
//   borderRadius: "16px",
//   boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//   fontFamily: "Rubik, sans-serif",
//   padding: "22px",
//   boxSizing: "border-box",
//   },
//   heading: {
//     textAlign: "center",
//     fontWeight: 700,
//     marginBottom: "30px",
//     color:"#000" ,
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
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firbase/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { color } from "framer-motion";
import Select from "react-select";





export default function EditServiceForm() {
 const { id } = useParams();
 const navigate = useNavigate();

 const [loading, setLoading] = useState(true);

 // ⭐ SIDEBAR STATE
 const [collapsed, setCollapsed] = useState(
 localStorage.getItem("sidebar-collapsed") === "true"
 );

 // ⭐ RESPONSIVE FLAG
 const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

 useEffect(() => {
 const resize = () => setIsMobile(window.innerWidth <= 768);
 window.addEventListener("resize", resize);
 return () => window.removeEventListener("resize", resize);
 }, []);

 // ⭐ LISTEN FOR SIDEBAR TOGGLE
 useEffect(() => {
 function handleToggle(e) {
 setCollapsed(e.detail);
 }
 window.addEventListener("sidebar-toggle", handleToggle);
 return () => window.removeEventListener("sidebar-toggle", handleToggle);
 }, []);

 const [form, setForm] = useState({
 title: "",
 description: "",
 budget_from: "",
 budget_to: "",
 timeline: "",
 category: "",
 skills: "",
 tools: "",
 sample_project_url: "",
 freelancer_requirements: "",
 });

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


 useEffect(() => {
 async function fetchData() {
 try {
 const ref = doc(db, "services", id);
 const snap = await getDoc(ref);

 if (!snap.exists()) {
 alert("Service not found");
 return navigate(-1);
 }

 const data = snap.data();

 setForm({
 title: data.title || "",
 description: data.description || "",
 budget_from: data.budget_from || "",
 budget_to: data.budget_to || "",
 timeline: data.timeline || "",
 category: data.category || "",
 skills: (data.skills || []).join(", "),
 tools: (data.tools || []).join(", "),
 sample_project_url: data.sample_project_url || "",
 freelancer_requirements: data.freelancer_requirements || "",
 });

 setCategory(
 data.category ? { label: data.category, value: data.category } : null
 );

 setSkills((data.skills || []).map(s => ({ label: s, value: s })));
 setTools((data.tools || []).map(t => ({ label: t, value: t })));

 setLoading(false);
 } catch (err) {
 console.error(err);
 alert("Failed to load service");
 }
 }

 fetchData();
 }, [id, navigate]);

 const handleChange = (e) => {
 setForm({ ...form, [e.target.name]: e.target.value });
 };

 const handleUpdate = async () => {
 try {
 const ref = doc(db, "services", id);

 const payload = {
 title: form.title,
 description: form.description,
 budget_from: form.budget_from,
 budget_to: form.budget_to,
 timeline: form.timeline,
 category: category.value,
 skills: skills.map(s => s.value),
 tools: tools.map(t => t.value),

 sample_project_url: form.sample_project_url,
 freelancer_requirements: form.freelancer_requirements,

 updated_at: new Date(),
 };

 await updateDoc(ref, payload);
 alert("Service updated successfully!");
 navigate(-1);
 } catch (error) {
 console.error(error);
 alert("Failed to update service.");
 }
 };

 if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
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
 marginLeft: isMobile ? "0px" : collapsed ? "-190px" : "-90px",
 transition: "margin-left 0.25s ease",
 padding: isMobile ? "22px" : "30px",

 // margin
 }}
 >
 <div
 style={{
 ...styles.wrapper,
 margin: isMobile ? "82px 2px" : "40px auto",
 padding: isMobile ? "22px" : "30px",
 // marginRight: isMobile ? "-30px" :"0",

 }}
 >
 <h2
 style={{
 ...styles.heading,
 fontSize: isMobile ? "22px" : "26px",
 }}
 >
 Edit Service
 </h2>

 {/* SERVICE TITLE */}
 <div style={styles.section}>
 <label style={styles.label}>Service Title</label>
 <input
 name="title"
 value={form.title}
 onChange={handleChange}
 placeholder="Service Title"
 style={styles.input}
 />
 </div>

 {/* DESCRIPTION */}
 <div style={styles.section}>
 <label style={styles.label}>Project Description</label>
 <textarea
 name="description"
 value={form.description}
 onChange={handleChange}
 placeholder="Describe your service..."
 style={styles.textarea}
 />
 </div>

 {/* BUDGET */}
 <div
 style={{
 ...styles.row,
 flexDirection: isMobile ? "column" : "row",
 }}
 >
 <div style={{ flex: 1 }}>
 <label style={styles.label}>Budget From</label>
 <input
 name="budget_from"
 value={form.budget_from}
 onChange={handleChange}
 placeholder="₹0"
 style={styles.input}
 />
 </div>
 <div style={{ flex: 1 }}>
 <label style={styles.label}>Budget To</label>
 <input
 name="budget_to"
 value={form.budget_to}
 onChange={handleChange}
 placeholder="₹0"
 style={styles.input}
 />
 </div>
 </div>

 {/* TIMELINE */}
 <div style={styles.section}>
 <label style={styles.label}>Timeline</label>
 <input
 name="timeline"
 value={form.timeline}
 onChange={handleChange}
 placeholder="Timeline"
 style={styles.input}
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

 {/* SAMPLE URL */}
 <div style={styles.section}>
 <label style={styles.label}>Sample Project URL</label>
 <input
 name="sample_project_url"
 value={form.sample_project_url}
 onChange={handleChange}
 placeholder="https://example.com"
 style={styles.input}
 />
 </div>

 {/* REQUIREMENTS */}
 <div style={styles.section}>
 <label style={styles.label}>Freelancer Requirements</label>
 <textarea
 name="freelancer_requirements"
 value={form.freelancer_requirements}
 onChange={handleChange}
 placeholder="Specify requirements"
 style={styles.textarea}
 />
 </div>

 <button onClick={handleUpdate} style={styles.updateBtn}>
 Update Service
 </button>
 </div>
 </div>
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
