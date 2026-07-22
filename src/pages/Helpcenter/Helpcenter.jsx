// import React, { useState, useEffect } from "react";
// import { IoChevronBack } from "react-icons/io5";

// const HelpCenter = () => {
//   const [collapsed, setCollapsed] = useState(
//     localStorage.getItem("sidebar-collapsed") === "true"
//   );

//   useEffect(() => {
//     const handleToggle = (e) => setCollapsed(e.detail);
//     window.addEventListener("sidebar-toggle", handleToggle);
//     return () => window.removeEventListener("sidebar-toggle", handleToggle);
//   }, []);

//   const [openIndex, setOpenIndex] = useState(null);

//   const faqData = [
//     {
//       question: "How do I create or delete my account?....................",
//       answer:
//         "To delete an account, log in, find 'Settings' or 'Account,' then look for 'Data & Privacy' or a similar option."
//     },
//     {
//       question: "How is my personal data protected under the DPDPA Act?",
//       answer:
//         "Your data is protected through strict encryption, access control, and legal compliance."
//     },
//     {
//       question: "Can I withdraw my consent for data processing?",
//       answer: "Yes – via email or profile settings."
//     },
//     {
//       question: "Who can see my freelancer or client profile?",
//       answer:
//         "Visibility depends on your privacy settings. It may be public, private, or restricted."
//     },
//     {
//       question: "Are payments handled?",
//       answer: "Currently, payments are not handled directly."
//     },
//     {
//       question: "What should I do if I face an issue with another user?",
//       answer:
//         "You can lodge a report to our Grievance Officer for investigation."
//     },
//     {
//       question: "Who can I contact for data or privacy concerns?",
//       answer:
//         "You may contact our Privacy Office or support team via the contact page."
//     }
//   ];

//   const toggleFAQ = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap');

//         * {
//           box-sizing: border-box;
//         }

//         .help-center-container {
//           min-height: 100vh;
//           background: #fdfdf6;
//           padding: 40px 30px 60px;
//           font-family: "Rubik", sans-serif;
//           transition: margin-left 0.25s ease;
//         }

//         /* ---------- Header ---------- */
//         .header-row {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           font-size: 36px;
//           font-weight: 400;
//           line-height: 40px;
//         }

//         /* ---------- Title ---------- */
//         .faq-title {
//           margin-top: 60px;
//           margin-bottom: 50px;
//           text-align: center;
//           font-size: 52px;
//           font-weight: 400;
//           line-height: 130%;
//           letter-spacing: 0.5px;
//           color:#000
//         }

//         /* ---------- FAQ List ---------- */
//         .faq-list {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 14px;
//         }

//         /* ---------- QUESTION CONTAINER (FIGMA EXACT) ---------- */
//         .faq-item {
//           width: 700px;
//           background: #fdfcea;
//           border-radius: 28px;
//           padding: 10px 18px;
//           cursor: pointer;
//           transition: background 0.2s ease;
//         }

//         .faq-item:hover {
//           background: #faf3c8;
//         }

//         .faq-question {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 10px;
//           height: 52px;
//           font-size: 16px;
//           font-weight: 400;
//         }

//         .faq-question p {
//           margin: 0;
//         }

//         /* ---------- PLUS ICON ---------- */
//         .plus-icon {
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           border: 1.2px solid #b47bff;
//           color: #b47bff;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 18px;
//           font-weight: 500;
//           flex-shrink: 0;
//         }

//         /* ---------- ANSWER ---------- */
//         .faq-answer {
//           margin-top: 10px;
//           font-size: 14px;
//           line-height: 1.6;
//           color: #6b6b6b;
//           padding-left: 6px;
//           animation: fade 0.25s ease;
//         }

//         @keyframes fade {
//           from {
//             opacity: 0;
//             transform: translateY(-4px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         /* ---------- MOBILE ---------- */
//         @media (max-width: 768px) {
//           .faq-item {
//             width: 100%;
//           }

//           .faq-title {
//             font-size: 34px;
//           }

//           .faq-question {
//             font-size: 14px;
//           }
//         }
//       `}</style>

//       <div
//         className="help-center-container"
//         style={{ marginLeft: collapsed ? "-110px" : "50px" }}
//       >
//         <div className="header-row">
//           <IoChevronBack size={26} />
//           <span>Help Center</span>
//         </div>

//         <h1 className="faq-title">
//           Frequently Asked
//           <br />
//           Questions
//         </h1>

