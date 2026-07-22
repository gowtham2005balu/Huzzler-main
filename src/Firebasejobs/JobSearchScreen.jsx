import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// NOTE: Firebase config must NOT be inside this file.
// Create `src/firebase.js` that exports { db, auth } using Firebase v9 modular SDK.
// Example (do this in src/firebase.js):
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// const app = initializeApp(YOUR_CONFIG);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../firbase/Firebase"; // <- your firebase exports (db, auth)

/*
  Single-file React implementation that mirrors your Flutter screen:
  - Combined fetch of services + service_24h
  - Search with autocomplete
  - Filters (category, timeline, budget range)
  - Cards with budget / timeline / skills
  - 24h navigation hook (you must implement routes for /service-24h/:id and /service/:id )

  Styling: Pure CSS included in this same file (so it's "one file").
*/

// ---------------------- Styles (pure CSS injected into DOM) ----------------------
const css = `
:root{--accent:#FDFD96;--accent-2:#FCE76A;--accent-dark:#E1C500}
*{box-sizing:border-box}
body{font-family: 'Rubik', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;}
.page-wrapper{background:#f7f7f7;min-height:100vh;padding:18px}
.header-search{background:var(--accent);border-radius:30px;padding:18px 14px;display:flex;align-items:center;gap:8px}
.header-search .back{background:transparent;border:none;font-size:18px}
.search-input{flex:1;position:relative}
.search-input input{width:100%;padding:10px 40px;border-radius:20px;border:none;outline:none;background:#fff}
.search-input .clear-btn{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:transparent;border:none}
.filter-btn{background:#fff;border-radius:10px;padding:8px;display:inline-flex;align-items:center;justify-content:center;border:0}
.chips-row{padding:10px 4px;display:flex;gap:8px;overflow:auto}
.chip{background:linear-gradient(90deg,var(--accent),var(--accent-2));padding:6px 10px;border-radius:24px;border:1px solid var(--accent-dark);display:flex;gap:6px;align-items:center}
.jobs-list{padding:8px;margin-top:8px}
.job-card{background:#fff;border-radius:14px;padding:14px;margin-bottom:12px;border:1px solid #eee;box-shadow:0 2px 6px rgba(0,0,0,0.05);display:flex;flex-direction:column}
.job-row{display:flex;gap:12px}
.job-left{flex:1}
.job-title{font-weight:600;font-size:18px;color:#111;margin-bottom:8px}
.meta-row{display:flex;gap:12px;font-size:12px;color:#666;align-items:center}
.price-box{min-width:100px;text-align:center;border:1px solid #eee;border-radius:8px;padding:6px}
.duration-box{min-width:100px;text-align:center;border-radius:8px;padding:6px;margin-top:6px}
.desc{color:#555;margin-top:8px;line-height:1.4}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.tag{background:#eee;padding:6px 8px;border-radius:12px;font-size:12px}
.autocomplete-list{position:absolute;background:#fff;border:1px solid #ddd;border-radius:8px;margin-top:6px;max-height:220px;overflow:auto;z-index:30;width:100%}
.autocomplete-item{padding:8px;cursor:pointer}
.empty-state{padding:40px;text-align:center;color:#666}
/* modal for filters */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.35);display:flex;align-items:flex-end;justify-content:center}
.modal{width:100%;max-width:760px;background:#fff;border-radius:14px;padding:16px;max-height:90vh;overflow:auto}
.section-title{font-weight:700;margin-bottom:12px}
.category-grid{display:flex;flex-wrap:wrap;gap:10px}
.category-item{padding:10px 12px;border-radius:12px;border:1px solid #e6e6e6;cursor:pointer}
.category-item.selected{background:linear-gradient(90deg,var(--accent),var(--accent-2));border-color:var(--accent-dark)}
.timeline-item{padding:12px;border-radius:12px;border:1px solid #e6e6e6;margin-bottom:8px;cursor:pointer}
.timeline-item.selected{background:linear-gradient(90deg,var(--accent),var(--accent-2));border-color:var(--accent-dark)}
.budget-row{display:flex;gap:12px;align-items:center}
.range-inputs{display:flex;gap:8px}
.range-inputs input[type=number]{width:120px;padding:8px;border-radius:8px;border:1px solid #ddd}
.modal-actions{display:flex;gap:12px;justify-content:space-between;padding-top:12px}
.btn{padding:10px 14px;border-radius:10px;border:none;cursor:pointer}
.btn.outline{border:1px solid #ccc;background:#fff}
.btn.primary{background:var(--accent);border:1px solid #000}
`;

