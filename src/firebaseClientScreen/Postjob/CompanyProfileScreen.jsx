import React, { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

export default function CompanyProfileScreen() {
  const yellow = "#FDFD96";

  // Firebase
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const currentUser = auth.currentUser;

  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const [cachedUserData, setCachedUserData] = useState(null);

  // Form state
  const [Company_name, setCompany_name] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [websites, setWebsites] = useState([""]);

  // Load user data
  useEffect(() => {
    if (!currentUser) return;

    async function loadData() {
      try {
        const refDoc = doc(db, "users", currentUser.uid);
        const snap = await getDoc(refDoc);

        if (snap.exists()) {
          const data = snap.data();
          setCachedUserData(data);

          setCompany_name(data.Company_name || "");
          setIndustry(data.industry || "");
          setSize(data.team_size || "");
          setDescription(data.business_description || "");
          setEmail(data.email || currentUser.email || "");
          setLocation(data.location || "");
          setLinkedin(data.linkedin || "");

          if (Array.isArray(data.websites) && data.websites.length > 0) {
            setWebsites(data.websites);
          }

          setCoverImageUrl(data.coverImage || "");
          setProfileImageUrl(data.profileImage || "");
        }
      } catch (e) {
        console.error("Error loading profile:", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Image upload handler
  const uploadImage = async (e, isCover) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    isCover ? setIsUploadingCover(true) : setIsUploadingProfile(true);

    try {
      const path = isCover
        ? `users/${currentUser.uid}/cover.jpg`
        : `users/${currentUser.uid}/profile.jpg`;

      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", currentUser.uid), {
        [isCover ? "coverImage" : "profileImage"]: url,
      });

      if (isCover) setCoverImageUrl(url);
      else setProfileImageUrl(url);
    } catch (e) {
      console.error("Upload failed:", e);
    } finally {
      isCover ? setIsUploadingCover(false) : setIsUploadingProfile(false);
    }
  };

  // Add website field
  const addWebsiteField = () => {
    if (websites.length < 5) setWebsites([...websites, ""]);
  };

  // Save profile
  const saveProfile = async () => {
    if (!currentUser) return;

    setIsSaving(true);

    try {
      const data = {
        Company_name: Company_name,
        industry,
        team_size: size,
        business_description: description,
        email,
        location,
        linkedin,
        websites: websites.filter(w => w.trim() !== ""),
        updated_at: serverTimestamp(),
        profile_completed: true,
      };

      await setDoc(doc(db, "users", currentUser.uid), data, { merge: true });

      alert("Profile saved successfully!");
    } catch (e) {
      console.error("Save failed:", e);
      alert("Failed to save profile");
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return <h2 style={{ textAlign: "center", marginTop: 40 }}>Loading...</h2>;
  }

  return (
    <div style={{ width: "100%", background: "#fff" }}>
      
      {/* COVER IMAGE */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: "100%",
            height: 250,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            overflow: "hidden",
            background: yellow,
          }}
        >
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Add Cover Image
            </div>
          )}
        </div>

        <label style={{ position: "absolute", right: 10, top: 180 }}>
          <button
            style={{
              background: "#FFFACD",
              padding: "10px 15px",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            {isUploadingCover ? "Uploading..." : "Change Cover"}
          </button>
          <input
            type="file"
            hidden
            onChange={(e) => uploadImage(e, true)}
          />
        </label>
      </div>

      {/* PROFILE SECTION */}
      <div style={{ display: "flex", padding: 20, alignItems: "center" }}>
        <label style={{ position: "relative", cursor: "pointer" }}>
          <img
            src={
              profileImageUrl ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt=""
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #fff",
            }}
          />

          <input
            type="file"
            hidden
            onChange={(e) => uploadImage(e, false)}
          />

          {isUploadingProfile && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              Uploading...
            </div>
          )}
        </label>

        <div style={{ marginLeft: 15 }}>
          <h2 style={{ margin: 0 }}>
            {cachedUserData?.first_name || ""} {cachedUserData?.last_name || ""}
          </h2>
          <p style={{ margin: 0, color: "#777" }}>
            {cachedUserData?.location || "Update details"}
          </p>
        </div>
      </div>

      {/* COMPANY DETAILS */}
      <Card>
        <Input label="Company Name" value={Company_name} onChange={setCompany_name} />
        <Input label="Industry" value={industry} onChange={setIndustry} />
        <Input label="Company Size" value={size} onChange={setSize} />
        <Input label="Description" value={description} onChange={setDescription} multiline />
      </Card>

      {/* CONTACT DETAILS */}
      <Card>
        <Input label="Email" value={email} onChange={setEmail} />
        <Input label="Location" value={location} onChange={setLocation} />
        <Input label="LinkedIn URL" value={linkedin} onChange={setLinkedin} />

        {/* Websites */}
        {websites.map((w, i) => (
          <Input
            key={i}
            label={`Website URL ${i + 1}`}
            value={w}
            onChange={(val) => {
              const arr = [...websites];
              arr[i] = val;
              setWebsites(arr);
            }}
          />
        ))}

        {websites.length < 5 && (
          <button onClick={addWebsiteField} style={{ padding: 10, marginTop: 10 }}>
            + Add Another URL
          </button>
        )}

        <br />

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <button style={{ padding: "10px 20px" }}>Cancel</button>

          <button
            onClick={saveProfile}
            style={{ padding: "10px 20px", background: yellow }}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </Card>
    </div>
  );
}

/* --- Reusable Components --- */

function Card({ children }) {
  return (
    <div
      style={{
        background: "#F9F9F9",
        margin: "15px",
        padding: "15px",
        borderRadius: 10,
        border: "1px solid #ddd",
      }}
    >
      {children}
    </div>
  );
}

function Input({ label, value, onChange, multiline }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", padding: 10, height: 80, borderRadius: 8 }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 8 }}
        />
      )}
    </div>
  );
}
