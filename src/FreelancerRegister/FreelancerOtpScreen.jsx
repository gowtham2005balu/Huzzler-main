
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { auth } from "../firbase/Firebase";
// import { signInWithCustomToken } from "firebase/auth";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function FreelancerOtpScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { email, uid } = location.state || {};

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [loading, setLoading] = useState(false);

//   // TIMER
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);

//   const inputRefs = useRef([]);

//   useEffect(() => {
//     let interval;

//     if (timer > 0) {
//       interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//     } else {
//       setCanResend(true);
//     }

//     return () => clearInterval(interval);
//   }, [timer]);

//   // HANDLE OTP INPUT
//   const handleOtpChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);

//     // Move to next box
//     if (value && index < 5) {
//       inputRefs.current[index + 1].focus();
//     }

//     // Move back on delete
//     if (!value && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   // VERIFY OTP
//   const verifyOtp = async () => {
//     const finalOtp = otp.join("");
//     if (finalOtp.length !== 6) return alert("Enter valid 6 digit OTP");

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/verify-otp",
//         { email, otp: finalOtp }
//       );

//       if (!res.data.token) return alert("Invalid OTP");

//       await signInWithCustomToken(auth, res.data.token);

//       navigate("/freelance-dashboard/freelanceHome", {
//         state: { uid },
//       });

//     } catch (err) {
//       alert(err?.response?.data?.message || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // RESEND OTP
//   const resendOtp = async () => {
//     if (!canResend) return;

//     try {
//       await axios.post("https://huzzler.onrender.com/api/auth/send-otp", { email });
//       alert("OTP Resent!");

//       setTimer(30);
//       setCanResend(false);
//     } catch {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//     <div style={styles.page}>
      
//       {/* BACK BUTTON */}
//       <div style={styles.topRow}>
//         <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
//         <span style={styles.backText}>BACK</span>
//       </div>

//       {/* CARD */}
//       <div style={styles.card}>
//         <h2 style={styles.title}>You're almost there! We just need to verify your email.</h2>

//         <p style={styles.subtitle}>Great Almost done!</p>
//         <p style={styles.subtitle2}>Please verify your email</p>

//         <p style={styles.emailLabel}>
//           Enter the verification code sent to:<br />
//           <span style={styles.email}>{email}</span>
//         </p>

//         {/* OTP BOXES */}
//         <div style={styles.otpRow}>
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               maxLength={1}
//               value={digit}
//               ref={(el) => (inputRefs.current[index] = el)}
//               onChange={(e) => handleOtpChange(e.target.value, index)}
//               style={styles.otpBox}
//             />
//           ))}
//         </div>

//         {/* RESEND OTP */}
//         <p style={styles.resendRow}>
//           Didn't receive OTP?
//           <span
//             style={canResend ? styles.resendActive : styles.resendDisabled}
//             onClick={resendOtp}
//           >
//             {canResend ? " Resend OTP" : ``}
//           </span>
//         </p>

//         {/* BUTTON */}
//         <button
//           onClick={verifyOtp}
//           disabled={loading}
//           style={styles.button}
//         >
//           {loading ? "Verifying..." : "Get Started"}
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ------------------------------ UI STYLES ------------------------------ */

// const styles = {
//   page: {
//     width: "100vw",
//     height: "100vh",
//     background:
//       "linear-gradient(135deg, #fffce5 20%, #f3eaff 80%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingTop: 40,
//     fontFamily: "Inter, sans-serif",
//   },

//   topRow: {
//     width: 600,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 10,
//   },

//   backArrow: {
//     fontSize: 22,
//     cursor: "pointer",
//     fontWeight: 600,
//   },

//   backText: {
//     fontSize: 14,
//     fontWeight: 600,
//   },

//   card: {
//     width: 600,
//     background: "#fff",
//     padding: "50px 50px",
//     borderRadius: 26,
//     textAlign: "center",
//     boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//   },

//   title: {
//     fontSize: 20,
//     fontWeight: 600,
//     marginBottom: 10,
//   },

//   subtitle: {
//     fontSize: 15,
//     color: "#555",
//     marginTop: 10,
//   },

