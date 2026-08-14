import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firbase/Firebase";
import { getAuthErrorMessage } from "../firebaseutils/authErrors";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setMode(initialMode);
    setEmail("");
    setPassword("");
    setMsg(null);
  }, [isOpen, initialMode]);

  // Handle redirect result if redirect login was used
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const user = result.user;
          let userSnap = await getDoc(doc(db, "users", user.uid));
          let userData = userSnap.exists() ? userSnap.data() : null;

          if (!userData && user.email) {
            const q = query(collection(db, "users"), where("email", "==", user.email));
            const qSnap = await getDocs(q);
            if (!qSnap.empty) userData = qSnap.docs[0].data();
          }

          if (!userData) {
            navigate("/fireregister", { state: { email: user.email || "", uid: user.uid } });
          } else {
            const existingRole = (userData.role || "").trim().toLowerCase();
            existingRole === "client" ? navigate("/client-dashbroad2") : navigate("/freelance-dashboard");
          }
        }
      })
      .catch((err) => {
        console.error("Redirect auth error:", err);
      });
  }, [navigate]);

  if (!isOpen) return null;

  const showToast = (text, isError = true) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 5000);
  };

  // Handle Role Selection during Sign Up (Image 2 -> Sign Up Form Page)
  const handleRoleSelect = async (selectedRole) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await setDoc(
          doc(db, "users", currentUser.uid),
          {
            email: currentUser.email || "",
            role: selectedRole,
            created_at: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      onClose();
      if (selectedRole === "client") {
        navigate("/client-register");
      } else {
        navigate("/freelancer-signup");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      
      let user;
      try {
        const result = await signInWithPopup(auth, provider);
        user = result.user;
      } catch (popupErr) {
        if (popupErr.code === "auth/popup-blocked" || popupErr.code === "auth/cancelled-popup-request") {
          await signInWithRedirect(auth, provider);
          return;
        }
        throw popupErr;
      }

      if (!user) return;

      let userSnap = await getDoc(doc(db, "users", user.uid));
      let userData = userSnap.exists() ? userSnap.data() : null;

      if (!userData && user.email) {
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          userData = qSnap.docs[0].data();
        }
      }

      if (!userData) {
        onClose();
        navigate("/fireregister", { state: { email: user.email || "", uid: user.uid } });
        return;
      }

      const existingRole = (userData.role || "").trim().toLowerCase();
      onClose();
      if (existingRole === "client") {
        navigate("/client-dashbroad2");
      } else {
        navigate("/freelance-dashboard");
      }
    } catch (err) {
      console.error("Google auth error:", err);
      showToast(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      const provider = new GithubAuthProvider();
      provider.addScope("user:email");
      
      let user;
      try {
        const result = await signInWithPopup(auth, provider);
        user = result.user;
      } catch (popupErr) {
        if (popupErr.code === "auth/popup-blocked" || popupErr.code === "auth/cancelled-popup-request") {
          await signInWithRedirect(auth, provider);
          return;
        }
        throw popupErr;
      }

      if (!user) return;

      let userSnap = await getDoc(doc(db, "users", user.uid));
      let userData = userSnap.exists() ? userSnap.data() : null;

      if (!userData && user.email) {
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) userData = qSnap.docs[0].data();
      }

      if (!userData) {
        onClose();
        navigate("/fireregister", { state: { email: user.email || "", uid: user.uid } });
        return;
      }

      const existingRole = (userData.role || "").trim().toLowerCase();
      onClose();
      if (existingRole === "client") {
        navigate("/client-dashbroad2");
      } else {
        navigate("/freelance-dashboard");
      }
    } catch (err) {
      console.error("GitHub auth error:", err);
      showToast(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const user = userCredential.user;

      const q = query(collection(db, "users"), where("email", "==", normalizedEmail));
      const snap = await getDocs(q);

      onClose();
      if (!snap.empty) {
        const userRole = (snap.docs[0].data().role || "").trim().toLowerCase();
        if (userRole === "client") {
          navigate("/client-dashbroad2");
        } else {
          navigate("/freelance-dashboard");
        }
      } else {
        navigate("/freelance-dashboard");
      }
    } catch (err) {
      console.error(err);
      showToast("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 10, 30, 0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#FFFFFF",
          borderRadius: "28px",
          padding: mode === "signup" ? "44px 36px 36px 36px" : "36px 32px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          boxSizing: "border-box",
          position: "relative",
          fontFamily: "'Rubik', 'DM Sans', sans-serif",
          animation: "modalFadeIn 0.25s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "#F5F3F7",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#6B7280",
            transition: "all 0.2s",
          }}
        >
          <FiX size={18} />
        </button>

        {/* ALERT MSG */}
        {msg && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              marginBottom: "16px",
              fontSize: "13px",
              textAlign: "center",
              background: msg.isError ? "#FEE2E2" : "#D1FAE5",
              color: msg.isError ? "#DC2626" : "#059669",
              border: `1px solid ${msg.isError ? "#FCA5A5" : "#6EE7B7"}`,
            }}
          >
            {msg.text}
          </div>
        )}

        {/* ================= MODE 1: SIGN UP ROLE CHOICE CARD (IMAGE 2) ================= */}
        {mode === "signup" ? (
          <div>
            {/* Title & Subtitles */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h1
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#7C3AED",
                  fontFamily: "'Rubik', sans-serif",
                  margin: "0 0 4px 0",
                }}
              >
                Huzzler
              </h1>
              <p
                style={{
                  margin: "0 0 4px 0",
                  color: "#7C3AED",
                  fontSize: "15px",
                  fontWeight: 400,
                }}
              >
                Welcome to Huzzler
              </p>
              <p
                style={{
                  margin: 0,
                  color: "#4B5563",
                  fontSize: "15px",
                  fontWeight: 400,
                }}
              >
                Where talent meets opportunity
              </p>
            </div>

            {/* Big Role Action Buttons (Exact Figma Match) */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "32px",
                justifyContent: "center",
              }}
            >
              {/* FREELANCER BUTTON */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleRoleSelect("freelancer")}
                style={{
                  flex: 1,
                  height: "90px",
                  borderRadius: "20px",
                  border: "none",
                  background: "#FFFFFF",
                  color: "#7C3AED",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.2s ease",
                  fontFamily: "'Rubik', sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                {loading ? "Loading..." : "FREELANCER"}
              </button>

              {/* CLIENT BUTTON */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleRoleSelect("client")}
                style={{
                  flex: 1,
                  height: "90px",
                  borderRadius: "20px",
                  border: "none",
                  background: "#7C3AED",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(124, 58, 237, 0.35)",
                  transition: "all 0.2s ease",
                  fontFamily: "'Rubik', sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                {loading ? "Loading..." : "CLIENT"}
              </button>
            </div>

            {/* Bottom Log in Option */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "15px",
                color: "#4B5563",
              }}
            >
              <span>Already have an account?</span>
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{
                  background: "#7C3AED",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
                }}
              >
                Log in
              </button>
            </div>
          </div>
        ) : (
          /* ================= MODE 2: LOG IN FORM CARD (IMAGE 1) ================= */
          <div>
            {/* TITLE */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h1
                style={{
                  fontSize: "34px",
                  fontWeight: 800,
                  color: "#7C3AED",
                  fontFamily: "'Sora', sans-serif",
                  margin: "0 0 4px 0",
                  letterSpacing: "-0.5px",
                }}
              >
                Huzzler
              </h1>
              <p style={{ margin: 0, color: "#6B7280", fontSize: "14px", fontWeight: 400 }}>
                Welcome back! Log in to continue.
              </p>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "0 16px",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    background: "#FFFFFF",
                    fontSize: "14px",
                    color: "#1F2937",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7C3AED")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div style={{ marginBottom: "8px", position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "0 42px 0 16px",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    background: "#FFFFFF",
                    fontSize: "14px",
                    color: "#1F2937",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7C3AED")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#9CA3AF",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              {/* FORGOT PASSWORD */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <span
                  onClick={() => {
                    onClose();
                    navigate("/forgot-password", { state: { email } });
                  }}
                  style={{
                    color: "#6B7280",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontWeight: 400,
                  }}
                >
                  Forgot Password?
                </span>
              </div>

              {/* LOG IN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "14px",
                  background: "#7C3AED",
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: "600",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(124, 58, 237, 0.35)",
                  transition: "background 0.2s",
                }}
              >
                {loading ? "Processing..." : "Log in"}
              </button>
            </form>

            {/* DIVIDER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "20px 0 16px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>or continue with</span>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
            </div>

            {/* SOCIAL ROW */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "20px" }}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1px solid #E5E7EB",
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                <FcGoogle size={24} />
              </button>
              <button
                type="button"
                onClick={handleGithubLogin}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1px solid #E5E7EB",
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                <FaGithub size={22} color="#1F2937" />
              </button>
            </div>

            {/* TOGGLE TO SIGN UP (IMAGE 2) */}
            <div style={{ textAlign: "center", fontSize: "14px", color: "#4B5563", marginBottom: "16px" }}>
              Don’t have an account?{" "}
              <span
                onClick={() => setMode("signup")}
                style={{ color: "#7C3AED", fontWeight: 700, cursor: "pointer" }}
              >
                Sign up
              </span>
            </div>

            {/* TERMS FOOTER */}
            <div
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: "#6B7280",
                lineHeight: "1.5",
              }}
            >
              By signing up, you agree to our{" "}
              <span
                onClick={() => {
                  onClose();
                  window.open("/termsofservice", "_blank");
                }}
                style={{ color: "#7C3AED", textDecoration: "underline", cursor: "pointer" }}
              >
                Terms of Service
              </span>{" "}
              & acknowledge our{" "}
              <span
                onClick={() => {
                  onClose();
                  window.open("/privacypolicy", "_blank");
                }}
                style={{ color: "#7C3AED", textDecoration: "underline", cursor: "pointer" }}
              >
                Privacy Policy
              </span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
