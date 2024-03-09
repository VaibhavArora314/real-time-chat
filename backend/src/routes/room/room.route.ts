import { Router, Response } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { UserAuthRequest } from "../../helpers/types";
import { Room, User } from "../../db";
import STATUS_CODES from "../../helpers/statusCodes";
import { v4 } from 'uuid';
import { createRoomSchema } from "./room.zodschema";
import mongoose from "mongoose";

const roomRouter = Router();

interface ErrorSchema {
    title?: string,
    description?: string,
    other?: string
}

roomRouter.get('/my-rooms', authMiddleware, async (req: UserAuthRequest, res: Response) => {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId }).populate("rooms");

    return res.status(STATUS_CODES.OK).json({
        rooms: user?.rooms ? user.rooms.map((room: any) => ({
            _id: room._id,
            title: room?.title,
            lastActivity: room?.lastActivity,
            lastMessage: room?.lastMessage,
        })) : [],
    })
})

roomRouter.get('/my-rooms/:id', authMiddleware, async (req: UserAuthRequest, res: Response) => {
    const userId = req.userId;
    const roomId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(STATUS_CODES.BadRequest).json({
            error: "Invalid roomId!",
        })
    }

    const user = await User.findOne({ _id: userId, rooms: {
        "$in" : roomId
    } });

    if (!user) {
        return res.status(STATUS_CODES.BadRequest).json({
            error: "This room may not exist or your do not have access to view this!",
        })
    }

    const room:any = await Room.findOne({_id: roomId}).populate("admin").populate("participants").populate({
        path: "messages",
        populate: {
            path: "sender"
        }
    })

    return res.status(STATUS_CODES.OK).json({
        room : {
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
    })
})

roomRouter.post('/create', authMiddleware, async (req: UserAuthRequest, res: Response) => {
    const userId = req.userId;
    const payload = req.body;

    const result = createRoomSchema.safeParse(payload);

    if (!result.success) {
        let errors: ErrorSchema = {
            title: "",
            description: "",
            other: ""
        }

        result.error.errors.forEach(err => {
            if (err.path[0]) {
                errors[err.path[0].toString() as keyof ErrorSchema] = err.message;
            } else {
                errors["other"] = err.message;
            }
        })

        return res.status(STATUS_CODES.BadRequest).json({
            errors,
        })
    }

    const randomInviteCode = v4().replace(/-/g, '').substring(0, 10);

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(STATUS_CODES.BadRequest).json({
                errors: {
                    other: "No such user exists!"
                }
            })
        }

        let newRoom: any = await Room.create({
            title: result.data.title,
            description: result.data.description,
            admin: userId,
            creationDate: Date.now(),
            inviteCode: randomInviteCode,
            participants: [userId],
            messages: [],
            lastActivity: Date.now(),
        })

        user.rooms.push(newRoom._id);
        await user.save();

        newRoom = await (await newRoom.populate("participants")).populate("admin");

        return res.status(STATUS_CODES.Created).json({
            room: {
                _id: newRoom._id,
                title: newRoom?.title,
                description: newRoom?.description,
                admin: {
                    _id: newRoom?.admin?._id,
                    username: newRoom?.admin?.username,
                    email: newRoom?.admin?.email
                },
                inviteCode: (userId == newRoom?.admin?._id) ? newRoom?.inviteCode : null,
                participants: newRoom?.participants?.map((user: any) => ({
                    _id: user?._id,
                    username: user?.username,
                    email: user?.email
                })),
                creationDate: newRoom.creationDate,
                lastActivity: newRoom.lastActivity,
                lastMessage: newRoom.lastMessage,
                messages: newRoom.messages
            }
        })
    } catch (error) {
        console.log(error);

        return res.status(STATUS_CODES.InternalServerError).json({
            error: {
                other: "An unexpected occurred"
            }
        })
    }
})

export default roomRouter;