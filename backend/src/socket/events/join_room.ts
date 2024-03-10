import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Room, User } from "../../db";
import { Types } from "mongoose";
import sendMessageHandler from "./send_message";
import { formatRoom } from "../../helpers";

const joinRoomHandler = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket,
  userId: string,
  inviteCode: string
) => {
  try {
    const room = await Room.findOne({ inviteCode: inviteCode });
    if (!room || !room._id) throw new Error("No such room!");

    if (
      room.participants.find((value) => {
        if (value.toString() == userId) return true;
      })
    )
      throw new Error("Already in room!");

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          rooms: room._id,
        },
      }
    );

    room.participants.push(new Types.ObjectId(userId));
    await room.save();

    const populatedRoom: any = await Room.findOne({ _id: room._id })
      .populate("admin")
      .populate("participants")
      .populate({
        path: "messages",
        populate: {
          path: "sender",
        },
      });

    io.to(socket.id).emit("joined_room", {
      room: formatRoom(populatedRoom, userId),
    });
    socket.join(room._id.toString());

    await sendMessageHandler(
      io,
      null,
      room._id.toString(),
      `${user?.username} created the room`
    );
  } catch (error) {
    console.log("Error occurred!", error);
  }
};

export default joinRoomHandler;