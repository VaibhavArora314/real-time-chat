import mongoose from "mongoose";
import userSchema, { UserType } from "./user.schema";
import messageSchema, { MessageType } from "./message.schema";
import roomSchema, { RoomType } from "./room.schema";

const DATABASE_URL = "mongodb://localhost:27017/real-time-chat";

mongoose.connect(DATABASE_URL);

const User = mongoose.model<UserType>("User", userSchema);
const Room = mongoose.model<RoomType>("Room", roomSchema);
const Message = mongoose.model<MessageType>("Message", messageSchema);

export {
    User,
    Room,
    Message,
}