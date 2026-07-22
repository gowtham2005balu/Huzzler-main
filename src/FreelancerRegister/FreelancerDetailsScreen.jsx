// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function FreelancerDetails() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const baseData = location.state || {};

//   const expertiseOptions = [
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

//   const referralOptions = ["LinkedIn", "Facebook", "X", "Instagram", "Other"];

//   const [expertise, setExpertise] = useState("");
//   const [locationText, setLocationText] = useState("");
//   const [linkedin, setLinkedin] = useState("");
//   const [referral, setReferral] = useState("");

//   const isValidLinkedIn = (url) => {
//     const pattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i;
//     return pattern.test(url.trim());
//   };

//   const handleNext = () => {
//     if (!expertise) return alert("Select expertise");
//     if (!locationText.trim()) return alert("Enter location");

//     if (!isValidLinkedIn(linkedin)) {
//       return alert("Enter a valid LinkedIn profile URL");
//     }

//     if (!referral) return alert("Select referral source");

//     navigate("/professional-status", {
//       state: {
//         ...baseData,
//         expertise,
//         location: locationText.trim(),
//         linkedin: linkedin.trim(),
//         referral,
//       },
//     });
//   };

//   return (
//     <div style={styles.page}>
      
//       {/* TOP ROW OUTSIDE CARD (mela varanum nu solliya) */}
//       <div style={styles.topRow}>
//         <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
//         <span style={styles.topTitle}>sign up as freelancer</span>
//       </div>

//       {/* MAIN CARD */}
//       <div style={styles.card}>

//         <h3 style={styles.heading}>
//           We’d like to get to know you better – this will only take a moment.
//         </h3>

//         <select
//           value={expertise}
//           onChange={(e) => setExpertise(e.target.value)}
//           style={{ ...styles.select, padding: "16px" }}   // <-- fix placeholder alignment

//         >
//           <option value="">What is your expertise?</option>
//           {expertiseOptions.map((e) => (
//             <option key={e}>{e}</option>
//           ))}
//         </select>

//         <input
//           type="text"
//           placeholder="Where are you located?"
//           value={locationText}
//           onChange={(e) => setLocationText(e.target.value)}
//           style={styles.select}
//         />

//         <input
//           type="text"
//           placeholder="Enter LinkedIn profile URL"
//           value={linkedin}
//           onChange={(e) => setLinkedin(e.target.value)}
//           style={styles.select}
//         />

//         <select
//           value={referral}
//           onChange={(e) => setReferral(e.target.value)}
//           style={styles.select}
//         >
//           <option value="">How did you hear about us?</option>
//           {referralOptions.map((e) => (
//             <option key={e}>{e}</option>
//           ))}
//         </select>

//         <button style={styles.button} onClick={handleNext}>
//           CONTINUE
//         </button>
//       </div>
//     </div>
//   );
// }

// /* -------------------- STYLES (UI untouched) -------------------- */
// const styles = {
//   page: {
//     width: "100vw",
//     height: "100vh",
//     background:
//       "radial-gradient(circle at 10% 90%, #ffffdd 0%, #ffffff 30%, #f5eaff 100%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: "40px",
//     overflow: "hidden",
//   },

//   /* ONLY THIS MOVED UP CORRECTLY */
//   topRow: {
//     width: "520px",
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     marginBottom: "15px",
//   },

//   backArrow: {
//     fontSize: "20px",
//     cursor: "pointer",
//     fontWeight: "600",
//     marginLeft:"-40px",
//   },

//   topTitle: {
//     fontSize: "16px",
//     fontWeight: "600",
//     color: "#2a2a2a",
//   },

//   card: {
//     width: "520px",
//     background: "white",
//     padding: "40px",
//     borderRadius: "26px",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },

//   heading: {
//     textAlign: "center",
//     fontSize: "16px",
//     fontWeight: "500",
//     color: "#333",
//     marginBottom: "10px",
//   },

// select: {
//   width: "100%",
//   padding: "15px",
//   borderRadius: "14px",
//   border: "1px solid #e0e0e0",
//   fontSize: "15px",
//   outline: "none",
//   background: "#fff",
//   boxSizing: "border-box",   // <-- FIX 1
// },


