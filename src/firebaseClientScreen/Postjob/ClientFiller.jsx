
import React, { useEffect, useState } from "react";

/* ======================================================
   JOB FILTER MODEL (same as Flutter)
====================================================== */
export class JobFilter {
  constructor({
    categories = [],
    services = [],
    skills = [],
    minPrice = null,
    maxPrice = null,
    deliveryTime = "",
    minDays = null,
    maxDays = null,
  } = {}) {
    this.categories = categories;
    this.services = services;
    this.skills = skills;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.deliveryTime = deliveryTime; // "24h" | "7d" | "custom"
    this.minDays = minDays;
    this.maxDays = maxDays;
  }
}

/* ======================================================
   FILTER SCREEN COMPONENT
====================================================== */
export default function FilterScreen({
  initialFilter,
  onApply,
  onClose,
}) {
  /* ---------------- STATE ---------------- */
  const [filter, setFilter] = useState(new JobFilter());

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minDays, setMinDays] = useState("");
  const [maxDays, setMaxDays] = useState("");

  /* ---------------- STATIC DATA ---------------- */
  const categories = [
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

  const services = [
    "Graphic Design",
    "UI UX",
    "Web Development",
    "App Development",
    "Game Development",
    "SEO",
    "Social Media Marketing",
    "Content Writing",
    "Video Editing",
    "Voice Over",
  ];

  const skills = [
    "Figma",
    "React",
    "Python",
    "SQL",
    "Photoshop",
    "Illustrator",
    "JavaScript",
    "Flutter",
    "Node.js",
    "MongoDB",
  ];

  /* ---------------- INIT (clone filter) ---------------- */
  useEffect(() => {
    const cloned = new JobFilter({
      categories: [...(initialFilter?.categories || [])],
      services: [...(initialFilter?.services || [])],
      skills: [...(initialFilter?.skills || [])],
      minPrice: initialFilter?.minPrice ?? null,
      maxPrice: initialFilter?.maxPrice ?? null,
      deliveryTime: initialFilter?.deliveryTime ?? "",
      minDays: initialFilter?.minDays ?? null,
      maxDays: initialFilter?.maxDays ?? null,
    });

    setFilter(cloned);
    setMinPrice(cloned.minPrice ?? "");
    setMaxPrice(cloned.maxPrice ?? "");
    setMinDays(cloned.minDays ?? "");
    setMaxDays(cloned.maxDays ?? "");
  }, [initialFilter]);

  /* ---------------- HELPERS ---------------- */
  const toggleValue = (key, value) => {
    setFilter((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  };

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 6);

  const visibleServices = showAllServices
    ? services
    : services.slice(0, 6);

  const validateAndApply = () => {
    const minP = minPrice !== "" ? parseInt(minPrice) : null;
    const maxP = maxPrice !== "" ? parseInt(maxPrice) : null;

    if (minP !== null && maxP !== null && minP > maxP) {
      alert("Min price cannot be greater than max price");
      return;
    }

    const minD = minDays !== "" ? parseInt(minDays) : null;
    const maxD = maxDays !== "" ? parseInt(maxDays) : null;

    if (minD !== null && maxD !== null && minD > maxD) {
      alert("Min days cannot be greater than max days");
      return;
    }

    const finalFilter = new JobFilter({
      ...filter,
      minPrice: minP,
      maxPrice: maxP,
      minDays: minD,
      maxDays: maxD,
    });

    onApply(finalFilter);
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.appBar}>
        <button style={styles.backBtn} onClick={onClose}>
          ←
        </button>
        <h2 style={{ margin: "0 auto" }}>Filters</h2>
      </div>

      <div style={styles.body}>
        {/* ---------------- Categories ---------------- */}
        <SectionHeader
          title="Categories"
          actionText={showAllCategories ? "Show Less" : "See All"}
          onAction={() => setShowAllCategories(!showAllCategories)}
        />

        <Wrap>
          {visibleCategories.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={filter.categories.includes(c)}
              onClick={() => toggleValue("categories", c)}
            />
          ))}
        </Wrap>

        {/* ---------------- Services ---------------- */}
        <SectionHeader
          title="Services"
          actionText={showAllServices ? "Show Less" : "See All"}
          onAction={() => setShowAllServices(!showAllServices)}
        />

        <Wrap>
          {visibleServices.map((s) => (
            <Chip
              key={s}
              label={s}
              selected={filter.services.includes(s)}
              onClick={() => toggleValue("services", s)}
            />
          ))}
        </Wrap>

        {/* ---------------- Skills ---------------- */}
        <h3 style={styles.sectionTitle}>Skills & Tools</h3>

        <Wrap>
          {skills.map((s) => (
            <SkillChip
              key={s}
              label={s}
              selected={filter.skills.includes(s)}
              onClick={() => toggleValue("skills", s)}
            />
          ))}
        </Wrap>

        {/* ---------------- Price ---------------- */}
        <h3 style={styles.sectionTitle}>Price</h3>

        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            type="number"
          />
          <input
            style={styles.input}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            type="number"
          />
        </div>

        {/* ---------------- Delivery ---------------- */}
        <h3 style={styles.sectionTitle}>Delivery Time</h3>

        <RadioRow
          label="Up to 24 Hours"
          checked={filter.deliveryTime === "24h"}
          onClick={() => setFilter({ ...filter, deliveryTime: "24h" })}
        />

        <RadioRow
          label="Up to 7 days"
          checked={filter.deliveryTime === "7d"}
          onClick={() => setFilter({ ...filter, deliveryTime: "7d" })}
        />

        <RadioRow
          label="Custom Range"
          checked={filter.deliveryTime === "custom"}
          onClick={() => setFilter({ ...filter, deliveryTime: "custom" })}
        />

        {filter.deliveryTime === "custom" && (
          <div style={styles.row}>
            <input
              style={styles.input}
              placeholder="Min Days"
              value={minDays}
              onChange={(e) => setMinDays(e.target.value)}
              type="number"
            />
            <input
              style={styles.input}
              placeholder="Max Days"
              value={maxDays}
              onChange={(e) => setMaxDays(e.target.value)}
              type="number"
            />
          </div>
        )}

        {/* ---------------- Buttons ---------------- */}
        <div style={styles.buttonRow}>
          <button
            style={styles.clearBtn}
            onClick={() => onApply(new JobFilter())}
          >
            Clear All
          </button>

          <button style={styles.applyBtn} onClick={validateAndApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   SMALL UI COMPONENTS
====================================================== */
const SectionHeader = ({ title, actionText, onAction }) => (
  <div style={styles.headerRow}>
    <h3 style={styles.sectionTitle}>{title}</h3>
    <span style={styles.actionText} onClick={onAction}>
      {actionText}
    </span>
  </div>
);

const Wrap = ({ children }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>
);

const Chip = ({ label, selected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      ...styles.chip,
      background: selected ? "#FDFD96" : "#FFFEDC",
    }}
  >
    {label}
  </div>
);

