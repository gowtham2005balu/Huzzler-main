// import React, { useEffect, useState } from "react";

// /* ======================================================
//    JOB FILTER MODEL (Flutter same)
// ====================================================== */
// export class JobFilter {
//   constructor({
//     categories = [],
//     services = [],
//     skills = [],
//     minPrice = null,
//     maxPrice = null,
//     deliveryTime = "",
//     minDays = null,
//     maxDays = null,
//   } = {}) {
//     this.categories = categories;
//     this.services = services;
//     this.skills = skills;
//     this.minPrice = minPrice;
//     this.maxPrice = maxPrice;
//     this.deliveryTime = deliveryTime; // "24h" | "7d" | "custom"
//     this.minDays = minDays;
//     this.maxDays = maxDays;
//   }
// }

// /* ======================================================
//    FILTER SCREEN (REACT)
// ====================================================== */
// export default function FilterScreen({
//   initialFilter = new JobFilter(),
//   onApply,
//   onClose,
// }) {
//   /* ---------------- STATE ---------------- */
//   const [filter, setFilter] = useState(new JobFilter());

//   const [showAllCategories, setShowAllCategories] = useState(false);
//   const [showAllServices, setShowAllServices] = useState(false);

//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [minDays, setMinDays] = useState("");
//   const [maxDays, setMaxDays] = useState("");

//   /* ---------------- STATIC DATA ---------------- */
//   const categories = [
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
//     "Personal Growth & Hobbies",
//   ];

//   const services = [
//     "Graphic Design",
//     "UI UX",
//     "Web Development",
//     "App Development",
//     "Game Development",
//     "SEO",
//     "Social Media Marketing",
//     "Content Writing",
//     "Video Editing",
//     "Voice Over",
//   ];

//   const skills = [
//     "Figma",
//     "React",
//     "Python",
//     "SQL",
//     "Photoshop",
//     "Illustrator",
//     "JavaScript",
//     "Flutter",
//     "Node.js",
//     "MongoDB",
//   ];

//   /* ---------------- INIT (CLONE FILTER) ---------------- */
//   useEffect(() => {
//     const cloned = new JobFilter({
//       categories: [...(initialFilter.categories || [])],
//       services: [...(initialFilter.services || [])],
//       skills: [...(initialFilter.skills || [])],
//       minPrice: initialFilter.minPrice,
//       maxPrice: initialFilter.maxPrice,
//       deliveryTime: initialFilter.deliveryTime,
//       minDays: initialFilter.minDays,
//       maxDays: initialFilter.maxDays,
//     });

//     setFilter(cloned);
//     setMinPrice(cloned.minPrice ?? "");
//     setMaxPrice(cloned.maxPrice ?? "");
//     setMinDays(cloned.minDays ?? "");
//     setMaxDays(cloned.maxDays ?? "");
//   }, [initialFilter]);

//   /* ---------------- HELPERS ---------------- */
//   const toggleValue = (key, value) => {
//     setFilter((prev) => {
//       const exists = prev[key].includes(value);
//       return {
//         ...prev,
//         [key]: exists
//           ? prev[key].filter((v) => v !== value)
//           : [...prev[key], value],
//       };
//     });
//   };

//   const visibleCategories = showAllCategories
//     ? categories
//     : categories.slice(0, 6);

//   const visibleServices = showAllServices
//     ? services
//     : services.slice(0, 6);

//   const clearAll = () => {
//     const empty = new JobFilter();
//     setFilter(empty);
//     setMinPrice("");
//     setMaxPrice("");
//     setMinDays("");
//     setMaxDays("");
//     onApply && onApply(empty);
//   };

//   const applyFilters = () => {
//     const minP = minPrice !== "" ? Number(minPrice) : null;
//     const maxP = maxPrice !== "" ? Number(maxPrice) : null;

//     if (minP !== null && maxP !== null && minP > maxP) {
//       alert("Min price cannot be greater than max price");
//       return;
//     }

//     const minD = minDays !== "" ? Number(minDays) : null;
//     const maxD = maxDays !== "" ? Number(maxDays) : null;

