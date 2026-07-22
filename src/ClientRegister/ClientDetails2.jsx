// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   serverTimestamp,
// } from "firebase/firestore";

// // ✅ Firebase init must already be done in your project
// // import { auth, db } from "../firebase/Firebase"; ❌
// // Using modular directly 👇

// export default function SiteDetailsScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 🔹 Client data from previous screen
//   const clientData = location.state?.clientData || {};

//   const auth = getAuth();
//   const db = getFirestore();

//   const [loading, setLoading] = useState(false);

//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedSource, setSelectedSource] = useState("");

//   const [website, setWebsite] = useState("");
//   const [locationText, setLocationText] = useState("");
//   const [linkedin, setLinkedin] = useState("");

//   /* ================= DROPDOWN DATA ================= */

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

//   const sourceOptions = [
//     "Google",
//     "Social Media",
//     "Referral",
//     "LinkedIn",
//     "Other",
//   ];

//   /* ================= SAVE CLIENT DATA ================= */

//   const saveClientData = async () => {
//     if (!selectedCategory || !selectedSource) {
//       alert("Please fill all dropdown fields");
//       return;
//     }

//     if (!locationText.trim()) {
//       alert("Please enter your location");
//       return;
//     }

//     if (
//       !linkedin ||
//       !/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/.test(linkedin)
//     ) {
//       alert("Please enter a valid LinkedIn URL");
//       return;
//     }

//     try {
//       setLoading(true);

//       const uid = auth.currentUser?.uid;
//       if (!uid) throw new Error("User not logged in");

//       const finalData = {
//         ...clientData,
//         userId: uid,
//         role: "client",
//         category: selectedCategory,
//         website: website.trim(),
//         location: locationText.trim(),
//         linkedin: linkedin.trim(),
//         source: selectedSource,
//         created_at: serverTimestamp(),
//       };

//       await setDoc(doc(db, "users", uid), finalData, { merge: true });

//       alert("Client profile saved successfully!");

//       navigate("/client-dashbroad2/clienthome", {
//         replace: true,
//         state: { userData: finalData, uid },
//       });
//     } catch (err) {
//       alert("Error saving data: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <button onClick={() => navigate(-1)} style={styles.backBtn}>
//           ←
//         </button>
//         <span style={styles.headerText}>Sign up as Client</span>
//       </div>

//       <h3 style={styles.title}>
//         Set Up Your Profile For Your Workspace
//       </h3>

//       {/* CATEGORY */}
//       <select
//         value={selectedCategory}
//         onChange={(e) => setSelectedCategory(e.target.value)}
//         style={styles.input}
//       >
//         <option value="">Select your need category</option>
//         {categories.map((c) => (
//           <option key={c} value={c}>
//             {c}
//           </option>
//         ))}
//       </select>

//       {/* WEBSITE */}
//       <div style={styles.websiteBox}>
//         <span style={{ opacity: 0.6 }}>www.</span>
//         <input
//           value={website}
//           onChange={(e) => setWebsite(e.target.value)}
//           placeholder="company.com"
//           style={styles.websiteInput}
//         />
//       </div>

//       {/* LOCATION */}
//       <input
//         value={locationText}
//         onChange={(e) => setLocationText(e.target.value)}
//         placeholder="Where are you located?"
//         style={styles.input}
//       />

//       {/* LINKEDIN */}
//       <input
//         value={linkedin}
//         onChange={(e) => setLinkedin(e.target.value)}
//         placeholder="https://www.linkedin.com/in/username"
//         style={styles.input}
//       />

//       {/* SOURCE */}
//       <select
//         value={selectedSource}
//         onChange={(e) => setSelectedSource(e.target.value)}
//         style={styles.input}
//       >
//         <option value="">How did you hear about us?</option>
//         {sourceOptions.map((s) => (
//           <option key={s} value={s}>
//             {s}
//           </option>
//         ))}
//       </select>

