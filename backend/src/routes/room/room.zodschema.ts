import zod from "zod";

const createRoomSchema = zod.object({
    title: zod.string().min(5).max(40),
    description: zod.string().max(100),
})

export {
    createRoomSchema
}