export interface MessageInteface {
    _id: string,
    content: string,
    room: string,
    creationDate: string,
    sender?: {
        _id: string,
        username: string,
        email: string
    }
}

export interface UserInterface {
    _id: string,
    username: string,
    email: string,
}

export interface RoomOverviewInteface {
    _id: string,
    title: string,
    lastActivity: string,
    lastMessage: string,
}

export interface RoomInfoInteface {
    _id: string,
    title: string,
    description: string,
    admin: UserInterface,
    inviteCode?: string,
    participants: UserInterface[],
    creationDate: string,
    lastActivity: string,
    lastMessage: string,
    messages: MessageInteface[]
}