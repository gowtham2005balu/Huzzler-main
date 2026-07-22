// //Connectpop.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { auth, db } from "../../firbase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
// import { addDoc, serverTimestamp } from "firebase/firestore";
// import { ref, set } from "firebase/database";
// import { rtdb } from "../../firbase/Firebase";
// import "./Connect.css";
// import requestsentimg from "../../assets/requestsentimg.jpeg";

// export default function ConnectPopup({
//   open,
//   onClose,
//   freelancerId,
//   freelancerName,
//   serviceId   // ✅ NEW
// }) {
//   const [selectedService, setSelectedService] = useState(null);
//   const [projectTitle, setProjectTitle] = useState("");
//   const [projectDesc, setProjectDesc] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [clientJobs, setClientJobs] = useState([]);
//   const [freelancerServices, setFreelancerServices] = useState([]); // ✅ NEW
//   const [showSuccessCard, setShowSuccessCard] = useState(false);

//   const navigate = useNavigate();

//   // ✅ Fetch freelancer's services by freelancerId
//   const fetchFreelancerServices = useCallback(async () => {
//     if (!freelancerId) return;

//     const servicesList = [];

//     try {
//       // 🔍 Fetch from "services" collection
//       const servicesSnap = await getDocs(
//         query(collection(db, "services"), where("userId", "==", freelancerId))
//       );
//       servicesSnap.forEach((doc) =>
//         servicesList.push({ id: doc.id, ...doc.data(), source: "services" })
//       );

//       // 🔍 Fetch from "services_24" collection
//       const services24Snap = await getDocs(
//         query(collection(db, "service_24h"), where("userId", "==", freelancerId)));
//       services24Snap.forEach((doc) =>
//         servicesList.push({ id: doc.id, ...doc.data(), source: "services_24" })
//       );

//       setFreelancerServices(servicesList);
//     } catch (err) {
//       console.error("Error fetching freelancer services:", err);
//     }
//   }, [freelancerId]);

//   // Fetch client's jobs
//   const fetchClientJobs = useCallback(async () => {
//     const uid = auth.currentUser?.uid;
//     if (!uid) return;

//     const jobsList = [];

//     const jobsSnap = await getDocs(
//       query(collection(db, "jobs"), where("userId", "==", uid))
//     );
//     jobsSnap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

//     const jobs24Snap = await getDocs(
//       query(collection(db, "jobs_24h"), where("userId", "==", uid))
//     );
//     jobs24Snap.forEach((doc) => jobsList.push({ id: doc.id, ...doc.data() }));

//     setClientJobs(jobsList);
//   }, []);

//   useEffect(() => {
//     if (open) {
//       fetchClientJobs();
//       fetchFreelancerServices(); // ✅ Fetch services when popup opens
//     } else {
//       setSelectedService(null);
//       setProjectTitle("");
//       setProjectDesc("");
//     }
//   }, [open, fetchClientJobs, fetchFreelancerServices]);

//   if (!open) return null;

//   // ✅ Handle service selection
//   const handleServiceSelect = (serviceId) => {
//     if (!serviceId) {
//       setSelectedService(null);
//       return;
//     }

//     const service = freelancerServices.find((s) => s.id === serviceId);
//     setSelectedService(service);

//     // Auto-fill project title with service title
//     if (service) {
//       setProjectTitle(service.title || "");
//     }
//   };

// const sendRequest = async () => {
//   const currentUser = auth.currentUser;

//   if (!currentUser) {
//     alert("Please login");
//     return;
//   }

//   if (!projectTitle.trim()) {
//     alert("Project title is required");
//     return;
//   }

//   setLoading(true);

//   try {
//     const clientUid = currentUser.uid;
//     const clientName = currentUser.displayName || "Client";

//     const finalServiceId = serviceId || selectedService?.id || null;

//     const chatId =
//       freelancerId < clientUid
//         ? `${freelancerId}_${clientUid}`
//         : `${clientUid}_${freelancerId}`;

