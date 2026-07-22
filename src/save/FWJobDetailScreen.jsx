


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// import {
//   IoCalendarOutline,
//   IoLocationOutline,
//   IoPeopleOutline,
//   IoTimeOutline,
//   IoCloseOutline,
// } from "react-icons/io5";

// import save from "../assets/save2.png";
// import saved from "../assets/save.png";
// import share from "../assets/share.png";

// export default function FreelancerviewJobDetailScreen() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const db = getFirestore();
//   const auth = getAuth();

//   const user = auth.currentUser;
//   const uid = user?.uid;

//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSaved, setIsSaved] = useState(false);

//   const removeJobCard = (jobId) => {
//     setJob((prev) => prev.filter((job) => job.id !== jobId));
//   };

//   useEffect(() => {
//     async function fetchJob() {
//       const ref = doc(db, "jobs", id);
//       const snap = await getDoc(ref);

//       if (snap.exists()) {
//         setJob({ id: snap.id, ...snap.data() });
//       }
//       setLoading(false);
//     }

//     fetchJob();
//   }, [id]);

//   const deletefunction = async (jobId) => {
//     try {
//       if (!uid) {
//         alert("User not logged in");
//         return;
//       }

//       const ref = doc(db, "jobs", jobId);

//       const updatedApplicants = job.applicants.filter(
//         (a) => a.freelancerId !== uid
//       );

//       await updateDoc(ref, {
//         applicants: updatedApplicants,
//         applicants_count: updatedApplicants.length,
//       });

//       alert("Your applied request has been removed.");

//       if (removeJobCard) {
//         removeJobCard(jobId);
//       }

//       navigate("/freelance-dashboard/freelancermyworks");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to remove applied request.");
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!job) return <div>Job not found</div>;

//   return (
//     <div
//       style={{
//         width: "100%",
//         minHeight: "120vh",
//         background: "#ffffff88",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "start",
//         paddingTop: "80px",
//         backdropFilter: "blur(10px)",
//       }}
//     >
//       {/* CARD */}
//       <div
//         style={{
//           width: "100%",
//           maxWidth: "1100px",
//           background: "#fff",
//           borderRadius: 18,
//           boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//           padding: "38px 32px",
//           position: "relative",
//         }}
//       >
//         {/* APPLIED BADGE */}
//         <div
//           style={{
//             position: "absolute",
//             top: 80,
//             right: 20,
//             padding: "6px 16px",
//             background: "#E1FFC2",
//             color: "#67CC44",
//             borderRadius: 14,
//             fontSize: 14,
//             fontWeight: 600,
//             width:"123px",
//             textAlign:"center",
//           }}
//         >
//           Applied
//         </div>

//         {/* TOP ICONS */}
//         <div
//           style={{
//             display: "flex",
//             gap: 18,
//             alignItems: "center",
//             position: "absolute",
//             right: 30,
//             top: 30,
//           }}
//         >
//           {!isSaved ? (
//             <img
//               src={save}
//               alt="save"
//               style={{ width: 24, height: 24, cursor: "pointer" }}
//               onClick={() => setIsSaved(true)}
//             />
//           ) : (
//             <img
//               src={saved}
//               alt="saved"
//               style={{ width: 24, height: 24, cursor: "pointer" }}
//               onClick={() => setIsSaved(false)}
//             />
//           )}

//           <img
//             src={share}
//             alt="share"
//             style={{ width: 24, height: 24, cursor: "pointer" }}
//           />

//           <IoCloseOutline
//             onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
//             size={26}
//             color="#444"
//             style={{ cursor: "pointer" }}
//           />
//         </div>

//         {/* TITLE */}
//         <h1 style={{ fontSize: 32, fontWeight: 500, color: "#111" }}>
//           {job.title}
//         </h1>

//         <p style={{ marginTop: -6, fontSize: 20, fontWeight: 400, color: "#777" }}>
//           {job.category}
//         </p>

//         {/* BUDGET + TIMELINE + LOCATION */}
//         <div
//           style={{
//             display: "flex",
//             marginTop: 20,
//             gap: 80,
//             alignItems: "center",
//             flexWrap: "wrap",
//           }}
//         >
//           {/* Budget */}
//           <div>
//             <p style={{ color: "#666", fontSize: 14 }}>Budget</p>
//             <p style={{ fontSize: 15, fontWeight: 600 }}>
//               ₹{job.budget_from} - ₹{job.budget_to}
//             </p>
//           </div>