//     if (minD !== null && maxD !== null && minD > maxD) {
//       alert("Min days cannot be greater than max days");
//       return;
//     }

//     const finalFilter = new JobFilter({
//       ...filter,
//       minPrice: minP,
//       maxPrice: maxP,
//       minDays: minD,
//       maxDays: maxD,
//     });

//     onApply && onApply(finalFilter);
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.appBar}>
//         <button style={styles.backBtn} onClick={onClose}>
//           ←
//         </button>
//         <h2 style={{ margin: "0 auto" }}>Filters</h2>
//       </div>

//       <div style={styles.body}>
//         {/* ---------------- Categories ---------------- */}
//         <HeaderRow
//           title="Categories"
//           actionText={showAllCategories ? "Show Less" : "See All"}
//           onAction={() => setShowAllCategories(!showAllCategories)}
//         />

//         <Wrap>
//           {visibleCategories.map((c) => (
//             <Chip
//               key={c}
//               label={c}
//               selected={filter.categories.includes(c)}
//               onClick={() => toggleValue("categories", c)}
//             />
//           ))}
//         </Wrap>

//         {/* ---------------- Services ---------------- */}
//         <HeaderRow
//           title="Services"
//           actionText={showAllServices ? "Show Less" : "See All"}
//           onAction={() => setShowAllServices(!showAllServices)}
//         />

//         <Wrap>
//           {visibleServices.map((s) => (
//             <Chip
//               key={s}
//               label={s}
//               selected={filter.services.includes(s)}
//               onClick={() => toggleValue("services", s)}
//             />
//           ))}
//         </Wrap>

//         {/* ---------------- Skills ---------------- */}
//         <h3 style={styles.sectionTitle}>Skills & Tools</h3>
//         <Wrap>
//           {skills.map((s) => (
//             <SkillChip
//               key={s}
//               label={s}
//               selected={filter.skills.includes(s)}
//               onClick={() => toggleValue("skills", s)}
//             />
//           ))}
//         </Wrap>

//         {/* ---------------- Price ---------------- */}
//         <h3 style={styles.sectionTitle}>Price</h3>
//         <div style={styles.row}>
//           <input
//             style={styles.input}
//             placeholder="Min"
//             type="number"
//             value={minPrice}
//             onChange={(e) => setMinPrice(e.target.value)}
//           />
//           <input
//             style={styles.input}
//             placeholder="Max"
//             type="number"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(e.target.value)}
//           />
//         </div>

//         {/* ---------------- Delivery ---------------- */}
//         <h3 style={styles.sectionTitle}>Delivery Time</h3>

//         <RadioRow
//           label="Up to 24 Hours"
//           checked={filter.deliveryTime === "24h"}
//           onClick={() =>
//             setFilter({ ...filter, deliveryTime: "24h" })
//           }
//         />
//         <RadioRow
//           label="Up to 7 days"
//           checked={filter.deliveryTime === "7d"}
//           onClick={() =>
//             setFilter({ ...filter, deliveryTime: "7d" })
//           }
//         />
//         <RadioRow
//           label="Custom Range"
//           checked={filter.deliveryTime === "custom"}
//           onClick={() =>
//             setFilter({ ...filter, deliveryTime: "custom" })
//           }
//         />

//         {filter.deliveryTime === "custom" && (
//           <div style={styles.row}>
//             <input
//               style={styles.input}
//               placeholder="Min Days"
//               type="number"
//               value={minDays}
//               onChange={(e) => setMinDays(e.target.value)}
//             />
//             <input
//               style={styles.input}
//               placeholder="Max Days"
//               type="number"
//               value={maxDays}
//               onChange={(e) => setMaxDays(e.target.value)}
//             />
//           </div>
//         )}

//         {/* ---------------- Buttons ---------------- */}
//         <div style={styles.buttonRow}>
//           <button style={styles.clearBtn} onClick={clearAll}>
//             Clear All
//           </button>
//           <button style={styles.applyBtn} onClick={applyFilters}>
//             Apply Filters
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ======================================================
//    SMALL COMPONENTS
// ====================================================== */
// const HeaderRow = ({ title, actionText, onAction }) => (
//   <div style={styles.headerRow}>
//     <h3 style={styles.sectionTitle}>{title}</h3>
//     <span style={styles.actionText} onClick={onAction}>
//       {actionText}
//     </span>
//   </div>
// );