//     // ✅ Build service snapshot safely
//     const serviceSnapshot = selectedService
//       ? {
//           serviceId: selectedService.id,
//           title: selectedService.title || "",
//           description: selectedService.description || "",
//           budget_from: selectedService.budget_from ?? 0,
//           budget_to: selectedService.budget_to ?? 0,
//           category: selectedService.category ?? "",
//           skills: selectedService.skills ?? [],
//           deliveryDuration: selectedService.deliveryDuration ?? "",
//           paused: selectedService.paused ?? false,
//           source: selectedService.source || "services",
//         }
//       : {
//           serviceId: finalServiceId,
//           title: projectTitle.trim(),
//           description: projectDesc || "",
//           budget_from: 0,
//           budget_to: 0,
//           category: "",
//           skills: [],
//           deliveryDuration: "",
//           paused: false,
//           source: "manual",
//         };

//     const requestData = {
//       jobTitle: serviceSnapshot.title,
//       requestStatus: "pending",
//       requestedAt: Date.now(),
//       requestedBy: clientUid,
//       clientName,
//       freelancerId,
//       freelancerName,
//       jobId: finalServiceId,
//       service: serviceSnapshot,
//     };

//     // ✅ RTDB SAVE
//     await set(
//       ref(rtdb, `requestChats/${freelancerId}/${chatId}`),
//       requestData
//     );

//     await set(
//       ref(rtdb, `clientSentRequests/${clientUid}/${chatId}`),
//       requestData
//     );

//     // ✅ FIRESTORE NOTIFICATION
//     await addDoc(collection(db, "notifications"), {
//       type: "hire_request",
//       read: false,
//       timestamp: serverTimestamp(),
//       title: serviceSnapshot.title,
//       body: `${clientName} sent hire request for ${serviceSnapshot.title}`,
//       clientUid,
//       clientName,
//       freelancerId,
//       freelancerName,
//       jobId: finalServiceId,
//       service: serviceSnapshot,
//       serviceId: finalServiceId,
//       category: serviceSnapshot.category,
//       paused: serviceSnapshot.paused,
//       source: serviceSnapshot.source,
//     });

//     // 🔥 SEND CARD TO CHAT IMMEDIATELY
//     const initialMessage = `HUZZLER_JOB_DATA:${JSON.stringify({
//       id: finalServiceId,
//       title: serviceSnapshot.title,
//       category: serviceSnapshot.category,
//       budget_from: serviceSnapshot.budget_from,
//       budget_to: serviceSnapshot.budget_to,
//       deliveryDuration: serviceSnapshot.deliveryDuration,
//       skills: serviceSnapshot.skills || [],
//       description: serviceSnapshot.description,
//       clientId: clientUid,
//       freelancerId,
//       is24Hour: serviceSnapshot.source === "services_24",
//     })}`;

//     navigate("/chat", {
//       state: {
//         currentUid: clientUid,
//         otherUid: freelancerId,
//         otherName: freelancerName,
//         initialMessage,
//       },
//     });

//     setShowSuccessCard(true);

//     setTimeout(() => {
//       setShowSuccessCard(false);
//       onClose();
//     }, 1200);

//   } catch (err) {
//     console.error("Hire request error:", err);
//     alert("❌ Failed to send request");
//   } finally {
//     setLoading(false);
//   }
// };
//   return (
//     <div className="ffds-modal-backdrop" onClick={onClose}>
//       <div className="ffds-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="ffds-card-title">Connect with {freelancerName}</div>
//         <p>Bring ideas to Life!</p>

//         {/* ✅ Freelancer Services Dropdown */}
//         {freelancerServices.length > 0 && (
//           <>
//             <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
//               Select a Service from {freelancerName}
//             </label>
//             <select
//               className="ffds-select"
//               value={selectedService?.id || ""}
//               onChange={(e) => handleServiceSelect(e.target.value)}
//             >
//               <option value="">-- Select a Service --</option>
//               {freelancerServices.map((service) => (
//                 <option key={service.id} value={service.id}>
//                   {service.title || "Untitled Service"}
//                   {service.budget_from || service.budget_to
//                     ? ` ($${service.budget_from} - $${service.budget_to})`
//                     : ""}
//                 </option>
//               ))}
//             </select>
//           </>
//         )}

