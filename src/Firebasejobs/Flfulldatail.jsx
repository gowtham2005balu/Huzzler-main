import React, { useEffect, useState } from "react";
import { auth, db, rtdb } from "../firbase/Firebase";
import {
  doc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  getDoc
} from "firebase/firestore";
import { ref as dbRef, set as dbSet, update as dbUpdate } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

// ---------------------------
// Placeholder Components
// ---------------------------
function ChatScreen({ currentUid, otherUid, otherName, initialMessage }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Chat with {otherName}</h2>
      <p className="mt-4 text-sm text-gray-600">Chat initial message:</p>
      <pre className="mt-2 bg-gray-100 p-3 rounded">{initialMessage}</pre>
      <div className="mt-6 text-gray-500">[Replace with your real Chat component]</div>
    </div>
  );
}

function JobDetail({ job }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">{job.title || "Job Detail"}</h2>
      <p className="mt-2 text-gray-700">{job.description}</p>
      <div className="mt-4 text-sm text-gray-500">[Replace with your JobDetail implementation]</div>
    </div>
  );
}

// ---------------------------
// Main Component
// ---------------------------
export default function FreelancerFullDetail({ linkedinUrl: propLinkedinUrl, userId: propUserId, jobid: propJobId }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("work"); // 'work' or '24h'
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [jobsList, setJobsList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [workServices, setWorkServices] = useState([]);
  const [hours24Services, set24hServices] = useState([]);
  const [error, setError] = useState(null);
  const [route, setRoute] = useState({ name: "profile", params: {} });

  const freelancerUid = propUserId || null;

  // ---------------------------
  // Auth Listener
  // ---------------------------
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  // ---------------------------
  // Load Profile, Portfolio, Services
  // ---------------------------
  useEffect(() => {
    if (!freelancerUid) {
      setError("No user logged in / freelancer id not provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const userDocRef = doc(db, "users", freelancerUid);

    const unsubProfile = onSnapshot(
      userDocRef,
      (snap) => {
        if (snap.exists()) setProfile(snap.data());
        else setProfile(null);
        setIsLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err.message || String(err));
        setIsLoading(false);
      }
    );

    const unsubPortfolio = onSnapshot(collection(db, "users", freelancerUid, "portfolio"), (snap) => {
      setPortfolioItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubServices = onSnapshot(
      query(collection(db, "users", freelancerUid, "services"), orderBy("createdAt", "desc")),
      (snap) => setWorkServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const unsub24 = onSnapshot(
      query(collection(db, "users", freelancerUid, "services_24h"), orderBy("createdAt", "desc")),
      (snap) => set24hServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    _checkIfRequestedAndAccepted();

    return () => {
      unsubProfile();
      unsubPortfolio();
      unsubServices();
      unsub24();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freelancerUid]);

  // ---------------------------
  // Check Requests & Accepted
  // ---------------------------
  async function _checkIfRequestedAndAccepted() {
    try {
      const me = auth.currentUser;
      if (!me || !freelancerUid) return;

      const reqSnap = await getDocs(
        query(
          collection(db, "collaboration_requests"),
          where("clientId", "==", me.uid),
          where("freelancerId", "==", freelancerUid),
          where("status", "==", "sent")
        )
      );
      setIsRequested(!reqSnap.empty);

      const accSnap = await getDocs(
        query(
          collection(db, "accepted_jobs"),
          where("clientId", "==", me.uid),
          where("freelancerId", "==", freelancerUid)
        )
      );
      setIsAccepted(!accSnap.empty);
    } catch (err) {
      console.error(err);
    }
  }

  // ---------------------------
  // Fetch Current User Jobs
  // ---------------------------
  async function _fetchMyJobs() {
    try {
      const me = auth.currentUser;
      if (!me) return [];
      const arr = [];
      const q1 = query(collection(db, "jobs"), where("userId", "==", me.uid));
      const q2 = query(collection(db, "jobs_24h"), where("userId", "==", me.uid));
      const s1 = await getDocs(q1);
      const s2 = await getDocs(q2);
      s1.forEach((d) => arr.push({ id: d.id, type: "services", ...d.data() }));
      s2.forEach((d) => arr.push({ id: d.id, type: "services_24h", ...d.data() }));
      setJobsList(arr);
      return arr;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  // ---------------------------
  // Utility Functions
  // ---------------------------
  function toast(msg) {
    alert(msg);
  }

  function _openLinkedIn(url) {
    if (!url) return toast("No LinkedIn profile available");
    const fixed = url.startsWith("http") ? url : `https://${url}`;
    window.open(fixed, "_blank", "noopener,noreferrer");
  }

  function shareProfile(linkedinUrl, fullName) {
    try {
      const fixed = linkedinUrl ? (linkedinUrl.startsWith("http") ? linkedinUrl : `https://${linkedinUrl}`) : "";
      const text = fixed ? `Check out ${fullName}'s professional profile: ${fixed}` : `Check out ${fullName}'s professional profile`;
      if (navigator.share) navigator.share({ title: `Profile - ${fullName}`, text, url: fixed });
      else navigator.clipboard?.writeText(text).then(() => toast("Profile copied to clipboard"));
    } catch (err) {
      console.error(err);
      toast("Error sharing profile");
    }
  }

  function shareService(job) {
    const title = job?.title || "Service";
    const price = job?.price || job?.budget || "0";
    const text = `Check out this service: ${title}\nPrice: ₹${price}`;
    if (navigator.share) navigator.share({ title: `Service - ${title}`, text });
    else navigator.clipboard?.writeText(text).then(() => toast("Service details copied to clipboard"));
  }

  function Chips({ items = [] }) {
    return (
      <div className="flex space-x-2 overflow-x-auto py-1">
        {items.map((s, i) => <span key={i} className="px-3 py-1 bg-white border rounded-full text-sm">{s}</span>)}
      </div>
    );
  }

  function openJobDetail(job) {
    setRoute({ name: "jobDetail", params: { job } });
  }

  // ---------------------------
  // Render Routing
  // ---------------------------
  if (route.name === "chat") {
    const { currentUid, otherUid, otherName, initialMessage } = route.params;
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="p-4">
            <button className="px-3 py-1 text-sm bg-white rounded shadow" onClick={() => setRoute({ name: "profile", params: {} })}>
              ← Back
            </button>
          </div>
          <ChatScreen currentUid={currentUid} otherUid={otherUid} otherName={otherName} initialMessage={initialMessage} />
        </div>
      </div>
    );
  }

  if (route.name === "jobDetail") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="p-4">
            <button className="px-3 py-1 text-sm bg-white rounded shadow" onClick={() => setRoute({ name: "profile", params: {} })}>
              ← Back
            </button>
          </div>
          <JobDetail job={route.params.job} />
        </div>
      </div>
    );
  }

  // ---------------------------
  // Main Profile View
  // ---------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-lg font-semibold mb-4">Freelancer Profile</h1>
        {isLoading ? (
          <div className="text-center py-24">
            <div className="animate-spin h-8 w-8 border-4 border-yellow-300 border-t-transparent rounded-full mx-auto" />
            <p className="mt-3 text-gray-600">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-white rounded shadow text-center">
            <p className="text-red-500">{error}</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : !profile ? (
          <div className="p-8 bg-white rounded shadow text-center">
            <p className="text-gray-500">User profile not found</p>
          </div>
        ) : (
          <div>
            {/* Profile Header, Portfolio, Services... */}
            {/* Your full profile JSX remains unchanged */}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------
// Service Menu Helper
// ---------------------------
function ServiceMenu({ job, onEdit, onShare, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="px-2 py-1 bg-white rounded">⋯</button>
      {open && (
        <div className="absolute right-0 mt-2 bg-yellow-100 rounded shadow p-2 w-36 z-20">
          <button onClick={() => { setOpen(false); onEdit?.(); }} className="block w-full text-left px-3 py-1">Edit</button>
          <button onClick={() => { setOpen(false); onShare?.(); }} className="block w-full text-left px-3 py-1">Share</button>
          <button onClick={() => { setOpen(false); onDelete?.(); }} className="block w-full text-left px-3 py-1 text-red-600">Delete</button>
        </div>
      )}
    </div>
  );
}
