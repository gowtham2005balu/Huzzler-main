import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firbase/Firebase"; // your firebase config

import "./ExploreJobs.css";

/* ----------------- Format amount ----------------- */
const formatAmount = (amount) => {
  if (!amount) return 0;
  if (amount < 1000) return amount;
  if (amount < 1000000) return (amount / 1000).toFixed(1).replace(".0", "") + "K";
  return (amount / 1000000).toFixed(1).replace(".0", "") + "M";
};

/* ----------------- TIME AGO (custom) ----------------- */
const timeAgo = (date) => {
  if (!date) return "";

  const diff = (new Date() - date) / 1000; // seconds
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hr ago";
  return Math.floor(diff / 86400) + " day" + (Math.floor(diff / 86400) > 1 ? "s" : "") + " ago";
};

/* ----------------- Tag Component ----------------- */
const Tag = ({ text, isCount }) => (
  <span className={`tag ${isCount ? "tag-count" : ""}`}>{text}</span>
);

/* ----------------- Works Job Card ----------------- */
const WorksJobCard = ({ job, jobId, savedJobsIds, currentUser }) => {
  const isSaved = savedJobsIds.includes(jobId);

  const handleSave = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      favoriteJobs: isSaved ? arrayRemove(jobId) : arrayUnion(jobId),
    });
  };

  const handleClick = async () => {
    if (!currentUser) return;

    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);
    const data = jobSnap.data();
    const viewedBy = data?.viewedBy || [];

    if (!viewedBy.includes(currentUser.uid)) {
      await updateDoc(jobRef, {
        viewedBy: arrayUnion(currentUser.uid),
        views: increment(1),
      });
    }

    console.log("Navigate to job detail:", jobId);
  };

  const skillsAndTools = [
    ...(job.skills || []).slice(0, 2),
    ...(job.tools || []).slice(0, 1),
  ].slice(0, 2);

  const remaining = (job.skills?.length + job.tools?.length || 0) - skillsAndTools.length;

  return (
    <div className="job-card" onClick={handleClick}>
      <div className="job-card-header">
        <div>
          <h3>{job.title}</h3>
          <div className="job-meta">
            <span>👁 {job.views || 0} views</span>
            <span>
              {job.created_at ? timeAgo(job.created_at.toDate()) : ""}
            </span>
          </div>
        </div>

        <div className="job-budget">
          <div>₹{formatAmount(job.budget_from)} - ₹{formatAmount(job.budget_to)}</div>
          <div>{job.timeline}</div>
        </div>

        <button
          className="save-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
        >
          {isSaved ? "🔖" : "📑"}
        </button>
      </div>

      <p className="job-desc">{job.description}</p>

      <div className="job-tags">
        {skillsAndTools.map((t, i) => (
          <Tag key={i} text={t} />
        ))}
        {remaining > 0 && <Tag text={`+${remaining}`} isCount />}
      </div>
    </div>
  );
};

/* ----------------- 24H Card ----------------- */
const Hour24JobCard = ({ job, jobId, savedJobsIds, currentUser }) => {
  const isSaved = savedJobsIds.includes(jobId);

  const handleSave = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);

    await updateDoc(userRef, {
      favoriteJobs: isSaved ? arrayRemove(jobId) : arrayUnion(jobId),
    });
  };

  const handleClick = async () => {
    if (!currentUser) return;

    const jobRef = doc(db, "jobs_24h", jobId);
    const jobSnap = await getDoc(jobRef);
    const data = jobSnap.data();
    const viewedBy = data?.viewedBy || [];

    if (!viewedBy.includes(currentUser.uid)) {
      await updateDoc(jobRef, {
        viewedBy: arrayUnion(currentUser.uid),
        views: increment(1),
      });
    }

    console.log("Navigate to 24h job detail:", jobId);
  };

  const skillsAndTools = [
    ...(job.skills || []).slice(0, 2),
    ...(job.tools || []).slice(0, 1),
  ].slice(0, 2);

  const remaining = (job.skills?.length + job.tools?.length || 0) - skillsAndTools.length;

  return (
    <div className="job-card" onClick={handleClick}>
      <div className="job-card-header">
        <div>
          <h3>{job.title}</h3>
          <div className="job-meta">
            <span>👁 {job.views || 0} views</span>
            <span>
              {job.created_at ? timeAgo(job.created_at.toDate()) : ""}
            </span>
          </div>
        </div>

        <div className="job-budget">
          <div>₹{job.budget}</div>
          <div>24 Hours</div>
        </div>

        <button
          className="save-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
        >
          {isSaved ? "🔖" : "📑"}
        </button>
      </div>

      <p className="job-desc">{job.description}</p>

      <div className="job-tags">
        {skillsAndTools.map((t, i) => (
          <Tag key={i} text={t} />
        ))}
        {remaining > 0 && <Tag text={`+${remaining}`} isCount />}
      </div>
    </div>
  );
};

/* ----------------- Main ExploreJobs Component ----------------- */
export default function ExploreJobs() {
  const [selectedTab, setSelectedTab] = useState("Works");
  const [savedJobsIds, setSavedJobsIds] = useState([]);
  const [worksJobs, setWorksJobs] = useState([]);
  const [jobs24h, setJobs24h] = useState([]);

  const currentUser = getAuth().currentUser;

  /* --- Listen to user's saved jobs --- */
  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, "users", currentUser.uid), (snap) => {
      setSavedJobsIds(snap.data()?.favoriteJobs || []);
    });
    return () => unsub();
  }, [currentUser]);

  /* --- Fetch works jobs --- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snap) => {
      setWorksJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  /* --- Fetch 24h jobs --- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs_24h"), (snap) => {
      setJobs24h(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const renderJobs = () => {
    if (selectedTab === "Works") {
      return worksJobs.map((job) => (
        <WorksJobCard
          key={job.id}
          job={job}
          jobId={job.id}
          savedJobsIds={savedJobsIds}
          currentUser={currentUser}
        />
      ));
    }

    if (selectedTab === "24 hour") {
      return jobs24h.map((job) => (
        <Hour24JobCard
          key={job.id}
          job={job}
          jobId={job.id}
          savedJobsIds={savedJobsIds}
          currentUser={currentUser}
        />
      ));
    }

    if (selectedTab === "Saved") {
      const all = [...worksJobs, ...jobs24h].filter((job) =>
        savedJobsIds.includes(job.id)
      );

      return all.length === 0 ? (
        <p>No saved jobs</p>
      ) : (
        all.map((job) => {
          const is24 = jobs24h.some((x) => x.id === job.id);
          return is24 ? (
            <Hour24JobCard key={job.id} job={job} jobId={job.id} savedJobsIds={savedJobsIds} currentUser={currentUser} />
          ) : (
            <WorksJobCard key={job.id} job={job} jobId={job.id} savedJobsIds={savedJobsIds} currentUser={currentUser} />
          );
        })
      );
    }
  };

  return (
    <div className="explore-jobs">
      <header className="explore-header">
        <h2>Explore Jobs</h2>

        <div className="tabs">
          {["Works", "24 hour", "Saved"].map((tab) => (
            <button
              key={tab}
              className={selectedTab === tab ? "tab-selected" : ""}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="jobs-list">{renderJobs()}</div>
    </div>
  );
}
