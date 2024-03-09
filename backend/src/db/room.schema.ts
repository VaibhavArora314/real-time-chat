import mongoose, { InferSchemaType } from "mongoose";

const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 40,
        trim: true,
    },
    description: {
        type: String,
        maxLength: 100,
        trim: true,
    },
    creationDate: {
        type: Date,
        required: true,
    },
    lastActivity: {
        type: Date,
        required: true,
    },
    lastMessage: {
        type: String,
        default: ""
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
    inviteCode: {
        type: String,
        maxLength: 10,
        minLength: 6,
        required: true,
        unique: true,
    }
});

export type RoomType = InferSchemaType<typeof roomSchema>;

export default roomSchema;