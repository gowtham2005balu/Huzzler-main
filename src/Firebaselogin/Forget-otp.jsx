// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function ForgotOtp() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email;
//   const uid = location.state?.uid;

//   if (!email || !uid) {
//     navigate("/forgot-password", { replace: true });
//     return null;
//   }


//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [inputFocused, setInputFocused] = useState(false);
//   const otpRef = useRef(null);
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     otpRef.current?.focus();
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, []);

//   const showMessage = (text, isError = true) => {
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     setMessage({ text, isError });
//     timeoutRef.current = setTimeout(() => setMessage(null), 4000);
//   };


//   const verifyOtp = async () => {
//     if (otp.length !== 6) {
//       alert("Please enter a valid 6-digit OTP");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(
//         "https://huzzler.onrender.com/api/auth/verify-otp",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, otp }),
//         }
//       );

//       const data = await res.json();
//       console.log("OTP verify:", data);

//       if (res.ok && data.success) {
    
//         navigate("/changepassword", { state: { uid } });
//       } else {
//         alert(data.message || "OTP verification failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resendOtp = async () => {
//     if (loading || resendLoading) return;
//     setResendLoading(true);
//     try {
//       const res = await fetch("https://huzzler.onrender.com/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const data = await res.json();
//       showMessage(data.message || "OTP resent!", false);
//     } catch (err) {
//       showMessage("Resend failed.", true);
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => e.key === "Enter" && otp.length === 6 && verifyOtp();

//   const shouldDisableSubmit = loading || otp.length !== 6;
//   const shouldDisableResend = loading || resendLoading;

