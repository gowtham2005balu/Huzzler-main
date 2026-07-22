import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firbase/Firebase";

export default function Settings() {
  const navigate = useNavigate();
  const auth = getAuth();

  // Settings State
  const [notifications, setNotifications] = useState({
    newApplications: true,
    messages: true,
    paymentConfirmations: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showActivity: false,
    allowDirectMessages: true,
  });

  const [appearance, setAppearance] = useState({
    darkMode: false,
  });

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteDesc, setDeleteDesc] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 3500);
  };

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTogglePrivacy = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleAppearance = (key) => {
    setAppearance((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return showToast("User not logged in");

    if (!deleteReason) {
      showToast("Please select a reason for deletion");
      return;
    }

    try {
      setIsDeleting(true);

      const isPasswordUser = user.providerData.some(
        (p) => p.providerId === "password"
      );

      if (isPasswordUser) {
        const pwd = window.prompt("Enter your password to confirm deletion:");
        if (!pwd) {
          setIsDeleting(false);
          return;
        }

        const credential = EmailAuthProvider.credential(user.email, pwd);
        await reauthenticateWithCredential(user, credential);
      }

      await deleteDoc(doc(db, "users", user.uid));
      await user.delete();

      showToast("Account deleted successfully");
      navigate("/freelance-dashboard", { replace: true });

    } catch (error) {
      console.error(error);
      if (error.code === "auth/requires-recent-login") {
        showToast("Please log in again and try deleting your account.");
      } else {
        showToast("Failed to delete account");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="hz-settings-page">
      <div className="hz-settings-container">
        
        {/* Header */}
        <div className="hz-settings-header">
          <h1 className="hz-settings-title">Settings</h1>
          <p className="hz-settings-subtitle">Manage your account preferences</p>
        </div>

        {/* Content Layout */}
        <div className="hz-settings-layout">
          
          {/* Left Column */}
          <div className="hz-settings-left">
            
            {/* Notifications Card */}
            <div className="hz-settings-card-wrapper">
              <h3 className="hz-settings-card-heading">Notifications</h3>
              <div className="hz-settings-card">
                
                <ToggleItem 
                  title="New Applications" 
                  desc="Get notified when someone applies to your job" 
                  checked={notifications.newApplications} 
                  onChange={() => handleToggleNotification("newApplications")} 
                />
                
                <ToggleItem 
                  title="Messages" 
                  desc="Alerts for new messages from freelancers" 
                  checked={notifications.messages} 
                  onChange={() => handleToggleNotification("messages")} 
                />
                
                <ToggleItem 
                  title="Payment Confirmations" 
                  desc="When milestones are released" 
                  checked={notifications.paymentConfirmations} 
                  onChange={() => handleToggleNotification("paymentConfirmations")} 
                />
                
                <ToggleItem 
                  title="Marketing Emails" 
                  desc="Tips, product updates and platform news" 
                  checked={notifications.marketingEmails} 
                  onChange={() => handleToggleNotification("marketingEmails")} 
                />
                
                <ToggleItem 
                  title="Weekly Digest" 
                  desc="Summary of your hiring activity" 
                  checked={notifications.weeklyDigest} 
                  onChange={() => handleToggleNotification("weeklyDigest")} 
                  isLast
                />

              </div>
            </div>

            {/* Privacy Card */}
            <div className="hz-settings-card-wrapper">
              <h3 className="hz-settings-card-heading">Privacy</h3>
              <div className="hz-settings-card">
                
                <ToggleItem 
                  title="Public Profile" 
                  desc="Allow freelancers to see your company profile" 
                  checked={privacy.publicProfile} 
                  onChange={() => handleTogglePrivacy("publicProfile")} 
                />
                
                <ToggleItem 
                  title="Show Activity Status" 
                  desc="Let freelancers see when you're online" 
                  checked={privacy.showActivity} 
                  onChange={() => handleTogglePrivacy("showActivity")} 
                />
                
                <ToggleItem 
                  title="Allow Direct Messages" 
                  desc="Let freelancers contact you directly" 
                  checked={privacy.allowDirectMessages} 
                  onChange={() => handleTogglePrivacy("allowDirectMessages")} 
                  isLast
                />

              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="hz-settings-right">
            
            {/* Appearance Card */}
            <div className="hz-settings-card-wrapper">
              <h3 className="hz-settings-card-heading">Appearance</h3>
              <div className="hz-settings-card">
                
                <ActionItem 
                  title="Language" 
                  desc="English (India)" 
                  btnText="Change" 
                />
                
                <ActionItem 
                  title="Currency" 
                  desc="Indian Rupee (₹)" 
                  btnText="Change" 
                  isLast
                />

              </div>
            </div>

            {/* Billing Card */}
            <div className="hz-settings-card-wrapper">
              <h3 className="hz-settings-card-heading">Billing</h3>
              <div className="hz-settings-card">
                
                <ActionItem 
                  title="Current Plan" 
                  desc="Huzzler Pro - ₹2,999/month" 
                  btnText="Upgrade" 
                  btnOutline
                />
                
                <ActionItem 
                  title="Payment Method" 
                  desc="Visa •••• 4242" 
                  btnText="Edit" 
                  isLast
                />

              </div>
            </div>

            {/* Danger Zone Card */}
            <div className="hz-settings-card-wrapper">
              <h3 className="hz-settings-card-heading">Danger Zone</h3>
              <div className="hz-settings-card">
                <div className="hz-action-row hz-danger-row">
                  <div className="hz-action-text">
                    <div className="hz-action-title hz-text-danger">Delete Account</div>
                    <div className="hz-action-desc">Permanently delete all data and job posts</div>
                  </div>
                  <button className="hz-btn-danger" onClick={() => setShowDeleteModal(true)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Delete Modal (Kept functionality from previous) */}
        {showDeleteModal && (
          <div className="del-modal-overlay">
            <div className="del-modal-box">
              <div className="del-modal-icon-wrapper">
                 <span style={{ fontSize: 24, color: "#DC2626" }}>⚠️</span>
              </div>

              <h2 className="del-modal-title">Delete Account</h2>
              
              <p className="del-modal-subtitle">
                This will permanently delete your Huzzler account. Are you sure you want to delete your account?
              </p>

              <div className="del-modal-form">
                <div className="del-modal-field">
                  <label>Reason for Deletion</label>
                  <select 
                    value={deleteReason} 
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="del-modal-input"
                  >
                    <option value="" disabled>Select a Reason</option>
                    <option value="Couldn't find suitable freelancers">Couldn't find suitable freelancers</option>
                    <option value="Project outcomes didn't meet expectations">Project outcomes didn't meet expectations</option>
                    <option value="Communication and collaboration issues">Communication and collaboration issues</option>
                    <option value="Platform experience was not effective">Platform experience was not effective</option>
                    <option value="Other (please specify)">Other (please specify)</option>
                  </select>
                </div>

                <div className="del-modal-field">
                  <label>Description</label>
                  <textarea 
                    className="del-modal-input del-modal-textarea" 
                    placeholder="Tell us a bit more....."
                    value={deleteDesc}
                    onChange={(e) => setDeleteDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="del-modal-actions">
                <button 
                  className="del-modal-btn-delete" 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Yes, I want to delete"}
                </button>
                <button 
                  className="del-modal-btn-cancel" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Don't Delete
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="acc-toast">
            {toast}
          </div>
        )}

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

        .hz-settings-page {
          width: 100%;
          min-height: 100vh;
          background: #FAFAFC;
          font-family: 'Outfit', sans-serif;
          padding: 32px;
        }

        .hz-settings-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hz-settings-header {
          margin-bottom: 24px;
        }

        .hz-settings-title {
          font-size: 26px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 6px 0;
        }

        .hz-settings-subtitle {
          font-size: 14px;
          color: #6B7280;
          margin: 0;
        }

        .hz-settings-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .hz-settings-layout {
            grid-template-columns: 1fr;
          }
          .hz-settings-page {
            padding: 24px 16px;
          }
        }

        .hz-settings-left, .hz-settings-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .hz-settings-card-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .hz-settings-card-heading {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .hz-settings-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 12px 24px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
          border: 1px solid #F3F4F6;
        }

        .hz-toggle-row, .hz-action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
        }

        .hz-border-bottom {
          border-bottom: 1px solid #F3F4F6;
        }

        .hz-action-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hz-action-title {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
        }

        .hz-text-danger {
          color: #EF4444;
        }

        .hz-action-desc {
          font-size: 12px;
          color: #9CA3AF;
        }

        /* Toggle Switch Custom Styling */
        .hz-toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }

        .hz-toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .hz-toggle-slider {
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

        .hz-toggle-slider:before {
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

        input:checked + .hz-toggle-slider {
          background-color: #7C4EF5;
        }

        input:checked + .hz-toggle-slider:before {
          transform: translateX(20px);
        }

        /* Buttons */
        .hz-btn-default {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          background: #F9FAFB;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
        }

        .hz-btn-outline {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #7C4EF5;
          background: #ffffff;
          color: #7C4EF5;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
        }

        .hz-btn-danger {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: #FEF2F2;
          color: #EF4444;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
        }

        .hz-danger-row {
          padding: 8px 0;
        }

        /* Delete Modal Styles */
        .del-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .del-modal-box {
          background: #FFFFFF;
          box-shadow: 0px 8px 40px rgba(108, 77, 255, 0.16);
          border-radius: 22px;
          padding: 30px;
          width: 100%;
          max-width: 456px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .del-modal-icon-wrapper {
          width: 60px;
          height: 60px;
          background: #FEE2E2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .del-modal-title {
          font-size: 19px;
          font-weight: 700;
          color: #EF4444;
          margin: 0 0 8px 0;
        }

        .del-modal-subtitle {
          font-size: 13px;
          color: #5E5A7A;
          text-align: center;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .del-modal-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .del-modal-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .del-modal-field label {
          font-size: 12px;
          font-weight: 600;
          color: #5E5A7A;
        }

        .del-modal-input {
          background: #F7F7F9;
          border: 1px solid #E8E6F0;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 13px;
          color: #1A1730;
          outline: none;
          width: 100%;
          font-family: inherit;
        }

        .del-modal-textarea {
          min-height: 86px;
          resize: vertical;
        }

        .del-modal-actions {
          display: flex;
          width: 100%;
          gap: 12px;
        }

        .del-modal-btn-delete {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #FEE2E2;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 10px;
          color: #DC2626;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .del-modal-btn-cancel {
          flex: 1;
          background: linear-gradient(100.36deg, #6C4DFF 0%, #8B6DFF 100%);
          box-shadow: 0px 4px 14px rgba(108, 77, 255, 0.25);
          border-radius: 10px;
          padding: 10px;
          color: #FFFFFF;
          border: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .acc-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: #fff;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}

function ToggleItem({ title, desc, checked, onChange, isLast }) {
  return (
    <div className={`hz-toggle-row ${!isLast ? 'hz-border-bottom' : ''}`}>
      <div className="hz-action-text">
        <div className="hz-action-title">{title}</div>
        <div className="hz-action-desc">{desc}</div>
      </div>
      <label className="hz-toggle-switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="hz-toggle-slider"></span>
      </label>
    </div>
  );
}

function ActionItem({ title, desc, btnText, btnOutline, isLast }) {
  return (
    <div className={`hz-action-row ${!isLast ? 'hz-border-bottom' : ''}`}>
      <div className="hz-action-text">
        <div className="hz-action-title">{title}</div>
        <div className="hz-action-desc">{desc}</div>
      </div>
      <button className={btnOutline ? "hz-btn-outline" : "hz-btn-default"}>
        {btnText}
      </button>
    </div>
  );
}