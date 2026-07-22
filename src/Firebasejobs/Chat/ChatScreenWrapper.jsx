// // ChatScreenWrapper.jsx
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import ChatScreen from "./ChatPage";

// export default function ChatScreenWrapper() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [loadedState, setLoadedState] = useState(null);

//   // Wait 1 render cycle → then load state safely
//   useEffect(() => {
//     if (location.state) {
//       setLoadedState(location.state);
//     }
//   }, [location.state]);

//   // Show loading until state is ready
//   if (!loadedState) {
//     return (
//       <div style={{ padding: 40, textAlign: "center" }}>
//         Loading chat…
//       </div>
//     );
//   }

//   const {
//     currentUid,
//     otherUid,
//     otherName,
//     otherImage,
//     initialMessage,
//   } = loadedState;

//   // Final safety
//   if (!currentUid || !otherUid) {
//     return (
//       <div
//         style={{
//           padding: 40,
//           textAlign: "center",
//           fontSize: 18,
//           fontWeight: 500,
//         }}
//       >
//         ⚠ Chat cannot open<br />
//         Missing UIDs<br /><br />
//         <button
//           onClick={() => navigate(-1)}
//           style={{
//             marginTop: 16,
//             background: "#000",
//             color: "#fff",
//             padding: "10px 20px",
//             borderRadius: 8,
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <ChatScreen
//       currentUid={currentUid}
//       otherUid={otherUid}
//       otherName={otherName}
//       otherImage={otherImage}
//       initialMessage={initialMessage}
//     />
//   );
// }



// ChatScreenWrapper.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatScreen from "./ChatPage";

export default function ChatScreenWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loadedState, setLoadedState] = useState(null);

  // Wait 1 render cycle → then load state safely
  useEffect(() => {
    if (location.state) {
      setLoadedState(location.state);
    }
  }, [location.state]);

  // Show loading until state is ready
  if (!loadedState) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Loading chat…
      </div>
    );
  }

  const {
    currentUid,
    otherUid,
    otherName,
    otherImage,
    initialMessage,
  } = loadedState;

  // Final safety
  if (!currentUid || !otherUid) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          fontSize: 18,
          fontWeight: 500,
        }}
      >
        ⚠ Chat cannot open<br />
        Missing UIDs<br /><br />
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: 16,
            background: "#000",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <ChatScreen
      currentUid={currentUid}
      otherUid={otherUid}
      otherName={otherName}
      otherImage={otherImage}
      initialMessage={initialMessage}
    />
  );
}