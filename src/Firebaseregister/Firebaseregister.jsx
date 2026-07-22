// import React, { useState } from "react";
// import { auth, db } from "../firbase/Firebase";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import { height } from "@mui/system";

// export default function Signin() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const saveUserRole = async (role, next) => {
//     setLoading(true);

//     const user = auth.currentUser;
//     if (user) {
//       await setDoc(
//         doc(db, "users", user.uid),
//         {
//           email: user.email,
//           role,
//           created_at: serverTimestamp(),
//         },
//         { merge: true }
//       );
//     }

//     setLoading(false);
//     navigate(next);
//   };

//   return (
//     <div style={styles.pageBg}>
//       <div style={styles.card}>

//         {/* Title */}
//         <h1 style={styles.title}>Huzzler</h1>
//         <p style={styles.welcome}>Welcome to Huzzler</p>
//         <p style={styles.subtitle}>Where talent meets opportunity</p>

//         {/* Buttons */}
//         <div style={styles.btnRow}>
//           <button
//             style={{ ...styles.whiteBtn }}
//             disabled={loading}
//             onClick={() => saveUserRole("freelancer", "/freelancer-signup")}
//           >
//             {loading ? "Loading..." : "FREELANCER"}
//           </button>

//           <button
//             style={styles.purpleBtn}
//             disabled={loading}
//             onClick={() => saveUserRole("client", "/client-signup")}
//           >
//             {loading ? "Loading..." : "CLIENT"}
//           </button>
//         </div>

//       </div>

//       <div style={styles.bottomLogin}>
//         Already have an account?{" "}
//         <span
//           style={styles.loginBtn}
//           onClick={() => navigate("/firelogin")}
//         >
//           Log in
//         </span>
//       </div>
//     </div>
//   );
// }

// /* ======================================================
//    EXACT FIGMA UI STYLES — PERFECT MATCH
// ====================================================== */
// const styles = {
//   pageBg: {
//     minHeight: "100vh",
//     background:
//       "linear-gradient(140deg, #ffffff 10%, #f4edff 60%, #fffbd9 100%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     fontFamily: "Inter, sans-serif",
//     padding: 20,
//   },

//   card: {
//     width: "100%",
//     maxWidth: 500,
//     background: "white",
//     borderRadius: 42,
//     padding: "70px 40px 100px",
//     textAlign: "center",
//     boxShadow: "0 12px 45px rgba(0,0,0,0.08)",
//     boxSizing: "border-box",
//   },

//   title: {
//     fontSize: 32,
//     fontWeight: 700,
//     color: "#7C3CFF",
//     marginBottom: 5,
//   },

//   welcome: {
//     fontSize: 16,
//     fontWeight: 237,
//     color: "#7C3CFF",
//     marginBottom: 6,
//   },

//   subtitle: {
//     fontSize: 16,
//     color: "#4A5565",
//     marginBottom: 40,
//     fontWeight: 237,
//   },
// btnRow: {
//   display: "flex",
//   justifyContent: "center",
//   gap: 20,          // space between buttons
//   marginTop: 20,
//   flexWrap: "nowrap", // prevent buttons from wrapping to next line
// },

// whiteBtn: {
//   flex: 1,             // make both buttons equal width
//   minWidth: 150,       // prevent buttons from getting too small
//   padding: "20px 0",
//   background: "white",
//   color: "#7C3CFF",
//   border: "none",
//   fontWeight: 700,
//   fontSize: 15,
//   borderRadius: 20,
//   boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
//   cursor: "pointer",
//    height:"95px",
// },

// purpleBtn: {
//   flex: 1,
//   minWidth: 150,
//   padding: "20px 0",
//   background: "#7C3CFF",
//   color: "white",
//   border: "none",
//   fontWeight: 700,
//   fontSize: 15,
//   borderRadius: 20,
//   boxShadow: "0 8px 26px rgba(124,58,237,0.4)",
//   cursor: "pointer",
//   height:"95px",
// },

//   bottomLogin: {
//     marginTop: 25,
//     fontSize: 16,
//     fontWeight: 500,
//     color: "#4A5565",
//     textAlign: "center",
//   },

//   loginBtn: {
//     marginLeft: 6,
//     marginRight: 6,
//     color: "white",
//     background: "#7C3CFF",
//     padding: "10px 20px",
//     borderRadius: 12,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontSize: 14,
//     boxShadow: "0px 4px 14px rgba(124,58,237,0.4)",
//   },

//   // Media Queries for small screens
//   '@media (max-width: 640px)': {
//     card: {
//       padding: "40px 20px 60px",
//       borderRadius: 28,
//     },
//     title: { fontSize: 26 },
//     welcome: { fontSize: 14 },
//     subtitle: { fontSize: 14, marginBottom: 30 },
//     btnRow: { gap: 10 },
//     whiteBtn: { fontSize: 14, padding: "16px 0" },
//     purpleBtn: { fontSize: 14, padding: "16px 0" },
//     loginBtn: { fontSize: 13, padding: "8px 16px" },
//   },
// };

















