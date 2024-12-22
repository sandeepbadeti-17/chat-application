import SignUp from "../components/Authetication/SignUp";
import Login from "../components/Authetication/Login";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function HomePage() {
  const [login, setLogin] = useState("login");
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  // Shared Tailwind classes for buttons
  const buttonClasses =
    "px-6 py-2 hover:bg-white hover:text-black rounded border border-white ";

  return (
    <div className="relative h-[100vh] bg-gray-900 text-white">
      {/* Nav Bar with O-O */}
      <div className="absolute top-0 w-full py-4 bg-gray-800 text-center font-bold text-2xl">
        O-O
      </div>

      {/* Main Content */}
      <section className="flex flex-col-reverse justify-evenly sm:flex-row sm:justify-center items-center h-full pt-20">
        {/* Buttons Section */}
        <div className="flex flex-row sm:flex-col items-center sm:items-center w-full justify-evenly sm:w-1/3 mb-8 sm:mb-0 ">
          <button
            onClick={() => setLogin("login")}
            className={`${buttonClasses} sm:mb-4 sm:w-40`}
          >
            &lt; Login /&gt;
          </button>
          <button
            onClick={() => setLogin("signup")}
            className={`${buttonClasses} sm:w-40`}
          >
            &lt; SignUp /&gt;
          </button>
        </div>

        {/* Vertical Line */}
        <div className="hidden sm:block h-2/3 border-l border-white mx-8"></div>

        {/* Input Fields */}
        <div className="w-4/5 sm:w-1/3 flex justify-center">
          {login === "login" ? <Login /> : <SignUp />}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
