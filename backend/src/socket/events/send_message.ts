import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Message, Room } from "../../db";
import { MessageInteface } from "../../helpers/types";

const sendMessageHandler = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  userId: string | null,
  roomId: string,
  message: string
) => {
  try {
    if (message.length > 300)
      message = message.substring(0,300);

    const newMessage = await Message.create({
      content: message,
      sender: userId,
      room: roomId,
      creationDate: Date.now(),
    });

    await Room.findOneAndUpdate(
      { _id: roomId },
      {
        $push: { messages: newMessage._id },
        lastActivity: newMessage.creationDate,
        lastMessage: newMessage.content,
      }
    );

    const populatedMessage: MessageInteface | null = await Message.findOne({
      _id: newMessage._id,
    }).populate("sender");

    const returnvalue = {
      message: {
        _id: populatedMessage?._id,
        content: populatedMessage?.content,
        sender:
          populatedMessage?.sender &&
          typeof populatedMessage.sender === "object"
            ? {
                _id: populatedMessage?.sender?._id,
                username: populatedMessage?.sender?.username,
                email: populatedMessage?.sender?.email,
              }
            : null,
        room: populatedMessage?.room,
        creationDate: populatedMessage?.creationDate,
      },
    };

    io.to(roomId).emit("receive_message", returnvalue);
  } catch (error) {
    console.log(
      `Error occurred while sending message in room ${roomId} by user ${userId}!`
    );
    // console.log(error?.message);
  }
};

export default sendMessageHandler;