// const Wrap = ({ children }) => (
//   <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//     {children}
//   </div>
// );

// const Chip = ({ label, selected, onClick }) => (
//   <div
//     onClick={onClick}
//     style={{
//       ...styles.chip,
//       background: selected ? "#FDFD96" : "#FFFEDC",
//     }}
//   >
//     {label}
//   </div>
// );

// const SkillChip = ({ label, selected, onClick }) => (
//   <div
//     onClick={onClick}
//     style={{
//       ...styles.chip,
//       background: selected ? "#FDFD96" : "#FFFEDC",
//       display: "flex",
//       gap: 6,
//       alignItems: "center",
//     }}
//   >
//     {label}
//     {selected && <span style={{ fontSize: 12 }}>✕</span>}
//   </div>
// );

// const RadioRow = ({ label, checked, onClick }) => (
//   <div style={styles.radioRow} onClick={onClick}>
//     <span>{label}</span>
//     <input type="radio" checked={checked} readOnly />
//   </div>
// );

// /* ======================================================
//    STYLES
// ====================================================== */
// const styles = {
//   page: { background: "#fff", minHeight: "100vh" },
//   appBar: {
//     display: "flex",
//     alignItems: "center",
//     padding: 16,
//     borderBottom: "1px solid #eee",
//   },
//   backBtn: {
//     border: "none",
//     background: "transparent",
//     fontSize: 20,
//     cursor: "pointer",
//   },
//   body: { padding: 16 },
//   sectionTitle: { fontSize: 20, fontWeight: 400 },
//   headerRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: 20,
//   },
//   actionText: {
//     fontSize: 14,
//     color: "#7C3CFF",
//     cursor: "pointer",
//   },
//   chip: {
//     padding: "10px 14px",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 14,
//   },
//   row: { display: "flex", gap: 12, marginTop: 10 },
//   input: {
//     flex: 1,
//     padding: 12,
//     background: "#FFFBD0",
//     border: "none",
//     borderRadius: 4,
//   },
//   radioRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "12px 0",
//     cursor: "pointer",
//   },
//   buttonRow: { display: "flex", gap: 14, marginTop: 30 },
//   clearBtn: {
//     flex: 1,
//     height: 48,
//     background: "#D9C6FF",
//     border: "none",
//     borderRadius: 6,
//     fontSize: 16,
//     cursor: "pointer",
//   },
//   applyBtn: {
//     flex: 1,
//     height: 48,
//     background: "#7C3CFF",
//     border: "none",
//     borderRadius: 6,
//     color: "#fff",
//     fontSize: 16,
//     cursor: "pointer",
//   },
// };




// import React, { useEffect, useState } from "react";

// /* ======================================================
//    JOB FILTER MODEL (Flutter same)
// ====================================================== */
// export class JobFilter {
//   constructor({
//     categories = [],
//     services = [],
//     skills = [],
//     minPrice = null,
//     maxPrice = null,
//     deliveryTime = "",
//     minDays = null,
//     maxDays = null,
//   } = {}) {
//     this.categories = categories;
//     this.services = services;
//     this.skills = skills;
//     this.minPrice = minPrice;
//     this.maxPrice = maxPrice;
//     this.deliveryTime = deliveryTime;
//     this.minDays = minDays;
//     this.maxDays = maxDays;
//   }
// }

// /* ======================================================
//    FILTER SCREEN
// ====================================================== */
// export default function FilterScreen({
//   initialFilter = new JobFilter(),
//   onApply,
//   onClose,
// }) {
//   const [filter, setFilter] = useState(new JobFilter());

//   const [showAllCategories, setShowAllCategories] = useState(false);
//   const [showAllServices, setShowAllServices] = useState(false);

//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [minDays, setMinDays] = useState("");
//   const [maxDays, setMaxDays] = useState("");

