import { useState, useEffect } from "react";
import { RoomInfoInteface } from "../helper/types";

const RoomDetailsIcon = ({ room }: { room: RoomInfoInteface }) => {
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isDetailsHovered, setIsDetailsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowDetails(isIconHovered || isDetailsHovered);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [isIconHovered, isDetailsHovered]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsIconHovered(true)}
      onMouseLeave={() => setIsIconHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
        />
      </svg>

      {showDetails && (
        <div
          className="absolute top-10 left-0 bg-white shadow-md p-4 rounded-lg min-w-96 w-fit font-normal"
          onMouseEnter={() => setIsDetailsHovered(true)}
          onMouseLeave={() => setIsDetailsHovered(false)}
        >
          <h3 className="font-semibold text-lg">{room.title}</h3>
          <p className="text-md">
            {room.description
              ? `Description: ${room.description}`
              : "No description"}
          </p>
          <p className="text-md">
            Created on: {room.creationDate.slice(0,10)}
          </p>
          <p className="text-md">Created by: {room.admin.username}</p>
          <p className="text-md">{room.inviteCode ? `Invite code: ${room.inviteCode}` : "You do not have access to see invite code. Ask Admin."}</p>
          <p className="text-md">Participants: </p>
          <div className="px-4">
            {room.participants.map(({ username }, index) => {
              return (
                <p className="text-md">
                  {index + 1}. {username}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailsIcon;