//   subtitle2: {
//     fontSize: 16,
//     fontWeight: 600,
//     marginTop: 5,
//   },

//   emailLabel: {
//     fontSize: 14,
//     marginTop: 20,
//     color: "#555",
//   },

//   email: {
//     fontWeight: 700,
//     fontSize: 15,
//   },

//   otpRow: {
//     display: "flex",
//     justifyContent: "center",
//     gap: 15,
//     marginTop: 25,
//     marginBottom: 15,
//   },

//   otpBox: {
//     width: 55,
//     height: 55,
//     textAlign: "center",
//     borderRadius: 14,
//     border: "1px solid #dcdcdc",
//     fontSize: 22,
//     fontWeight: 600,
//     outline: "none",
//   },

//   resendRow: {
//     marginTop: 10,
//     fontSize: 14,
//     color: "#666",
//   },

//   resendActive: {
//     color: "#7C3CFF",
//     marginLeft: 5,
//     cursor: "pointer",
//     fontWeight: 600,
//   },

//   resendDisabled: {
//     color: "#aaa",
//     marginLeft: 5,
//   },

//   button: {
//     marginTop: 25,
//     width: "100%",
//     padding: "18px",
//     background: "#7C3CFF",
//     borderRadius: 16,
//     border: "none",
//     fontSize: 17,
//     color: "#fff",
//     cursor: "pointer",
//     fontWeight: 600,
//   },
// };


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { auth } from "../firbase/Firebase";
// import { signInWithCustomToken } from "firebase/auth";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function FreelancerOtpScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { email, uid } = location.state || {};

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [loading, setLoading] = useState(false);

//   // TIMER
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);

//   const inputRefs = useRef([]);

//   useEffect(() => {
//     let interval;

//     if (timer > 0) {
//       interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//     } else {
//       setCanResend(true);
//     }

//     return () => clearInterval(interval);
//   }, [timer]);

//   const handleOtpChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);

//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }

//     if (!value && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const verifyOtp = async () => {
//     const finalOtp = otp.join("");
//     if (finalOtp.length !== 6) return alert("Enter valid 6 digit OTP");

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/verify-otp",
//         { email, otp: finalOtp }
//       );

//       if (!res.data.token) return alert("Invalid OTP");

//       await signInWithCustomToken(auth, res.data.token);

//       navigate("/freelance-dashboard/freelanceHome", {
//         state: { uid },
//       });
//     } catch (err) {
//       alert(err?.response?.data?.message || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resendOtp = async () => {
//     if (!canResend) return;

//     try {
//       await axios.post("https://huzzler.onrender.com/api/auth/send-otp", {
//         email,
//       });
//       alert("OTP Resent!");
//       setTimer(30);
//       setCanResend(false);
//     } catch {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//     <div style={styles.page}>
//       {/* BACK */}
//       <div style={styles.topRow}>
//         <span style={styles.backArrow} onClick={() => navigate(-1)}>←</span>
//         <span style={styles.backText}>BACK</span>
//       </div>

//       {/* CARD */}
//       <div style={styles.card}>
//         <h2 style={styles.title}>
//           You're almost there! We just need to verify your email.
//         </h2>

//         <p style={styles.subtitle}>Great Almost done!</p>
//         <p style={styles.subtitle2}>Please verify your email</p>

//         <p style={styles.emailLabel}>
//           Enter the verification code sent to:<br />
//           <span style={styles.email}>{email}</span>
//         </p>

//         {/* OTP */}
//         <div style={styles.otpRow}>
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               maxLength={1}
//               value={digit}
//               ref={(el) => (inputRefs.current[index] = el)}
//               onChange={(e) => handleOtpChange(e.target.value, index)}
//               style={styles.otpBox}
//             />
//           ))}
//         </div>

//         {/* RESEND */}
//         <p style={styles.resendRow}>
//           Didn't receive OTP?
//           <span
//             style={canResend ? styles.resendActive : styles.resendDisabled}
//             onClick={resendOtp}
//           >
//             {canResend ? " Resend OTP" : ""}
//           </span>
//         </p>

