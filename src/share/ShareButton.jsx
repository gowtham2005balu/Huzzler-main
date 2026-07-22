import { FiShare } from "react-icons/fi";

function ShareButton({ job }) {
  const handleShare = async () => {
    const shareData = {
      title: job.title,
      text: job.description,
      url: window.location.href, // or your job details page
    };

    // 👉 Mobile browser native share
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Share cancelled", error);
      }
      return;
    }

    // 👉 Fallback for browsers without navigator.share
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
    >
      <FiShare size={20} />
    </button>
  );
}

export default ShareButton;
