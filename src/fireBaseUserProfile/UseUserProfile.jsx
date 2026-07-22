// src/hooks/useUserProfile.jsx
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firbase/Firebase"; // adjust path
import { auth } from "../firbase/Firebase";

export default function UseUserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const uid = auth.currentUser?.uid; // current user UID
        if (!uid) {
          setUserProfile({
            signupCompleted: false,
            profileCompleted: false,
            serviceCreated: false,
          });
          setLoading(false);
          return;
        }

        const docRef = doc(db, "profile", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserProfile({
            name: data.name || "",
            profileImageUrl: data.profile_url || null,
            signupCompleted: data.signupCompleted ?? true,
            profileCompleted: data.profileCompleted ?? false,
            serviceCreated: data.serviceCreated ?? false,
          });
        } else {
          // Default profile if not exists
          setUserProfile({
            signupCompleted: false,
            profileCompleted: false,
            serviceCreated: false,
          });
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { userProfile, loading, error };
}
