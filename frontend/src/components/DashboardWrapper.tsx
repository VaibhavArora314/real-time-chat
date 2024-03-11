import { useEffect, useState } from "react";
import Loader from "./Loader";
import Dashboard from "../pages/Dashboard";
import Navbar from "./Navbar";
import { Socket, io } from "socket.io-client";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { tokenState } from "../store/atoms/auth";
import { RoomIDs, RoomInfo } from "../store/atoms/room";
import { MessageInteface, RoomInfoInteface } from "../helper/types";
import RedirectMessageComponent from "./RedirectMessageComponent";
import { selectedRoomAtom } from "../store/atoms/selectedRoom";
import { toast } from 'react-toastify';

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
          updatedRoom.messages = [...updatedRoom.messages,message];
          updatedRoom.lastActivity = message.creationDate;
          updatedRoom.lastMessage = message.content;
          return updatedRoom;
        });
      },
    []
  );

  const handleRoomJoin = useRecoilCallback(
    ({ set }) =>
      (room: RoomInfoInteface,message:string) => {
        set(RoomIDs, (curVal) => {
          const updatedVals = [...curVal];
          updatedVals.push({
            _id: room._id,
            title: room.title,
            lastActivity: room.lastActivity,
            lastMessage: room.lastMessage,
          });

          return updatedVals;
        });
        set(RoomInfo(room._id), room);

        toast.success(message);
      },
    []
  );

  const handleLeaveRoom = useRecoilCallback(({set}) => (roomId: string) => {
    set(RoomIDs, (curRooms) => {
      return curRooms.filter((curRoom) => (curRoom._id != roomId));
    })

    set(RoomInfo(roomId), null);

    set(selectedRoomAtom, curVal => {
      if (curVal == roomId) return "";
      return curVal;
    })

    toast.success("Successfully left the room!")
  }, [])

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token,
      },
      transports: ['websocket']
    });

    newSocket.on("connect", () => {
      if (loading) setLoading(false);
    });

    newSocket.on("connect_error", (err) => {
      setError(err.message);
      setLoading(false);
    });

    newSocket.on("joined_room", (data: { room: RoomInfoInteface,message: string }) => {
      console.log("joined_room");

      handleRoomJoin(data.room,data.message);
    });

    newSocket.on("receive_message", (data: { message: MessageInteface }) => {
      handleReceiveMessage(data.message);
    });

    newSocket.on("left_room", (data: {roomId: string}) => {
      handleLeaveRoom(data.roomId);
    })

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  if (loading) return <Loader />;

  if (error) return <RedirectMessageComponent message={error}/>;

  return (
    <>
      <Navbar />
      <Dashboard socket={socket} />
    </>
  );
};

export default DashboardWrapper;