//       {/* BUTTON */}
//       <button
//         onClick={saveClientData}
//         disabled={loading}
//         style={styles.button}
//       >
//         {loading ? "Saving..." : "CONTINUE"}
//       </button>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "#fff",
//     padding: 20,
//     fontFamily: "Rubik, sans-serif",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//   },
//   backBtn: {
//     border: "none",
//     background: "transparent",
//     fontSize: 18,
//     cursor: "pointer",
//   },
//   headerText: {
//     fontWeight: "bold",
//     fontSize: 13,
//   },
//   title: {
//     textAlign: "center",
//     margin: "30px 0",
//     fontWeight: 600,
//   },
//   input: {
//     width: "100%",
//     padding: "14px 16px",
//     borderRadius: 20,
//     border: "1px solid #ddd",
//     marginBottom: 16,
//     fontSize: 14,
//   },
//   websiteBox: {
//     display: "flex",
//     alignItems: "center",
//     border: "1px solid #ddd",
//     borderRadius: 20,
//     padding: "0 16px",
//     marginBottom: 16,
//   },
//   websiteInput: {
//     flex: 1,
//     border: "none",
//     outline: "none",
//     padding: "14px 6px",
//     fontSize: 14,
//   },
//   button: {
//     width: "100%",
//     height: 48,
//     borderRadius: 14,
//     background: "#FDFD96",
//     border: "none",
//     fontWeight: 600,
//     cursor: "pointer",
//   },
// };

// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   serverTimestamp,
// } from "firebase/firestore";



// export default function SiteDetailsScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 🔹 Client data from previous screen
//   const clientData = location.state?.clientData || {};

//   const auth = getAuth();
//   const db = getFirestore();

//   const [loading, setLoading] = useState(false);

//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedSource, setSelectedSource] = useState("");

//   const [website, setWebsite] = useState("");
//   const [locationText, setLocationText] = useState("");
//   const [linkedin, setLinkedin] = useState("");

//   /* ================= DROPDOWN DATA ================= */

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

//   const sourceOptions = [
//     "Google",
//     "Social Media",
//     "Referral",
//     "LinkedIn",
//     "Other",
//   ];

//   /* ================= SAVE CLIENT DATA ================= */

//   const saveClientData = async () => {
//     if (!selectedCategory || !selectedSource) {
//       alert("Please fill all dropdown fields");
//       return;
//     }

//     if (!locationText.trim()) {
//       alert("Please enter your location");
//       return;
//     }

//     if (
//       !linkedin ||
//       !/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/.test(linkedin)
//     ) {
//       alert("Please enter a valid LinkedIn URL");
//       return;
//     }

//     try {
//       setLoading(true);

//       const uid = auth.currentUser?.uid;
//       if (!uid) throw new Error("User not logged in");

//       const finalData = {
//         ...clientData,
//         userId: uid,
//         role: "client",
//         category: selectedCategory,
//         website: website.trim(),
//         location: locationText.trim(),
//         linkedin: linkedin.trim(),
//         source: selectedSource,
//         created_at: serverTimestamp(),
//       };

//       await setDoc(doc(db, "users", uid), finalData, { merge: true });

//       alert("Client profile saved successfully!");

//       navigate("/client-dashbroad2/clienthome", {
//         replace: true,
//         state: { userData: finalData, uid },
//       });
//     } catch (err) {
//       alert("Error saving data: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div style={styles.page}>

//       <div className="continer" style={styles.container}>
//         {/* Header */}
//         <div style={styles.topHeader}>
//           <span style={styles.back} onClick={() => navigate(-1)}>←</span>
//           <span style={styles.headerText}>sign up as freelancer</span>
//         </div>

//         {/* Card */}
//         <div style={styles.card}>
//           <p style={styles.subtitle}>Please complete the following step.</p>

//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             style={styles.input}
//           >
//             <option value="">Select your need category</option>
//             {categories.map((c) => (
//               <option key={c} value={c}>{c}</option>
//             ))}
//           </select>

//           <input
//             value={website}
//             onChange={(e) => setWebsite(e.target.value)}
//             placeholder="company website URL"
//             style={styles.input}
//           />

//           <input
//             value={locationText}
//             onChange={(e) => setLocationText(e.target.value)}
//             placeholder="Where are you located ?"
//             style={styles.input}
//           />

