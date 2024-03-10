import { useRecoilState, useRecoilValue } from "recoil";
import Button from "./Button";
import { RoomInfo, sortedRoomIDs } from "../store/atoms/room";
import { RoomInfoInteface, RoomOverviewInteface } from "../helper/types";
import { selectedRoomAtom } from "../store/atoms/selectedRoom";
import { userState } from "../store/atoms/auth";

interface SidebarProps {
  handleJoinModalOpen: () => void;
  handleCreateModalOpen: () => void;
}

const Sidebar = ({
  handleCreateModalOpen,
  handleJoinModalOpen,
}: SidebarProps) => {
  const sortedRooms = useRecoilValue(sortedRoomIDs);

  return (
    <div className="w-[90%] md:w-1/4 mr-8 h-full flex flex-col justify-between mb-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">Rooms</h2>
        <div className="space-y-2 overflow-y-auto max-h-[40vh] md:max-h-[60vh] scrollbar">
          {sortedRooms.map((room: RoomOverviewInteface) => (
            <SiderbarItem roomId={room._id} key={room._id} />
          ))}
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <Button type="button" label="Join Room" onClick={handleJoinModalOpen} />
        <Button
          type="button"
          label="Create Room"
          onClick={handleCreateModalOpen}
          color="green"
        />
      </div>
    </div>
  );
};

export default Sidebar;

interface SiderbarItemProps {
  roomId: string;
}

const SiderbarItem = ({ roomId }: SiderbarItemProps) => {
  const user = useRecoilValue(userState);
  const room: RoomInfoInteface = useRecoilValue(RoomInfo(roomId));
  const [selectedRoomId, setSelectedRoomId] = useRecoilState(selectedRoomAtom);

  return (
    <div
      key={roomId}
      onClick={() => setSelectedRoomId(roomId)}
      className={`cursor-pointer p-4 rounded-lg ${
        selectedRoomId && selectedRoomId === roomId
          ? "bg-blue-100"
          : "hover:bg-gray-100"
      }`}
    >
      <p className="font-semibold text-md">{room?.title}</p>
      {room.messages.length > 0 && (
        <p className="text-sm text-wrap break-words">
          {room.messages[room.messages.length - 1].sender &&
          room.messages[room.messages.length - 1].sender?._id
            ? room.messages[room.messages.length - 1].sender?._id == user?._id
              ? "You: "
              : room.messages[room.messages.length - 1].sender?.username + ": "
            : "System: "}
          {room.messages[room.messages.length - 1].content.length > 30
            ? room.messages[room.messages.length - 1].content.substring(0, 30) +
              "..."
            : room.messages[room.messages.length - 1].content}
        </p>
      )}
    </div>
  );
};
