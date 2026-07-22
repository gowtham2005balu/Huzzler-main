// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// export default function ProfessionalStatusScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ SCROLL REMOVE
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => (document.body.style.overflow = "auto");
//   }, []);

//   const navState = location.state || {};

//   const {
//     uid = "",
//     first_name = "",
//     last_name = "",
//     email = "",
//     expertise = "",
//     location: userLocation = "",
//     referral = "",
//     linkedin = "",
//   } = navState;

//   const [title, setTitle] = useState("");
//   const [selectedExperience, setSelectedExperience] = useState("");
//   const [currentStatus, setCurrentStatus] = useState("Professional");
//   const [isLoading, setIsLoading] = useState(false);

//   const experienceOptions = ["Beginner", "Intermediate", "Expert"];
//   const db = getFirestore();

//   const handleSave = async () => {
//     if (!title.trim()) return alert("Enter your professional title");
//     if (!selectedExperience) return alert("Select experience level");

//     try {
//       setIsLoading(true);

//       await setDoc(
//         doc(db, "users", uid),
//         {
//           uid,
//           first_name,
//           last_name,
//           email,
//           expertise,
//           location: userLocation,
//           referral,
//           linkedin,
//           professional_title: title.trim(),
//           experience_level: selectedExperience,
//           current_status: currentStatus,
//           role: "client",
//           profileCompleted: true,
//           updated_at: serverTimestamp(),
//         },
//         { merge: true }
//       );

//       navigate("/freelance-dashboard/freelanceHome", {
//         replace: true,
//         state: { uid },
//       });
//     } catch (err) {
//       alert("Saving failed: " + err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={styles.pageBg}>
//       <div style={styles.topRow}>
//         <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
//         <span style={styles.topTitle}>sign up as Client</span>
//       </div><br /><br />

//       <div style={styles.card}>
//         <h3 style={styles.heading}>Please complete the following step.</h3>

//         <input
//           type="text"
//           placeholder="Professional Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           style={styles.input}
//         />

//         <select
//           value={selectedExperience}
//           onChange={(e) => setSelectedExperience(e.target.value)}
//           style={styles.input}
//         >
//           <option value="">Level of Experience?</option>
//           {experienceOptions.map((lvl) => (
//             <option key={lvl}>{lvl}</option>
//           ))}
//         </select>

//         <p style={styles.statusLabel}>What's Your Current Status?</p>

//         <div style={styles.statusRow}>
//           <button
//             onClick={() => setCurrentStatus("Professional")}
//             style={{
//               ...styles.statusBtn,
//               background:
//                 currentStatus === "Professional" ? "#7c3aed" : "#fff",
//               color:
//                 currentStatus === "Professional" ? "#fff" : "#000",
//               border:
//                 currentStatus === "Professional"
//                   ? "2px solid #7c3aed"
//                   : "1px solid #ccc",
//             }}
//           >
//             Professional
//           </button>

//           <button
//             onClick={() => setCurrentStatus("Student")}
//             style={{
//               ...styles.statusBtn,
//               background:
//                 currentStatus === "Student" ? "#7c3aed" : "#fff",
//               color:
//                 currentStatus === "Student" ? "#fff" : "#000",
//               border:
//                 currentStatus === "Student"
//                   ? "2px solid #7c3aed"
//                   : "1px solid #ccc",
//             }}
//           >
//             Student
//           </button>
//         </div>