//         <div className="faq-list">
//           {faqData.map((item, index) => (
//             <div
//               key={index}
//               className="faq-item"
//               onClick={() => toggleFAQ(index)}
//             >
//               <div className="faq-question">
//                 <p>{item.question}</p>
//                 <div className="plus-icon">
//                   {openIndex === index ? "−" : "+"}
//                 </div>
//               </div>

//               {openIndex === index && (
//                 <div className="faq-answer">{item.answer}</div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default HelpCenter;









// import React, { useEffect, useState } from "react";
// import { getAuth } from "firebase/auth";
// import {
//   addDoc,
//   collection,
//   doc,
//   getDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../../firbase/Firebase"; // 🔁 path correct pannu
// import { useNavigate } from "react-router-dom";

// /* ======================================================
//    MAIN COMPONENT
// ====================================================== */
// export default function RaiseTicketScreen({ selectedCategory: initialCategory }) {
//   const auth = getAuth();
//   const navigate = useNavigate();
//   const user = auth.currentUser;

//   /* ================= STATE ================= */
//   const [ticketId, setTicketId] = useState("");
//   const [email, setEmail] = useState("");
//   const [subject, setSubject] = useState("");
//   const [description, setDescription] = useState("");

//   const [selectedCategory, setSelectedCategory] = useState(initialCategory);
//   const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
//   const [loading, setLoading] = useState(false);

//   /* ================= DATA ================= */
//   const categories = [
//     "Chat Message Not Delivered / Duplicate Issue",
//     "Push Notification Failure",
//     "Fake Accounts / Bot Profiles",
//     "Data Loss / Profile Reset Bug",
//     "Slow Home Feed / App Freeze",
//     "Crash on Image Upload",
//     "Logout Login Chat Missing",
//     "Notification Badge Count Wrong",
//     "Account Block / Delete Sync Bug",
//   ];

//   /* ================= INIT ================= */
//   useEffect(() => {
//     generateTicketId();
//     fetchUserEmail();
//   }, []);

//   /* ================= HELPERS ================= */
//   const generateTicketId = () => {
//     const random = Math.floor(Math.random() * 999999);
//     setTicketId(`HZ-${new Date().getFullYear()}-${random}`);
//   };

//   const fetchUserEmail = async () => {
//     if (!user) return;
//     try {
//       const snap = await getDoc(doc(db, "users", user.uid));
//       if (snap.exists()) {
//         setEmail(snap.data().email || "");
//       }
//     } catch (e) {
//       console.error("Fetch email error", e);
//     }
//   };

//   const showError = (msg) => {
//     alert(msg);
//   };

//   /* ================= SUBMIT ================= */
//   const submitTicket = async () => {
//     if (!selectedCategory) {
//       showError("Please select a ticket category");
//       return;
//     }
//     if (!subject.trim()) {
//       showError("Subject cannot be empty");
//       return;
//     }
//     if (!description.trim()) {
//       showError("Description cannot be empty");
//       return;
//     }

//     try {
//       setLoading(true);

//       // 🔥 1️⃣ Save to Firestore
//       await addDoc(collection(db, "support_tickets"), {
//         ticketId,
//         category: selectedCategory,
//         email,
//         subject,
//         description,
//         userId: user.uid,
//         status: "raised",
//         createdAt: serverTimestamp(),
//       });

//       // 🔥 2️⃣ Send Mail API
//       await sendRaiseTicketMail({
//         ticketId,
//         category: selectedCategory,
//         email,
//         subject,
//         description,
//       });

//       alert("Ticket submitted successfully");
//       navigate(-1);
//     } catch (e) {
//       console.error("Submit ticket error", e);
//       showError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= MAIL API ================= */
//   const sendRaiseTicketMail = async ({
//     ticketId,
//     category,
//     email,
//     subject,
//     description,
//   }) => {
//     try {
//       const res = await fetch(
//         "https://huzzler.onrender.com/api/support/raise-ticket",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             ticketId,
//             category,
//             email,
//             subject,
//             description,
//           }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok || data.success !== true) {
//         console.error("Mail API failed", data);
//       }
//     } catch (e) {
//       console.error("Mail API error", e);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.appBar}>
//         <button onClick={() => navigate(-1)} style={styles.backBtn}>
//           ←
//         </button>
//         <h2>Raise a Ticket</h2>
//       </div>

//       <div style={styles.container}>
//         {/* TITLE */}
//         <h3>Raise a Support Ticket</h3>
//         <p style={styles.subText}>
//           We’re here to help. Tell us what went wrong and we’ll get back to you.
//         </p>

