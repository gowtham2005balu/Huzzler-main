// import React, { useEffect, useState } from "react";
// import { 
//   collection, 
//   getDocs, 
//   doc, 
//   deleteDoc, 
//   updateDoc, 
//   setDoc 
// } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import "./PausedServicesPage.css";

// const PausedJobsPage = () => {
//   const [pausedJobs, setPausedJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // FETCH pausedJobs + paused_service
//   const fetchPausedJobs = async () => {
//     try {
//       const snapNormal = await getDocs(collection(db, "pausedJobs"));
//       const snap24h = await getDocs(collection(db, "paused_service"));

//       const listNormal = snapNormal.docs.map((d) => ({
//         id: d.id,
//         type: "normal",
//         ...d.data(),
//       }));

//       const list24h = snap24h.docs.map((d) => ({
//         id: d.id,
//         type: "24h",
//         ...d.data(),
//       }));

//       setPausedJobs([...listNormal, ...list24h]);
//     } catch (error) {
//       console.error("Error fetching paused jobs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPausedJobs();
//   }, []);

//   // RESUME — Restore to services or service_24h
//   const handleResume = async (job) => {
//     try {
//       const serviceId = job.originalId || job.id;

//       const targetCollection = job.type === "24h" ? "service_24h" : "services";
//       const serviceRef = doc(db, targetCollection, serviceId);

//       // REMOVE paused-only fields
//       const { id, originalId, isPaused, type, ...restoredData } = job;

//       // Restore job
//       await updateDoc(serviceRef, {
//         ...restoredData,
//         isPaused: false,
//       }).catch(async () => {
//         // If not exists → create
//         await setDoc(serviceRef, {
//           ...restoredData,
//           isPaused: false,
//         });
//       });

//       // Delete from paused collection
//       const pausedCol = job.type === "24h" ? "paused_service" : "pausedJobs";
//       await deleteDoc(doc(db, pausedCol, job.id));

//       // Remove from UI
//       setPausedJobs((prev) => prev.filter((j) => j.id !== job.id));

//       alert("Service resumed successfully!");
//     } catch (error) {
//       console.error("Error resuming job:", error);
//     }
//   };

//   // DELETE permanently
//   const handleDelete = async (job) => {
//     try {
//       const pausedCol = job.type === "24h" ? "paused_service" : "pausedJobs";
//       await deleteDoc(doc(db, pausedCol, job.id));

//       setPausedJobs((prev) => prev.filter((j) => j.id !== job.id));

//       alert("Paused service deleted.");
//     } catch (error) {
//       console.error("Error deleting paused service:", error);
//     }
//   };

//   if (loading) return <p>Loading paused services...</p>;

//   return (
//     <div className="paused-services-container">
//       <h1>Paused Services</h1>

//       {pausedJobs.length === 0 ? (
//         <p>No paused services found.</p>
//       ) : (
//         <div className="paused-services-list">
//           {pausedJobs.map((job) => (
//             <div key={job.id} className="paused-service-card">
//               <h2>{job.serviceName || job.title}</h2>
//               <p>{job.description}</p>

//               <p><strong>Category:</strong> {job.category}</p>
//               <p><strong>Price:</strong> ₹{job.price}</p>

//               <p className="job-type-tag">
//                 {job.type === "24h" ? "24H Service" : "Normal Service"}
//               </p>

//               <div className="actions">
//                 <button className="resume-btn" onClick={() => handleResume(job)}>
//                   Resume
//                 </button>

//                 <button className="delete-btn" onClick={() => handleDelete(job)}>
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PausedJobsPage;


import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firbase/Firebase";
import "./PausedServicesPage.css";

const PausedJobsPage = () => {
  const [pausedJobs, setPausedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ 1️⃣ Add sidebar collapsed state
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ⭐ 2️⃣ Listen for sidebar toggle
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // FETCH pausedJobs + paused_service
  const fetchPausedJobs = async () => {
    try {
      const snapNormal = await getDocs(collection(db, "pausedJobs"));
      const snap24h = await getDocs(collection(db, "paused_service"));

      const listNormal = snapNormal.docs.map((d) => ({
        id: d.id,
        type: "normal",
        ...d.data(),
      }));

      const list24h = snap24h.docs.map((d) => ({
        id: d.id,
        type: "24h",
        ...d.data(),
      }));

      setPausedJobs([...listNormal, ...list24h]);
    } catch (error) {
      console.error("Error fetching paused jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPausedJobs();
  }, []);

  // RESUME — restore back to services or service_24h
  const handleResume = async (job) => {
    try {
      const serviceId = job.originalId || job.id;

      const targetCollection = job.type === "24h" ? "service_24h" : "services";
      const serviceRef = doc(db, targetCollection, serviceId);

      const { id, originalId, isPaused, type, ...restoredData } = job;

      await updateDoc(serviceRef, {
        ...restoredData,
        isPaused: false,
      }).catch(async () => {
        await setDoc(serviceRef, {
          ...restoredData,
          isPaused: false,
        });
      });

      const pausedCol =
        job.type === "24h" ? "paused_service" : "pausedJobs";
      await deleteDoc(doc(db, pausedCol, job.id));

      setPausedJobs((prev) => prev.filter((j) => j.id !== job.id));

      alert("Service resumed successfully!");
    } catch (error) {
      console.error("Error resuming job:", error);
    }
  };

  // DELETE permanently
  const handleDelete = async (job) => {
    try {
      const pausedCol =
        job.type === "24h" ? "paused_service" : "pausedJobs";
      await deleteDoc(doc(db, pausedCol, job.id));

      setPausedJobs((prev) => prev.filter((j) => j.id !== job.id));

      alert("Paused service deleted.");
    } catch (error) {
      console.error("Error deleting paused service:", error);
    }
  };

  if (loading) return <p>Loading paused services...</p>;

  // ⭐ 3️⃣ Wrap whole UI inside margin-left to sync with sidebar
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div className="paused-services-container">
        <h1>Paused Services</h1>

        {pausedJobs.length === 0 ? (
          <p>No paused services found.</p>
        ) : (
          <div className="paused-services-list">
            {pausedJobs.map((job) => (
              <div key={job.id} className="paused-service-card">
                <h2>{job.serviceName || job.title}</h2>
                <p className="paused-service-desc">{job.description}</p>

                <p>
                  <strong>Category:</strong> {job.category}
                </p>
                <p>
                  <strong>Price:</strong> ₹{job.price}
                </p>

                <p className="job-type-tag">
                  {job.type === "24h" ? "24H Service" : "Normal Service"}
                </p>

                <div className="actions">
                  <button
                    className="resume-btn"
                    onClick={() => handleResume(job)}
                  >
                    Resume
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(job)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PausedJobsPage;
