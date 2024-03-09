import { useRecoilValue } from "recoil";
import { RoomInfo } from "../store/atoms/room";
import { useState } from "react";
import { MessageInteface, RoomInfoInteface } from "../helper/types";

interface ChatComponentProps {
  selectedRoomId: string,
  sendMessage: (message:string,roomId:string) => void
}

const ChatComponent = ({selectedRoomId,sendMessage}:ChatComponentProps) => {
  const room:RoomInfoInteface = useRecoilValue(RoomInfo(selectedRoomId));
  const [message,setMessage] = useState("");

  return (
    <div className="w-[90%] md:w-3/4 h-full flex flex-col">
      <div className="mb-4 h-full">
        <h2 className="text-xl font-semibold mb-4">{room?.title}</h2>
        <div className="bg-gray-100 p-4 h-[62vh] rounded-lg overflow-y-auto scrollbar">
          {room?.messages.map((message:MessageInteface) => (
            <div key={message._id} className="mb-2">
              <p>
                {message.sender?.username ? message.sender?.username : "System"}: {message.content}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <div className="mt-4 flex flex-row gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            onChange={(e) => {setMessage(e.target.value)}}
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg" onClick={() => {sendMessage(message,selectedRoomId)}}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
