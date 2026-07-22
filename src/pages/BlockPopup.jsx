import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firbase/Firebase";

export default function ReportBlockPopup({
  freelancerId,
  freelancerName,
  onClose,
}) {
  const auth = getAuth();
  const currentUid = auth.currentUser?.uid;

  const [step, setStep] = useState("main");
  const [selectedReason, setSelectedReason] = useState("");

  const policyReasons = [
    "Fraud or scam",
    "Misinformation",
    "Harassment",
    "Dangerous or extremist organizations",
    "Threats or violence",
    "Self-harm",
    "Hateful speech",
    "Graphic content",
    "Sexual content",
    "Child exploitation",
    "Illegal goods and service",
    "Infringement",
  ];

  const profileReasons = [
    "This person is impersonating someone",
    "This account has been hacked",
    "This account is not a real person",
  ];

  /* ================= BACKEND ================= */
const handleBlock = async () => {
  if (!currentUid || !freelancerId) return;

  try {

    const userRef = doc(db, "users", freelancerId);
    const userSnap = await getDoc(userRef);

    let name = "User";

    if (userSnap.exists()) {
      const data = userSnap.data();

      const first = data.firstName || "";
      const last = data.lastName || "";

      name = `${first} ${last}`.trim();
    }

    await addDoc(collection(db, "blocked_users"), {
      blockedBy: currentUid,
      blockedUser: freelancerId,
      blockedUserName: name,
      createdAt: serverTimestamp(),
    });

    onClose();

  } catch (error) {
    console.error("Block error:", error);
  }
};

  const submitReport = async () => {
    if (!currentUid || !selectedReason) return;

    await addDoc(collection(db, "reports"), {
      reportedBy: currentUid,
      reportedUser: freelancerId,
      reason: selectedReason,
      type: "profile",
      createdAt: serverTimestamp(),
    });

    onClose();
  };

  /* ================= UI ================= */

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* HEADER */}
        <div style={header}>
          <h3 style={{ margin: 0 }}>
            {step === "block" ? "Block" : "Report this profile"}
          </h3>
          <span style={close} onClick={onClose}>✕</span>
        </div>
        <hr />

        {/* MAIN */}
        {step === "main" && (
          <>
            <p style={sub}>Select an action</p>

            <Row onClick={() => setStep("block")}>
              Block {freelancerName}
            </Row>
            <Row onClick={() => setStep("profile")}>
              Report {freelancerName}
            </Row>
            {/* <Row onClick={() => setStep("policy")}>
              Report profile element
            </Row> */}

            <Note>
              To report posts, comments, or messages, select the overflow menu next
              to that content and select Report.
            </Note>
          </>
        )}

        {/* BLOCK */}
        {step === "block" && (
          <>
            <p style={text}>
              You're about to block <b>{freelancerName}</b>. You'll no longer be
              connected, and will lose any endorsements or recommendations from
              this person.
            </p>

            <Footer>
              <Outline onClick={() => setStep("main")}>Back</Outline>
              <Primary onClick={handleBlock}>Block</Primary>
            </Footer>
          </>
        )}

        {/* PROFILE RADIO */}
        {step === "profile" && (
          <>
            <p style={sub}>Select an option that applies</p>

            {profileReasons.map((r) => (
              <RadioRow
                key={r}
                active={selectedReason === r}
                onClick={() => setSelectedReason(r)}
              >
                {r}
              </RadioRow>
            ))}

            <Note>
              If you believe this person is no longer with us, you can let us
              know this person is deceased
            </Note>

            <Footer>
              <Outline onClick={() => setStep("main")}>Back</Outline>
              <Primary disabled={!selectedReason} onClick={submitReport}>
                Submit report
              </Primary>
            </Footer>
          </>
        )}

        {/* POLICY TAGS */}
        {step === "policy" && (
          <>
            <p style={sub}>Select our policy that applies</p>

            <div style={tagWrap}>
              {policyReasons.map((r) => (
                <Tag
                  key={r}
                  active={selectedReason === r}
                  onClick={() => setSelectedReason(r)}
                >
                  {r}
                </Tag>
              ))}
            </div>

            <Footer>
              <Outline onClick={() => setStep("main")}>Back</Outline>
              <Primary
                disabled={!selectedReason}
                onClick={() => setStep("confirm")}   // 🔥 KEY CHANGE
              >
                Submit report
              </Primary>
            </Footer>
          </>
        )}
        {/* CONFIRM */}
        {step === "confirm" && (
          <>
            <div style={{ flex: 1 }}>
              <p style={{ marginBottom: 12 }}>
                You have selected the following reason
              </p>

              <div style={note}>
                <strong>{selectedReason}</strong>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  Illegal activities, malware, or promotion of illegal products or
                  services
                </div>
              </div>
            </div>

            <Footer>
              <Outline onClick={() => setStep("policy")}>
                Back
              </Outline>
              <Primary onClick={submitReport}>
                Submit report
              </Primary>
            </Footer>
          </>
        )}


      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,                 // 🔥 replaces top/left/width/height
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.4)", // optional backdrop
  zIndex: 99999,
};


