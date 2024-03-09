import zod from "zod";

const signUpBodySchema = zod.object({
    username: zod.string().min(5, { message: "Username too long!" }).max(30, { message: "Username too long!" }),
    email: zod.string().email().max(30, { message: "Email too long!" }),
    password: zod.string().min(8, { message: "Password too short!" }).max(30, { message: "Password too long!" }),
})

const signInBodySchema = zod.object({
    email: zod.string().email().max(30, { message: "Email too long!" }),
    password: zod.string().min(8, { message: "Password too short!" }).max(30, { message: "Password too long!" }),
})

const updateUserBodySchema = zod.object({
    username: zod.optional(zod.string().min(5).max(30, { message: "Username too long!" })),
    password: zod.optional(zod.string().min(8, { message: "Password too short!" }).max(30, { message: "Password too long!" })),
})

export {
    signUpBodySchema,
    signInBodySchema,
    updateUserBodySchema
}