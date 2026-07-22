// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { signInWithCustomToken } from "firebase/auth";
// import { auth, db } from "../firbase/Firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function FreelancerOtpVerify() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const localData = JSON.parse(localStorage.getItem("freelancerOtpUser") || "{}");
//   const stateData = location.state || {};
//   const email = stateData.email || localData.email;

//   const [otp, setOtp] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [timer, setTimer] = useState(30);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   useEffect(() => {
//     if (!email) {
//       alert("Signup session expired. Please start again.");
//       navigate("/freelancer-signup");
//     }
//   }, []);

//   useEffect(() => {
//     if (timer === 0) {
//       setIsResendDisabled(false);
//       return;
//     }
//     const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
//     return () => clearTimeout(countdown);
//   }, [timer]);

//   const verifyOtp = async () => {
//     if (otp.length !== 6) return alert("Enter a valid 6-digit OTP");
//     setIsLoading(true);

//     try {
//       const res = await axios.post("https://huzzler.onrender.com/api/auth/verify-otp", {
//         email: email.toLowerCase(),
//         otp,
//       });

//       if (!res.data?.token) throw new Error("Invalid OTP");

//       const userCred = await signInWithCustomToken(auth, res.data.token);
//       const uid = userCred.user.uid;

//       const userRef = doc(db, "users", uid);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) throw new Error("User missing in database");
//       const userData = userSnap.data();

//       if (userData.role !== "freelancer") {
//         if (userData.role !== "freelancer") {
//         await setDoc(doc(db, "users", uid), { role: "freelancer" }, { merge: true });
// }

//         throw new Error("This OTP belongs to another account type");
//       }

//       localStorage.removeItem("freelancerOtpUser");

//       // 🔥 IMPORTANT: Passing user details to next page
//      navigate("/freelancer-details", {
//   replace: true,
//   state: {
//     uid,
//     first_name: userData.first_name || "",
//     last_name: userData.last_name || "",
//     email: userData.email || "",
//   },
// });


//     } catch (err) {
//       alert(err?.response?.data?.message || err.message);
//       setIsLoading(false);
//     }
//   };

//   const resendOtp = async () => {
//     setIsResendDisabled(true);
//     setTimer(30);

//     try {
//       await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
//         email: email.toLowerCase(),
//         action: "resend",
//       });
//       alert("New OTP sent!");
//     } catch {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//     <div style={{
//       width: "100%", height: "100vh", background: "#f7f8fa",
//       display: "flex", justifyContent: "center", alignItems: "center"
//     }}>
//       <div style={{
//         width: "350px", padding: "25px", background: "#fff",
//         borderRadius: "12px", textAlign: "center",
//         boxShadow: "0 0 20px rgba(0,0,0,0.08)"
//       }}>
//         <h2>Verify OTP</h2>
//         <p style={{ color: "#777" }}>{email}</p>

//         <input
//           type="text"
//           maxLength="6"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           placeholder="Enter 6-digit OTP"
//           style={{
//             width: "100%", padding: "12px", margin: "20px 0",
//             textAlign: "center", borderRadius: "8px", fontSize: "18px"
//           }}
//         />

//         <button
//           onClick={verifyOtp}
//           disabled={isLoading}
//           style={{
//             width: "100%", padding: "12px",
//             borderRadius: "8px",
//             background: isLoading ? "#999" : "#007bff",
//             color: "#fff", fontSize: "16px"
//           }}
//         >
//           {isLoading ? "Verifying..." : "Verify OTP"}
//         </button>

//         <div style={{ marginTop: "15px" }}>
//           {isResendDisabled ? (
//             <span style={{ color: "#666" }}>Resend OTP in {timer}s</span>
//           ) : (
//             <button
//               onClick={resendOtp}
//               style={{
//                 background: "none", border: "none",
//                 color: "#007bff", cursor: "pointer"
//               }}
//             >
//               Resend OTP
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }












import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { auth, db } from "../firbase/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

