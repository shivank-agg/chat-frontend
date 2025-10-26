import React, { useState } from "react";
import chatIcon from "../assets/live-chat.png";
import toast from "react-hot-toast";
import {
  createRoom as createRoomApi,
  joinChatApi,
} from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

function JoinCreateChat() {
  const [detail, setDetail] = useState({ roomId: "", userName: "" });
  const {
    roomId,
    currentUser,
    connected,
    setRoomId,
    setCurrentUser,
    setConnected,
  } = useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.userName.trim() === "" || detail.roomId.trim() === "") {
      toast.error("Please fill in both fields.");
      return false;
    }
    return true;
  }
  async function joinChat() {
    if (validateForm()) {
      //joinChat
      try {
        const response = await joinChatApi(detail.roomId);
        console.log(response);
        toast.success("Joined room successfully!");
        setCurrentUser(detail.userName);
        setRoomId(detail.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (err) {
        if (err.status === 400) {
          toast.error("Room does not exist.");
        } else {
          toast.error("Error joining room ");
        }
      }
    }
  }
  async function createRoom() {
    if (validateForm()) {
      //createRoom
      console.log("create room" + detail.roomId);
      try {
        const response = await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room created successfully!");
        setCurrentUser(detail.userName);
        setRoomId(detail.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (err) {
        if (err.status === 400) {
          toast.error("Room already exists.");
        }
        toast("error creating room: ", err);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" p-8 w-full max-w-md flex flex-col gap-5 rounded dark:bg-gray-900 shadow border dark:border-gray-700">
        <h1 className="text-2xl font-semibold text-center">
          Join Room/Create Room
        </h1>
        <div>
          <img src={chatIcon} className="w-16 mx-auto" />
        </div>
        {/*name div*/}
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Your Name
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            id="name"
            name="userName"
            placeholder="Enter your name"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/*room id div*/}
        <div>
          <label htmlFor="roomId" className="block font-medium mb-2">
            Room Id/ new Room Id
          </label>
          <input
            name="roomId"
            onChange={handleFormInputChange}
            value={detail.roomId}
            type="text"
            id="roomId"
            placeholder="Enter the room ID"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/*buttons div*/}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={joinChat}
            className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-700 rounded-full"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-700 rounded-full"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinCreateChat;
