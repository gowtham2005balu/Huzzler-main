import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firbase/Firebase";

export default function NotificationItem({ notif }) {
  const [jobTitle, setJobTitle] = useState("Job");

  useEffect(() => {
    let isMounted = true;

    const loadJob = async () => {
      try {
        if (!notif.jobId) return;
        const jobsRef = doc(db, "jobs", notif.jobId);
        const jobsSnap = await getDoc(jobsRef);

        if (jobsSnap.exists() && isMounted) {
          setJobTitle(jobsSnap.data().title || "Untitled Job");
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadJob();
    return () => {
      isMounted = false;
    };
  }, [notif]);

  return (
    <div
      style={{
        margin: "0 4% 8px 4%",
        borderRadius: 16,
        border: "1px solid #E0E0E0",
        backgroundColor: "#FAFAFA",
      }}
    >
      <div
        style={{
          padding: 14,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div
          style={{
            padding: 10,
            borderRadius: 12,
            backgroundColor: "#FDFD96",
          }}
        >
          💼
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
            {jobTitle}
          </div>
          <div style={{ fontSize: 13, color: "#757575" }}>
            Accepted:{" "}
            {notif.acceptedAt?.toDate
              ? notif.acceptedAt.toDate().toLocaleString()
              : "Just now"}
          </div>
        </div>
      </div>
    </div>
  );
}
