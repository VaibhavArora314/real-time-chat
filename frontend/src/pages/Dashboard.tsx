import JoinRoomModal from "../components/JoinRoomModal";
import CreateRoomModal from "../components/CreateRoomModal";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import ChatComponent from "../components/ChatComponent";
import { Socket } from "socket.io-client";

interface DashboardProps {
  socket: Socket | null;
}

const Dashboard = ({ socket }: DashboardProps) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleRoomClick = (id: string) => {
    setSelectedRoomId(id);
  };

  const sendMessage = (message: string, roomId: string) => {
    console.log(message, roomId);

    socket?.emit("send_message", { message, roomId });
  };

  const joinRoom = (inviteCode: string) => {
    socket?.emit("join_room", {
      inviteCode,
    });
  };

  return (
    <>
      <div className="container min-h-[90vh] mx-auto flex flex-col md:flex-row justify-center items-start p-8">
        <Sidebar
          selectedRoomId={selectedRoomId}
          handleRoomClick={handleRoomClick}
          handleCreateModalOpen={() => {
            setShowCreateModal(true);
          }}
          handleJoinModalOpen={() => {
            setShowJoinModal(true);
          }}
        />

        {selectedRoomId ? (
          <ChatComponent
            selectedRoomId={selectedRoomId}
            sendMessage={sendMessage}
          />
        ) : (
          <div className="w-[90%] md:w-3/4 flex flex-col items-start justify-start">
            Please select a group to see messages
          </div>
        )}
      </div>

      {showJoinModal && (
        <JoinRoomModal
          handleJoinModalClose={() => {
            setShowJoinModal(false);
          }}
          joinRoom={joinRoom}
        />
      )}

      {showCreateModal && (
        <CreateRoomModal
          handleCreateModalClose={() => {
            setShowCreateModal(false);
          }}
        />
      )}
    </>
  );
};

export default Dashboard;
