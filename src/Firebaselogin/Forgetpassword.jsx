
// import { useEffect, useState } from "react";

// import { db } from "../firbase/Firebase";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import backarrow from "../assets/backarrow.png";
// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
// useEffect(() => {
//   const isMobile = window.innerWidth <= 768;

//   if (isMobile) {
//     document.body.style.overflow = "hidden";
//     document.documentElement.style.overflow = "hidden";
//     document.body.style.height = "100dvh";
//   }

//   return () => {
//     document.body.style.overflow = "";
//     document.documentElement.style.overflow = "";
//     document.body.style.height = "";
//   };
// }, []);

//   async function handleForgotPassword() {
//     const normalized = email.trim().toLowerCase();

//     if (!normalized) {
//       alert("Please enter your email.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const q = query(collection(db, "users"), where("email", "==", normalized));
//       const snap = await getDocs(q);

//       if (snap.empty) {
//         alert("No account found with this email.");
//         return;
//       }

//       const data = snap.docs[0].data();
//       const { password = "", first_name = "", last_name = "", role = "freelancer" } = data;

//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/send-otp",
//         { email: normalized }
//       );

//       if (res.status === 200) {
//         alert("OTP sent to " + normalized);

//         navigate(
//           role === "client" ? "/clientloginotp" : "/freelancer-loginotp",
//           {
//             state: { email: normalized, first_name, last_name, password, role },
//           }
//         );
//       } else {
//         alert(res.data.message || "Failed to send OTP.");
//       }
//     } catch (err) {
//       alert("Error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={styles.page}>
//         <div style={styles.mobileWrapper}>
//       {/* BACK BUTTON */}
//       <div style={styles.topRow}>
//         <span ><img style={styles.backArrow} onClick={() => navigate(-1)}src={backarrow}/></span>
//         <span style={styles.backText}>Back</span>
//       </div>

//       {/* CARD */}
//       <div style={styles.card}>
//         <h2 style={styles.title}>Forgot Password</h2>
//         <p style={styles.subtitle}>
//           Enter your email to receive a verification code
//         </p>

//         <input
//           type="email"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={styles.input}
//         />

//         <button
//           onClick={handleForgotPassword}
//           disabled={loading}
//           style={styles.button}
//         >
//           {loading ? "Sending..." : "Send OTP"}
//         </button>

//         <button
//           style={styles.loginLink}
//           onClick={() => navigate("/firelogin")}
//         >
//           Back to Login
//         </button>
//       </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//   height: "100dvh",          // ✅ correct mobile viewport
//   width: "100%",
//   background: "linear-gradient(135deg, #fffbe8 20%, #f3e9ff 80%)",

//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",  // ✅ vertical center
//   alignItems: "center",      // ✅ horizontal center

//   fontFamily: "Inter, sans-serif",
//   boxSizing: "border-box",
//   overflow: "hidden",        // ✅ extra safety
// },
// mobileWrapper: {
//   width: "100%",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",

//   padding: "22px",
//   boxSizing: "border-box",

//   maxHeight: "100%",
//   overflow: "hidden",
// },


//  topRow: {
//   width: "100%",
//   maxWidth: 420,
//   display: "flex",
//   alignItems: "center",
//   gap: 8,
//   marginBottom: 20,
// },


//   backArrow: {
//    width: 20,
//       height: 20,
//       cursor: "pointer",
//   },

//   backText: {
//     fontSize: 14,
//     fontWeight: 600,
//   },

//   card: {
//     width: "100%",
//     maxWidth: 420,
//     background: "#fff",
//     padding: "32px 24px",
//     borderRadius: 24,
//     boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//     textAlign: "center",
//     boxSizing: "border-box",
//   },

//   title: {
//     fontSize: 20,
//     fontWeight: 700,
//     marginBottom: 8,
//   },

//   subtitle: {
//     fontSize: 14,
//     color: "#444",
//     marginBottom: 26,
//   },

//   input: {
//     width: "100%",
//     padding: "14px",
//     borderRadius: 14,
//     border: "1px solid #ddd",
//     outline: "none",
//     fontSize: 15,
//     marginBottom: 20,
//     boxSizing: "border-box",
//   },

//   button: {
//     width: "100%",
//     padding: "14px",
//     borderRadius: 16,
//     background: "#7C3CFF",
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: 600,
//     border: "none",
//     cursor: "pointer",
//   },

//   loginLink: {
//     marginTop: 22,
//     fontSize: 14,
//     color: "#6a1bff",
//     cursor: "pointer",
//     background: "none",
//     border: "none",
//     textDecoration: "underline",
//   },
// };




import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firbase/Firebase";
import { color } from "framer-motion";



export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = (text, isError = true) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 4000);
  };


  const handleSendOtp = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      showMessage("Please enter a valid email", true);
      return;
    }

    setLoading(true);
    try {
      // ✅ 1. Fetch user from Firestore by email
      const q = query(collection(db, "users"), where("email", "==", trimmedEmail));
      const snap = await getDocs(q);

      if (snap.empty) {
        showMessage("No account found with this email", true);
        return;
      }

      const userData = snap.docs[0].data();
      const uid = snap.docs[0].id; // Firestore doc id = uid

      // ✅ 2. Send OTP via backend
      const res = await fetch("https://huzzler.onrender.com/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showMessage(data.message || "OTP sent! Check your email.", false);

        // ✅ 3. Navigate to OTP page with email + uid
        navigate("/forgetotp", { state: { email: trimmedEmail, uid } });
      } else {
        showMessage(data.message || "Failed to send OTP", true);
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      showMessage("Network error. Please try again.", true);
    } finally {
      setLoading(false);
    }
  };

return (
  <div style={styles.pageBg}>

    {/* TOP BRAND */}
    <h2 style={styles.brand}>Huzzler</h2>

    <div style={styles.cardWrap}>
      <h3 style={styles.heading}>Forgot Password</h3>
      <p style={styles.subHeading}>
        Don’t worry! We’ll help you reset it.
      </p>

      {message && (
        <div
          style={{
            ...styles.message,
            ...(message.isError ? styles.errorMsg : styles.successMsg),
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSendOtp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          disabled={loading}
        />

        <p style={styles.note}>• Enter the email linked to your account</p>

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  </div>
);

}

const styles = {
  pageBg: {
    minHeight: "100vh",
    background:
      "linear-gradient(120deg,#fff 20%,#efe8ff 60%,#fff8d9 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 200,
    fontFamily: "Inter, sans-serif",
  },

  brand: {
    fontSize: 22,
    fontWeight: 700,
    color: "#7B2BFF",
    marginBottom: 40,
  },

  cardWrap: {
    width: 420,
    maxWidth: "90%",
    background: "#fff",
    borderRadius: 22,
    padding: "36px 28px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    textAlign: "center",
  },

  heading: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 8,
  },

  subHeading: {
    fontSize: 14,
    color: "#777",
    marginBottom: 22,
  },

  input: {
    width: "100%",
    height: 46,
    borderRadius: 12,
    border: "1px solid #ddd",
    padding: "0 14px",
    fontSize: 14,
  },

  note: {
    textAlign: "left",
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    marginBottom: 18,
  },

  button: {
    width: "100%",
    height: 46,
    borderRadius: 12,
    border: "none",
    background: "#7B2BFF",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
  },

  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 13,
  },

  successMsg: {
    background: "#d4edda",
    color: "#155724",
  },

  errorMsg: {
    background: "#f8d7da",
    color: "#721c24",
  },
};