//   button: {
//     width: "100%",
//     padding: "16px",
//     borderRadius: "16px",
//     border: "none",
//     background: "#7b2ff7",
//     color: "white",
//     fontSize: "15px",
//     fontWeight: "600",
//     cursor: "pointer",
//     marginTop: "10px",
//   },
// };



// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function FreelancerDetails() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const baseData = location.state || {};

//   const expertiseOptions = [
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

//   const referralOptions = ["LinkedIn", "Facebook", "X", "Instagram", "Other"];

//   const [expertise, setExpertise] = useState("");
//   const [locationText, setLocationText] = useState("");
//   const [linkedin, setLinkedin] = useState("");
//   const [referral, setReferral] = useState("");

//   const isValidLinkedIn = (url) => {
//     const pattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i;
//     return pattern.test(url.trim());
//   };

//   const handleNext = () => {
//     if (!expertise) return alert("Select expertise");
//     if (!locationText.trim()) return alert("Enter location");

//     if (!isValidLinkedIn(linkedin)) {
//       return alert("Enter a valid LinkedIn profile URL");
//     }

//     if (!referral) return alert("Select referral source");

//     navigate("/professional-status", {
//       state: {
//         ...baseData,
//         expertise,
//         location: locationText.trim(),
//         linkedin: linkedin.trim(),
//         referral,
//       },
//     });
//   };

//   return (
//     <div style={styles.page}>
      
//       {/* TOP ROW OUTSIDE CARD (mela varanum nu solliya) */}
//       <div style={styles.topRow}>
//         <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
//         <span style={styles.topTitle}>sign up as freelancer</span>
//       </div>

//       {/* MAIN CARD */}
//       <div style={styles.card}>

//         <h3 style={styles.heading}>
//           We’d like to get to know you better – this will only take a moment.
//         </h3>

//         <select
//           value={expertise}
//           onChange={(e) => setExpertise(e.target.value)}
//           style={{ ...styles.select, padding: "16px" }}   // <-- fix placeholder alignment

//         >
//           <option value="">What is your expertise?</option>
//           {expertiseOptions.map((e) => (
//             <option key={e}>{e}</option>
//           ))}
//         </select>

//         <input
//           type="text"
//           placeholder="Where are you located?"
//           value={locationText}
//           onChange={(e) => setLocationText(e.target.value)}
//           style={styles.select}
//         />

//         <input
//           type="text"
//           placeholder="Enter LinkedIn profile URL"
//           value={linkedin}
//           onChange={(e) => setLinkedin(e.target.value)}
//           style={styles.select}
//         />

//         <select
//           value={referral}
//           onChange={(e) => setReferral(e.target.value)}
//           style={styles.select}
//         >
//           <option value="">How did you hear about us?</option>
//           {referralOptions.map((e) => (
//             <option key={e}>{e}</option>
//           ))}
//         </select>

//         <button style={styles.button} onClick={handleNext}>
//           CONTINUE
//         </button>
//       </div>
//     </div>
//   );
// }

// /* -------------------- STYLES (UI untouched) -------------------- */
// const styles = {
//   page: {
//     width: "100vw",
//     minHeight: "100vh",
//     background:
//       "radial-gradient(circle at 10% 90%, #ffffdd 0%, #ffffff 30%, #f5eaff 100%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: "40px",
//     paddingLeft: "20px",
//     paddingRight: "20px",
//     boxSizing: "border-box",
//   },

//   topRow: {
//     width: "100%",
//     maxWidth: 520,
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     marginBottom: "15px",
//   },

//   backArrow: {
//     fontSize: "20px",
//     cursor: "pointer",
//     fontWeight: "600",
//     marginLeft: "-10px", // reduce for smaller screens
//   },

//   topTitle: {
//     fontSize: "16px",
//     fontWeight: "600",
//     color: "#2a2a2a",
//   },

//   card: {
//     width: "100%",
//     maxWidth: 520,
//     background: "white",
//     padding: "40px 25px",
//     borderRadius: "26px",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//     boxSizing: "border-box",
//   },

//   heading: {
//     textAlign: "center",
//     fontSize: "16px",
//     fontWeight: "500",
//     color: "#333",
//     marginBottom: "10px",
//   },