//         {/* ✅ Show selected service details */}
//         {selectedService && (
//           <div className="ffds-service-preview" style={{
//             background: "#f5f3ff",
//             padding: 12,
//             borderRadius: 10,
//             marginBottom: 12,
//             fontSize: 13
//           }}>
//             <strong>{selectedService.title}</strong>
//             <p style={{ margin: "4px 0", color: "#666" }}>
//               {selectedService.description || "No description"}
//             </p>
//             <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
//               {selectedService.category && (
//                 <span>📁 {selectedService.category}</span>
//               )}
//               {(selectedService.budget_from || selectedService.budget_to) && (
//                 <span>💰 ${selectedService.budget_from} - ${selectedService.budget_to}</span>
//               )}
//               {selectedService.deliveryDuration && (
//                 <span>⏱️ {selectedService.deliveryDuration}</span>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Client jobs dropdown (optional) */}
//         {clientJobs.length > 0 && (
//           <>
//             <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
//               Or select your existing Job
//             </label>
//             <select
//               className="ffds-select"
//               value={projectTitle}
//               onChange={(e) => setProjectTitle(e.target.value)}
//             >
//               <option value="">Select your existing Job / Project</option>
//               {clientJobs.map((job) => (
//                 <option key={job.id} value={job.title}>
//                   {job.title || "Untitled"}
//                 </option>
//               ))}
//             </select>
//           </>
//         )}

//         {/* Manual input */}
//         <input
//           className="ffds-input"
//           placeholder="Project title (or type new)"
//           value={projectTitle}
//           onChange={(e) => setProjectTitle(e.target.value)}
//         />

//         <textarea
//           className="ffds-textarea"
//           placeholder="Project description (optional)"
//           value={projectDesc}
//           onChange={(e) => setProjectDesc(e.target.value)}
//         />

//         <div className="ffds-modal-footer">
//           <button className="ffds-btn ffds-btn-outline" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="ffds-btn ffds-btn-primary"
//             onClick={sendRequest}
//             disabled={loading}
//           >
//             {loading ? "Sending Request..." : "Send Request"}
//           </button>
//         </div>
//       </div>

//       {showSuccessCard && (
//         <div className="ffds-pop-overlay">
//           <div className="ffds-pop-card-large">
//             <div className="ffds-pop-icon-large">
//               <img src={requestsentimg} alt="" />
//             </div>
//             <div className="ffds-pop-title-large">Request Sent Successfully</div>
//             <div className="ffds-pop-text-large">
//               Your request has been sent to <strong>{freelancerName}</strong>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// Connectpop.jsx
// Fully ported from flfullDetail.dart:
//   _showProjectRequestPopup, _showSuccessPopup, sendRequest flow
//   _hasAlreadyRequested, _sendFreelancerNotification
//   collaboration_requests + notifications + freelancer_notifications writes
// UI design kept exactly as original web version

import React, { useEffect, useState, useCallback } from "react";
import { auth, db } from "../../firbase/Firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
  setDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { ref, set } from "firebase/database";
import { rtdb } from "../../firbase/Firebase";
import "./Connect.css";
import requestsentimg from "../../assets/requestsentimg.jpeg";

