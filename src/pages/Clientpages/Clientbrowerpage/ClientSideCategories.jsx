// // filter.jsx
// import React, { useEffect, useState } from "react";

// /* =========================
//    MODELS
// ========================= */
// const emptyJobFilter = {
//   categories: [],
//   services: [],
//   skills: [],
//   minPrice: null,
//   maxPrice: null,
//   deliveryTime: "",
//   minDays: null,
//   maxDays: null,
// };

// /* =========================
//    HELPERS
// ========================= */
// const mapDeliveryToPostingTime = (delivery) => {
//   switch (delivery) {
//     case "24h":
//       return "Posted Today";
//     case "7d":
//       return "Last 7 Days";
//     default:
//       return "";
//   }
// };

// /* =========================
//    COMPONENT
// ========================= */
// export default function JobFilterScreen({
//   initialFilter = emptyJobFilter,
//   onApply,
//   onClose,
// }) {
//   /* ---------------- STATE ---------------- */
//   const [filter, setFilter] = useState({ ...initialFilter });

//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [minDays, setMinDays] = useState("");
//   const [maxDays, setMaxDays] = useState("");

//   /* ---------------- DATA ---------------- */
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

//   /* ---------------- INIT ---------------- */
//   useEffect(() => {
//     setMinPrice(filter.minPrice ?? "");
//     setMaxPrice(filter.maxPrice ?? "");
//     setMinDays(filter.minDays ?? "");
//     setMaxDays(filter.maxDays ?? "");
//   }, []);

//   /* ---------------- UI HELPERS ---------------- */
//   const toggleItem = (key, value) => {
//     setFilter((prev) => ({
//       ...prev,
//       [key]: prev[key].includes(value)
//         ? prev[key].filter((v) => v !== value)
//         : [...prev[key], value],
//     }));
//   };

//   const yellowInput = {
//     padding: "12px",
//     background: "#FFFDBD",
//     border: "none",
//     borderRadius: "4px",
//     width: "100%",
//   };

//   /* ---------------- APPLY ---------------- */
//   const applyFilters = () => {
//     const minP = minPrice ? parseInt(minPrice) : null;
//     const maxP = maxPrice ? parseInt(maxPrice) : null;

//     if (minP !== null && maxP !== null && minP > maxP) {
//       alert("Min price cannot be greater than max price");
//       return;
//     }

//     const minD = minDays ? parseInt(minDays) : null;
//     const maxD = maxDays ? parseInt(maxDays) : null;

//     if (minD !== null && maxD !== null && minD > maxD) {
//       alert("Min days cannot be greater than max days");
//       return;
//     }

//     onApply({
//       categories: filter.categories,
//       skills: filter.skills,
//       postingTime: mapDeliveryToPostingTime(filter.deliveryTime),
//       budgetRange: [minP ?? 0, maxP ?? 100000],
//     });
//   };

//   /* =========================
//      RENDER
//   ========================= */
//   return (
//     <div style={{ padding: 16, background: "#fff" }}>
//       {/* HEADER */}
//       <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
//         <button onClick={onClose}>←</button>
//         <h2 style={{ margin: "0 auto" }}>Filters</h2>
//       </div>

//       {/* CATEGORIES */}
//       <h3>Categories</h3>
//       <div className="wrap">
//         {categories.map((c) => (
//           <Chip
//             key={c}
//             label={c}
//             selected={filter.categories.includes(c)}
//             onClick={() => toggleItem("categories", c)}
//           />
//         ))}
//       </div>

//       {/* SERVICES */}
//       <h3 style={{ marginTop: 20 }}>Service</h3>
//       <div className="wrap">
//         {services.map((s) => (
//           <Chip
//             key={s}
//             label={s}
//             selected={filter.services.includes(s)}
//             onClick={() => toggleItem("services", s)}
//           />
//         ))}
//       </div>

//       {/* SKILLS */}
//       <h3 style={{ marginTop: 20 }}>Skills & Tools</h3>
//       <div className="wrap">
//         {skills.map((s) => (
//           <Chip
//             key={s}
//             label={s}
//             selected={filter.skills.includes(s)}
//             onClick={() => toggleItem("skills", s)}
//           />
//         ))}
//       </div>

