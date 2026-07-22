import React, { useState } from "react";
import { Star, Sparkles, Search, Bell } from "lucide-react";
import "./AIGenerator.css";

export default function AIGenerator() {
  const [prompt, setPrompt] = useState("");

  const suggestions = ["Logo Designer", "Video Editor", "Content Writer"];

  return (
    <div className="aigenerator-container">
      <div className="aigenerator-top-header">
        <div className="header-search-container">
          <Search size={16} color="#9CA3AF" />
          <input type="text" placeholder="Search freelancers, jobs, services..." className="header-search-input" />
        </div>
        <div className="header-right">
          <button className="header-ai-btn">
            <Star size={14} /> AI Assistant
          </button>
          <button className="header-icon-btn">
            <Bell size={18} />
            <span className="bell-dot"></span>
          </button>
          <div className="header-avatar">HA</div>
        </div>
      </div>

      <div className="aigenerator-header">
        <div className="aigenerator-title-container">
          <div className="aigenerator-icon">
            <Star size={24} color="#7C4EF5" fill="#7C4EF5" />
          </div>
          <div>
            <h1 className="aigenerator-title">Huzzler AI Generator</h1>
            <div className="aigenerator-subtitle">
              <span className="online-dot"></span> Online - Powered by Huzzler AI
            </div>
          </div>
        </div>
      </div>

      <div className="aigenerator-content">
        <div className="aigenerator-left">
          <div className="generate-card">
            <h2 className="card-title">Generate Your Service</h2>
            <p className="card-label">What service do you offer?</p>
            <textarea
              className="generate-textarea"
              placeholder="Generate a premium UI/UX design service for fintech startups"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <div className="suggestions-container">
              <span className="suggestions-label">Suggested:</span>
              <div className="suggestions-list">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="suggestion-btn"
                    onClick={() => setPrompt(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <button className="generate-btn">
              <Sparkles size={18} /> Generate with AI
            </button>
          </div>
        </div>

        <div className="aigenerator-right">
          <div className="insights-card">
            <p className="insights-label">AI MARKET INSIGHTS</p>
            <h2 className="insights-title">
              High demand for<br />UI/UX Designers 🔥
            </h2>
            
            <div className="insights-stats">
              <div className="stat-row">
                <span className="stat-name">Avg. market rate</span>
                <span className="stat-value">₹2,200/day</span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Active job listings</span>
                <span className="stat-value">1,247</span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Demand growth</span>
                <span className="stat-value">+34% MoM</span>
              </div>
            </div>
          </div>

          <div className="categories-card">
            <h3 className="categories-title">Top Performing Categories</h3>
            <div className="category-item">
              <div className="category-info">
                <span className="category-name">Fintech UI Design</span>
                <span className="category-percent">92%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "92%" }}></div>
              </div>
            </div>
            <div className="category-item">
              <div className="category-info">
                <span className="category-name">SaaS Dashboards</span>
                <span className="category-percent">78%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div className="category-item">
              <div className="category-info">
                <span className="category-name">Mobile Apps</span>
                <span className="category-percent">65%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