// ─────────────────────────────────────────────────────────────────────────────
export default function ConnectPopup({
  open,
  onClose,
  freelancerId,
  freelancerName,
  serviceId,    // ← the service/job id that triggered the popup
  services,     // ← client's own services list (optional, passed from parent)
}) {
  const navigate = useNavigate();

  // ── Form state ─────────────────────────────────────────────────────────
  const [selectedService, setSelectedService]       = useState(null);   // freelancer's service selected
  const [projectTitle, setProjectTitle]             = useState("");
  const [projectDesc, setProjectDesc]               = useState("");
  const [loading, setLoading]                       = useState(false);
  const [showSuccessCard, setShowSuccessCard]       = useState(false);

  // ── Data state ──────────────────────────────────────────────────────────
  const [clientJobs, setClientJobs]                 = useState([]);      // current user's own jobs
  const [freelancerServices, setFreelancerServices] = useState([]);      // freelancer's services

  // ─────────────────────────────────────────────────────────────────────────
  //  Fetch freelancer's services from both collections
  //  Mirrors _fetchUserJobs() in Dart (jobs + jobs_24h where userId == uid)
  // ─────────────────────────────────────────────────────────────────────────
  const fetchFreelancerServices = useCallback(async () => {
    if (!freelancerId) return;
    const list = [];
    try {
      const [snap1, snap2] = await Promise.all([
        getDocs(query(collection(db, "services"),    where("userId", "==", freelancerId))),
        getDocs(query(collection(db, "service_24h"), where("userId", "==", freelancerId))),
      ]);
      snap1.forEach((d) => list.push({ id: d.id, ...d.data(), _source: "services" }));
      snap2.forEach((d) => list.push({ id: d.id, ...d.data(), _source: "service_24h" }));
      setFreelancerServices(list);
    } catch (err) {
      console.error("fetchFreelancerServices error:", err);
    }
  }, [freelancerId]);

  // ─────────────────────────────────────────────────────────────────────────
  //  Fetch current user's own jobs (for "select existing job" dropdown)
  //  Mirrors _fetchUserJobs() — jobs + jobs_24h where userId == currentUid
  // ─────────────────────────────────────────────────────────────────────────
  const fetchClientJobs = useCallback(async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const list = [];
    try {
      const [snap1, snap2] = await Promise.all([
        getDocs(query(collection(db, "jobs"),     where("userId", "==", uid))),
        getDocs(query(collection(db, "jobs_24h"), where("userId", "==", uid))),
      ]);
      snap1.forEach((d) => list.push({ id: d.id, ...d.data(), _type: "services" }));
      snap2.forEach((d) => list.push({ id: d.id, ...d.data(), _type: "services_24h" }));
      setClientJobs(list);
    } catch (err) {
      console.error("fetchClientJobs error:", err);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchFreelancerServices();
      fetchClientJobs();
    } else {
      // Reset form on close (mirrors initState reset)
      setSelectedService(null);
      setProjectTitle("");
      setProjectDesc("");
    }
  }, [open, fetchFreelancerServices, fetchClientJobs]);

  if (!open) return null;

  // ─────────────────────────────────────────────────────────────────────────
  //  Handle service selection from dropdown
  //  Mirrors DropdownButtonFormField2 onChanged in Dart:
  //    selectedJob = value; titleController.text = value?['title']
  // ─────────────────────────────────────────────────────────────────────────
  const handleServiceSelect = (svcId) => {
    if (!svcId) { setSelectedService(null); return; }
    const svc = freelancerServices.find((s) => s.id === svcId);
    setSelectedService(svc || null);
    if (svc) setProjectTitle(svc.title || "");
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  Duplicate request guard
  //  Mirrors _hasAlreadyRequested() in Dart
  // ─────────────────────────────────────────────────────────────────────────
  const hasAlreadyRequested = async (jobId) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || !jobId) return false;
    try {
      const snap = await getDocs(
        query(
          collection(db, "collaboration_requests"),
          where("clientId",    "==", currentUid),
          where("freelancerId","==", freelancerId),
          where("jobId",       "==", jobId),
          where("status",      "in", ["sent", "pending"]),
          limit(1)
        )
      );
      return !snap.empty;
    } catch (e) {
      console.error("hasAlreadyRequested error:", e);
      return false;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  Send freelancer notification
  //  Mirrors _sendFreelancerNotification() in Dart
  //  Deduplicates by freelancerId + jobId + status='applied'
  // ─────────────────────────────────────────────────────────────────────────
  const sendFreelancerNotification = async ({ flId, jobId, jobTitle }) => {
    try {
      // Check for existing notification (same dedup logic as Dart)
      const existing = await getDocs(
        query(
          collection(db, "freelancer_notifications"),
          where("freelancerId", "==", flId),
          where("jobId",        "==", jobId),
          where("status",       "==", "applied"),
          limit(1)
        )
      );
      if (!existing.empty) {
        console.log("notification already exists — skipping");
        return;
      }
      await addDoc(collection(db, "freelancer_notifications"), {
        freelancerId: flId,
        jobId,
        jobTitle,
        status:    "applied",
        createdAt: serverTimestamp(),
        isRead:    false,
      });
    } catch (e) {
      console.error("sendFreelancerNotification error:", e);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  Main send request
  //  Mirrors the "Continue" button in _showSuccessPopup in Dart, which:
  //    1. Writes to collaboration_requests
  //    2. Writes to notifications
  //    3. Calls _sendFreelancerNotification (freelancer_notifications)
  //    4. Fetches job data from correct collection
  //    5. Navigates to ChatScreen with initialMessage
  //
  //  Also mirrors ConnectPopup's sendRequest (RTDB requestChats + clientSentRequests)
  // ─────────────────────────────────────────────────────────────────────────
  const sendRequest = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) { alert("Please login"); return; }
    if (!projectTitle.trim()) { alert("Project title is required"); return; }

    // ── Duplicate check (mirrors _hasAlreadyRequested) ──────────────────
    const finalJobId =
      serviceId || selectedService?.id || null;

    if (finalJobId) {
      const alreadyRequested = await hasAlreadyRequested(finalJobId);
      if (alreadyRequested) {
        alert("You already sent a request to this freelancer for this service.");
        return;
      }
    }

    setLoading(true);

    try {
      const clientUid  = currentUser.uid;
      const clientName = currentUser.displayName || "Client";

      const chatId =
        freelancerId < clientUid
          ? `${freelancerId}_${clientUid}`
          : `${clientUid}_${freelancerId}`;

      // ── Build service snapshot ─────────────────────────────────────────
      const serviceSnapshot = selectedService
        ? {
            serviceId:       selectedService.id,
            title:           selectedService.title           || "",
            description:     selectedService.description     || "",
            budget_from:     selectedService.budget_from     ?? 0,
            budget_to:       selectedService.budget_to       ?? 0,
            category:        selectedService.category        ?? "",
            skills:          selectedService.skills          ?? [],
            deliveryDuration:selectedService.deliveryDuration ?? "",
            paused:          selectedService.paused          ?? false,
            source:          selectedService._source         || "services",
          }
        : {
            serviceId:        finalJobId,
            title:            projectTitle.trim(),
            description:      projectDesc || "",
            budget_from:      0,
            budget_to:        0,
            category:         "",
            skills:           [],
            deliveryDuration: "",
            paused:           false,
            source:           "manual",
          };

      const jobType = selectedService?._source || "services";

      // ── 1. Write to RTDB (requestChats + clientSentRequests) ───────────
      const requestData = {
        jobTitle:       serviceSnapshot.title,
        requestStatus:  "pending",
        requestedAt:    Date.now(),
        requestedBy:    clientUid,
        clientName,
        freelancerId,
        freelancerName,
        jobId:          finalJobId,
        service:        serviceSnapshot,
      };

      await set(ref(rtdb, `requestChats/${freelancerId}/${chatId}`),       requestData);
      await set(ref(rtdb, `clientSentRequests/${clientUid}/${chatId}`),    requestData);

      // ── 2. Write to Firestore collaboration_requests ───────────────────
      // Mirrors the addDoc in _showSuccessPopup in Dart
      const requestRef = await addDoc(collection(db, "collaboration_requests"), {
        clientId:       clientUid,
        freelancerId,
        freelancerName,
        jobId:          finalJobId,
        jobType,
        title:          projectTitle.trim(),
        description:    projectDesc || "",
        status:         "sent",
        createdAt:      serverTimestamp(),
      });

      // ── 3. Write to Firestore notifications ───────────────────────────
      // Mirrors the notifications addDoc in _showSuccessPopup in Dart
      await addDoc(collection(db, "notifications"), {
        type:           "hire_request",
        status:         "sent",
        read:           false,
        timestamp:      serverTimestamp(),
        title:          serviceSnapshot.title,
        body:           `${clientName} sent hire request for ${serviceSnapshot.title}`,
        clientUid,
        clientName,
        freelancerId,
        freelancerName,
        serviceId:      requestRef.id,
        jobId:          finalJobId,
        jobType,
        jobTitle:       projectTitle.trim(),
        category:       serviceSnapshot.category,
        paused:         serviceSnapshot.paused,
        source:         serviceSnapshot.source,
      });

      // ── 4. Send freelancer_notifications (dedup) ──────────────────────
      // Mirrors _sendFreelancerNotification() call in Dart
      await sendFreelancerNotification({
        flId:     freelancerId,
        jobId:    finalJobId || "",
        jobTitle: projectTitle.trim(),
      });

      // ── 5. Build initial chat message ─────────────────────────────────
      // Mirrors the HUZZLER_JOB_DATA construction in _showSuccessPopup
      let initialMessage;
      if (finalJobId) {
        // Fetch job data from the correct collection
        const jobCollection =
          jobType === "services" || jobType === "services_24h"
            ? jobType === "services_24h" ? "service_24h" : "services"
            : "services";

        const jobDoc = await getDoc(doc(db, jobCollection, finalJobId));

        if (jobDoc.exists()) {
          const jobData = jobDoc.data();
          const cleanJobData = {
            id:             finalJobId,
            title:          jobData.title           || "Untitled",
            description:    jobData.description     || "",
            category:       jobData.category        || "General",
            sub_category:   jobData.sub_category    || "",
            budget_from:    String(jobData.budget_from ?? ""),
            budget_to:      String(jobData.budget_to   ?? ""),
            price:          String(jobData.price       ?? ""),
            skills:         Array.isArray(jobData.skills) ? jobData.skills : [],
            created_at:     jobData.created_at?.toString?.() || "",
            is24h:          jobData.is24h === true || jobType === "services_24h",
            startDateTime:  jobData.startDateTime?.toString?.() || "",
          };
          initialMessage = `HUZZLER_JOB_DATA:${JSON.stringify(cleanJobData)}`;
        } else {
          // Fallback if job doc not found
          initialMessage = `HUZZLER_JOB_DATA:${JSON.stringify({
            id:          finalJobId,
            title:       serviceSnapshot.title,
            category:    serviceSnapshot.category,
            budget_from: String(serviceSnapshot.budget_from),
            budget_to:   String(serviceSnapshot.budget_to),
            skills:      serviceSnapshot.skills,
            description: serviceSnapshot.description,
            clientId:    clientUid,
            freelancerId,
            is24Hour:    serviceSnapshot.source === "service_24h",
          })}`;
        }
      } else {
        // No job selected — plain text (mirrors Dart fallback)
        initialMessage = `Collaboration request: ${projectTitle.trim()}\nDescription: ${projectDesc}`;
      }

      // ── 6. Show success popup then navigate to chat ───────────────────
      setShowSuccessCard(true);

      setTimeout(() => {
        setShowSuccessCard(false);
        onClose();
        navigate("/chat", {
          state: {
            currentUid:   clientUid,
            otherUid:     freelancerId,
            otherName:    freelancerName,
            initialMessage,
          },
        });
      }, 1200);

    } catch (err) {
      console.error("sendRequest error:", err);
      alert("❌ Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="ffds-modal-backdrop" onClick={onClose}>
      <div className="ffds-modal" onClick={(e) => e.stopPropagation()}>

        {/* Title (mirrors dialog title in Dart) */}
        <div className="ffds-card-title">
          Collaborate and Turn Ideas into Reality!
        </div>
        <p style={{ marginTop: 4, marginBottom: 16, color: "#666", fontSize: 14 }}>
          Connect with {freelancerName}
        </p>

        {/* ── Freelancer services dropdown ─────────────────────────────── */}
        {/* Mirrors DropdownButtonFormField2 in Dart _showProjectRequestPopup */}
        {freelancerServices.length > 0 && (
          <>
            <label
              style={{ fontWeight: 600, marginBottom: 8, display: "block", fontSize: 14 }}
            >
              Select a Service from {freelancerName}
            </label>
            <select
              className="ffds-select"
              value={selectedService?.id || ""}
              onChange={(e) => handleServiceSelect(e.target.value)}
            >
              <option value="">-- Select a Service --</option>
              {freelancerServices.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {svc.title || "Untitled Service"}
                  {(svc.budget_from || svc.budget_to)
                    ? ` (₹${svc.budget_from} - ₹${svc.budget_to})`
                    : ""}
                </option>
              ))}
            </select>
          </>
        )}

        {/* ── Selected service preview ──────────────────────────────────── */}
        {selectedService && (
          <div
            style={{
              background: "#f5f3ff",
              padding: 12,
              borderRadius: 10,
              marginBottom: 12,
              fontSize: 13,
            }}
          >
            <strong>{selectedService.title}</strong>
            <p style={{ margin: "4px 0", color: "#666" }}>
              {selectedService.description || "No description"}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              {selectedService.category && <span>📁 {selectedService.category}</span>}
              {(selectedService.budget_from || selectedService.budget_to) && (
                <span>
                  💰 ₹{selectedService.budget_from} - ₹{selectedService.budget_to}
                </span>
              )}
              {selectedService.deliveryDuration && (
                <span>⏱️ {selectedService.deliveryDuration}</span>
              )}
            </div>
          </div>
        )}

        {/* ── Client existing jobs dropdown ─────────────────────────────── */}
        {/* Mirrors the DropdownButtonFormField for client's own jobs in Dart */}
        {clientJobs.length > 0 && (
          <>
            <label
              style={{ fontWeight: 600, marginBottom: 8, display: "block", fontSize: 14 }}
            >
              Or select your existing Job
            </label>
            <select
              className="ffds-select"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            >
              <option value="">Select your existing Job / Project</option>
              {clientJobs.map((job) => (
                <option key={job.id} value={job.title || ""}>
                  {job.title || "Untitled"}
                </option>
              ))}
            </select>
          </>
        )}

        {/* ── Project title (mirrors titleController TextField in Dart) ── */}
        <input
          className="ffds-input"
          placeholder="Project Title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />

        {/* ── Project description (mirrors descController TextField) ────── */}
        <textarea
          className="ffds-textarea"
          placeholder="Project Description (optional)"
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
        />

        {/* ── Actions (mirrors Submit + Cancel buttons in Dart) ─────────── */}
        <div className="ffds-modal-footer">
          <button className="ffds-btn ffds-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="ffds-btn ffds-btn-primary"
            onClick={sendRequest}
            disabled={loading || !projectTitle.trim()}
            style={
              !projectTitle.trim()
                ? { background: "#d1d5db", cursor: "not-allowed" }
                : {}
            }
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
      </div>

      {/* ── Success card (mirrors _showSuccessPopup check icon in Dart) ─── */}
      {showSuccessCard && (
        <div className="ffds-pop-overlay">
          <div className="ffds-pop-card-large">
            <div className="ffds-pop-icon-large">
              <img src={requestsentimg} alt="success" />
            </div>
            <div className="ffds-pop-title-large">Request sent successfully!</div>
            <div className="ffds-pop-text-large">
              Your request has been sent to <strong>{freelancerName}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}