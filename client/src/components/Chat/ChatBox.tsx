import SingleChat from "./SingleChat";

interface ChatBoxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatBox= ({fetchAgain, setFetchAgain} : ChatBoxProps) => {


  return (
    <div className="flex flex-col bg-black h-screen p-4">
      {/* Chat Header */}
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  );
};

export default ChatBox;
