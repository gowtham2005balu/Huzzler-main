import { useNavigate } from "react-router-dom";

export default function ClientProjectCard({ project }) {
  const navigate = useNavigate();

  const openChat = () => {
    navigate("/chat", {
      state: {
        currentUid: project.clientId,
        otherUid: project.freelancerId,
        otherName: project.freelancerName,
        otherImage: project.freelancerImage
      }
    });
  };

  return (
    <button onClick={openChat} className="btn">
      Message Freelancer
    </button>
  );
}
