import mongoose, { InferSchemaType } from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        required: true,
        type: String,
        maxLength: 300,
        trim: true,
    },
    creationDate: {
        required: true,
        type: Date
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    },
});

export type MessageType = InferSchemaType<typeof messageSchema>;

export default messageSchema;