//           {/* TIMELINE */}
//           <div style={{ display: "flex", alignItems: "center", gap: 8 ,}}>
//             <IoCalendarOutline size={19} color="#555" style={{marginTop:"30px"}} />
//             <div>
//               <p style={{ fontSize: 14, color: "#666" }}>Timeline</p>
//               <p style={{ fontSize: 15, fontWeight: 600 }}>
//                 {job.deliveryDuration || job.timeline || "N/A"}
//               </p>
//             </div>
//           </div>

//           {/* LOCATION */}
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <IoLocationOutline size={19} color="#555" style={{marginTop:"30px"}} />
//             <div>
//               <p style={{ fontSize: 14, color: "#666" }}>Location</p>
//               <p style={{ fontSize: 15, fontWeight: 600 }}>Remote</p>
//             </div>
//           </div>
//         </div>

//         {/* APPLICANTS + TIME */}
//         <div
//           style={{
//             marginTop: 15,
//             display: "flex",
//             gap: 25,
//             color: "#555",
//             fontSize: 14,
//             flexWrap: "wrap",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//             <IoPeopleOutline />
//             <span>{job.applicantsCount || 0} Applicants</span>
//           </div>

//           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//             <IoTimeOutline />
//             <span>{job.postedAgo || "Recently"}</span>
//           </div>
//         </div>

//         {/* SKILLS */}
//         <h3 style={{ marginTop: 25, marginBottom: 10, fontSize: 20 }}>
//           Skills Required
//         </h3>

//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           {(job.skills || []).map((s, i) => (
//             <div
//               key={i}
//               style={{
//                 background: "#FFF7A6",
//                 padding: "6px 14px",
//                 borderRadius: 10,
//                 fontSize: 16,
//               }}
//             >
//               {s}
//             </div>
//           ))}
//         </div>

//         {/* DESCRIPTION */}
//         <h3 style={{ marginTop: 25, marginBottom: 10, fontSize: 20 }}>
//           Project Description
//         </h3>

//         <p style={{ fontSize: 15, lineHeight: "22px", color: "#444" }}>
//           {job.description}
//         </p>

//         {/* DELETE BUTTON */}
//         <div style={{ marginTop: 35 }}>
//           <button
//             onClick={() => deletefunction(job.id)}
//             style={{
//               width: "100%",
//               padding: "14px 0",
//               background: "#9810FAE5",
//               borderRadius: 18,
//               border: "none",
//               color: "#fff",
//               fontSize: 18,
//               cursor: "pointer",
//             }}
//           >
//             Delete Request
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// import {
//   IoCalendarOutline,
//   IoLocationOutline,
//   IoPeopleOutline,
//   IoTimeOutline,
//   IoCloseOutline,
// } from "react-icons/io5";

// import save from "../assets/save2.png";
// import saved from "../assets/save.png";
// import share from "../assets/share.png";

// export default function FreelancerviewJobDetailScreen() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const db = getFirestore();
//   const auth = getAuth();

//   const user = auth.currentUser;
//   const uid = user?.uid;

//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSaved, setIsSaved] = useState(false);

//   useEffect(() => {
//     async function fetchJob() {
//       const ref = doc(db, "jobs", id);
//       const snap = await getDoc(ref);

//       if (snap.exists()) {
//         setJob({ id: snap.id, ...snap.data() });
//       }
//       setLoading(false);
//     }

//     fetchJob();
//   }, [id]);

//   const deletefunction = async (jobId) => {
//     try {
//       if (!uid) return alert("User not logged in");

//       const ref = doc(db, "jobs", jobId);
//       const updatedApplicants = job.applicants.filter(
//         (a) => a.freelancerId !== uid
//       );

//       await updateDoc(ref, {
//         applicants: updatedApplicants,
//         applicants_count: updatedApplicants.length,
//       });

//       navigate("/freelance-dashboard/freelancermyworks");
//     } catch (err) {
//       alert("Failed to remove applied request");
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!job) return <div>Job not found</div>;

//   return (
//     <div
//       style={{
//         width: "100%",
//         minHeight: "100vh",


//         display: "flex",
//         justifyContent: "center",
//         paddingTop: 80,
//       }}
//     >
//       {/* CARD */}
//       <div
//         style={{
//           width: 520,
//           background: "#fff",
//           borderRadius: 20,
//           padding: "32px",
//           position: "relative",
//           boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
//         }}
//       >
//         {/* HEADER */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//           }}
//         >
//           <div>
//             <p style={{ opacity: 0.6, fontSize: 18, }}>Project Details</p>
//             <h2 style={{ fontWeight: 400, fontsize: 24, textTransform: "uppercase", color: "#000" }}>{job.title}</h2>
//             <p style={{ color: "#777", fontSize: 18, }}>{job.category}</p>
//           </div>

