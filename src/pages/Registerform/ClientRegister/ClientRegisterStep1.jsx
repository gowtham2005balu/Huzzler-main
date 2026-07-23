import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Camera } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../firbase/Firebase";

import "../../Registerform/Signupstep1.css";
import Profilepic from "../../../assets/Profilepic.png";

const Signupstep1 = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "client";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setImage(imgURL);
      setForm({ ...form, avatarUrl: imgURL });
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      const firstName = user.displayName?.split(" ")[0] || form.first_name || "Client";
      const lastName = user.displayName?.split(" ")[1] || form.last_name || "";
      await setDoc(
        doc(db, "users", user.uid),
        {
          first_name: firstName,
          last_name: lastName,
          email: user.email,
          role: "client",
          avatarUrl: user.photoURL || form.avatarUrl || "",
          created_at: serverTimestamp(),
        },
        { merge: true }
      );

      nav("/client-details", {
        state: {
          uid: user.uid,
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          role: "client",
        },
      });
    } catch (err) {
      console.error(err);
      setErrorMsg("Google Sign Up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("user:email");
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      const firstName = user.displayName?.split(" ")[0] || form.first_name || "Client";
      const lastName = user.displayName?.split(" ")[1] || form.last_name || "";
      await setDoc(
        doc(db, "users", user.uid),
        {
          first_name: firstName,
          last_name: lastName,
          email: user.email,
          role: "client",
          avatarUrl: user.photoURL || form.avatarUrl || "",
          created_at: serverTimestamp(),
        },
        { merge: true }
      );

      nav("/client-details", {
        state: {
          uid: user.uid,
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          role: "client",
        },
      });
    } catch (err) {
      console.error(err);
      setErrorMsg("GitHub Sign Up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.first_name) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const normalizedEmail = form.email.trim().toLowerCase();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        form.password
      );
      const user = userCredential.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: normalizedEmail,
          role: "client",
          avatarUrl: form.avatarUrl || "",
          created_at: serverTimestamp(),
        },
        { merge: true }
      );

      nav("/client-details", {
        state: {
          uid: user.uid,
          email: normalizedEmail,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          password: form.password,
          role: "client",
        },
      });
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setErrorMsg("Email is already registered. Please log in.");
      } else if (err.code === "auth/weak-password") {
        setErrorMsg("Password should be at least 6 characters.");
      } else {
        setErrorMsg(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="outer-wrapper">
      {/* Brand Header */}
      <div className="brand-header" onClick={() => nav("/")}>
        <span className="brand-logo-text">Huzzler</span>
      </div>

      <div className="signup-wrapper">
        <div className="signup-card">
          <div className="signup-header">
            <button type="button" className="back-btn" onClick={() => nav(-1)}>
              <ArrowLeft size={18} />
            </button>
            <div className="header-titles">
              <h3>Sign up as a Client</h3>
              <p>Let’s get to know you. We promise it’ll be quick.</p>
            </div>
          </div>

          {errorMsg && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "13px",
                textAlign: "center",
                background: "#FEE2E2",
                color: "#DC2626",
                border: "1px solid #FCA5A5",
              }}
            >
              {errorMsg}
            </div>
          )}

          <form className="signup-body" onSubmit={handleSubmit}>
            {/* Upload image section */}
            <div className="image-upload-col">
              <label htmlFor="upload" className="avatar-upload-box">
                {image ? (
                  <img src={image} alt="Preview" className="preview-avatar" />
                ) : (
                  <div className="upload-placeholder-content">
                    <img
                      src={Profilepic}
                      alt="Upload Icon"
                      className="upload-icon-png"
                    />
                  </div>
                )}
                <div className="camera-badge">
                  <Camera size={16} color="#FFFFFF" />
                </div>
                <input
                  type="file"
                  id="upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
              <span className="upload-label-text">Upload Profile Image</span>
            </div>

            {/* Signup form section */}
            <div className="form-section">
              <div className="social-buttons">
                <button
                  type="button"
                  className="social-btn google-btn"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                  />
                  Sign up with Google
                </button>

                <button
                  type="button"
                  className="social-btn github-btn"
                  onClick={handleGithubSignup}
                  disabled={loading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  Sign in with GitHub
                </button>
              </div>

              <div className="name-fields">
                <div className="input-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    id="first_name"
                    type="text"
                    placeholder="First Name"
                    value={form.first_name}
                    onChange={(e) =>
                      setForm({ ...form, first_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    id="last_name"
                    type="text"
                    placeholder="Last Name"
                    value={form.last_name}
                    onChange={(e) =>
                      setForm({ ...form, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">Enter your Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Create Password</label>
                <div className="password-field">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                className="continue-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signupstep1;
