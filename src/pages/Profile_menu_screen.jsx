import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Firebase (assume already initialized elsewhere)
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Icons
import { FiChevronRight, FiEdit } from "react-icons/fi";

// ================================
// MAIN COMPONENT
// ================================
export default function ProfileMenuScreen({ uid }) {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // ================================
  // FETCH USER DATA
  // ================================
  useEffect(() => {
    if (!uid) return;

    async function fetchUser() {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setProfileImageUrl(
          data.profileImage || data.profile_image || ""
        );
      }
    }

    fetchUser();
  }, [uid, db]);

  // ================================
  // PICK & UPLOAD IMAGE
  // ================================
  const handlePickImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const imgRef = storageRef(storage, `users/${uid}/profile.jpg`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);

      await updateDoc(doc(db, "users", uid), {
        profile_image: url,
      });

      setProfileImageUrl(url);
      alert("✅ Profile updated successfully");
    } catch (err) {
      alert("⚠️ Error uploading image");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  if (!userData) {
    return (
      <div style={styles.loader}>
        <span>Loading...</span>
      </div>
    );
  }

  const fullName =
    `${userData.first_name || userData.firstName || ""} ${
      userData.last_name || userData.lastName || ""
    }`.trim() || "User";

  // ================================
  // RENDER
  // ================================
  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.avatarWrapper}>
          <img
            src={
              profileImageUrl ||
              "/assets/profile.png"
            }
            alt="profile"
            style={styles.avatar}
          />

          <button
            style={styles.editBtn}
            disabled={isUploading}
            onClick={() => fileInputRef.current.click()}
          >
            <FiEdit size={14} />
          </button>

          {isUploading && <div style={styles.overlay}>Uploading...</div>}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePickImage}
          />
        </div>

        <div style={styles.name}>{fullName}</div>
      </div>

      {/* MY ACCOUNT */}
      <Section title="My Account" />
      <MenuItem title="Profile Summary" onClick={() => navigate("/edit-profile")} />
      <MenuItem title="Saved" onClick={() => navigate("/saved")} />
      <MenuItem title="My Services" onClick={() => navigate("/my-services")} />
      <MenuItem title="My Works" onClick={() => navigate("/my-works")} />
      <MenuItem
        title="Invite Friends"
        onClick={() =>
          navigator.share
            ? navigator.share({ text: "Check out this awesome app!" })
            : alert("Sharing not supported")
        }
      />

      {/* SETTINGS */}
      <Section title="Settings" />
      <MenuItem
        title="Notifications"
        onClick={() => window.open("about:preferences", "_blank")}
      />
      <MenuItem
        title="Account Settings"
        onClick={() => navigate("/account-settings")}
      />
      <MenuItem
        title="Blocked Users"
        onClick={() => navigate("/blocked-users")}
      />
      <MenuItem
        title="Help Center"
        onClick={() =>
          window.open(
            "https://huzzlerhelpcenter.onrender.com/",
            "_blank"
          )
        }
      />

      {/* LOGOUT */}
      <div style={styles.logout} onClick={() => setShowLogoutDialog(true)}>
        Log Out
      </div>

      {/* LOGOUT CONFIRM DIALOG */}
      {showLogoutDialog && (
        <div style={styles.dialogBackdrop}>
          <div style={styles.dialog}>
            <p style={{ textAlign: "center" }}>
              Are you sure you want to log out of your account?
            </p>

            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>

            <button
              style={styles.cancelBtn}
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================
// SUB COMPONENTS
// ================================
function Section({ title }) {
  return <div style={styles.section}>{title}</div>;
}

function MenuItem({ title, onClick }) {
  return (
    <div style={styles.menuItem} onClick={onClick}>
      <span>{title}</span>
      <FiChevronRight size={16} color="#999" />
    </div>
  );
}

// ================================
// STYLES
// ================================
const styles = {
  container: {
    maxWidth: 420,
    margin: "0 auto",
    background: "#fff",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },
  loader: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  avatarWrapper: {
    position: "relative",
    width: 72,
    height: 72,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    objectFit: "cover",
    background: "#eee",
  },
  editBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: "50%",
    border: "none",
    padding: 6,
    cursor: "pointer",
    background: "#fff",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    fontSize: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 500,
  },
  section: {
    padding: "20px 16px 10px",
    fontWeight: 500,
    fontSize: 18,
  },
  menuItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
    fontSize: 15,
  },
  logout: {
    padding: 16,
    color: "red",
    fontWeight: 500,
    cursor: "pointer",
  },
  dialogBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dialog: {
    background: "#fff",
    padding: 24,
    borderRadius: 20,
    width: 300,
  },
  logoutBtn: {
    width: "100%",
    padding: 12,
    background: "#FDFD96",
    border: "none",
    borderRadius: 24,
    marginTop: 16,
    cursor: "pointer",
  },
  cancelBtn: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 24,
    border: "1.5px solid #000",
    background: "#fff",
    cursor: "pointer",
  },
};