//         {/* BUTTON */}
//         <button
//           onClick={verifyOtp}
//           disabled={loading}
//           style={{
//             ...styles.button,
//             opacity: loading ? 0.7 : 1,
//           }}
//         >
//           {loading ? "Verifying..." : "Get Started"}
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ---------------- RESPONSIVE STYLES ---------------- */

// const styles = {
//   page: {
//     minHeight: "100vh",
//     width: "100%",
//     background: "linear-gradient(135deg, #fffce5 20%, #f3eaff 80%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     padding: "20px",
//     boxSizing: "border-box",
//     fontFamily: "Inter, sans-serif",
//   },

//   topRow: {
//     width: "100%",
//     maxWidth: 600,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 12,
//   },

//   backArrow: {
//     fontSize: 22,
//     cursor: "pointer",
//     fontWeight: 600,
//   },

//   backText: {
//     fontSize: 14,
//     fontWeight: 600,
//   },

// card: {
//   width: "100%",
//   maxWidth: 600,
//   background: "#fff",
//   padding: "40px 24px",   // ⬅️ mobile safe padding
//   borderRadius: 26,
//   textAlign: "center",
//   boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//   boxSizing: "border-box", // ✅ important
//   overflow: "hidden",      // ✅ prevent overflow
// },

//   title: {
//     fontSize: "clamp(18px, 2.5vw, 20px)",
//     fontWeight: 600,
//     marginBottom: 10,
//   },

//   subtitle: {
//     fontSize: 15,
//     color: "#555",
//     marginTop: 10,
//   },

//   subtitle2: {
//     fontSize: 16,
//     fontWeight: 600,
//     marginTop: 5,
//   },

//   emailLabel: {
//     fontSize: 14,
//     marginTop: 20,
//     color: "#555",
//     wordBreak: "break-word",
//   },

//   email: {
//     fontWeight: 700,
//     fontSize: 15,
//   },

 
// otpRow: {
//   display: "flex",
//   justifyContent: "center",   // ✅ center on desktop
//   gap: 12,                    // ✅ natural spacing
//   marginTop: 25,
//   marginBottom: 15,
//   width: "100%",
//   flexWrap: "nowrap",


// },


// otpBox: {
//   width: "clamp(42px, 12vw, 50px)",  // ✅ shrink only on mobile
//   height: "clamp(42px, 12vw, 50px)",
//   textAlign: "center",
//   lineHeight: "clamp(42px, 12vw, 50px)",
//   borderRadius: 12,
//   border: "1px solid #dcdcdc",
//   fontSize: "clamp(18px, 4vw, 20px)",
//   fontWeight: 600,
//   outline: "none",
//   padding: 0,
//   boxSizing: "border-box",
  
// },
 



//   resendRow: {
//     marginTop: 10,
//     fontSize: 14,
//     color: "#666",
//   },

//   resendActive: {
//     color: "#7C3CFF",
//     marginLeft: 5,
//     cursor: "pointer",
//     fontWeight: 600,
//   },

//   resendDisabled: {
//     color: "#aaa",
//     marginLeft: 5,
//   },

//   button: {
//     marginTop: 25,
//     width: "100%",
//     padding: "16px",
//     background: "#7C3CFF",
//     borderRadius: 16,
//     border: "none",
//     fontSize: 17,
//     color: "#fff",
//     cursor: "pointer",
//     fontWeight: 600,
//   },
// };





// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { auth } from "../firbase/Firebase";
// import { signInWithCustomToken } from "firebase/auth";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react"; // ✅ Imported back arrow

// export default function FreelancerOtpScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { email, uid } = location.state || {};

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);

//   const inputRefs = useRef([]);

//   // Disable page scroll
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     document.documentElement.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//       document.documentElement.style.overflow = "";
//     };
//   }, []);

//   // Timer
//   useEffect(() => {
//     let interval;
//     if (timer > 0) {
//       interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//     } else {
//       setCanResend(true);
//     }
//     return () => clearInterval(interval);
//   }, [timer]);

//   // Handle OTP input
//   const handleOtpChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;
//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);
//     if (value && index < 5) inputRefs.current[index + 1]?.focus();
//   };