//   /* ---------------- DATA ---------------- */
//   const categories = [
//     "Graphics & Design","Programming & Tech","Digital Marketing",
//     "Writing & Translation","Video & Animation","Music & Audio",
//     "AI Services","Data","Business","Finance","Photography",
//     "Lifestyle","Consulting","Personal Growth & Hobbies",
//   ];

//   const services = [
//     "Graphic Design","UI UX","Web Development","App Development",
//     "Game Development","SEO","Social Media Marketing",
//     "Content Writing","Video Editing","Voice Over",
//   ];

//   const skills = [
//     "Figma","React","Python","SQL","Photoshop",
//     "Illustrator","JavaScript","Flutter","Node.js","MongoDB",
//   ];

//   /* ---------------- INIT ---------------- */
//   useEffect(() => {
//     const cloned = new JobFilter({ ...initialFilter });
//     setFilter(cloned);
//     setMinPrice(cloned.minPrice ?? "");
//     setMaxPrice(cloned.maxPrice ?? "");
//     setMinDays(cloned.minDays ?? "");
//     setMaxDays(cloned.maxDays ?? "");
//   }, [initialFilter]);

//   /* ---------------- HELPERS ---------------- */
//   const toggleValue = (key, value) => {
//     setFilter((prev) => {
//       const exists = prev[key].includes(value);
//       return {
//         ...prev,
//         [key]: exists
//           ? prev[key].filter((v) => v !== value)
//           : [...prev[key], value],
//       };
//     });
//   };

//   const clearAll = () => {
//     const empty = new JobFilter();
//     setFilter(empty);
//     setMinPrice(""); setMaxPrice(""); setMinDays(""); setMaxDays("");
//     onApply && onApply(empty);
//   };

//   const applyFilters = () => {
//     const finalFilter = new JobFilter({
//       ...filter,
//       minPrice: minPrice !== "" ? Number(minPrice) : null,
//       maxPrice: maxPrice !== "" ? Number(maxPrice) : null,
//       minDays: minDays !== "" ? Number(minDays) : null,
//       maxDays: maxDays !== "" ? Number(maxDays) : null,
//     });

//     onApply && onApply(finalFilter);
//     onClose && onClose();
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div style={styles.overlay} onClick={onClose}>
//       <div style={styles.popup} onClick={(e) => e.stopPropagation()}>

//         <div style={styles.appBar}>
//           <button style={styles.backBtn} onClick={onClose}>←</button>
//           <h2 style={{ margin: "0 auto" }}>Filters</h2>
//         </div>

//         <div style={styles.body}>
//           <HeaderRow title="Categories" />
//           <Wrap>
//             {categories.map((c) => (
//               <Chip key={c} label={c} selected={filter.categories.includes(c)}
//                 onClick={() => toggleValue("categories", c)} />
//             ))}
//           </Wrap>

//           <HeaderRow title="Services" />
//           <Wrap>
//             {services.map((s) => (
//               <Chip key={s} label={s} selected={filter.services.includes(s)}
//                 onClick={() => toggleValue("services", s)} />
//             ))}
//           </Wrap>

//           <h3 style={styles.sectionTitle}>Skills & Tools</h3>
//           <Wrap>
//             {skills.map((s) => (
//               <SkillChip key={s} label={s} selected={filter.skills.includes(s)}
//                 onClick={() => toggleValue("skills", s)} />
//             ))}
//           </Wrap>

//           <h3 style={styles.sectionTitle}>Price</h3>
//           <div style={styles.row}>
//             <input style={styles.input} placeholder="Min" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
//             <input style={styles.input} placeholder="Max" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
//           </div>

//           <div style={styles.buttonRow}>
//             <button style={styles.clearBtn} onClick={clearAll}>Clear All</button>
//             <button style={styles.applyBtn} onClick={applyFilters}>Apply Filters</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ======================================================
//    SMALL UI
// ====================================================== */
// const HeaderRow = ({ title }) => <h3 style={styles.sectionTitle}>{title}</h3>;
// const Wrap = ({ children }) => <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>;
// const Chip = ({ label, selected, onClick }) => <div onClick={onClick} style={{ ...styles.chip, background: selected ? "#FDFD96" : "#FFFEDC" }}>{label}</div>;
// const SkillChip = Chip;

