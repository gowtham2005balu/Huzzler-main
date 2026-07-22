// import React, { useState } from "react";
// import backarrow from "../assets/backarrow.png"

// const HelpCenter = () => {
//   const [openIndex, setOpenIndex] = useState(null);

//   const faqs = [
//     {
//       question: "How do I create or delete my account?",
//       answer:
//         "Dummy content: You can create an account by signing up on our platform. To delete your account, please contact support."
//     },
//     {
//       question: "How is my personal data protected under the DPDP Act?",
//       answer:
//         "All users have the right to withdraw consent at any point in time by contacting the company. The DPDP Act is a law requiring Huzzler to only use data for legal purposes and as described in our Terms & Disclosures. We store and protect your data according to strict security guidelines."
//     },
//     {
//       question: "Can I withdraw my consent for data processing?",
//       answer:
//         "Dummy content: Yes, you can withdraw your consent at any time by contacting our support team."
//     },
//     {
//       question: "Who can see my freelancer or client profile?",
//       answer:
//         "Dummy content: Your profile is visible to registered users depending on your visibility settings."
//     },
//     {
//       question: "Are payments handled?",
//       answer:
//         "Dummy content: All payments are securely processed and monitored by our system."
//     },
//     {
//       question: "What should I do if I face an issue with another user?",
//       answer:
//         "Dummy content: Contact our support team with details so we can review and resolve the issue."
//     },
//     {
//       question: "Who can I contact for data or privacy concerns?",
//       answer:
//         "Dummy content: Please reach out to privacy@yourapp.com for any privacy-related queries."
//     }
//   ];

//   const toggle = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div style={styles.page}>
//       {/* Header */}
//       <div style={styles.header}>
//         <div
//           onClick={() => navigate(-1)}
//           aria-label="Back"
//           style={{
//             width: "36px",
//             height: "36px",
//             borderRadius: "14px",
//             border: "0.8px solid #ccc",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             cursor: "pointer",
//             fontSize: "20px",
//             opacity: 1,
//             flexShrink: 0,
//             marginBottom: "18px",
//             marginTop:"17px"
//           }}
//         >
//           <img
//             src={backarrow}
//             alt="back arrow"
//             height={20}
//           />
//         </div>

//         <h2 style={styles.title}>Help Center</h2>
//       </div>

//       {/* FAQ Section */}
//       <div style={styles.container}>
//         <h1 style={styles.heading}>Frequently Asked Questions</h1>

//         <div style={styles.faqWrapper}>
//           {faqs.map((item, index) => (
//             <div key={index} style={styles.faqItem}>
//               <div style={styles.questionRow} onClick={() => toggle(index)}>
//                 <span>{item.question}</span>
//                 <span style={styles.icon}>{openIndex === index ? "✕" : "+"}</span>
//               </div>

//               {openIndex === index && (
//                 <div style={styles.answer}>
//                   {item.answer}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ---------- Inline Styles ---------- */
// const styles = {
//   page: {
//     fontFamily: "Arial, sans-serif",
//     minHeight: "100vh",
//     padding: "20px 40px"
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     gap: "15px",
//     marginBottom: "20px"
//   },
//   backBtn: {
//     fontSize: "25px",
//     border: "none",
//     background: "transparent",
//     cursor: "pointer"
//   },
//   title: {
    
//     fontSize: "22px",
//     fontWeight: "600"
//   },

//   heading: {
//     textAlign: "center",
//     marginBottom: "35px",
//     fontSize: "28px",
//     fontWeight: "600"
//   },
//   faqWrapper: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px"
//   },
//   faqItem: {
//     background: "#f8f5e5",
//     padding: "18px 22px",
//     borderRadius: "12px",
//     cursor: "pointer",
//     transition: "0.3s"
//   },
//   questionRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     fontSize: "16px",
//     fontWeight: 500
//   },
//   icon: {
//     fontSize: "20px",
//     fontWeight: "bold"
//   },
//   answer: {
//     marginTop: "10px",
//     fontSize: "14px",
//     lineHeight: "1.5",
//     color: "#555"
//   }
// };

// export default HelpCenter;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backarrow from "../assets/backarrow.png";

const HelpCenter = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  // ✅ 1️⃣ Add sidebar collapsed state
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  // ✅ 2️⃣ Listen for sidebar toggle
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  const faqs = [
    {
      question: "How do I create or delete my account?",
      answer:
        "Dummy content: You can create an account by signing up on our platform. To delete your account, please contact support."
    },
    {
      question: "How is my personal data protected under the DPDP Act?",
      answer:
        "All users have the right to withdraw consent at any point in time by contacting the company. The DPDP Act is a law requiring Huzzler to only use data for legal purposes and as described in our Terms & Disclosures. We store and protect your data according to strict security guidelines."
    },
    {
      question: "Can I withdraw my consent for data processing?",
      answer:
        "Dummy content: Yes, you can withdraw your consent at any time by contacting our support team."
    },
    {
      question: "Who can see my freelancer or client profile?",
      answer:
        "Dummy content: Your profile is visible to registered users depending on your visibility settings."
    },
    {
      question: "Are payments handled?",
      answer:
        "Dummy content: All payments are securely processed and monitored by our system."
    },
    {
      question: "What should I do if I face an issue with another user?",
      answer:
        "Dummy content: Contact our support team with details so we can review and resolve the issue."
    },
    {
      question: "Who can I contact for data or privacy concerns?",
      answer:
        "Dummy content: Please reach out to privacy@yourapp.com for any privacy-related queries."
    }
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // ✅ 3️⃣ Wrap whole UI inside margin-left
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease"
      }}
    >
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.header}>
          <div
            onClick={() => navigate(-1)}
            aria-label="Back"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "14px",
              border: "0.8px solid #ccc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "20px",
              opacity: 1,
              flexShrink: 0,
              marginBottom: "18px",
              marginTop: "17px"
            }}
          >
            <img src={backarrow} alt="back arrow" height={20} />
          </div>

          <h2 style={styles.title}>Help Center</h2>
        </div>

        {/* FAQ Section */}
        <div style={styles.container}>
          <h1 style={styles.heading}>Frequently Asked Questions</h1>

          <div style={styles.faqWrapper}>
            {faqs.map((item, index) => (
              <div key={index} style={styles.faqItem}>
                <div
                  style={styles.questionRow}
                  onClick={() => toggle(index)}
                >
                  <span>{item.question}</span>
                  <span style={styles.icon}>
                    {openIndex === index ? "✕" : "+"}
                  </span>
                </div>

                {openIndex === index && (
                  <div style={styles.answer}>{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Inline Styles ---------- */
const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    padding: "20px 40px"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px"
  },
  backBtn: {
    fontSize: "25px",
    border: "none",
    background: "transparent",
    cursor: "pointer"
  },
  title: {
    fontSize: "22px",
    fontWeight: "600"
  },
  heading: {
    textAlign: "center",
    marginBottom: "35px",
    fontSize: "28px",
    fontWeight: "600"
  },
  faqWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  faqItem: {
    background: "#f8f5e5",
    padding: "18px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "0.3s"
  },
  questionRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    fontWeight: 500
  },
  icon: {
    fontSize: "20px",
    fontWeight: "bold"
  },
  answer: {
    marginTop: "10px",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#555"
  }
};

export default HelpCenter;
