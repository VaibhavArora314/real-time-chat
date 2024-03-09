import mongoose, { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        maxLength: 30,
        trim: true,
        lowercase: true,
    },
    email: {
        required: true,
        type: String,
        maxLength: 30,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        required: true,
        type: String,
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    }]
});

export type UserType = InferSchemaType<typeof userSchema>;

export default userSchema;