//           <div style={{ display: "flex", gap: 16 }}>
//             <img
//               src={isSaved ? saved : save}
//               alt="save"
//               width={20}
//               height={20}
//               style={{ cursor: "pointer" }}
//               onClick={() => setIsSaved(!isSaved)}
//             />
//             <img src={share} alt="share" width={20}  height={20} />
//             <IoCloseOutline
//               size={28}
              
//               style={{ cursor: "pointer" ,paddingBottom:"5"}}
//               onClick={() =>
//                 navigate("/freelance-dashboard/freelancermyworks")
//               }
//             />
//           </div>
//         </div>

//         {/* APPLIED + VIEW PROFILE (RIGHT ALIGNED) */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             alignItems: "center",


//           }}
//         >
//           <div
//   style={{
//     position: "absolute",
//     top: 74,
//     right: 32,
//     background: "#E1FFC2",
//     color: "#5DBB3A",
//     padding: "6px 14px",
//     borderRadius: 16,
//     fontWeight: 600,
//     fontSize: 16,
//     textTransform: "uppercase",
//   }}
// >
//   Applied
// </div>


//         </div>


//         {/* INFO */}
//         <div
//           style={{
//             display: "flex",
//             gap: 40,
//             marginTop: 24,
//             flexWrap: "wrap",
//           }}
//         >
//           <div>
//             <p style={{ fontSize: 14, opacity: 0.6 }}>Budget</p>
//             <span>
//               ₹{job.budget_from} – ₹{job.budget_to}
//             </span>
//           </div>

//           <div style={{ display: "flex", gap: 8 }}>
//             <IoCalendarOutline style={{ marginTop: "33px" }} />
//             <div>
//               <p style={{ fontSize: 14, opacity: 0.6, }}>Timeline</p>
//               <span >{job.deliveryDuration || job.timeline}</span>
//             </div>
//           </div>

//           <div style={{ display: "flex", gap: 8 }}>
//             <IoLocationOutline style={{ marginTop: "33px", }} />
//             <div>
//               <p style={{ fontSize: 14, opacity: 0.6 }}>Location</p>
//               <span>Remote</span>
//             </div>
//           </div>
//         </div>

//         {/* META */}
//         <div
//           style={{
//             display: "flex",
//             gap: 20,
//             marginTop: 12,
//             color: "#555",
//             fontSize: 14,
//           }}
//         >
//           <span>
//             <IoPeopleOutline /> {job.applicantsCount || 0} Applicants
//           </span>
//           <span>
//             <IoTimeOutline /> {job.postedAgo || "Recently"}
//           </span>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             alignItems: "center",


//           }}
//         >
//           <button
//             style={{
//               width: 140,
//               height: 32,
//               background: "#7C3AED",
//               border: "none",
//               borderRadius: 22,
//               color: "#fff",
//               fontSize: 14,
//               cursor: "pointer",
             
//             }}
//           >
//             View Profile
//           </button></div>


//         {/* SKILLS */}
//         <h3 style={{ fontWeight: 400, fontsize: 18, marginBottom: 20 }}>Skills Required</h3>
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//           {(job.skills || []).map((s, i) => (
//             <span
//               key={i}
//               style={{
//                 background: "#FFF7A6",
//                 padding: "6px 14px",
//                 borderRadius: 12,
//                 fontSize: 14,
//               }}
//             >
//               {s}
//             </span>
//           ))}
//         </div>

//         {/* DESCRIPTION */}
//         <h3 style={{ marginTop: 30, fontWeight: 400, fontsize: 18, marginBottom: 20 }}>Project Description</h3>
//         <p style={{ color: "#444", lineHeight: "22px", fontSize: 16 }}>
//           {job.description}
//         </p>

//         {/* DELETE */}
//         <button
//           onClick={() => deletefunction(job.id)}
//           style={{
//             marginTop: 30,
//             width: "100%",
//             height: 48,
//             background: "#7C3AED",
//             border: "none",
//             borderRadius: 16,
//             color: "#fff",
//             fontSize: 16,
//             cursor: "pointer",
//           }}
//         >
//           Delete Request
//         </button>
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoTimeOutline,
  IoCloseOutline,
} from "react-icons/io5";

import save from "../assets/save2.png";
import saved from "../assets/save.png";
import share from "../assets/share.png";

