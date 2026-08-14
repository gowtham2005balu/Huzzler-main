
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import editicon from "../../assets/editicon.png";
import { db } from "../../firbase/Firebase";
import { color } from "framer-motion";

/* ======================================================
   COMPANY PROFILE SUMMARY
====================================================== */

export default function ProfileSummary() {
  const navigate = useNavigate();


  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    title: "",
    businessInfo: "",
    skills: [],
    tools: [],
    profileImage: "",
    location: "",

  });

  console.log(profileData)
  /* ---------------- SIDEBAR ---------------- */
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    const handleToggle = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  /* ---------------- MOBILE ---------------- */
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------------- PROFILE DATA ---------------- */
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setData(snap.data());
      setLoading(false);
    };
    fetchProfile();
  }, []);

  /* ---------------- JOBS DATA ---------------- */
  const auth = getAuth();
  const user = auth.currentUser;

  const [tab, setTab] = useState("Works");
  const [worksJobs, setWorksJobs] = useState([]);
  const [jobs24, setJobs24] = useState([]);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    // fetch user profile once
    getDoc(userRef).then((snap) => {
      if (snap.exists()) {
        setProfileData((prev) => ({ ...prev, ...snap.data() }));
      }
    });

    // portfolio realtime
    const q = query(
      collection(db, "users", user.uid, "portfolio"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user, db]);


  useEffect(() => {
    if (!user) return;

    const q1 = query(
      collection(db, "jobs"),
      where("userId", "==", user.uid)
    );
    const q2 = query(
      collection(db, "jobs_24h"),
      where("userId", "==", user.uid)
    );

    const unsub1 = onSnapshot(q1, (snap) =>
      setWorksJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const unsub2 = onSnapshot(q2, (snap) =>
      setJobs24(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, [user]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 20 }}>No profile found.</div>;

  const jobsList = tab === "Works" ? worksJobs : jobs24;


  const handleOpenJobDetail = (job) => {
    navigate(`/client-dashbroad2/job-full/${job.id}`, {
      state: { jobData: job }, // optional, still can pass data via state
    });
  };

  const handleOpenJobDetail24 = (job) => {
    navigate(`/client-dashbroad2/job-full24/${job.id}`, {
      state: { jobData: job },
    });
  };

  return (
    <div
      style={{
        marginLeft: isMobile ? 0 : collapsed ? "-110px" : "-1px",
        transition: "margin-left 0.25s ease",
        marginTop: collapsed ? "10px" : "10px",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "Rubik",
          // background: "#fafafa",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "70%", marginTop: "20px" }}>
          {/* ================= HEADER ================= */}
          <div
            style={{
              // background:
              //   "linear-gradient(180deg, #FFFECB 0%, #FFFDE4 40%, #FFFFFF 100%)",
              padding: isMobile ? "30px 20px 60px" : "40px 30px 80px",
              // borderBottomLeftRadius: 30,
              // borderBottomRightRadius: 30,
              // borderBottom:"2px solid  #00000040",
              position: "relative",
              border: "1px solid #ddd",
              marginLeft: isMobile ? "20px" : "25px",
              width: isMobile ? "91%" : "95%",
              borderRadius: 10,
            }}
          >

            <button
              onClick={() => navigate("/client-dashbroad2/companyprofileedit")}
              style={{
                position: "absolute",
                right: 10,

                marginTop: "180px",
                border: "none",
                background: "#9810FACC",
                color: "#fff",
                padding: "10px",
                borderRadius: 8,
                cursor: "pointer",
                marginTop: isMobile ? "0px" : "10px",
              }}
            >Edit Profile
            </button>



            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 18,
                alignItems: isMobile ? "flex-start" : "center",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#D8D8D8",
                  overflow: "hidden",
                }}
              >
                <img
                  src={data?.profileImage || ""}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", }}
                />

              </div>
              {/* <img
                src={editicon}
                alt="edit"
                style={{
                  width: isMobile ? 40 : 40,
                  marginTop: isMobile ? "-40px" : "70px",
                  marginLeft: isMobile ? "35px" : "-40px",

                }}
              /> */}
              <div>
                <div style={{ fontSize: isMobile ? 22 : 30 }}>
                  {data?.Company_name}
                </div>
                <div style={{ color: "#707070", fontSize: 14 }}>
                  {data?.email}
                </div>
                <div style={{ marginTop: 10 }}>
                  {data?.industry} • {data?.location}
                </div>
              </div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div style={{ padding: isMobile ? 16 : 24, }}>
            <Card >
              <span style={{ fontSize: 20, fontWeight: 400, }}>About</span>
              <div style={{ marginTop: "10px" }}>{data?.businessInfo}</div>
            </Card>

            <Card>
              <div style={{ marginBottom: 28, }}>
                <span style={{ fontSize: 20, fontWeight: 400, }}>
                  Industry
                </span>
                <div style={{ marginBottom: "25px", fontWeight: 400 }}> {data?.Company_name} </div>


                <span style={{ fontSize: 20, fontWeight: 400, }}>
                  Company Size <div></div>
                  <div style={{ fontSize: 17, color: "#000000d3" }} >{profileData.team_size} members </div>

                </span>
                <div style={{ marginBottom: "25px", fontWeight: 400 }}>{data?.team_size}</div>


                <div>
                  <span style={{ fontSize: 20, fontWeight: 400 }}>Email Address</span>
                  <div style={{ marginBottom: 18, fontWeight: 400 }}>{data?.email}</div>
                </div>
              </div>
            </Card>

            {/* ================= JOBS ================= */}
            <div style={{ marginTop: 40 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 6px",
                }}
              >
                <h2
                  style={{
                    color: "#000",
                    fontSize: "20px",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Posted Jobs
                </h2>

                <span
                  style={{
                    fontSize: "14px",
                    color: "#7E7E7E",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onClick={() => navigate("/client-dashbroad2/AddJobScreen")}
                >
                  View All
                </span>
              </div>


              <div style={styles.toggleGroup}>
                <div
                  style={{
                    ...styles.toggleButton,
                    background: tab === "Works" ? "#9050FF" : "transparent",
                    color: tab === "24" ? "#000  " : "#fff",
                  }}
                  onClick={() => setTab("Works")}
                >
                  Works
                </div>
                <div
                  style={{
                    ...styles.toggleButton,
                    background: tab === "24" ? "#9050FF  " : "transparent",
                    color: tab === "24" ? "#fff  " : "#000",
                  }}
                  onClick={() => setTab("24")}
                >
                  24 Hours
                </div>
              </div>

              <div style={styles.cardsWrap}>
                {jobsList.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    type={tab}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */

function Card({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 22,
        borderRadius: 20,
        border: "1px solid #ddd",
        marginBottom: 20,
        fontWeight: 500,

      }}
    >
      <h3 style={{ marginBottom: 10 }}>{title}</h3>
      <div style={{ color: "#555" }}>{children}</div>
    </div>
  );
}

function JobCard({ job, type }) {
  const navigate = useNavigate();

  /* ---------- PAUSE / RESUME ---------- */
  const handlePause = async (e) => {
    e.stopPropagation();

    const collectionName = type === "Works" ? "jobs" : "jobs_24h";
    const ref = doc(db, collectionName, job.id);

    await updateDoc(ref, {
      status: job.status === "paused" ? "active" : "paused",
    });
  };

  /* ---------- EDIT ---------- */
  const handleEdit = (e) => {
    e.stopPropagation();

    navigate("/client-dashbroad2/clientedit24jobs", {
      state: { jobId: job.id, jobData: job },
    });
  };






  return (
    <div
      onClick={() =>
        navigate(
          type === "Works"
            ? `/client-dashbroad2/job-full/${job.id}`
            : `/client-dashbroad2/job-full24/${job.id}`
        )
      }
      style={{
        border: "1px solid #ddd",
        borderRadius: 24,
        padding: 22,
        cursor: "pointer",

      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <div style={styles.avatarBox}>
          {(job?.title || "J").substring(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={styles.jobTitle}>{job?.title}</div>
          <div style={{ display: "flex", marginTop: 6 }}>
            {job?.skills?.slice(0, 2).map((s, i) => (
              <div key={i} style={styles.skillChip}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", marginTop: 20, justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ color: "#7C3CFF", }}>
          <span style={{ color: "#000", fontWeight: 400, }}>Budget</span><br />
          ₹{job?.budget_from || job?.budget}
        </div>

        <div>
          <span style={{ color: "#000", fontWeight: 400, fontSize: 16 }}>Timeline</span><br />
          {job?.timeline || "24 hours"}
        </div>
        <div >
          <span style={{ color: "#000", fontWeight: 400 }}>Location</span><br />
          Remote
        </div>
      </div>
      <div style={styles.buttonRow}>
        <button style={styles.secondaryBtn} onClick={handlePause}>
          {job.status === "paused" ? "Resume Service" : "Pause Service"}
        </button>

        <button style={styles.primaryBtn} onClick={handleEdit}>
          Edit Service
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  avatarBox: {
    width: 42,
    height: 42,
    borderRadius: "20%",
    background:
      "linear-gradient(130deg, #51A2FF, #9B42FF 60%, #AD46FF)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#fff",
  },
  jobTitle: { fontWeight: 500, fontSize: 18 },
  skillChip: {
    background: "#FFFFBE",
    color: "#000",
    padding: "4px 8px",
    borderRadius: 8,
    fontSize: 12,
    marginRight: 6,
  },
  toggleGroup: {
    display: "flex",
    gap: 10,
    background: "#fff",
    padding: 6,
    borderRadius: 14,
    width: "100%",
    margin: "20px 0",
    // boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    border: "1px solid #25202034"
  },
  toggleButton: {
    padding: "8px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
  cardsWrap: {

    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(280px, 1fr))",
    gap: 16,

  },
  buttonRow: {
    display: "flex",
    gap: 12,
    marginTop: 14,
  },
  secondaryBtn: {
    flex: 1,
    height: 38,
    borderRadius: 30,
    border: "1px solid #BDBDBD",
    background: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  primaryBtn: {
    flex: 1,
    height: 38,
    borderRadius: 30,
    background: "rgba(253,253,150,1)",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  },
};