//       {/* PRICE */}
//       <h3 style={{ marginTop: 20 }}>Price</h3>
//       <div style={{ display: "flex", gap: 12 }}>
//         <input
//           placeholder="Min"
//           value={minPrice}
//           onChange={(e) => setMinPrice(e.target.value)}
//           style={yellowInput}
//         />
//         <input
//           placeholder="Max"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//           style={yellowInput}
//         />
//       </div>

//       {/* DELIVERY */}
//       <h3 style={{ marginTop: 20 }}>Delivery Time</h3>
//       {[
//         ["Up to 24 Hours", "24h"],
//         ["Up to 7 days", "7d"],
//         ["Custom Range", "custom"],
//       ].map(([label, value]) => (
//         <label key={value} style={{ display: "flex", marginTop: 8 }}>
//           <input
//             type="radio"
//             checked={filter.deliveryTime === value}
//             onChange={() =>
//               setFilter((p) => ({ ...p, deliveryTime: value }))
//             }
//           />
//           <span style={{ marginLeft: 8 }}>{label}</span>
//         </label>
//       ))}

//       {filter.deliveryTime === "custom" && (
//         <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
//           <input
//             placeholder="Min Days"
//             value={minDays}
//             onChange={(e) => setMinDays(e.target.value)}
//             style={yellowInput}
//           />
//           <input
//             placeholder="Max Days"
//             value={maxDays}
//             onChange={(e) => setMaxDays(e.target.value)}
//             style={yellowInput}
//           />
//         </div>
//       )}

//       {/* BUTTONS */}
//       <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
//         <button
//           style={{ flex: 1, background: "#D9C6FF", height: 48 }}
//           onClick={() => onApply(emptyJobFilter)}
//         >
//           Clear All
//         </button>

//         <button
//           style={{ flex: 1, background: "#7C3CFF", color: "#fff", height: 48 }}
//           onClick={applyFilters}
//         >
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   );
// }

// /* =========================
//    CHIP COMPONENT
// ========================= */
// function Chip({ label, selected, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       style={{
//         display: "inline-block",
//         padding: "10px 14px",
//         borderRadius: 8,
//         background: selected ? "#FDFD96" : "#FFFFDC",
//         cursor: "pointer",
//         margin: 4,
//       }}
//     >
//       {label}
//     </div>
//   );
// }
// ExploreFreelancer.jsx



import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firbase/Firebase";
import { useNavigate } from "react-router-dom";

/* =========================
   FILTER MODEL
========================= */
const emptyFilter = {
  categories: [],
  services: [],
  skills: [],
  minPrice: null,
  maxPrice: null,
  deliveryTime: "",
  minDays: null,
  maxDays: null,
};

