import React, { useEffect, useState } from "react";
import axios from "axios";

const FreelancerProfile = () => {
  const userId = localStorage.getItem("userId"); // ✅ Correct ID

  const [formData, setFormData] = useState({
    ProfileName: "",
    About: "",
    Skill: "",
    Tools: "",
    AddLinks: "",
  });

  const [currentProfileId, setCurrentProfileId] = useState(null);
  const [portfolioList, setPortfolioList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState(null);

  const [modalData, setModalData] = useState({
    portfolio_ProjectTitle: "",
    ProjectDescription: "",
    Upload_ProjectURL: "",
  });

  // =========================
  // LOAD PROFILE ON REFRESH
  // =========================
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/freelanceprofile/user/${userId}`)
      .then((res) => {
        if (res.data.data) {
          const p = res.data.data;

          setCurrentProfileId(p._id);

          setFormData({
            ProfileName: p.ProfileName,
            About: p.About,
            Skill: p.Skill.join(", "),
            Tools: p.Tools.join(", "),
            AddLinks: p.AddLinks.join(", "),
          });

          setPortfolioList(p.Portfolio);
        }
      })
      .catch(() => {});
  }, [userId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // =========================
  // CREATE PROFILE
  // =========================
  const createProfile = async () => {
    try {
      const payload = {
        UserId: userId,
        ProfileName: formData.ProfileName,
        About: formData.About,
        Skill: formData.Skill.split(","),
        Tools: formData.Tools.split(","),
        AddLinks: formData.AddLinks.split(","),
      };

      const res = await axios.post(
        "http://localhost:5000/api/freelanceprofile/create",
        payload
      );

      setCurrentProfileId(res.data.data._id);

      alert("Profile Created!");
    } catch (err) {
      alert("Profile already exists!");
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const updateProfile = async () => {
    const payload = {
      ProfileName: formData.ProfileName,
      About: formData.About,
      Skill: formData.Skill.split(","),
      Tools: formData.Tools.split(","),
      AddLinks: formData.AddLinks.split(","),
    };

    await axios.put(
      `http://localhost:5000/api/freelanceprofile/update/${currentProfileId}`,
      payload
    );

    alert("Profile Updated!");
  };

  // =========================
  // PORTFOLIO OPERATIONS
  // =========================

  const addPortfolio = async () => {
    const payload = {
      portfolio_ProjectTitle: modalData.portfolio_ProjectTitle,
      ProjectDescription: modalData.ProjectDescription,
      Upload_ProjectURL: modalData.Upload_ProjectURL.split(","),
    };

    const res = await axios.post(
      `http://localhost:5000/api/freelanceprofile/portfolio/add/${currentProfileId}`,
      payload
    );

    setPortfolioList(res.data.data.Portfolio);
    setShowModal(false);
  };

  const updatePortfolio = async () => {
    const payload = {
      portfolio_ProjectTitle: modalData.portfolio_ProjectTitle,
      ProjectDescription: modalData.ProjectDescription,
      Upload_ProjectURL: modalData.Upload_ProjectURL.split(","),
    };

    const res = await axios.put(
      `http://localhost:5000/api/freelanceprofile/portfolio/update/${currentProfileId}/${editingPortfolioId}`,
      payload
    );

    setPortfolioList(res.data.data.Portfolio);
    setShowModal(false);
  };

  const deletePortfolio = async (id) => {
    const res = await axios.delete(
      `http://localhost:5000/api/freelanceprofile/portfolio/delete/${currentProfileId}/${id}`
    );

    setPortfolioList(res.data.data.Portfolio);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Freelancer Profile</h2>

      <input
        name="ProfileName"
        placeholder="Profile Name"
        value={formData.ProfileName}
        onChange={handleChange}
      />

      <textarea
        name="About"
        placeholder="About"
        value={formData.About}
        onChange={handleChange}
      />

      <input
        name="Skill"
        placeholder="Skills, comma separated"
        value={formData.Skill}
        onChange={handleChange}
      />

      <input
        name="Tools"
        placeholder="Tools"
        value={formData.Tools}
        onChange={handleChange}
      />

      <input
        name="AddLinks"
        placeholder="Links"
        value={formData.AddLinks}
        onChange={handleChange}
      />

      {!currentProfileId ? (
        <button onClick={createProfile}>Create</button>
      ) : (
        <button onClick={updateProfile}>Update</button>
      )}

      {currentProfileId && (
        <>
          <h3>Portfolio</h3>

          <button
            onClick={() => {
              setModalData({
                portfolio_ProjectTitle: "",
                ProjectDescription: "",
                Upload_ProjectURL: "",
              });
              setEditingPortfolioId(null);
              setShowModal(true);
            }}
          >
            + Add Portfolio
          </button>

          {portfolioList.map((p) => (
            <div key={p._id}>
              <h4>{p.portfolio_ProjectTitle}</h4>
              <p>{p.ProjectDescription}</p>

              <button onClick={() => deletePortfolio(p._id)}>Delete</button>
              <button
                onClick={() => {
                  setEditingPortfolioId(p._id);
                  setModalData({
                    portfolio_ProjectTitle: p.portfolio_ProjectTitle,
                    ProjectDescription: p.ProjectDescription,
                    Upload_ProjectURL: p.Upload_ProjectURL.join(","),
                  });
                  setShowModal(true);
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </>
      )}

      {showModal && (
        <div className="modal">
          <h3>{editingPortfolioId ? "Edit Portfolio" : "Add Portfolio"}</h3>

          <input
            value={modalData.portfolio_ProjectTitle}
            onChange={(e) =>
              setModalData({ ...modalData, portfolio_ProjectTitle: e.target.value })
            }
            placeholder="Project Title"
          />

          <textarea
            value={modalData.ProjectDescription}
            onChange={(e) =>
              setModalData({ ...modalData, ProjectDescription: e.target.value })
            }
            placeholder="Description"
          />

          <textarea
            value={modalData.Upload_ProjectURL}
            onChange={(e) =>
              setModalData({ ...modalData, Upload_ProjectURL: e.target.value })
            }
            placeholder="URLs (comma separated)"
          />

          <button onClick={editingPortfolioId ? updatePortfolio : addPortfolio}>
            {editingPortfolioId ? "Update" : "Add"}
          </button>

          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default FreelancerProfile;
