
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import ClientSlidebar from "../pages/Clientpages/slidebar/ClientSidebar"
const ClientDashBoard = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  return (
   <>
  <h1>hetk</h1>
   <ClientSlidebar/>
   </>
  );
};

export default ClientDashBoard;

/* ================== Styles ================== */
const Wrapper = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;

  .container {
    max-width: 800px;
    background: white;
    padding: 50px;
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-align: center;
  }

  .title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .card {
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 30px;
  }

  .email {
    font-size: 16px;
    color: #333;
    margin-top: 10px;
  }

  .desc {
    margin-top: 10px;
    color: #555;
  }
`;