//         <button
//           onClick={handleSave}
//           disabled={isLoading}
//           style={styles.continueBtn}
//         >
//           {isLoading ? "Saving..." : "CONTINUE"}
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   pageBg: {
//     height: "100vh",
//     width: "100%",
//     background:
//       "linear-gradient(140deg, #ffffff 10%, #f4edff 60%, #fffbd9 100%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: 50,
//     fontFamily: "Inter, sans-serif",
//     overflow: "hidden",

//   },

//   topRow: {
//     width: 650,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 10,
//   },

//   backArrow: {
//     cursor: "pointer",
//     fontSize: 20,
//     fontWeight: 600,
//     marginLeft: -50,
//   },

//   topTitle: {
//     fontSize: 16,
//     fontWeight: 700,
//   },

//   card: {
//     width: 650,
//     background: "#fff",
//     borderRadius: 26,
//     padding: "45px 55px 55px",
//     boxShadow: "0px 12px 40px rgba(0,0,0,0.12)",
//     textAlign: "center",
//   },

// heading: {
//   fontSize: 16,
//   fontWeight: 400,
//   marginBottom: 35,
//   textAlign: "center",
//   color: "#000000",
// },


//  input: {
//   width: "100%",
//   padding: "16px",
//   borderRadius: 14,
//   border: "1px solid #e5e5e5",
//   marginBottom: 20,
//   fontSize: 15,
//   outline: "none",
//   background: "#fff",
//   boxSizing: "border-box",   // <-- FIX #1
//   display: "block",          // <-- FIX #2
// },


//   statusLabel: {
//     marginTop: 10,
//     marginBottom: 18,
//     fontSize: 15,
//     color: "#333",
//   },

//   statusRow: {
//     display: "flex",
//     justifyContent: "center",
//     gap: 25,
//     marginBottom: 35,
//   },

//   statusBtn: {
//     width: 140,
//     padding: "14px 0",
//     borderRadius: 14,
//     cursor: "pointer",
//     fontSize: 15,
//     fontWeight: 600,
//     transition: "0.2s",
//   },

//   continueBtn: {
//     width: "100%",
//     padding: "16px",
//     background: "#7c3aed",
//     color: "#fff",
//     borderRadius: 16,
//     fontSize: 16,
//     fontWeight: 600,
//     border: "none",
//     cursor: "pointer",
//   },
// };




// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// export default function ProfessionalStatusScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ SCROLL REMOVE
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => (document.body.style.overflow = "auto");
//   }, []);

//   const navState = location.state || {};

//   const {
//     uid = "",
//     first_name = "",
//     last_name = "",
//     email = "",
//     expertise = "",
//     location: userLocation = "",
//     referral = "",
//     linkedin = "",
//   } = navState;

//   const [title, setTitle] = useState("");
//   const [selectedExperience, setSelectedExperience] = useState("");
//   const [currentStatus, setCurrentStatus] = useState("Professional");
//   const [isLoading, setIsLoading] = useState(false);

//   const experienceOptions = ["Beginner", "Intermediate", "Expert"];
//   const db = getFirestore();

//   const handleSave = async () => {
//     if (!title.trim()) return alert("Enter your professional title");
//     if (!selectedExperience) return alert("Select experience level");

//     try {
//       setIsLoading(true);

//       await setDoc(
//         doc(db, "users", uid),
//         {
//           uid,
//           first_name,
//           last_name,
//           email,
//           expertise,
//           location: userLocation,
//           referral,
//           linkedin,
//           professional_title: title.trim(),
//           experience_level: selectedExperience,
//           current_status: currentStatus,
//           role: "freelancer",
//           profileCompleted: true,
//           updated_at: serverTimestamp(),
//         },
//         { merge: true }
//       );

//       navigate("/freelance-dashboard/freelanceHome", {
//         replace: true,
//         state: { uid },
//       });
//     } catch (err) {
//       alert("Saving failed: " + err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={styles.pageBg}>
//       <div style={styles.topRow}>
//         <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
//         <span style={styles.topTitle}>sign up as Client</span>
//       </div><br /><br />

//       <div style={styles.card}>
//         <h3 style={styles.heading}>Please complete the following step.</h3>

//         <input
//           type="text"
//           placeholder="Professional Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           style={styles.input}
//         />

//         <select
//           value={selectedExperience}
//           onChange={(e) => setSelectedExperience(e.target.value)}
//           style={styles.input}
//         >
//           <option value="">Level of Experience?</option>
//           {experienceOptions.map((lvl) => (
//             <option key={lvl}>{lvl}</option>
//           ))}
//         </select>

//         <p style={styles.statusLabel}>What's Your Current Status?</p>

//         <div style={styles.statusRow}>
//           <button
//             onClick={() => setCurrentStatus("Professional")}
//             style={{
//               ...styles.statusBtn,
//               background:
//                 currentStatus === "Professional" ? "#7c3aed" : "#fff",
//               color:
//                 currentStatus === "Professional" ? "#fff" : "#000",
//               border:
//                 currentStatus === "Professional"
//                   ? "2px solid #7c3aed"
//                   : "1px solid #ccc",
//             }}
//           >
//             Professional
//           </button>

//           <button
//             onClick={() => setCurrentStatus("Student")}
//             style={{
//               ...styles.statusBtn,
//               background:
//                 currentStatus === "Student" ? "#7c3aed" : "#fff",
//               color:
//                 currentStatus === "Student" ? "#fff" : "#000",
//               border:
//                 currentStatus === "Student"
//                   ? "2px solid #7c3aed"
//                   : "1px solid #ccc",
//             }}
//           >
//             Student
//           </button>
//         </div>

//         <button
//           onClick={handleSave}
//           disabled={isLoading}
//           style={styles.continueBtn}
//         >
//           {isLoading ? "Saving..." : "CONTINUE"}
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   pageBg: {
//     minHeight: "100vh",
//     width: "100%",
//     background: "linear-gradient(140deg, #ffffff 10%, #f4edff 60%, #fffbd9 100%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: 50,
//     fontFamily: "Inter, sans-serif",
//     overflowX: "hidden",
//     paddingLeft: 20,
//     paddingRight: 20,
//   },

//   topRow: {
//     width: "100%",
//     maxWidth: 650,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 10,
//   },

//   backArrow: {
//     cursor: "pointer",
//     fontSize: 20,
//     fontWeight: 600,
//   },

//   topTitle: {
//     fontSize: 16,
//     fontWeight: 700,
//   },

//   card: {
//     width: "100%",
//     maxWidth: 650,
//     background: "#fff",
//     borderRadius: 26,
//     padding: "45px 30px 55px",
//     boxShadow: "0px 12px 40px rgba(0,0,0,0.12)",
//     textAlign: "center",
//     boxSizing: "border-box",
//   },

//   heading: {
//     fontSize: 16,
//     fontWeight: 400,
//     marginBottom: 35,
//     textAlign: "center",
//     color: "#000000",
//   },

//   input: {
//     width: "100%",
//     padding: "16px",
//     borderRadius: 14,
//     border: "1px solid #e5e5e5",
//     marginBottom: 20,
//     fontSize: 15,
//     outline: "none",
//     background: "#fff",
//     boxSizing: "border-box",
//     display: "block",
//   },

//   statusLabel: {
//     marginTop: 10,
//     marginBottom: 18,
//     fontSize: 15,
//     color: "#333",
//   },

//   statusRow: {
//     display: "flex",
//     justifyContent: "center",
//     gap: 15,
//     marginBottom: 35,
//     flexWrap: "wrap", // allow wrapping on small screens
//   },

//   statusBtn: {
//     flex: 1, // scale to fit available space
//     minWidth: 120,
//     maxWidth: 200,
//     padding: "14px 0",
//     borderRadius: 14,
//     cursor: "pointer",
//     fontSize: 15,
//     fontWeight: 600,
//     transition: "0.2s",
//   },

//   continueBtn: {
//     width: "100%",
//     padding: "16px",
//     background: "#7c3aed",
//     color: "#fff",
//     borderRadius: 16,
//     fontSize: 16,
//     fontWeight: 600,
//     border: "none",
//     cursor: "pointer",
//   },

//   // Media Queries for smaller devices
//   "@media (max-width: 768px)": {
//     card: {
//       padding: "35px 20px 40px",
//     },
//     topRow: {
//       gap: 6,
//     },
//     statusRow: {
//       gap: 10,
//     },
//   },

//   "@media (max-width: 480px)": {
//     card: {
//       padding: "25px 15px 30px",
//     },
//     heading: {
//       fontSize: 14,
//     },
//     input: {
//       fontSize: 14,
//       padding: "12px",
//     },
//     statusBtn: {
//       fontSize: 14,
//       minWidth: 100,
//     },
//     continueBtn: {
//       fontSize: 14,
//       padding: "14px",
//     },
//   },
// };






import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backarrow from "../assets/backarrow.png";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function ProfessionalStatusScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const db = getFirestore();

  /* 🔒 NO SCROLL (mobile + desktop) */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const navState = location.state || {};

  const {
    uid = "",
    first_name = "",
    last_name = "",
    email = "",
    expertise = "",
    location: userLocation = "",
    referral = "",
    linkedin = "",
  } = navState;

  const [title, setTitle] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Professional");
  const [isLoading, setIsLoading] = useState(false);

  const experienceOptions = ["Beginner", "Intermediate", "Expert"];

  const handleSave = async () => {
    if (!title.trim()) return alert("Enter your professional title");
    if (!selectedExperience) return alert("Select experience level");

    try {
      setIsLoading(true);
      await setDoc(
        doc(db, "users", uid),
        {
          uid,
          first_name,
          last_name,
          email,
          expertise,
          location: userLocation,
          referral,
          linkedin,
          professional_title: title.trim(),
          experience_level: selectedExperience,
          current_status: currentStatus,
          role: "freelancer",
          profileCompleted: true,
          updated_at: serverTimestamp(),
        },
        { merge: true }
      );

      navigate("/freelance-dashboard/freelanceHome", {
        replace: true,
        state: { uid },
      });
    } catch (err) {
      alert("Saving failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.centerWrap}>
        {/* 🔙 HEADER (OUTSIDE CARD, ON TOP) */}
        <div style={styles.header}>
          <img
            src={backarrow}
            alt="back"
            style={styles.backArrow}
            onClick={() => navigate(-1)}
          />
          <span style={styles.headerText}>Sign up as Freelancer</span>
        </div>

        {/* CARD */}
        <div style={styles.card}>
          <h3 style={styles.heading}>Please complete the following step.</h3>

          <input
            type="text"
            placeholder="Professional Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            style={styles.input}
          >
            <option value="">Level of Experience?</option>
            {experienceOptions.map((lvl) => (
              <option key={lvl}>{lvl}</option>
            ))}
          </select>

          <p style={styles.statusLabel}>What's Your Current Status?</p>

          <div style={styles.statusRow}>
            {["Professional", "Student"].map((s) => (
              <button
                key={s}
                onClick={() => setCurrentStatus(s)}
                style={{
                  ...styles.statusBtn,
                  background:
                    currentStatus === s ? "#7c3aed" : "#fff",
                  color:
                    currentStatus === s ? "#fff" : "#000",
                  border:
                    currentStatus === s
                      ? "2px solid #7c3aed"
                      : "1px solid #ccc",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            style={styles.continueBtn}
          >
            {isLoading ? "Saving..." : "CONTINUE"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    background:
      "linear-gradient(140deg, #ffffff 10%, #f4edff 60%, #fffbd9 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
  },

  centerWrap: {
    width: "100%",
    maxWidth: 650,
    padding: "0 20px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  backArrow: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },

  headerText: {
    fontSize: 16,
    fontWeight: 700,
  },

  card: {
    background: "#fff",
    borderRadius: 26,
    padding: "36px 26px 40px",
    boxShadow: "0px 12px 40px rgba(0,0,0,0.12)",
    textAlign: "center",
  },

  heading: {
    fontSize: 16,
    marginBottom: 28,
  },

  input: {
    width: "100%",
    padding: "16px",
    borderRadius: 14,
    border: "1px solid #e5e5e5",
    marginBottom: 20,
    fontSize: 16, // prevents mobile zoom
    outline: "none",
    boxSizing: "border-box",
  },

  statusLabel: {
    marginBottom: 16,
    fontSize: 15,
  },

  statusRow: {
    display: "flex",
    justifyContent: "center",
    gap: 14,
    marginBottom: 30,
    flexWrap: "wrap",
  },

  statusBtn: {
    minWidth: 130,
    padding: "14px 0",
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },

  continueBtn: {
    width: "100%",
    padding: "16px",
    background: "#7c3aed",
    color: "#fff",
    borderRadius: 16,
    fontSize: 16,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
};
