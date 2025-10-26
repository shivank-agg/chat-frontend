import { createContext, useContext, useState } from "react";
import DigitalClock from "../components/DigitalClock";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [connected, setConnected] = useState(false);
  return (
    <ChatContext.Provider
      value={{
        roomId,
        setRoomId,
        connected,
        currentUser,
        setCurrentUser,
        setConnected,
      }}
    >
      {children}
      <DigitalClock />
    </ChatContext.Provider>
  );
};

export default function useChatContext() {
  return useContext(ChatContext);
}
