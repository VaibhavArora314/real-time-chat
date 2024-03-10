import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors"
import rootRouter from "./routes";
import bodyParser from "body-parser";
import { decodeJWT, verifyJWT } from "./helpers/jwt";
import { CONNECTED_USERS } from "./store";
import { Message, Room, User } from "./db";
import { config } from "dotenv";
import { v4 } from "uuid";
config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', rootRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173"
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token || !verifyJWT(token)) {
        return next(new Error("Invalid token!"));
    }

    const decodedValue: any = decodeJWT(token);
    const userId = decodedValue.userId;

    if (CONNECTED_USERS.includes(userId)) {
        return next(new Error("One connection already exists for this user!"));
    }

    socket.data.userId = decodedValue.userId;

    next();
}).on("connection", async (socket) => {
    const userId = socket.data.userId;
    CONNECTED_USERS.push(userId);
    // console.log("Connected users: ", CONNECTED_USERS);

    const user = await User.findOne({ _id: userId });
    user?.rooms.forEach((roomId) => {
        socket.join(roomId.toString());
    });

    console.log(`User ${user?.username} connected using socket id ${socket.id} and present in ${socket.rooms.size} rooms initially!`);


    socket.on("send_message", async ({ roomId, message }: {
        roomId: string,
        message: string
    }) => {
        try {
            let newMessage: any = await Message.create({
                content: message,
                sender: userId,
                room: roomId,
                creationDate: Date.now(),
            })

            await Room.findOneAndUpdate({ _id: roomId }, {
                $push: { messages: newMessage._id },
                lastActivity: newMessage.creationDate,
                lastMessage: newMessage.content
            });

            newMessage = await Message.findOne({ _id: newMessage._id }).populate("sender");

            const returnvalue = {
                message: {
                    _id: newMessage._id,
                    content: newMessage.content,
                    sender: {
                        _id: newMessage.sender?._id,
                        username: newMessage.sender?.username,
                        email: newMessage.sender?.email
                    },
                    room: newMessage.room,
                    creationDate: newMessage.creationDate,
                }
            }

            io.to(roomId).emit("receive_message", returnvalue);
        } catch (error) {
            console.log("Error occurred!");
            // console.log(error?.message);
        }
    })

    socket.on("create_room", async ({title,description}:{title:string, description: string}) => {
        try {
            const room:any = await Room.create({
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

            await User.findOneAndUpdate({_id:userId}, {
                $push: {
                    rooms: room._id
                }
            })

            const returnvalue = {
                room: {
                    _id: room?._id,
                    title: room?.title,
                    description: room?.description,
                    admin: {
                        _id: room?.admin?._id,
                        username: room?.admin?.username,
                        email: room?.admin?.email
                    },
                    inviteCode: (userId == room?.admin?._id) ? room?.inviteCode : null,
                    participants: room?.participants?.map((user: any) => ({
                        _id: user?._id,
                        username: user?.username,
                        email: user?.email
                    })),
                    messages: room?.messages?.map((message: any) => ({
                        _id: message?._id,
                        sender: {
                            _id: message?.sender?._id,
                            username: message?.sender?.username,
                            email: message?.sender?.email,
                        },
                        content: message?.content,
                        creationDate: message?.creationDate,
                    })),
                    creationDate: room?.creationDate,
                    lastActivity: room?.lastActivity,
                    lastMessage: room?.lastMessage,
                },
            }

            io.to(socket.id).emit("joined_room", returnvalue);
            socket.join(room._id.toString());

            let newMessage: any = await Message.create({
                content: `${user?.username} created the room`,
                sender: null,
                room: room._id,
                creationDate: Date.now(),
            })

            await Room.findOneAndUpdate({ _id: room._id }, {
                $push: { messages: newMessage._id },
                lastActivity: newMessage.creationDate,
                lastMessage: newMessage.content
            });

            const msgreturn = {
                message: {
                    _id: newMessage._id,
                    content: newMessage.content,
                    sender: null,
                    room: newMessage.room,
                    creationDate: newMessage.creationDate,
                }
            }

            console.log(room._id.toString(), msgreturn);
            io.to(room._id.toString()).emit("receive_message", msgreturn);
        } catch (error) {
            console.log("Error occurred!", error);
        }
    })

    socket.on("join_room", async ({ inviteCode }: { inviteCode: string }) => {
        try {
            const room = await Room.findOne({ inviteCode: inviteCode });
            if (!room || !room._id)
                throw new Error("No such room!");

            if (room.participants.find((value) => {
                if (value.toString() == userId)
                    return true;
            }))
                throw new Error("Already in room!");

            await User.findOneAndUpdate({ _id: userId }, {
                $push: {
                    rooms: room._id
                }
            })

            room.participants.push(userId);
            await room.save();

            const finalRoom: any = await Room.findOne({ _id: room._id }).populate("admin").populate("participants").populate({
                path: "messages",
                populate: {
                    path: "sender"
                }
            })

            const returnvalue = {
                room: {
                    _id: finalRoom?._id,
                    title: finalRoom?.title,
                    description: finalRoom?.description,
                    admin: {
                        _id: finalRoom?.admin?._id,
                        username: finalRoom?.admin?.username,
                        email: finalRoom?.admin?.email
                    },
                    inviteCode: (userId == finalRoom?.admin?._id) ? finalRoom?.inviteCode : null,
                    participants: finalRoom?.participants?.map((user: any) => ({
                        _id: user?._id,
                        username: user?.username,
                        email: user?.email
                    })),
                    messages: finalRoom?.messages?.map((message: any) => ({
                        _id: message?._id,
                        sender: {
                            _id: message?.sender?._id,
                            username: message?.sender?.username,
                            email: message?.sender?.email,
                        },
                        content: message?.content,
                        creationDate: message?.creationDate,
                    })),
                    creationDate: finalRoom?.creationDate,
                    lastActivity: finalRoom?.lastActivity,
                    lastMessage: finalRoom?.lastMessage,
                },
            }

            io.to(socket.id).emit("joined_room", returnvalue);
            socket.join(room._id.toString());

            let newMessage: any = await Message.create({
                content: `${user?.username} joined the room`,
                sender: null,
                room: room._id,
                creationDate: Date.now(),
            })

            await Room.findOneAndUpdate({ _id: room._id }, {
                $push: { messages: newMessage._id },
                lastActivity: newMessage.creationDate,
                lastMessage: newMessage.content
            });

            const msgreturn = {
                message: {
                    _id: newMessage._id,
                    content: newMessage.content,
                    sender: null,
                    room: newMessage.room,
                    creationDate: newMessage.creationDate,
                }
            }

            console.log(room._id.toString(), msgreturn);
            io.to(room._id.toString()).emit("receive_message", msgreturn);
        } catch (error) {
            console.log("Error occurred!", error);
        }
    })

    socket.on("disconnect", () => {
        const index = CONNECTED_USERS.indexOf(userId);

        if (index > -1)
            CONNECTED_USERS.splice(index, 1);

        console.log(`User disconnected ${socket.id}`);
    })
});

httpServer.listen(3000);