export default function FreelancerviewJobDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();

  const user = auth.currentUser;
  const uid = user?.uid;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);



  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/freelance-dashboard/view-job/${job.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: `Check out this freelance project: ${job.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Job link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };



  useEffect(() => {
    async function fetchJob() {
      const ref = doc(db, "jobs", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setJob({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    }

    fetchJob();
  }, [id]);

  const deleteRequest = async (jobId) => {
    if (!uid) {
      alert("User not logged in");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to remove your application for this job?"
    );

    if (!confirmDelete) return;

    try {
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);

      if (!jobSnap.exists()) {
        alert("Job not found");
        return;
      }

      const jobData = jobSnap.data();
      const applicants = jobData.applicants || [];

      const updatedApplicants = applicants.filter(
        (a) => a.freelancerId !== uid
      );

      if (updatedApplicants.length === applicants.length) {
        alert("You have not applied for this job");
        return;
      }

      await updateDoc(jobRef, {
        applicants: updatedApplicants,
        applicants_count: updatedApplicants.length,
      });

      alert("Application removed successfully");
      navigate("/freelance-dashboard/freelancermyworks");
    } catch (error) {
      console.error(error);
      alert("Failed to delete request");
    }
  };


  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",


        display: "flex",
        justifyContent: "center",
        paddingTop: 80,
      }}
    >
      {/* CARD */}
      <div
        style={{
          width: 520,
          background: "#fff",
          borderRadius: 20,
          padding: "32px",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <p style={{ opacity: 0.6, fontSize: 18, }}>Project Details</p>
            <h2 style={{ fontWeight: 400, fontsize: 24, textTransform: "uppercase", color: "#000" }}>{job.title}</h2>
            <p style={{ color: "#777", fontSize: 18, }}>{job.category}</p>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            {/* <img
              src={isSaved ? saved : save}
              alt="save"
              width={20}
              height={20}
              style={{ cursor: "pointer" }}
              onClick={() => setIsSaved(!isSaved)}
            /> */}
            <img
              src={share}
              alt="share"
              width={20}
              height={20}
              style={{ cursor: "pointer" }}
              onClick={handleShare}
            />

            <IoCloseOutline
              size={28}

              style={{ cursor: "pointer", paddingBottom: "5" }}
              onClick={() =>
                navigate("/freelance-dashboard/freelancermyworks")
              }
            />
          </div>
        </div>

        {/* APPLIED + VIEW PROFILE (RIGHT ALIGNED) */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",


          }}
        >
          <div
            style={{
              position: "absolute",
              top: 74,
              right: 32,
              background: "#E1FFC2",
              color: "#5DBB3A",
              padding: "6px 14px",
              borderRadius: 16,
              fontWeight: 600,
              fontSize: 16,
              textTransform: "uppercase",
            }}
          >
            Applied
          </div>


        </div>


        {/* INFO */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ fontSize: 14, opacity: 0.6 }}>Budget</p>
            <span>
              ₹{job.budget_from} – ₹{job.budget_to}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <IoCalendarOutline style={{ marginTop: "33px" }} />
            <div>
              <p style={{ fontSize: 14, opacity: 0.6, }}>Timeline</p>
              <span >{job.deliveryDuration || job.timeline}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <IoLocationOutline style={{ marginTop: "33px", }} />
            <div>
              <p style={{ fontSize: 14, opacity: 0.6 }}>Location</p>
              <span>Remote</span>
            </div>
          </div>
        </div>

        {/* META */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 12,
            color: "#555",
            fontSize: 14,
          }}
        >
          <span>
            <IoPeopleOutline /> {job.applicantsCount || 0} Applicants
          </span>
          <span>
            <IoTimeOutline /> {job.postedAgo || "Recently"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",


          }}
        >
          <button
            style={{
              width: 140,
              height: 32,
              background: "#7C3AED",
              border: "none",
              borderRadius: 22,
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",

            }}
            onClick={() =>
              navigate(
                `/freelance-dashboard/view-profile/${job.userId}/job/${job.id}`
              )
            }
          >
            View Profile
          </button></div>


        {/* SKILLS */}
        <h3 style={{ fontWeight: 400, fontsize: 18, marginBottom: 20 }}>Skills Required</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(job.skills || []).map((s, i) => (
            <span
              key={i}
              style={{
                background: "#FFF7A6",
                padding: "6px 14px",
                borderRadius: 12,
                fontSize: 14,
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* DESCRIPTION */}
        <h3 style={{ marginTop: 30, fontWeight: 400, fontsize: 18, marginBottom: 20 }}>Project Description</h3>
        <p style={{ color: "#444", lineHeight: "22px", fontSize: 16 }}>
          {job.description}
        </p>

        <button
          onClick={() => deleteRequest(job.id)}
          style={{
            marginTop: 30,
            width: "100%",
            height: 48,
            background: "#7C3AED",
            border: "none",
            borderRadius: 16,
            color: "#fff",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Delete Request
        </button>

      </div>
    </div>
  );
}