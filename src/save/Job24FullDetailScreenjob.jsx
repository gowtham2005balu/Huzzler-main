
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//     getFirestore,
//     doc,
//     getDoc,
//     onSnapshot,
//     updateDoc,
//     arrayUnion,
//     arrayRemove,
//     increment,
//     collection,
//     addDoc,
//     serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import { useNavigate } from "react-router-dom";
// import { deleteDoc } from "firebase/firestore";


// // Optional notification service
// const NotificationService = { notifications: [] };

// // Helper: time ago
// function timeAgo(createdAt) {
//     const diff = Date.now() - createdAt.getTime();
//     const mins = Math.floor(diff / 60000);
//     if (mins < 1) return "just now";
//     if (mins < 60) return `${mins} min ago`;
//     const hours = Math.floor(mins / 60);
//     if (hours < 24) return `${hours} hr ago`;
//     const days = Math.floor(hours / 24);
//     return `${days} day${days > 1 ? "s" : ""} ago`;
// }

// export default function Job_24DetailJobScreen() {
//     const { id: jobId } = useParams();
//     const auth = getAuth();
//     const dbFirestore = getFirestore();

//     const [job, setJob] = useState(null);
//     const [isApplied, setIsApplied] = useState(false);
//     const [isFavorite, setIsFavorite] = useState(false);
//     const [jobLoading, setJobLoading] = useState(true);
//     const [jobError, setJobError] = useState(null);


//     const navigate = useNavigate();

//     const handleEditJob = () => {
//         // Navigate to your job edit page with job ID
//         navigate("/client-dashbroad2/clientedit24jobs", {
//             state: { jobId: job.id, jobData: job },
//         });
//     };

//     const handleDeleteJob = async () => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this job?");
//         if (!confirmDelete) return;

//         try {
//             await deleteDoc(doc(dbFirestore, "jobs_24h", jobId));
//             alert("Job deleted successfully!");
//             navigate(-1); // go back after deletion
//         } catch (err) {
//             console.error("Delete job error:", err);
//             alert("Failed to delete job.");
//         }
//     };


//     // Load job realtime
//     useEffect(() => {
//         if (!jobId) return;
//         const ref = doc(dbFirestore, "jobs_24h", jobId);
//         const unsub = onSnapshot(
//             ref,
//             (snap) => {
//                 if (!snap.exists()) {
//                     setJob(null);
//                     setJobLoading(false);
//                     return;
//                 }
//                 const data = snap.data();
//                 const createdAt = data.created_at?.toDate?.() || new Date();
//                 const applicants = Array.isArray(data.applicants) ? data.applicants : [];
//                 const userId = auth.currentUser?.uid || "";
//                 setIsApplied(applicants.some((a) => a.freelancerId === userId));

//                 setJob({
//                     id: snap.id,
//                     title: data.title || "",
//                     description: data.description || "",
//                     budgetFrom: data.budget_from ?? "",
//                     budgetTo: data.budget_to ?? "",
//                     timeline: data.timeline || "",
//                     category: data.category || "",
//                     subCategory: data.sub_category || "",
//                     applicantsCount: data.applicants_count ?? 0,
//                     views: data.views ?? 0,
//                     skills: Array.isArray(data.skills) ? data.skills : [],
//                     tools: Array.isArray(data.tools) ? data.tools : [],
//                     createdAt,
//                     userId: data.userId || "",
//                 });

//                 setJobLoading(false);
//             },
//             (err) => {
//                 console.error(err);
//                 setJobError(err);
//                 setJobLoading(false);
//             }
//         );
//         return () => unsub();
//     }, [jobId, auth, dbFirestore]);

//     // Load favorite status
//     useEffect(() => {
//         const user = auth.currentUser;
//         if (!user || !jobId) return;
//         const uRef = doc(dbFirestore, "users", user.uid);
//         const unsub = onSnapshot(
//             uRef,
//             (snap) => {
//                 if (!snap.exists()) return;
//                 const favList = Array.isArray(snap.data()?.favoriteJobs) ? snap.data().favoriteJobs : [];
//                 setIsFavorite(favList.includes(jobId));
//             },
//             (err) => console.error(err)
//         );
//         return () => unsub();
//     }, [jobId, auth, dbFirestore]);

//     // Apply to job
//     async function handleApply() {
//         console.log("Apply clicked");
//         if (isApplied) return;
//         const user = auth.currentUser;
//         if (!user || !job) return alert("Please login first.");

