import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/* ================= CONSTANTS ================= */
const SECTIONS = ["Categories", "Skills & Tools", "Price Range", "Posting Time"];

const ALL_CATEGORIES = [
  "Graphic Design", "Digital Marketing", "Writing & Translation", "Video & Animation",
  "Music & Animation", "Programming & Tech", "Data", "Business",
  "Finance", "Personal Growth", "Photography", "AI Service", "Consulting",
];

const ALL_SKILLS = [
  "Figma", "React", "Python", "SQL", "Node.js", "Flutter", "SEO",
  "Content Marketing", "Video Editing", "Animation", "AI Development",
  "Machine Learning", "Blockchain", "DevOps", "Cloud Computing",
];

const POSTING_TIMES = ["Posted Today", "Last 3 Days", "Last 7 Days", "Last 30 Days"];

const DEFAULT_FILTERS = {
  categories: [],
  skills: [],
  postingTime: "",
  budgetRange: { start: 500, end: 100000 },
};

/* ================= DUAL RANGE SLIDER ================= */
function DualRangeSlider({ min, max, value, onChange }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(null); // "left" | "right" | null

  const toPercent = (v) => ((v - min) / (max - min)) * 100;

  const clamp = (v) => Math.max(min, Math.min(max, v));

  const posToVal = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.round(clamp(min + ratio * (max - min)));
  };

  const onMouseDown = (which) => (e) => {
    e.preventDefault();
    setDragging(which);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const v = posToVal(clientX);
      if (dragging === "left") {
        onChange([Math.min(v, value[1] - 100), value[1]]);
      } else {
        onChange([value[0], Math.max(v, value[0] + 100)]);
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, value]);

  const leftPct = toPercent(value[0]);
  const rightPct = toPercent(value[1]);

  return (
    <div style={{ padding: "8px 0 20px" }}>
      <div ref={trackRef} style={{ position: "relative", height: 4, background: "#e5e7eb", borderRadius: 99, margin: "18px 0 20px", cursor: "pointer" }}>
        {/* filled track */}
        <div style={{
          position: "absolute", height: "100%", background: "#f5f5a0",
          left: `${leftPct}%`, right: `${100 - rightPct}%`, borderRadius: 99
        }} />
        {/* left thumb */}
        <div
          onMouseDown={onMouseDown("left")}
          onTouchStart={onMouseDown("left")}
          style={{
            position: "absolute", top: "50%", left: `${leftPct}%`,
            transform: "translate(-50%, -50%)",
            width: 22, height: 22, borderRadius: "50%",
            background: "#fff", border: "2.5px solid #d4d400",
            cursor: "grab", zIndex: 2, userSelect: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
          }}
        />
        {/* right thumb */}
        <div
          onMouseDown={onMouseDown("right")}
          onTouchStart={onMouseDown("right")}
          style={{
            position: "absolute", top: "50%", left: `${rightPct}%`,
            transform: "translate(-50%, -50%)",
            width: 22, height: 22, borderRadius: "50%",
            background: "#fff", border: "2.5px solid #d4d400",
            cursor: "grab", zIndex: 2, userSelect: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 40 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 17 }}>₹ {value[0].toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>Min (Price)</div>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 17 }}>₹ {value[1].toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>Max (Price)</div>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function JobFiltersRedesigned({
  currentFilters = DEFAULT_FILTERS,
  onApply = () => { },
  onClose = () => { },
}) {
  const [activeSection, setActiveSection] = useState("Categories");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [priceRange, setPriceRange] = useState([500, 60000]);

  useEffect(() => {
    if (!currentFilters) return;
    setSelectedCategories(currentFilters.categories ?? []);
    setSelectedSkills(currentFilters.skills ?? []);
    setSelectedTime(currentFilters.postingTime ?? "");
    setPriceRange([
      currentFilters.budgetRange?.start ?? 500,
      currentFilters.budgetRange?.end ?? 100000,
    ]);
  }, [currentFilters]);

  const toggle = (val, list, setList) =>
    setList((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);

  const handleApply = () => {
    onApply({
      categories: selectedCategories,
      skills: selectedSkills,
      postingTime: selectedTime,
      budgetRange: { start: priceRange[0], end: priceRange[1] },
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setSelectedSkills([]);
    setSelectedTime("");
    setPriceRange([500, 100000]);
  };

  /* ---- right panel content ---- */
  const renderContent = () => {
    switch (activeSection) {
      case "Categories":
        return (
          <>
            <h2 style={styles.contentTitle}>Categories</h2>
            <div style={styles.chipWrap}>
              {ALL_CATEGORIES.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button key={cat} onClick={() => toggle(cat, selectedCategories, setSelectedCategories)}
                    style={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}>
                    {active ? <>{cat} <X size={13} style={{ marginLeft: 4 }} /></> : cat}
                  </button>
                );
              })}
            </div>
          </>
        );
      case "Skills & Tools":
        return (
          <>
            <h2 style={styles.contentTitle}>Skills & Tools</h2>
            <div style={styles.chipWrap}>
              {ALL_SKILLS.map((skill) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button key={skill} onClick={() => toggle(skill, selectedSkills, setSelectedSkills)}
                    style={{ ...styles.chip, ...(active ? styles.chipActive : styles.chipInactive) }}>
                    {active
                      ? <>{skill} <X size={13} style={{ marginLeft: 4 }} /></>
                      : <><span style={{ color: "#9ca3af", marginRight: 4 }}>+</span> {skill}</>}
                  </button>
                );
              })}
            </div>
          </>
        );
      case "Price Range":
        return (
          <>
            <h2 style={styles.contentTitle}>Price Range</h2>
            <DualRangeSlider min={0} max={100000} value={priceRange} onChange={setPriceRange} />
          </>
        );
      case "Posting Time":
        return (
          <>
            <h2 style={styles.contentTitle}>Posting Time</h2>
            <div>
              {POSTING_TIMES.map((t) => (
                <div key={t} onClick={() => setSelectedTime(t)} style={styles.radioRow}>
                  <span style={{ fontSize: 15 }}>{t}</span>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    border: `2px solid ${selectedTime === t ? "#d4d400" : "#d1d5db"}`,
                    background: selectedTime === t ? "#f5f5a0" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {selectedTime === t && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#a3a300" }} />}
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.container} onClick={(e) => e.stopPropagation()}>
          {/* HEADER */}
          <div style={styles.header}>
            <button onClick={onClose} style={styles.iconBtn}><X size={22} /></button>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Filters</h2>
            <div style={{ width: 22 }} />
          </div>

          {/* TWO PANEL BODY */}
          <div style={styles.body}>
            {/* LEFT NAV */}
            <div style={styles.leftNav}>
              {SECTIONS.map((s) => (
                <button key={s} onClick={() => setActiveSection(s)}
                  style={{ ...styles.navItem, ...(activeSection === s ? styles.navItemActive : {}) }}>
                  {s}
                </button>
              ))}
            </div>

            {/* DIVIDER */}
            <div style={styles.divider} />

            {/* RIGHT CONTENT */}
            <div style={styles.rightContent}>
              {renderContent()}
            </div>
          </div>

          {/* FOOTER */}
          <div style={styles.footer}>
            <button style={styles.clearBtn} onClick={handleClear}>Clear All</button>
            <button style={styles.applyBtn} onClick={handleApply}>Apply Filters</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= STYLES ================= */
const styles = {
overlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  paddingTop: "330px",
  paddingRight: "280px",
  paddingBottom: "40px",   // ✅ bottom gap
  zIndex: 9999,
},



container: {
  width: "100%",
  maxWidth: 720,
  height: "70%",
  background: "#fff",
  borderRadius: "18px",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",   // ✅ important (4 corner radius fix)
},



  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid #e5e7eb",
  },
  iconBtn: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" },
  body: {
    flex: 1, display: "flex", overflow: "hidden",
  },
  leftNav: {
    width: 140, minWidth: 140,
    display: "flex", flexDirection: "column",
    padding: "16px 0",
    gap: 4,
    overflowY: "auto",
  },
  navItem: {
    textAlign: "left",
    padding: "12px 16px",
    background: "none",
    border: "none",
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    borderRadius: "8px 0 0 8px",
    marginRight: 0,
  },
  navItemActive: {
    background: "#fefce8",
    color: "#111",
    fontWeight: 600,
  },
  divider: {
    width: 1, background: "#e5e7eb", alignSelf: "stretch",
  },
rightContent: {
  flex: 1,
  padding: "20px 20px",
  overflowY: "auto",
  paddingBottom: "120px",   // ✅ increase
},


  contentTitle: {
    margin: "0 0 16px", fontSize: 17, fontWeight: 700,
  },
  chipWrap: {
    display: "flex", flexWrap: "wrap", gap: 10,
  },
  chip: {
    padding: "8px 14px",
    borderRadius: 10,
    background: "#fefce8",
    border: "1px solid #fde68a",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    display: "flex", alignItems: "center",
    color: "#111",
  },
  chipActive: {
    background: "#fef08a",
    border: "1px solid #ca8a04",
  },
  chipInactive: {
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    color: "#374151",
  },
  radioRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #f3f4f6",
    cursor: "pointer",
  },
footer: {
  display: "flex",
  gap: 12,
  padding: "14px 16px",
  borderTop: "1px solid #e5e7eb",
  background: "#fff",
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  borderRadius: "0 0 18px 18px",   // ✅ bottom radius match
},



  clearBtn: {
    flex: 1, padding: "12px",
    background: "#ede9fe", color: "#6d28d9",
    border: "none", borderRadius: 12,
    fontWeight: 600, cursor: "pointer", fontSize: 14,
  },
  applyBtn: {
    flex: 1, padding: "12px",
    background: "#6d28d9", color: "#fff",
    border: "none", borderRadius: 12,
    fontWeight: 600, cursor: "pointer", fontSize: 14,
  },
};

/* add slideUp keyframe via style tag */
if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = `@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`;
  document.head.appendChild(s);
}