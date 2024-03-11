import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Message, Room, User } from "../../db";
import sendMessageHandler from "./send_message";

const leaveRoomHandler = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket,
  userId: string,
  roomId: string
) => {
  let room = await Room.findOne({ _id: roomId });

  if (!room || !room.participants.find((curId) => curId.toString() == userId))
    return;

  room = await Room.findOneAndUpdate(
    { _id: roomId },
    {
      $pull: {
        participants: userId,
      },
    },
    {
      new: true,
    }
  );

  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $pull: {
        rooms: roomId,
      },
    },
    { new: true }
  );

  io.to(socket.id).emit("left_room", { roomId });
  socket.leave(roomId);

  if (room && room?.participants.length > 0)
    await sendMessageHandler(
      io,
      null,
      roomId,
      `${user?.username} left the room`
    );
  else {
    //delete since no one present
    await Room.deleteOne({ _id: roomId });
    await Message.deleteMany({ room: roomId });
  }
};

export default leaveRoomHandler;
