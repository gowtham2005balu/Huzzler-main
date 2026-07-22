// FreelancerPage.jsx (FULL A–Z)
// ----------------------------------------------------------
// This screen ONLY:
// 1. Reads /connect/:uid route param
// 2. Reads jobid passed through navigate()
// 3. Passes both safely to FreelancerFullDetailScreen
// ----------------------------------------------------------

import React from "react";
import { useParams, useLocation } from "react-router-dom";

// 🔥 Import your full detail screen
import FreelancerFullDetailScreen from "../Firebasejobs/FreelancerFullDetail";

export default function FreelancerPage() {
  // Route params → /connect/:uid
  const { uid } = useParams();

  // State passed from previous screen (HomeScreen → "jobid")
  const location = useLocation();
  const passedJobId = location?.state?.jobid ?? null;

  // Safety fallback
  const safeUid = uid || null;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <FreelancerFullDetailScreen
        userId={safeUid}
        jobid={passedJobId}
      />
    </div>
  );
}