//         {/* TICKET ID */}
//         <label>Ticket ID</label>
//         <input value={ticketId} disabled style={styles.readonly} />

//         {/* CATEGORY */}
//         <label>Ticket Category</label>
//         <div style={styles.dropdown}>
//           <div
//             style={styles.dropdownHeader}
//             onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
//           >
//             <span>{selectedCategory || "Select an issue category"}</span>
//             <span>{isCategoryExpanded ? "▲" : "▼"}</span>
//           </div>

//           {isCategoryExpanded &&
//             categories.map((c) => (
//               <div
//                 key={c}
//                 style={styles.dropdownItem}
//                 onClick={() => {
//                   setSelectedCategory(c);
//                   setIsCategoryExpanded(false);
//                 }}
//               >
//                 {c}
//               </div>
//             ))}
//         </div>

//         {/* EMAIL */}
//         <label>Email</label>
//         <input value={email} disabled style={styles.readonly} />

//         {/* SUBJECT */}
//         <label>Subject</label>
//         <input
//           value={subject}
//           onChange={(e) => setSubject(e.target.value)}
//           placeholder="Briefly describe your issue"
//           style={styles.input}
//         />

//         {/* DESCRIPTION */}
//         <label>Description</label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Explain the problem in detail"
//           rows={5}
//           style={styles.input}
//         />

//         {/* BUTTONS */}
//         <div style={styles.buttonRow}>
//           <button
//             style={styles.cancelBtn}
//             onClick={() => navigate(-1)}
//             disabled={loading}
//           >
//             Cancel
//           </button>

//           <button
//             style={styles.submitBtn}
//             onClick={submitTicket}
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit Ticket"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ======================================================
//    STYLES (INLINE – SINGLE FILE)
// ====================================================== */
// const styles = {
//   page: {
//     background: "#fff",
//     minHeight: "100vh",
//   },
//   appBar: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: 16,
//     borderBottom: "1px solid #eee",
//   },
//   backBtn: {
//     border: "none",
//     background: "transparent",
//     fontSize: 20,
//     cursor: "pointer",
//   },
//   container: {
//     padding: 16,
//     maxWidth: 520,
//     margin: "0 auto",
//   },
//   subText: {
//     fontSize: 13,
//     color: "#666",
//     marginBottom: 20,
//   },
//   readonly: {
//     width: "100%",
//     padding: 12,
//     background: "#FFFDC8",
//     borderRadius: 14,
//     border: "none",
//     marginBottom: 14,
//   },
//   input: {
//     width: "100%",
//     padding: 12,
//     background: "#FFFDC8",
//     borderRadius: 14,
//     border: "none",
//     marginBottom: 14,
//   },
//   dropdown: {
//     background: "#FFFDC8",
//     borderRadius: 14,
//     marginBottom: 14,
//   },
//   dropdownHeader: {
//     padding: 14,
//     display: "flex",
//     justifyContent: "space-between",
//     cursor: "pointer",
//   },
//   dropdownItem: {
//     padding: 12,
//     borderTop: "1px solid #eee",
//     cursor: "pointer",
//   },
//   buttonRow: {
//     display: "flex",
//     gap: 12,
//     marginTop: 20,
//   },
//   cancelBtn: {
//     flex: 1,
//     padding: 14,
//     borderRadius: 30,
//     border: "1px solid #ccc",
//     background: "#fff",
//     cursor: "pointer",
//   },
//   submitBtn: {
//     flex: 1,
//     padding: 14,
//     borderRadius: 30,
//     border: "none",
//     background: "#7C3CFF",
//     color: "#fff",
//     fontWeight: 600,
//     cursor: "pointer",
//   },
// };








import React, { useEffect, useState } from "react";
import { IoChevronBack, IoClose } from "react-icons/io5";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firbase/Firebase";
import backarrow from "../../assets/backarrow.png";
import { useNavigate } from "react-router-dom";


