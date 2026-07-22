

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { db } from "../firbase/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import backarrow from "../assets/backarrow.png";

const SEND_OTP = "https://huzzler.onrender.com/api/auth/send-otp";

export default function SignUpClient() {
  const navigate = useNavigate();

  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const show = (msg) => alert(msg);

  /* ===== NO SCROLL FIX ===== */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  /* ===== SEND OTP ===== */
  const handleSendOtp = async () => {
    if (!first_name.trim()) return show("Enter First Name");
    if (!last_name.trim()) return show("Enter Last Name");
    if (!email.trim()) return show("Enter Email");
    if (!/\S+@\S+\.\S+/.test(email.trim()))
      return show("Enter a valid email address");
   if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/)) {
      return show("Password must be 8-15 characters with uppercase, lowercase, number and special character.");
    }
    if (!acceptedTerms)
      return show("Please accept Terms & Privacy Policy");

    const normalizedEmail = email.trim().toLowerCase();
    setLoading(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", normalizedEmail));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const existingRole = snap.docs[0].data().role;
        setLoading(false);

        if (existingRole === "freelancer") {
          return show("This email is registered as a Freelancer.");
        }
        return show("Email already registered, please login.");
      }

      const res = await axios.post(SEND_OTP, { email: normalizedEmail });

      if (res.data.success) {
        localStorage.setItem(
          "otpUser",
          JSON.stringify({
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: normalizedEmail,
            password,
            role: "client",
          })
        );

        navigate("/otp", {
          state: {
            first_name,
            last_name,
            email: normalizedEmail,
            password,
            role: "client",
          },
        });
      }
    } catch (err) {
      show(err.response?.data?.message || "OTP sending failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBg}>
      {/* ==== TOP NAV ==== */}
      <div style={styles.topRow}>
        <img
          src={backarrow}
          style={styles.backArrow}
          onClick={() => navigate(-1)}
          alt="back"
        />
        <span style={styles.topTitle}>Sign up as Client</span>
      </div>

      {/* ==== CARD ==== */}
      <div style={styles.card}>
        <p style={styles.titleText}>“Ready to Make Things Happen”</p>

        <input
          type="text"
          placeholder="First name"
          value={first_name}
          onChange={(e) => setfirst_name(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Last name"
          value={last_name}
          onChange={(e) => setlast_name(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {/* ==== TERMS ==== */}
        <div style={styles.termsRow}>
          <input
            type="checkbox"
            style={styles.checkbox}
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <p style={styles.termsText}>
            By signing up, you agree to our{" "}
            <span onClick={() => window.open("/termsofservice", "_blank")} style={styles.link}>Terms of service</span> & acknowledge our{" "}
            <span onClick={() => window.open("/privacypolicy", "_blank")} style={styles.link}>Privacy Policy</span>
          </p>

        </div>

        {/* ==== CONTINUE ==== */}
        <button
          style={{
            ...styles.continueBtn,
            opacity: !acceptedTerms || loading ? 0.6 : 1,
            cursor:
              !acceptedTerms || loading ? "not-allowed" : "pointer",
          }}
          onClick={handleSendOtp}
          disabled={loading || !acceptedTerms}
        >
          {loading ? "Processing..." : "CONTINUE"}
        </button>
      </div>

      {/* ==== FOOTER ==== */}
      <p style={styles.footer}>
        Have an Account?{" "}
        <span
          style={styles.loginLabel}
          onClick={() => navigate("/firelogin")}
        >
          log in
        </span>
      </p>
    </div>
  );
}

/* =======================
        STYLES
======================= */
const styles = {
  pageBg: {
    height: "100dvh",
    overflow: "hidden",
    background:
      "linear-gradient(140deg, #ffffff 10%, #f4edff 60%, #fffbd9 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: "Inter, sans-serif",
  },

  topRow: {
    width: "100%",
    maxWidth: 610,
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  backArrow: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },

  topTitle: {
    fontSize: 16,
    fontWeight: 600,
  },

  card: {
    width: "100%",
    maxWidth: 610,
    background: "#fff",
    borderRadius: 28,
    padding: "45px 25px 55px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  titleText: {
    fontSize: 15,
    fontWeight: 400,
    marginBottom: 30,
    color: "#000",
  },

  input: {
    width: "100%",
    padding: "15px",
    borderRadius: 14,
    border: "1px solid #e5e5e5",
    fontSize: 15,
    marginBottom: 18,
    outline: "none",
    boxSizing: "border-box",
  },

  termsRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 25,
  },

  checkbox: {
    width: 18,
    height: 18,
    flexShrink: 0,
    marginTop:15,
    cursor:"pointer"
  },

  termsText: {
    fontSize: 13,
    color: "#444",
    textAlign: "left",
  },

  link: {
    color: "#7c3aed",
    textDecoration: "underline",
    cursor:"pointer"
  },

  continueBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: 16,
    background: "#7c3aed",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    boxShadow: "0 6px 18px rgba(124,58,237,0.4)",
  },

  footer: {
    marginTop: 25,
    fontSize: 15,
    textAlign: "center",
  },

  loginLabel: {
    background: "#fff59d",
    padding: "8px 10px",
    borderRadius: 6,
    marginLeft: 5,
    cursor: "pointer",
    fontWeight: 700,
  },
};
