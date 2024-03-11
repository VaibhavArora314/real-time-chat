import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Room, User } from "../../db";
import { v4 } from "uuid";
import { RoomInteface } from "../../helpers/types";
import sendMessageHandler from "./send_message";
import { formatRoom } from "../../helpers";
import zod from "zod";

const createRoomSchema = zod.object({
    title: zod.string().min(5).max(40),
    description: zod.string().max(100),
})

const createRoomHandler = async (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: Socket,
    userId: string,
    title: string,
    description: string,
) => {
    try {
        const result = createRoomSchema.safeParse({title,description});

        if (!result.success) return;

        const room: any = await Room.create({
            title,
            description,
            admin: userId,
            creationDate: Date.now(),
            lastActivity: Date.now(),
            inviteCode: v4().replace(/-/g, '').substring(0, 10),
            lastMessage: "",
            messages: [],
            participants: [userId],
        })

        const user = await User.findOneAndUpdate({ _id: userId }, {
            $push: {
                rooms: room._id
            }
        })

        const populatedRoom: RoomInteface | null = await Room.findOne({ _id: room._id }).populate("admin").populate("participants").populate({
            path: "messages",
            populate: {
                path: "sender"
            }
        });

        if (!populatedRoom) return;

        io.to(socket.id).emit("joined_room", {room: formatRoom(populatedRoom,userId), message: `Successfully created room ${title}`});
        socket.join(room._id.toString());

        await sendMessageHandler(io,null,room._id.toString(),`${user?.username} created the room`);
    } catch (error) {
        console.log("Error occurred!", error);
    }
};

export default createRoomHandler;