//         try {
//             const userId = user.uid;
//             const freelancerSnap = await getDoc(doc(dbFirestore, "users", userId));
//             const freelancer = freelancerSnap.data() || {};
//             const freelancerName = `${freelancer.first_name || ""} ${freelancer.last_name || ""}`.trim();
//             const freelancerImage = freelancer.profileImage || "";

//             const jobRef = doc(dbFirestore, "jobs_24h", jobId);
//             const jobSnap = await getDoc(jobRef);
//             const jobDoc = jobSnap.data() || {};
//             const jobTitle = jobDoc.title || "";
//             const clientUid = jobDoc.userId || "";

//             const applicants = Array.isArray(jobDoc.applicants) ? jobDoc.applicants : [];
//             if (applicants.some((a) => a.freelancerId === userId)) {
//                 setIsApplied(true);
//                 return alert("You have already applied!");
//             }

//             await updateDoc(jobRef, {
//                 applicants: arrayUnion({ freelancerId: userId, name: freelancerName, profileImage: freelancerImage, appliedAt: new Date() }),
//                 applicants_count: increment(1),
//             });

//             await addDoc(collection(dbFirestore, "notifications"), {
//                 title: jobTitle,
//                 body: `${freelancerName} applied for ${jobTitle}`,
//                 type: "application",
//                 freelancerName,
//                 freelancerImage,
//                 freelancerId: userId,
//                 jobTitle,
//                 jobId,
//                 clientUid,
//                 timestamp: serverTimestamp(),
//                 read: false,
//             });

//             setIsApplied(true);
//             alert("Applied successfully!");
//         } catch (e) {
//             console.error(e);
//             alert("Something went wrong!");
//         }
//     }

//     // Toggle favorite
//     async function toggleBookmark() {
//         const user = auth.currentUser;
//         if (!user) return alert("Please login to save jobs.");
//         const userRef = doc(dbFirestore, "users", user.uid);
//         try {
//             if (isFavorite) await updateDoc(userRef, { favoriteJobs: arrayRemove(jobId) });
//             else await updateDoc(userRef, { favoriteJobs: arrayUnion(jobId) });
//             setIsFavorite(!isFavorite);
//         } catch (e) {
//             console.error(e);
//         }
//     }

//     if (jobLoading) return <div style={{ padding: 40 }}>Loading...</div>;
//     if (jobError) return <div style={{ padding: 40 }}>Error: {jobError.message}</div>;
//     if (!job) return <div style={{ padding: 40 }}>Job not found ❌</div>;

//     const { title, description, budgetFrom, budgetTo, timeline, skills, tools, views, createdAt } = job;

//     return (
//         <div style={styles.overlay}>
//             <div style={styles.modal}>
//                 <div style={styles.header}>
//                     <h3 style={styles.headerTitle}>Project Details</h3>
//                     <button style={styles.iconBtn} onClick={() => navigate(-1)}>✕</button>
//                 </div>

//                 <div style={styles.userSection}>
//                     <div style={styles.avatar}>
//                         {title.slice(0, 2).toUpperCase()}
//                     </div>
//                     <div>
//                         <div style={styles.userName}>{title}</div>
//                         <div style={styles.userRole}>{job.category}</div>
//                     </div>
//                 </div>

//                 <div style={styles.infoRow}>
//                     <div style={styles.infoBox}>
//                         <div style={styles.infoLabel}>Budget</div>
//                         <div style={styles.infoValue}>₹{budgetFrom} - ₹{budgetTo}</div>
//                     </div>
//                     <div style={styles.infoBox}>
//                         <div style={styles.infoLabel}>Timeline</div>
//                         <div style={styles.infoValue}>{timeline || "24 Hours"}</div>
//                     </div>
//                 </div>

//                 <div style={styles.divider} />

//                 <h3 style={styles.sectionTitle}>Description</h3>
//                 <div style={styles.descriptionScroll}>
//                     <p style={styles.descriptionText}>{description}</p>
//                 </div>

//                 {skills.length > 0 && (
//                     <>
//                         <h3 style={styles.sectionTitle}>Skills</h3>
//                         <div style={styles.skillsContainer}>
//                             {skills.map((s, i) => (
//                                 <span key={i} style={styles.skillTag}>{s}</span>
//                             ))}
//                         </div>
//                     </>
//                 )}

//                 <div style={styles.footer}>
//                     <button style={styles.editBtn} onClick={handleEditJob}>Edit Job</button>
//                     <button style={styles.deleteBtn} onClick={handleDeleteJob}>Delete Job</button>
//                 </div>
//             </div>
//         </div>
//     );

// }



// const styles = {
//   overlay: {
//     minHeight: "130vh",
//     padding: "40px 20px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "flex-start",
//   },

