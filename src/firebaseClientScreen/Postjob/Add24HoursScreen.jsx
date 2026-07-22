// Add24HoursScreen.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firbase/Firebase";

export default function Add24HoursScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const user = auth.currentUser;

  const jobId = location?.state?.jobId || null;
  const jobData = location?.state?.jobData || null;

  // =========================================================
  // STATES
  // =========================================================
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  const [category, setCategory] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTool, setSelectedTool] = useState("");
  const [selectedTools, setSelectedTools] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [saving, setSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState("24 Hours");

  // =========================================================
  // OPTIONS
  // =========================================================
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
    "Personal Growth & Hobbies",
  ];

  const skillOptions = [
    "Logo Design", "Brand Style Guides", "Business Cards & Stationery", "Illustration", "Pattern Design",
    "Website Design", "App Design", "UX Design", "Game Art", "NFTs & Collectibles",
    "Industrial & Product Design", "Architecture & Interior Design", "Landscape Design",
    "Fashion Design", "Jewelry Design", "Presentation Design", "Infographic Design",
    "Vector Tracing", "Car Wraps", "Image Editing", "Photoshop Editing",
    "T-Shirts & Merchandise", "Packaging Design", "Book Design", "Album Cover Design",
    "Podcast Cover Art", "Menu Design", "Invitation Design", "Brochure Design",
    "Poster Design", "Signage Design", "Flyer Design", "Social Media Design",
    "Print Design", "Website Development", "Website Builders & CMS", "Web Programming",
    "E-Commerce Development", "Game Development", "Mobile Apps (iOS & Android)",
    "Desktop Applications", "Chatbots", "QA & Review", "User Testing",
    "Support & IT", "Data Analysis & Reports", "Convert Files", "Databases",
    "Cybersecurity & Data Protection", "Cloud Computing", "DevOps", "AI Development",
    "Machine Learning Models", "Blockchain & NFTs", "Scripts & Automation",
    "Software Customization", "Social Media Marketing", "SEO", "Content Marketing",
    "Video Marketing", "Email Marketing", "SEM", "Influencer Marketing", "Local SEO",
    "Affiliate Marketing", "Mobile Marketing", "Display Advertising", "E-Commerce Marketing",
    "Text Message Marketing", "Crowdfunding", "Web Analytics", "Domain Research",
    "Music Promotion", "Book & eBook Marketing", "Podcast Marketing",
    "Community Management", "Marketing Consulting", "Articles & Blog Posts",
    "Proofreading & Editing", "Translation", "Website Content", "Technical Writing",
    "Copywriting", "Brand Voice & Tone", "Resume Writing", "LinkedIn Profiles",
    "Press Releases", "Product Descriptions", "Case Studies", "White Papers",
    "Video Editing", "2D/3D Animation", "Logo Animation", "Voice Over",
  ];

  const toolOptions = [
    "Adobe Illustrator", "Photoshop", "Figma", "Canva", "Inkscape", "CorelDraw",
    "VS Code", "React", "Node.js", "Tailwind CSS", "Unity", "Blender", "Miro",
    "Notion", "Adobe XD", "Sketch", "Webflow", "Shopify", "MongoDB", "MySQL",
    "Git", "Flutter", "React Native", "Java", "Kotlin", "Swift",
  ];

  // =========================================================
  // PREFILL
  // =========================================================
  useEffect(() => {
    if (jobData) {
      setTitle(jobData.title || "");
      setDesc(jobData.description || "");
      setBudget(jobData.budget || "");
      setNotes(jobData.notes || "");

      if (jobData.category) {
        setCategory(jobData.category);
      }
      if (jobData.skills) {
        setSelectedSkills(jobData.skills);
      }
      if (jobData.tools) {
        setSelectedTools(jobData.tools);
      }
      if (jobData.startDateTime) {
        const dt = jobData.startDateTime.toDate();
        setStartDate(dt.toISOString().split("T")[0]);
        setStartTime(dt.toTimeString().slice(0, 5)); // HH:mm
      }
    }
  }, [jobData]);

  // =========================================================
  // SAVE JOB
  // =========================================================
  async function saveJob(e) {
    e.preventDefault();
    if (!user) return alert("User not logged in");

    if (title.trim().split(" ").length < 2)
      return alert("Title must be at least 2 words");

    if (desc.trim().split(" ").length < 40)
      return alert("Description must be 40+ words");

    if (!category) return alert("Select category");
    if (selectedSkills.length < 3)
      return alert("At least 3 skills required");
    if (selectedTools.length < 3)
      return alert("At least 3 tools required");
    if (!startDate || !startTime)
      return alert("Select date and time");
    if (!budget.trim()) return alert("Budget required");

    setSaving(true);

    try {
      const [h, m] = startTime.split(":");
      const finalDate = new Date(startDate);
      finalDate.setHours(h);
      finalDate.setMinutes(m);

      const payload = {
        userId: user.uid,
        title: title.trim(),
        description: desc.trim(),
        category: category,
        skills: selectedSkills,
        tools: selectedTools,
        budget: budget.trim(),
        notes: notes.trim(),
        startDateTime: Timestamp.fromDate(finalDate),
      };

      if (jobId) {
        await updateDoc(doc(db, "jobs_24h", jobId), payload);
        alert("24H job updated!");
        navigate(-1);
      } else {
        await addDoc(collection(db, "jobs_24h"), {
          ...payload,
          created_at: Timestamp.now(),
          views: 0,
        });
        alert("24H job added!");
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
    setSaving(false);
  }

  const renderChips = (items, type) => (
    <div style={styles.chipWrap}>
      {items.map((item) => (
        <div key={item} style={styles.chip}>
          {item}
          <button
            type="button"
            style={styles.chipClose}
            onClick={() => {
              if (type === "skills") setSelectedSkills(selectedSkills.filter((s) => s !== item));
              else if (type === "tools") setSelectedTools(selectedTools.filter((t) => t !== item));
            }}
          >×</button>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.page}>
      
      {/* TABS */}
      <div style={styles.tabContainer}>
        <div style={styles.tabsWrapper}>
          <button
            type="button"
            style={selectedTab === "24 Hours" ? styles.activeTab : styles.inactiveTab}
          >
            24 Hour Task
          </button>
        </div>
      </div>

      {/* AI ASSISTANT BOX */}
      <div style={styles.aiBox}>
        <div style={styles.aiClose}>✕</div>
        <div style={styles.aiHeader}>
          <div style={styles.aiIcon}>⭐</div>
          <div>
            <div style={styles.aiTitle}>AI Assistant</div>
            <div style={styles.aiSubtitle}>Powered by Huzzler AI</div>
          </div>
        </div>

        <div style={styles.aiChips}>
          <div style={styles.aiChip}>⚡ Auto-fill fields</div>
          <div style={styles.aiChip}>🔍 Find best skills</div>
          <div style={styles.aiChip}>✏️ Smart description</div>
        </div>

        <div style={styles.aiText}>
          Hi! I can help you create your job post <strong>faster</strong>. Describe what you're hiring for and I'll fill in all the details automatically.
        </div>

        <div style={styles.aiInputRow}>
          <input type="text" placeholder="e.g. Need a UI/UX designer for fintech app" style={styles.aiInput} />
          <button type="button" style={styles.aiBtn}>Generate Job Details</button>
        </div>
        <div style={styles.aiFooterText}>AI may suggest edits — review before publishing</div>
      </div>

      {/* MAIN FORM CARD */}
      <form style={styles.formCard} onSubmit={saveJob}>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Service Title</label>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. UI/UX Designer for Mobile App"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Category</label>
          <select
            style={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>Select Category</option>
            {categoryOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={{ ...styles.input, minHeight: 120, resize: "vertical" }}
            placeholder="Describe the project goals, deliverables, and any specific requirements..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Budget (₹)</label>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. 5000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <div style={{...styles.budgetRow, marginBottom: 24}}>
          <div style={styles.budgetInputWrap}>
            <label style={styles.label}>Start Date</label>
            <input type="date" style={styles.input} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div style={styles.budgetInputWrap}>
            <label style={styles.label}>Start Time</label>
            <input type="time" style={styles.input} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Skills Required</label>
          <select
            style={styles.select}
            value={selectedSkill}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSkill("");
              if (!selectedSkills.includes(val) && selectedSkills.length < 10) {
                setSelectedSkills([...selectedSkills, val]);
              }
            }}
          >
            <option value="" disabled>Add Skills (min 3)</option>
            {skillOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {renderChips(selectedSkills, "skills")}
          <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "right", marginTop: 4 }}>Add at least 3 skills</div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tools Required</label>
          <select
            style={styles.select}
            value={selectedTool}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedTool("");
              if (!selectedTools.includes(val) && selectedTools.length < 5) {
                setSelectedTools([...selectedTools, val]);
              }
            }}
          >
            <option value="" disabled>Add Tools (min 3)</option>
            {toolOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {renderChips(selectedTools, "tools")}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Additional Notes (Optional)</label>
          <textarea
            style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
            placeholder="Write extra details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Attachments <span style={{color: "#9CA3AF", fontWeight: 400}}>(Optional)</span></label>
          <div style={styles.uploadBox}>
            <div style={styles.uploadIcon}>⬆️</div>
            <div style={styles.uploadTextMain}>Upload brief or reference files</div>
            <div style={styles.uploadTextSub}>PDF, PNG, JPG up to 10MB</div>
          </div>
        </div>

        <button type="submit" style={{ ...styles.postBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
          {saving ? "Posting..." : "Post Job Now"}
        </button>

      </form>
    </div>
  );
}

// ---------------------- INLINE CSS ---------------------- //
const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    backgroundColor: "#FAFAFC",
    fontFamily: "'Outfit', 'Rubik', sans-serif",
    boxSizing: "border-box",
  },
  tabContainer: {
    width: "100%",
    maxWidth: 740,
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  tabsWrapper: {
    display: "flex",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  activeTab: {
    padding: "8px 24px",
    borderRadius: 6,
    border: "1px solid #E5E7EB",
    backgroundColor: "#FFFFFF",
    color: "#111827",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  inactiveTab: {
    padding: "8px 24px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "transparent",
    color: "#6B7280",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
  aiBox: {
    width: "100%",
    maxWidth: 740,
    backgroundColor: "#F4F0FF",
    border: "1px solid #E0D4FF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    position: "relative",
    boxSizing: "border-box",
  },
  aiHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "linear-gradient(135deg, #7C4EF5 0%, #5E35B1 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    fontSize: 16,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#6D28D9",
  },
  aiSubtitle: {
    fontSize: 12,
    color: "#8B5CF6",
  },
  aiClose: {
    position: "absolute",
    top: 24,
    right: 24,
    background: "#FFF",
    border: "1px solid #E0D4FF",
    borderRadius: "50%",
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#6B7280",
    fontSize: 12,
  },
  aiChips: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  aiChip: {
    padding: "4px 10px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E0D4FF",
    borderRadius: 20,
    fontSize: 12,
    color: "#6D28D9",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  aiText: {
    fontSize: 13,
    color: "#4C1D95",
    marginBottom: 16,
    lineHeight: 1.5,
  },
  aiInputRow: {
    display: "flex",
    gap: 12,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  aiInput: {
    flex: 1,
    padding: "10px 16px",
    border: "1px solid #E0D4FF",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    minWidth: 200,
  },
  aiBtn: {
    backgroundColor: "#7C4EF5",
    color: "#FFF",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
    whiteSpace: "nowrap",
  },
  aiFooterText: {
    fontSize: 11,
    color: "#8B5CF6",
    textAlign: "center",
    opacity: 0.8,
  },

  formCard: {
    width: "100%",
    maxWidth: 740,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #F3F4F6",
    boxSizing: "border-box",
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#FAFAFC",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    fontSize: 14,
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#FAFAFC",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    fontSize: 14,
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  budgetRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  budgetInputWrap: {
    flex: 1,
  },
  uploadBox: {
    width: "100%",
    padding: "32px",
    border: "1px dashed #D1D5DB",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFC",
    color: "#6B7280",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  uploadIcon: {
    fontSize: 24,
    marginBottom: 8,
    color: "#9CA3AF",
  },
  uploadTextMain: {
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    marginBottom: 4,
  },
  uploadTextSub: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  postBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#7C4EF5",
    color: "#FFF",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 16,
    transition: "background 0.2s",
  },
  chipWrap: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "6px 12px", borderRadius: 20,
    border: "1px solid #E5E7EB", backgroundColor: "#FAFAFC", fontSize: 13,
  },
  chipClose: { background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9CA3AF" },
};