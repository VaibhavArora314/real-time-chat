import JoinRoomModal from "../components/JoinRoomModal";
import CreateRoomModal from "../components/CreateRoomModal";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import ChatComponent from "../components/ChatComponent";
import { Socket } from "socket.io-client";
import { useRecoilValue } from "recoil";
import { selectedRoomAtom } from "../store/atoms/selectedRoom";

interface DashboardProps {
  socket: Socket | null;
}

const Dashboard = ({ socket }: DashboardProps) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const selectedRoomId = useRecoilValue(selectedRoomAtom);

  const sendMessage = (message: string, roomId: string) => {
    if (!message || message.length == 0) return "";

    socket?.emit("send_message", { message, roomId });
  };

  const joinRoom = (inviteCode: string) => {
    socket?.emit("join_room", {
      inviteCode,
    });
  };

  const createRoom = (title: string, description: string) => {
    socket?.emit("create_room", {
      title,
      description,
    });
  };

  const leaveRoom = (roomId: string) => {
    socket?.emit("leave_room", {
      roomId
    })
  }

  return (
    <>
      <div className="container min-h-[90vh] mx-auto flex flex-col md:flex-row justify-center items-start p-8">
        <Sidebar
          handleCreateModalOpen={() => {
            setShowCreateModal(true);
          }}
          handleJoinModalOpen={() => {
            setShowJoinModal(true);
          }}
        />

        {selectedRoomId ? (
          <ChatComponent sendMessage={sendMessage} leaveRoom={leaveRoom}/>
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
          createRoom={createRoom}
        />
      )}
    </>
  );
};

export default Dashboard;
