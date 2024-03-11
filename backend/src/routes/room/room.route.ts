import { Router, Response } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { RoomInteface, UserAuthRequest } from "../../helpers/types";
import { Room, User } from "../../db";
import STATUS_CODES from "../../helpers/statusCodes";
import mongoose from "mongoose";
import { formatRoom } from "../../helpers";

const roomRouter = Router();

roomRouter.get(
  "/my-rooms",
  authMiddleware,
  async (req: UserAuthRequest, res: Response) => {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId }).populate("rooms");

    return res.status(STATUS_CODES.OK).json({
      rooms: user?.rooms
        ? user.rooms.map((room: any) => ({
            _id: room._id,
            title: room?.title,
            lastActivity: room?.lastActivity,
            lastMessage: room?.lastMessage,
          }))
        : [],
    });
  }
);

roomRouter.get(
  "/my-rooms/:id",
  authMiddleware,
  async (req: UserAuthRequest, res: Response) => {
    const userId = req.userId;
    const roomId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(STATUS_CODES.BadRequest).json({
        error: "Invalid roomId!",
      });
    }

    const user = await User.findOne({
      _id: userId,
      rooms: {
        $in: roomId,
      },
    });

    if (!user) {
      return res.status(STATUS_CODES.BadRequest).json({
        error:
          "This room may not exist or your do not have access to view this!",
      });
    }

    const room: RoomInteface | null = await Room.findOne({ _id: roomId })
      .populate("admin")
      .populate("participants")
      .populate({
        path: "messages",
        populate: {
          path: "sender",
        },
      });

    return res.status(STATUS_CODES.OK).json({
      room: room ? formatRoom(room, user._id.toString()) : {},
    });
  }
);

roomRouter.post('/verify-invite', authMiddleware, async (req:UserAuthRequest, res: Response) => {
    const {inviteCode} = req.body;

    if (!inviteCode || typeof inviteCode != "string") {
        return res.status(STATUS_CODES.BadRequest).json({
            error: "Invalid invite code!",
        })
    }

    const room = await Room.findOne({inviteCode:inviteCode});

    if (!room) {
        return res.status(STATUS_CODES.BadRequest).json({
            error: "Invalid invite code!",
        })
    }

    return res.status(STATUS_CODES.OK).json({
        message: "Invite code is valid!"
    })
})

export default roomRouter;
