// import React, { useState, useEffect } from "react";
// import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function ChangePassword() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { uid } = location.state || {};

//   // Redirect if no uid
//   useEffect(() => {
//     if (!uid) {
//       navigate("/firelogin", { replace: true });
//     }
//   }, [uid, navigate]);

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const encodePassword = (pw) => btoa(unescape(encodeURIComponent(pw)));

//   const showMessage = (text, isError = true) => {
//     setMessage({ text, isError });
//     setTimeout(() => setMessage(null), 4000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (newPassword.length < 6) return showMessage("Password must be 6+ characters", true);
//     if (newPassword !== confirmPassword) return showMessage("Passwords don't match", true);

//     setLoading(true);
//     try {
//       await updateDoc(doc(db, "users", uid), {
//         password: encodePassword(newPassword.trim()),
//         updated_at: serverTimestamp(),
//       });
//       showMessage("Password updated! Redirecting to login...", false);
//       setTimeout(() => navigate("/firelogin", { replace: true }), 1500);
//     } catch (err) {
//       console.error(err);
//       showMessage("Update failed. Try again.", true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.appBar}>
//         <button onClick={() => navigate(-1)} style={styles.backBtn}>←</button>
//         <h3 style={styles.title}>New Password</h3>
//       </div>
//       {message && (
//         <div style={{ ...styles.message, ...(message.isError ? styles.errorMsg : styles.successMsg) }}>
//           {message.text}
//         </div>
//       )}
//       <form style={styles.form} onSubmit={handleSubmit}>
//         <p style={styles.desc}>Must be 6+ characters with letters, numbers & symbols.</p>
//         <div style={styles.inputWrapper}>
//           <input
//             type={showNew ? "text" : "password"}
//             placeholder="New password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             style={styles.input}
//           />
//           <span onClick={() => setShowNew(!showNew)} style={styles.eye}>{showNew ? "🙈" : "👁️"}</span>
//         </div>
//         <div style={styles.inputWrapper}>
//           <input
//             type={showConfirm ? "text" : "password"}
//             placeholder="Confirm password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             style={styles.input}
//           />
//           <span onClick={() => setShowConfirm(!showConfirm)} style={styles.eye}>{showConfirm ? "🙈" : "👁️"}</span>
//         </div>
//         <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
//           {loading ? "Updating..." : "Update Password"}
//         </button>
//       </form>
//     </div>
//   );
// }

// // Responsive styles
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

//     appBar: {
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

//     message: {
//       padding: 12,
//       borderRadius: 10,
//       marginBottom: 16,
//       fontSize: isMobile ? 12 : 14,
//       textAlign: "center",
//     },

//     successMsg: { background: "#d4edda", color: "#155724" },
//     errorMsg: { background: "#f8d7da", color: "#721c24" },

//     form: {
//       display: "flex",
//       flexDirection: "column",
//       gap: 12,
//       width: "100%",
//       maxWidth: isMobile ? 340 : 400,
//       background: "#fff",
//       padding: isMobile ? 16 : 24,
//       borderRadius: 16,
//       boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
//     },

//     desc: {
//       fontSize: isMobile ? 12 : 14,
//       color: "#6f6f6f",
//       marginBottom: 8,
//     },

//     inputWrapper: {
//       position: "relative",
//       display: "flex",
//       alignItems: "center",
//       width: "100%",
//     },

//     input: {
//       flex: 1,
//       height: 48,
//       borderRadius: 12,
//       border: "1px solid #ddd",
//       padding: "0 40px 0 16px",
//       fontSize: isMobile ? 14 : 16,
//       outline: "none",
//     },

//     eye: {
//       position: "absolute",
//       right: 12,
//       cursor: "pointer",
//       fontSize: isMobile ? 16 : 18,
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
//       marginTop: 12,
//     },
//   };
// })();



// import React, { useState, useEffect } from "react";
// import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "../firbase/Firebase";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function ChangePassword() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { uid } = location.state || {};

//   useEffect(() => {
//     if (!uid) navigate("/firelogin", { replace: true });
//   }, [uid, navigate]);

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const encodePassword = (pw) => btoa(unescape(encodeURIComponent(pw)));

