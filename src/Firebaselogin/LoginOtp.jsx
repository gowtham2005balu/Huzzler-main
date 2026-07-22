import React, { useState, useEffect } from "react";
import axios from "axios";

import { auth, db } from "../firbase/Firebase"; 
import { signInWithCustomToken } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

import OtpInput from "react-otp-input"; 

const LoginOtpScreen = ({ email, first_name, last_name, password }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // VERIFY OTP
  // ----------------------------------------------------------
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/verify-otp",
        { email, otp }
      );

      const data = res.data;
      console.log("OTP Verify:", data);

      if (data.token && data.uid) {
        const customToken = data.token;

        const userCred = await signInWithCustomToken(auth, customToken);
        const firebaseUser = userCred.user;

        // Firestore Check
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          await setDoc(userRef, {
            first_name,
            last_name,
            email,
            role: "freelancer",
            created_at: new Date(),
          });
        }

        navigate(`/redirect/${firebaseUser.uid}`);
      } else {
        alert(data.message || "OTP verification failed");
      }
    } catch (err) {
      alert(err.message);
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const res = await axios.post(
        "https://huzzler.onrender.com/api/auth/send-otp",
        { email }
      );
      alert(res.data.message);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

 
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <img src="/logo.png" width={60} alt="logo" />

      <div style={{ marginTop: 20, cursor: "pointer" }} onClick={() => navigate(-1)}>
        <span style={{ fontSize: 14 }}>← BACK</span>
      </div>

      <h3 style={{ marginTop: 30 }}>
        You’re Almost There! We Just Need To Verify Your Email.
      </h3>

      <h2>Please Verify Your Email</h2>
      <p style={{ fontWeight: "bold" }}>{email}</p>

      <div style={{ marginTop: 30 }}>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          inputStyle={{
            width: "45px",
            height: "50px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "600",
          }}
        />
      </div>

      <p style={{ marginTop: 20 }}>
        Didn’t Receive OTP?{" "}
        <span
          style={{ textDecoration: "underline", fontWeight: "bold", cursor: "pointer" }}
          onClick={resendOtp}
        >
          Resend OTP
        </span>
      </p>

      <button
        style={{
          marginTop: 40,
          width: "70%",
          padding: "14px",
          background: "#F6E05E",
          borderRadius: "20px",
          border: "1px solid black",
          fontWeight: "bold",
        }}
        onClick={verifyOtp}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Started"}
      </button>
    </div>
  );
};


export const ProfessionalLoginRedirect = () => {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);

        const role = data.role?.toLowerCase();
        console.log("User Role:", role);

        if (role === "freelancer") {
          navigate("/freelance-dashboard/freelanceHome", { replace: true });
        } 
        else if (role === "client") {
          navigate("/client-dashboard/clienthome", { replace: true });
        } 
        else {
          navigate("/error", { replace: true });
        }

      } else {
        setUserData("no-data");
      }
    });

    return () => unsub();
  }, [uid, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      Redirecting...
    </div>
  );
};

export default LoginOtpScreen;