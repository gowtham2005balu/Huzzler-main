import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firbase/Firebase";

const AccountDetails = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address1: "",
    address2: "",
    city: "",
    zip: "",
    state: "",
    phone: "",
    location: "",
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    aboutCompany: ""
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setIsLoading(false);
        return;
      }
      setUser(u);
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const d = snap.data();
          
          setFormData((prev) => ({
            ...prev,
            name: d.first_name ? `${d.first_name} ${d.last_name || ""}`.trim() : (d.name || ""),
            email: d.email || u.email || "",
            phone: d.phone || "",
            location: d.location || "",
            companyName: d.Company_name || "",
            industry: d.category || "",
            companySize: d.team_size || "",
            website: d.website || "",
            aboutCompany: d.businessInfo || "",
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const nameParts = formData.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await updateDoc(doc(db, "users", user.uid), {
        first_name: firstName,
        last_name: lastName,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        Company_name: formData.companyName,
        category: formData.industry,
        team_size: formData.companySize,
        website: formData.website,
        businessInfo: formData.aboutCompany,
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50, fontFamily: "Outfit, sans-serif" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <>
      <div className="hz-account-details-page">
        <div className="hz-ad-container">
          {/* Header */}
          <div className="hz-ad-header">
            <h1 className="hz-ad-title">Account Details</h1>
            <p className="hz-ad-subtitle">Manage your personal and company information</p>
          </div>

          <div className="hz-ad-layout">
            {/* Left Column */}
            <div className="hz-ad-left">
              <div className="hz-ad-card">
                
                {/* Profile Header Card */}
                <div className="hz-ad-profile-header">
                  <div className="hz-ad-profile-info-wrap">
                    <div className="hz-ad-avatar">CS</div>
                    <div className="hz-ad-user-info">
                      <div className="hz-ad-user-name">Creativo Studio</div>
                      <div className="hz-ad-user-role">Pro Client · Member since Jan 2023</div>
                      <div className="hz-ad-tags">
                        <span className="hz-ad-tag hz-ad-tag-verified">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Verified
                        </span>
                        <span className="hz-ad-tag hz-ad-tag-pro">👑 Pro</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="hz-ad-btn-outline">Edit Photo</button>
                </div>

                <div className="hz-ad-divider"></div>

                <form className="hz-ad-form" onSubmit={handleSubmit}>
                  <div className="hz-ad-form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                  </div>

                  <div className="hz-ad-form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>

                  <div className="hz-ad-form-group">
                    <label>Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>

                  <div className="hz-ad-form-group">
                    <label>Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} />
                  </div>

                  <button type="submit" className="hz-ad-btn-primary" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </form>

              </div>
            </div>

            {/* Right Column */}
            <div className="hz-ad-right">
              
              {/* Company Information Card */}
              <div className="hz-ad-card hz-ad-card-right">
                <h3 className="hz-ad-card-title">Company Information</h3>
                
                <div className="hz-ad-form">
                  <div className="hz-ad-form-group">
                    <label>Company Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
                  </div>

                  <div className="hz-ad-form-group">
                    <label>Industry</label>
                    <input type="text" name="industry" value={formData.industry} onChange={handleChange} />
                  </div>

                  <div className="hz-ad-form-group">
                    <label>Company Size</label>
                    <input type="text" name="companySize" value={formData.companySize} onChange={handleChange} />
                  </div>

                  <div className="hz-ad-form-group">
                    <label>Website</label>
                    <input type="text" name="website" value={formData.website} onChange={handleChange} />
                  </div>

                  <div className="hz-ad-form-group">
                    <label>About Company</label>
                    <textarea name="aboutCompany" value={formData.aboutCompany} onChange={handleChange}></textarea>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div className="hz-ad-card hz-ad-card-right">
                <h3 className="hz-ad-card-title">Security</h3>
                
                <div className="hz-ad-security-list">
                  <div className="hz-ad-security-item hz-ad-border-bottom">
                    <div className="hz-ad-security-info">
                      <div className="hz-ad-security-name">Password</div>
                      <div className="hz-ad-security-desc">Last changed 3 months ago</div>
                    </div>
                    <button type="button" className="hz-ad-btn-outline-small">Change</button>
                  </div>

                  <div className="hz-ad-security-item hz-ad-border-bottom">
                    <div className="hz-ad-security-info">
                      <div className="hz-ad-security-name">Two-Factor Auth</div>
                      <div className="hz-ad-security-desc">Add an extra layer of security</div>
                    </div>
                    <label className="hz-ad-toggle-switch">
                      <input type="checkbox" checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />
                      <span className="hz-ad-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="hz-ad-security-item">
                    <div className="hz-ad-security-info">
                      <div className="hz-ad-security-name">Active Sessions</div>
                      <div className="hz-ad-security-desc">2 devices logged in</div>
                    </div>
                    <button type="button" className="hz-ad-btn-outline-small">Manage</button>
                  </div>
                </div>

              </div>

            </div>
          </div>
          
          {showPopup && (
            <div className="hz-ad-popup-overlay">
              <div className="hz-ad-popup-card">
                <div className="hz-ad-popup-icon">⚠️</div>
                <h3 className="hz-ad-popup-title">Delete account</h3>
                <p className="hz-ad-popup-text">
                  This will permanently delete your huzzler account.<br />
                  Are you sure you want to delete your account?
                </p>
                <div className="hz-ad-popup-actions">
                  <button type="button" className="hz-ad-popup-delete" onClick={() => { setShowPopup(false); setShowSuccess(true); }}>Yes, I want to delete</button>
                  <button type="button" className="hz-ad-popup-cancel" onClick={() => setShowPopup(false)}>Don’t Delete</button>
                </div>
              </div>
            </div>
          )}

          {showSuccess && (
            <div className="hz-ad-popup-overlay">
              <div className="hz-ad-success-card">
                <div className="hz-ad-success-icon">⚠️</div>
                <h3 className="hz-ad-success-title">Account Deleted</h3>
                <p className="hz-ad-success-text">Your account has been permanently deleted.</p>
                <div className="hz-ad-success-actions">
                  <button type="button" className="hz-ad-success-ok" onClick={() => navigate("/")}>OK</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

        .hz-account-details-page {
          width: 100%;
          min-height: 100vh;
          background: #FAFAFC;
          font-family: 'Outfit', sans-serif;
          padding: 32px;
        }

        .hz-ad-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hz-ad-header {
          margin-bottom: 24px;
        }

        .hz-ad-title {
          font-size: 26px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 6px 0;
        }

        .hz-ad-subtitle {
          font-size: 14px;
          color: #6B7280;
          margin: 0;
        }

        .hz-ad-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .hz-ad-layout {
            grid-template-columns: 1fr;
          }
          .hz-account-details-page {
            padding: 24px 16px;
          }
        }

        .hz-ad-left {
          display: flex;
          flex-direction: column;
        }

        .hz-ad-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .hz-ad-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #F3F4F6;
        }

        /* Profile Header */
        .hz-ad-profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .hz-ad-profile-info-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hz-ad-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #7C4EF5;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
        }

        .hz-ad-user-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hz-ad-user-name {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .hz-ad-user-role {
          font-size: 13px;
          color: #6B7280;
        }

        .hz-ad-tags {
          display: flex;
          gap: 8px;
          margin-top: 2px;
        }

        .hz-ad-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .hz-ad-tag-verified {
          background: #ECFDF5;
          color: #059669;
        }

        .hz-ad-tag-pro {
          background: #FEF3C7;
          color: #D97706;
        }

        .hz-ad-btn-outline {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .hz-ad-btn-outline:hover {
          background: #F9FAFB;
        }

        .hz-ad-divider {
          height: 1px;
          background: #F3F4F6;
          margin: 0 -24px 24px -24px;
        }

        /* Forms */
        .hz-ad-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .hz-ad-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .hz-ad-form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .hz-ad-form-group input, .hz-ad-form-group textarea {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 14px;
          color: #111827;
          outline: none;
          font-family: inherit;
          transition: all 0.2s;
        }

        .hz-ad-form-group input:focus, .hz-ad-form-group textarea:focus {
          border-color: #7C4EF5;
          background: #FFFFFF;
        }

        .hz-ad-form-group textarea {
          min-height: 80px;
          resize: vertical;
        }

        .hz-ad-btn-primary {
          background: #7C4EF5;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          align-self: flex-start;
          margin-top: 8px;
          transition: all 0.2s;
        }

        .hz-ad-btn-primary:hover {
          background: #6A3EE0;
        }

        /* Right Cards Specific */
        .hz-ad-card-right {
          padding: 24px;
        }

        .hz-ad-card-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 20px 0;
        }

        /* Security List */
        .hz-ad-security-list {
          display: flex;
          flex-direction: column;
        }

        .hz-ad-security-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
        }

        .hz-ad-border-bottom {
          border-bottom: 1px solid #F3F4F6;
        }

        .hz-ad-security-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hz-ad-security-name {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
        }

        .hz-ad-security-desc {
          font-size: 12px;
          color: #6B7280;
        }

        .hz-ad-btn-outline-small {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          color: #374151;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
        }

        /* Toggle Switch */
        .hz-ad-toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }

        .hz-ad-toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .hz-ad-toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #E5E7EB;
          transition: .3s;
          border-radius: 24px;
        }

        .hz-ad-toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        input:checked + .hz-ad-toggle-slider {
          background-color: #7C4EF5;
        }

        input:checked + .hz-ad-toggle-slider:before {
          transform: translateX(20px);
        }

        /* Popups */
        .hz-ad-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .hz-ad-popup-card, .hz-ad-success-card {
          background: white;
          padding: 30px;
          border-radius: 22px;
          width: 420px;
          text-align: center;
          box-shadow: 0 8px 40px rgba(108, 77, 255, 0.16);
        }
        .hz-ad-popup-icon, .hz-ad-success-icon { font-size: 24px; color: #EF4444; margin-bottom: 16px; }
        .hz-ad-popup-title, .hz-ad-success-title { font-size: 19px; font-weight: 700; color: #EF4444; margin: 0 0 8px 0; }
        .hz-ad-popup-text, .hz-ad-success-text { color: #5E5A7A; font-size: 13px; margin: 0 0 24px 0; line-height: 1.5; }
        .hz-ad-popup-actions, .hz-ad-success-actions { display: flex; gap: 12px; }
        .hz-ad-popup-delete { flex: 1; background: #FEE2E2; border: 1px solid #FECACA; color: #DC2626; border-radius: 10px; padding: 10px; font-weight: 600; cursor: pointer; }
        .hz-ad-popup-cancel { flex: 1; background: linear-gradient(100.36deg, #6C4DFF 0%, #8B6DFF 100%); color: white; border: none; border-radius: 10px; padding: 10px; font-weight: 600; cursor: pointer; }
        .hz-ad-success-ok { width: 100%; background: #6C4DFF; color: white; border: none; border-radius: 10px; padding: 10px; font-weight: 600; cursor: pointer; }
      `}</style>
    </>
  );
};

export default AccountDetails;


