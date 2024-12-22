import { useState } from "react";
import ChatBox from "../components/Chat/ChatBox";
import MyChats from "../components/Chat/MyChats";
// import Navbar from "../components/Navbar";
import { ChatState } from "../context/ChatProvider";

function ChatsPage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const [myChatsWidth, setMyChatsWidth] = useState<number>(33); // Initial width percentage for MyChats

  const handleDrag = (event: MouseEvent) => {
    const containerWidth = document.body.clientWidth; // Total width of the viewport
    const newWidth = (event.clientX / containerWidth) * 100;
  
    // Constrain width between 20% and 80%
    if (newWidth >= 20 && newWidth <= 80) {
      setMyChatsWidth(newWidth);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* {user && <Navbar />} */}
      <div className="relative flex">
        {/* MyChats Section */}
        <div className="border-r" style={{ width: `${myChatsWidth}%` }}>
          {user && <MyChats user={user} fetchAgain={fetchAgain} />}
        </div>

        {/* Styled Draggable Divider */}
        <div
          className="w-4 bg-gray-200 hover:bg-gray-400 cursor-col-resize transition-all ease-in-out flex justify-center items-center"
          onMouseDown={() => {
            document.addEventListener("mousemove", handleDrag);
            document.addEventListener("mouseup", () => {
              document.removeEventListener("mousemove", handleDrag);
            });
          }}
        >
          {/* Visual Indicator */}
          <span className="w-1 h-8 bg-gray-500 rounded-full"></span>
        </div>

        {/* ChatBox Section */}
        <div style={{ width: `${100 - myChatsWidth}%` }}>
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatsPage;