// /* ======================================================
//    STYLES
// ====================================================== */
// const styles = {
//   overlay: {
//     position: "fixed", inset: 0,
//     background: "rgba(0,0,0,0.45)",
//     display: "flex", justifyContent: "center", alignItems: "flex-end",
//     zIndex: 9999,
//   },
//   popup: {
//     width: "100%", maxWidth: 480, height: "92%",
//     background: "#fff", borderRadius: "18px 18px 0 0",
//     animation: "slideUp .25s ease",
//   },
//   appBar: { display: "flex", alignItems: "center", padding: 16, borderBottom: "1px solid #eee" },
//   backBtn: { border: "none", background: "transparent", fontSize: 20, cursor: "pointer" },
//   body: { padding: 16 },
//   sectionTitle: { fontSize: 20, fontWeight: 400, marginTop: 16 },
//   chip: { padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14 },
//   row: { display: "flex", gap: 12, marginTop: 10 },
//   input: { flex: 1, padding: 12, background: "#FFFBD0", border: "none", borderRadius: 4 },
//   buttonRow: { display: "flex", gap: 14, marginTop: 30 },
//   clearBtn: { flex: 1, height: 48, background: "#D9C6FF", border: "none", borderRadius: 6 },
//   applyBtn: { flex: 1, height: 48, background: "#7C3CFF", border: "none", borderRadius: 6, color: "#fff" },
// };





import React, { useEffect, useState } from "react";

/* ======================================================
   JOB FILTER MODEL (BACKEND SAFE ❌ TOUCH PANNA VENDAM)
====================================================== */
export class JobFilter {
  constructor({
    categories = [],
    services = [],
    skills = [],
    minPrice = null,
    maxPrice = null,
    deliveryTime = "",
  } = {}) {
    this.categories = categories;
    this.services = services;
    this.skills = skills;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.deliveryTime = deliveryTime;
  }
}

