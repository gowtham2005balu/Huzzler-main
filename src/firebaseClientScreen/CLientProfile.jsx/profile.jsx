
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// assets
import arrow from "../../assets/icons/arrow.png";
import backarrow from "../../assets/icons/backarrow.png";
import profilePlaceholder from "../../assets/profile.png";
import notification from "../../assets/kk.png";
import saved from "../../assets/save2.png";
import jobposted from "../../assets/jobposted.png";
import hiring from "../../assets/hiring.png";
import paused2 from "../../assets/paused2.png";
import invitefriends from "../../assets/invitefriends.png";
import settings from "../../assets/settings.png";
import helpcenter from "../../assets/helpcenter.png";
import editIcon from "../../assets/edit.png";
import Logout from "../../assets/icons/logout.png";
import blocked from "../../assets/blocked.png";

import { deleteUser } from "firebase/auth";
import { deleteDoc } from "firebase/firestore";
import { deleteObject } from "firebase/storage";




export default function ClientProfileMenuScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  
  /* MOBILE FLAG */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* SIDEBAR COLLAPSE */
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    const handleToggle = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  /* AUTH */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return navigate("/firelogin");
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setUser(snap.data());
        setProfileImage(snap.data().profileImage || "");
      }
    });
    return () => unsub();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uid = auth.currentUser.uid;
      const imgRef = ref(storage, `users/${uid}/profile.jpg`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      await updateDoc(doc(db, "users", uid), { profileImage: url });
      setProfileImage(url);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Logout?")) return;
    await signOut(auth);

    localStorage.clear();
    setMobileOpen(false);

    navigate("/firelogin", { replace: true });
  };



  const handleDeleteAccount = async () => {


     const user = auth.currentUser;
       if (!user) return showToast("User not logged in");
   
       const confirmDelete = window.confirm(
         "This will permanently delete your account. This action cannot be undone.\n\nDo you want to continue?"
       );
       if (!confirmDelete) return;
   
       try {
         setLoading(true);
   
         // 🔐 Re-authentication (required by Firebase)
         const isPasswordUser = user.providerData.some(
           (p) => p.providerId === "password"
         );
   
         if (isPasswordUser) {
           const pwd = window.prompt("Enter your password to confirm deletion:");
           if (!pwd) {
             setLoading(false);
             return;
           }
   
           const credential = EmailAuthProvider.credential(user.email, pwd);
           await reauthenticateWithCredential(user, credential);
         }
   
         // 🗑️ Delete user document from Firestore
         await deleteDoc(doc(db, "users", user.uid));
   
         // 🗑️ Delete Firebase Auth account
         await user.delete();
   
         showToast("Account deleted successfully");
   
         // 🚀 Redirect
         navigate("/firelogin", { replace: true });
   
       } catch (error) {
         console.error(error);
   
         if (error.code === "auth/requires-recent-login") {
           showToast("Please log in again and try deleting your account.");
         } else {
           showToast("Failed to delete account");
         }
       } finally {
         setLoading(false);
       }
  };


  if (!user) return null;

  const fullName =
    `${user.first_name || user.firstName || ""} ${user.last_name || user.lastName || ""}`.trim() || "Client User";

  return (
    <div
      className="freelance-wrapper"
      style={{
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <div style={styles.page}>
        {/* HEADER */}
        <div style={{ ...styles.titleWrap, flexWrap: "wrap" }}>
          {/* <div
            style={{
              ...styles.backBtn,
              marginLeft: isMobile ? "0px" : collapsed ? "-100px" : "10px",
            }}
            onClick={() => navigate(-1)}
          >
            <img src={backarrow} width={20} />
          </div> */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              onClick={() => navigate(-1)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 14,
                border: "0.8px solid #E0E0E0",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                flexShrink: 0,
              }}
            >
              <img
                src={backarrow}
                alt="back"
                style={{ width: 16, height: 16 }}
              />
            </div>
            <div style={{ marginLeft: 12 }}>
              <h1 style={styles.title}>Profile</h1>
              <p style={styles.subtitle}>
                Manage your account and preferences.
              </p>
            </div>
          </div>


        </div>

        {/* PROFILE CARD */}
        <div
          style={{
            ...styles.profileCard,
            marginLeft: isMobile ? "0px" : "30px",
            flexDirection: isMobile ? "column" : "row",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={profileImage || profilePlaceholder}
              style={styles.avatar}
            />
            <label style={styles.editBtn}>
              <img src={editIcon} width={40} />
              <input hidden type="file" onChange={handleImageUpload} />
            </label>
            {isUploading && <div style={styles.uploadOverlay} />}
          </div>

          <div style={{ marginTop: isMobile ? 12 : 0 }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{fullName}</div>
            <div style={{ color: "#6b7280", marginTop: 4 }}>
              {user.email}
            </div>
          </div>
        </div>

        {/* MY ACCOUNT */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>My Account</h3>
          <MenuItem title="Profile Summary" icon={profilePlaceholder} onClick={() => navigate("/client-dashbroad2/companyprofileview")} />
          <MenuItem title="Saved" icon={saved} onClick={() => navigate("/client-dashbroad2/Clientsaved")} />
          <MenuItem title="Job Posted" icon={jobposted} onClick={() => navigate("/client-dashbroad2/PostJob")} />
          <MenuItem title="Hiring" icon={hiring} onClick={() => navigate("/client-dashbroad2/my-hires")} />
          {/* <MenuItem title="Paused Service" icon={paused2} onClick={() => navigate("/client-dashbroad2/clientpausedjobs")} /> */}
          <MenuItem title="Invite Friends" icon={invitefriends} />
          <MenuItem title="Blocked" icon={blocked} onClick={() => navigate("/client-dashbroad2/clientBlock")} />
        </div>

        {/* SUPPORT */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Support</h3>
          {/* <MenuItem title="Notifications" icon={notification} onClick={() => navigate("")} /> */}
          <MenuItem title="Account Settings" icon={settings} onClick={() => navigate("/client-dashbroad2/companyprofileview")} />
          <MenuItem title="Help Center" icon={helpcenter} onClick={() => navigate("/client-dashbroad2/helpcenter")} />
          <MenuItem title="Terms of Service" icon={helpcenter} onClick={() => navigate("/termsofservice")} />
          <MenuItem title="Privacy Policy" icon={helpcenter} onClick={() => navigate("/privacypolicy")} />
        </div>

        {/* LOGOUT + DELETE */}
        <div style={styles.section}>
          <MenuItem title="Sign out" icon={Logout} onClick={handleLogout} />
          <div
            style={{
              padding: "14px 6px",
              color: "red",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </div>

        </div>
      </div>
    </div>
  );
}

function MenuItem({ title, icon, onClick }) {
  return (
    <div style={styles.menuItem} onClick={onClick}>
      <div style={styles.menuLeft}>
        <img src={icon} width={18} />
        <span>{title}</span>
      </div>
      <img src={arrow} width={16} style={{ opacity: 0.2 }} />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Rubik', Inter, system-ui",
  },
  titleWrap: {
    width: "100%",
    maxWidth: 1160,
    display: "flex",
    alignItems: "center",
    marginBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    background: "#fff",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    cursor: "pointer",
  },
  title: { fontSize: 28, margin: 0, fontWeight: 700 },
  subtitle: { marginTop: 6, fontSize: 13, color: "#6b7280" },
  profileCard: {
    width: "100%",
    maxWidth: 1160,
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
    marginBottom: 20,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: "50%",
    objectFit: "cover",
  },
  editBtn: {
    position: "absolute",
    right: -5,
    bottom: -10,
    cursor: "pointer",
  },
  uploadOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    borderRadius: "50%",
  },
  section: {
    width: "100%",
    maxWidth: 1160,
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    marginBottom: 20,

  },
  sectionTitle: { fontSize: 14, color: "#6b7280" },
  menuItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 6px",
    cursor: "pointer",
    // borderTop: "1px solid rgba(15,15,15,0.05)",
  },
  menuLeft: { display: "flex", alignItems: "center", gap: 12 },
};