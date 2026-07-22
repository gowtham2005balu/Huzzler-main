
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../api/client";

import "../../pages/Registerform/Signupstep1.css";
import Profilepic from "../../assets/Profilepic.png";
import facebook from "../../assets/facebook.png";

const ClientRegister = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🔹 Send registration data to backend
      await API.post("/auth/register", { ...form, role });

      // ✅ Navigate to OTP verification page after registration
      nav(`/client-verify?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      alert(err?.response?.data?.message || "Error while registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="outer-wrapper">
      <div className="logo-text">LOGO</div>

      <div className="signup-wrapper">
        <div className="signup-card">
          <div className="signup-header">
            <span className="back-symbol" onClick={() => nav(-1)}>
              &lt;
            </span>
            <h3>Sign up as a Client</h3>
            <p>Let’s get to know you. We promise it’ll be quick.</p>
          </div>

          <form className="signup-body" onSubmit={handleSubmit}>
            {/* Upload Image Section */}
            <div className="image-upload">
              <label htmlFor="upload">
                {image ? (
                  <img src={image} alt="Preview" className="preview-image" />
                ) : (
                  <div className="upload-placeholder">
                    <img
                      src={Profilepic}
                      alt="Upload Icon"
                      className="upload-png"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
              <p className="upload-text">Upload Image</p>
            </div>

            {/* Signup Form Section */}
            <div className="form-section">
              <div className="social-buttons">
                <a
                  className="google-btn"
                  href="http://localhost:5000/api/auth/google"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                  />
                  Sign up with Google
                </a>

                <button
                  type="button"
                  className="facebook-btn"
                  onClick={() => alert("Facebook integration coming soon!")}
                >
                  <img src={facebook} alt="Facebook" />
                  Sign in with Facebook
                </button>
              </div>

              <div className="name-fields">
                <div>
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
                <div>
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

              <div>
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

              <div>
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
                  {showPassword ? (
                    <EyeOff onClick={() => setShowPassword(false)} />
                  ) : (
                    <Eye onClick={() => setShowPassword(true)} />
                  )}
                </div>
              </div>

              <button
                className="continue-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientRegister;