/* ======================================================
   FILTER SCREEN
====================================================== */
export default function FilterScreen({
  initialFilter = new JobFilter(),
  onApply,
  onClose,
}) {
  const [filter, setFilter] = useState(new JobFilter());
  const [activeSection, setActiveSection] = useState("categories");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  /* ---------------- DATA ---------------- */
  const categories = [
    "Graphic Design","Digital Marketing","Writing & Translation",
    "Video & Animation","Music & Audio","Programming & Tech",
    "Data","Business","Finance","Personal Growth",
    "Photography","AI Services","Consulting",
  ];

  const services = [
    "Logo Design","Brand Style Guides","Business Cards",
    "Art Direction","Illustration","AI Artists",
    "AI Avatar Design","Portraits & Caricature",
    "Story Board","Album Cover Design",
  ];

  const skills = [
    "Figma","React","Python","SQL","JavaScript",
    "Node.js","Flutter","MongoDB","Photoshop","Illustrator",
  ];

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const cloned = new JobFilter({ ...initialFilter });
    setFilter(cloned);
    setMinPrice(cloned.minPrice ?? "");
    setMaxPrice(cloned.maxPrice ?? "");
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

  const applyFilters = () => {
    const finalFilter = new JobFilter({
      ...filter,
      minPrice: minPrice !== "" ? Number(minPrice) : null,
      maxPrice: maxPrice !== "" ? Number(maxPrice) : null,
    });
    onApply && onApply(finalFilter);
    onClose && onClose();
  };

  const clearAll = () => {
    const empty = new JobFilter();
    setFilter(empty);
    setMinPrice("");
    setMaxPrice("");
    onApply && onApply(empty);
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.popup} onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div style={styles.appBar}>
          <button style={styles.backBtn} onClick={onClose}>←</button>
          <h2 style={{ margin: "0 auto" }}>Filters</h2>
        </div>

        {/* BODY */}
        <div style={styles.body}>

          {/* LEFT MENU */}
          <div style={styles.leftPanel}>
            {menuItems.map((m) => (
              <div
                key={m.key}
                onClick={() => setActiveSection(m.key)}
                style={{
                  ...styles.menuItem,
                  background:
                    activeSection === m.key ? "#FDFD96" : "transparent",
                }}
              >
                {m.label}
              </div>
            ))}
          </div>

          {/* RIGHT CONTENT */}
          <div style={styles.rightPanel}>

            {activeSection === "categories" && (
              <>
                <h3 style={styles.sectionTitle}>Categories</h3>
                <Wrap>
                  {categories.map((c) => (
                    <Chip
                      key={c}
                      label={c}
                      selected={filter.categories.includes(c)}
                      onClick={() => toggleValue("categories", c)}
                    />
                  ))}
                </Wrap>
              </>
            )}

            {activeSection === "services" && (
              <>
                <h3 style={styles.sectionTitle}>Service</h3>
                <Wrap>
                  {services.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      selected={filter.services.includes(s)}
                      onClick={() => toggleValue("services", s)}
                    />
                  ))}
                </Wrap>
              </>
            )}

            {activeSection === "skills" && (
              <>
                <h3 style={styles.sectionTitle}>Skills & Tools</h3>
                <Wrap>
                  {skills.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      selected={filter.skills.includes(s)}
                      onClick={() => toggleValue("skills", s)}
                    />
                  ))}
                </Wrap>
              </>
            )}

            {activeSection === "price" && (
              <>
                <h3 style={styles.sectionTitle}>Price Range</h3>
                <div style={styles.row}>
                  <input
                    style={styles.input}
                    placeholder="₹ Min"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    style={styles.input}
                    placeholder="₹ Max"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </>
            )}

            {activeSection === "posting" && (
              <>
                <h3 style={styles.sectionTitle}>Posting Time</h3>
                {postingTimes.map((t) => (
                  <label key={t} style={styles.radioRow}>
                    <input
                      type="radio"
                      checked={filter.deliveryTime === t}
                      onChange={() =>
                        setFilter((p) => ({ ...p, deliveryTime: t }))
                      }
                    />
                    {t}
                  </label>
                ))}
              </>
            )}

          </div>
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <button style={styles.clearBtn} onClick={clearAll}>Clear All</button>
          <button style={styles.applyBtn} onClick={applyFilters}>
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
}

/* ======================================================
   DATA
====================================================== */
const menuItems = [
  { key: "categories", label: "Categories" },
  { key: "services", label: "Service" },
  { key: "skills", label: "Skills & Tools" },
  { key: "price", label: "Price Range" },
  { key: "posting", label: "Posting Time" },
];

const postingTimes = [
  "Posted Today",
  "Last 3 Days",
  "Last 7 Days",
  "Last 30 Days",
];

/* ======================================================
   SMALL COMPONENTS
====================================================== */
const Wrap = ({ children }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
    {children}
  </div>
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

/* ======================================================
   STYLES
====================================================== */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 9999,
  },
  popup: {
    width: "100%",
    maxWidth: 480,
    height: "92%",
    background: "#fff",
    borderRadius: "18px 18px 0 0",
    display: "flex",
    flexDirection: "column",
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
    flex: 1,
    display: "flex",
  },
  leftPanel: {
    width: 140,
    borderRight: "1px solid #eee",
    padding: 12,
  },
  rightPanel: {
    flex: 1,
    padding: 16,
    overflowY: "auto",
  },
  menuItem: {
    padding: "12px 10px",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 6,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 12,
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
  },
  input: {
    flex: 1,
    padding: 12,
    background: "#FFFBD0",
    border: "none",
    borderRadius: 6,
  },
  radioRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  footer: {
    display: "flex",
    gap: 14,
    padding: 16,
    borderTop: "1px solid #eee",
  },
  clearBtn: {
    flex: 1,
    height: 48,
    background: "#D9C6FF",
    border: "none",
    borderRadius: 8,
  },
  applyBtn: {
    flex: 1,
    height: 48,
    background: "#7C3CFF",
    border: "none",
    borderRadius: 8,
    color: "#fff",
  },
};
