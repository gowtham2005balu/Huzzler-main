// import { useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import API from '../api/client';

// export default function OTPVerify(){
//   const [code,setCode] = useState('');
//   const [loading,setLoading] = useState(false);
//   const [searchParams] = useSearchParams();
//   const email = searchParams.get('email');
//   const nav = useNavigate();

//   const verify = async ()=>{ setLoading(true);
//     try{ await API.post('/auth/verify-otp', { email, code }); nav(`/details1?email=${encodeURIComponent(email)}`); }
//     catch(err){ alert(err?.response?.data?.message || 'OTP error'); }finally{setLoading(false)}
//   }

//   const resend = async ()=>{ try{ await API.post('/auth/resend-otp', { email }); alert('OTP resent'); }catch(e){ alert('Error resending'); } }

//   return (
//     <div className="max-w-md mx-auto py-10">
//       <h3 className="text-lg">Enter OTP sent to {email}</h3>
//       <input className="p-2 border my-2" value={code} onChange={e=>setCode(e.target.value)} />
//       <div className="flex gap-2">
//         <button className="p-2 bg-green-600 text-white" onClick={verify} disabled={loading}>Verify</button>
//         <button className="p-2 border" onClick={resend}>Resend</button>
//       </div>
//     </div>
//   )
// }



import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/client";
import styled from "styled-components";

export default function OTPVerify() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const nav = useNavigate();

  const verify = async () => {
    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email, code });
      // ✅ Redirect to client details form after OTP verified
      nav(`/client-details1?email=${encodeURIComponent(email)}`);
    } catch (err) {
      alert(err?.response?.data?.message || "OTP verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      await API.post("/auth/resend-otp", { email });
      alert("✅ OTP resent successfully!");
    } catch (e) {
      alert("Error resending OTP");
    }
  };

  return (
    <Wrapper>
      <div className="container">
        <div className="logo">LOGO</div>

        <div className="card">
          <h2 className="heading">Please Verify Your Email</h2>
          <p className="subtext">
            Enter the OTP sent to <strong>{email}</strong>
          </p>

          <div className="otp-box">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter OTP"
              maxLength="6"
              className="otp-input"
            />
          </div>

          <div className="button-group">
            <button className="verify-btn" onClick={verify} disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
            <button className="resend-btn" onClick={resend}>
              Resend
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

/* ✅ Styled Components */
const Wrapper = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;

  .container {
    width: 100%;
    max-width: 450px;
    background: #fff;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    text-align: center;
  }

  .logo {
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 20px;
  }

  .heading {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .subtext {
    font-size: 14px;
    color: #555;
    margin-bottom: 25px;
  }

  .otp-box {
    display: flex;
    justify-content: center;
    margin-bottom: 25px;
  }

  .otp-input {
    width: 200px;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    text-align: center;
    outline: none;
    transition: 0.2s ease;
    &:focus {
      border-color: #000;
    }
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .verify-btn {
    background-color: #0a0f29;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s ease;

    &:hover {
      background-color: #111a3b;
    }
  }

  .resend-btn {
    background: none;
    border: 1px solid #000;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 15px;
    cursor: pointer;
    transition: 0.2s ease;

    &:hover {
      background-color: #000;
      color: #fff;
    }
  }
`;
