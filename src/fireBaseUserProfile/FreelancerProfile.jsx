// ClientProfileMenuScreen.jsx — PART 1 of 6
// Note: Firebase app initialization (initializeApp) must be done elsewhere in your project.
// This file uses firebase v9 modular APIs but does NOT include firebase config.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// UI helpers
import { XIcon } from "@heroicons/react/24/solid"; // optional; replace if not using heroicons
// If you don't have @heroicons, just remove the import and use simple text/icon.

//
// NOTE: Images/SVGs referenced below (assets/*) should exist in your project's public or src/assets folder.
//

// ----------------- Helper utilities -----------------
function safeParseInt(v) {
  if (v == null) return null;
  if (typeof v === "number") return Math.floor(v);
  if (typeof v === "string") {
    const n = parseInt(v.replace(/[^\d]/g, ""), 10);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

function formatPostedDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString();
}

// ----------------- Component -----------------
export default function ClientProfileMenuScreenPart1Placeholder() {
  // navigation
  const navigate = useNavigate();

  // firebase instances (app must be initialized in parent app)
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  // user & data
  const [currentUser, setCurrentUser] = useState(() => auth.currentUser || null);
  const [userData, setUserData] = useState(null); // object from users collection
  const userDataRef = useRef(null);

  // UI state
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  // subscribe to auth changes (in case user signs out/in elsewhere)
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
      if (!u) {
        // optional: redirect to login if needed
        // navigate("/login");
      }
    });
    return () => unsubAuth();
  }, [auth, navigate]);

  // fetch user data (real-time) — mirrors the Flutter FutureProvider behavior
  useEffect(() => {
    if (!currentUser) {
      setUserData(null);
      return;
    }
    const uRef = doc(db, "users", currentUser.uid);
    userDataRef.current = uRef;

    // realtime snapshot (keeps profile image, name, saved etc in sync)
    const unsub = onSnapshot(
      uRef,
      (snap) => {
        if (!snap.exists()) {
          setUserData(null);
          return;
        }
        const data = snap.data();
        setUserData(data);
        // local override if previously uploaded in this session
        if (data?.profileImage) setProfileImageUrl(data.profileImage);
      },
      (err) => {
        console.error("user snapshot error", err);
      }
    );

    return () => unsub();
  }, [currentUser, db]);

  // ----------------- Image upload -----------------
  // We will trigger a hidden <input type="file"> via button and upload to storage
  async function handlePickProfileImage(event) {
    const file = event?.target?.files?.[0];
    if (!file || !currentUser) return;

    try {
      setIsUploadingProfile(true);
      const path = `users/${currentUser.uid}/profile.jpg`;
      const ref = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(ref, file, {
        contentType: file.type,
      });

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          // progress
          (snapshot) => {
            // you can compute progress if desired:
            // const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          // error
          (err) => reject(err),
          // complete
          () => resolve()
        );
      });

      const downloadURL = await getDownloadURL(storageRef(storage, path));
      // update Firestore user doc
      const uRef = doc(db, "users", currentUser.uid);
      await updateDoc(uRef, { profileImage: downloadURL });
      setProfileImageUrl(downloadURL);
    } catch (e) {
      console.error("Error uploading profile image:", e);
      // show toast/snackbar in UI (handled in UI parts)
    } finally {
      setIsUploadingProfile(false);
      // clear input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function triggerFilePicker() {
    if (isUploadingProfile) return;
    if (fileInputRef.current) fileInputRef.current.click();
  }

  // ----------------- Logout -----------------
  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/freelance-dashboard", { replace: true });

    } catch (e) {
      console.error("Sign out error:", e);
    }
  }

  // ----------------- Menu actions (navigations) -----------------
  function openSavedTab() {
    // navigate to ExploreclientJobScreen with query param or state to open Saved tab
    navigate("/explore-client-jobs", { state: { initialTab: "Saved" } });
  }

  function openProfileSettings() {
    navigate("/Profilebuilder");
  }
  function openAddJob() {
    navigate("/add-job");
  }
  function openMyHires() {
    navigate("/my-hires");
  }
  function openPausedJobs() {
    navigate("/paused-jobs");
  }

  // ----------------- Derived UI values -----------------
  const fullName = useMemo(() => {
    if (!userData) return "";
    const first = userData.first_name ?? userData.firstName ?? "";
    const last = userData.last_name ?? userData.lastName ?? "";
    return `${first} ${last}`.trim() || "User";
  }, [userData]);

  // ----------------- Return placeholder UI for part 1 -----------------
  // Full UI/JSX will be provided in subsequent parts (header, menu items, icons, styles).
  // Part 1 focuses on logic + firebase hooks.
  return (
    <div className="client-profile-part1">
      {/* Hidden file input for profile image */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePickProfileImage}
        style={{ display: "none" }}
      />

      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                overflow: "hidden",
                background: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isUploadingProfile ? (
                <div style={{ fontSize: 12 }}>Uploading...</div>
              ) : (
                <img
                  src={profileImageUrl || (userData?.profileImage ?? "/assets/profile.png")}
                  alt="profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <button
              onClick={triggerFilePicker}
              disabled={isUploadingProfile}
              style={{ marginTop: 8 }}
            >
              Edit
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{fullName}</div>
            <div style={{ color: "#666", marginTop: 6 }}>
              {userData?.email || currentUser?.email}
            </div>
          </div>

          <div>
            <button onClick={handleLogout} style={{ color: "red" }}>
              Log out
            </button>
          </div>
        </div>

        <div style={{ marginTop: 20, color: "#666" }}>
          {/* placeholder: full UI/menu will be provided in Part 2+ */}
          ClientProfileMenuScreen — Part 1 loaded (logic + firebase hooks).
        </div>
      </div>
    </div>
  );
}