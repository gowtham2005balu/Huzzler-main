import React, { useEffect, useState } from "react";
import "./SplashScreen.css";
import { auth, db } from "../firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const navigate = useNavigate();

  const [showCircle, setShowCircle] = useState(false);
  const [expandCircle, setExpandCircle] = useState(false);
  const [logoScale, setLogoScale] = useState(false);

  useEffect(() => {
    startSequence();
  }, []);

  const startSequence = async () => {
    // Show circle + scale logo
    await delay(1000);
    setShowCircle(true);
    setLogoScale(true);

    // Circle expand
    await delay(1100);
    setExpandCircle(true);

    // After animation → check Firebase user
    await delay(1100);
    checkAuth();
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const checkAuth = async () => {
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        const role = (data.role || "").toLowerCase();

        if (role.includes("freelancer")) {
          navigate("/freelancer/home", { state: { userData: data, uid: user.uid } });
          return;
        }
        if (role.includes("client")) {
          navigate("/client/home", { state: { userData: data, uid: user.uid } });
          return;
        }
      }

      // If no role → go login
      navigate("/login");
    } catch (err) {
      console.error("Auth check error:", err);
      navigate("/login");
    }
  };

  return (
    <div className="splash-wrapper">
      {/* Expanding yellow circle */}
      {showCircle && (
        <div
          className={`circle ${expandCircle ? "expand" : ""}`}
        ></div>
      )}

      {/* Logo Scale Animation */}
      <img
        src="/assets/huzzler logo.png"
        alt="Logo"
        className={`logo ${logoScale ? "scale" : ""}`}
      />
    </div>
  );
}
