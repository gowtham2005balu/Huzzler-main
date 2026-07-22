import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firbase/Firebase";
import Select from "react-select";

export default function EditService() {
  const navigate = useNavigate();
  const location = useLocation();

  const jobId = location?.state?.jobId || null;
  const jobData = location?.state?.jobData || null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [tools, setTools] = useState([]);
  const [notes, setNotes] = useState("");

  const [price, setPrice] = useState("");
  const [deliveryDuration, setDeliveryDuration] = useState("");

  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("");
  const [clientRequirements, setClientRequirements] = useState("");
  const [sampleProjectUrl, setSampleProjectUrl] = useState("");

  const [paused, setPaused] = useState(false);
  const [originalPaused, setOriginalPaused] = useState(false);

  const [category, setCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  // Category options
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

  const skillOptions = jobData?.skills?.map(s => ({ label: s, value: s })) || [];
  const toolOptions = jobData?.tools?.map(t => ({ label: t, value: t })) || [];

  // Prefill
  useEffect(() => {
    if (jobData) {
      setTitle(jobData.title || "");
      setDescription(jobData.description || "");

      setSkills((jobData.skills || []).map(s => ({ label: s, value: s })));
      setTools((jobData.tools || []).map(t => ({ label: t, value: t })));

      setNotes(jobData.notes || "");

      setPrice(jobData.price || "");
      setDeliveryDuration(jobData.deliveryDuration || "");

      setBudgetFrom(jobData.budget_from || "");
      setBudgetTo(jobData.budget_to || "");
      setClientRequirements(jobData.clientRequirements || "");
      setSampleProjectUrl(jobData.sampleProjectUrl || "");

      setPaused(jobData.paused || false);
      setOriginalPaused(jobData.paused || false);

      setCategory(
        jobData.category ? { label: jobData.category, value: jobData.category } : null
      );
    }
  }, [jobData]);

  // Save
  const handleSave = async () => {
    if (!jobId) return alert("Invalid job ID");

    if (!title.trim()) return alert("Title required");
    if (!description.trim()) return alert("Description required");
    if (!category) return alert("Category required");

    setSaving(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category: category.value,

        price: Number(price) || 0,
        deliveryDuration: deliveryDuration,
        
        budget_from: Number(budgetFrom) || 0,
        budget_to: Number(budgetTo) || 0,

        clientRequirements,
        sampleProjectUrl,

        skills: skills.map(s => s.value),
        tools: tools.map(t => t.value),

        notes,
        paused,
        updatedAt: new Date(),
      };

      // Auto-update pausedAt when paused becomes true
      if (!originalPaused && paused) {
        payload.pausedAt = new Date();
      }

      await updateDoc(doc(db, "services", jobId), payload);

      alert("Service updated!");
      navigate(-1);

    } catch (error) {
      console.error("Error updating service:", error);
      alert("Update failed: " + error.message);
    }

    setSaving(false);
  };

  return (
    <div style={styles.wrapper}>
      <h2>Edit Service</h2>

      <label style={styles.label}>Title</label>
      <input
        style={styles.input}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <label style={styles.label}>Description</label>
      <textarea
        style={styles.textarea}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <label style={styles.label}>Category</label>
      <Select value={category} onChange={setCategory} options={categoryOptions} />

      <label style={styles.label}>Price</label>
      <input
        type="number"
        style={styles.input}
        value={price}
        onChange={e => setPrice(e.target.value)}
      />

      <label style={styles.label}>Delivery Duration</label>
      <input
        style={styles.input}
        value={deliveryDuration}
        onChange={e => setDeliveryDuration(e.target.value)}
        placeholder="e.g. 1-7 days"
      />

      <label style={styles.label}>Budget From</label>
      <input
        type="number"
        style={styles.input}
        value={budgetFrom}
        onChange={e => setBudgetFrom(e.target.value)}
      />

      <label style={styles.label}>Budget To</label>
      <input
        type="number"
        style={styles.input}
        value={budgetTo}
        onChange={e => setBudgetTo(e.target.value)}
      />

      <label style={styles.label}>Client Requirements</label>
      <textarea
        style={styles.textarea}
        value={clientRequirements}
        onChange={e => setClientRequirements(e.target.value)}
      />

      <label style={styles.label}>Sample Project URL</label>
      <input
        style={styles.input}
        value={sampleProjectUrl}
        onChange={e => setSampleProjectUrl(e.target.value)}
      />

      <label style={styles.label}>Skills</label>
      <Select isMulti options={skillOptions} value={skills} onChange={setSkills} />

      <label style={styles.label}>Tools</label>
      <Select isMulti options={toolOptions} value={tools} onChange={setTools} />

      <label style={styles.label}>
        <input
          type="checkbox"
          checked={paused}
          onChange={(e) => setPaused(e.target.checked)}
        />{" "}
        Pause Service
      </label>

      <label style={styles.label}>Notes</label>
      <textarea
        style={styles.textarea}
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />

      <div style={styles.btnRow}>
        <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
          Cancel
        </button>

        <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "720px",
    margin: "20px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },
  heading: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 14,
    textAlign: "center",
  },
  label: { display: "block", marginTop: 12, fontWeight: 600 },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 6,
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    minHeight: 100,
    padding: 10,
    marginTop: 6,
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
  },
  btnRow: { display: "flex", justifyContent: "space-between", marginTop: 18 },
  cancelBtn: {
    background: "#9aa0a6",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
  },
  saveBtn: {
    background: "#0b74ff",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
  },
};
