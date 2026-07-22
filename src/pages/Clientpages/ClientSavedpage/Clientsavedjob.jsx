// frontend/src/pages/ExploreclientJobScreen.jsx
// NOTE: Firebase config should be in a different file (e.g. src/firebase.js)
// That file must export { db, auth } using Firebase v9 modular SDK.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  query,
  orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firbase/Firebase"; // 🔁 update path to your firebase file

// -------------------- UTIL FUNCTIONS -------------------- //

function timeAgo(date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatAmount(amount) {
  const num = Number(amount) || 0;
  if (num < 1000) return num.toFixed(0);
  if (num < 1_000_000) {
    const v = num / 1000;
    return `${v.toFixed(v === Math.trunc(v) ? 0 : 1)}K`;
  }
  const v = num / 1_000_000;
  return `${v.toFixed(v === Math.trunc(v) ? 0 : 1)}M`;
}

// -------------------- MAIN COMPONENT -------------------- //

export default function ExploreclientJobScreen({ initialTab = "Works" }) {
  const navigate = useNavigate();
  const auth = getAuth();

  const [selectedTab, setSelectedTab] = useState(initialTab); // "Works" | "24 hour" | "Saved"

  const [worksJobs, setWorksJobs] = useState([]);
  const [jobs24h, setJobs24h] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);

  const [loadingWorks, setLoadingWorks] = useState(true);
  const [loading24h, setLoading24h] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(false);

  const [savedJobsCombined, setSavedJobsCombined] = useState([]);

  // Notification dialog
  const [notifications, setNotifications] = useState([]); // 🔁 hook up to real backend if you want
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);

  // -------------------- FIREBASE LISTENERS -------------------- //

  // Logged in user
  const user = auth.currentUser;

  // Listen to services (Works tab)
  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setWorksJobs(list);
        setLoadingWorks(false);
      },
      (err) => {
        console.error("services snapshot error", err);
        setLoadingWorks(false);
      }
    );
    return unsub;
  }, [db]);

  // Listen to 24h services
  useEffect(() => {
    const q = query(
      collection(db, "service_24h"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setJobs24h(list);
        setLoading24h(false);
      },
      (err) => {
        console.error("service_24h snapshot error", err);
        setLoading24h(false);
      }
    );
    return unsub;
  }, [db]);

  // Listen to user document (savedJobs)
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(
      userRef,
      (snap) => {
        const data = snap.data() || {};
        setSavedJobIds(data.savedJobs || []);
      },
      (err) => console.error("user snapshot error", err)
    );
    return unsub;
  }, [db, user]);

  // Load saved jobs (merge services + service_24h) when tab = "Saved"
  useEffect(() => {
    if (selectedTab !== "Saved") return;
    if (!savedJobIds.length) {
      setSavedJobsCombined([]);
      return;
    }

    let cancelled = false;

    async function loadSavedJobs() {
      try {
        setLoadingSaved(true);

        const [servicesSnap, service24Snap] = await Promise.all([
          getDocs(collection(db, "services")),
          getDocs(collection(db, "service_24h")),
        ]);

        const all = [];

        servicesSnap.forEach((docSnap) => {
          if (savedJobIds.includes(docSnap.id)) {
            all.push({
              id: docSnap.id,
              type: "services",
              ...docSnap.data(),
            });
          }
        });

        service24Snap.forEach((docSnap) => {
          if (savedJobIds.includes(docSnap.id)) {
            all.push({
              id: docSnap.id,
              type: "service_24h",
              ...docSnap.data(),
            });
          }
        });

        if (!cancelled) {
          setSavedJobsCombined(all);
        }
      } catch (err) {
        console.error("loadSavedJobs error", err);
      } finally {
        if (!cancelled) setLoadingSaved(false);
      }
    }

    loadSavedJobs();

    return () => {
      cancelled = true;
    };
  }, [db, savedJobIds, selectedTab]);

  // -------------------- HANDLERS -------------------- //

  const toggleSavedJob = async (jobId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const isSaved = savedJobIds.includes(jobId);

    try {
      if (isSaved) {
        await updateDoc(userRef, {
          savedJobs: arrayRemove(jobId),
        });
      } else {
        await updateDoc(userRef, {
          savedJobs: arrayUnion(jobId),
        });
      }
    } catch (err) {
      console.error("toggleSavedJob error", err);
    }
  };

  const incrementImpressionsAndNavigate = async (jobId, collectionName) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const ref = doc(db, collectionName, jobId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        console.warn("Job does not exist:", collectionName, jobId);
      } else {
        const data = snap.data();
        const viewedBy = data.viewedBy || [];
        if (!viewedBy.includes(currentUser.uid)) {
          await updateDoc(ref, {
            viewedBy: arrayUnion(currentUser.uid),
            [collectionName === "service_24h" ? "views" : "impressions"]:
              increment(1),
          });
        }
      }

      if (collectionName === "service_24h") {
        // Assuming React route for 24h job detail
        navigate(`/client-dashbroad2/service-24h/${jobId}`);
      } else {
        // Works job detail
        navigate(`/service/${jobId}`);
      }
    } catch (err) {
      console.error("incrementImpressionsAndNavigate error", err);
    }
  };

  // -------------------- RENDER -------------------- //

  const screenHeaderHeight = 0.17; // not used directly but conceptually from Flutter

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <div className="relative">
        <div className="w-full bg-[#FDFD96] rounded-b-[30px] h-32 flex items-center justify-center px-4">
          <div className="flex items-center justify-between w-full max-w-3xl">
            {/* Back button (commented in Flutter, optional) */}
            {/* <button
              onClick={() => navigate(-1)}
              className="text-gray-800 p-2 rounded-full hover:bg-yellow-200"
            >
              ←
            </button> */}

            <h1 className="text-xl sm:text-2xl font-medium text-black">
              Explore jobs
            </h1>

            {/* Notification icon */}
            <NotificationIcon
              count={notifications.length}
              onClick={() => setShowNotificationDialog(true)}
            />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-3 px-4">
        <div className="flex gap-8">
          <Tab
            label="Works"
            selected={selectedTab === "Works"}
            onClick={() => setSelectedTab("Works")}
          />
          <Tab
            label="24 hour"
            selected={selectedTab === "24 hour"}
            onClick={() => setSelectedTab("24 hour")}
          />
          <Tab
            label="Saved"
            selected={selectedTab === "Saved"}
            onClick={() => setSelectedTab("Saved")}
          />
        </div>
      </div>
      <div className="mt-1 mx-4 border-b border-gray-300" />

      {/* JOB LIST */}
      <div className="flex-1 overflow-y-auto">
        {selectedTab === "Works" && (
          <WorksTab
            jobs={worksJobs}
            loading={loadingWorks}
            savedJobIds={savedJobIds}
            onToggleSaved={toggleSavedJob}
            onOpenJob={(id) => incrementImpressionsAndNavigate(id, "services")}
          />
        )}

        {selectedTab === "24 hour" && (
          <Service24hTab
            jobs={jobs24h}
            loading={loading24h}
            savedJobIds={savedJobIds}
            onToggleSaved={toggleSavedJob}
            onOpenJob={(id) =>
              incrementImpressionsAndNavigate(id, "service_24h")
            }
          />
        )}

        {selectedTab === "Saved" && (
          <SavedTab
            jobs={savedJobsCombined}
            loading={loadingSaved}
            savedJobIds={savedJobIds}
            onToggleSaved={toggleSavedJob}
            onOpenJob={(job) =>
              incrementImpressionsAndNavigate(job.id, job.type)
            }
          />
        )}
      </div>

      {/* NOTIFICATION DIALOG */}
      {showNotificationDialog && (
        <NotificationDialog
          notifications={notifications}
          onClose={() => setShowNotificationDialog(false)}
          onClearAll={() => setNotifications([])}
        />
      )}
    </div>
  );
}

