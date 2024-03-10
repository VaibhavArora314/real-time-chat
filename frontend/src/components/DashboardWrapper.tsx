import { useEffect, useState } from "react";
import Loader from "./Loader";
import Dashboard from "../pages/Dashboard";
import Navbar from "./Navbar";
import { Socket, io } from "socket.io-client";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { tokenState } from "../store/atoms/auth";
import { RoomIDs, RoomInfo } from "../store/atoms/room";
import { MessageInteface, RoomInfoInteface } from "../helper/types";

const DashboardWrapper = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = useRecoilValue(tokenState);

  const handleReceiveMessage = useRecoilCallback(
    ({ set }) =>
      (message: MessageInteface) => {
        const roomId = message.room;

        set(RoomIDs, (curVals) => {
          return curVals.map((room) => {
            const updateRoom = { ...room };

            if (updateRoom._id == roomId) {
              updateRoom.lastMessage = message.content;
              updateRoom.lastActivity = message.creationDate;
            }

            return updateRoom;
          });
        });

        set(RoomInfo(roomId), (curRoom: RoomInfoInteface) => {
          const updatedRoom = { ...curRoom };
          updatedRoom.messages = [...updatedRoom.messages, message];
          updatedRoom.lastActivity = message.creationDate;
          updatedRoom.lastMessage = message.content;
          return updatedRoom;
        });
      },
    []
  );

  const handleRoomJoin = useRecoilCallback(
    ({ set }) =>
      (room: RoomInfoInteface) => {
        set(RoomIDs, (curVal) => {
          const updatedVals = [...curVal];
          updatedVals.push({
            _id: room._id,
            title: room.title,
            lastActivity: room.lastActivity,
            lastMessage: room.lastMessage,
          });

          console.log(updatedVals);
          return updatedVals;
        });
        set(RoomInfo(room._id), room);
      },
    []
  );

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token,
      },
    });

    newSocket.on("connect", () => {
      if (loading) setLoading(false);
    });

    newSocket.on("connect_error", (err) => {
      setError(err.message);
      setLoading(false);
    });

    newSocket.on("joined_room", (data: { room: RoomInfoInteface }) => {
      console.log("joined_room");

      handleRoomJoin(data.room);
    });

    newSocket.on("receive_message", (data: { message: MessageInteface }) => {
      handleReceiveMessage(data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  if (loading) return <Loader />;

  if (error) return <>{error}</>;

  return (
    <>
      <Navbar />
      <Dashboard socket={socket} />
    </>
  );
};

export default DashboardWrapper;
