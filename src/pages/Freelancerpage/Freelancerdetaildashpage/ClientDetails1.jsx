import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const ClientDetails1 = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [form, setForm] = useState({
    Company_name: "",
    aboutBusiness: "",
    employees: "",
    individual: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

   const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Client Details Step 2:", form);
  navigate(`/client-details1?email=${encodeURIComponent(email)}`);
};


  return (
    <Wrapper>
      <div className="container">
        <div className="logo">LOGO</div>

        <div className="form-card">
          <button className="back-btn" onClick={() => navigate(-1)}>
            &lt; <span>Sign up as a client</span>
          </button>

          <h2 className="heading">
            Let’s Get To Know You. We Promise It’s Quick And Painless!
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="image-section">
              <div className="image-placeholder">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 6.75v10.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V6.75m-15 0A2.25 2.25 0 016.75 4.5h10.5a2.25 2.25 0 012.25 2.25m-15 0h15M8.25 10.5h7.5m-7.5 3h4.5"
                  />
                </svg>
              </div>
            </div>

            <div className="form-fields">
              <label>What is your name of your company?</label>
              <input
                type="text"
                name="Company_name"
                value={form.Company_name}
                onChange={handleChange}
                placeholder="Company name"
                required
              />

              <label>Tell about your business?</label>
              <input
                type="text"
                name="aboutBusiness"
                value={form.aboutBusiness}
                onChange={handleChange}
                placeholder="e.g., I'm the owner of Soft Soln, that is in ECR..."
                required
              />

              <label>How many people working in your company</label>
              <input
                type="text"
                name="employees"
                value={form.employees}
                onChange={handleChange}
                placeholder="10-25, 25-50"
              />

              <div className="checkbox">
                <input
                  type="checkbox"
                  id="individual"
                  name="individual"
                  checked={form.individual}
                  onChange={handleChange}
                />
                <label htmlFor="individual">Individual</label>
              </div>

              <button type="submit" className="continue-btn">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default ClientDetails1;

/* ===================== STYLES ===================== */
const Wrapper = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;

  .container {
    width: 100%;
    max-width: 900px;
    background: #fff;
    padding: 40px 60px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }

  .logo {
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 30px;
  }

  .back-btn {
    background: none;
    border: none;
    color: #000;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    margin-bottom: 10px;

    span {
      font-weight: 500;
    }
  }

  .heading {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 30px;
  }

  .image-section {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }

  .image-placeholder {
    background-color: #fafafa;
    width: 120px;
    height: 120px;
    border-radius: 12px;
    border: 2px dashed #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-placeholder .icon {
    width: 50px;
    height: 50px;
    color: #999;
  }

  .form-fields {
    display: flex;
    flex-direction: column;
    gap: 15px;

    label {
      font-size: 14px;
      font-weight: 500;
    }

    input[type="text"] {
      padding: 10px 14px;
      border: 1px solid #ccc;
      border-radius: 8px;
      outline: none;
      font-size: 14px;

      &:focus {
        border-color: #000;
      }
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;

      label {
        font-size: 14px;
      }
    }

    .continue-btn {
      background-color: #0a0f29;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 500;
      margin-top: 20px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #111a3b;
      }
    }
  }
`;
