import React, { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useNavigate } from "react-router-dom";

import backarrow from "../../assets/backarrow.png";
import edit from "../../assets/edit.png";

const isMobile = () => window.matchMedia("(max-width: 768px)").matches;


const globalFont = {
  fontFamily: "Rubik, sans-serif",
};


const styles = {
  screen: {
    width: "100%",
    minHeight: "100vh",
    overflowX: "hidden",
    overflowY: "auto",
    ...globalFont,
  },
  formCard: {
    width: isMobile() ? "90%" : "50%",
    margin: "40px auto",
    background: "#fff",
    padding: "25px 20px 35px",
    borderRadius: 20,
    boxShadow: "0 4px 25px rgba(0,0,0,0.07)",
  },
  inputBlock: {
    marginBottom: 18,
  },
  label: {
    fontSize: 20,
    marginBottom: 6,
    display: "block",
    fontWeight: 400,
  },
  input: {
    width: "98%",
    padding: "10px 12px",
    borderRadius: 8,
    background: "rgba(254,254,215,1)",
    border: "1px solid #ddd",
    fontSize: 14,
  },
  textarea: {
    width: "98%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    height: 90,
    fontSize: 14,
    background: "rgba(254,254,215,1)",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 25,
    gap: 10,
  },
  cancelBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    background: "#f2f2f2",
    border: "1px solid #ddd",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    background: "rgba(124,60,255,1)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default function CompanyProfileEdit() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();


  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );


  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);


  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [Company_name, setCompany_name] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");


  useEffect(() => {
    const fn = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", fn);
    return () => window.removeEventListener("sidebar-toggle", fn);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setIsLoading(false);
        return;
      }

      setUser(u);

      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const d = snap.data();
          setCompany_name(d.Company_name || "");
          setIndustry(d.category || "");
          setSize(d.team_size || "");
          setDescription(d.businessInfo || "");
          setEmail(d.email || u.email || "");
          setLocation(d.location || "");
          setProfileImageUrl(d.profileImage || "");

        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsub();
  }, []);

  /* SAVE */
  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        Company_name: Company_name,
        category: industry,
        team_size: size,
        businessInfo: description,
        email,
        location,
        profileImage: profileImageUrl,
        updated_at: serverTimestamp(),
      });a


      navigate(-1); // back to view page
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setIsSaving(false);
    }
  };

  /* LOADING SCREEN */
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        Loading profile…
      </div>
    );
  }

  /* UI */
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <div style={styles.screen}>
        <div style={styles.formCard}>
          <Input label="Company Name" value={Company_name} onChange={setCompany_name} />
          <Input label="Industry" value={industry} onChange={setIndustry} />
          <Input label="Company Size" value={size} onChange={setSize} />
          <Input label="Location" value={location} onChange={setLocation} />
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="About Company" value={description} onChange={setDescription} multiline />


          <div style={styles.actionRow}>
            <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              style={styles.saveBtn}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   INPUT COMPONENT
------------------------------------------------------------ */
function Input({ label, value, onChange, multiline }) {
  return (
    <div style={styles.inputBlock}>
      <label style={styles.label}>{label}</label>
      {multiline ? (
        <textarea
          style={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          style={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}