//   modal: {
//     maxWidth: 720,
//     width: "100%",
//     borderRadius: 20,
//     boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
//     padding: "32px 28px",
//     fontFamily: "'Rubik', sans-serif",
//     background: "#fff",
//   },

//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },

//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 600,
//     color: "#1a1a1a",
//   },

//   iconBtn: {
//     background: "transparent",
//     border: "none",
//     cursor: "pointer",
//     padding: 8,
//     borderRadius: 8,
//   },

//   userSection: {
//     display: "flex",
//     gap: 14,
//     marginBottom: 20,
//   },

//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 14,
//     background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 700,
//     fontSize: 18,
//   },

//   userName: {
//     fontSize: 26,
//     fontWeight: 700,
//   },

//   userRole: {
//     color: "#8B5CF6",
//     fontSize: 14,
//     fontWeight: 500,
//   },

//   infoRow: {
//     display: "flex",
//     gap: 30,
//     marginBottom: 16,
//   },

//   infoBox: {
//     flex: 1,
//   },

//   infoLabel: {
//     fontSize: 12,
//     color: "#888",
//     marginBottom: 4,
//     fontWeight: 500,
//   },

//   infoValue: {
//     fontSize: 14,
//     fontWeight: 600,
//   },

//   divider: {
//     height: 1,
//     background: "#eee",
//     margin: "10px 0 24px 0",
//   },

//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 600,
//     marginBottom: 14,
//   },

//   skillsContainer: {
//     display: "flex",
//     gap: 10,
//     flexWrap: "wrap",
//   },

//   skillTag: {
//     background: "#FEF9C3",
//     color: "#713F12",
//     padding: "8px 16px",
//     borderRadius: 20,
//     fontSize: 13,
//     fontWeight: 500,
//     border: "1px solid #FDE047",
//   },

//   descriptionScroll: {
//     maxHeight: 180,
//     overflowY: "auto",
//   },

//   descriptionText: {
//     lineHeight: 1.7,
//     fontSize: 16,
//     whiteSpace: "pre-line",
//   },

//   footer: {
//     display: "flex",
//     gap: 14,
//     marginTop: 24,
//   },

//   editBtn: {
//     flex: 1,
//     padding: "14px",
//     borderRadius: 12,
//     border: "2px solid #E5E7EB",
//     background: "#fff",
//     fontWeight: 600,
//     cursor: "pointer",
//   },

//   deleteBtn: {
//     flex: 1,
//     padding: "14px",
//     borderRadius: 12,
//     border: "none",
//     background: "linear-gradient(135deg, #f65c5c 0%, #fa4848 100%)",
//     color: "#fff",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
// };



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
    getFirestore,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
    arrayUnion,
    arrayRemove,
    increment,
    collection,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firbase/Firebase";
import { useNavigate } from "react-router-dom";
import { deleteDoc } from "firebase/firestore";
import { Calendar, MapPin } from "lucide-react";


// Optional notification service
const NotificationService = { notifications: [] };

