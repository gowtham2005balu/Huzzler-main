import React from "react";

const FhJobDetailScreen = ({ job }) => {
  if (!job) return null;

  const openUrl = (url) => {
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-yellow-300 rounded-b-3xl p-6 flex justify-center items-center">
        <h2 className="text-2xl font-medium">Job Section</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Job Title */}
        <h1 className="text-xl font-bold">{job.title}</h1>

        {/* Default Image */}
        <img
          src={job.imageUrl || "/assets/full-photo.png"}
          alt="Job"
          className="w-full h-44 object-cover rounded-lg"
        />

        {/* Description */}
        <div>
          <h3 className="text-lg font-medium mb-1">Description</h3>
          <p>{job.description}</p>
        </div>

        {/* Service Details */}
        <div className="p-4 border rounded-3xl border-gray-300 space-y-4">
          <h3 className="text-lg font-bold">Service Details</h3>
          <hr className="border-gray-300" />

          {/* Price */}
          <div className="flex justify-between">
            <span className="font-medium">Price</span>
            <span className="font-semibold">₹{job.budget || 0}</span>
          </div>

          {/* Delivery Days */}
          <div className="flex justify-between">
            <span className="font-medium">Delivery Days</span>
            <span className="font-semibold">
              {job.deliveryDuration || "24 Hours"}
            </span>
          </div>

          {/* Category */}
          <div>
            <span className="font-medium">Category</span>
            <div className="mt-1">
              <span className="inline-block px-3 py-1 border border-gray-300 rounded-full">
                {job.category || "N/A"}
              </span>
            </div>
          </div>

          {/* Skills & Tools */}
          <div>
            <span className="font-medium">Skills & Tools</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {(job.skills || []).map((skill, idx) => (
                <span
                  key={`skill-${idx}`}
                  className="inline-block px-3 py-1 border border-gray-300 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {(job.tools || []).map((tool, idx) => (
                <span
                  key={`tool-${idx}`}
                  className="inline-block px-3 py-1 border border-gray-300 rounded-full"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Project */}
        {job.sampleProjectUrl && (
          <div>
            <span className="font-medium">Sample Project</span>
            <p
              className="text-blue-600 underline cursor-pointer"
              onClick={() => openUrl(job.sampleProjectUrl)}
            >
              {job.sampleProjectUrl}
            </p>
          </div>
        )}

        {/* Bottom spacing */}
        <div style={{ height: "100px" }} />
      </div>
    </div>
  );
};

export default FhJobDetailScreen;