//           <input
//             value={linkedin}
//             onChange={(e) => setLinkedin(e.target.value)}
//             placeholder="Linked in URL"
//             style={styles.input}
//           />

//           <select
//             value={selectedSource}
//             onChange={(e) => setSelectedSource(e.target.value)}
//             style={styles.input}
//           >
//             <option value="">How did you hear about us?</option>
//             {sourceOptions.map((s) => (
//               <option key={s} value={s}>{s}</option>
//             ))}
//           </select>

//           <button
//             onClick={saveClientData}
//             disabled={loading}
//             style={styles.button}
//           >
//             {loading ? "Saving..." : "CONTINUE"}
//           </button>
//         </div>

//       </div>


//     </div>
//   );

// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(135deg, #6e54e323, #EFE7FF)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center", // center vertically on desktop
//     paddingTop: 30,
//     paddingBottom: 30,
//     fontFamily: "Inter, sans-serif",
//     paddingLeft: "10px",
//     paddingRight: "10px",
//   },
//   container: {
//     width: "100%",
//     maxWidth: window.innerWidth >= 1024 ? 700 : 480, // bigger on desktop
//     margin: "0 auto", // center horizontally
//     boxSizing: "border-box",
//   },
//   topHeader: {
//     width: "100%",
//     maxWidth: 420,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 20,
//     paddingLeft: 10,
//   },
//   back: {
//     cursor: "pointer",
//     fontSize: window.innerWidth >= 1024 ? 22 : 18, // bigger back arrow on desktop
//   },
//   headerText: {
//     fontSize: window.innerWidth >= 1024 ? 16 : 13, // bigger header text
//     fontWeight: 500,
//   },
//   card: {
//     width: "100%",
//     maxWidth: window.innerWidth >= 1024 ? 650 : 420, // bigger card on desktop
//     background: "#fff",
//     borderRadius: 24,
//     padding: window.innerWidth >= 1024 ? 36 : 24, // more padding
//     boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
//     boxSizing: "border-box",
//     margin: "0 auto", // center card
//   },
//   subtitle: {
//     fontSize: window.innerWidth >= 1024 ? 16 : 14,
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     padding: window.innerWidth >= 1024 ? "16px 18px" : "14px 16px",
//     borderRadius: 14,
//     border: "1px solid #e5e5e5",
//     fontSize: window.innerWidth >= 1024 ? 16 : 14,
//     marginBottom: 14,
//     outline: "none",
//   },
//   button: {
//     width: "100%",
//     height: window.innerWidth >= 1024 ? 52 : 48,
//     marginTop: 10,
//     borderRadius: 14,
//     background: "#7C3AED",
//     color: "#fff",
//     border: "none",
//     fontWeight: 600,
//     fontSize: window.innerWidth >= 1024 ? 16 : 14,
//     cursor: "pointer",
//     transition: "background 0.3s ease",
//   },

//   // responsive fallback for small screens
//   responsive: {
//     card: {
//       padding: window.innerWidth <= 480 ? 20 : 24,
//     },
//     subtitle: {
//       fontSize: window.innerWidth <= 480 ? 13 : 14,
//     },
//     input: {
//       padding: window.innerWidth <= 480 ? "12px 14px" : "14px 16px",
//       fontSize: window.innerWidth <= 480 ? 13 : 14,
//     },
//     button: {
//       height: window.innerWidth <= 480 ? 44 : 48,
//       fontSize: window.innerWidth <= 480 ? 13 : 14,
//     },
//   },
// };


import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";



