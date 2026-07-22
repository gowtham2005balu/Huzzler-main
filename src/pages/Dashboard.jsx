import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";

const BASE_URL = "http://localhost:5000";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${BASE_URL}/api/Work/getWork`);
        const sorted = res.data.work.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProjects(sorted);
      } catch (err) {
        setError("Failed to load services. Check internet.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <main className="dashboard">
        <div className="page-wrapper">
          <h2 className="title">Available Services freelance</h2>

          <div className="work-grid">
            {projects.map((work) => (
              <div className="work-card" key={work._id}>
                <div className="work-header">
                  <h3>{work.ServiceTitle}</h3>
                  <p className="category">{work.Category}</p>
                </div>

                <p className="description">{work.Des}</p>

                <div className="skills">
                  {work.Skills?.map((s, i) => (
                    <span key={i} className="skill-tag">
                      {s}
                    </span>
                  ))}
                </div>

                <p className="meta">
                  Delivery: <strong>{work.Deliverydays}</strong> days
                </p>

                <p className="price">
                  ₹{work.minprice} – ₹{work.maxprice}
                </p>

                <p className="tools">
                  Tools: {work.tools?.join(", ") || "None"}
                </p>

                {work.sample_projects?.length > 0 && (
                  <a
                    href={work.sample_projects[0]}
                    className="sample-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Samples
                  </a>
                )}

                {work.client_des && (
                  <p className="client">
                    <em>Client:</em> {work.client_des}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Add Button */}
        <button className="add-btn">
          <PlusCircle size={24} />
        </button>
      </main>

      {/* ------------ CSS START ------------ */}
      <style>{`
        
        /* 🌈 Dashboard Base */
        .dashboard {
          width: 100%;
          min-height: 100vh;
          padding: 3rem 0;
          padding-left: 18rem; /* sidebar space */
          display: flex;
          justify-content: center;
          background: #f5f5f5;
        }

        /* 🌟 Page Wrapper (Figma Layout Exact) */
        .page-wrapper {
          width: 100%;
          max-width: 1200px;
          background: linear-gradient(180deg, #fef08a 0%, #fefce8 60%, #ffffff 100%);
          padding: 3rem;
          border-radius: 1rem;
          box-shadow: 0px 4px 20px rgba(0,0,0,0.08);
        }

        .title {
          font-size: 1.7rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2rem;
        }

        /* Work Grid Centered */
        .work-grid {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          align-items: center;
        }

        /* 🟣 Work Card */
        .work-card {
          width: 100%;
          max-width: 900px;
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid #ececec;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.2s ease;
        }

        .work-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.10);
        }

        .work-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .category {
          background: #ede9fe;
          color: #6d28d9;
          font-size: .75rem;
          padding: .3rem .8rem;
          border-radius: 1rem;
        }

        .description {
          color: #4b5563;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: .5rem;
          margin-bottom: 1rem;
        }

        .skill-tag {
          background: #f3e8ff;
          color: #7c3aed;
          font-size: .75rem;
          padding: .35rem .9rem;
          border-radius: 1rem;
        }

        .meta {
          font-size: .9rem;
          color: #6b7280;
        }

        .price {
          font-size: 1.1rem;
          font-weight: bold;
          margin: .3rem 0;
        }

        .tools {
          font-size: .9rem;
          color: #6b7280;
          margin-bottom: .5rem;
        }

        .sample-link {
          color: #7c3aed;
          text-decoration: none;
          font-weight: 500;
        }

        .client {
          font-size: .8rem;
          color: #4b5563;
          margin-top: .4rem;
        }

        /* Floating Button */
        .add-btn {
          position: fixed;
          bottom: 2.5rem;
          right: 2.5rem;
          background: #7c3aed;
          color: white;
          border-radius: 50%;
          padding: 1rem;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          cursor: pointer;
        }

        .add-btn:hover {
          background: #6d28d9;
        }

        .loading, .error {
          text-align: center;
          font-size: 1.2rem;
          padding-top: 4rem;
        }
        
      `}</style>
      {/* ------------ CSS END ------------ */}
    </>
  );
};

export default Dashboard;
