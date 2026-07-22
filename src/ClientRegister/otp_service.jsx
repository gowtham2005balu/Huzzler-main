

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firbase/Firebase";
import { useNavigate, useLocation } from "react-router-dom";
import backarrow from "../assets/backarrow.png";

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  const localData = JSON.parse(localStorage.getItem("otpUser") || "{}");
  const stateData = location.state || {};

  const email = stateData.email || localData.email;
  const role = stateData.role || localData.role;
  const uid = stateData.uid || localData.uid;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const inputsRef = useRef([]);

  /* ================= NO SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  /* ================= GUARD ================= */
  useEffect(() => {
    if (!email) {
      alert("Signup data missing. Please start again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer === 0) {
      setIsResendDisabled(false);
      return;
    }
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  /* ================= OTP CHANGE ================= */
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length === 6) {
      const split = value.split("").slice(0, 6);
      setOtp(split);
      inputsRef.current[5]?.focus();
      return;
    }

    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* ================= VERIFY ================= */
  const verifyOtp = async () => {
    const joined = otp.join("");
    if (joined.length !== 6) return alert("Enter valid OTP");

    try {
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        { email: email.toLowerCase(), otp: joined }
      );

      await signInWithCustomToken(auth, res.data.token);
      localStorage.removeItem("otpUser");

      navigate(
        role === "client" ? "/client-details" : "/freelancer-details",
        {
          state: {
            uid: uid || res.data.uid,
            email,
            first_name: stateData.first_name || localData.first_name,
            last_name: stateData.last_name || localData.last_name,
            password: stateData.password || localData.password,
            role,
          },
        }
      );
    } catch (err) {
      alert(err?.response?.data?.message || "OTP verification failed");
    }
  };

  /* ================= RESEND ================= */
  const resendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setTimer(30);
      await axios.post(
        "https://huzzler.onrender.com/api/auth/resend-otp",
        { email: email.toLowerCase(), action: "resend" }
      );
      alert("New OTP sent!");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div style={styles.pageBg}>
      {/* ===== CONTAINER ===== */}
      <div style={styles.wrapper}>
        {/* BACK */}
        <div style={styles.topRow}>
          <img
            src={backarrow}
            alt="back"
            style={styles.backArrow}
            onClick={() => navigate(-1)}
          />
          <span style={styles.backText}>BACK</span>
        </div>

        {/* CARD */}
        <div style={styles.card}>
          <h2 style={styles.bigTitle}>
            You're almost there! We just need to verify your email.
          </h2>

          <p style={styles.subTitle}>Great! Almost done!</p>
          <p style={styles.subTitle2}>Please verify your email</p>

          <p style={styles.sentText}>Enter the verification code sent to:</p>
          <p style={styles.emailText}>{email}</p>

          {/* OTP */}
          <div style={styles.otpRow}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={digit}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                style={styles.otpBox}
              />
            ))}
          </div>

          <p style={styles.resendWrap}>
            Didn’t receive OTP?{" "}
            {isResendDisabled ? (
              <span style={styles.timerText}>{timer}s</span>
            ) : (
              <span style={styles.resendLink} onClick={resendOtp}>
                Resend OTP
              </span>
            )}
          </p>

          <button style={styles.verifyBtn} onClick={verifyOtp}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  pageBg: {
    height: "100dvh",
    background:
      "linear-gradient(140deg,#ffffff 0%,#f4edff 50%,#fffbd9 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
    overflow: "hidden",
  },

  wrapper: {
    width: "100%",
    maxWidth: 650,
    padding: 22,
    boxSizing: "border-box",
  },

  topRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  backArrow: {
    width: 20,
    height: 20,
    cursor: "pointer",
  },

  backText: {
    fontWeight: 700,
    fontSize: 15,
  },

  card: {
    background: "#fff",
    padding: "45px 55px 60px",
    textAlign: "center",
    borderRadius: 30,
    boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
  },

  bigTitle: { fontWeight: 500, marginBottom: 20 },

  subTitle: { fontSize: 16, marginBottom: 3 },

  subTitle2: { fontSize: 20, marginBottom: 25 },

  sentText: { color: "#6A7282", fontSize: 16 },

  emailText: { fontSize: 16, marginBottom: 25 },

  otpRow: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
  },

  otpBox: {
    width: 48,
    height: 48,
    fontSize: 22,
    lineHeight: "48px",
    padding: 0,
    border: "2px solid #e6e6e6",
    textAlign: "center",
    outline: "none",
    borderRadius: 8,
    boxSizing: "border-box",
    appearance: "none",
    WebkitAppearance: "none",
  },

  resendWrap: { marginBottom: 25, color: "#777" },

  timerText: { fontWeight: 600 },

  resendLink: { color: "#7C3CFF", fontWeight: 600, cursor: "pointer" },

  verifyBtn: {
    width: "100%",
    padding: 16,
    background: "#7C3CFF",
    borderRadius: 16,
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
};