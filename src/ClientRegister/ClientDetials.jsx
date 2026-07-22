import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firbase/Firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import backarrow from "../assets/backarrow.png";

export default function ClientDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const passed = location.state || {};

  const [Company_name, setCompany_name] = useState("");
  const [businessInfo, setBusinessInfo] = useState("");
  const [team_size, setteam_size] = useState("");
  const [loading, setLoading] = useState(false);

  const [showTeamOptions, setShowTeamOptions] = useState(false);
  const [showSectorOptions, setShowSectorOptions] = useState(false);

  /* TEAM OPTIONS */

  const teamOptions = [
    "1 (Individual)",
    "2–5 Members",
    "6–10 Members",
    "11–20 Members",
    "21–50 Members",
    "51+ Members",
  ];

  /* SECTORS */

  const sectors = [
    "Information Technology",
    "Banking & Finance",
    "Healthcare",
    "Education",
    "Marketing & Advertising",
    "Others",
  ];

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!passed.email) {
      alert("Signup data missing. Please start again.");
      navigate("/client-signup");
    }
  }, []);

  const handleContinue = async () => {
    if (!Company_name.trim()) return alert("Enter company name");
    if (!businessInfo.trim()) return alert("Select your business sector");
    if (!team_size.trim()) return alert("Enter your team size");

    try {
      setLoading(true);
      const user = auth.currentUser;
      const encodedPass = passed.password ? btoa(passed.password) : "";

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          first_name: passed.first_name,
          last_name: passed.last_name,
          email: passed.email,
          password: encodedPass,
          Company_name,
          sector: businessInfo,
          team_size,
          role: "client",
          profileCompleted: true,
          updated_at: serverTimestamp(),
        },
        { merge: true }
      );

      navigate("/client-details2", { replace: true });
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const selectTeam = (size) => {
    setteam_size(size);
    setShowTeamOptions(false);
  };

  const selectSector = (sector) => {
    setBusinessInfo(sector);
    setShowSectorOptions(false);
  };

  return (
    <div style={styles.page}>
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <img
          src={backarrow}
          alt="back"
          style={styles.backArrow}
          onClick={() => navigate(-1)}
        />

        <span style={styles.topTitle}>sign up as Client</span>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        <h3 style={styles.heading}>
          We’d like to get to know you better - this will
          <br /> only take a moment.
        </h3>

        {/* COMPANY NAME */}

        <input
          placeholder="Company name"
          value={Company_name}
          onChange={(e) => setCompany_name(e.target.value)}
          style={styles.input}
        />

        {/* BUSINESS SECTOR */}

        <div style={{ position: "relative" }}>
          <input
            placeholder="Tell me about your business"
            value={businessInfo}
            readOnly
            onClick={() => setShowSectorOptions(!showSectorOptions)}
            style={styles.input}
          />

          {showSectorOptions && (
            <div style={styles.dropdown}>
              {sectors.map((sector, index) => (
                <div
                  key={index}
                  style={styles.option}
                  onClick={() => selectSector(sector)}
                >
                  {sector}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TEAM SIZE */}

        <div style={{ position: "relative" }}>
          <input
            placeholder="What is your team size"
            value={team_size}
            readOnly
            onClick={() => setShowTeamOptions(!showTeamOptions)}
            style={styles.input}
          />

          {showTeamOptions && (
            <div style={styles.dropdown}>
              {teamOptions.map((option, index) => (
                <div
                  key={index}
                  style={styles.option}
                  onClick={() => selectTeam(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          style={styles.button}
          onClick={handleContinue}
          disabled={loading}
        >
          {loading ? "Saving..." : "CONTINUE"}
        </button>
      </div>
    </div>
  );
}

/* STYLES */

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    background:
      "radial-gradient(circle at 10% 90%, #ffffdd 0%, #ffffff 30%, #f3eaff 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    boxSizing: "border-box",
    fontFamily: "Inter, sans-serif",
    overflow: "hidden",
  },

  topBar: {
    width: "100%",
    maxWidth: 650,
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },

  backArrow: {
    width: 22,
    height: 22,
    cursor: "pointer",
  },

  topTitle: {
    fontSize: 16,
    fontWeight: 700,
  },

  card: {
    width: "100%",
    maxWidth: 650,
    background: "#fff",
    borderRadius: 26,
    padding: "36px 24px 44px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  heading: {
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 32,
    lineHeight: "24px",
  },

  input: {
    width: "100%",
    padding: "16px",
    fontSize: 15,
    borderRadius: 14,
    border: "1px solid #e5e5e5",
    outline: "none",
    marginBottom: 18,
    boxSizing: "border-box",
    cursor: "pointer",
  },

  dropdown: {
    position: "absolute",
    top: 60,
    width: "100%",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    zIndex: 10,
  },

  option: {
    padding: "14px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    textAlign: "left",
  },

  button: {
    width: "100%",
    padding: "16px",
    borderRadius: 16,
    background: "#7C3CFF",
    color: "#fff",
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
};