export default function HelpCenter() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    const handleToggle = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  /* ================= FAQ ================= */
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (i) => setOpenIndex(openIndex === i ? null : i);

  const faqData = [
    { question: "How do I create or delete my account?", answer: "You can manage this from account settings." },
    { question: "How is my personal data protected under the DPDPA Act?", answer: "All users have the right to withdraw consent at any point in time by contacting the company. The DPDP Act is a law requiring Huzzler to only use data for legal purposes and the purposes we have specified in our Terms & Conditions. In order to adhere to legal provisions in the DPDP Act we ensure that the data we collect is stored and encrypted in accordance with all security provisions." },
    { question: "Can I withdraw my consent for data processing?", answer: "Yes, via settings or email." },
    { question: "Who can see my freelancer or client profile?", answer: "Based on your privacy settings." },
    { question: "Are payments handled?", answer: "Payments are not handled directly." },
    { question: "What should I do if I face an issue with another user?", answer: "Raise a ticket for investigation." },
    { question: "Who can I contact for data or privacy concerns?", answer: "Contact our support team." },
    { question: "Does Huzzler guarantee project completion or payments?", answer: "No guarantees are provided." },
  ];

  /* ================= MODAL ================= */
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }

      .page {
  min-height: 100vh;
  // background: #fdfdf6;
  padding: 40px 30px 80px;
  font-family: Rubik, sans-serif;
  transition: margin-left 0.3s;
}


      .header {
  width: 100%;
  max-width: 700px;      /* SAME as faq-item */
  margin: 0 auto;        /* center horizontally */
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
}
.head h1 {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}





        .title {
          margin: 60px 0 50px;
          text-align: center;
          font-size: 44px;
          font-weight: 400;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
      }
      .faq-item {
  width: 100%;
  max-width: 700px;
  background: #fdfcea;
  border-radius: 28px;
  padding: 12px 18px;
  cursor: pointer;
}

        .faq-q {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 52px;
          font-size: 15px;
        }

        .plus {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7c3aed;
        }

        .faq-a {
          font-size: 14px;
          color: #666;
          margin-top: 8px;
        }

        .help-box {
         
          margin-top: 80px;
          text-align: center;
        }

        .help-box h3 {
          font-weight: 500;
          margin-bottom: 16px;
        }

       .help-actions {
  width: 100%;
  max-width: 700px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}


        select {
          padding: 14px;
          border-radius: 22px;
          border: none;
          background: #fdfcea;
        }

        .raise-btn {
          padding: 14px;
          border-radius: 22px;
          border: none;
          background: #7c3aed;
          color: #fff;
          cursor: pointer;
        }

        /* MODAL */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .modal {
          width: 480px;
          background: #fff;
          border-radius: 24px;
          padding: 20px;
          position: relative;
        }

        .close {
          position: absolute;
          top: 14px;
          right: 14px;
          cursor: pointer;
        }

     @media (max-width: 768px) {
  .page {
    margin-top: 60px;
    padding: 22px; /* ✅ mobile padding */
    margin-left: 0 !important;
  }

  .modal {
    width: 100%;
    padding: 22px; /* ✅ popup padding */
    border-radius: 20px;
  }

  .help-box {
    padding: 0 22px; /* ✅ optional: side spacing */
  }

  .faq-item,
  .help-actions {
    width: 100%;
  }

  .title {
    font-size: 32px;
    margin: 40px 0 32px;
  }

  .header {
    font-size: 18px;
  }
}


          /* ================= POPUP FORM STYLES ================= */

.modal h3 {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}

.modal label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin: 14px 0 6px;
  color: #333;
}

.modal .input {
  width: 100%;
  padding: 12px 14px;
  background: #fdfcea;
  border-radius: 18px;
  border: none;
  font-size: 14px;
  outline: none;
}

.modal textarea.input {
  resize: none;
  min-height: 90px;
}

/* Dropdown list inside popup */
.modal .dropdown-item {
  background: #fff;
  padding: 12px 14px;
  border-radius: 14px;
  margin-top: 6px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #eee;
}

.modal .dropdown-item:hover {
  background: #fdfcea;
}