export default function FreelancerOtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  const localData = JSON.parse(localStorage.getItem("freelancerOtpUser") || "{}");
  const stateData = location.state || {};
  const email = stateData.email || localData.email;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const inputsRef = useRef([]);

  /* ------------------ MOBILE DETECTION ------------------ */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ------------------ BASIC CHECK ------------------ */
  useEffect(() => {
    if (!email) {
      alert("Signup session expired. Please start again.");
      navigate("/freelancer-signup");
    }
  }, []);

  /* ------------------ TIMER ------------------ */
  useEffect(() => {
    if (timer === 0) {
      setIsResendDisabled(false);
      return;
    }
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  /* ------------------ OTP HANDLERS ------------------ */
  const handleChange = (val, index) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  /* ------------------ VERIFY OTP (UNCHANGED BACKEND) ------------------ */
  const verifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return alert("Enter a valid 6-digit OTP");

    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        { email: email.toLowerCase(), otp: otpValue }
      );

      const userCred = await signInWithCustomToken(auth, res.data.token);
      const uid = userCred.user.uid;

      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      const userData = snap.data();

      if (userData.role !== "freelancer") {
        await setDoc(userRef, { role: "freelancer" }, { merge: true });
      }

      localStorage.removeItem("freelancerOtpUser");

      navigate("/freelancer-details", {
        replace: true,
        state: {
          uid,
          first_name: userData.first_name || userData.firstName || localData.first_name || "",
          last_name: userData.last_name || userData.lastName || localData.last_name || "",
          email: userData.email || "",
        },
      });
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
      setIsLoading(false);
    }
  };

  /* ------------------ RESEND OTP ------------------ */
  const resendOtp = async () => {
    setIsResendDisabled(true);
    setTimer(30);
    try {
      await axios.post(
        "https://huzzler.onrender.com/api/auth/resend-otp",
        { email: email.toLowerCase(), action: "resend" }
      );
      alert("New OTP sent!");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  /* ======================= UI ======================= */
  return (
    <div style={styles.page}>
      {/* BACK */}
      <div style={styles.backRow}>
        <span onClick={() => navigate(-1)} style={styles.backText}>
          ← BACK
        </span>
      </div>

      {/* CARD */}
      <div
        style={{
          ...styles.card,
          width: isMobile ? "calc(100% - 32px)" : 520,
        }}
      >
        <h2 style={styles.title}>
          You're almost there! We just need to verify your email.
        </h2>

        <p style={styles.sub}>Great Almost done!</p>
        <p style={styles.sub}>Please verify your email</p>

        <p style={styles.emailLabel}>Enter the verification code sent to:</p>
        <p style={styles.email}>{email}</p>

        {/* OTP BOXES */}
        <div
          style={{
            ...styles.otpRow,
            paddingLeft: isMobile ? 24 : 0,
            paddingRight: isMobile ? 24 : 0,
          }}
        >
          {otp.map((v, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={v}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              style={styles.otpBox}
            />
          ))}
        </div>


        {/* RESEND */}
        <div style={{ marginTop: 14 }}>
          {isResendDisabled ? (
            <span style={styles.resendText}>
              Didn't receive OTP? <span style={{ color: "#999" }}>Resend in {timer}s</span>
            </span>
          ) : (
            <span onClick={resendOtp} style={styles.resendLink}>
              Didn't receive OTP? Resend OTP
            </span>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={verifyOtp}
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? "Verifying..." : "Get Started"}
        </button>
      </div>
    </div>
  );
}

/* ======================= STYLES ======================= */
const styles = {
  page: {
    width: "100vw",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 10% 90%, #ffffdd 0%, #ffffff 40%, #f3eaff 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
  },

  backRow: {
    width: "100%",
    maxWidth: 1100,
    padding: "20px 24px",
  },

  backText: {
    fontWeight: 600,
    cursor: "pointer",
    color: "#1f2937",
  },

  card: {
    background: "#fff",
    borderRadius: 22,
    padding: "36px 32px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
    textAlign: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 24,
  },

  sub: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },

  emailLabel: {
    marginTop: 20,
    fontSize: 14,
    color: "#777",
  },

  email: {
    fontWeight: 600,
    marginBottom: 20,
  },

  otpRow: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
    padding: "0 16px",  
    boxSizing: "border-box",
  },


  // otpBox: {
  //   width: 48,
  //   height: 48,
  //   textAlign: "center",
  //   fontSize: 20,
  //   borderRadius: 10,
  //   border: "1.5px solid #cfd4dc",
  //   outline: "none",

  //   lineHeight: "48px",   // 🔥 THIS IS THE FIX
  //   padding: 0,           // 🔥 IMPORTANT
  // },

  otpBox: {
    padding: 0,    
    outline: "none",
  fontSize: 20,
  border: "1.5px solid #cfd4dc",
  width: 48,
  height: 48,
  textAlign: "center",
  fontSize: 18,
  borderRadius: 10,
},




  resendText: {
    fontSize: 13,
    color: "#666",
  },

  resendLink: {
    fontSize: 13,
    color: "#7C3CFF",
    cursor: "pointer",
    fontWeight: 600,
  },

  button: {
    marginTop: 28,
    width: "100%",
    padding: "14px",
    borderRadius: 16,
    background: "#7C3CFF",
    color: "#fff",
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
};











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



