import {Request} from "express";

interface UserAuthRequest extends Request {
    userId?: string,
}


interface UserInterface {
    _id: string,
    username: string,
    email: string,
    passwordHash: string,
    rooms: string[] | RoomInteface[],
}

interface MessageInteface {
    _id: string,
    content: string,
    room: string,
    creationDate: string,
    sender?: string | {
        _id: string,
        username: string,
        email: string
    }
}

interface RoomInteface {
    _id: string,
    title: string,
    description: string,
    admin: UserInterface,
    inviteCode?: string,
    participants: string[] | UserInterface[],
    creationDate: string,
    lastActivity: string,
    lastMessage: string,
    messages: string[] | MessageInteface[]
}

export {
    UserAuthRequest,
    MessageInteface,
    RoomInteface
}