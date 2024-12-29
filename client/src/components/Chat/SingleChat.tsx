import { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../config/ChatsLogics";
import { io, Socket } from "socket.io-client";

// const ENDPOINT = "http://localhost:5000";
const PORT = import.meta.env.BASE_URL || "http://localhost:5000";
let socket: Socket;
let selectedChatCompare: Chat | null;

interface ChatBoxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Message {
  _id: string;
  sender: { _id: string; name: string };
  content: string;
  chat: { _id: string };
  createdAt: string;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  lastMessage?: string;
}

interface User {
  _id: string;
  name: string;
  email?: string;
  pic?: string;
  token?: string;
}

function SingleChat({ fetchAgain, setFetchAgain }: ChatBoxProps) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  // const [typing, setTyping]  = useState(false);
  // const [typingUsers, setTypingUsers] = useState(false);
  const { selectedChat, user } = ChatState() as {
    selectedChat: Chat | null;
    user: User;
  };



  const fetchMessages = async () => {
    if (!selectedChat) return;

    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `${PORT}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        `${PORT}/api/message`,
        {
          content: newMessage,
          chatId: selectedChat,
        },
        config
      );
      
      socket.emit("new message", data);
      setMessages([...messages, data]);
      // setFetchAgain(!fetchAgain);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    socket = io(PORT);
    socket.emit("setup", user);
    socket.on("connection", () => {
      console.log("Connected to socket.io");
    });

  }, []);


  useEffect(() => {
    if (!selectedChat) return;
    if (selectedChatCompare) {
      socket.emit("leave chat", selectedChatCompare._id);
  }
    fetchMessages();
    socket.emit("join chat", selectedChat._id );
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        console.log("New message received:", newMessageReceived);
        setFetchAgain(!fetchAgain);
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message received");
    };
  });

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="bg-gray-800 text-white p-3 rounded-t-md">
            <h2 className="text-lg font-semibold">
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : user && getSender(user, selectedChat.users)}
            </h2>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-900 border-gray-800 border-l border-r">
            {loading ? (
              <p className="text-gray-400 text-center">Loading messages...</p>
            ) : messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-2 mb-2 rounded w-max ${
                    msg.sender._id === user._id
                      ? "ml-auto bg-blue-600 text-white"
                      : "mr-auto bg-gray-600 text-white"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs text-gray-300">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No messages yet.</p>
            )}
          </div>

          {/* Input Area */}
          <form
            className="bg-gray-800 text-white p-3 rounded-b-md flex items-center"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 p-2 rounded-l-md outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 p-2 px-4 rounded-r-md text-white"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        // Default UI when no chat is selected
        <div className="flex w-full h-full items-center justify-center text-gray-400">
          Click a user to start chatting
        </div>
      )}
    </>
  );
}

export default SingleChat;