//   const handleOtpKeyDown = (e, index) => {
//     if (e.key === "Backspace") {
//       e.preventDefault();
//       const updatedOtp = [...otp];
//       if (updatedOtp[index] !== "") {
//         updatedOtp[index] = "";
//         setOtp(updatedOtp);
//       } else if (index > 0) {
//         inputRefs.current[index - 1]?.focus();
//         updatedOtp[index - 1] = "";
//         setOtp(updatedOtp);
//       }
//     }
//   };

//   const verifyOtp = async () => {
//     const finalOtp = otp.join("");
//     if (finalOtp.length !== 6) return alert("Enter valid 6 digit OTP");

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/verify-otp",
//         { email, otp: finalOtp }
//       );
//       if (!res.data.token) return alert("Invalid OTP");

//       await signInWithCustomToken(auth, res.data.token);
//       navigate("/freelance-dashboard/freelanceHome", { state: { uid } });
//     } catch (err) {
//       alert(err?.response?.data?.message || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resendOtp = async () => {
//     if (!canResend) return;
//     try {
//       await axios.post("https://huzzler.onrender.com/api/auth/send-otp", { email });
//       alert("OTP Resent!");
//       setTimer(30);
//       setCanResend(false);
//     } catch {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.centerWrapper}>
//         {/* Back arrow */}
//         <div style={styles.topRow} onClick={() => navigate(-1)}>
//           <ArrowLeft size={20} style={{ cursor: "pointer" }} />
//           <span style={styles.backText}>BACK</span>
//         </div>

//         {/* Card */}
//         <div style={styles.card}>
//           <h2 style={styles.title}>You're almost there! We just need to verify your email.</h2>
//           <p style={styles.subtitle}>Great! Almost done!</p>
//           <p style={styles.subtitle2}>Please verify your email</p>
//           <p style={styles.emailLabel}>
//             Enter the verification code sent to:<br />
//             <span style={styles.email}>{email}</span>
//           </p>

//           {/* OTP */}
//          <div style={styles.otpRow}>
//   {otp.map((digit, index) => (
//     <input
//       key={index}
//       maxLength={1}
//       value={digit}
//       ref={(el) => (inputRefs.current[index] = el)}
//       onChange={(e) => handleOtpChange(e.target.value, index)}
//       onKeyDown={(e) => handleOtpKeyDown(e, index)}
//       style={styles.otpBox}
//       inputMode="numeric"
//       pattern="[0-9]*"
//       autoComplete="one-time-code"
//     />
//   ))}
// </div>


//           {/* Resend */}
//           <p style={styles.resendRow}>
//             Didn't receive OTP?
//             <span
//               style={canResend ? styles.resendActive : styles.resendDisabled}
//               onClick={resendOtp}
//             >
//               {canResend ? " Resend OTP" : ""}
//             </span>
//           </p>

//           {/* Button */}
//           <button
//             onClick={verifyOtp}
//             disabled={loading}
//             style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
//           >
//             {loading ? "Verifying..." : "Get Started"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     width: "100%",
//     background: "linear-gradient(135deg, #fffce5 20%, #f3eaff 80%)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     fontFamily: "Inter, sans-serif",
//     padding: "20px",
//     boxSizing: "border-box",
//   },
//   centerWrapper: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   topRow: {
//     width: "100%",
//     maxWidth: 600,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 12,
//   },
//   backText: {
//     fontSize: 14,
//     fontWeight: 600,
//   },
//   card: {
//     width: "100%",
//     maxWidth: 600,
//     background: "#fff",
//     padding: "40px 24px",
//     borderRadius: 26,
//     textAlign: "center",
//     boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//     boxSizing: "border-box",
//     overflow: "hidden",
//   },
//   title: { fontSize: "clamp(18px, 2.5vw, 20px)", fontWeight: 600, marginBottom: 10 },
//   subtitle: { fontSize: 15, color: "#555", marginTop: 10 },
//   subtitle2: { fontSize: 16, fontWeight: 600, marginTop: 5 },
//   emailLabel: { fontSize: 14, marginTop: 20, color: "#555", wordBreak: "break-word" },
//   email: { fontWeight: 700, fontSize: 15 },
//   otpRow: { display: "flex", justifyContent: "center", gap: 12, marginTop: 25, marginBottom: 15 },
//  otpBox: {
//   width: "clamp(42px, 12vw, 50px)",
//   height: "clamp(42px, 12vw, 50px)",
//   textAlign: "center",
//   lineHeight: "clamp(42px, 12vw, 50px)",
//   borderRadius: 12,
//   border: "1px solid #dcdcdc",
//   fontSize: 18, // >=16px prevents mobile zoom
//   fontWeight: 600,
//   outline: "none",
//   padding: 0,
//   boxSizing: "border-box",
// },