// Helper: time ago
function timeAgo(createdAt) {
    const diff = Date.now() - createdAt.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function Job_24DetailJobScreen() {
    const { id: jobId } = useParams();
    const auth = getAuth();
    const dbFirestore = getFirestore();

    const [job, setJob] = useState(null);
    const [isApplied, setIsApplied] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [jobLoading, setJobLoading] = useState(true);
    const [jobError, setJobError] = useState(null);


    const navigate = useNavigate();

    const handleEditJob = () => {
        // Navigate to your job edit page with job ID
        navigate("/client-dashbroad2/clientedit24jobs", {
            state: { jobId: job.id, jobData: job },
        });
    };

    const handleDeleteJob = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(dbFirestore, "jobs_24h", jobId));
            alert("Job deleted successfully!");
            navigate(-1); // go back after deletion
        } catch (err) {
            console.error("Delete job error:", err);
            alert("Failed to delete job.");
        }
    };


    // Load job realtime
    useEffect(() => {
        if (!jobId) return;
        const ref = doc(dbFirestore, "jobs_24h", jobId);
        const unsub = onSnapshot(
            ref,
            (snap) => {
                if (!snap.exists()) {
                    setJob(null);
                    setJobLoading(false);
                    return;
                }
                const data = snap.data();
                const createdAt = data.created_at?.toDate?.() || new Date();
                const applicants = Array.isArray(data.applicants) ? data.applicants : [];
                const userId = auth.currentUser?.uid || "";
                setIsApplied(applicants.some((a) => a.freelancerId === userId));

                setJob({
                    id: snap.id,
                    title: data.title || "",
                    description: data.description || "",
                    budgetFrom: data.budget_from ?? "",
                    budgetTo: data.budget_to ?? "",
                    timeline: data.timeline || "",
                    category: data.category || "",
                    subCategory: data.sub_category || "",
                    applicantsCount: data.applicants_count ?? 0,
                    views: data.views ?? 0,
                    skills: Array.isArray(data.skills) ? data.skills : [],
                    tools: Array.isArray(data.tools) ? data.tools : [],
                    createdAt,
                    userId: data.userId || "",
                });

                setJobLoading(false);
            },
            (err) => {
                console.error(err);
                setJobError(err);
                setJobLoading(false);
            }
        );
        return () => unsub();
    }, [jobId, auth, dbFirestore]);

    // Load favorite status
    useEffect(() => {
        const user = auth.currentUser;
        if (!user || !jobId) return;
        const uRef = doc(dbFirestore, "users", user.uid);
        const unsub = onSnapshot(
            uRef,
            (snap) => {
                if (!snap.exists()) return;
                const favList = Array.isArray(snap.data()?.favoriteJobs) ? snap.data().favoriteJobs : [];
                setIsFavorite(favList.includes(jobId));
            },
            (err) => console.error(err)
        );
        return () => unsub();
    }, [jobId, auth, dbFirestore]);

    // Apply to job
    async function handleApply() {
        console.log("Apply clicked");
        if (isApplied) return;
        const user = auth.currentUser;
        if (!user || !job) return alert("Please login first.");

        try {
            const userId = user.uid;
            const freelancerSnap = await getDoc(doc(dbFirestore, "users", userId));
            const freelancer = freelancerSnap.data() || {};
            const freelancerName = `${freelancer.first_name || ""} ${freelancer.last_name || ""}`.trim();
            const freelancerImage = freelancer.profileImage || "";

            const jobRef = doc(dbFirestore, "jobs_24h", jobId);
            const jobSnap = await getDoc(jobRef);
            const jobDoc = jobSnap.data() || {};
            const jobTitle = jobDoc.title || "";
            const clientUid = jobDoc.userId || "";

            const applicants = Array.isArray(jobDoc.applicants) ? jobDoc.applicants : [];
            if (applicants.some((a) => a.freelancerId === userId)) {
                setIsApplied(true);
                return alert("You have already applied!");
            }

            await updateDoc(jobRef, {
                applicants: arrayUnion({ freelancerId: userId, name: freelancerName, profileImage: freelancerImage, appliedAt: new Date() }),
                applicants_count: increment(1),
            });

            await addDoc(collection(dbFirestore, "notifications"), {
                title: jobTitle,
                body: `${freelancerName} applied for ${jobTitle}`,
                type: "application",
                freelancerName,
                freelancerImage,
                freelancerId: userId,
                jobTitle,
                jobId,
                clientUid,
                timestamp: serverTimestamp(),
                read: false,
            });

            setIsApplied(true);
            alert("Applied successfully!");
        } catch (e) {
            console.error(e);
            alert("Something went wrong!");
        }
    }
    

    // Toggle favorite
    async function toggleBookmark() {
        const user = auth.currentUser;
        if (!user) return alert("Please login to save jobs.");
        const userRef = doc(dbFirestore, "users", user.uid);
        try {
            if (isFavorite) await updateDoc(userRef, { favoriteJobs: arrayRemove(jobId) });
            else await updateDoc(userRef, { favoriteJobs: arrayUnion(jobId) });
            setIsFavorite(!isFavorite);
        } catch (e) {
            console.error(e);
        }
    }

    if (jobLoading) return <div style={{ padding: 40 }}>Loading...</div>;
    if (jobError) return <div style={{ padding: 40 }}>Error: {jobError.message}</div>;
    if (!job) return <div style={{ padding: 40 }}>Job not found ❌</div>;

    const { title, description, budgetFrom, budgetTo, timeline, skills, tools, views, createdAt } = job;
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Check this job",
                    text: "Super job opportunity da macha 😎",
                    url: window.location.href, // current page link
                });
                console.log("Shared successfully");
            } catch (err) {
                console.log("Share cancelled", err);
            }
        } else {
            alert("Share not supported in this browser");
        }
    };
    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h3 style={styles.headerTitle}>Project Details</h3>
                       <div style={styles.headerIcons}>
                        {/* <button style={styles.iconBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button> */}
                        <button
                            style={styles.iconBtn}
                            onClick={handleShare}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#666"
                                strokeWidth="2"
                            >
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                        </button>

                        <button style={styles.iconBtn} onClick={() => navigate(-1)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                <div style={styles.userSection}>
                    <div style={styles.avatar}>
                        {title.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div style={styles.userName}>{title}</div>
                        <div style={styles.userRole}>{job.category}</div>
                    </div>
                </div>




                <div style={styles.infoRoww}>

                    <InfoBox label="Budget" icon="">
                        <span style={styles.budgetText}>₹{budgetFrom} - ₹{budgetTo}</span>
                    </InfoBox>

                    <InfoBox label="Timeline" icon="">
                        <span style={styles.timelineText}>   <Calendar size={16} style={{ marginBottom: -2 }} />{timeline || "24 Hours"}</span>
                    </InfoBox>

                    <InfoBox label="Location" icon="">
                        <span style={styles.locationText}>  <MapPin size={16} style={{ marginBottom: -2 }} />Remote</span>
                    </InfoBox>
                </div>







                <div style={styles.infoRow}>
                    <div style={styles.metaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>{job.applicantsCount} Applicants</span>
                    </div>
                    <div style={styles.metaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{timeAgo(job.createdAt)}</span>
                    </div>
                </div>
                <div style={styles.divider} />

                {skills.length > 0 && (
                    <>
                        <h3 style={styles.sectionTitle}>Skills Required</h3>
                        <div style={styles.skillsContainer}>
                            {skills.map((s, i) => (
                                <span key={i} style={styles.skillTag}>{s}</span>
                            ))}
                        </div>
                    </>
                )}
                <h3 style={styles.sectionTitle}>Project Description</h3>
                <div style={styles.descriptionScroll}>
                    <p style={styles.descriptionText}>{description}</p>
                </div>


                <div style={styles.footer}>
                    <button style={styles.editBtn} onClick={handleEditJob}>Edit Job</button>
                    <button style={styles.deleteBtn} onClick={handleDeleteJob}>Delete Job</button>
                </div>
            </div>
        </div>
    );

}

/* SMALL COMPONENT */
function InfoBox({ label, icon, children }) {
    return (
        <div style={styles.infoBox}>
            <div style={styles.infoLabel}>{label}</div>
            <div style={styles.infoValue}>
                {icon && <span style={styles.infoIcon}>{icon}</span>}
                {children}
            </div>
        </div>
    );
}


const styles = {
    overlay: {
        minHeight: "130vh",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
    },

    modal: {
        maxWidth: 720,
        width: "100%",
        borderRadius: 20,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
        padding: "32px 28px",
        fontFamily: "'Rubik', sans-serif",
        background: "#fff",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: 600,
        color: "#1a1a1a",
    },

    iconBtn: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 8,
        borderRadius: 8,
    },

    userSection: {
        display: "flex",
        gap: 14,
        marginBottom: 20,
    },

    avatar: {
        width: 56,
        height: 56,
        borderRadius: 14,
        background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 18,
    },

    userName: {
        fontSize: 26,
        fontWeight: 700,
    },

    userRole: {
        color: "#8B5CF6",
        fontSize: 14,
        fontWeight: 500,
    },

    infoRow: {
        display: "flex",
        gap: 30,
        marginBottom: 16,
    },


    metaItem: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
        color: "#666",
    },
      infoRoww: {
        display: "flex",

        justifyContent: "space-between",
        marginBottom:30,

    },

    infoRow: {
        display: "flex",
        gap: 30,

        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 12,
        color: "#888",
        marginBottom: 4,
        fontWeight: 500,
    },

    infoValue: {
        fontSize: 14,
        fontWeight: 600,
    },

    divider: {
        height: 1,
        background: "#eee",
        margin: "10px 0 24px 0",
    },

    sectionTitle: {
        marginTop: 15,
        fontSize: 20,
        fontWeight: 400,
        marginBottom: 24,
    },

    skillsContainer: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
    },

    skillTag: {
        background: "#FEF9C3",
        color: "#713F12",
        padding: "8px 16px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 500,
        border: "1px solid #FDE047",
        marginBottom:20,
    },

    descriptionScroll: {
        maxHeight: 180,
        overflowY: "auto",
    },

    descriptionText: {
        lineHeight: 1.7,
        fontSize: 16,
        whiteSpace: "pre-line",
    },

    footer: {
        display: "flex",
        gap: 14,
        marginTop: 24,
    },

    editBtn: {
        flex: 1,
        padding: "14px 24px",
        borderRadius: 12,
        border: "2px solid #9810FAE5",
        background: "#fff",
        color: "#9810FAE5",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
    },

    deleteBtn: {
        flex: 1,
        padding: "14px 24px",
        borderRadius: 12,
        border: "none",
        background: "#9810FAE5",

        color: "white",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
    },
};