// ---------------------- Helper Types & Functions ----------------------
function parseIntSafe(v) {
  if (v === undefined || v === null) return null;
  if (typeof v === "number") return Math.floor(v);
  const s = String(v).replace(/[^0-9]/g, "");
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}

function formatCurrency(amount) {
  if (!amount && amount !== 0) return "Budget not specified";
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return `${amount}`;
}

function formatDate(ts) {
  if (!ts) return "Date unknown";
  const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

// ---------------------- Main Page Component (Single File) ----------------------
export default function ClientJobSearchPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]); // flattened JobData
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // filters
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(100000);

  // autocomplete
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // categories and timelines (same as flutter list)
  const categories = useMemo(() => [
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Graphic Design",
    "Video Editing",
    "Digital Marketing",
    "SEO Optimization",
    "Content Writing",
    "Copywriting",
    "Social Media Management",
    "Virtual Assistant",
    "Customer Support",
    "E-commerce Setup",
    "Data Entry",
    "Translation",
    "3D Modeling",
    "Game Development",
    "Product Photography",
    "Voice Over",
    "Project Management",
  ], []);
  const timelines = useMemo(() => [
    "24 Hours",
    "Less than 1 month",
    "1-3 months",
    "3-6 months",
    "6+ months",
  ], []);

  // inject css one-time
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-generated", "client-job-search-css");
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);
    return () => {
      styleEl.remove();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    const col1 = collection(db, "services");
    const q1 = query(col1, orderBy("createdAt", "desc"));
    const col2 = collection(db, "service_24h");
    const q2 = query(col2, orderBy("createdAt", "desc"));

    const unsub1 = onSnapshot(q1, (snap) => {
      const s = snap.docs.map((d) => ({ ...d.data(), _id: d.id, _source: "services" }));
      setJobs((prev) => mergeJobs(prev, s));
      setLoading(false);
    });
    const unsub2 = onSnapshot(q2, (snap) => {
      const s = snap.docs.map((d) => ({ ...d.data(), _id: d.id, _source: "service_24h" }));
      setJobs((prev) => mergeJobs(prev, s));
      setLoading(false);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // build suggestions when searchText changes
  useEffect(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return setSuggestions([]);
    const setS = new Set();
    for (const job of jobs) {
      if (job.title && job.title.toLowerCase().includes(q)) setS.add(job.title);
      if (Array.isArray(job.skills)) {
        for (const s of job.skills) if (s.toLowerCase().includes(q)) setS.add(s);
      }
    }
    setSuggestions(Array.from(setS).slice(0, 6));
  }, [searchText, jobs]);

  // filtering + searching
  const filteredJobs = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return jobs.filter((j) => {
      const title = (j.title || "").toLowerCase();
      const desc = (j.description || "").toLowerCase();
      const skills = Array.isArray(j.skills) ? j.skills.map((s) => s.toLowerCase()) : [];
      const tools = Array.isArray(j.tools) ? j.tools.map((t) => t.toLowerCase()) : [];

      // search match
      const searchMatch = !q || title.includes(q) || desc.includes(q) || skills.some((s) => s.includes(q)) || tools.some((t) => t.includes(q));
      if (!searchMatch) return false;

      // budget check: job may have price, budget or budget_from/budget_to
      const budgetVal = parseIntSafe(j.price ?? j.budget ?? j.budget_from ?? j.budgetFrom ?? 0) || 0;
      if (budgetVal < budgetMin || budgetVal > budgetMax) return false;

      // category
      if (selectedCategory && ((j.category || "").toLowerCase() !== selectedCategory.toLowerCase())) return false;

      // timeline mapping
      if (selectedTimeline) {
        const jt = ((j.deliveryDuration || j.timeline || "") + "").toLowerCase();
        const ft = selectedTimeline.toLowerCase();
        if (ft === "24 hours" && !jt.includes("24")) return false;
        if (ft === "less than 1 month" && !(jt.includes("week") || jt.includes("day") || jt.includes("month") && jt.includes("1") )) return false;
        if (ft === "1-3 months" && !(jt.includes("1 month") || jt.includes("2 month") || jt.includes("3 month"))) return false;
        if (ft === "3-6 months" && !(jt.includes("4 month") || jt.includes("5 month") || jt.includes("6 month"))) return false;
        if (ft === "6+ months" && (jt.includes("7 month") || jt.includes("year") || jt.includes("8") || jt.includes("9")) === false) {
          // allow fallback: if timeline is numeric days > 180 then pass - but data shape is inconsistent so keep simple
        }
      }

      return true;
    }).sort((a, b) => {
      const ta = a.createdAt ? (a.createdAt.seconds ? a.createdAt.seconds : new Date(a.createdAt).getTime() / 1000) : 0;
      const tb = b.createdAt ? (b.createdAt.seconds ? b.createdAt.seconds : new Date(b.createdAt).getTime() / 1000) : 0;
      return tb - ta;
    });
  }, [jobs, searchText, budgetMin, budgetMax, selectedCategory, selectedTimeline]);

  // helper: merge incoming snapshot list into state while avoiding duplicates
  function mergeJobs(prev, incoming) {
    const map = new Map();
    // existing
    for (const p of prev) map.set(p._id + "::" + (p._source || ""), p);
    for (const n of incoming) map.set(n._id + "::" + (n._source || ""), n);
    return Array.from(map.values());
  }

  // UI actions
  function clearFilters() {
    setSelectedCategory(null);
    setSelectedTimeline(null);
    setBudgetMin(0);
    setBudgetMax(100000);
    setSearchText("");
  }

  function openJob(job) {
    if ((job._source || "") === "service_24h") {
      navigate(`/service-24h/${job._id}`);
    } else {
      navigate(`/service/${job._id}`);
    }
  }

  return (
    <div className="page-wrapper">
      <div className="header-search">
        <button className="back" onClick={() => window.history.back()}>&larr;</button>
        <div className="search-input" ref={searchRef}>
          <input
            placeholder="Search jobs"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => { /* show suggestions handled by effect */ }}
          />
          {searchText && (
            <button className="clear-btn" onClick={() => setSearchText("")}>✕</button>
          )}
          {suggestions.length > 0 && searchText.trim() !== "" && (
            <div className="autocomplete-list">
              {suggestions.map((s, i) => (
                <div key={i} className="autocomplete-item" onClick={() => { setSearchText(s); setSuggestions([]); }}>
                  {highlightMatch(s, searchText)}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="filter-btn" onClick={() => setShowFilters(true)}>⚙️</button>
      </div>

      {/* chips */}
      <div style={{height:12}} />
      <ChipsRow
        selectedCategory={selectedCategory}
        selectedTimeline={selectedTimeline}
        budgetMin={budgetMin}
        budgetMax={budgetMax}
        onClear={(type) => {
          if (type === 'category') setSelectedCategory(null);
          if (type === 'timeline') setSelectedTimeline(null);
          if (type === 'budget') { setBudgetMin(0); setBudgetMax(100000); }
        }}
      />

      {/* job list */}
      <div className="jobs-list">
        {loading && <div className="empty-state">Loading...</div>}
        {!loading && filteredJobs.length === 0 && (
          <div className="empty-state">
            <div style={{fontSize:32}}>🔍</div>
            <div style={{marginTop:12,fontWeight:600}}>No jobs match your filters</div>
            <div style={{marginTop:8,color:'#666'}}>Try clearing filters or changing your search</div>
            <div style={{marginTop:12}}>
              <button className="btn outline" onClick={clearFilters}>Clear filters</button>
            </div>
          </div>
        )}

        {filteredJobs.map((job) => (
          <JobCard key={job._id + '::' + (job._source||'')} job={job} onOpen={() => openJob(job)} />
        ))}
      </div>

      {showFilters && (
        <FiltersModal
          categories={categories}
          timelines={timelines}
          selectedCategory={selectedCategory}
          selectedTimeline={selectedTimeline}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          onClose={() => setShowFilters(false)}
          onApply={({ cat, tl, min, max }) => {
            setSelectedCategory(cat);
            setSelectedTimeline(tl);
            setBudgetMin(min);
            setBudgetMax(max);
            setShowFilters(false);
          }}
          onReset={() => {
            setSelectedCategory(null);
            setSelectedTimeline(null);
            setBudgetMin(0);
            setBudgetMax(100000);
          }}
        />
      )}
    </div>
  );
}

// ---------------------- Subcomponents ----------------------
function ChipsRow({ selectedCategory, selectedTimeline, budgetMin, budgetMax, onClear }) {
  const chips = [];
  if (selectedCategory) chips.push({ label: selectedCategory, type: 'category' });
  if (selectedTimeline) chips.push({ label: selectedTimeline, type: 'timeline' });
  if (budgetMin !== 0 || budgetMax !== 100000) chips.push({ label: `₹${budgetMin} - ₹${budgetMax}`, type: 'budget' });
  if (chips.length === 0) return null;
  return (
    <div className="chips-row">
      {chips.map((c, i) => (
        <div key={i} className="chip">
          <div style={{fontWeight:600}}>{c.label}</div>
          <button style={{background:'transparent',border:'none',marginLeft:8,cursor:'pointer'}} onClick={() => onClear(c.type)}>✕</button>
        </div>
      ))}
    </div>
  );
}

function JobCard({ job, onOpen }) {
  const budget = parseIntSafe(job.price ?? job.budget ?? job.budget_from ?? job.budgetFrom) || 0;
  const delivery = job.deliveryDuration || job.timeline || (job._source === 'service_24h' ? '24 Hours' : '');
  return (
    <div className="job-card" onClick={onOpen}>
      <div className="job-row">
        <div className="job-left">
          <div className="job-title">{job.title}</div>
          <div className="meta-row">
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 7h7l-5.5 4 2 8L12 17 5.5 21l2-8L2 9h7l3-7z" fill="#ccc"/></svg>
              <div>{job.category || 'Uncategorized'}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5v14" stroke="#ccc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div>{job.views || job.impressions || 0} views</div>
            </div>
          </div>
          <div className="desc">{job.description}</div>
          <div className="tags">
            {(Array.isArray(job.skills) ? job.skills.slice(0,2) : []).map((s, idx) => (
              <div className="tag" key={idx}>{s}</div>
            ))}
            {Array.isArray(job.tools) && job.tools.length > 0 && job.skills.length < 2 && (
              <div className="tag">{job.tools[0]}</div>
            )}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
          <div className="price-box">₹{budget}</div>
          <div className="duration-box" style={{background: delivery && String(delivery).trim().toLowerCase().includes('24') ? 'orange' : 'rgba(252,231,106,0.9)'}}>{delivery || '24 Hours'}</div>
        </div>
      </div>
    </div>
  );
}

function FiltersModal({ categories, timelines, selectedCategory, selectedTimeline, budgetMin, budgetMax, onClose, onApply, onReset }) {
  const [cat, setCat] = useState(selectedCategory);
  const [tl, setTl] = useState(selectedTimeline);
  const [min, setMin] = useState(budgetMin || 0);
  const [max, setMax] = useState(budgetMax || 100000);

  useEffect(() => {
    setCat(selectedCategory);
    setTl(selectedTimeline);
    setMin(budgetMin);
    setMax(budgetMax);
  }, [selectedCategory, selectedTimeline, budgetMin, budgetMax]);

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target.classList.contains('modal-backdrop')) onClose(); }}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div className="section-title">Filters</div>
          <div>
            <button className="btn outline" onClick={() => { onReset(); setCat(null); setTl(null); setMin(0); setMax(100000); }}>Reset</button>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <div className="section-title">Category</div>
          <div className="category-grid">
            {categories.map((c) => (
              <div key={c} className={`category-item ${cat===c? 'selected':''}`} onClick={() => setCat(cat===c? null: c)}>
                {c}
              </div>
            ))}
          </div>
        </div>

        <div style={{marginTop:18}}>
          <div className="section-title">Project Timeline</div>
          <div>
            {timelines.map((t) => (
              <div key={t} className={`timeline-item ${tl===t? 'selected':''}`} onClick={() => setTl(tl===t ? null : t)}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {tl===t ? '✓' : '○'}
                  </div>
                  <div style={{fontWeight:600}}>{t}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginTop:18}}>
          <div className="section-title">Budget Range</div>
          <div className="budget-row">
            <div className="range-inputs">
              <input type="number" value={min} onChange={(e)=>setMin(Math.max(0,Number(e.target.value)||0))} />
              <input type="number" value={max} onChange={(e)=>setMax(Math.max(0,Number(e.target.value)||0))} />
            </div>
            <div style={{marginLeft:'auto',fontWeight:700}}>₹{min} - ₹{max}</div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn outline" onClick={() => onClose()}>Cancel</button>
          <div style={{display:'flex',gap:8}}>
            <button className="btn outline" onClick={() => { setCat(null); setTl(null); setMin(0); setMax(100000); onReset(); }}>Reset</button>
            <button className="btn primary" onClick={() => onApply({ cat, tl, min, max })}>Apply Filters</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ---------------------- Utility: highlight match ----------------------
function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <span>
      {text.substring(0, idx)}
      <strong style={{background:'yellow'}}>{text.substring(idx, idx + query.length)}</strong>
      {text.substring(idx + query.length)}
    </span>
  );
}

// TODO: Full React Hooks version will be added here (VERY LARGE FILE).