//   resendRow: { marginTop: 10, fontSize: 14, color: "#666" },
//   resendActive: { color: "#7C3CFF", marginLeft: 5, cursor: "pointer", fontWeight: 600 },
//   resendDisabled: { color: "#aaa", marginLeft: 5 },
//   button: { marginTop: 25, width: "100%", padding: "16px", background: "#7C3CFF", borderRadius: 16, border: "none", fontSize: 17, color: "#fff", cursor: "pointer", fontWeight: 600 },
// };




// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { auth } from "../firbase/Firebase";
// import { signInWithCustomToken } from "firebase/auth";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react"; // ✅ Imported back arrow
// // import "./otp.css";
// export default function FreelancerOtpScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { email, uid } = location.state || {};

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);

//   const inputRefs = useRef([]);

//   // Disable page scroll
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     document.documentElement.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//       document.documentElement.style.overflow = "";
//     };
//   }, []);

//   // Timer
//   useEffect(() => {
//     let interval;
//     if (timer > 0) {
//       interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//     } else {
//       setCanResend(true);
//     }
//     return () => clearInterval(interval);
//   }, [timer]);

//   // Handle OTP input
//   const handleOtpChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;
//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);
//     if (value && index < 5) inputRefs.current[index + 1]?.focus();
//   };

//   const handleOtpKeyDown = (e, index) => {
//     if (e.key === "Backspace") {
//       e.preventDefault();
//       const updatedOtp = [...otp];
//       if (updatedOtp[index] !== "") {
//         updatedOtp[index] = "";
//         setOtp(updatedOtp);
//       } else if (index > 0) {
//         inputRefs.current[index - 1]?.focus();
//         updatedOtp[index - 1] = "";
//         setOtp(updatedOtp);
//       }
//     }
//   };

//   const verifyOtp = async () => {
//     const finalOtp = otp.join("");
//     if (finalOtp.length !== 6) return alert("Enter valid 6 digit OTP");

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/verify-otp",
//         { email, otp: finalOtp }
//       );
//       if (!res.data.token) return alert("Invalid OTP");

//       await signInWithCustomToken(auth, res.data.token);
//       navigate("/freelance-dashboard/freelanceHome", { state: { uid } });
//     } catch (err) {
//       alert(err?.response?.data?.message || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resendOtp = async () => {
//     if (!canResend) return;
//     try {
//       await axios.post("https://huzzler.onrender.com/api/auth/send-otp", { email });
//       alert("OTP Resent!");
//       setTimer(30);
//       setCanResend(false);
//     } catch {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//    <div className="otp-page" style={styles.page}>

//       <div style={styles.centerWrapper}>
//         {/* Back arrow */}
//         <div style={styles.topRow} onClick={() => navigate(-1)}>
//           <ArrowLeft size={20} style={{ cursor: "pointer" }} />
//           <span style={styles.backText}>BACK</span>
//         </div>

//         {/* Card */}
//         <div className="card" style={styles.card}>
//           <h2 style={styles.title}>You're almost there! We just need to verify your email.</h2>
//           <p style={styles.subtitle}>Great! Almost done!</p>
//           <p style={styles.subtitle2}>Please verify your email</p>
//           <p style={styles.emailLabel}>
//             Enter the verification code sent to:<br />
//             <span style={styles.email}>{email}</span>
//           </p>

