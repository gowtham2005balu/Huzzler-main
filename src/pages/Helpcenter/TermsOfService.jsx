import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiHelpCircle, FiClock, FiFileText } from "react-icons/fi";
import "./Helpcenter.css";

const TOC_ITEMS = [
  { id: "sec-1", num: "1.", label: "Definitions" },
  { id: "sec-2", num: "2.", label: "Nature of Platform" },
  { id: "sec-3", num: "3.", label: "User Eligibility & Account" },
  { id: "sec-4", num: "4.", label: "User Obligations" },
  { id: "sec-5", num: "5.", label: "Platform Intermediary Role" },
  { id: "sec-6", num: "6.", label: "Grievance Redressal" },
  { id: "sec-7", num: "7.", label: "DPDPA Compliance" },
];

export default function TermsOfService({ defaultTab = "terms" }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [activeSec, setActiveSec] = useState("sec-1");

  const scrollToSec = (id) => {
    setActiveSec(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "privacy") {
      navigate("/privacypolicy");
    } else if (tab === "terms") {
      navigate("/termsofservice");
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
              {TOC_ITEMS.map((item) => (
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
              <strong>Have questions?</strong>
              <p>Contact our privacy office if you need clarification on any terms.</p>
              <button onClick={() => alert("Please contact support at privacy@huzzler.app")}>
                Reach out to support →
              </button>
            </div>
          </aside>

          {/* ---------- MAIN CONTENT ---------- */}
          <main className="policy-main">
            <h1 className="page-title">Terms of Service</h1>

            <div className="updated">
              <FiClock size={16} /> Updated: October 31, 2025
            </div>

            <div className="overview-card">
              <div className="overview-icon">
                <FiFileText size={24} />
              </div>
              <div>
                <h3>Terms Overview</h3>
                <p>
                  Welcome to Huzzler by Zuntra Digital Private Limited. This Agreement governs your
                  overall access to and use of our website, mobile app, and services. By using our
                  platform, you agree to be legally bound by these terms.
                </p>
              </div>
            </div>

            {/* 1. DEFINITIONS */}
            <section id="sec-1" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">1</div>
                <h2>Definitions</h2>
              </div>
              <p className="lede">
                Understanding key terms used throughout this Agreement:
              </p>
              <ul className="item-list">
                <li className="item">
                  <span className="tag">a)</span>
                  <div>
                    <strong>“Charges/Platform Fees”</strong> means any fees charged by the Company
                    for use of the Platform or premium features, if and when applicable and publicly notified.
                  </div>
                </li>
                <li className="item">
                  <span className="tag">b)</span>
                  <div>
                    <strong>“Client”</strong> means any User (individual or entity) seeking freelance services or posting requirements on the Platform.
                  </div>
                </li>
                <li className="item">
                  <span className="tag">c)</span>
                  <div>
                    <strong>“Confidential Information”</strong> means non-public information disclosed by one User to another (or to the Company) that is marked confidential or would reasonably be considered confidential by its nature.
                  </div>
                </li>
                <li className="item">
                  <span className="tag">d)</span>
                  <div>
                    <strong>“Data Fiduciary”</strong> refers to any person who alone or in conjunction with other persons determines the purpose and means of processing personal data under the Digital Personal Data Protection Act, 2023.
                  </div>
                </li>
                <li className="item">
                  <span className="tag">e)</span>
                  <div>
                    <strong>“Freelancer”</strong> means any authorised user and/or independent professional offering services to Clients via the Platform.
                  </div>
                </li>
                <li className="item">
                  <span className="tag">f)</span>
                  <div>
                    <strong>“Platform”</strong> means our website, mobile app, and associated services operated by Zuntra Digital Private Limited.
                  </div>
                </li>
              </ul>
            </section>

            {/* 2. NATURE OF PLATFORM */}
            <section id="sec-2" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">2</div>
                <h2>Nature of Platform</h2>
              </div>
              <p className="lede">
                The Platform acts solely as an online intermediary connecting Freelancers and Clients.
              </p>
              <ul className="item-list">
                <li className="item">
                  <span className="tag">a)</span>
                  <div>
                    We do not employ or represent Freelancers, nor do we control or supervise any work or deliverables.
                  </div>
                </li>
                <li className="item">
                  <span className="tag">b)</span>
                  <div>
                    All contracts, payments, arrangements, rights, and obligations concerning an Engagement are strictly between the Client and the Freelancer.
                  </div>
                </li>
                <li className="item">
                  <span className="tag">c)</span>
                  <div>
                    All Intellectual Property Rights over Work Product or other deliverables exchanged between Client and Freelancer are governed exclusively by their own agreement.
                  </div>
                </li>
              </ul>
            </section>

            {/* 3. USER ELIGIBILITY */}
            <section id="sec-3" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">3</div>
                <h2>User Eligibility & Account Creation</h2>
              </div>
              <ul className="item-list">
                <li className="item">
                  <span className="tag">a)</span>
                  <div>Users must be 18 years or older and have legal capacity to contract under the Indian Contract Act, 1872.</div>
                </li>
                <li className="item">
                  <span className="tag">b)</span>
                  <div>Users below 18 years may use the Platform only through a parent or legal guardian who assumes full responsibility.</div>
                </li>
                <li className="item">
                  <span className="tag">c)</span>
                  <div>Users are responsible for maintaining the confidentiality of their login credentials and all account activity.</div>
                </li>
              </ul>
            </section>

            {/* 4. USER OBLIGATIONS */}
            <section id="sec-4" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">4</div>
                <h2>User Obligations</h2>
              </div>
              <p className="lede">
                Users agree not to post, upload, transmit, or share content that:
              </p>
              <ul className="item-list">
                <li className="item">
                  <span className="tag">i)</span>
                  <div>Belongs to another person and to which the User does not have any right.</div>
                </li>
                <li className="item">
                  <span className="tag">ii)</span>
                  <div>Is defamatory, obscene, pornographic, pedophilic, invasive of privacy, or unlawful.</div>
                </li>
                <li className="item">
                  <span className="tag">iii)</span>
                  <div>Infringes any patent, trademark, copyright, or other proprietary rights.</div>
                </li>
              </ul>
            </section>

            {/* 5. INTERMEDIARY ROLE */}
            <section id="sec-5" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">5</div>
                <h2>Platform Intermediary Role & Safe Harbor</h2>
              </div>
              <p className="lede">
                The Company operates as an intermediary under Section 79 of the Information Technology Act, 2000. We do not initiate transmission, select receivers, or select or modify information contained in transmissions.
              </p>
            </section>

            {/* 6. GRIEVANCE REDRESSAL */}
            <section id="sec-6" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">6</div>
                <h2>Grievance Redressal Mechanism</h2>
              </div>
              <p className="lede">
                Under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:
              </p>
              <ul className="item-list">
                <li className="item">
                  <span className="tag">•</span>
                  <div><strong>Grievance Officer:</strong> Zuntra Digital Support Team</div>
                </li>
                <li className="item">
                  <span className="tag">•</span>
                  <div><strong>Email:</strong> grievance@zuntra.in / support@huzzler.app</div>
                </li>
              </ul>
            </section>

            {/* 7. DPDPA COMPLIANCE */}
            <section id="sec-7" className="tos-section">
              <div className="sec-head">
                <div className="sec-num">7</div>
                <h2>DPDPA Act 2023 Compliance</h2>
              </div>
              <p className="lede">
                Huzzler respects data principals' rights under the Digital Personal Data Protection Act, 2023. Personal data is processed lawfully with user consent and strict safeguards.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}