const modal = {
  width: "90%",             // 🔥 responsive
  maxWidth: "40%",
  background: "#fff",
  borderRadius: 12,
  padding: 20,
  display: "flex",
  flexDirection: "column",
  minHeight: 260,
  maxHeight: "90vh",
  overflowY: "auto",        // 🔥 prevents cutoff
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const close = { cursor: "pointer", fontSize: 18 };

const sub = { color: "#555", margin: "12px 0" };

const text = { marginTop: 14, lineHeight: 1.6 };

const Row = ({ children, onClick }) => (
  <div onClick={onClick} style={row}>
    {children}
    <span>›</span>
  </div>
);

const RadioRow = ({ children, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",     // 🔥 vertical alignment
      gap: 12,
      padding: "10px 0",
      cursor: "pointer",
    }}
  >
    <input
      type="radio"
      checked={active}
      readOnly
      style={{
        margin: 0,              // 🔥 removes default offset
        width: 16,
        height: 16,
        cursor: "pointer",
      }}
    />
    <span
      style={{
        lineHeight: "20px",     // 🔥 text alignment
        fontSize: 14,
        color: "#222",
      }}
    >
      {children}
    </span>
  </div>
);


const Tag = ({ children, active, onClick }) => (
  <div onClick={onClick} style={{
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid #ccc",
    background: active ? "#f0f7ff" : "#fff",
    cursor: "pointer",
    fontSize: 13
  }}>
    {children}
  </div>
);

const Footer = ({ children }) => (
  <div style={footer}>{children}</div>
);

const Outline = ({ children, onClick }) => (
  <button onClick={onClick} style={outlineBtn}>{children}</button>
);

const Primary = ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    ...primaryBtn,
    opacity: disabled ? 0.5 : 1
  }}>
    {children}
  </button>
);

const Note = ({ children }) => (
  <div style={note}>{children}</div>
);

const LinkRow = ({ children }) => (
  <div style={linkRow}>
    {children}
    <span>›</span>
  </div>
);

/* helpers */
const row = {
  padding: "14px 10px",
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
};

const radioRow = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  padding: "10px 0",
  cursor: "pointer",
};

const tagWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const footer = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: "auto", // 🔥 pins footer
};


const outlineBtn = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
};

const primaryBtn = {
  padding: "8px 16px",
  borderRadius: 8,
  background: "#FFF27A",
  border: "1px solid #e5d700",
};

const note = {
  background: "#FFF9DB",
  padding: 12,
  borderRadius: 8,
  fontSize: 13,
  marginTop: 16,
};

const linkSection = { marginTop: 16 };

const linkRow = {
  padding: "10px 0",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
};