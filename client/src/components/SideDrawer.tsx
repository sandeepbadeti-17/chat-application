import { useState } from "react";
import SimpleSnackbar from "./SnakeBar";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { ChatState } from "../context/ChatProvider";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface UserType {
  id: string;
  name: string;
  email: string;
  pic?: string;
  token?: string;
}

interface SearchResultType {
  _id: string;
  name: string;
  email: string;
  pic?: string;
}

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, user }) => {
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<SearchResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { setSelectedChat, setChats, chats } = ChatState();
  const PORT = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
  const searchHandler = async () => {
    if (!search.trim()) {
      setSnackbarOpen(true);
      setSnackbarMessage("Please enter something in search.");
      return;
    }

    try {
      setLoading(true);

      if (!user?.token) {
        console.error("User token is missing.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${PORT}/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      console.error(errorMessage);
      setSnackbarOpen(true);
      setSnackbarMessage("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId: string) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${PORT}/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load chats.";
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  return (
    <div>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        ></div>
      )}
      {/* SideDrawer */}
      <div
        className={`fixed top-0 left-0 h-full w-96 bg-gray-900 text-gray-200 shadow-lg z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700 bg-gray-800">
          <h2 className="text-xl font-semibold">Search Users</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold hover:text-gray-300"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <div className="flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              onClick={searchHandler}
              className="p-2 ml-2 border border-gray-700 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 transition"
            >
              Go
            </button>
          </div>
          {/* Search Results */}
          <div className="mt-4">
            {loading ? (
              <Box className="flex justify-center items-center h-12">
                <CircularProgress color="inherit" />
              </Box>
            ) : searchResult.length > 0 ? (
              searchResult.map((result) => (
                <div
                  key={result._id}
                  className="p-2 border-b border-gray-700 hover:bg-gray-700 cursor-pointer flex items-center"
                  onClick={() => accessChat(result._id)}
                >
                  <div className="flex items-center space-x-3">
                    <Stack>
                      <Avatar alt={result.name} src={result?.pic} />
                    </Stack>
                    <p className="text-sm font-medium">{result.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No results found.</p>
            )}
          </div>
        </div>
      </div>
      {/* Snackbar */}
      <SimpleSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </div>
  );
};

export default SideDrawer;
