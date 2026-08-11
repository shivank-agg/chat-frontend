import { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { BASE_URL } from "../config/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { getMessages } from "../services/RoomService";
import { timeAgo } from "../config/helper";

function ChatPage() {
  const {
    roomId,
    currentUser,
    connected,
    setRoomId,
    setCurrentUser,
    setConnected,
  } = useChatContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function loadMessages() {
      try {
        const messagesHere = await getMessages(roomId);
        setMessages(messagesHere);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    }
    if (connected) {
      loadMessages();
    }
  }, [roomId, connected]);

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]);

  useEffect(() => {
    const connectWebSocket = () => {
      //SockJS
      const sock = new SockJS(`${BASE_URL}/chat`);
      const client = Stomp.over(sock);
      client.connect({}, () => {
        setStompClient(client);
        toast.success("WebSocket connected!");
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);
          const newMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      });
    };
    if (connected) {
      connectWebSocket();
    }
  }, [roomId, connected]);
  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      console.log("Hello");
      const message = {
        sender: currentUser,
        content: input.trim(),
        roomId: roomId,
      };
      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message),
      );
      setInput("");
    }
  };
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleLogOut = () => {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  useEffect(() => {}, []);
  return (
    <div className="">
      {/*this is the header portion*/}
      <header className="dark:border-gray-700 py-5 w-full fixed dark:bg-gray-900 border flex justify-around items-center">
        {/*room Name container */}
        <div className="">
          <h1 className="text-xl font-semibold">
            Room : <span>{roomId}</span>
          </h1>
        </div>
        {/*userName container */}
        <div>
          <h1 className="text-xl font-semibold">
            User : <span>{currentUser}</span>
          </h1>
        </div>
        {/*buttons container */}
        <div>
          <button
            className="dark:bg-red-500 hover:dark:bg-red-700 px-3 py-2 rounded-full"
            onClick={handleLogOut}
          >
            Leave Room
          </button>
        </div>
      </header>

      <main
        className="py-20 px-10 w-2/3 border h-screen mx-auto dark:bg-slate-600 overflow-auto"
        ref={chatBoxRef}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${currentUser === message.sender ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`my-2 ${currentUser === message.sender ? "bg-blue-800" : "bg-green-800"} p-2 max-w-xs rounded`}
            >
              <div className="flex flex-row gap-2">
                <img
                  className="h-10 w-10"
                  src={"https://avatarapi.runflare.run/public/boy"}
                ></img>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold">{message.sender}</p>
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-400 flex justify-end">
                    {timeAgo(message.timeStamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/*This is the input message container */}
      <div className="fixed bottom-2 w-full h-16">
        <div className="h-full border flex px-10 pl-0 gap-4 items-center rounded-full justify-between border-gray-800 mx-auto w-2/3 dark:bg-gray-900">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type your message here..."
            className=" h-full px-4 w-full py-2 dark:bg-gray-900 focus:outline-none rounded-full focus:ring-0 focus:ring-gray-800 "
            onKeyDown={handleKeyDown}
          />
          <div className="flex gap-1">
            <button className="dark:bg-purple-600 px-3 py-2 h-10 w-10 flex justify-center items-center rounded-full">
              <MdAttachFile size={20} />
            </button>
            <button
              className="dark:bg-green-600 px-3 py-2 h-10 w-10 flex justify-center items-center rounded-full"
              onClick={sendMessage}
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
