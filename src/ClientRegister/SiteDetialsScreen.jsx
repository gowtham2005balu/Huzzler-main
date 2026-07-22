// src/pages/SiteDetails.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firbase/Firebase"; // adjust path if needed
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "./client-pages.css";

const defaultCategories = [
  "Graphics & Design",
  "Programming & Tech",
  "Digital Marketing",
  "Writing & Translation",
  "Video & Animation",
  "Music & Audio",
  "AI Services",
  "Data",
  "Business",
  "Finance",
  "Photography",
  "Lifestyle",
  "Consulting",
  "Personal Growth & Hobbies",
];

const sourceOptions = ["Google", "Social Media", "Referral", "LinkedIn", "Other"];

export default function SiteDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedState = location.state || {};
  const clientData = (passedState.clientData) ? passedState.clientData : null;

  const [category, setCategory] = useState("");
  const [website, setWebsite] = useState("");
  const [locationText, setLocationText] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  if (!clientData) {
    // if user lands here without clientData, redirect back
    return (
      <div style={{ padding: 24 }}>
        <p>No client data provided. Please go back and complete previous step.</p>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  const validateLinkedIn = (url) => {
    if (!url) return true;
    try {
      const rx = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/i;
      return rx.test(url);
    } catch {
      return false;
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();

    if (!category || !source) {
      alert("Please fill all dropdown fields.");
      return;
    }

    if (!validateLinkedIn(linkedin)) {
      alert("Please enter a valid LinkedIn URL or leave empty.");
      return;
    }

    setLoading(true);

    try {
      // uid: either passed in clientData or current auth user
      const uid = clientData.uid || (auth.currentUser && auth.currentUser.uid);
      if (!uid) {
        alert("User not logged in. Please login and try again.");
        setLoading(false);
        return;
      }

      // Combine all data
      const finalData = {
        ...clientData,
        userId: uid,
        role: "client",
        category,
        website: website.trim(),
        location: locationText.trim(),
        linkedin: linkedin.trim(),
        source,
        created_at: serverTimestamp(),
      };

      // write to Firestore users/{uid} merge true
      await setDoc(doc(db, "users", uid), finalData, { merge: true });

      // success: navigate to client main screen (adjust route)
      alert("Client profile saved successfully!");
      navigate("/client-dashboard", { state: { userData: finalData, uid } });
    } catch (err) {
      console.error("Error saving client data:", err);
      alert("Failed to save client data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-page">
      <div className="card">
        <div className="header">
          <div className="logo">
            <img src="/assets/huzzler.png" alt="logo" className="logo-img" />
          </div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <h2 className="title">Set Up Your Profile For Your Workspace</h2>

        <form className="form" onSubmit={handleSave}>
          <label className="label">Select your need category</label>
          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Choose category</option>
            {defaultCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label className="label">Company website (optional)</label>
          <div className="www-field">
            <span className="www-prefix">www.</span>
            <input
              className="input www-input"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="company.com"
            />
          </div>

          <label className="label">Where are you located?</label>
          <input
            className="input"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            placeholder="City, Country"
          />

          <label className="label">LinkedIn (optional)</label>
          <input
            className="input"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://www.linkedin.com/in/username"
          />

          <label className="label">How did you hear about us?</label>
          <select
            className="select"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          >
            <option value="">Select source</option>
            {sourceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="actions">
            <button className="primary" disabled={loading}>
              {loading ? "Saving..." : "CONTINUE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
