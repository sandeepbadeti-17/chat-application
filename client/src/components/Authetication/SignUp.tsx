import React, { useState } from "react";
import SimpleSnackbar from "../SnakeBar";
import { useNavigate } from "react-router"; // Ensure proper import for navigate

function SignUp() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [pic, setPic] = useState<File | null>(null);
  const [picLoading, setPicLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setSnackbarMessage("Please upload a valid file.");
      setSnackbarOpen(true);
      return;
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setSnackbarMessage("Invalid file type. Only JPEG and PNG are allowed.");
      setSnackbarOpen(true);
      setPic(null);
      return;
    }

    setPic(file);
  };

  // calling two post apis calls, uploading the image and submitting the userdetails with the 
  // cloudinary image url from the first API response
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!name || !email || !password || !confirmPassword) {
      if (!name || !email || !password ) {
      setSnackbarMessage("Please fill out all required fields.");
      setSnackbarOpen(true);
      return;
    }

    // if (password !== confirmPassword) {
    //   setSnackbarMessage("Passwords do not match.");
    //   setSnackbarOpen(true);
    //   return;
    // }

    if (!pic) {
      setSnackbarMessage("Please upload a profile picture.");
      setSnackbarOpen(true);
      return;
    }

    try {
      setPicLoading(true);

      // First API call: Upload the picture to Cloudinary
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-application");
      data.append("cloud_name", "dl0vtcrh2");

      const imageResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dl0vtcrh2/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!imageResponse.ok) {
        throw new Error("Image upload failed.");
      }

      const uploadImage = await imageResponse.json();
      console.log("Image uploaded successfully:", uploadImage);

      // Second API call: Submit user details to localhost API
      const userDetails = {
        name,
        email,
        password,
        pic: uploadImage.secure_url, // Use uploaded image URL
      };

      const userResponse = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to submit user details.");
      }

      const userResult = await userResponse.json();
      console.log("User details submitted successfully:", userResult);
      localStorage.setItem("userInfo",JSON.stringify(userResult))

      setSnackbarMessage("Sign-up successful!");
      setSnackbarOpen(true);
      // Navigate to chats after successful submission
      navigate("/chats");
    } catch (error) {
      console.error("Error:", error);

      // Display a meaningful error message
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setPicLoading(false);
    }
  };

  return (
    <form className="flex flex-col space-y-4 " onSubmit={handleSubmit}>
      {/* Name */}
      <div className="flex flex-col ">
        <label htmlFor="name" className="w-24 py-1">
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-full text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label htmlFor="email" className=" w-24 py-1">
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

      {/* Password */}
      <div className="flex flex-col">
        <label htmlFor="password" className=" w-24 py-1">
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

      {/* Confirm Password
      <div className="flex flex-col">
        <label htmlFor="confirm-password" className=" w-full py-1">
          Confirm Password:
        </label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-full text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
          required
        />
      </div> */}

      {/* Upload Picture */}
      <div className="flex items-center ">
        <label htmlFor="upload" className=" w-24">
          Picture:
        </label>
        <input
          type="file"
          accept="image/jpeg, image/png"
          id="upload"
          onChange={handlePicChange}
          className="border border-gray-400 text-black rounded px-2 py-1 w-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={picLoading}
        className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-200 hover:text-black"
      >
        {picLoading ? "Loading..." : "Sign Up"}
      </button>

      <SimpleSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </form>
  );
}

export default SignUp;
