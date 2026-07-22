// src/pages/ProfileMenuPage.jsx
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firbase/Firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function ProfileMenuPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setProfileImage(docSnap.data().profile_image || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  const handleProfileImageChange = async (e) => {
    if (!e.target.files[0] || !uid) return;

    setUploading(true);
    const file = e.target.files[0];
    const storageRef = ref(storage, `users/${uid}/profile.jpg`);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "users", uid), { profile_image: url });
      setProfileImage(url);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading profile image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await signOut(auth);
      navigate("/login");
    }
  };

  if (loading) return <div>Loading...</div>;

  const fullName =
    `${userData?.first_name || userData?.firstName || ""} ${userData?.last_name || userData?.lastName || ""}`.trim() || "User";

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#FDFD96",
          borderRadius: "0 0 30px 30px",
          padding: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={profileImage || "/assets/profile.png"}
            alt="Profile"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <input
            type="file"
            accept="image/*"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
            onChange={handleProfileImageChange}
            disabled={uploading}
          />
        </div>
        <h2 style={{ marginLeft: 20 }}>{fullName}</h2>
      </div>

      {/* Menu Section */}
      <div style={{ marginTop: 30 }}>
        <MenuItem
          title="Saved"
          onClick={() => navigate("/explore-job?saved=true")}
        />
        <MenuItem
          title="Profile"
          onClick={() =>
            navigate("/build-profile", { state: { userData, uid } })
          }
        />
        <MenuItem title="My Services" onClick={() => navigate("/my-services")} />
        <MenuItem title="My Works" onClick={() => navigate("/my-works")} />
        <MenuItem
          title="Invite Friends"
          onClick={() => navigator.share?.({ text: "Check out this app!" })}
        />
      </div>

      {/* Settings Section */}
      <div style={{ marginTop: 40 }}>
        <MenuItem title="Notifications" onClick={() => alert("Open settings")} />
        <MenuItem
          title="Account Settings"
          onClick={() => navigate("/account-details")}
        />
        <MenuItem title="Help Center" onClick={() => alert("Open help")} />
        <MenuItem title="Log Out" onClick={handleLogout} color="red" />
      </div>
    </div>
  );
}

function MenuItem({ title, onClick, color = "black" }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 15,
        borderBottom: "1px solid #ccc",
        cursor: "pointer",
        color,
        fontWeight: 500,
      }}
    >
      {title}
    </div>
  );
}