//   select: {
//     width: "100%",
//     padding: "15px",
//     borderRadius: "14px",
//     border: "1px solid #e0e0e0",
//     fontSize: "15px",
//     outline: "none",
//     background: "#fff",
//     boxSizing: "border-box",
//   },

//   button: {
//     width: "100%",
//     padding: "16px",
//     borderRadius: "16px",
//     border: "none",
//     background: "#7b2ff7",
//     color: "white",
//     fontSize: "15px",
//     fontWeight: "600",
//     cursor: "pointer",
//     marginTop: "10px",
//   },

//   /* Media Queries */
//   "@media (max-width: 768px)": {
//     card: {
//       padding: "30px 20px",
//     },
//     topRow: {
//       gap: "5px",
//     },
//   },

//   "@media (max-width: 480px)": {
//     card: {
//       padding: "25px 15px",
//     },
//     heading: {
//       fontSize: "14px",
//     },
//     select: {
//       fontSize: "14px",
//       padding: "12px",
//     },
//     button: {
//       fontSize: "14px",
//       padding: "14px",
//     },
//     topTitle: {
//       fontSize: "14px",
//     },
//     backArrow: {
//       fontSize: "18px",
//       marginLeft: "-5px",
//     },
//   },
// };




import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backarrow from "../assets/backarrow.png";

export default function FreelancerDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const baseData = location.state || {};

  const expertiseOptions = [
    "Graphics & Design",
    "Programming & Tech",
    "Digital Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio",
    "AI Services",
    "Data",
    "Business",
    "Finance",
    "Photography",
    "Lifestyle",
    "Consulting",
    "Personal Growth & Hobbies",
  ];

  const referralOptions = ["LinkedIn", "Facebook", "X", "Instagram", "Other"];
  // Disable page scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
  const [expertise, setExpertise] = useState("");
  const [locationText, setLocationText] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [referral, setReferral] = useState("");

  const isValidLinkedIn = (url) =>
    /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i.test(url.trim());

  const handleNext = () => {
    if (!expertise) return alert("Select expertise");
    if (!locationText.trim()) return alert("Enter location");
    if (!isValidLinkedIn(linkedin))
      return alert("Enter a valid LinkedIn profile URL");
    if (!referral) return alert("Select referral source");

    navigate("/professional-status", {
      state: {
        ...baseData,
        expertise,
        location: locationText.trim(),
        linkedin: linkedin.trim(),
        referral,
      },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.centerWrap}>
        {/* OUTSIDE CARD HEADER */}
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
          <h3 style={styles.heading}>
            We’d like to get to know you better – this will only take a moment.
          </h3>

          <select
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            style={styles.select}
          >
            <option value="">What is your expertise?</option>
            {expertiseOptions.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Where are you located?"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            style={styles.select}
          />

          <input
            type="text"
            placeholder="Enter LinkedIn profile URL"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            style={styles.select}
          />

          <select
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            style={styles.select}
          >
            <option value="">How did you hear about us?</option>
            {referralOptions.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>

          <button style={styles.button} onClick={handleNext}>
            CONTINUE
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
    overflow: "hidden", // ✅ no scroll
    background:
      "radial-gradient(circle at 10% 90%, #ffffdd 0%, #ffffff 30%, #f5eaff 100%)",
    fontFamily: "Inter, sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  centerWrap: {
    width: "100%",
    maxWidth: 520,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    boxSizing: "border-box",
    padding: "0 20px",
  },

  /* HEADER OUTSIDE CARD */
  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12, // space between header & card
  },

  backArrow: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },

  headerText: {
    fontSize: 15,
    fontWeight: 700,
    color: "#222",
  },

  card: {
    width: "100%",
    background: "#fff",
    padding: "32px 24px",
    borderRadius: 26,
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxSizing: "border-box",
  },

  heading: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: 500,
    color: "#333",
  },

  select: {
    width: "100%",
    padding: "16px",
    borderRadius: 14,
    border: "1px solid #e0e0e0",
    fontSize: 16, // ✅ prevents mobile zoom
    outline: "none",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "16px",
    borderRadius: 16,
    border: "none",
    background: "#7b2ff7",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 4,
  },
};
