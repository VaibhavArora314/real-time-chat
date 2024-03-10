import { RoomInteface } from "./types";

export const formatRoom = (room: RoomInteface, userId: string | null) => {
    return {
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
    };
}