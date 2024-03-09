import { Router, Request, Response } from "express";
import { signInBodySchema, signUpBodySchema, updateUserBodySchema } from "./user.zodschema";
import STATUS_CODES from "../../helpers/statusCodes"
import { User } from "../../db";
import { createHash, validatePassword } from "../../helpers/hash";
import { createJWT } from "../../helpers/jwt";
import authMiddleware from "../../middlewares/authMiddleware";
import { UserAuthRequest } from "../../helpers/types";

const userRouter = Router();

interface ErrorSchema {
    username?: string,
    email?: string,
    password?: string,
    other?: string,
}

userRouter.post('/signup', async (req: Request, res: Response) => {
    const payload = req.body;
    const result = signUpBodySchema.safeParse(payload);

    if (!result.success) {
        let errors:ErrorSchema = {
            username: "",
            email: "",
            password: "",
            other: ""
        }

        result.error.errors.forEach(err => {
            if (err.path[0]) {
                errors[err.path[0].toString() as keyof ErrorSchema] = err.message;
            } else {
                errors["other"] = err.message;
            }
        })


        return res.status(STATUS_CODES.BadRequest).json({
            errors,
        })
    }

    const { username, email, password } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id) {
        return res.status(STATUS_CODES.Conflict).json({
            errors: {
                email: "User with same email already exists!"
            }
        })
    }

    const passwordHash = await createHash(password);

    const user = await User.create({
        username,
        email,
        passwordHash
    });

    const token = createJWT({
        userId: user._id,
    });

    return res.status(STATUS_CODES.Created).json({
        message: "User Successfully Created!",
        token
    })
})

userRouter.post('/signin', async (req: Request, res: Response) => {
    const payload = req.body;
    const result = signInBodySchema.safeParse(payload);

    if (!result.success) {
        let errors:ErrorSchema = {
            email: "",
            password: "",
            other: ""
        }

        result.error.errors.forEach(err => {
            if (err.path[0]) {
                errors[err.path[0].toString() as keyof ErrorSchema] = err.message;
            } else {
                errors["other"] = err.message;
            }
        })

        return res.status(STATUS_CODES.BadRequest).json({
            errors,
        })
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(STATUS_CODES.BadRequest).json({
            errors: {
                other: "No such user exists!"
            }
        })
    }

    const isValid = await validatePassword(password, user.passwordHash);
    if (!isValid) {
        return res.status(STATUS_CODES.BadRequest).json({
            errors: {
                other: "Invalid Credentials!"
            }
        })
    }

    const token = createJWT({
        userId: user._id,
    })

    return res.status(STATUS_CODES.OK).json({
        message: "User Successfully Signed In!",
        token
    })
})

userRouter.get('/me', authMiddleware, async (req: UserAuthRequest, res: Response) => {
    const userId = req.userId;

    // if (!userId) {
    //     return res.status(STATUS_CODES.NotFound).json({
    //         error: {
    //             message: "No such user exists",
    //         }
    //     })
    // }

    const user = await User.findOne({ _id: userId });

    if (!user) {
        return res.status(STATUS_CODES.NotFound).json({
            errors: {
                message: "No such user exists",
            }
        })
    }

    return res.status(STATUS_CODES.OK).json({
        user: {
            _id: user._id,
            user: user.username,
            email: user.email,
        }
    })
})

userRouter.put('/update', authMiddleware, async (req: UserAuthRequest, res: Response) => {
    const payload = req.body;

    const result = updateUserBodySchema.safeParse(payload);
    if (!result.success) {
        let errors:ErrorSchema = {
            username: "",
            email: "",
            password: "",
            other: ""
        }

        result.error.errors.forEach(err => {
            if (err.path[0]) {
                errors[err.path[0].toString() as keyof ErrorSchema] = err.message;
            } else {
                errors["other"] = err.message;
            }
        })

        return res.status(STATUS_CODES.BadRequest).json({
            errors
        })
    }

    const { username, password } = result.data;
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
        return res.status(STATUS_CODES.NotFound).json({
            errors: {
                other: "No such user exists",
            }
        })
    }

    if (username)
        user.username = username;

    if (password) {
        const passwordHash = await createHash(password);
        user.passwordHash = passwordHash;
    }

    await user.save();

    return res.status(STATUS_CODES.OK).json({
        message: "User Successfully Updated!",
    })
})

export default userRouter;