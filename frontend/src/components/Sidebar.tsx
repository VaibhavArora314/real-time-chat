import { useRecoilValue } from "recoil";
import Button from "./Button";
import { RoomIDs, RoomInfo, sortedRoomIDs } from "../store/atoms/room";
import { RoomInfoInteface, RoomOverviewInteface } from "../helper/types";

interface SidebarProps {
  selectedRoomId: string | null;
  handleRoomClick: (id: string) => void;
  handleJoinModalOpen: () => void;
  handleCreateModalOpen: () => void;
}

const Sidebar = ({
  selectedRoomId,
  handleRoomClick,
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
            <SiderbarItem
              roomId={room._id}
              key={room._id}
              handleRoomClick={handleRoomClick}
              selectedRoomId={selectedRoomId}
            />
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
  handleRoomClick: (id: string) => void;
  selectedRoomId: string | null;
}

const SiderbarItem = ({
  roomId,
  handleRoomClick,
  selectedRoomId,
}: SiderbarItemProps) => {
  const room:RoomInfoInteface = useRecoilValue(RoomInfo(roomId));

  return (
    <div
      key={roomId}
      onClick={() => handleRoomClick(roomId)}
      className={`cursor-pointer p-4 rounded-lg ${
        selectedRoomId && selectedRoomId === roomId
          ? "bg-blue-100"
          : "hover:bg-gray-100"
      }`}
    >
      {room?.title}
    </div>
  );
};