//           {/* OTP */}
//          <div style={styles.otpRow}>
//   {otp.map((digit, index) => (
//     <input
//       key={index}
//       maxLength={1}
//       value={digit}
//       ref={(el) => (inputRefs.current[index] = el)}
//       onChange={(e) => handleOtpChange(e.target.value, index)}
//       onKeyDown={(e) => handleOtpKeyDown(e, index)}
//       style={styles.otpBox}
//       inputMode="numeric"
//       pattern="[0-9]*"
//       autoComplete="one-time-code"
//     />
//   ))}
// </div>


//           {/* Resend */}
//           <p style={styles.resendRow}>
//             Didn't receive OTP?
//             <span
//               style={canResend ? styles.resendActive : styles.resendDisabled}
//               onClick={resendOtp}
//             >
//               {canResend ? " Resend OTP" : ""}
//             </span>
//           </p>

//           {/* Button */}
//           <button
//             onClick={verifyOtp}
//             disabled={loading}
//             style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
//           >
//             {loading ? "Verifying..." : "Get Started"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     width: "100%",
//     background: "linear-gradient(135deg, #fffce5 20%, #f3eaff 80%)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     fontFamily: "Inter, sans-serif",
//    padding: "16px",
//     boxSizing: "border-box",
//   },
//   centerWrapper: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
    

//   },
//   topRow: {
//     width: "100%",
//     maxWidth: 600,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 12,
//   },
//   backText: {
//     fontSize: 14,
//     fontWeight: 600,
//   },
//  card: {
//   maxWidth: 600,
//   width: "100%",        // ✅ important
//   background: "#fff",
//   padding: "20px 20px", // slightly reduce side padding
//   borderRadius: 26,
//   textAlign: "center",
//   boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//   boxSizing: "border-box",
//   overflow: "hidden",
//   margin: "0 auto",
// },

//   title: { fontSize: "clamp(18px, 2.5vw, 20px)", fontWeight: 600, marginBottom: 10 },
//   subtitle: { fontSize: 15, color: "#555", marginTop: 10 },
//   subtitle2: { fontSize: 16, fontWeight: 600, marginTop: 5 },
//   emailLabel: { fontSize: 14, marginTop: 20, color: "#555", wordBreak: "break-word" },
//   email: { fontWeight: 700, fontSize: 15 },
// otpRow: {
//   display: "flex",
//   justifyContent: "center",
//   gap: 8,               // slightly reduced gap
//   marginTop: 25,
//   marginBottom: 15,
//   flexWrap: "nowrap",   // ✅ force single row
//   maxWidth: "100%",     // ✅ prevent overflow
//   overflow: "hidden",
// },
// otpBox: {
//   width: "clamp(34px, 9vw, 48px)",   // ✅ smaller minimum
//   height: "clamp(34px, 9vw, 48px)",
//   lineHeight: "clamp(34px, 9vw, 48px)",
//   textAlign: "center",
//   borderRadius: 12,
//   border: "1px solid #dcdcdc",
//   fontSize: 18,
//   fontWeight: 600,
//   outline: "none",
//   padding: 0,
//   boxSizing: "border-box",
//   flexShrink: 1,        // ✅ allows shrinking instead of overflow
// },


