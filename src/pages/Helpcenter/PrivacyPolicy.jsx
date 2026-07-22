import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiLock, FiClock, FiFileText } from "react-icons/fi";
import "./Helpcenter.css";

const PRIVACY_TOC_ITEMS = [
  { id: "p-sec-1", num: "1.", label: "Information We Collect" },
  { id: "p-sec-2", num: "2.", label: "How We Use Data" },
  { id: "p-sec-3", num: "3.", label: "Legal Basis & Consent" },
  { id: "p-sec-4", num: "4.", label: "Data Sharing & Intermediary" },
  { id: "p-sec-5", num: "5.", label: "Data Principal Rights" },
  { id: "p-sec-6", num: "6.", label: "Data Security & Retention" },
  { id: "p-sec-7", num: "7.", label: "Contact & Grievance Officer" },
];

export default function PrivacyPolicy({ defaultTab = "privacy" }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [activeSec, setActiveSec] = useState("p-sec-1");

  const scrollToSec = (id) => {
    setActiveSec(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "terms") {
      navigate("/termsofservice");
    } else if (tab === "privacy") {
      navigate("/privacypolicy");
    }
  };

  return (
    <div className="policy-page">
      {/* ---------- HEADER ---------- */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand" onClick={() => navigate("/freelance-dashboard")}>
            <div className="brand-mark">hz.</div>
            <span className="brand-name">Huzzler</span>
          </div>

          <nav className="toplinks">
            <button
              className={activeTab === "terms" ? "active" : ""}
              onClick={() => handleTabChange("terms")}
            >
              Terms of Service
            </button>
            <button
              className={activeTab === "privacy" ? "active" : ""}
              onClick={() => handleTabChange("privacy")}
            >
              Privacy Policy
            </button>
            <button
              className={activeTab === "dei" ? "active" : ""}
              onClick={() => setActiveTab("dei")}
            >
              DEI Policy
            </button>
          </nav>
        </div>
      </header>

      {/* ---------- PAGE SHELL ---------- */}
      <div className="shell-wrapper">
        <div className="shell">
          {/* ---------- SIDEBAR ---------- */}
          <aside className="policy-sidebar">
            <h4>On this page</h4>
            <ul className="toc">
              {PRIVACY_TOC_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    className={activeSec === item.id ? "active" : ""}
                    onClick={() => scrollToSec(item.id)}
                  >
                    <span className="toc-num">{item.num}</span> {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="help-card">
              <div className="q-icon">?</div>
              <strong>Have privacy queries?</strong>
              <p>Contact our Data Protection Officer for any personal data requests.</p>
              <button onClick={() => alert("Please contact privacy officer at privacy@huzzler.app")}>
                Contact DPO →
              </button>
            </div>
          </aside>

          {/* ---------- MAIN CONTENT ---------- */}
          <main className="policy-main">
            <h1 className="page-title">Privacy Policy</h1>

            <div className="updated">
              <FiClock size={16} /> Updated: October 31, 2025
            </div>

            <div className="overview-card">
              <div className="overview-icon">
                <FiLock size={24} />
              </div>
              <div>
                <h3>Privacy Policy Overview</h3>
                <p>
                  At Huzzler (Zuntra Digital Private Limited), we are committed to protecting your
                  privacy and complying with the Digital Personal Data Protection Act, 2023 (DPDPA).
                  This Privacy Policy explains how we collect, process, store, and safeguard your data.
                </p>
              </div>
            </div>

            {/* 1. INFORMATION WE COLLECT */}
            <section id="p-sec-1" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">1</div>
                <h2>Information We Collect</h2>
              </div>
              <p className="lede">
                We collect personal information that you provide when creating an account, editing your profile, or using Huzzler services:
              </p>
              <ul className="item-list">
                <li className="item">
                  <span className="tag">a)</span>
                  <div><strong>Account & Profile Data:</strong> Name, email address, phone number, profile photo, bio, skills, portfolio links, and client details.</div>
                </li>
                <li className="item">
                  <span className="tag">b)</span>
                  <div><strong>Communication Data:</strong> Messages, feedback, and support inquiries exchanged through the Platform.</div>
                </li>
                <li className="item">
                  <span className="tag">c)</span>
                  <div><strong>Technical Data:</strong> IP address, device type, browser information, cookies, and log data for security and performance optimization.</div>
                </li>
              </ul>
            </section>

            {/* 2. HOW WE USE DATA */}
            <section id="p-sec-2" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">2</div>
                <h2>How We Use Data</h2>
              </div>
              <ul className="item-list">
                <li className="item">
                  <span className="tag">i)</span>
                  <div>To provide, maintain, and improve Huzzler freelance matchmaking and client features.</div>
                </li>
                <li className="item">
                  <span className="tag">ii)</span>
                  <div>To enable Freelancer & Client discovery and facilitate professional engagements.</div>
                </li>
                <li className="item">
                  <span className="tag">iii)</span>
                  <div>To prevent fraud, verify accounts, and maintain platform security.</div>
                </li>
                <li className="item">
                  <span className="tag">iv)</span>
                  <div>To comply with legal obligations under Indian laws including DPDPA 2023 and IT Act 2000.</div>
                </li>
              </ul>
            </section>

            {/* 3. LEGAL BASIS & CONSENT */}
            <section id="p-sec-3" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">3</div>
                <h2>Legal Basis & Consent</h2>
              </div>
              <p className="lede">
                We process your personal data based on your explicit consent as a Data Principal under DPDPA 2023. You have the right to withdraw your consent at any time through your account settings or by emailing our Privacy Officer.
              </p>
            </section>

            {/* 4. DATA SHARING & INTERMEDIARY */}
            <section id="p-sec-4" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">4</div>
                <h2>Data Sharing & Intermediary Role</h2>
              </div>
              <p className="lede">
                We do not sell your personal data. We share information only:
              </p>
              <ul className="item-list">
                <li className="item">
                  <span className="tag">•</span>
                  <div>With other registered Users (Clients/Freelancers) as necessary for freelance matching.</div>
                </li>
                <li className="item">
                  <span className="tag">•</span>
                  <div>With authorized cloud hosting infrastructure providers under strict confidentiality agreements.</div>
                </li>
                <li className="item">
                  <span className="tag">•</span>
                  <div>When required by law or valid government order under applicable Indian legislation.</div>
                </li>
              </ul>
            </section>

            {/* 5. DATA PRINCIPAL RIGHTS */}
            <section id="p-sec-5" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">5</div>
                <h2>Your Rights as a Data Principal</h2>
              </div>
              <ul className="item-list">
                <li className="item">
                  <span className="tag">1.</span>
                  <div><strong>Right to Access:</strong> Request a summary of personal data processed by Huzzler.</div>
                </li>
                <li className="item">
                  <span className="tag">2.</span>
                  <div><strong>Right to Correction & Erasure:</strong> Correct inaccurate data or request deletion of your account and personal data.</div>
                </li>
                <li className="item">
                  <span className="tag">3.</span>
                  <div><strong>Right of Grievance Redressal:</strong> Submit privacy concerns to our Grievance Officer.</div>
                </li>
              </ul>
            </section>

            {/* 6. DATA SECURITY */}
            <section id="p-sec-6" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">6</div>
                <h2>Data Security & Retention</h2>
              </div>
              <p className="lede">
                We implement industry-standard encryption, secure access controls, and regular audits to protect your data. Data is retained only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.
              </p>
            </section>

            {/* 7. CONTACT */}
            <section id="p-sec-7" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">7</div>
                <h2>Contact & Grievance Redressal</h2>
              </div>
              <p className="lede">
                For questions, privacy requests, or grievances under DPDPA 2023:
              </p>
              <ul className="item-list">
                <li className="item">
                  <span className="tag">•</span>
                  <div><strong>Grievance / Privacy Officer:</strong> Zuntra Digital Data Protection Team</div>
                </li>
                <li className="item">
                  <span className="tag">•</span>
                  <div><strong>Email:</strong> privacy@zuntra.in / support@huzzler.app</div>
                </li>
              </ul>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}