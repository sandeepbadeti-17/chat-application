import { useState } from "react";
import SimpleSnackbar from "../SnakeBar";
import axios from 'axios';
import { useNavigate } from "react-router";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // const PORT = import.meta.env.VITE_BASE_URL 
  const PORT =  "http://localhost:5000"
  const navigate = useNavigate()
  const handleGuestLogin = () => {
    setEmail("guest@example.com");
    setPassword("password123");
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
    setLoading(true)
    if(!email || !password){
      setSnackbarMessage("Please Fill all the fields")
      setSnackbarOpen(true)
      setLoading(false)
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type" : "application/json",
        }
      }
      console.log(PORT,'port is here the request is going to')
      const { data } = await axios.post(`${PORT}/api/user/login`, {email, password}, config)
      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)
      navigate("/chats")
    } catch (error) {
      console.log(error)
      setSnackbarOpen(true)
      setSnackbarMessage("Error Occured!")
      setLoading(false)
    }
  };

  return (
    <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit}>
      {/* Email Field */}
      <div className="flex flex-col  ">
        <label htmlFor="email" className="text-gray-100 w-24  py-1">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-full text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
          required
        />
      </div>

      {/* Password Field */}
      <div className="flex flex-col  ">
        <label htmlFor="password" className="text-gray-100 w-24  py-1">
          Password:
        </label>
        <div className="flex flex-row">

        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-full text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
          required
        />
        <button
          type="button"
          className="px-2 py-1 ml-1 text-sm rounded hover:bg-gray-300 border border-gray-400 focus:outline-none hover:text-black"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
        </div>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-200 hover:text-black"
      >
        Login
      </button>

      {/* Guest Login Button */}
      <button
        type="button"
        onClick={handleGuestLogin}
        className="px-4 py-2 w-4/6 text-black bg-gray-200 rounded hover:bg-gray-600 hover:text-white"
      >
        Guest Credentials
      </button>
      <SimpleSnackbar
      open={snackbarOpen}
      message={snackbarMessage}
      onClose={() => setSnackbarOpen(false)}
      />
      <div>{loading}</div>
    </form>
  );
}

export default Login;