/* Submit button inside popup */
.modal .submit-btn {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  border-radius: 28px;
  border: none;
  background: #7c3aed;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.modal .submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Smooth popup animation */
.modal {
  animation: scaleIn 0.25s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

      `}</style>

      <div className="page" style={{ marginLeft: collapsed ? "-110px" : "50px" }}>
        <div className="header">
          
            <div
              onClick={() => navigate(-1)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 14,
                border: "0.8px solid #E0E0E0",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                flexShrink: 0,
              }}
            >
              <img
                src={backarrow}
                alt="Back"
                style={{
                  width: 16,
                  height: 18,
                  objectFit: "contain",
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: 32, fontWeight: 400 }}>
                Help Center
              </div>
            </div>
       
          </div>


          <div className="title">
            Frequently Asked
            <br />
            Questions
          </div>

          <div className="faq-list">
            {faqData.map((f, i) => (
              <div key={i} className="faq-item" onClick={() => toggleFAQ(i)}>
                <div className="faq-q">
                  {f.question}
                  <div className="plus">{openIndex === i ? "−" : "+"}</div>
                </div>
                {openIndex === i && <div className="faq-a">{f.answer}</div>}
              </div>
            ))}
          </div>

          {/* HOW CAN WE HELP */}
          <div className="help-box">
            <h3>How can we help you?</h3>

            <div className="help-actions">
              <select onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Select an issue category</option>
                <option value="">  "Chat Message Not Delivered / Duplicate Issue"</option>
                <option> Notification Failure",</option>
                <option>  "Fake Accounts / Bot Profiles",</option>
                <option>  "Data Loss / Profile Reset Bug",</option>
                <option>  "Slow Home Feed / App Freeze",</option>
                <option> "Crash on Image Upload",</option>
                <option>  "Logout Login Chat Missing",</option>
                <option>  "Notification Badge Count Wrong",</option>
                <option>  "Account Block / Delete Sync Bug",</option>
              </select>

              <button className="raise-btn" onClick={() => setShowModal(true)}>
                Raise a Ticket
              </button>
            </div>
          </div>
        </div>

        {/* ================= RAISE TICKET MODAL ================= */}
        {showModal && (
          <div className="overlay">
            <div className="modal">
              <IoClose className="close" onClick={() => setShowModal(false)} />
              <RaiseTicketModal
                selectedCategory={selectedCategory}
                onClose={() => setShowModal(false)}
              />
            </div>
          </div>
        )}
      </>
      );
}

      /* ======================================================
         RAISE TICKET MODAL (BACKEND UNCHANGED)
      ====================================================== */
      function RaiseTicketModal({selectedCategory, onClose}) {
  const auth = getAuth();
      const user = auth.currentUser;

      const [ticketId, setTicketId] = useState("");
      const [email, setEmail] = useState("");
      const [subject, setSubject] = useState("");
      const [description, setDescription] = useState("");
      const [category, setCategory] = useState(selectedCategory);
      const [expanded, setExpanded] = useState(false);
      const [loading, setLoading] = useState(false);

      const categories = [
      "Chat Message Not Delivered / Duplicate Issue",
      "Push Notification Failure",
      "Fake Accounts / Bot Profiles",
      "Data Loss / Profile Reset Bug",
      "Slow Home Feed / App Freeze",
      "Crash on Image Upload",
      "Logout Login Chat Missing",
      "Notification Badge Count Wrong",
      "Account Block / Delete Sync Bug",
      ];

  useEffect(() => {
        setTicketId(`HZ-${new Date().getFullYear()}-${Math.floor(Math.random() * 999999)}`);
      if (!user) return;
    getDoc(doc(db, "users", user.uid)).then(snap => {
      if (snap.exists()) setEmail(snap.data().email);
    });
  }, []);

  const submitTicket = async () => {
    if (!category || !subject || !description) {
        alert("All fields required");
      return;
    }

      try {
        setLoading(true);

      await addDoc(collection(db, "support_tickets"), {
        ticketId,
        category,
        email,
        subject,
        description,
        userId: user.uid,
      status: "raised",
      createdAt: serverTimestamp(),
      });

      await fetch("https://huzzler.onrender.com/api/support/raise-ticket", {
        method: "POST",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify({ticketId, category, email, subject, description}),
      });

      alert("Ticket submitted successfully");
      onClose();
    } catch {
        alert("Something went wrong");
    } finally {
        setLoading(false);
    }
  };

      return (
      <>
        <h3>Raise a Support Ticket</h3>

        <label>Ticket ID</label>
        <input value={ticketId} disabled className="input" />

        <label>Ticket Category</label>
        <div className="input" onClick={() => setExpanded(!expanded)}>
          {category || "Select category"}
        </div>

        {expanded &&
          categories.map((c) => (
            <div
              key={c}
              className="dropdown-item"
              onClick={() => {
                setCategory(c);
                setExpanded(false);
              }}
            >
              {c}
            </div>
          ))}


        <label>Email</label>
        <input value={email} disabled className="input" />

        <label>Subject</label>
        <input value={subject} onChange={e => setSubject(e.target.value)} className="input" />

        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="input" />

        <button
          className="submit-btn"
          onClick={submitTicket}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>

      </>
      );
}