/* =========================
   MAIN COMPONENT
========================= */
export default function ExploreClientJobScreen({ initialTab = "Freelancer" }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [activeFilter, setActiveFilter] = useState(emptyFilter);

  const [services, setServices] = useState([]);
  const [services24, setServices24] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!user) return; // 🔥 important null guard

    const unsub1 = onSnapshot(collection(db, "services"), (snap) => {
      setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsub2 = onSnapshot(collection(db, "service_24h"), (snap) => {
      setServices24(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubUser = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedJobs(snap.data()?.savedJobs || []);
    });

    return () => {
      unsub1();
      unsub2();
      unsubUser();
    };
  }, [user]);

  /* ---------------- HELPERS ---------------- */
  const incrementViewOnce = async (collectionName, jobId) => {
    if (!user) return;

    const ref = doc(db, collectionName, jobId);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) return;

      const viewedBy = snap.data().viewedBy || [];
      if (viewedBy.includes(user.uid)) return;

      tx.update(ref, {
        views: increment(1),
        viewedBy: arrayUnion(user.uid),
      });
    });
  };

  const toggleSave = async (jobId) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    if (savedJobs.includes(jobId)) {
      await updateDoc(ref, { savedJobs: arrayRemove(jobId) });
    } else {
      await updateDoc(ref, { savedJobs: arrayUnion(jobId) });
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const applyFilters = (list) => {
    return list.filter((job) => {
      const title = (job.title || "").toLowerCase();
      const category = job.category || "";
      const sub = job.subCategory || "";
      const skills = job.skills || [];

      // search
      if (
        search &&
        !(
          title.includes(search) ||
          category.toLowerCase().includes(search) ||
          sub.toLowerCase().includes(search) ||
          skills.some((s) => s.toLowerCase().includes(search))
        )
      )
        return false;

      // category
      if (
        activeFilter.categories.length &&
        !activeFilter.categories.includes(category)
      )
        return false;

      // skills
      if (
        activeFilter.skills.length &&
        !skills.some((s) => activeFilter.skills.includes(s))
      )
        return false;

      // price
      if (activeFilter.minPrice || activeFilter.maxPrice) {
        const min = activeFilter.minPrice ?? 0;
        const max = activeFilter.maxPrice ?? Infinity;
        if (
          (job.budget_from ?? 0) < min ||
          (job.budget_to ?? Infinity) > max
        )
          return false;
      }

      return true;
    });
  };

  const sortJobs = (list) => {
    if (sort === "Newest") {
      return [...list].sort(
        (a, b) =>
          (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
    }
    if (sort === "Oldest") {
      return [...list].sort(
        (a, b) =>
          (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
      );
    }
    return list;
  };

  /* ---------------- FILTERED DATA ---------------- */
  const freelancerJobs = useMemo(
    () => sortJobs(applyFilters(services)),
    [services, search, sort, activeFilter]
  );

  const jobs24 = useMemo(
    () => sortJobs(applyFilters(services24)),
    [services24, search, sort, activeFilter]
  );

  const saved = useMemo(
    () =>
      [...services, ...services24].filter((j) =>
        savedJobs.includes(j.id)
      ),
    [services, services24, savedJobs]
  );

  /* =========================
     UI
  ========================= */
  return (
    <div style={{ padding: 16 }}>
      <h2>Explore Freelancer</h2>

      {/* TABS */}
      <div style={{ display: "flex", gap: 30 }}>
        {["Freelancer", "24 hour", "Saved"].map((t) => (
          <Tab
            key={t}
            label={t}
            active={selectedTab === t}
            onClick={() => setSelectedTab(t)}
          />
        ))}
      </div>

      {/* SEARCH */}
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={() => navigate("/filters")}>⚙️</button>
      </div>

      {/* SORT */}
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {["Experience", "Newest", "Oldest"].map((s) => (
          <Chip
            key={s}
            label={s}
            selected={sort === s}
            onClick={() => setSort(sort === s ? "" : s)}
          />
        ))}
      </div>

      {/* LIST */}
      <div style={{ marginTop: 20 }}>
        {selectedTab === "Freelancer" &&
          freelancerJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpen={() => {
                incrementViewOnce("services", job.id);
                navigate(`/service/${job.id}`);
              }}
              saved={savedJobs.includes(job.id)}
              onSave={() => toggleSave(job.id)}
            />
          ))}

        {selectedTab === "24 hour" &&
          jobs24.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpen={() => {
                incrementViewOnce("service_24h", job.id);
                navigate(`/service24/${job.id}`);
              }}
              saved={savedJobs.includes(job.id)}
              onSave={() => toggleSave(job.id)}
            />
          ))}

        {selectedTab === "Saved" &&
          saved.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpen={() =>
                navigate(
                  job.deliveryDuration === "24 Hours"
                    ? `/service24/${job.id}`
                    : `/service/${job.id}`
                )
              }
              saved
              onSave={() => toggleSave(job.id)}
            />
          ))}
      </div>
    </div>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */
function Tab({ label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ cursor: "pointer" }}>
      <div>{label}</div>
      {active && (
        <div
          style={{
            height: 3,
            width: 50,
            background: "gold",
            borderRadius: 10,
          }}
        />
      )}
    </div>
  );
}

function Chip({ label, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 20,
        background: selected ? "#7C3CFF" : "#EEE5FF",
        color: selected ? "#fff" : "#000",
        cursor: "pointer",
      }}
    >
      {label}
    </div>
  );
}

function JobCard({ job, onOpen, saved, onSave }) {
  return (
    <div
      onClick={onOpen}
      style={{
        border: "1px solid #ddd",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        cursor: "pointer",
      }}
    >
      <h3>{job.title}</h3>
      <div>{job.skills?.slice(0, 3).join(", ")}</div>
      <div style={{ marginTop: 8 }}>
        ₹{job.budget_from} – ₹{job.budget_to}
      </div>
      <div style={{ marginTop: 8 }}>Views: {job.views || 0}</div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSave();
        }}
      >
        {saved ? "🔖 Saved" : "📑 Save"}
      </button>
    </div>
  );
}
