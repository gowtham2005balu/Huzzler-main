import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firbase/Firebase"; // <-- update path if needed

const SaveJobButton = ({ jobId, savedJobs, onSavedChanged }) => {
  const [isSaved, setIsSaved] = useState(false);

  // sync state when parent updates savedJobs
  useEffect(() => {
    setIsSaved(savedJobs?.includes(jobId));
  }, [savedJobs, jobId]);

  const toggleSave = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      // redirect to login
      window.location.href = "/firelogin";
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);

    try {
      if (isSaved) {
        // remove from favorites
        await updateDoc(userRef, {
          favoriteJobs: arrayRemove(jobId),
        });

        onSavedChanged(new Set([...savedJobs].filter((id) => id !== jobId)));
      } else {
        // add to favorites
        await updateDoc(userRef, {
          favoriteJobs: arrayUnion(jobId),
        });

        onSavedChanged(new Set([...savedJobs, jobId]));
      }

      setIsSaved(!isSaved);
    } catch (err) {
      console.error("Error while toggling save:", err);
    }
  };

  return (
    <div onClick={toggleSave} style={{ cursor: "pointer" }}>
      {isSaved ? (
        <i
          className="fa-solid fa-bookmark"
          style={{ color: "red", fontSize: 26 }}
        ></i>
      ) : (
        <i
          className="fa-regular fa-bookmark"
          style={{ color: "grey", fontSize: 26 }}
        ></i>
      )}
    </div>
  );
};

export default SaveJobButton;
