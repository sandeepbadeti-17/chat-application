import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChatType, UserType } from "../types";
// Define types for User and Chat (replace with actual fields from your backend)
// interface UserType {
//   id: string;
//   name: string;
//   email: string;
//   pic?: string;
//   token?: string;
// }

// interface ChatType {
//   id: string;
//   name: string;
//   lastMessage: string;
//   _id: string;
//   isGroupChat: boolean;
//   chatName: string;
//   users: [];
// }

// Define the context type
interface ChatContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  selectedChat: ChatType | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<ChatType | null>>;
  chats: ChatType[];
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
}

// Initialize the ChatContext with a default value
const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode; // To allow React components or elements as children
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null") as UserType | null;
      if (userInfo) {
        setUser(userInfo);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to parse user info from localStorage:", error);
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Helper function to access context
const ChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("ChatState must be used within a ChatProvider");
  }
  return context;
};

export { ChatState, ChatProvider };