// import React, { useState } from "react";
// import { auth, db } from "../firbase/Firebase";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// export default function Signin() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const saveUserRole = async (role, next) => {
//     setLoading(true);
//     const user = auth.currentUser;

//     if (user) {
//       await setDoc(
//         doc(db, "users", user.uid),
//         {
//           email: user.email,
//           role,
//           created_at: serverTimestamp(),
//         },
//         { merge: true }
//       );
//     }

//     setLoading(false);
//     navigate(next);
//   };

//   return (
//     <>
//       {/* ================= CSS IN SAME FILE ================= */}
//       <style>{`
//         * {
//           box-sizing: border-box;
//         }

//         body {
//           margin: 0;
//           overflow: hidden; /* 🚫 No page scroll */
//           font-family: Inter, sans-serif;
//         }

//         .page-bg {
//           width: 100vw;
//           height: 100vh;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           background: linear-gradient(
//             140deg,
//             #ffffff 10%,
//             #f4edff 60%,
//             #fffbd9 100%
//           );
//         }

//         /* ================= CONTAINER ================= */
//         .card {
//           width: 576px;
//           height: 480px;
//           background: #ffffff;
//           border-radius: 30px;
//           border: 0.8px solid #e5e7eb;
//           padding: 48px;
//           text-align: center;
//           box-shadow: 0 12px 45px rgba(0, 0, 0, 0.08);
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//         }

//         .title {
        
//           color: #7C3CFF;
//           margin-bottom: 6px;
//           font-family: Rubik;
// font-weight: 700;
// font-style: Bold;
// font-size: 24px;

// line-height: 24px;
// letter-spacing: 0px;
// text-align: center;

//         }

//         .welcome {
          
//           color: #7c3cff;
//           margin-bottom: 6px;
         
// font-weight: 400;
// font-style: Regular;
// font-size: 16px;
// leading-trim: NONE;
// line-height: 24px;
// letter-spacing: 0px;
// text-align: center;

//         }

//         .subtitle {
         
//           color: #4a5565;
//           margin-bottom: 36px;
//           font-family: Rubik;
// font-weight: 400;
// font-style: Regular;
// font-size: 16px;
// leading-trim: NONE;
// line-height: 24px;
// letter-spacing: 0px;
// text-align: center;

//         }

//         /* ================= BUTTON ROW ================= */
//         .btn-row {
//           display: flex;
//           justify-content: center;
//           gap: 20px;
//         }

//         /* ================= FREELANCER / CLIENT ================= */
//         .role-btn {
//           width: 172px;
//           height: 95px;
//           border-radius: 24px;
//           border: 0.8px solid transparent;
//           font-weight: 700;
//           font-size: 15px;
//           cursor: pointer;
//           padding-right: 0.01px;
//         }

//         .role-btn.white {
//           background: #ffffff;
//           color: #7c3cff;
//           box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
//         }

//         .role-btn.purple {
//           background: #7c3cff;
//           color: #ffffff;
//           box-shadow: 0 8px 26px rgba(124, 58, 237, 0.4);
//         }

//         /* ================= LOGIN ================= */
//         .bottom-login {
//           margin-top: 24px;
//           font-size: 15px;
//           color: #4a5565;
//           font-family: Rubik;
// font-weight: 400;

// font-size: 16px;

// line-height: 24px;


//         }

//         .login-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           width: 94.36px;
//           height: 44.8px;
//           padding: 13.2px 24px;
//           background: #7c3cff;
//           color: #ffffff;
//           border-radius: 12px;
//           font-size: 14px;
//           font-weight: 600;
//           cursor: pointer;
//           margin-left: 8px;
//           box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);
//           margin-bottom:54px
//         }

//         /* ================= MOBILE RESPONSIVE ================= */
//         @media (max-width: 640px) {
//           .card {
//             width: 92%;
//             height: auto;
//             padding: 22px; /* ✅ EXACT as requested */
//             border-radius: 22px;
//             margin-bottom:14px
//           }

//           .btn-row {
//             gap: 14px;
//           }

//           .role-btn {
//             width: 100%;
//             height: 70px;
//             font-size: 14px;
//           }

//           .title {
//             font-size: 26px;
//           }

//           .subtitle {
//             font-size: 14px;
//             margin-bottom: 28px;
//           }
//         }
//       `}</style>

//       {/* ================= UI ================= */}
//       <div className="page-bg">
//         <div className="card">
//           <h1 className="title">Huzzler</h1>
//           <p className="welcome">Welcome to Huzzler</p>
//           <p className="subtitle">Where talent meets opportunity</p>

