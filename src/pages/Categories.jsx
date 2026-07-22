
// import React, { useEffect, useState } from "react";
// import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { db } from "../firbase/Firebase";
// import {
//   FiBell,
//   FiMessageSquare,
//   FiUser,
//   FiArrowLeft,
//   FiBookmark,
//   FiPlus,
//   FiFilter,
//   FiChevronDown,
//   FiEye,
//   FiClock,
// } from "react-icons/fi";

// export default function FreelanceHome() {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   const [jobs, setJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [jobTab, setJobTab] = useState("24h");

//   const [categories, setCategories] = useState([]);

//   // FETCH JOBS
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setJobs(
//         list.sort(
//           (a, b) =>
//             (b.created_at?.toDate?.() || 0) - (a.created_at?.toDate?.() || 0)
//         )
//       );
//     });
//     return unsub;
//   }, []);

//   // FETCH SAVED JOBS
//   useEffect(() => {
//     if (!user) return;
//     const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
//       setSavedJobs(snap.data()?.favoriteJobs || []);
//     });
//     return unsub;
//   }, [user]);

//   // FETCH CATEGORIES FROM DB
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "users"), (snap) => {

//       // Get all category fields from users
//       const allCats = snap.docs
//         .map((d) => d.data().category)
//         .filter((cat) => cat && cat.trim() !== ""); // remove empty/null

//       // Remove duplicates
//       const uniqueCats = [...new Set(allCats)];

//       // Convert to array of objects for UI
//       const finalCats = uniqueCats.map((name, index) => ({
//         id: index + 1,
//         name,
//       }));

//       setCategories(finalCats);
//     });

//     return unsub;
//   }, []);


//    useEffect(() => {
//       const unsub1 = onSnapshot(collection(db, "jobs"), (snap) => {
//         const normalJobs = snap.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//           jobtype: "jobs",
//         }));
  
//         setJobs((prev) => {
//           const only24h = prev.filter((j) => j.jobtype === "jobs_24h");
//           return [...only24h, ...normalJobs];
//         });
//       });
  
//       const unsub2 = onSnapshot(collection(db, "jobs_24h"), (snap) => {
//         const fastJobs = snap.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//           jobtype: "jobs_24h",
//         }));
  
//         setJobs((prev) => {
//           const onlyNormal = prev.filter((j) => j.jobtype === "jobs");
//           return [...onlyNormal, ...fastJobs];
//         });
//       });
  
//       return () => {
//         unsub1();
//         unsub2();
//       };
//     }, []);
//   const toggleSave = async (jobId) => {
//     if (!user) return;
//     const ref = doc(db, "users", user.uid);
//     const updated = savedJobs.includes(jobId)
//       ? savedJobs.filter((id) => id !== jobId)
//       : [...savedJobs, jobId];

//     setSavedJobs(updated);
//     await updateDoc(ref, { favoriteJobs: updated });
//   };

//   const filteredJobs = jobs.filter((job) => {
//     const matchTab =
//       jobTab === "24h"
//         ? job.jobtype === "jobs_24h"
//         : jobTab === "full"
//           ? job.jobtype !== "jobs_24h"
//           : savedJobs.includes(job.id);

//     const matchSearch =
//       job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
//       job.description?.toLowerCase().includes(searchText.toLowerCase());

//     const matchCategory = selectedCategory
//       ? job.category === selectedCategory
//       : true;

//     return matchTab && matchSearch && matchCategory;
//   });

//   return (
//     <div className="freelance-wrapper">

//       {/* TOP BAR */}
//       <div className="topbar">
//         <div className="top-left">
//           <div className="back-btn" onClick={() => navigate(-1)}>
//             <FiArrowLeft size={20} />
//           </div>
//           <h2 className="page-title">Browse Projects</h2>
//         </div>

//         <div className="top-right">
//           <FiMessageSquare className="top-icon" />
//           <FiBell className="top-icon" />
//           <FiUser className="top-icon" />
//         </div>
//       </div>

//       {/* Search */}
//       <div className="search-row">
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Search projects..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />
//       </div>

//       {/* CATEGORIES (ONLY IF LIST > 0) */}
//       {categories.length > 0 ? (
//         <div className="category-row">
//           {categories.map((cat) => (
//             <button
//               key={cat.id}
//               className={
//                 selectedCategory === cat.name
//                   ? "category-active"
//                   : "category-btn"
//               }
//               onClick={() =>
//                 setSelectedCategory(
//                   selectedCategory === cat.name ? "" : cat.name
//                 )
//               }
//             >
//               {cat.name}
//             </button>
//           ))}
//         </div>
//       ) : (
//         <div style={{ padding: "10px 0", opacity: 0.5 }}>
//           No categories found in database.
//         </div>
//       )}


//       {/* Tabs */}
//       <div className="jobtabs-wrapper">
//         <button
//           className={`jobtab ${jobTab === "full" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("full")}
//         >
//           Works
//         </button>
//         <button
//           className={`jobtab ${jobTab === "24h" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("24h")}
//         >
//           24H Jobs
//         </button>
//         <button
//           className={`jobtab ${jobTab === "saved" ? "active-tab" : ""}`}
//           onClick={() => setJobTab("saved")}
//         >
//           Saved
//         </button>
//       </div>

//       {/* Filter + Sort */}
//       <div className="filter-sort-row">
//         <button className="filter-btn">
//           <FiFilter /> Filter
//         </button>
//         <button className="sort-btn">
//           Sort <FiChevronDown />
//         </button>
//       </div>

//       {/* JOB LIST */}
//       <div className="job-list">
//         {filteredJobs.map((job) => (
//           <div
//             key={job.id}
//             className="job-card"
//             onClick={() =>
//               navigate(
//                 job.jobtype === "jobs_24h"
//                   ? `/freelance-dashboard/job-24/${job.id}`
//                   : `/freelance-dashboard/job-full/${job.id}`
//               )
//             }
//           >
//             <div className="job-top">
//               <h3 className="job-title">{job.title}</h3>
//               <FiBookmark
//                 className={`bookmark-icon ${savedJobs.includes(job.id) ? "bookmarked" : ""
//                   }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleSave(job.id);
//                 }}
//               />
//             </div>

//             <p className="job-desc">{job.description}</p>

//             <div className="job-info-row">
//               <span className="job-amount">₹{job.budget_from} / day</span>

//               <div className="job-icon-group">
//                 <span className="tag-icon">
//                   <FiEye /> {job.rating || "4+"}
//                 </span>
//                 <span className="tag-icon">
//                   <FiClock /> {job.time || "2 hours ago"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Floating + Button */}
//       <button
//         className="floating-plus"
//         onClick={() => navigate("/freelance-dashboard/add-service-form")}
//       >
//         <FiPlus size={22} />
//       </button>

//       {/* CSS */}
//       <style>{`
//         * { font-family: 'Poppins', sans-serif; }

//         .freelance-wrapper { padding: 20px 22px; }

//         .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//         .top-left { display: flex; align-items: center; gap: 12px; }
//         .back-btn {
//           width: 44px; height: 44px; background: #efe9ff;
//           border-radius: 14px; display: flex; align-items: center;
//           justify-content: center; cursor: pointer;
//         }
//         .page-title { font-size: 21px; font-weight: 700; }
//         .top-right { display: flex; gap: 16px; }
//         .top-icon { font-size: 20px; cursor: pointer; }

//         .search-input {
//           width: 100%; padding: 12px 14px;
//           border-radius: 12px; background: #fff;
//           border: 1px solid #e6e7ee; font-size: 15px;
//         }

//         /* CATEGORIES */
//         .category-row { display: flex; gap: 10px; margin: 14px 0; overflow-x: auto; }
//         .category-btn, .category-active {
//           padding: 8px 14px; white-space: nowrap;
//           border-radius: 999px; cursor: pointer; font-weight: 600;
//         }
//         .category-btn { background: white; border: 1px solid #e2e8f0; color: #444; }
//         .category-active { background: #7c3aed; color: #fff; border: 1px solid #7c3aed; }

//         /* Tabs */
//         .jobtabs-wrapper {
//           background: #fff; display: flex; gap: 10px;
//           padding: 10px; border-radius: 14px; border: 1px solid #ececec;
//         }
//         .jobtab {
//           padding: 10px 14px; border-radius: 10px; border: none;
//           font-weight: 700; cursor: pointer; opacity: .6; width: 100px;
//         }
//         .active-tab { background: #7c3aed; color: white; opacity: 1; }

//         .filter-sort-row { display: flex; gap: 10px; margin: 12px 0; }
//         .filter-btn, .sort-btn {
//           display: flex; gap: 8px; align-items: center;
//           padding: 9px 12px; background: #fff; border: 1px solid #e6e7ee;
//           border-radius: 10px; cursor: pointer; font-weight: 600;
//         }

//         .job-list { display: flex; flex-direction: column; gap: 18px; }
//         .job-card {
//           background: #fff; border-radius: 18px; padding: 18px;
//           border: 1px solid #ececec; cursor: pointer;
//           transition: .2s; display: flex; flex-direction: column; gap: 8px;
//         }
//         .job-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }

//         .job-top { display: flex; justify-content: space-between; align-items: flex-start; }
//         .job-title { font-size: 17px; font-weight: 700; margin: 0; }
//         .job-desc { font-size: 14px; opacity: .85; margin: 0; }

//         .bookmark-icon { font-size: 20px; cursor: pointer; color: #777; }
//         .bookmarked { color: #7c3aed !important; }

//         .job-info-row {
//           display: flex; justify-content: space-between;
//           align-items: center; margin-top: 6px;
//         }
//         .job-amount { font-size: 17px; font-weight: 700; color: #222; }
//         .job-icon-group { display: flex; gap: 12px; }
//         .tag-icon { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #616161; }

//         .floating-plus {
//           position: fixed; right: 22px; bottom: 22px;
//           width: 56px; height: 56px; border-radius: 50%;
//           background: linear-gradient(180deg, #7c3aed, #6d28d9);
//           color: white; border: none; cursor: pointer;
//           display: flex; align-items: center; justify-content: center;
//           box-shadow: 0 8px 18px rgba(99,102,241,.2);
//         }
//       `}</style>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firbase/Firebase";
import {
  FiBell,
  FiMessageSquare,
  FiUser,
  FiArrowLeft,
  FiBookmark,
  FiPlus,
  FiFilter,
  FiChevronDown,
  FiEye,
  FiClock,
} from "react-icons/fi";

export default function FreelanceHome() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [jobTab, setJobTab] = useState("24h");

  const [categories, setCategories] = useState([]);

  // ⭐ NEW — SIDEBAR COLLAPSE STATE
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ⭐ LISTEN FOR SIDEBAR EVENT
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // FETCH JOBS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setJobs(
        list.sort(
          (a, b) =>
            (b.created_at?.toDate?.() || 0) - (a.created_at?.toDate?.() || 0)
        )
      );
    });
    return unsub;
  }, []);

  // FETCH SAVED JOBS
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setSavedJobs(snap.data()?.favoriteJobs || []);
    });
    return unsub;
  }, [user]);

  // FETCH CATEGORIES (FROM USERS)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const allCats = snap.docs
        .map((d) => d.data().category)
        .filter((cat) => cat && cat.trim() !== "");

      const uniqueCats = [...new Set(allCats)];

      const finalCats = uniqueCats.map((name, index) => ({
        id: index + 1,
        name,
      }));

      setCategories(finalCats);
    });

    return unsub;
  }, []);

  // MERGE JOBS & JOBS_24H
  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "jobs"), (snap) => {
      const normalJobs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        jobtype: "jobs",
      }));

      setJobs((prev) => {
        const only24h = prev.filter((j) => j.jobtype === "jobs_24h");
        return [...only24h, ...normalJobs];
      });
    });

    const unsub2 = onSnapshot(collection(db, "jobs_24h"), (snap) => {
      const fastJobs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        jobtype: "jobs_24h",
      }));

      setJobs((prev) => {
        const onlyNormal = prev.filter((j) => j.jobtype === "jobs");
        return [...onlyNormal, ...fastJobs];
      });
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const toggleSave = async (jobId) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);

    const updated = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(updated);
    await updateDoc(ref, { favoriteJobs: updated });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchTab =
      jobTab === "24h"
        ? job.jobtype === "jobs_24h"
        : jobTab === "full"
        ? job.jobtype !== "jobs_24h"
        : savedJobs.includes(job.id);

    const matchSearch =
      job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchText.toLowerCase());

    const matchCategory = selectedCategory
      ? job.category === selectedCategory
      : true;

    return matchTab && matchSearch && matchCategory;
  });

  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      {/* TOP BAR */}
      <div className="topbar">
        <div className="top-left">
          <div className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </div>
          <h2 className="page-title">Browse Projects</h2>
        </div>

        <div className="top-right">
          <FiMessageSquare className="top-icon" />
          <FiBell className="top-icon" />
          <FiUser className="top-icon" />
        </div>
      </div>

      {/* Search */}
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search projects..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* CATEGORIES */}
      {categories.length > 0 ? (
        <div className="category-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={
                selectedCategory === cat.name
                  ? "category-active"
                  : "category-btn"
              }
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.name ? "" : cat.name
                )
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ padding: 10, opacity: 0.5 }}>No categories found.</div>
      )}

      {/* Tabs */}
      <div className="jobtabs-wrapper">
        <button
          className={`jobtab ${jobTab === "full" ? "active-tab" : ""}`}
          onClick={() => setJobTab("full")}
        >
          Works
        </button>
        <button
          className={`jobtab ${jobTab === "24h" ? "active-tab" : ""}`}
          onClick={() => setJobTab("24h")}
        >
          24H Jobs
        </button>
        <button
          className={`jobtab ${jobTab === "saved" ? "active-tab" : ""}`}
          onClick={() => setJobTab("saved")}
        >
          Saved
        </button>
      </div>

      {/* Filter + Sort */}
      <div className="filter-sort-row">
        <button className="filter-btn">
          <FiFilter /> Filter
        </button>
        <button className="sort-btn">
          Sort <FiChevronDown />
        </button>
      </div>

      {/* JOB LIST */}
      <div className="job-list">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="job-card"
            onClick={() =>
              navigate(
                job.jobtype === "jobs_24h"
                  ? `/freelance-dashboard/job-24/${job.id}`
                  : `/freelance-dashboard/job-full/${job.id}`
              )
            }
          >
            <div className="job-top">
              <h3 className="job-title">{job.title}</h3>

              <FiBookmark
                className={`bookmark-icon ${
                  savedJobs.includes(job.id) ? "bookmarked" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(job.id);
                }}
              />
            </div>

            <p className="job-desc">{job.description}</p>

            <div className="job-info-row">
              <span className="job-amount">₹{job.budget_from} / day</span>

              <div className="job-icon-group">
                <span className="tag-icon">
                  <FiEye /> {job.rating || "4+"}
                </span>
                <span className="tag-icon">
                  <FiClock /> {job.time || "2 hours ago"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Button */}
      <button
        className="floating-plus"
        onClick={() => navigate("/freelance-dashboard/add-service-form")}
      >
        <FiPlus size={22} />
      </button>

      {/* CSS */}
      <style>{`
        * { font-family: 'Poppins', sans-serif; }

        .freelance-wrapper { padding: 20px 22px; }

        .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .top-left { display: flex; align-items: center; gap: 12px; }
        .back-btn {
          width: 44px; height: 44px; background: #efe9ff;
          border-radius: 14px; display: flex; align-items: center;
          justify-content: center; cursor: pointer;
        }
        .page-title { font-size: 21px; font-weight: 700; }
        .top-right { display: flex; gap: 16px; }
        .top-icon { font-size: 20px; cursor: pointer; }

        .search-input {
          width: 100%; padding: 12px 14px;
          border-radius: 12px; background: #fff;
          border: 1px solid #e6e7ee; font-size: 15px;
        }

        /* Categories */
        .category-row { display: flex; gap: 10px; margin: 14px 0; overflow-x: auto; }
        .category-btn, .category-active {
          padding: 8px 14px; white-space: nowrap;
          border-radius: 999px; cursor: pointer; font-weight: 600;
        }
        .category-btn { background: white; border: 1px solid #e2e8f0; color: #444; }
        .category-active { background: #7c3aed; color: #fff; border: 1px solid #7c3aed; }

        /* Tabs */
        .jobtabs-wrapper {
          background: #fff; display: flex; gap: 10px;
          padding: 10px; border-radius: 14px; border: 1px solid #ececec;
        }
        .jobtab {
          padding: 10px 14px; border-radius: 10px; border: none;
          font-weight: 700; cursor: pointer; opacity: .6; width: 100px;
        }
        .active-tab { background: #7c3aed; color: white; opacity: 1; }

        .filter-sort-row { display: flex; gap: 10px; margin: 12px 0; }
        .filter-btn, .sort-btn {
          display: flex; gap: 8px; align-items: center;
          padding: 9px 12px; background: #fff; border: 1px solid #e6e7ee;
          border-radius: 10px; cursor: pointer; font-weight: 600;
        }

        .job-list { display: flex; flex-direction: column; gap: 18px; }
        .job-card {
          background: #fff; border-radius: 18px; padding: 18px;
          border: 1px solid #ececec; cursor: pointer;
          transition: .2s; display: flex; flex-direction: column; gap: 8px;
        }
        .job-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }

        .job-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .job-title { font-size: 17px; font-weight: 700; margin: 0; }
        .job-desc { font-size: 14px; opacity: .85; margin: 0; }

        .bookmark-icon { font-size: 20px; cursor: pointer; color: #777; }
        .bookmarked { color: #7c3aed !important; }

        .job-info-row {
          display: flex; justify-content: space-between;
          align-items: center; margin-top: 6px;
        }
        .job-amount { font-size: 17px; font-weight: 700; color: #222; }
        .job-icon-group { display: flex; gap: 12px; }
        .tag-icon { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #616161; }

        .floating-plus {
          position: fixed; right: 22px; bottom: 22px;
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(180deg, #7c3aed, #6d28d9);
          color: white; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 18px rgba(99,102,241,.2);
        }
      `}</style>
    </div>
  );
}
