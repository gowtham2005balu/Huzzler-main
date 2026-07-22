// src/pages/RedirectHandler.jsx
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firbase/Firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function RedirectHandler() {
  const { uid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      if (!snap.exists()) {
        navigate("/error");
        return;
      }

      const role = snap.data().role?.toLowerCase();
      console.log("role:", role);

      if (role === "freelancer") {
        navigate("/freelance-dashboard/freelanceHome", { replace: true });
      } else if (role === "client") {
        navigate("/client-dashbroad2/clienthome", { replace: true });
      } else {
        navigate("/error", { replace: true });
      }
    });

    return () => unsub();
  }, [uid, navigate]);

  return <div>Redirecting...</div>;
}
