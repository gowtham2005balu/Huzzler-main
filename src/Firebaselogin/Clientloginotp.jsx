// // 



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { signInWithCustomToken } from "firebase/auth";
// import { auth, db } from "../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function OtpVerify() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
//   const stateData = location.state || {};
//   const email = stateData.email || localData.email;

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timer, setTimer] = useState(30);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   useEffect(() => {
//     if (!email) {
//       alert("Signup data missing. Please start again.");
//       navigate("/signup-client");
//     }
//   }, [email, navigate]);

//   useEffect(() => {
//     if (timer === 0) return setIsResendDisabled(false);
//     const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timer]);

//   const handleOtpChange = (value, index) => {
//     if (isNaN(value)) return;
//     const temp = [...otp];
//     temp[index] = value;
//     setOtp(temp);
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const verifyOtp = async () => {
//     const code = otp.join("");
//     if (code.length !== 6) return alert("Enter valid 6-digit OTP");

//     try {
//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/verify-otp",
//         { email: email.toLowerCase(), otp: code }
//       );

//       if (!res.data?.token) return alert("Invalid OTP");

//       const userCred = await signInWithCustomToken(auth, res.data.token);
//       const uid = userCred.user.uid;

//       const snap = await getDoc(doc(db, "users", uid));
//       if (!snap.exists()) return alert("User data not found!");

//       const role = snap.data().role;
//       localStorage.removeItem("otpUser");

//       if (role === "client")
//         navigate("/client-dashbroad2/clientserachbar");
//       else if (role === "freelancer")
//         navigate("/freelance-dashboard");
//       else alert("Unknown role");
//     } catch (err) {
//       alert("OTP verification failed");
//       console.error(err);
//     }
//   };

//   const resendOtp = async () => {
//     try {
//       setIsResendDisabled(true);
//       setTimer(30);
//       await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
//         email: email.toLowerCase(),
//         action: "resend",
//       });
//       alert("OTP resent!");
//     } catch {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//     <div
//       className="otp-wrapper"
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background:
//           "linear-gradient(to bottom left, #f7f4ff, #fff, #fffde9, #fffce6)",
//         padding: 20,
//       }}
//     >
//       {/* BACK */}
//       <div
//         className="otp-back"
//         onClick={() => navigate(-1)}
//         style={{
//           position: "absolute",
//           top: 100,
//           left: 490,
//           cursor: "pointer",
//           color: "#444",
//           fontWeight: 600,
//         }}
//       >
//         ← BACK
//       </div>

//       {/* CARD */}
//       <div
//         className="otp-card"
//         style={{
//           width: "460px",
//           padding: "40px",
//           borderRadius: 20,
//           background: "#ffffff",
//           boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
//           textAlign: "center",
//         }}
//       >
//         <h2 style={{ fontSize: 22, fontWeight: 600 }}>
//           You're almost there! We just need to verify your email
//         </h2>

//         <p style={{ fontSize: 16, color: "#777", marginTop: 10 }}>
//           Great! Almost done!
//         </p>

//         <h3 style={{ fontWeight: 600, fontSize: 20, marginTop: 10 }}>
//           Please verify your email
//         </h3>

//         <p style={{ fontSize: 15, color: "#777", marginTop: 20 }}>
//           Enter the verification code sent to:
//         </p>

//         <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>
//           {email}
//         </p>

//         {/* OTP INPUTS */}
//         <div className="otp-inputs">
//           {otp.map((val, i) => (
//             <input
//               key={i}
//               id={`otp-${i}`}
//               maxLength="1"
//               inputMode="numeric"
//               value={val}
//               onChange={(e) => handleOtpChange(e.target.value, i)}
//               style={{
//                 width: "100%",
//                 height: 48,
//                 borderRadius: 10,
//                 border: "2px solid #e5e6eb",

//                 fontSize: 16,          // 🔥 prevents zoom
//                 fontWeight: 600,
//                 lineHeight: "48px",    // 🔥 vertical centering
//                 padding: 0,

//                 textAlign: "center",
//                 boxSizing: "border-box",
//                 flex: 1,
//                 minWidth: 0,
//               }}
//             />
//           ))}
//         </div>

//         <p style={{ fontSize: 14, color: "#666", marginTop: 20 }}>
//           Didn't receive OTP?{" "}
//           {isResendDisabled ? (
//             <span style={{ color: "#999" }}>Resend in {timer}s</span>
//           ) : (
//             <span
//               onClick={resendOtp}
//               style={{ color: "#7A4DFF", cursor: "pointer", fontWeight: 600 }}
//             >
//               Resend OTP
//             </span>
//           )}
//         </p>

//         <button
//           onClick={verifyOtp}
//           style={{
//             marginTop: 25,
//             width: "100%",
//             padding: "14px",
//             background: "#7A4DFF",
//             color: "#fff",
//             border: "none",
//             borderRadius: 12,
//             fontSize: 17,
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           Get Started
//         </button>
//       </div>

//       {/* RESPONSIVE + FIXES */}
//       <style>{`
//         input {
//           -webkit-appearance: none;
//           appearance: none;
//         }

//         .otp-inputs {
//           display: flex;
//           justify-content: center;
//           gap: 12px;
//           margin-top: 10px;
//         }

//         @media (max-width: 1024px) {
//           .otp-back {
//             left: 24px !important;
//             top: 24px !important;
//           }
//         }

//         @media (max-width: 768px) {
//           .otp-wrapper {
//             align-items: flex-start !important;
//             padding-top: 70px !important;
//           }

//           .otp-back {
//             position: fixed !important;
//             top: 20px !important;
//             left: 16px !important;
//             z-index: 1000;
//             font-size: 15px;
//           }

//           .otp-card {
//             width: 100% !important;
//             max-width: 420px !important;
//             padding: 32px 24px !important;
//           }

//           .otp-inputs {
//             width: 100%;
//             gap: 8px;
//           }

//           .otp-inputs input {
//             height: 48px;
//             font-size: 16px;
//             line-height: 48px;
//             padding: 0 !important;
//           }
//         }

//         @media (max-width: 480px) {
//           .otp-card {
//             padding: 28px 18px !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { signInWithCustomToken } from "firebase/auth";
// import { auth, db } from "../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate, useLocation } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

// export default function OtpVerify() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
//   const stateData = location.state || {};
//   const email = stateData.email || localData.email;

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timer, setTimer] = useState(30);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   // Disable page scroll
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     document.documentElement.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//       document.documentElement.style.overflow = "";
//     };
//   }, []);

//   useEffect(() => {
//     if (!email) {
//       alert("Signup data missing. Please start again.");
//       navigate("/signup-client");
//     }
//   }, [email, navigate]);

//   useEffect(() => {
//     if (timer === 0) return setIsResendDisabled(false);
//     const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timer]);

//   const handleOtpChange = (value, index) => {
//     if (isNaN(value)) return;
//     const temp = [...otp];
//     temp[index] = value;
//     setOtp(temp);
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleOtpKeyDown = (e, index) => {
//     if (e.key === "Backspace") {
//       e.preventDefault();
//       const temp = [...otp];
//       if (temp[index] !== "") {
//         temp[index] = "";
//         setOtp(temp);
//       } else if (index > 0) {
//         document.getElementById(`otp-${index - 1}`)?.focus();
//         const tempPrev = [...otp];
//         tempPrev[index - 1] = "";
//         setOtp(tempPrev);
//       }
//     }
//   };

//   const verifyOtp = async () => {
//     const code = otp.join("");
//     if (code.length !== 6) return alert("Enter valid 6-digit OTP");

//     try {
//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/verify-otp",
//         { email: email.toLowerCase(), otp: code }
//       );

//       if (!res.data?.token) return alert("Invalid OTP");

//       const userCred = await signInWithCustomToken(auth, res.data.token);
//       const uid = userCred.user.uid;

//       const snap = await getDoc(doc(db, "users", uid));
//       if (!snap.exists()) return alert("User data not found!");

//       const role = snap.data().role;
//       localStorage.removeItem("otpUser");

//       if (role === "client")
//         navigate("/client-dashbroad2/clientserachbar");
//       else if (role === "freelancer")
//         navigate("/freelance-dashboard");
//       else alert("Unknown role");
//     } catch (err) {
//       alert("OTP verification failed");
//       console.error(err);
//     }
//   };

//   const resendOtp = async () => {
//     try {
//       setIsResendDisabled(true);
//       setTimer(30);
//       await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
//         email: email.toLowerCase(),
//         action: "resend",
//       });
//       alert("OTP resent!");
//     } catch {
//       alert("Failed to resend OTP");
//     }
//   };

//   return (
//     <div
//       className="otp-wrapper"
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background:
//           "linear-gradient(to bottom left, #f7f4ff, #fff, #fffde9, #fffce6)",
//         padding: 20,
//         overflow: "hidden",
//         position: "relative",
//       }}
//     >
//       {/* CARD */}
//       <div
//         className="otp-card"
//         style={{
//           width: "460px",
//           padding: "40px",
//           borderRadius: 20,
//           background: "#ffffff",
//           boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
//           textAlign: "center",
//           position: "relative",
//         }}
//       >
//         {/* BACK ARROW ON TOP OF CARD */}
//         <div
//           className="otp-back"
//           onClick={() => navigate(-1)}
//           style={{
//             position: "absolute",
//             top:-30,
            
//             left: 20,
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             fontWeight: 600,
//             fontSize: 16,
//             color: "#444",
//           }}
//         >
//           <ArrowLeft size={20} />
//           Back
//         </div>

//         <h2 style={{ fontSize: 22, fontWeight: 600 }}>
//           You're almost there! We just need to verify your email
//         </h2>

//         <p style={{ fontSize: 16, color: "#777", marginTop: 10 }}>
//           Great! Almost done!
//         </p>

//         <h3 style={{ fontWeight: 600, fontSize: 20, marginTop: 10 }}>
//           Please verify your email
//         </h3>

//         <p style={{ fontSize: 15, color: "#777", marginTop: 20 }}>
//           Enter the verification code sent to:
//         </p>

//         <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>
//           {email}
//         </p>

//         {/* OTP INPUTS */}
//         <div className="otp-inputs">
//           {otp.map((val, i) => (
//             <input
//               key={i}
//               id={`otp-${i}`}
//               maxLength="1"
//               inputMode="numeric"
//               value={val}
//               onChange={(e) => handleOtpChange(e.target.value, i)}
//               onKeyDown={(e) => handleOtpKeyDown(e, i)}
//               style={{
//                 width: "100%",
//                 height: 48,
//                 borderRadius: 10,
//                 border: "2px solid #e5e6eb",
//                 fontSize: 16,
//                 fontWeight: 600,
//                 lineHeight: "48px",
//                 padding: 0,
//                 textAlign: "center",
//                 boxSizing: "border-box",
//                 flex: 1,
//                 minWidth: 0,
//               }}
//             />
//           ))}
//         </div>

//         <p style={{ fontSize: 14, color: "#666", marginTop: 20 }}>
//           Didn't receive OTP?{" "}
//           {isResendDisabled ? (
//             <span style={{ color: "#999" }}>Resend in {timer}s</span>
//           ) : (
//             <span
//               onClick={resendOtp}
//               style={{ color: "#7A4DFF", cursor: "pointer", fontWeight: 600 }}
//             >
//               Resend OTP
//             </span>
//           )}
//         </p>

//         <button
//           onClick={verifyOtp}
//           style={{
//             marginTop: 25,
//             width: "100%",
//             padding: "14px",
//             background: "#7A4DFF",
//             color: "#fff",
//             border: "none",
//             borderRadius: 12,
//             fontSize: 17,
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           Get Started
//         </button>
//       </div>

//       {/* STYLES */}
//       <style>{`
//         input {
//           -webkit-appearance: none;
//           appearance: none;
//         }

//         .otp-inputs {
//           display: flex;
//           justify-content: center;
//           gap: 12px;
//           margin-top: 10px;
//         }

//         @media (max-width: 768px) {
//           .otp-wrapper {
//             align-items: flex-start !important;
//             padding-top: 150px !important;
//           }

//           .otp-card {
//             width: 100% !important;
//             max-width: 420px !important;
//             padding: 32px 24px !important;
//           }

//           .otp-inputs {
//             width: 100%;
//             gap: 8px;
//           }

//           .otp-inputs input {
//             height: 48px;
//             font-size: 16px;
//             line-height: 48px;
//             padding: 0 !important;
//           }

//           .otp-back {
//             position: fixed !important;
//             top: 100px !important;
//             left: 16px !important;
//             z-index: 1000;
//             font-size: 15px;
//           }
//         }

//         @media (max-width: 480px) {
//           .otp-card {
//             padding: 28px 18px !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { signInWithCustomToken } from "firebase/auth";
// import { auth, db } from "../firbase/Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate, useLocation } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

// export default function OtpVerify() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
//   const stateData = location.state || {};
//   const email = stateData.email || localData.email;

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timer, setTimer] = useState(30);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   // Disable page scroll
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     document.documentElement.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//       document.documentElement.style.overflow = "";
//     };
//   }, []);

//   useEffect(() => {
//     if (!email) {
//       alert("Signup data missing. Please start again.");
//       navigate("/signup-client");
//     }
//   }, [email, navigate]);

//   useEffect(() => {
//     if (timer === 0) return setIsResendDisabled(false);
//     const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timer]);

//   const handleOtpChange = (value, index) => {
//     if (isNaN(value)) return;
//     const temp = [...otp];
//     temp[index] = value;
//     setOtp(temp);
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleOtpKeyDown = (e, index) => {
//     if (e.key === "Backspace") {
//       e.preventDefault();
//       const temp = [...otp];
//       if (temp[index] !== "") {
//         temp[index] = "";
//         setOtp(temp);
//       } else if (index > 0) {
//         document.getElementById(`otp-${index - 1}`)?.focus();
//         const tempPrev = [...otp];
//         tempPrev[index - 1] = "";
//         setOtp(tempPrev);
//       }
//     }
//   };

//   const verifyOtp = async () => {
//     const code = otp.join("");
//     if (code.length !== 6) return alert("Enter valid 6-digit OTP");

//     try {
//       const res = await axios.post(
//         "https://huzzler.onrender.com/api/auth/verify-otp",
//         { email: email.toLowerCase(), otp: code }
//       );

//       if (!res.data?.token) return alert("Invalid OTP");

//       const userCred = await signInWithCustomToken(auth, res.data.token);
//       const uid = userCred.user.uid;

//       const snap = await getDoc(doc(db, "users", uid));
//       if (!snap.exists()) return alert("User data not found!");

//       const role = snap.data().role;
//       localStorage.removeItem("otpUser");

//       if (role === "client")
//         navigate("/client-dashbroad2/clientserachbar");
//       else if (role === "freelancer")
//         navigate("/freelance-dashboard");
//       else alert("Unknown role");
//     } catch (err) {
//       alert("OTP verification failed");
//       console.error(err);
//     }
//   };

//   const resendOtp = async () => {
//     try {
//       setIsResendDisabled(true);
//       setTimer(30);
//       await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
//         email: email.toLowerCase(),
//         action: "resend",
//       });
//       alert("OTP resent!");
//     } catch {
//       alert("Failed to resend OTP");
//     }
//   };
//   const handleSubmit = (e) => {
//   e.preventDefault();   // prevent page refresh
//   verifyOtp();          // same as clicking Get Started
// };


//   return (
//     <div
//       className="otp-wrapper"
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background:
//           "linear-gradient(to bottom left, #f7f4ff, #fff, #fffde9, #fffce6)",
//         padding: 20,
//         overflow: "hidden",
//         position: "relative",
//       }}
//     >
//       {/* CARD */}
//       <div
//         className="otp-card"
//         style={{
//           width: "460px",
//           padding: "40px",
//           borderRadius: 20,
//           background: "#ffffff",
//           boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
//           textAlign: "center",
//           position: "relative",
//         }}
//       >
//         {/* BACK ARROW ON TOP OF CARD */}
//         <div
//           className="otp-back"
//           onClick={() => navigate(-1)}
//           style={{
//             position: "absolute",
//             top:-30,
            
//             left: 20,
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             fontWeight: 600,
//             fontSize: 16,
//             color: "#444",
//           }}
//         >
//           <ArrowLeft size={20} />
//           Back
//         </div>

//         <h2 style={{ fontSize: 22, fontWeight: 600 }}>
//           You're almost there! We just need to verify your email
//         </h2>

//         <p style={{ fontSize: 16, color: "#777", marginTop: 10 }}>
//           Great! Almost done!
//         </p>

//         <h3 style={{ fontWeight: 600, fontSize: 20, marginTop: 10 }}>
//           Please verify your email
//         </h3>

//         <p style={{ fontSize: 15, color: "#777", marginTop: 20 }}>
//           Enter the verification code sent to:
//         </p>

//         <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>
//           {email}
//         </p>
// <form onSubmit={handleSubmit}>
//         {/* OTP INPUTS */}
//         <div className="otp-inputs">
//           {otp.map((val, i) => (
//             <input
//               key={i}
//               id={`otp-${i}`}
//               maxLength="1"
//               inputMode="numeric"
//               value={val}
//               onChange={(e) => handleOtpChange(e.target.value, i)}
//               onKeyDown={(e) => handleOtpKeyDown(e, i)}
//               style={{
//                 width: "100%",
//                 height: 48,
//                 borderRadius: 10,
//                 border: "2px solid #e5e6eb",
//                 fontSize: 16,
//                 fontWeight: 600,
//                 lineHeight: "48px",
//                 padding: 0,
//                 textAlign: "center",
//                 boxSizing: "border-box",
//                 flex: 1,
//                 minWidth: 0,
//               }}
//             />
//           ))}
//         </div>

//         <p style={{ fontSize: 14, color: "#666", marginTop: 20 }}>
//           Didn't receive OTP?{" "}
//           {isResendDisabled ? (
//             <span style={{ color: "#999" }}>Resend in {timer}s</span>
//           ) : (
//             <span
//               onClick={resendOtp}
//               style={{ color: "#7A4DFF", cursor: "pointer", fontWeight: 600 }}
//             >
//               Resend OTP
//             </span>
//           )}
//         </p>

//         <button
//           onClick={verifyOtp}
//           style={{
//             marginTop: 25,
//             width: "100%",
//             padding: "14px",
//             background: "#7A4DFF",
//             color: "#fff",
//             border: "none",
//             borderRadius: 12,
//             fontSize: 17,
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           Get Started
//         </button>
//         </form>
//       </div>

//       {/* STYLES */}
//       <style>{`
//         input {
//           -webkit-appearance: none;
//           appearance: none;
//         }

//         .otp-inputs {
//           display: flex;
//           justify-content: center;
//           gap: 12px;
//           margin-top: 10px;
//         }

//         @media (max-width: 768px) {
//           .otp-wrapper {
//             align-items: flex-start !important;
//             padding-top: 150px !important;
//           }

//           .otp-card {
//             width: 100% !important;
//             max-width: 420px !important;
//             padding: 32px 24px !important;
//           }

//           .otp-inputs {
//             width: 100%;
//             gap: 8px;
//           }

//           .otp-inputs input {
//             height: 48px;
//             font-size: 16px;
//             line-height: 48px;
//             padding: 0 !important;
//           }

//           .otp-back {
//             position: fixed !important;
//             top: 100px !important;
//             left: 16px !important;
//             z-index: 1000;
//             font-size: 15px;
//           }
//         }

//         @media (max-width: 480px) {
//           .otp-card {
//             padding: 28px 18px !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { auth, db } from "../firbase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
  const stateData = location.state || {};
  const email = stateData.email || localData.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // NEW: Loading state
  const [error, setError] = useState(""); // NEW: Error state

  // Disable page scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!email) {
      alert("Signup data missing. Please start again.");
      navigate("/signup-client");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer === 0) return setIsResendDisabled(false);
    const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const temp = [...otp];
    temp[index] = value;
    setOtp(temp);
    setError(""); // Clear error when typing
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const temp = [...otp];
      if (temp[index] !== "") {
        temp[index] = "";
        setOtp(temp);
      } else if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
        const tempPrev = [...otp];
        tempPrev[index - 1] = "";
        setOtp(tempPrev);
      }
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    // Prevent double submission
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      console.log("Sending OTP verification for:", email.toLowerCase());
      
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        { email: email.toLowerCase(), otp: code }
      );

      console.log("API Response:", res.data);

      if (!res.data?.token) {
        setError("Invalid OTP. Please try again.");
        setIsLoading(false);
        return;
      }

      // Sign in with Firebase
      const userCred = await signInWithCustomToken(auth, res.data.token);
      const uid = userCred.user.uid;

      console.log("Firebase sign in successful, UID:", uid);

      // Get user data from Firestore
      const snap = await getDoc(doc(db, "users", uid));
      
      if (!snap.exists()) {
        setError("User data not found. Please contact support.");
        setIsLoading(false);
        return;
      }

      const userData = snap.data();
      const role = userData.role;
      
      console.log("User role:", role);

      // Clear stored data
      localStorage.removeItem("otpUser");

      // Navigate based on role
      if (role === "client") {
        navigate("/client-dashbroad2/clientserachbar");
      } else if (role === "freelancer") {
        navigate("/freelance-dashboard");
      } else {
        setError("Unknown user role. Please contact support.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Verification error:", err);
      
      // Extract meaningful error message
      let errorMessage = "OTP verification failed. Please try again.";
      
      if (err.response) {
        // Server responded with error
        console.log("Error response:", err.response.data);
        errorMessage = err.response.data?.message || 
                       err.response.data?.error || 
                       `Server error: ${err.response.status}`;
      } else if (err.code) {
        // Firebase error
        console.log("Firebase error code:", err.code);
        if (err.code === "auth/invalid-custom-token") {
          errorMessage = "Invalid authentication token. Please request a new OTP.";
        } else if (err.code === "auth/network-request-failed") {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = `Authentication error: ${err.code}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (isLoading) return;
    
    try {
      setIsResendDisabled(true);
      setTimer(30);
      setError("");
      
      await axios.post("https://huzzler.onrender.com/api/auth/resend-otp", {
        email: email.toLowerCase(),
        action: "resend",
      });
      
      // Clear OTP inputs
      setOtp(["", "", "", "", "", ""]);
      alert("OTP resent successfully!");
    } catch (err) {
      console.error("Resend error:", err);
      setError("Failed to resend OTP. Please try again.");
      setIsResendDisabled(false);
    }
  };

  // FIXED: Single submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOtp();
  };

  return (
    <div
      className="otp-wrapper"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(to bottom left, #f7f4ff, #fff, #fffde9, #fffce6)",
        padding: 20,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* CARD */}
      <div
        className="otp-card"
        style={{
          width: "460px",
          padding: "40px",
          borderRadius: 20,
          background: "#ffffff",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* BACK ARROW */}
        <div
          className="otp-back"
          onClick={() => !isLoading && navigate(-1)}
          style={{
            position: "absolute",
            top: -30,
            left: 20,
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 600,
            fontSize: 16,
            color: isLoading ? "#999" : "#444",
          }}
        >
          <ArrowLeft size={20} />
          Back
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 600 }}>
          You're almost there! We just need to verify your email
        </h2>

        <p style={{ fontSize: 16, color: "#777", marginTop: 10 }}>
          Great! Almost done!
        </p>

        <h3 style={{ fontWeight: 600, fontSize: 20, marginTop: 10 }}>
          Please verify your email
        </h3>

        <p style={{ fontSize: 15, color: "#777", marginTop: 20 }}>
          Enter the verification code sent to:
        </p>

        <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>
          {email}
        </p>

        <form onSubmit={handleSubmit}>
          {/* OTP INPUTS */}
          <div className="otp-inputs">
            {otp.map((val, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                maxLength="1"
                inputMode="numeric"
                value={val}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => handleOtpKeyDown(e, i)}
                disabled={isLoading}
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 10,
                  border: error ? "2px solid #F44336" : "2px solid #e5e6eb",
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: "48px",
                  padding: 0,
                  textAlign: "center",
                  boxSizing: "border-box",
                  flex: 1,
                  minWidth: 0,
                  opacity: isLoading ? 0.6 : 1,
                  transition: "border-color 0.2s ease",
                }}
              />
            ))}
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p
              style={{
                color: "#F44336",
                fontSize: 14,
                marginTop: 12,
                padding: "8px 12px",
                background: "#ffebee",
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <p style={{ fontSize: 14, color: "#666", marginTop: 20 }}>
            Didn't receive OTP?{" "}
            {isResendDisabled ? (
              <span style={{ color: "#999" }}>Resend in {timer}s</span>
            ) : (
              <span
                onClick={resendOtp}
                style={{
                  color: isLoading ? "#999" : "#7A4DFF",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                }}
              >
                Resend OTP
              </span>
            )}
          </p>

          {/* FIXED: Changed to type="submit" and removed onClick */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: 25,
              width: "100%",
              padding: "14px",
              background: isLoading ? "#b39dff" : "#7A4DFF",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 17,
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "background 0.2s ease",
            }}
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    border: "3px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Verifying...
              </>
            ) : (
              "Get Started"
            )}
          </button>
        </form>
      </div>

 
      <style>{`
        input {
          -webkit-appearance: none;
          appearance: none;
        }

        input:focus {
          outline: none;
          border-color: #7A4DFF !important;
        }

        .otp-inputs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .otp-wrapper {
            align-items: flex-start !important;
            padding-top: 150px !important;
          }

          .otp-card {
            width: 100% !important;
            max-width: 420px !important;
            padding: 32px 24px !important;
          }

          .otp-inputs {
            width: 100%;
            gap: 8px;
          }

          .otp-inputs input {
            height: 48px;
            font-size: 16px;
            line-height: 48px;
            padding: 0 !important;
          }

          .otp-back {
            position: fixed !important;
            top: 100px !important;
            left: 16px !important;
            z-index: 1000;
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .otp-card {
            padding: 28px 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
