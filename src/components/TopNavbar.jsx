import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiMessageCircle } from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firbase/Firebase";
import AuthModal from "./AuthModal";

const CATEGORIES = [
  "UI/UX Design",
  "Development",
  "AI Services",
  "Digital Marketing",
  "Writing & Translation",
  "Video & Animation",
  "Business",
  "Finance",
  "Consulting",
];

export default function TopNavbar({
  userName = "James Andrew",
  activeCategory = "UI/UX Design",
  onSelectCategory,
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
  profileImage = null,
  notificationCount = 1,
  onBellClick,
  onMessageClick,
  isLoggedIn: propIsLoggedIn,
  showCategoryNav = false,
}) {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState(activeCategory);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(auth?.currentUser || null);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  const isUserAuthenticated =
    propIsLoggedIn !== undefined
      ? propIsLoggedIn
      : Boolean(currentUser || auth?.currentUser);


  const handleCategoryClick = (cat) => {
    setSelectedCat(cat);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };



  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "JA";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1336px",
        margin: "0 auto",
        padding: "12px 16px 0 16px",
        boxSizing: "border-box",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* TOP HEADER ROW */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* LEFT USER GREETING & TAGLINE */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#8C84A8",
                fontSize: "12px",
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: "2px",
              }}
            >
              Welcome back,
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "'Sora', sans-serif",
                color: "#1A1433",
              }}
            >
              {userName}! 👋
            </span>
          </div>

          <div
            style={{
              width: "1px",
              height: "28px",
              background: "#EBE5F2",
              display: "inline-block",
            }}
          />

          <span
            style={{
              color: "#A39DBA",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Discover projects that match your skills
          </span>
        </div>

        {/* MIDDLE SEARCH INPUT */}
        <div
          style={{
            flex: "1 1 300px",
            display: "flex",
            justifyContent: "center",
            maxWidth: "480px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "38px",
            }}
          >
            <FiSearch
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#757575",
                strokeWidth: "2",
                zIndex: 1,
              }}
              size={16}
            />
            <input
              type="text"
              placeholder="Search freelancers, jobs, services..."
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && onSearchSubmit) {
                  onSearchSubmit(searchValue);
                }
              }}
              style={{
                width: "100%",
                height: "100%",
                padding: "0 20px 0 40px",
                borderRadius: "9.5px",
                border: "1px solid #E8E6F0",
                background: "#F7F7F9",
                fontSize: "14px",
                fontFamily: "'DM Sans', sans-serif",
                color: "#1A1433",
                boxSizing: "border-box",
                outline: "none",
                transition: "all 0.2s",
              }}
            />
          </div>
        </div>

        {/* RIGHT ACTIONS: SIGN IN, SIGN UP (ONLY GUEST MODE) + BELL, CHAT, AVATAR */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* HIDE SIGN IN & SIGN UP IF USER IS LOGGED IN */}
          {!isUserAuthenticated && (
            <>
              {/* SIGN IN BUTTON */}
              <button
                onClick={() => handleOpenAuth("login")}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #7C3AED",
                  color: "#7C3AED",
                  borderRadius: "999px",
                  padding: "6px 20px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Sign in
              </button>

              {/* SIGN UP BUTTON */}
              <button
                onClick={() => handleOpenAuth("signup")}
                style={{
                  background: "#7C3AED",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "999px",
                  padding: "7px 22px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(124, 58, 237, 0.3)",
                  transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Sign Up
              </button>
            </>
          )}

          {/* BELL ICON */}
          <button
            onClick={onBellClick || (() => navigate("/notifications"))}
            style={{
              background: "#FFF9E6",
              border: "1px solid #FCEEBF",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <FiBell color="#D9A000" size={18} />
            {notificationCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "6px",
                  height: "6px",
                  background: "#FF4B4B",
                  borderRadius: "50%",
                }}
              />
            )}
          </button>

          {/* CHAT ICON */}
          <button
            onClick={onMessageClick || (() => navigate("/messages"))}
            style={{
              background: "#F5F3F7",
              border: "1px solid #EBE5F2",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FiMessageCircle color="#A39DBA" size={18} />
          </button>

          {/* AVATAR */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#7C3AED",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px",
              fontFamily: "'Sora', sans-serif",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              initials
            )}
          </div>
        </div>
      </header>

      {/* OPTIONAL CATEGORY NAVBAR ROW */}
      {showCategoryNav && (
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            borderBottom: "1px solid #EBE5F2",
            overflowX: "auto",
            paddingBottom: "10px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px 0 8px 0",
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#7C3AED" : "#555555",
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  position: "relative",
                  borderBottom: isActive ? "2.5px solid #7C3AED" : "2.5px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </button>
            );
          })}
        </nav>
      )}

      {/* AUTH POPUP MODAL */}
      <AuthModal
        key={authMode + (authModalOpen ? "-open" : "-closed")}
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

    </div>
  );
}