export default function SiteDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Client data from previous screen
  const clientData = location.state?.clientData || {};

  const auth = getAuth();
  const db = getFirestore();

  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSource, setSelectedSource] = useState("");

  const [website, setWebsite] = useState("");
  const [locationText, setLocationText] = useState("");
  const [linkedin, setLinkedin] = useState("");

  /* ================= DROPDOWN DATA ================= */

  const categories = [
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

  const sourceOptions = [
    "Google",
    "Social Media",
    "Referral",
    "LinkedIn",
    "Other",
  ];

  /* ================= SAVE CLIENT DATA ================= */

  const saveClientData = async () => {
    if (!selectedCategory || !selectedSource) {
      alert("Please fill all dropdown fields");
      return;
    }

    if (!locationText.trim()) {
      alert("Please enter your location");
      return;
    }

    if (
      !linkedin ||
      !/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/.test(linkedin)
    ) {
      alert("Please enter a valid LinkedIn URL");
      return;
    }

    try {
      setLoading(true);

      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("User not logged in");

      const finalData = {
        ...clientData,
        userId: uid,
        role: "client",
        category: selectedCategory,
        website: website.trim(),
        location: locationText.trim(),
        linkedin: linkedin.trim(),
        source: selectedSource,
        created_at: serverTimestamp(),
      };

      await setDoc(doc(db, "users", uid), finalData, { merge: true });

      alert("Client profile saved successfully!");

      navigate("/client-dashbroad2/clienthome", {
        replace: true,
        state: { userData: finalData, uid },
      });
    } catch (err) {
      alert("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div style={styles.page}>

      <div className="continer" style={styles.container}>
        {/* Header */}
        <div style={styles.topHeader}>
          <span style={styles.back} onClick={() => navigate(-1)}>←</span>
          <span style={styles.headerText}>sign up as Client</span>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <p style={styles.subtitle}>Please complete the following step.</p>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.input}
          >
            <option value="">Select your need category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="company website URL"
            style={styles.input}
          />

          <input
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            placeholder="Where are you located ?"
            style={styles.input}
          />

          <input
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="Linked in URL"
            style={styles.input}
          />

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            style={styles.input}
          >
            <option value="">How did you hear about us?</option>
            {sourceOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={saveClientData}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Saving..." : "CONTINUE"}
          </button>
        </div>

      </div>


    </div>
  );

}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #6e54e323, #EFE7FF)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // center vertically on desktop
    paddingTop: 30,
    paddingBottom: 30,
    fontFamily: "Inter, sans-serif",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  container: {
    width: "100%",
    maxWidth: window.innerWidth >= 1024 ? 700 : 480, // bigger on desktop
    margin: "0 auto", // center horizontally
    boxSizing: "border-box",
  },
  topHeader: {
    width: "100%",
    maxWidth: 420,
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
    paddingLeft: 10,
  },
  back: {
    cursor: "pointer",
    fontSize: window.innerWidth >= 1024 ? 22 : 18, // bigger back arrow on desktop
  },
  headerText: {
    fontSize: window.innerWidth >= 1024 ? 16 : 13, // bigger header text
    fontWeight: 500,
  },
  card: {
    width: "100%",
    maxWidth: window.innerWidth >= 1024 ? 650 : 420, // bigger card on desktop
    background: "#fff",
    borderRadius: 24,
    padding: window.innerWidth >= 1024 ? 36 : 24, // more padding
    boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
    margin: "0 auto", // center card
  },
  subtitle: {
    fontSize: window.innerWidth >= 1024 ? 16 : 14,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: window.innerWidth >= 1024 ? "16px 18px" : "14px 16px",
    borderRadius: 14,
    border: "1px solid #e5e5e5",
    fontSize: window.innerWidth >= 1024 ? 16 : 14,
    marginBottom: 14,
    outline: "none",
  },
  button: {
    width: "100%",
    height: window.innerWidth >= 1024 ? 52 : 48,
    marginTop: 10,
    borderRadius: 14,
    background: "#7C3AED",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    fontSize: window.innerWidth >= 1024 ? 16 : 14,
    cursor: "pointer",
    transition: "background 0.3s ease",
  },

  // responsive fallback for small screens
  responsive: {
    card: {
      padding: window.innerWidth <= 480 ? 20 : 24,
    },
    subtitle: {
      fontSize: window.innerWidth <= 480 ? 13 : 14,
    },
    input: {
      padding: window.innerWidth <= 480 ? "12px 14px" : "14px 16px",
      fontSize: window.innerWidth <= 480 ? 13 : 14,
    },
    button: {
      height: window.innerWidth <= 480 ? 44 : 48,
      fontSize: window.innerWidth <= 480 ? 13 : 14,
    },
  },
};