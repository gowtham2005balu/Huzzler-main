import React, { useEffect, useState } from "react";
// import img from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";

import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firbase/Firebase";
import "./clientbrower.css"


export default function ClientCategoryPage() {
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState(null);
  const auth = getAuth();

  const navigate = useNavigate();

  const categories = [
    "Graphic Designer",
    "Web Developer",
    "Mobile Developer",
    "UI/UX Designer",
    "Content Writer",
    "Digital Marketing",
    "Video Editor",
    "3D Artist",
  ];

  useEffect(() => {
  const loadUser = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setUserData(snap.data());
    }
  };

  loadUser();
}, []);

console.log(userData)
  const filteredCategories = searchText.trim()
    ? categories.filter((cat) =>
      cat.toLowerCase().includes(searchText.toLowerCase())
    )
    : categories;


  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">

      {/* =================== HEADER =================== */}
      <div className="flex justify-between items-start px-6 pt-10">
        <div>
          <h1 className="text-4xl font-bold text-black leading-tight">
            Welcome,<br />{userData?.first_name || userData?.firstName || userData?.firstname || userData?.displayName || userData?.name || "Client"}!
          </h1>
          <p className="text-gray-500 text-base mt-1">
            Discover projects that match your skills
          </p>
        </div>

        <div className="flex items-center gap-6 mt-3">
          <span className="material-icons text-gray-700 text-2xl cursor-pointer">
            chat_bubble_outline
          </span>
          <span className="material-icons text-gray-700 text-2xl cursor-pointer">
            notifications_none
          </span>
          <img
            src={userData?.profileImage}
            alt="profile"
            className="clientbrowerprofile"
          />

        </div>
      </div>

      {/* =================== SEARCH BAR =================== */}
      <div className="px-6 mt-8">
        <div className="w-full bg-[#FFF9B8] rounded-xl shadow-sm px-5 py-3 flex items-center gap-3">
          <span className="material-icons text-gray-600 text-xl">search</span>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>
      </div>

      {/* =================== BACK TO BROWSE =================== */}
      <div className="px-6 mt-10 flex items-center gap-2 cursor-pointer w-fit"
        onClick={() => navigate("/freelance-dashboard")}>
        <span className="material-icons text-gray-700">arrow_back</span>
        <p className="text-lg font-medium text-gray-700">Browse Projects</p>
      </div>

      {/* =================== TITLE =================== */}
      <div className="px-6 mt-6">
        <h2 className="text-2xl font-semibold text-black">
          What Are You Looking For?...
        </h2>
        <p className="text-gray-500 mt-1">Choose a category</p>
      </div>

      {/* =================== CATEGORY GRID =================== */}
      <div className="px-6 mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pb-16">
        {filteredCategories.map((cat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() =>
              navigate("/client-dashbroad2/clientcategories", {
                state: { category: cat },
              })
            }
          >
            <div className="w-full h-32 bg-purple-500 flex items-center justify-center">
              {/* <img
                src={img}
                className="w-full h-full object-cover opacity-90"
                alt={cat}
              /> */}
            </div>

            <div className="py-3 text-center">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {cat}
              </p>
            </div>
          </div>
        ))}

        {/* + BUTTON */}
        <div className="bg-white rounded-full shadow-md w-12 h-12 flex items-center justify-center mt-5 ml-auto cursor-pointer hover:bg-gray-100 transition">
          <span className="material-icons text-purple-600 text-2xl">add</span>
        </div>
      </div>

    </div>
  );
}