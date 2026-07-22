import React, { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firbase/Firebase";
import { format } from "date-fns";

// ==========================
// Job Meta Info Component
// ==========================
const JobMetaInfo = ({ jobData }) => {
  if (!jobData) return null;

  const views = jobData.views || 0;
  const applicantsCount = jobData.applicants_count || 0;
  const createdAt = jobData.created_at ? jobData.created_at.toDate() : null;

  const formatTimeAgo = (date) => {
    if (!date) return "";
    const diff = Date.now() - date.getTime();

    const minutes = diff / 1000 / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    if (minutes < 60) return `${Math.floor(minutes)} min ago`;
    if (hours < 24) return `${Math.floor(hours)} hr${hours > 1 ? "s" : ""} ago`;

    return format(date, "dd MMM yyyy");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        fontFamily: "Rubik, sans-serif",
        fontSize: "12px",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginRight: "16px" }}
      >
        <span>👁️</span>
        <span style={{ marginLeft: "4px" }}>{views} views</span>
      </div>

      <div
        style={{ display: "flex", alignItems: "center", marginRight: "auto" }}
      >
        <span>👥</span>
        <span style={{ marginLeft: "4px" }}>{applicantsCount} applicants</span>
      </div>

      <div style={{ fontStyle: "italic" }}>{formatTimeAgo(createdAt)}</div>
    </div>
  );
};

// ==========================
// Main Job Full Detail Page
// ==========================
const JobFullDetailJobScreen = ({ jobId }) => {
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // ---------------------------
  // Fetch Job Data (Real-time)
  // ---------------------------
  useEffect(() => {
    if (!jobId) return;

    const unsub = onSnapshot(doc(db, "jobs", jobId), (docSnap) => {
      if (docSnap.exists()) {
        const jobData = docSnap.data();
        setJob(jobData);

        const applicants = jobData?.applicants || [];
        setIsApplied(applicants.some((a) => a.freelancerId === userId));
      }
    });

    return () => unsub();
  }, [jobId, userId]);

  // ---------------------------
  // Fetch User Saved Jobs
  // ---------------------------
  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(doc(db, "users", userId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        const saved = Array.isArray(data?.favoriteJobs)
          ? data.favoriteJobs
          : [];

        setIsSaved(saved.includes(jobId));
      }
    });

    return () => unsub();
  }, [jobId, userId]);

  // ---------------------------
  // Apply for Job
  // ---------------------------
  const applyForJob = async () => {
    if (!job || !userId || isApplied) return;

    const applicantData = {
      freelancerId: userId,
      name: currentUser?.displayName || "",
      profileImage: currentUser?.photoURL || "",
      appliedAt: new Date(),
    };

    await updateDoc(doc(db, "jobs", jobId), {
      applicants: arrayUnion(applicantData),
      applicants_count: (job.applicants_count || 0) + 1,
    });

    setIsApplied(true);
  };

  // ---------------------------
  // Save / Unsave Job
  // ---------------------------
  const toggleSaveJob = async () => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);

    if (isSaved) {
      await updateDoc(userRef, { favoriteJobs: arrayRemove(jobId) });
    } else {
      await updateDoc(userRef, { favoriteJobs: arrayUnion(jobId) });
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div style={{ fontFamily: "Rubik, sans-serif", padding: "1rem" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#FDFD96",
          padding: "1rem",
          borderRadius: "0 0 30px 30px",
        }}
      >
        <h1>Explore Jobs</h1>
      </div>

      {/* Title */}
      <h2>{job.title}</h2>

      {/* Meta Info */}
      <JobMetaInfo jobData={job} />

      {/* Description */}
      <p>{job.description}</p>

      {/* Skills & Tools */}
      <div>
        <h4>Skills & Tools</h4>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(job.skills || []).map((s, i) => (
            <span
              key={i}
              style={{
                border: "1px solid #ccc",
                borderRadius: "30px",
                padding: "4px 10px",
              }}
            >
              {s}
            </span>
          ))}
          {(job.tools || []).map((t, i) => (
            <span
              key={i}
              style={{
                border: "1px solid #ccc",
                borderRadius: "30px",
                padding: "4px 10px",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div style={{ marginTop: "1rem" }}>
        <h4>Budget</h4>
        <p>
          ₹{job.budget_from} - ₹{job.budget_to}
        </p>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={applyForJob}
          disabled={isApplied}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "30px",
            backgroundColor: "#FDFD96",
            border: "none",
            cursor: isApplied ? "not-allowed" : "pointer",
          }}
        >
          {isApplied ? "Applied" : "Apply"}
        </button>

        <button
          onClick={toggleSaveJob}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "30px",
            border: "1px solid #FDFD96",
            backgroundColor: "#fff",
          }}
        >
          {isSaved ? "Bookmarked" : "Bookmark"}
        </button>
      </div>
    </div>
  );
};

export default JobFullDetailJobScreen;