//           <div className="btn-row">
//             <button
//               className="role-btn white"
//               disabled={loading}
//               onClick={() =>
//                 saveUserRole("freelancer", "/freelancer-signup")
//               }
//             >
//               {loading ? "Loading..." : "FREELANCER"}
//             </button>

//             <button
//               className="role-btn purple"
//               disabled={loading}
//               onClick={() =>
//                 saveUserRole("client", "/client-signup")
//               }
//             >
//               {loading ? "Loading..." : "CLIENT"}
//             </button>
//           </div>
//         </div>

//         <div className="bottom-login">
//           Already have an account?
//           <span
//             className="login-btn"
//             onClick={() => navigate("/firelogin")}
//           >
//             Log in
//           </span>
//         </div>
//       </div>
//     </>
//   );
// }





import React, { useEffect, useState } from "react";
import { auth, db } from "../firbase/Firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
  const saveUserRole = async (role, next) => {
    setLoading(true);
    const user = auth.currentUser;

    if (user) {
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          role,
          created_at: serverTimestamp(),
        },
        { merge: true }
      );
    }

    setLoading(false);
    navigate(next);
  };

  return (
    <>
      {/* ================= CSS IN SAME FILE ================= */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          overflow: hidden; /* 🚫 No page scroll */
          font-family: Inter, sans-serif;
        }

        .page-bg {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            140deg,
            #ffffff 10%,
            #f4edff 60%,
            #fffbd9 100%
          );
        }

        /* ================= CONTAINER ================= */
        .card {
          width: 576px;
          height: 480px;
          background: #ffffff;
          border-radius: 30px;
          border: 0.8px solid #e5e7eb;
          padding: 48px;
          text-align: center;
          box-shadow: 0 12px 45px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .title {
        
          color: #7C3CFF;
          margin-bottom: 6px;
          font-family: Rubik;
font-weight: 700;
font-style: Bold;
font-size: 24px;

line-height: 24px;
letter-spacing: 0px;
text-align: center;

        }

        .welcome {
          
          color: #7c3cff;
          margin-bottom: 6px;
         
font-weight: 400;
font-style: Regular;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0px;
text-align: center;

        }

        .subtitle {
         
          color: #4a5565;
          margin-bottom: 36px;
          font-family: Rubik;
font-weight: 400;
font-style: Regular;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0px;
text-align: center;

        }

        /* ================= BUTTON ROW ================= */
        .btn-row {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        /* ================= FREELANCER / CLIENT ================= */
        .role-btn {
          width: 172px;
          height: 95px;
          border-radius: 24px;
          border: 0.8px solid transparent;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          padding-right: 0.01px;
        }

        .role-btn.white {
          background: #ffffff;
          color: #7c3cff;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
        }

        .role-btn.purple {
          background: #7c3cff;
          color: #ffffff;
          box-shadow: 0 8px 26px rgba(124, 58, 237, 0.4);
        }

        /* ================= LOGIN ================= */
        .bottom-login {
          margin-top: 24px;
          font-size: 15px;
          color: #4a5565;
          font-family: Rubik;
font-weight: 400;

font-size: 16px;

line-height: 24px;


        }

        .login-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 94.36px;
          height: 44.8px;
          padding: 13.2px 24px;
          background: #7c3cff;
          color: #ffffff;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-left: 8px;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);
          margin-bottom:54px
        }

        /* ================= MOBILE RESPONSIVE ================= */
        @media (max-width: 640px) {
          .card {
            width: 92%;
            height: auto;
            padding: 22px; /* ✅ EXACT as requested */
            border-radius: 22px;
            margin-bottom:14px
          }

          .btn-row {
            gap: 14px;
          }

          .role-btn {
            width: 100%;
            height: 70px;
            font-size: 14px;
          }

          .title {
            font-size: 26px;
          }

          .subtitle {
            font-size: 14px;
            margin-bottom: 28px;
          }
        }
      `}</style>

      {/* ================= UI ================= */}
      <div className="page-bg">
        <div className="card">
          <h1 className="title">Huzzler</h1>
          <p className="welcome">Welcome to Huzzler</p>
          <p className="subtitle">Where talent meets opportunity</p>

          <div className="btn-row">
            <button
              className="role-btn white"
              disabled={loading}
              onClick={() =>
                saveUserRole("freelancer", "/freelancer-signup")
              }
            >
              {loading ? "Loading..." : "FREELANCER"}
            </button>

            <button
              className="role-btn purple"
              disabled={loading}
              onClick={() =>
                saveUserRole("client", "/client-register")
              }
            >
              {loading ? "Loading..." : "CLIENT"}
            </button>
          </div>
        </div>

        <div className="bottom-login">
          Already have an account?
          <span
            className="login-btn"
            onClick={() => navigate("/freelance-dashboard")}
          >
            Log in
          </span>
        </div>


      </div>
    </>
  );
}