import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firbase/Firebase";

export default function WorkDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const job = state?.job;

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const [isApplied, setIsApplied] = useState(false);

  const jobId = job?.id;

  // 🚨 Handle refresh / no data
  useEffect(() => {
    if (!job) {
      alert("No job data");
      navigate(-1);
    }
  }, [job]);

  // 🔍 Check applied
  useEffect(() => {
    const checkApplied = async () => {
      if (!jobId || !userId) return;

      const snap = await getDoc(doc(db, "jobs_24h", jobId));
      const applicants = snap.data()?.applicants || [];

      const already = applicants.some(
        (a) => a.freelancerId === userId
      );

      setIsApplied(already);
    };

    checkApplied();
  }, [jobId, userId]);

  // 🚀 Apply Job
  const applyJob = async () => {
    if (isApplied) return;
    if (!userId) return alert("Login required");

    try {
      const userSnap = await getDoc(doc(db, "users", userId));
      const userData = userSnap.data() || {};

      const freelancerName = `${userData.firstName || ""} ${userData.lastName || ""}`;
      const freelancerImage = userData.profileImage || "";

      const jobSnap = await getDoc(doc(db, "jobs_24h", jobId));
      const jobData = jobSnap.data();

      if (!jobData) return alert("Job not found");

      const clientUid = jobData.userId;

      await updateDoc(doc(db, "jobs_24h", jobId), {
        applicants: arrayUnion({
          freelancerId: userId,
          name: freelancerName,
          profileImage: freelancerImage,
          appliedAt: new Date(),
        }),
        applicants_count: increment(1),
      });

      await addDoc(collection(db, "notifications"), {
        title: jobData.title,
        body: `${freelancerName} applied`,
        freelancerId: userId,
        jobId,
        clientUid,
        timestamp: serverTimestamp(),
        read: false,
      });

      setIsApplied(true);
      alert("Application sent ✅");
    } catch (e) {
      console.error(e);
      alert("Error applying");
    }
  };

  const shareApp = () => {
    navigator.clipboard.writeText(
      "https://play.google.com/store/apps/details?id=com.huzzler.app"
    );
    alert("Link copied!");
  };

  if (!job) return null;

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <button onClick={() => navigate(-1)}>←</button>
        <button onClick={shareApp}>🔗</button>
      </div>

      {/* Content */}
      <div style={S.content}>
        <JobCard job={job} />

        <Section title="Skills Required">
          <Skills skills={job.skills || []} />
        </Section>

        <Section title="Project Description">
          <p>{job.description}</p>
        </Section>

        {job.employmentType && (
          <Section title="Employment Type">
            <p>{job.employmentType}</p>
          </Section>
        )}

        {job.clientRequirements && (
          <Section title="Project Requirements">
            <p>{job.clientRequirements}</p>
          </Section>
        )}

        {job.sampleProjectUrl && (
          <Section title="Sample Project">
            <a href={job.sampleProjectUrl} target="_blank">
              {job.sampleProjectUrl}
            </a>
          </Section>
        )}
      </div>

      {/* Bottom */}
      <div style={S.bottom}>
        <button onClick={() => navigate(-1)}>Back</button>
        <button onClick={applyJob} disabled={isApplied}>
          {isApplied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////////////
// 🔹 COMPONENTS
//////////////////////////////////////////////////////////////////

function JobCard({ job }) {
  return (
    <div style={S.card}>
      <h3>{job.title}</h3>

      <div style={S.row}>
        <span>💰 ₹{job.budget_from} - ₹{job.budget_to}</span>
        <span>⏰ {job.timeline || "N/A"}</span>
        <span>📍 {job.location || "Remote"}</span>
      </div>

      <div style={S.row}>
        <span>👥 {job.applicants_count || 0} Applicants</span>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

function Skills({ skills }) {
  if (!skills.length) return <p>No skills</p>;

  return (
    <div style={S.skills}>
      {skills.map((s, i) => (
        <span key={i} style={S.chip}>
          {s}
        </span>
      ))}
    </div>
  );
}

//////////////////////////////////////////////////////////////////
// 🎨 STYLES
//////////////////////////////////////////////////////////////////

const S = {
  root: { padding: 16, fontFamily: "Poppins" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  content: { marginTop: 10 },

  card: {
    background: "#FFFDEB",
    padding: 16,
    borderRadius: 12,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    background: "#eee",
    padding: "6px 12px",
    borderRadius: 20,
  },

  bottom: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    gap: 10,
    padding: 10,
    background: "#fff",
  },
};