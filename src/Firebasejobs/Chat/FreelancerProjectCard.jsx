import { useNavigate } from "react-router-dom";

export default function FreelancerProjectCard({ project }) {
  const navigate = useNavigate();

  const openChat = () => {
    navigate("/chat", {
      state: {
        currentUid: project.freelancerId,
        otherUid: project.clientId,
        otherName: project.clientName,
        otherImage: project.clientImage
      }
    });
  };

  return (
    <button onClick={openChat} className="btn">
      Message Client
    </button>
  );
}