//   const showMessage = (text, isError = true) => {
//     setMessage({ text, isError });
//     setTimeout(() => setMessage(null), 4000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (newPassword.length < 6)
//       return showMessage("Password must be 6+ characters", true);
//     if (newPassword !== confirmPassword)
//       return showMessage("Passwords don't match", true);

//     setLoading(true);
//     try {
//       await updateDoc(doc(db, "users", uid), {
//         password: encodePassword(newPassword.trim()),
//         updated_at: serverTimestamp(),
//       });
//       showMessage("Password updated! Redirecting...", false);
//       setTimeout(() => navigate("/firelogin", { replace: true }), 1500);
//     } catch {
//       showMessage("Update failed. Try again.", true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
// {/* HEADER */}
// <div
//   style={{
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     maxWidth: "900px",
//     padding: window.innerWidth <= 480 ? "0 20px" : "0 92px",
//     marginTop: window.innerWidth <= 480 ? "40px" : "100px",
//   }}
// >
//   {/* BACK */}
//   <div
//     onClick={() => navigate(-1)}
//     style={{
//       cursor: "pointer",
//       fontWeight: "600",
//       fontSize: window.innerWidth <= 480 ? "14px" : "16px",
//     }}
//   >
//     ← BACK
//   </div>

//   {/* LOGO */}
//   <div
//     style={{
//       fontWeight: "700",
//       fontSize: window.innerWidth <= 480 ? "20px" : "24px",
//       color: "#7B4DFF",
//   }}
//   >
//     Huzzler
//   </div>
// </div>


//       {/* CARD */}
//       <div style={styles.card}>
//         <h2 style={styles.heading}>Create a strong password</h2>
//         <p style={styles.sub}>
//           Your password must be at least 6 character and <br />
//           should include a combination of numbers, letter <br />
//           and special characters(!$@%).
//         </p>

//         {message && (
//           <div
//             style={{
//               ...styles.msg,
//               background: message.isError ? "#ffe2e2" : "#e2ffe9",
//               color: message.isError ? "#b00020" : "#006b2e",
//             }}
//           >
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div style={styles.inputWrap}>
//             <input
//               type={showNew ? "text" : "password"}
//               placeholder="New password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               style={styles.input}
//             />
//             <span
//               style={styles.eye}
//               onClick={() => setShowNew(!showNew)}
//             >
//               {showNew ? "" : ""}
//             </span>
//           </div>

//           <div style={styles.inputWrap}>
//             <input
//               type={showConfirm ? "text" : "password"}
//               placeholder="confirm new password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               style={styles.input}
//             />
//             <span
//               style={styles.eye}
//               onClick={() => setShowConfirm(!showConfirm)}
//             >
//               {showConfirm ? "" : ""}
//             </span>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               ...styles.btn,
//               opacity: loading ? 0.7 : 1,
//             }}
//           >
//             {loading ? "Updating..." : "Reset password"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background:
//       "linear-gradient(135deg,#fffce8,#efe8ff)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "Inter, sans-serif",
//   },

//   header: {
//     width: "100%",
//     maxWidth: 900,
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "40px 40px 20px",
//   },

//   back: {
//     cursor: "pointer",
//     fontWeight: 600,
//   },

//   logo: {
//     fontWeight: 700,
//     fontSize: 22,
//     color: "#7b4dff",
//   },

//   card: {
//     background: "#fff",
//     width: 520,
//     maxWidth: "90%",
//     padding: 32,
//     borderRadius: 22,
//     boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
//     marginTop:"50px"
//   },

//   heading: {
//     fontSize: 22,
//     fontWeight: 700,
//     textAlign: "center",
//     marginBottom: 12,
//   },

//   sub: {
//     textAlign: "center",
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 24,
//     lineHeight: 1.5,
//   },

//   msg: {
//     padding: 10,
//     borderRadius: 8,
//     fontSize: 13,
//     textAlign: "center",
//     marginBottom: 16,
//   },

//   inputWrap: {
//     position: "relative",
//     marginBottom: 14,
//   },