const SkillChip = ({ label, selected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      ...styles.chip,
      background: selected ? "#FDFD96" : "#FFFEDC",
      display: "flex",
      gap: 6,
      alignItems: "center",
    }}
  >
    {label}
    {selected && <span style={{ fontSize: 12 }}>✕</span>}
  </div>
);

const RadioRow = ({ label, checked, onClick }) => (
  <div style={styles.radioRow} onClick={onClick}>
    <span>{label}</span>
    <input type="radio" checked={checked} readOnly />
  </div>
);

/* ======================================================
   STYLES
====================================================== */
const styles = {
  page: {
    background: "#fff",
    minHeight: "100vh",
  },
  appBar: {
    display: "flex",
    alignItems: "center",
    padding: 16,
    borderBottom: "1px solid #eee",
  },
  backBtn: {
    border: "none",
    background: "transparent",
    fontSize: 20,
    cursor: "pointer",
  },
  body: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 400,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  actionText: {
    fontSize: 14,
    color: "#7C3CFF",
    cursor: "pointer",
  },
  chip: {
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },
  row: {
    display: "flex",
    gap: 12,
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    background: "#FFFBD0",
    border: "none",
    borderRadius: 4,
  },
  radioRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    cursor: "pointer",
  },
  buttonRow: {
    display: "flex",
    gap: 14,
    marginTop: 30,
  },
  clearBtn: {
    flex: 1,
    height: 48,
    background: "#D9C6FF",
    border: "none",
    borderRadius: 6,
    fontSize: 16,
    cursor: "pointer",
  },
  applyBtn: {
    flex: 1,
    height: 48,
    background: "#7C3CFF",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },
};
