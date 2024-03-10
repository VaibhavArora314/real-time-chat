import { Router, Response } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { UserAuthRequest } from "../../helpers/types";
import { Room, User } from "../../db";
import STATUS_CODES from "../../helpers/statusCodes";
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

export default roomRouter;