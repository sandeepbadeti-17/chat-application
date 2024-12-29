import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { useEffect, useState } from "react";
import SimpleSnackbar from "../SnakeBar";
import { getSender } from "../config/ChatsLogics";
import { ChatType } from "../../types";
import SideDrawer from "../SideDrawer";

interface User {
  _id: string;
  name: string;
  email?: string; // Optional fields
  pic?: string;
  token?: string;
}

interface UserType {
  id: string;
  name: string;
  email: string;
  pic?: string;
  token?: string;
}
interface MyChatsProps {
  fetchAgain: boolean;
  user: UserType;
}

function MyChats({ fetchAgain, user }: MyChatsProps) {
  const { selectedChat, setSelectedChat, setChats, chats } = ChatState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loggedUser, setLoggedUser] = useState<User | undefined>();
  const PORT = process.env.BASE_URL || "http://localhost:5000";
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  // const navigate = useNavigate();
  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };
  // Fetch chats from the API
  const fetchChats = async () => {
    try {
      if (!user?.token) {
        setSnackbarMessage("User token is missing.");
        setSnackbarOpen(true);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${PORT}/api/chat`,
        config
      );
      console.log("Fetched Chats:", data);
      setChats(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load chats.";
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchChats();
    const loggedUser = JSON.parse(localStorage.getItem("userInfo") || "null");
    setLoggedUser(loggedUser);
  }, [fetchAgain]);

  return (
    <div className="flex flex-col bg-black h-[calc(100vh-4rem)] overflow-y-scroll scrollbar-hide p-4">
      {/* Header Section */}
      <div className="flex items-center justify-start mb-4 w-full ">
        <div className="text-2xl font-bold mx-2">O-O</div>
       <div className="" onClick={openDrawer}>
          <input
            type="text"
            placeholder="Search Users"
            className="w-full px-3 py-1 flex-grow-0 text-black rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
      </div>

      {/* Chats List */}
      {chats?.map((chat: ChatType) => (
        <div
          key={chat._id}
          className={`p-3 mb-2 rounded shadow-sm transition duration-200 cursor-pointer 
      ${
        selectedChat?._id === chat._id
          ? "bg-gray-700 text-white"
          : "bg-gray-800 hover:bg-gray-700 text-gray-300"
      }`}
          onClick={() => setSelectedChat(chat)}
        >
          <p className="text-md font-semibold">
            {!chat?.isGroupChat
              ? loggedUser
                ? getSender(loggedUser, chat.users)
                : "Unknown Sender"
              : chat.chatName}
          </p>
        </div>
      ))}

      {/* Snackbar for Notifications */}
      <SimpleSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
      <SideDrawer user={user} isOpen={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
}

export default MyChats;

