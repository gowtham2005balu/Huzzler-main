



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firbase/Firebase";

export default function AddService() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryDays: "",
    skills: "",
    tools: "",
    requirements: "",
  });

  const [previewFiles, setPreviewFiles] = useState([]);
  const [error, setError] = useState("");
  
  // UI-only states to match Figma design
  const [serviceType, setServiceType] = useState("Work");
  const [maxPrice, setMaxPrice] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // 🧩 Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🧩 Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    let errorMsg = "";

    files.forEach((file) => {
      if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
        validFiles.push(file);
      } else if (file.type.startsWith("video/") && file.size <= 20 * 1024 * 1024) {
        validFiles.push(file);
      } else {
        errorMsg = `❌ ${file.name} exceeds size limit (5MB for images / 20MB for videos).`;
      }
    });

    if (errorMsg) {
      setError(errorMsg);
      setTimeout(() => setError(""), 4000);
    } else {
      setError("");
    }

    setPreviewFiles(validFiles);
  };

  // 🧩 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const email = auth.currentUser?.email || localStorage.getItem("userEmail") || "freelancer@example.com";

    const serviceData = {
      ...formData,
      userEmail: email,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tools: formData.tools
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: previewFiles.map((file) => URL.createObjectURL(file)), // temporary preview (later AWS S3)
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "services"), serviceData);
      setShowSuccessPopup(true);
      setTimeout(() => {
        navigate("/myjobs");
      }, 2500);
    } catch (err) {
      console.error("Save service error:", err);
      alert("Failed to save service. Check console.");
    }
  };

  return (
    <div className="add-service-wrapper">
      <style>{`
        .add-service-wrapper {
          padding: 40px;
          background: #FAFAFA;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
        }
        .add-service-container {
          max-width: 1464px;
          margin: 0;
          width: 100%;
        }
        .form-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .add-service-header {
          margin-bottom: 32px;
        }
        .add-service-title {
          font-size: 24px;
          font-weight: 700;
          color: #1A1730;
          margin: 0 0 6px 0;
          letter-spacing: -0.5px;
        }
        .add-service-subtitle {
          font-size: 14px;
          color: #9B97B8;
          margin: 0;
        }
        .add-service-layout {
          display: flex;
          gap: 40px;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .add-service-form {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-width: 300px;
          max-width: 962px;
        }
        @media (max-width: 1100px) {
          .add-service-form {
            min-width: 100%;
          }
        }
        /* Responsive layout */
        @media (max-width: 768px) {
          .add-service-layout {
            flex-direction: column;
          }
          .add-service-sidebar {
            width: 100%;
          }
        }
        
        /* Success Popup */
        .success-popup-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }
        .success-popup-box {
          background: #fff;
          padding: 40px;
          border-radius: 16px;
          text-align: center;
          max-width: 400px;
          width: 90%;
          box-shadow: 0px 10px 40px rgba(0,0,0,0.1);
          animation: slideUp 0.3s ease;
        }
        .success-icon-wrapper {
          width: 64px;
          height: 64px;
          background: #E8F8F0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
        }
        .success-popup-title {
          font-size: 22px;
          font-weight: 700;
          color: #1A1730;
          margin-bottom: 8px;
        }
        .success-popup-text {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 24px;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        /* Toggle Switch */
        .add-service-toggle-bg {
          background: #F4F4F5;
          border-radius: 12px;
          padding: 6px;
          display: flex;
        }
        .add-service-toggle-btn {
          flex: 1;
          padding: 12px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-service-toggle-btn.active {
          background: #FFFFFF;
          box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
          color: #6C4DFF;
        }
        .add-service-toggle-btn.inactive {
          color: #9CA3AF;
          font-weight: 500;
        }
        
        /* Form Inputs */
        .add-service-label {
          font-size: 13px;
          font-weight: 600;
          color: #1A1730;
          margin-bottom: 8px;
          display: block;
        }
        .add-service-label-sub {
          color: #9CA3AF;
          font-weight: 400;
        }
        .add-service-input, .add-service-select {
          width: 100%;
          background: #F8F9FA;
          border: none;
          border-radius: 12px;
          height: 65px;
          padding: 0 20px;
          box-sizing: border-box;
          font-size: 14px;
          color: #1A1730;
          outline: none;
          font-family: inherit;
          transition: all 0.2s;
        }
        .add-service-input::placeholder, .add-service-textarea::placeholder, .add-service-select:invalid {
          color: #9CA3AF;
        }
        .add-service-input:focus, .add-service-textarea:focus, .add-service-select:focus {
          background: #FFFFFF;
          box-shadow: 0 0 0 2px #E0D4FF;
        }
        .add-service-textarea {
          width: 100%;
          background: #F8F9FA;
          border: none;
          border-radius: 12px;
          padding: 20px;
          box-sizing: border-box;
          font-size: 14px;
          color: #1A1730;
          outline: none;
          min-height: 140px;
          resize: vertical;
          font-family: inherit;
          transition: all 0.2s;
        }
        .add-service-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .add-service-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1A1730;
          margin: 16px 0 8px 0;
        }
        
        /* Tags */
        .tag-row {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .skill-tag {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .skill-tag span { font-size: 10px; cursor: pointer; }
        .tag-ui { background: #EEF2FF; color: #6366F1; }
        .tag-figma { background: #ECFDF5; color: #10B981; }
        .tag-proto { background: #FDF2F8; color: #EC4899; }
        
        /* FAQ Section */
        .faq-box {
          background: #F8F9FA;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #9CA3AF;
          font-size: 14px;
          font-weight: 500;
          border: 1px dashed #E5E7EB;
          cursor: pointer;
          margin-top: 8px;
        }
        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
        }
        .faq-add-btn {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #4B5563;
          cursor: pointer;
        }
        
        /* Publish Button */
        .add-service-publish-btn {
          width: 100%;
          background: linear-gradient(100.36deg, #6C4DFF 0%, #8B6DFF 100%);
          border-radius: 12px;
          padding: 16px;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
        }
        
        /* Sidebar styling */
        .ai-sidebar {
          flex: 1;
          max-width: 456px;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding-top: 0;
        }
        @media (max-width: 1100px) {
          .ai-sidebar {
            max-width: 100%;
            padding-top: 0;
          }
        }
        .ai-card {
          background: #FFFFFF;
          box-shadow: 0px 8px 40px rgba(108, 77, 255, 0.16);
          border-radius: 22px;
          padding: 30.4px;
          display: flex;
          flex-direction: column;
          gap: 15.2px;
          position: relative;
          overflow: hidden;
        }
        .ai-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #6C4DFF;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }
        .ai-card-status {
          font-size: 12px;
          color: #10B981;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ai-card-status::before {
          content: '';
          width: 6px;
          height: 6px;
          background: #10B981;
          border-radius: 50%;
        }
        .ai-tags {
          display: flex;
          gap: 8px;
        }
        .ai-tag {
          font-size: 11px;
          font-weight: 600;
          padding: 6px 10px;
          border-radius: 20px;
        }
        .ai-tag-blue { background: #EFF6FF; color: #3B82F6; }
        .ai-tag-green { background: #ECFDF5; color: #10B981; }
        .ai-tag-red { background: #FEF2F2; color: #EF4444; }
        .ai-desc {
          font-size: 14px;
          color: #4B5563;
          line-height: 1.6;
          margin: 0;
        }
        .ai-input {
          width: 100%;
          background: #F8F9FA;
          border: 1px solid #F3F4F6;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          outline: none;
        }
        .ai-btn {
          width: 100%;
          background: linear-gradient(100.36deg, #6C4DFF 0%, #8B6DFF 100%);
          border-radius: 12px;
          padding: 14px;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        
        .ai-pricing-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ai-pricing-title {
          font-size: 16px;
          font-weight: 700;
          color: #1A1730;
          margin: 0;
        }
        .ai-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #F3F4F6;
        }
        .ai-price-name {
          font-size: 14px;
          font-weight: 600;
          color: #1A1730;
        }
        .ai-price-sub {
          font-size: 12px;
          color: #9CA3AF;
          margin-top: 4px;
        }
        .ai-price-val {
          font-size: 14px;
          font-weight: 700;
          color: #1A1730;
        }
        .ai-price-row.highlight {
          background: #F4F0FF;
          border-radius: 12px;
          border-bottom: none;
        }
        .ai-price-row.highlight .ai-price-name, .ai-price-row.highlight .ai-price-val {
          color: #6C4DFF;
        }
      `}</style>

      <div className="add-service-container">
        <div className="add-service-header">
          <h1 className="add-service-title">Create New Service</h1>
          <p className="add-service-subtitle">Launch your service and let clients find you.</p>
        </div>

        <div className="add-service-layout">
          <form onSubmit={handleSubmit} className="add-service-form">
          
          {/* SERVICE TYPE TOGGLE */}
          <div className="add-service-toggle-bg">
            <div 
              className={`add-service-toggle-btn ${serviceType === "Work" ? "active" : "inactive"}`}
              onClick={() => setServiceType("Work")}
            >Work</div>
            <div 
              className={`add-service-toggle-btn ${serviceType === "24 hours" ? "active" : "inactive"}`}
              onClick={() => setServiceType("24 hours")}
            >24 hours</div>
          </div>

          {/* BASIC INFO */}
          <div className="form-card">
            <div>
              <label className="add-service-label">Service Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="add-service-input" 
                placeholder="e.g. Logo Design That Pops and Defines Your Brand" 
              />
            </div>
            
            <div>
              <label className="add-service-label">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="add-service-textarea" 
                placeholder="Describe your service and showcase your uniqueness" 
              />
            </div>
            
            <div className="add-service-grid-2">
              <div>
                <label className="add-service-label">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="add-service-select"
                >
                  <option value="">Select Category</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Writing">Writing</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div>
                <label className="add-service-label">Delivery Days</label>
                <input 
                  type="number" 
                  name="deliveryDays"
                  value={formData.deliveryDays}
                  onChange={handleChange}
                  className="add-service-input" 
                  placeholder="In days" 
                />
              </div>
            </div>
          </div>

          {/* PRICING */}
          <div className="form-card">
            <h3 className="add-service-section-title" style={{ margin: 0 }}>Pricing</h3>
            <div className="add-service-grid-2">
              <div>
                <label className="add-service-label">Minimum Price (₹)</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="add-service-input" 
                  placeholder="Min" 
                />
              </div>
              <div>
                <label className="add-service-label">Maximum Price (₹)</label>
                <input 
                  type="number" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="add-service-input" 
                  placeholder="Max" 
                />
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="form-card">
            <div>
              <label className="add-service-label">Skills <span className="add-service-label-sub">(Add at least 3)</span></label>
              <input 
                type="text" 
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="add-service-input" 
                placeholder="Add Skills..." 
              />
              <div className="tag-row">
                <div className="skill-tag tag-ui">UI Design <span>✕</span></div>
                <div className="skill-tag tag-figma">Figma <span>✕</span></div>
                <div className="skill-tag tag-proto">Prototyping <span>✕</span></div>
              </div>
            </div>
            
            <div>
              <label className="add-service-label">Tools <span className="add-service-label-sub">(Add at least 3)</span></label>
              <input 
                type="text" 
                name="tools"
                value={formData.tools}
                onChange={handleChange}
                className="add-service-input" 
                placeholder="Add Tools..." 
              />
            </div>
            
            <div>
              {/* Preserved file logic entirely! Styled to match input box */}
              <label className="add-service-label">Sample Projects (URL)</label>
              <div className="add-service-input" style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileChange} 
                  style={{ width: '100%', outline: 'none' }}
                />
              </div>
              {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
            </div>
            
            <div>
              <label className="add-service-label">Deliverables</label>
              <input 
                type="text" 
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                className="add-service-input" 
                placeholder="Add Deliverables" 
              />
            </div>
            
            <div>
              <label className="add-service-label">Client Requirements <span className="add-service-label-sub">[Optional]</span></label>
              <textarea 
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="add-service-textarea" 
                placeholder="What do you need from your client to get started" 
                style={{ minHeight: '100px' }}
              />
            </div>
          </div>

          {/* FAQ */}
          <div className="form-card">
            <div className="faq-header" style={{ marginTop: 0 }}>
              <h3 className="add-service-section-title" style={{ margin: 0 }}>FAQ</h3>
              <button type="button" className="faq-add-btn">+ Add Question</button>
            </div>
            <div className="faq-box" style={{ marginTop: 0 }}>
              Add common questions clients ask about your service
            </div>
          </div>

          {/* ACTIONS */}
          <button type="submit" className="add-service-publish-btn">
            ✓ Publish Service
          </button>

        </form>

        {/* RIGHT SIDEBAR - AI ASSISTANT */}
        <div className="ai-sidebar">
          <div className="ai-card">
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: '#E0D4FF', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.6, zIndex: 0 }}></div>
            
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '15.2px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 className="ai-card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#6C4DFF"/>
                  </svg>
                  AI Assistant
                </h3>
                <div className="ai-card-status" style={{ paddingLeft: '28px' }}>Online & ready</div>
              </div>
              
              <div className="ai-tags" style={{ marginTop: '16px', marginBottom: '16px' }}>
                <span className="ai-tag ai-tag-blue">⚡ Auto-fill fields</span>
                <span className="ai-tag ai-tag-green">$ Smart pricing</span>
                <span className="ai-tag ai-tag-red">✍ Write description</span>
              </div>
              
              <p className="ai-desc" style={{ marginBottom: '20px' }}>
                Hi! Tell me what <strong>service you want to offer</strong> and I'll generate a compelling title, description, skills, and suggest the perfect pricing — in seconds.
              </p>
              
              <input type="text" className="ai-input" placeholder="e.g. UI/UX Design for mobile apps" style={{ marginBottom: '16px' }} />
              
              <button className="ai-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFFFFF"/>
                </svg>
                Generate Service Details
              </button>
              
              <p style={{ fontSize: '10px', color: '#9CA3AF', textAlign: 'center', marginTop: '12px', marginBottom: '0' }}>
                AI may suggest edits — always review before publishing
              </p>
            </div>
          </div>

          <div className="ai-pricing-card">
            <h3 className="ai-pricing-title">AI Pricing Suggestions</h3>
            
            <div className="ai-price-row">
              <div>
                <div className="ai-price-name">Starter</div>
                <div className="ai-price-sub">Basic deliverables</div>
              </div>
              <div className="ai-price-val">₹800–1,200</div>
            </div>

            <div className="ai-price-row highlight">
              <div>
                <div className="ai-price-name">Standard ✦ Popular</div>
                <div className="ai-price-sub">Full scope delivery</div>
              </div>
              <div className="ai-price-val">₹1,500–2,500</div>
            </div>

            <div className="ai-price-row" style={{ borderBottom: 'none' }}>
              <div>
                <div className="ai-price-name">Premium</div>
                <div className="ai-price-sub">All-inclusive</div>
              </div>
              <div className="ai-price-val">₹3,000–5,000</div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup-box">
            <div className="success-icon-wrapper">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#30B47A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="success-popup-title">Service Published!</h3>
            <p className="success-popup-text">Your service is now live on the client dashboard. Redirecting you to your services...</p>
          </div>
        </div>
      )}
    </div>
  );
}
