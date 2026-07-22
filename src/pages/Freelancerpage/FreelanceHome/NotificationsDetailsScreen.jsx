import React, { useEffect, useState } from "react";
import "./NotificationsDetailsScreen.css";

import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  addDoc,
  collection,
} from "firebase/firestore";

import { auth, db } from "../../../firbase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

export default function WorkDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  // notification object from navigate state
  const notification = location.state?.notification || {};

  const [userId, setUserId] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [job, setJob] = useState(null);

  const jobId = notification.jobId || "";

  // auth user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });

    return () => unsub();
  }, []);

  // fetch job details
  useEffect(() => {
    const loadJob = async () => {
      if (!jobId) return;

      try {
        const snap = await getDoc(doc(db, "jobs", jobId));

        if (snap.exists()) {
          setJob({
            id: snap.id,
            ...snap.data(),
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadJob();
  }, [jobId]);

  const timeAgo = (date) => {
    if (!date) return "";

    const raw = date?.seconds
      ? new Date(date.seconds * 1000)
      : new Date(date);

    const diff = Date.now() - raw.getTime();

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `${days} days ago`;
    if (hrs > 0) return `${hrs} hrs ago`;
    if (mins > 0) return `${mins} mins ago`;

    return "Just now";
  };

  if (!job) {
    return (
      <div style={{ padding: "30px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="top-bar">
        <button onClick={() => navigate(-1)}>←</button>
      </div>

      <div className="job-card">
        <h2>{job.title || "No Title"}</h2>

        <div className="meta-grid">
          <div>
            <span>Budget</span>
            <strong>
              ₹{job.budget_from || 0} - ₹{job.budget_to || 0}
            </strong>
          </div>

          <div>
            <span>Timeline</span>
            <strong>{job.timeline || "-"}</strong>
          </div>

          <div>
            <span>Location</span>
            <strong>{job.location || "-"}</strong>
          </div>
        </div>

        <div className="bottom-meta">
          <span>{job.applicants_count || 0} Applicants</span>
          <span>{timeAgo(job.created_at)}</span>
        </div>
      </div>

      <section>
        <h3>Skills Required</h3>

        <div className="skills">
          {(job.skills || []).map((skill, i) => (
            <span key={i} className="chip">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h3>Description</h3>
        <p>{job.description || "-"}</p>
      </section>

      <div className="bottom-buttons">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}