// -------------------- SUB COMPONENTS -------------------- //

function Tab({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start focus:outline-none"
    >
      <span className="text-base font-semibold text-black">{label}</span>
      <span
        className={`mt-1 h-0.5 w-12 ${
          selected ? "bg-yellow-500" : "bg-transparent"
        }`}
      ></span>
    </button>
  );
}

// ----- Works Tab ----- //

function WorksTab({ jobs, loading, savedJobIds, onToggleSaved, onOpenJob }) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No services found
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-3">
      {jobs.map((job) => (
        <JobCardWorks
          key={job.id}
          job={job}
          isSaved={savedJobIds.includes(job.id)}
          onToggleSaved={() => onToggleSaved(job.id)}
          onOpen={() => onOpenJob(job.id)}
        />
      ))}
    </div>
  );
}

function JobCardWorks({ job, isSaved, onToggleSaved, onOpen }) {
  const {
    title = "",
    description = "",
    deliveryDuration = "",
    price,
    budget_from,
    budget_to,
    impressions = 0,
    createdAt,
    skills = [],
    tools = [],
  } = job;

  const priceText =
    price != null
      ? `₹${price}`
      : budget_from != null && budget_to != null
      ? `₹${budget_from} - ₹${budget_to}`
      : "₹0";

  const createdDate =
    createdAt && createdAt.toDate ? createdAt.toDate() : null;
  const timeText = createdDate ? timeAgo(createdDate) : "";

  const merged = [...skills, ...tools];
  const shown = merged.slice(0, 2);
  const remaining = merged.length - shown.length;

  return (
    <div
      onClick={onOpen}
      className="bg-white rounded-2xl border border-gray-300 shadow-sm p-4 cursor-pointer hover:shadow-md transition"
    >
      {/* Header Row */}
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-black truncate">
            {title}
          </h3>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-700">
            <span className="flex items-center gap-1">
              <span className="material-icons text-[16px]">
                remove_red_eye
              </span>
              {impressions} views
            </span>
            {timeText && <span>{timeText}</span>}
          </div>
        </div>

        {/* Price + duration badge */}
        <div className="flex flex-col items-end gap-2">
          <div className="relative">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white px-3 py-1 text-xs font-bold rounded-md shadow-sm">
              {priceText}
            </div>
            <div className="mt-6 bg-yellow-400 rounded-b-md px-4 py-1 text-xs font-bold text-black text-center min-w-[90px]">
              {deliveryDuration || "N/A"}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSaved();
            }}
          >
            <span
              className={`material-icons text-[24px] ${
                isSaved ? "text-indigo-400" : "text-gray-400"
              }`}
            >
              {isSaved ? "bookmark_add" : "bookmark_add_outlined"}
            </span>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-xs sm:text-sm text-gray-800 line-clamp-4">
        {description}
      </p>

      {/* Skills/Tools chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {shown.map((item) => (
          <span
            key={item}
            className="px-3 py-1 rounded-full bg-gray-200 text-xs font-medium text-gray-800"
          >
            {item}
          </span>
        ))}
        {remaining > 0 && (
          <span className="px-3 py-1 rounded-full bg-gray-400 text-xs font-semibold text-white">
            +{remaining}
          </span>
        )}
      </div>
    </div>
  );
}

// ----- 24 Hour Tab ----- //

function Service24hTab({
  jobs,
  loading,
  savedJobIds,
  onToggleSaved,
  onOpenJob,
}) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No services found
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-3">
      {jobs.map((job) => (
        <JobCard24h
          key={job.id}
          job={job}
          isSaved={savedJobIds.includes(job.id)}
          onToggleSaved={() => onToggleSaved(job.id)}
          onOpen={() => onOpenJob(job.id)}
        />
      ))}
    </div>
  );
}

function JobCard24h({ job, isSaved, onToggleSaved, onOpen }) {
  const {
    title = "Untitled",
    description = "",
    timeline = "24 Hours",
    budget,
    createdAt,
    views = 0,
    skills = [],
    tools = [],
  } = job;

  const budgetText = `₹${formatAmount(budget ?? 0)}`;
  const createdDate =
    createdAt && createdAt.toDate ? createdAt.toDate() : null;
  const timeText = createdDate ? timeAgo(createdDate) : "Just now";

  const merged = [...skills, ...tools];
  const shown = merged.slice(0, 2);
  const remaining = merged.length - shown.length;

  return (
    <div
      onClick={onOpen}
      className="bg-white rounded-2xl border border-gray-300 shadow-sm p-4 cursor-pointer hover:shadow-md transition"
    >
      {/* Header Row */}
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-black truncate">
            {title}
          </h3>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-700">
            <span className="flex items-center gap-1">
              <span className="material-icons text-[16px]">
                remove_red_eye
              </span>
              {views} views
            </span>
            {timeText && <span>{timeText}</span>}
          </div>
        </div>

        {/* Budget + 24h badge + save */}
        <div className="flex flex-col items-end gap-2">
          <div className="relative">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white px-3 py-1 text-xs font-bold rounded-md shadow-sm">
              {budgetText}
            </div>
            <div className="mt-6 bg-orange-400 rounded-b-md px-4 py-1 text-xs font-bold text-black text-center min-w-[90px]">
              {timeline || "24 Hours"}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSaved();
            }}
          >
            <span
              className={`material-icons text-[24px] ${
                isSaved ? "text-indigo-400" : "text-gray-400"
              }`}
            >
              {isSaved ? "bookmark_add" : "bookmark_add_outlined"}
            </span>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-xs sm:text-sm text-gray-800 line-clamp-4">
        {description}
      </p>

      {/* Skills/Tools chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {shown.map((item) => (
          <span
            key={item}
            className="px-3 py-1 rounded-full bg-gray-200 text-xs font-medium text-gray-800"
          >
            {item}
          </span>
        ))}
        {remaining > 0 && (
          <span className="px-3 py-1 rounded-full bg-gray-400 text-xs font-semibold text-white">
            +{remaining}
          </span>
        )}
      </div>
    </div>
  );
}

// ----- Saved Tab ----- //

function SavedTab({ jobs, loading, savedJobIds, onToggleSaved, onOpenJob }) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No saved jobs yet
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-3">
      {jobs.map((job) =>
        job.type === "services" ? (
          <JobCardWorks
            key={job.id}
            job={job}
            isSaved={savedJobIds.includes(job.id)}
            onToggleSaved={() => onToggleSaved(job.id)}
            onOpen={() => onOpenJob(job)}
          />
        ) : (
          <JobCard24h
            key={job.id}
            job={job}
            isSaved={savedJobIds.includes(job.id)}
            onToggleSaved={() => onToggleSaved(job.id)}
            onOpen={() => onOpenJob(job)}
          />
        )
      )}
    </div>
  );
}

// ----- Notifications ----- //

function NotificationIcon({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-xl hover:bg-yellow-200 transition"
    >
      <span className="material-icons text-gray-800 text-[24px]">
        notifications_none
      </span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

function NotificationDialog({ notifications, onClose, onClearAll }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50">
      <div className="mt-16 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#FDFD96] px-4 py-3 flex items-center gap-3">
          <div className="p-2 bg-white/30 rounded-xl">
            <span className="material-icons text-gray-900 text-[20px]">
              notifications_active
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Notifications
            </p>
            <p className="text-xs text-gray-700">
              {notifications.length}{" "}
              {notifications.length === 1 ? "notification" : "notifications"}
            </p>
          </div>
          {notifications.length > 0 && (
            <button
              className="text-xs font-semibold bg-white/40 px-2 py-1 rounded-lg mr-1"
              onClick={onClearAll}
            >
              Clear All
            </button>
          )}
          <button
            className="p-2 bg-white/40 rounded-xl"
            onClick={onClose}
          >
            <span className="material-icons text-gray-900 text-[18px]">
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-80 overflow-y-auto py-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 text-sm">
              <div className="p-4 rounded-full bg-gray-100 mb-3">
                <span className="material-icons text-[32px] text-gray-400">
                  notifications_off
                </span>
              </div>
              <p className="font-semibold text-gray-700 mb-1">
                No notifications yet
              </p>
              <p className="text-xs leading-relaxed text-gray-500">
                You're all caught up! New notifications will appear here when
                available.
              </p>
            </div>
          ) : (
            notifications.map((n, idx) => (
              <div
                key={idx}
                className="mx-4 mb-2 p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-[#FDFD96]">
                  <span className="material-icons text-gray-900 text-[20px]">
                    notifications
                  </span>
                </div>
                <div className="flex-1">
                  {n.title && (
                    <p className="text-sm font-semibold text-gray-900">
                      {n.title}
                    </p>
                  )}
                  {n.body && (
                    <p className="mt-1 text-xs text-gray-700">{n.body}</p>
                  )}
                  <p className="mt-1 text-[10px] text-gray-500">Just now</p>
                </div>
                {/* single remove button optional – you can add it */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}