import { useRecoilValue } from "recoil";
import { RoomInfo } from "../store/atoms/room";
import { useEffect, useRef, useState } from "react";
import { MessageInteface, RoomInfoInteface } from "../helper/types";
import { selectedRoomAtom } from "../store/atoms/selectedRoom";
import RoomDetailsIcon from "./RoomDetailsIcon";
import { userState } from "../store/atoms/auth";
import Button from "./Button";

interface ChatComponentProps {
  sendMessage: (message: string, roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

const ChatComponent = ({ sendMessage, leaveRoom }: ChatComponentProps) => {
  const selectedRoomId = useRecoilValue(selectedRoomAtom);
  const user = useRecoilValue(userState);
  const room: RoomInfoInteface = useRecoilValue(RoomInfo(selectedRoomId));
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedRoomId]);

  return (
    <div className="w-[90%] md:w-3/4 h-full flex flex-col">
      <div className="mb-4 h-full">
        <div className="flex flex-row justify-between p-2">
          <div className="flex flex-row items-start justify-start gap-4">
            <h2 className="text-xl font-semibold mb-4">{room?.title}</h2>
            <RoomDetailsIcon room={room} />
          </div>
          <Button
            label="Leave Room"
            onClick={() => {
              const message =
                "Are you sure you want to leave this room? " +
                (room.participants.length == 1
                  ? "Leaving the room will automatically delete this room since you are the only participant."
                  : "");
              if (window.confirm(message)) leaveRoom(room._id);
            }}
            type="button"
            color="blue"
            fontBold
          />
        </div>
        <div className="bg-gray-100 flex flex-col p-4 h-[62vh] rounded-lg overflow-y-auto scrollbar">
          {room?.messages.map((message: MessageInteface) => {
            if (!message.sender || !message.sender._id)
              return (
                <div
                  key={message._id}
                  className={`mb-2 text-center break-words`}
                >
                  <p className="font-semibold">{message.content}</p>
                </div>
              );

            if (message.sender._id == user._id)
              return (
                <div
                  key={message._id}
                  className={`mb-2 ml-20 md:ml-40 text-end break-words`}
                >
                  <p>{message.content}</p>
                </div>
              );

            return (
              <div
                key={message._id}
                className={`mb-2 mr-20 md:mr-40 text-start break-words`}
              >
                <p>
                  {message.sender?.username
                    ? message.sender?.username
                    : "System"}
                  : {message.content}
                </p>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="mt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(message, selectedRoomId);
            setMessage("");
          }}
        >
          <div className="mt-4 flex flex-row gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              value={message}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              onClick={() => {}}
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
