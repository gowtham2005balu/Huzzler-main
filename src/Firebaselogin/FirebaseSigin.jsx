import React from "react";
import { useNavigate } from "react-router-dom";
import "./signin.css";

export default function Signin() {
  const navigate = useNavigate();

  return (
    <div className="signin-container">

      <h1 className="title">Huzzler</h1>

      <p className="subtitle">
        Your journey to new opportunities starts here
      </p>

      <h3 className="get-started-text">Get started as</h3>

      <div className="button-row">
        <button
          className="big-btn"
          onClick={() => navigate("/freelancer-signup")}
        >
          FREELANCER
        </button>

        <button
          className="big-btn"
          onClick={() => navigate("/client-signup")}
        >
          CLIENT
        </button>
      </div>

      <div className="login-row">
        <span>Already here? </span>
        <span className="login-link" onClick={() => navigate("/firelogin")}>
          log in
        </span>
        <span> jump back to action</span>
      </div>

      <div className="logo-box">
        <img src="/assets/huzzler.png" alt="logo" className="logo-img" />
      </div>
    </div>
  );
}
