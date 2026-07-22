// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { doc, onSnapshot } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import { format } from "date-fns";

// export default function JobDetail24hoursScreen() {
//   const { id } = useParams();   // Get ID from URL
//   const [job, setJob] = useState(null);

//   useEffect(() => {
//     const unsub = onSnapshot(doc(db, "jobs", id), (snap) => {
//       if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
//     });
//     return unsub;
//   }, [id]);

//   if (!job) return <div>Loading...</div>;

//   const formattedDate = job?.startDateTime?.toDate
//     ? format(job.startDateTime.toDate(), "dd MMM yyyy")
//     : "N/A";

//   return (
//     <div style={{ backgroundColor: "#fff", fontFamily: "'Rubik', sans-serif" }}>
//       <div
//         style={{
//           backgroundColor: "#FDFD96",
//           borderBottomLeftRadius: 30,
//           borderBottomRightRadius: 30,
//           padding: "2rem 1rem",
//           textAlign: "center",
//         }}
//       >
//         <h1 style={{ fontSize: 24, fontWeight: 500 }}>Job Section</h1>
//       </div>

//       <div style={{ padding: "1.2rem" }}>
//         <h2 style={{ fontSize: 18, fontWeight: 700 }}>{job.title}</h2>

//         <img
//           src={job.imageUrl || "/assets/full_photo.png"}
//           style={{
//             width: "100%",
//             height: 180,
//             objectFit: "cover",
//             borderRadius: 12,
//             marginTop: 16,
//           }}
//         />

//         <h3 style={{ fontSize: 15, fontWeight: 500, marginTop: 16 }}>
//           Description
//         </h3>
//         <p>{job.description}</p>

//         <div
//           style={{
//             padding: 20,
//             borderRadius: 30,
//             border: "1px solid #ccc",
//             backgroundColor: "#fff",
//             marginTop: 24,
//           }}
//         >
//           <h3 style={{ fontWeight: 700 }}>Service Details</h3>
//           <hr />

//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <span>Price</span>
//             <span>₹{job.budget}</span>
//           </div>

//           <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
//             <span>Delivery Days</span>
//             <span>{formattedDate}</span>
//           </div>

//           <div style={{ marginTop: 16 }}>
//             <span>Category</span>
//             <div>
//               <span style={{ border: "1px solid #ccc", padding: "4px 10px", borderRadius: 30 }}>
//                 {job.category}
//               </span>
//             </div>
//           </div>

//           <div style={{ marginTop: 16 }}>
//             <span>Skills & Tools</span>
//             <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
//               {(job.skills || []).map((s, i) => (
//                 <span key={i} style={{ border: "1px solid #ccc", padding: "4px 10px", borderRadius: 30 }}>
//                   {s}
//                 </span>
//               ))}
//               {(job.tools || []).map((t, i) => (
//                 <span key={i} style={{ border: "1px solid #ccc", padding: "4px 10px", borderRadius: 30 }}>
//                   {t}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firbase/Firebase";
import { format } from "date-fns";

export default function JobDetail24hoursScreen() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  // ⭐ Sidebar collapse state
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ⭐ Listen to sidebar toggle
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  // Fetch job details
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "jobs", id), (snap) => {
      if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
    });
    return unsub;
  }, [id]);

  if (!job) return <div>Loading...</div>;

  const formattedDate = job?.startDateTime?.toDate
    ? format(job.startDateTime.toDate(), "dd MMM yyyy")
    : "N/A";

  return (
    <div
      style={{
        backgroundColor: "#fff",
        fontFamily: "'Rubik', sans-serif",
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div
        style={{
          backgroundColor: "#FDFD96",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          padding: "2rem 1rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 500 }}>Job Section</h1>
      </div>

      <div style={{ padding: "1.2rem" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{job.title}</h2>

        <img
          src={job.imageUrl || "/assets/full_photo.png"}
          style={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            borderRadius: 12,
            marginTop: 16,
          }}
        />

        <h3 style={{ fontSize: 15, fontWeight: 500, marginTop: 16 }}>
          Description
        </h3>
        <p>{job.description}</p>

        <div
          style={{
            padding: 20,
            borderRadius: 30,
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            marginTop: 24,
          }}
        >
          <h3 style={{ fontWeight: 700 }}>Service Details</h3>
          <hr />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Price</span>
            <span>₹{job.budget}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <span>Delivery Days</span>
            <span>{formattedDate}</span>
          </div>

          <div style={{ marginTop: 16 }}>
            <span>Category</span>
            <div>
              <span
                style={{
                  border: "1px solid #ccc",
                  padding: "4px 10px",
                  borderRadius: 30,
                }}
              >
                {job.category}
              </span>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <span>Skills & Tools</span>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {(job.skills || []).map((s, i) => (
                <span
                  key={i}
                  style={{
                    border: "1px solid #ccc",
                    padding: "4px 10px",
                    borderRadius: 30,
                  }}
                >
                  {s}
                </span>
              ))}

              {(job.tools || []).map((t, i) => (
                <span
                  key={i}
                  style={{
                    border: "1px solid #ccc",
                    padding: "4px 10px",
                    borderRadius: 30,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
