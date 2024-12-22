import React from "react";
// import { IoSearch } from "react-icons/io5";
// import { useNavigate } from "react-router";

const Navbar = () => {
  // const logoutHandler = () => {
  //   localStorage.removeItem("userInfo");
  //   navigate("/");
  // };
  return (
    <nav className="flex items-center justify-between bg-gray-800 text-white py-4 px-4 text-lg border-b border-gray-300">
      <div className="text-3xl font-bold">&lt;\</div>
      <div className="text-2xl font-bold ml-2">O-O</div>
      <div className="text-3xl font-bold">/&gt;</div>
    </nav>
  );
};

export default Navbar;
