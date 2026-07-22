import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firbase/Firebase";

const SCREENING_QUESTIONS_MAP = {
  "Logo Design": [
    "Have you designed logos for commercial clients before?",
    "Are you comfortable delivering in vector formats (AI/SVG)?",
    "Can you provide a portfolio of past logo work?",
  ],
  "Brand Style Guides": [
    "Have you created brand style guides from scratch?",
    "Do you have experience working with brand teams?",
  ],
  "Business Cards & Stationery": [
    "Have you designed print-ready business card files?",
    "Are you familiar with bleed and CMYK colour settings?",
  ],
  Illustration: [
    "Do you specialise in digital or traditional illustration?",
    "Can you match an existing illustration style?",
  ],
  "Pattern Design": [
    "Have you created seamless repeat patterns before?",
    "Which software do you use for pattern creation?",
  ],
};

const DEFAULT_QUESTIONS = [
  "Do you have relevant experience in this area?",
  "Can you meet the stated deadline?",
  "Are you available for revisions within 48 hours?",
];

export default function PostJobScreen(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const routeState = location.state || {};
  const jobIdProp = props.jobId || routeState.jobId || routeState.job_id || null;
  const jobDataProp = props.jobData || routeState.jobData || null;

  // -------------------- STATE -------------------- //
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("");
  const [sampleProjectUrl, setSampleProjectUrl] = useState("");
  const [freelancerRequirements, setFreelancerRequirements] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTab, setSelectedTab] = useState("Works");
  const [isSaving, setIsSaving] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

  const [deliverables, setDeliverables] = useState([]);
  const [deliverableInput, setDeliverableInput] = useState("");

  const [screeningQuestions, setScreeningQuestions] = useState([]);
  const [activeScreeningSkill, setActiveScreeningSkill] = useState(null);

  // -------------------- CONSTANTS -------------------- //
  const expertiseOptions = {
    "Graphics & Design": [],
    "Programming & Tech": [],
    "Digital Marketing": [],
    "Writing & Translation": [],
    "Video & Animation": [],
    "Music & Audio": [],
    "AI Services": [],
    Data: [],
    Business: [],
    Finance: [],
    Photography: [],
    Lifestyle: [],
    Consulting: [],
    "Personal Growth & Hobbies": [],
  };

  const skillOptions = [
    "Logo Design",
    "Brand Style Guides",
    "Business Cards & Stationery",
    "Illustration",
    "Pattern Design",
  ];
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
  ];
  const timelines = ["1-30 days", "1-3 months", "3-6 months", "6+ months"];

  // -------------------- PREFILL -------------------- //
  useEffect(() => {
    if (!jobDataProp) return;
    setTitle(jobDataProp.title || "");
    setDescription(jobDataProp.description || "");
    setBudgetFrom(jobDataProp.budget_from || "");
    setBudgetTo(jobDataProp.budget_to || "");
    setSampleProjectUrl(jobDataProp.sample_project_url || "");
    setFreelancerRequirements(jobDataProp.freelancer_requirements || "");
    setSelectedCategory(jobDataProp.category || "");
    setSelectedTimeline(jobDataProp.timeline || "");
    setSelectedSkills(Array.isArray(jobDataProp.skills) ? jobDataProp.skills : []);
    setSelectedTools(Array.isArray(jobDataProp.tools) ? jobDataProp.tools : []);
    setDeliverables(Array.isArray(jobDataProp.deliverables) ? jobDataProp.deliverables : []);
    if (Array.isArray(jobDataProp.screening_questions)) {
      setScreeningQuestions(jobDataProp.screening_questions);
    }
    if (jobDataProp.startDateTime?.toDate) {
      const d = jobDataProp.startDateTime.toDate();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      setSelectedTimeline(`${yyyy}-${mm}-${dd}`);
      setSelectedTime(`${hh}:${min}`);
      setSelectedTab("24 hours");
    }
  }, [jobDataProp]);

  // -------------------- HELPERS -------------------- //
  const showError = (msg) => { setIsSaving(false); alert(msg); };

  const isValidProjectURL = (url) =>
    /^https:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(url);

  const handleSkillChipClick = (skill) => {
    setActiveScreeningSkill((prev) => (prev === skill ? null : skill));
  };

  const addScreeningQuestion = (questionText) => {
    if (screeningQuestions.some((q) => q.question === questionText)) return;
    setScreeningQuestions((prev) => [
      ...prev,
      { id: Date.now().toString(), question: questionText, answer: "" },
    ]);
  };

  const removeScreeningQuestion = (id) => {
    setScreeningQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateScreeningAnswer = (id, answer) => {
    setScreeningQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer } : q))
    );
  };

  const availableQuestionsForActiveSkill = activeScreeningSkill
    ? SCREENING_QUESTIONS_MAP[activeScreeningSkill] || DEFAULT_QUESTIONS
    : [];

  const handleDeliverableKeyDown = (e) => {
    if (e.key === "Enter" && deliverableInput.trim()) {
      e.preventDefault();
      if (!deliverables.includes(deliverableInput.trim())) {
        setDeliverables([...deliverables, deliverableInput.trim()]);
      }
      setDeliverableInput("");
    }
  };

  // -------------------- SAVE -------------------- //
  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return showError("User not logged in");
    setIsSaving(true);

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (trimmedTitle.split(" ").length < 2) return showError("Title must have at least 2 words");
    if (trimmedDesc.split(" ").length < 40) return showError("Description must have at least 40 words");
    if (!selectedCategory) return showError("Please select a category");
    if (selectedSkills.length < 3) return showError("Please select at least 3 skills");
    if (selectedTools.length < 3) return showError("Please select at least 3 tools");
    if (!budgetFrom || !budgetTo) return showError("Please enter budget range");
    if (sampleProjectUrl && !isValidProjectURL(sampleProjectUrl.trim()))
      return showError("Sample project must be a valid https link (e.g., https://example.com)");

    try {
      const collectionName = selectedTab === "24 hours" ? "jobs_24h" : "jobs";
      const jobsRef = collection(db, collectionName);

      const minBudget = Number(budgetFrom);
      const maxBudget = Number(budgetTo);
      if (isNaN(minBudget) || isNaN(maxBudget)) return showError("Budget must be valid numbers");
      if (minBudget <= 0 || maxBudget <= 0) return showError("Budget must be greater than 0");
      if (minBudget > maxBudget) return showError("Minimum budget cannot be greater than maximum budget");
      if (minBudget < 100) return showError("Minimum budget should be at least 100");
      if (maxBudget > 10000000) return showError("Maximum budget limit exceeded");

      let jobPayload = {
        userId: currentUser.uid,
        title: trimmedTitle,
        description: trimmedDesc,
        category: selectedCategory || null,
        skills: selectedSkills,
        tools: selectedTools,
        deliverables: deliverables,
        budget_from: budgetFrom,
        budget_to: budgetTo,
        sample_project_url: sampleProjectUrl.trim(),
        freelancer_requirements: freelancerRequirements.trim(),
        screening_questions: screeningQuestions,
        updated_at: serverTimestamp(),
      };

      if (selectedTab === "Works") {
        if (!selectedTimeline) return showError("Please select a timeline");
        jobPayload.timeline = selectedTimeline;
      }

      if (selectedTab === "24 hours") {
        if (!selectedTimeline || !selectedTime) return showError("Select date & time correctly");
        const [yyyy, mm, dd] = selectedTimeline.split("-");
        const [hh, min] = selectedTime.split(":");
        jobPayload.startDateTime = Timestamp.fromDate(new Date(yyyy, mm - 1, dd, hh, min, 0));
      }

      if (jobIdProp && jobDataProp) {
        await updateDoc(doc(db, collectionName, jobIdProp), jobPayload);
        alert("Job updated successfully");
      } else {
        const docRef = await addDoc(jobsRef, {
          ...jobPayload,
          views: 0,
          created_at: serverTimestamp(),
          viewedBy: [],
        });
        await updateDoc(docRef, { id: docRef.id });
        alert("Job posted successfully");
      }

      navigate(-1);
    } catch (err) {
      console.error(err);
      showError(`Error saving job: ${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------- RENDER HELPERS ---------------------- //
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
              else if (type === "deliverables") setDeliverables(deliverables.filter((d) => d !== item));
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
            style={selectedTab === "Works" ? styles.activeTab : styles.inactiveTab}
            onClick={() => setSelectedTab("Works")}
          >
            Work Project
          </button>
          <button
            type="button"
            style={selectedTab === "24 hours" ? styles.activeTab : styles.inactiveTab}
            onClick={() => setSelectedTab("24 hours")}
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
      <form style={styles.formCard} onSubmit={handleSave}>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Job Title</label>
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="" disabled>Select Category</option>
            {Object.keys(expertiseOptions).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={{ ...styles.input, minHeight: 120, resize: "vertical" }}
            placeholder="Describe the project goals, deliverables, and any specific requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Budget Range (₹)</label>
          <div style={styles.budgetRow}>
            <div style={styles.budgetInputWrap}>
              <input
                style={styles.input}
                type="number"
                placeholder="Min"
                value={budgetFrom}
                onChange={(e) => setBudgetFrom(e.target.value)}
              />
            </div>
            <div style={styles.toText}>to</div>
            <div style={styles.budgetInputWrap}>
              <input
                style={styles.input}
                type="number"
                placeholder="Max"
                value={budgetTo}
                onChange={(e) => setBudgetTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        {selectedTab === "Works" ? (
          <div style={styles.formGroup}>
            <label style={styles.label}>Timeline</label>
            <select
              style={styles.select}
              value={selectedTimeline}
              onChange={(e) => setSelectedTimeline(e.target.value)}
            >
              <option value="" disabled>e.g. 2-3 Weeks</option>
              {timelines.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        ) : (
          <div style={{...styles.budgetRow, marginBottom: 24}}>
            <div style={styles.budgetInputWrap}>
              <label style={styles.label}>Timeline (Start Date)</label>
              <input type="date" style={styles.input} value={selectedTimeline} onChange={(e) => setSelectedTimeline(e.target.value)} />
            </div>
            <div style={styles.budgetInputWrap}>
              <label style={styles.label}>Time</label>
              <input type="time" style={styles.input} value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
            </div>
          </div>
        )}

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
          <label style={styles.label}>Tools Required (Optional but recommended)</label>
          <select
            style={styles.select}
            value={selectedTool}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedTool("");
              if (!selectedTools.includes(val) && selectedTools.length < 10) {
                setSelectedTools([...selectedTools, val]);
              }
            }}
          >
            <option value="" disabled>Add Tools (min 3 for best results)</option>
            {toolOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {renderChips(selectedTools, "tools")}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Deliverables</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Add Deliverables (press Enter)"
            value={deliverableInput}
            onChange={(e) => setDeliverableInput(e.target.value)}
            onKeyDown={handleDeliverableKeyDown}
          />
          {renderChips(deliverables, "deliverables")}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Sample Projects (Optional)</label>
          <input
            style={styles.input}
            type="text"
            placeholder="URL"
            value={sampleProjectUrl}
            onChange={(e) => setSampleProjectUrl(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Freelancers Requirements (Optional)</label>
          <textarea
            style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
            placeholder="Describe specific requirements..."
            value={freelancerRequirements}
            onChange={(e) => setFreelancerRequirements(e.target.value)}
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

        {/* Screening Questions Section (kept visually similar but clean) */}
        <div style={styles.screeningSection}>
          <div>
            <div style={styles.label}>Application Questions</div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Click a skill chip to browse suggested screening questions</div>
          </div>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {selectedSkills.length === 0 ? (
              <div style={{ fontSize: 13, color: "#9CA3AF", fontStyle: "italic" }}>Add skills above to generate screening questions</div>
            ) : (
              selectedSkills.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  style={{
                    ...styles.screeningSkillChip,
                    ...(activeScreeningSkill === skill ? styles.screeningSkillChipActive : {}),
                  }}
                  onClick={() => handleSkillChipClick(skill)}
                >
                  {skill} <span>▾</span>
                </button>
              ))
            )}
          </div>

          {activeScreeningSkill && (
            <div style={styles.questionPanel}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Suggested for "{activeScreeningSkill}"</div>
              {availableQuestionsForActiveSkill.map((q) => {
                const alreadyAdded = screeningQuestions.some((sq) => sq.question === q);
                return (
                  <div key={q} style={styles.suggestionRow}>
                    <span style={{ fontSize: 13, color: "#111827", flex: 1 }}>{q}</span>
                    <button
                      type="button"
                      style={{
                        ...styles.addQBtn,
                        borderColor: alreadyAdded ? "#E5E7EB" : "#7C4EF5",
                        color: alreadyAdded ? "#9CA3AF" : "#7C4EF5",
                        cursor: alreadyAdded ? "default" : "pointer",
                      }}
                      onClick={() => !alreadyAdded && addScreeningQuestion(q)}
                      disabled={alreadyAdded}
                    >
                      {alreadyAdded ? "Added ✓" : "+ Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {screeningQuestions.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {screeningQuestions.map((q) => (
                <div key={q.id} style={styles.sqQuestionCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "#111827", flex: 1 }}>{q.question}</span>
                    <button type="button" style={styles.sqRemoveBtn} onClick={() => removeScreeningQuestion(q.id)}>×</button>
                  </div>
                  <select
                    style={styles.select}
                    value={q.answer}
                    onChange={(e) => updateScreeningAnswer(q.id, e.target.value)}
                  >
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" style={{ ...styles.postBtn, opacity: isSaving ? 0.7 : 1 }} disabled={isSaving}>
          {isSaving ? "Posting..." : "Post Job Now"}
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
  toText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: 500,
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
  
  screeningSection: {
    backgroundColor: "#FAFAFC",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginTop: 24,
  },
  screeningSkillChip: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "6px 12px", borderRadius: 20,
    border: "1px solid #E5E7EB", backgroundColor: "#fff",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
  },
  screeningSkillChipActive: {
    backgroundColor: "#7C4EF5", color: "#fff", borderColor: "#7C4EF5",
  },
  questionPanel: {
    backgroundColor: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  suggestionRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  },
  addQBtn: {
    padding: "4px 10px", borderRadius: 16,
    border: "1px solid #7C4EF5", background: "transparent",
    color: "#7C4EF5", fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  sqQuestionCard: {
    backgroundColor: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  sqRemoveBtn: {
    background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18,
  },
};