//   resendRow: { marginTop: 10, fontSize: 14, color: "#666" },
//   resendActive: { color: "#7C3CFF", marginLeft: 5, cursor: "pointer", fontWeight: 600 },
//   resendDisabled: { color: "#aaa", marginLeft: 5 },
//   button: { marginTop: 25, width: "100%", padding: "16px", background: "#7C3CFF", borderRadius: 16, border: "none", fontSize: 17, color: "#fff", cursor: "pointer", fontWeight: 600 },
// };


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { auth } from "../firbase/Firebase";
import { signInWithCustomToken } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // ✅ Imported back arrow
// import "./otp.css";
export default function FreelancerOtpScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, uid } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Disable page scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const updatedOtp = [...otp];
      if (updatedOtp[index] !== "") {
        updatedOtp[index] = "";
        setOtp(updatedOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        updatedOtp[index - 1] = "";
        setOtp(updatedOtp);
      }
    }
  };

  const verifyOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return alert("Enter valid 6 digit OTP");

    try {
      setLoading(true);
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        { email, otp: finalOtp }
      );
      if (!res.data.token) return alert("Invalid OTP");

      await signInWithCustomToken(auth, res.data.token);
      navigate("/freelance-dashboard/freelanceHome", { state: { uid } });
    } catch (err) {
      alert(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!canResend) return;
    try {
      await axios.post("https://huzzler.onrender.com/api/auth/send-otp", { email });
      alert("OTP Resent!");
      setTimer(30);
      setCanResend(false);
    } catch {
      alert("Failed to resend OTP");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();   // stop page refresh
    verifyOtp();          // same as clicking Get Started
  };

  return (
    <div className="otp-page" style={styles.page}>

      <div style={styles.centerWrapper}>
        {/* Back arrow */}
        <div style={styles.topRow} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} style={{ cursor: "pointer" }} />
          <span style={styles.backText}>BACK</span>
        </div>

        {/* Card */}
        <div className="card" style={styles.card}>
          <h2 style={styles.title}>You're almost there! We just need to verify your email.</h2>
          <p style={styles.subtitle}>Great! Almost done!</p>
          <p style={styles.subtitle2}>Please verify your email</p>
          <p style={styles.emailLabel}>
            Enter the verification code sent to:<br />
            <span style={styles.email}>{email}</span>
          </p>
          <form onSubmit={handleSubmit}>
            {/* OTP */}
            <div style={styles.otpRow}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  style={styles.otpBox}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                />
              ))}
            </div>


            {/* Resend */}
            <p style={styles.resendRow}>
              Didn't receive OTP?
              <span
                style={canResend ? styles.resendActive : styles.resendDisabled}
                onClick={resendOtp}
              >
                {canResend ? " Resend OTP" : ""}
              </span>
            </p>

            {/* Button */}
            <button
              onClick={verifyOtp}
              disabled={loading}
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Verifying..." : "Get Started"}
            </button>
            </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #fffce5 20%, #f3eaff 80%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
    padding: "16px",
    boxSizing: "border-box",
  },
  centerWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",


  },
  topRow: {
    width: "100%",
    maxWidth: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  backText: {
    fontSize: 14,
    fontWeight: 600,
  },
  card: {
    maxWidth: 600,
    width: "100%",        // ✅ important
    background: "#fff",
    padding: "20px 20px", // slightly reduce side padding
    borderRadius: 26,
    textAlign: "center",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
    boxSizing: "border-box",
    overflow: "hidden",
    margin: "0 auto",
  },

  title: { fontSize: "clamp(18px, 2.5vw, 20px)", fontWeight: 600, marginBottom: 10 },
  subtitle: { fontSize: 15, color: "#555", marginTop: 10 },
  subtitle2: { fontSize: 16, fontWeight: 600, marginTop: 5 },
  emailLabel: { fontSize: 14, marginTop: 20, color: "#555", wordBreak: "break-word" },
  email: { fontWeight: 700, fontSize: 15 },
  otpRow: {
    display: "flex",
    justifyContent: "center",
    gap: 8,               // slightly reduced gap
    marginTop: 25,
    marginBottom: 15,
    flexWrap: "nowrap",   // ✅ force single row
    maxWidth: "100%",     // ✅ prevent overflow
    overflow: "hidden",
  },
  otpBox: {
    width: "clamp(34px, 9vw, 48px)",   // ✅ smaller minimum
    height: "clamp(34px, 9vw, 48px)",
    lineHeight: "clamp(34px, 9vw, 48px)",
    textAlign: "center",
    borderRadius: 12,
    border: "1px solid #dcdcdc",
    fontSize: 18,
    fontWeight: 600,
    outline: "none",
    padding: 0,
    boxSizing: "border-box",
    flexShrink: 1,        // ✅ allows shrinking instead of overflow
  },


  resendRow: { marginTop: 10, fontSize: 14, color: "#666" },
  resendActive: { color: "#7C3CFF", marginLeft: 5, cursor: "pointer", fontWeight: 600 },
  resendDisabled: { color: "#aaa", marginLeft: 5 },
  button: { marginTop: 25, width: "100%", padding: "16px", background: "#7C3CFF", borderRadius: 16, border: "none", fontSize: 17, color: "#fff", cursor: "pointer", fontWeight: 600 },
};