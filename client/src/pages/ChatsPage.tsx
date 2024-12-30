import { useState } from "react";
import ChatBox from "../components/Chat/ChatBox";
import MyChats from "../components/Chat/MyChats";
import { ChatState } from "../context/ChatProvider";

function ChatsPage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const [isChatSelected, setIsChatSelected] = useState<boolean>(false);
  const [myChatsWidth, setMyChatsWidth] = useState<number>(50);

  const handleDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    const containerWidth = document.body.clientWidth;
    const newWidth = (event.clientX / containerWidth) * 100;
    if (newWidth >= 30 && newWidth <= 60) {
      setMyChatsWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    handleDrag(event as unknown as React.MouseEvent<HTMLDivElement>);
  };

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="relative flex h-full">
        {/* MyChats Section */}
        <div
          className={`
            ${isChatSelected ? "hidden sm:block" : "w-full"}
            border-r transition-all duration-300 ease-in-out
            sm:relative sm:block
            ${!isChatSelected && "sm:w-[50%]"}
          `}
          style={{ 
            width: window.innerWidth >= 640 ? `${myChatsWidth}%` : undefined,
            minWidth: window.innerWidth >= 640 ? "30%" : undefined,
            maxWidth: window.innerWidth >= 640 ? "60%" : undefined
          }}
        >
          {user && (
            <MyChats
              user={user}
              fetchAgain={fetchAgain}
              onSelectChat={() => setIsChatSelected(true)}
            />
          )}
        </div>

        {/* Draggable Divider - Hidden on mobile */}
        <div
          className="hidden sm:flex w-2 bg-gray-300 hover:bg-gray-500 cursor-col-resize 
            transition-all ease-in-out items-center justify-center"
          onMouseDown={handleMouseDown}
        >
          <span className="w-1 h-10 bg-gray-500 rounded-full"></span>
        </div>

        {/* ChatBox Section */}
        <div
          className={`
            ${isChatSelected ? "w-full" : "hidden sm:block"}
            relative transition-all duration-300 ease-in-out
            sm:block
            ${!isChatSelected && "sm:w-[50%]"}
          `}
          style={{ 
            width: window.innerWidth >= 640 ? `${100 - myChatsWidth}%` : undefined,
            minWidth: window.innerWidth >= 640 ? "40%" : undefined,
            maxWidth: window.innerWidth >= 640 ? "70%" : undefined
          }}
        >
          {isChatSelected && (
            <button
              onClick={() => setIsChatSelected(false)}
              className="absolute top-2 left-2 sm:hidden bg-blue-500 text-white py-1 px-3 rounded"
            >
              Back
            </button>
          )}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatsPage;