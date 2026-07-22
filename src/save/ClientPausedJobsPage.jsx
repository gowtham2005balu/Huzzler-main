import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firbase/Firebase";
import "./PausedServicesPage.css";

const ClientPausedJobsPage = () => {
  const [pausedJobs, setPausedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH PAUSED JOBS
  const fetchPausedJobs = async () => {
    try {
      const colRef = collection(db, "pausedJobs");
      const snapshot = await getDocs(colRef);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPausedJobs(list);
    } catch (error) {
      console.error("Error fetching paused jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPausedJobs();
  }, []);

  // RESUME JOB
  const handleResume = async (job) => {
    try {
      // Return job to correct collection
      const targetCollection = job.is24h ? "jobs_24h" : "jobs";
      const jobId = job.originalId || job.id;

      const jobRef = doc(db, targetCollection, jobId);

      // Remove paused-data fields
      const { id, originalId, isPaused, ...restoredData } = job;

      // Create or update
      await updateDoc(jobRef, {
        ...restoredData,
        isPaused: false
      }).catch(async () => {
        await setDoc(jobRef, {
          ...restoredData,
          isPaused: false
        });
      });

      // Delete paused doc
      await deleteDoc(doc(db, "pausedJobs", job.id));

      // Update UI
      setPausedJobs((prev) => prev.filter((j) => j.id !== job.id));

      alert("Job resumed successfully!");
    } catch (error) {
      console.error("Error resuming job:", error);
    }
  };

  // DELETE JOB PERMANENTLY FROM pausedJobs
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "pausedJobs", id));
      setPausedJobs((prev) => prev.filter((j) => j.id !== id));
      alert("Job deleted.");
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (loading) return <p>Loading paused jobs...</p>;

  return (
    <div className="paused-services-container">
      <h1>Paused Client Jobs</h1>

      {pausedJobs.length === 0 ? (
        <p>No paused jobs found.</p>
      ) : (
        <div className="paused-services-list">
          {pausedJobs.map((job) => (
            <div key={job.id} className="paused-service-card">
              <h2>{job.title}</h2>
              <p>{job.description}</p>

              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Budget:</strong> ₹{job.budget}</p>

              <p style={{ fontStyle: "italic" }}>
                {job.is24h ? "24-Hour Job" : "Normal Job"}
              </p>

              <div className="actions">
                <button className="resume-btn" onClick={() => handleResume(job)}>
                  Resume
                </button>

                <button className="delete-btn" onClick={() => handleDelete(job.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientPausedJobsPage;
