// src/pages/fireLogin.jsx
import React, { useState, useEffect } from "react";
import google from "../assets/Google.png";
import facebook from "../assets/facebook.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  linkWithCredential,
} from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firbase/Firebase";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const BACKEND_SEND_OTP =
    "https://huzzler.onrender.com/api/auth/send-otp";



  const showMsg = (text, isError = true) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        navigate("/fireregister", {
          state: { email: user.email, uid: user.uid },
        });
        return;
      }

      const role = (snap.docs[0].data().role || "")
        .trim()
        .toLowerCase();

      role === "client"
        ? navigate("/client-dashbroad2")
        : navigate("/freelance-dashboard");
    } catch {
      showMsg("Google login failed");
    }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("user:email");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        navigate("/fireregister", {
          state: { email: user.email || "", uid: user.uid },
        });
        return;
      }

      const role = (userSnap.data().role || "")
        .trim()
        .toLowerCase();

      role === "client"
        ? navigate("/client-dashbroad2")
        : navigate("/freelance-dashboard");
    } catch (err) {
      if (err.code === "auth/account-exists-with-different-credential") {
        try {
          const pendingCred = GithubAuthProvider.credentialFromError(err);
          const email = err.customData?.email;
          if (!email) throw new Error("No email found for linking");

          showMsg("Linking your GitHub account... Please confirm your Google login.", false);
          
          const googleProvider = new GoogleAuthProvider();
          googleProvider.setCustomParameters({ login_hint: email });
          const result = await signInWithPopup(auth, googleProvider);
          await linkWithCredential(result.user, pendingCred);

          const userRef = doc(db, "users", result.user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            navigate("/fireregister", {
              state: { email: result.user.email || "", uid: result.user.uid },
            });
            return;
          }

          const role = (userSnap.data().role || "").trim().toLowerCase();
          role === "client" ? navigate("/client-dashbroad2") : navigate("/freelance-dashboard");

        } catch (linkErr) {
          console.error("Linking error: ", linkErr);
          showMsg("Could not link accounts. Please log in with Google directly.");
        }
      } else {
        console.error("GitHub Login Error: ", err);
        showMsg("GitHub login failed: " + err.message);
      }
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const encodedPassword = btoa(password.trim());

      const q = query(
        collection(db, "users"),
        where("email", "==", normalizedEmail)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        showMsg("No account found");
        return;
      }

      const user = snap.docs[0].data();
      if (user.password !== encodedPassword) {
        showMsg("Incorrect password");
        return;
      }

      await axios.post(BACKEND_SEND_OTP, {
        email: normalizedEmail,
      });

      const role = (user.role || "").trim().toLowerCase();
      role === "client"
        ? navigate("/clientloginotp", {
          state: { email: normalizedEmail },
        })
        : navigate("/freelancer-loginotp", {
          state: { email: normalizedEmail },
        });
    } catch {
      showMsg("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBg}>
      <div style={styles.centerWrap}>
        {/* TITLE */}
        <div style={styles.header}>
          <h1 style={styles.title}>Huzzler</h1>
          <p style={styles.subtitle}>
            Create. Connect. Grow. It all starts here.
          </p>
        </div>

        {/* CARD */}
        <div style={styles.card}>
          {msg && (
            <div
              style={msg.isError ? styles.errorMsg : styles.successMsg}
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={handleEmailLogin}>
            <input
              type="email"
              placeholder="Email or Username"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div style={styles.forgotWrap}>
              <button
                type="button"
                style={styles.forgot}
                onClick={() =>
                  navigate("/forgot-password", {
                    state: { email },
                  })
                }
              >
                Forgot Password?
              </button>
            </div>


            <button
              type="submit"
              style={styles.loginBtn}
              disabled={loading}
            >
              {loading ? "Processing..." : "Log in"}
            </button>
          </form>

          <div style={styles.sepWrap}>
            <div style={styles.sepLine} />
            <span style={styles.sepText}>or continue with</span>
            <div style={styles.sepLine} />
          </div>

          <div style={styles.socialRow}>
            <button type="button" style={styles.socialBtn} onClick={handleGoogleLogin}>
              <img src={google} style={styles.socialIcon} alt="google" />
            </button>
            <button type="button" style={styles.socialBtn} onClick={handleGithubLogin}>
              <img src={facebook} style={styles.socialIcon} alt="github" />
            </button>
          </div>

          <p style={styles.signupText}>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/fireregister")}
              style={styles.signupLink}
            >
              Sign up
            </span>
          </p>

          <p style={styles.terms}>
            By signing up, you agree to our{" "}
            <span onClick={() => window.open("/termsofservice", "_blank")} style={styles.link}>Terms of Service</span> & acknowledge our{" "}
            <span onClick={() => window.open("/privacypolicy", "_blank")} style={styles.link}>Privacy Policy</span>

          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  pageBg: {
    height: "100vh",
    width: "100vw",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    background:
      "linear-gradient(140deg,#fff 20%,#f4edff 60%,#fffbd9 100%)",
    fontFamily: "Inter, sans-serif",
  },

  /* 📱 22px padding ONLY on mobile */
  centerWrap: {
    width: "100%",
    maxWidth: 480,
    padding: "clamp(22px, 6vw, 0px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    marginBottom: "100px"
  },

  header: { textAlign: "center" },

  title: { fontSize: 32, fontWeight: 700, color: "#6b31ff" },

  subtitle: {
    fontSize: 14,
    color: "#6f6f6f",
    marginTop: 6,
  },

  card: {
    width: "100%",
    maxWidth: 448,
    background: "#fff",
    borderRadius: 24,
    padding: 32,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },

  input: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    border: "0.8px solid #e5e5e5",
    padding: "12px 20px",
    marginBottom: 12,
  },

  forgotWrap: {
    display: "flex",
    justifyContent: "flex-end",
  },

  forgot: {
    background: "none",
    border: "none",
    color: "#6A7282",
    marginBottom: 18,
    cursor: "pointer",
    marginRight: 0, // 👈 desktop adjust
  },

  loginBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },

  sepWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "20px 0",
  },

  sepLine: { flex: 1, height: 1, background: "#e0e0e0" },

  sepText: { fontSize: 13, color: "#888" },

  socialRow: { display: "flex", justifyContent: "center", gap: 16 },

  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "0.8px solid #e5e5e5",
    background: "#fff",
    cursor: "pointer",
  },

  socialIcon: { width: 22 },

  signupText: { fontSize: 16, textAlign: "center", marginTop: 18, fontWeight: 400, },

  signupLink: { color: "#6b31ff", fontWeight: 600, cursor: "pointer" },

  terms: {
    fontSize: 16, textAlign: "center", marginTop: 14, fontWeight: 400,


  },

  link: {
    color: "#6b31ff",
    textDecoration: "underline",
    cursor: "pointer",
  },

  successMsg: {
    background: "#eaffea",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },

  errorMsg: {
    background: "#ffeaea",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
};