//   return (
//     <div style={styles.page}>
//       <div style={styles.header}>
//         <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
//         <h3 style={styles.title}>Verify Email</h3>
//       </div>
//       <div style={styles.container}>
//         <p style={styles.email}>{email}</p>
//         {message && (
//           <div style={{ ...styles.message, ...(message.isError ? styles.errorMsg : styles.successMsg) }}>
//             {message.text}
//           </div>
//         )}
//         <input
//           ref={otpRef}
//           type="text"
//           maxLength={6}
//           value={otp}
//           onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//           onPaste={(e) => {
//             e.preventDefault();
//             setOtp(e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6));
//           }}
//           onKeyDown={handleKeyDown}
//           onFocus={() => setInputFocused(true)}
//           onBlur={() => setInputFocused(false)}
//           style={{
//             ...styles.otp,
//             borderColor: inputFocused ? "#f09aff" : "#ddd",
//             backgroundColor: inputFocused ? "#f9f3ff" : "#fafafa",
//           }}
//           placeholder="Enter 6-digit OTP"
//           disabled={loading}
//           autoComplete="one-time-code"
//         />
//         <p style={styles.resend}>
//           Didn’t receive?{" "}
//           <span onClick={resendOtp} style={{ color: shouldDisableResend ? "#ccc" : "#f09aff", cursor: shouldDisableResend ? "default" : "pointer" }}>
//             {resendLoading ? "Resending..." : "Resend OTP"}
//           </span>
//         </p>
//         <button
//           onClick={verifyOtp}
//           disabled={shouldDisableSubmit}
//           style={{ ...styles.button, ...(shouldDisableSubmit && styles.buttonDisabled) }}
//         >
//           {loading ? "Verifying..." : "Verify OTP"}
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = (() => {
//   const isMobile = window.innerWidth <= 480;

//   return {
//     page: {
//       minHeight: "100vh",
//       width: "100%",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: isMobile ? 16 : 40,
//       background: "#f9f5ff",
//       fontFamily: "Inter, sans-serif",
//     },

//     header: {
//       display: "flex",
//       alignItems: "center",
//       gap: 12,
//       width: "100%",
//       maxWidth: isMobile ? 340 : 400,
//       marginBottom: 16,
//     },

//     backBtn: {
//       fontSize: isMobile ? 18 : 20,
//       background: "none",
//       border: "none",
//       cursor: "pointer",
//       color: "#6b31ff",
//     },

//     title: {
//       fontSize: isMobile ? 22 : 28,
//       fontWeight: 700,
//       color: "#6b31ff",
//     },

//     container: {
//       width: "100%",
//       maxWidth: isMobile ? 340 : 400,
//       background: "#fff",
//       padding: isMobile ? 16 : 24,
//       borderRadius: 16,
//       boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       gap: 12,
//     },

//     email: {
//       fontSize: isMobile ? 14 : 16,
//       color: "#333",
//       marginBottom: 12,
//       textAlign: "center",
//     },

//     message: {
//       padding: 12,
//       borderRadius: 10,
//       marginBottom: 16,
//       fontSize: isMobile ? 12 : 14,
//       textAlign: "center",
//     },

//     successMsg: { background: "#d4edda", color: "#155724" },
//     errorMsg: { background: "#f8d7da", color: "#721c24" },

//     otp: {
//       width: "100%",
//       height: 48,
//       borderRadius: 12,
//       border: "1px solid #ddd",
//       padding: "0 16px",
//       fontSize: isMobile ? 16 : 18,
//       textAlign: "center",
//       outline: "none",
//       marginBottom: 12,
//     },

//     resend: {
//       fontSize: isMobile ? 12 : 14,
//       textAlign: "center",
//       marginBottom: 16,
//       color: "#666",
//     },

//     button: {
//       width: "100%",
//       height: 48,
//       borderRadius: 12,
//       border: "none",
//       background: "#e4abee",
//       color: "#000",
//       fontWeight: 600,
//       cursor: "pointer",
//       fontSize: isMobile ? 14 : 16,
//     },

//     buttonDisabled: {
//       opacity: 0.7,
//       cursor: "not-allowed",
//     },
//   };
// })();




// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function ForgotOtp() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email;
//   const uid = location.state?.uid;

//   if (!email || !uid) {
//     navigate("/forgot-password", { replace: true });
//     return null;
//   }

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);
//   const inputsRef = useRef([]);

//   useEffect(() => {
//     inputsRef.current[0]?.focus();
//   }, []);

//   const handleChange = (index, value) => {
//     if (!/^\d?$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     if (value && index < 5) {
//       inputsRef.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputsRef.current[index - 1].focus();
//     }
//   };

//   const otpValue = otp.join("");

//   const verifyOtp = async () => {
//     if (otpValue.length !== 6) return alert("Enter valid OTP");

//     setLoading(true);
//     try {
//       const res = await fetch("https://huzzler.onrender.com/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp: otpValue }),
//       });

//       const data = await res.json();
//       if (res.ok && data.success) {
//         navigate("/changepassword", { state: { uid } });
//       } else {
//         alert(data.message || "OTP failed");
//       }
//     } catch (e) {
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resendOtp = async () => {
//     if (resendLoading) return;
//     setResendLoading(true);
//     try {
//       await fetch("https://huzzler.onrender.com/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       alert("OTP Resent");
//     } catch {
//       alert("Resend failed");
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       {/* Header */}
// <div
//   style={{
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "26%",
//     padding: "0 92px",
//     marginTop:"100px",
//     marginLeft:"-220px"

//   }}
// >
//   <div
//     onClick={() => navigate(-1)}
//     style={{
//       cursor: "pointer",
//       fontWeight: "600",
//       // display: "flex",
//       // alignItems: "center",
//       gap: "6px",
//     }}
//   >
//     ← BACK
//   </div>

//   <div
//     style={{
//       fontWeight: "700",
//       fontSize: "24px",
//       color: "#7B4DFF",
//     }}
//   >
//     Huzzler
//   </div>
// </div>


//       {/* Card */}
//       <div style={styles.card}>
//         <h2 style={styles.heading}>Please verify your email</h2>
//         <p style={styles.sub}>
//           Enter the verification code sent to:
//           <br />
//           <b>{email}</b>
//         </p>

//         <div style={styles.otpRow}>
//           {otp.map((digit, i) => (
//             <input
//               key={i}
//               ref={(el) => (inputsRef.current[i] = el)}
//               style={styles.otpBox}
//               value={digit}
//               maxLength={1}
//               onChange={(e) => handleChange(i, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(i, e)}
//             />
//           ))}
//         </div>

//         <div style={styles.resend}>
//           Didn’t receive OTP?{" "}
//           <span onClick={resendOtp} style={styles.resendLink}>
//             {resendLoading ? "Sending..." : "Resend OTP"}
//           </span>
//         </div>

//         <button
//           style={styles.button}
//           onClick={verifyOtp}
//           disabled={loading}
//         >
//           {loading ? "Verifying..." : "Get Started"}
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ======================= STYLES ======================= */

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(135deg,#fff7e8,#efe8ff)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "Inter, sans-serif",
//   },

// logo: {
//   color: "#7a3cff",
//   fontSize: 18,
//   fontWeight: 700,
//   marginRight: "10px",     // push little from right edge
// },


//  back: {
//   fontSize: 14,
//   cursor: "pointer",
//   color: "#333",
//   // marginLeft:ismobile?"-180px":"20px",     
// },

//   logo: {
//     color: "#7a3cff",
//     fontSize: 18,
//     fontWeight: 700,
//   },

//   card: {
//     background: "#fff",
//     width: 420,
//     maxWidth: "90%",
//     marginTop: 60,
//     padding: 32,
//     borderRadius: 20,
//     boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
//     textAlign: "center",
//   },

//   heading: {
//     fontSize: 22,
//     fontWeight: 600,
//     marginBottom: 12,
//   },

//   sub: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 24,
//   },

// otpRow: {
//   display: "flex",
//   justifyContent: "center",   // 👈 center horizontally
//   alignItems: "center",
//   gap: "12px",
//   marginBottom: 10,
// },


//   otpBox: {
//     width: 48,
//     height: 48,
//     borderRadius: 10,
//     border: "1px solid #ddd",
//     textAlign: "center",
//     fontSize: 18,
//     outline: "none",
//   },

//   resend: {
//     fontSize: 13,
//     color: "#777",
//     marginBottom: 24,
//   },

//   resendLink: {
//     color: "#7a3cff",
//     cursor: "pointer",
//     fontWeight: 500,
//   },

//   button: {
//     width: "100%",
//     height: 48,
//     background: "#7a3cff",
//     border: "none",
//     borderRadius: 12,
//     color: "#fff",
//     fontWeight: 600,
//     cursor: "pointer",
//     fontSize: 15,
//   },
// };



import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backarrow from "../assets/backarrow.png";
export default function ForgotOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const uid = location.state?.uid;

  if (!email || !uid) {
    navigate("/forgot-password", { replace: true });
    return null;
  }

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

 const handleKeyDown = (index, e) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    inputsRef.current[index - 1]?.focus();
  }

  if (e.key === "Enter") {
    e.preventDefault();
    verifyOtp(); // 👈 trigger button
  }
};


  const verifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      alert("Enter valid OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpValue }),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        navigate("/changepassword", { state: { uid } });
      } else {
        alert(data.message || "OTP failed");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendLoading) return;
    setResendLoading(true);

    try {
      await fetch("https://huzzler.onrender.com/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      alert("OTP Resent");
    } catch {
      alert("Resend failed");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
    <div style={styles.back} onClick={() => navigate(-1)}>
      <img src={backarrow} alt="arrow" width={18}  />Back
    </div>
  </div>

  <div style={styles.topLogo}>Huzzler</div>

  <div style={styles.card}>
    <h2 style={styles.heading}>Please verify your email</h2>
    <p style={styles.sub}>
      Enter the verification code sent to:
      <br />
      <b>{email}</b>
    </p>
        <div style={styles.otpRow}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              style={styles.otpBox}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>

        <div style={styles.resend}>
          Didn’t receive OTP?{" "}
          <span style={styles.resendLink} onClick={resendOtp}>
            {resendLoading ? "Sending..." : "Resend OTP"}
          </span>
        </div>

        <button
          style={styles.button}
          onClick={verifyOtp}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Get Started"}
        </button>
      </div>
    </div>
  );
}

/* ======================= STYLES ======================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#fff7e8,#efe8ff)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
    paddingTop: 110,  
  },

  header: {
    width: "100%",
    maxWidth: 420,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    marginTop: 40,
  },

back: {
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
  display: "flex",
  alignItems: "center",   // 👈 vertical alignment
  gap: 6,                 // 👈 space between arrow and text
},


  logo: {
    fontWeight: 700,
    fontSize: 22,
    color: "#7B4DFF",
    textAlign:"center",
  },
topLogo: {
  marginTop: 10,
  marginBottom: -18,     // 👈 pulls card upward
  fontSize: 26,
  fontWeight: 700,
  color: "#7B4DFF",
  textAlign: "center",
},

 card: {
  width: "100%",
  maxWidth: 420,
  background: "#fff",
  padding: 24,
  paddingTop: 32,
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  textAlign: "center",
  marginTop: 24,
},


  heading: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 12,
  },

  sub: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },

  otpRow: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },

  otpBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 18,
    color: "#000",
    backgroundColor: "#fff",
    caretColor: "#7a3cff",
    outline: "none",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    padding: 0,
    textAlign: "center",

    WebkitAppearance: "none",
    MozAppearance: "textfield",
  },

  resend: {
    fontSize: 13,
    color: "#777",
    marginBottom: 24,
  },

  resendLink: {
    color: "#7a3cff",
    cursor: "pointer",
    fontWeight: 500,
  },

  button: {
    width: "100%",
    height: 48,
    background: "#7a3cff",
    border: "none",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 15,
  },
};