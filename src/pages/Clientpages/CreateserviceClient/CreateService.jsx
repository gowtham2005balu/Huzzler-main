// ServiceListPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, ChevronRight, Plus } from "lucide-react";
import ServiceDetailsModal from "../../ServiceDetailsModal.jsx";
import { useNavigate } from "react-router-dom";

const ServiceListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Work");
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/ClientWork/Clientworkget"
        );
        setServices(res.data.work || []);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading services...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  // Filter services based on tab
  const filteredServices = services.filter((service) =>
    activeTab === "24 Hours"
      ? service.specificDelivery === "24 hours"
      : service.specificDelivery !== "24 hours"
  );

  return (
    <>
      <div className="service-page">
        <div className="service-container">
          <div className="service-header">
            <button onClick={() => window.history.back()} className="back-btn">
              <ArrowLeft size={30} />
            </button>
            <h1 className="page-title">Your Service</h1>
          </div>

          <p className="page-subtitle">List Your Service, Reach More People</p>

          {/* Tabs */}
          <div className="tab-container">
            {["Work", "24 Hours"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Service Cards */}
          <div className="service-grid">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="service-card"
                onClick={() => setSelectedService(service)}
              >
                <div className="service-info">
                  <div className="service-avatar">
                    {service.ServiceTitle?.slice(0, 2).toUpperCase() || "NA"}
                  </div>

                  <div className="service-content">
                    <div className="service-top">
                      <h2 className="service-title">
                        {service.ServiceTitle || "Untitled"}
                      </h2>
                      <ChevronRight className="icon" />
                    </div>

                    <div className="tags">
                      {(service.Skills || []).slice(0, 4).map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                      ))}
                    </div>

                    <div className="service-meta">
                      <div>
                        <p className="meta-label">Budget</p>
                        <p className="meta-value purple">
                          ₹{service.minprice || 0} - ₹{service.maxprice || 0}
                        </p>
                      </div>
                      <div>
                        <p className="meta-label">Delivery</p>
                        <p className="meta-value">
                          {service.DeliveryDay || 1} Days
                        </p>
                      </div>
                      <div>
                        <p className="meta-label">Category</p>
                        <p className="meta-value">{service.Category || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Button */}
          <button
            className="add-btn"
            onClick={() =>
              navigate(activeTab === "24 Hours" ? "/create-service24" : "/createservice")
            }
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Modal */}
        {selectedService && (
          <ServiceDetailsModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </div>

      {/* ======================== CSS ======================== */}
      <style>{`
        .service-page { min-height: 100vh; padding: 2rem; background: #f9fafb; position: relative; }
        .service-container { max-width: 1100px; margin: 0 auto; }
        .service-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem; }
        .back-btn { background: #fff; padding: 0.5rem; border: none; border-radius: 0.75rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1); cursor: pointer; }
        .page-title { font-size: 1.5rem; font-weight: 600; }
        .page-subtitle { color: #6b7280; margin-bottom: 1.5rem; }
        .tab-container { display: flex; background: #fff; padding: 4px; border-radius: 9999px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 2rem; }
        .tab-btn { flex: 1; background: none; border: none; padding: 10px 20px; border-radius: 9999px; cursor: pointer; color: #6b7280; font-weight: 500; transition: 0.3s; }
        .tab-btn.active { background: #fff; color: #111827; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .service-card { background: #fff; padding: 1.25rem; border-radius: 1rem; cursor: pointer; border: 1px solid #eee; transition: 0.3s ease; }
        .service-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.1); transform: translateY(-3px); }
        .service-info { display: flex; gap: 1rem; }
        .service-avatar { width: 3rem; height: 3rem; background: linear-gradient(to bottom right, #8b5cf6, #6d28d9); color: white; border-radius: 0.75rem; display: flex; justify-content: center; align-items: center; font-weight: 600; }
        .service-title { font-size: 1.1rem; font-weight: 600; color: #111827; }
        .tags { display: flex; gap: 0.4rem; margin-top: 0.5rem; }
        .tag { background: #fef08a; padding: 3px 8px; border-radius: 6px; font-size: 12px; }
        .service-meta { margin-top: 1rem; display: grid; grid-template-columns: repeat(3, 1fr); }
        .meta-label { font-size: 13px; color: #555; }
        .meta-value { font-weight: 600; }
        .purple { color: #7c3aed; }
        .add-btn { position: fixed; bottom: 2.5rem; right: 2.5rem; background: #7c3aed; border: none; border-radius: 9999px; padding: 1rem; color: white; box-shadow: 0 6px 15px rgba(124,58,237,0.4); cursor: pointer; }
      `}</style>
    </>
  );
};

export default ServiceListPage;