//   input: {
//     width: "100%",
//     height: 48,
//     borderRadius: 12,
//     border: "1px solid #ccc",
//     padding: "0 42px 0 14px",
//     fontSize: 14,
//     outline: "none",
//   },

//   eye: {
//     position: "absolute",
//     right: 14,
//     top: "50%",
//     transform: "translateY(-50%)",
//     cursor: "pointer",
//   },

//   btn: {
//     width: "100%",
//     height: 46,
//     borderRadius: 30,
//     background: "#7b4dff",
//     color: "#fff",
//     border: "none",
//     fontWeight: 600,
//     cursor: "pointer",
//     marginTop: 16,
//   },
// };




import React, { useState, useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firbase/Firebase";
import { useNavigate, useLocation } from "react-router-dom";
import backarrow from "../assets/backarrow.png";
export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { uid } = location.state || {};

  useEffect(() => {
    if (!uid) navigate("/firelogin", { replace: true });
  }, [uid, navigate]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const encodePassword = (pw) => btoa(unescape(encodeURIComponent(pw)));

  const showMessage = (text, isError = true) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6)
      return showMessage("Password must be 6+ characters", true);
    if (newPassword !== confirmPassword)
      return showMessage("Passwords don't match", true);

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", uid), {
        password: encodePassword(newPassword.trim()),
        updated_at: serverTimestamp(),
      });
      showMessage("Password updated! Redirecting...", false);
      setTimeout(() => navigate("/firelogin", { replace: true }), 1500);
    } catch {
      showMessage("Update failed. Try again.", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.back} onClick={() => navigate(-1)}>
            <img src={backarrow} alt="arrow" width={18} />
            Back
          </div>

          <div style={styles.topLogo}>Huzzler</div>
        </div>




        {/* CARD */}
        <div style={styles.card}>
          <h2 style={styles.heading}>Create a strong password</h2>
          <p style={styles.sub}>
            Your password must be at least 6 character and <br />
            should include a combination of numbers, letter <br />
            and special characters(!$@%).
          </p>

          {message && (
            <div
              style={{
                ...styles.msg,
                background: message.isError ? "#ffe2e2" : "#e2ffe9",
                color: message.isError ? "#b00020" : "#006b2e",
              }}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputWrap}>
              <input
                type={showNew ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
              />
              <span
                style={styles.eye}
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? "" : ""}
              </span>
            </div>

            <div style={styles.inputWrap}>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
              />
              <span
                style={styles.eye}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "" : ""}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.btn,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Updating..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>
      </div>
      );
}

      /* ================= STYLES ================= */

      const styles = {
        page: {
        minHeight: "100vh",
      background:
      "linear-gradient(135deg,#fffce8,#efe8ff)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "Inter, sans-serif",
      padding:130,
  },
     container: {
  width: 520,
  maxWidth: "90%",
  marginTop: 40,
},

header: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 24, // space before card
},

back: {
  display: "flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
},

topLogo: {
  fontSize: 26,
  fontWeight: 700,
  color: "#7B4DFF",
  marginRight: 220, // visual centering balance
},


      card: {
        background: "#fff",
      width: 520,
      maxWidth: "90%",
      padding: 32,
      borderRadius: 22,
      boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
      marginTop: 40, // space below logo
},

      heading: {
        fontSize: 22,
      fontWeight: 700,
      textAlign: "center",
      marginBottom: 12,
  },

      sub: {
        textAlign: "center",
      fontSize: 14,
      color: "#666",
      marginBottom: 24,
      lineHeight: 1.5,
  },

      msg: {
        padding: 10,
      borderRadius: 8,
      fontSize: 13,
      textAlign: "center",
      marginBottom: 16,
  },

      inputWrap: {
        position: "relative",
      marginBottom: 14,
  },

      input: {
        width: "100%",
      height: 48,
      borderRadius: 12,
      border: "1px solid #ccc",
      padding: "0 42px 0 14px",
      fontSize: 14,
      outline: "none",
  },

      eye: {
        position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
  },

      btn: {
        width: "100%",
      height: 46,
      borderRadius: 30,
      background: "#7b4dff",
      color: "#fff",
      border: "none",
      fontWeight: 600,
      cursor: "pointer",
      marginTop: 16,
  },
};