import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({ profile, projectCount, onEditProfile }) {
  const navigate = useNavigate();

  const fullName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ""}`.trim() 
    : (profile?.name || "Gowtham B");
  
  const roleDisplay = profile?.professional_title || "UI/UX Designer • Freelancer";
  const location = profile?.location || profile?.city || "Chennai, India";
  const rating = profile?.rating || "4.9";
  const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0,2) || "GG";

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: 0 }}>Profile</h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0 0" }}>Manage your public profile and portfolio.</p>
      </div>

      {/* PROFILE HERO */}
      <div style={{
        width: "100%",
        minHeight: 147,
        background: "linear-gradient(90deg, #6C3EEB 0%, #7C4EF5 100%)",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        padding: "24px",
        boxSizing: "border-box",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative background circles */}
        <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.06)", right: "-50px", top: "-100px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.04)", right: "200px", bottom: "-50px", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 24, zIndex: 2 }}>
          {/* Avatar Circle */}
          <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt={fullName}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid rgba(255,255,255,0.5)"
                }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "rgba(255, 255, 255, 0.2)", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontSize: 40, fontWeight: 600, border: "2px solid rgba(255,255,255,0.5)" }}>
                {initials}
              </div>
            )}
            {/* Verified Badge */}
            <div style={{ position: "absolute", bottom: 4, right: 4, width: 24, height: 24, background: "#FDE047", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", color: "#111", fontSize: 12, border: "2px solid #fff" }}>
              ✓
            </div>
          </div>

          {/* User Info */}
          <div style={{ color: "#fff" }}>
            <h2 style={{ fontSize: 24, margin: "0 0 4px", fontWeight: 700, color: "#fff" }}>{fullName}</h2>
            <p style={{ fontSize: 14, margin: "0 0 12px", opacity: 0.9 }}>{roleDisplay}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 20, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                <span>📍</span> {location}
              </div>
              <div style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 20, fontSize: 12 }}>
                <strong>{projectCount || 0}</strong> Projects
              </div>

            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12, zIndex: 2 }}>
          <button
            onClick={onEditProfile ? onEditProfile : () => navigate("/freelance-dashboard/accountfreelancer", { state: { activeTab: "Profile Summary" } })}
            style={{ padding: "8px 24px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
          >
            Edit Profile
          </button>
          <button style={{ padding: "8px 24px", borderRadius: 999, border: "none", background: "#FDE047", color: "#111", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Share Profile</button>
        </div>
      </div>
    </>
  );
}
