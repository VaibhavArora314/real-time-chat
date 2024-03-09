import { Response, NextFunction } from "express"
import STATUS_CODES from "../helpers/statusCodes";
import { decodeJWT, verifyJWT } from "../helpers/jwt";
import { UserAuthRequest } from "../helpers/types";
import mongoose from "mongoose";

const authMiddleware = async (req: UserAuthRequest,res: Response,next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(STATUS_CODES.Forbidden).json({
            message: "Invalid token/format",
        });
    }

    const token = authHeader.split(' ')[1];

    const isValid = verifyJWT(token);
    if (!isValid) {
        return res.status(STATUS_CODES.Forbidden).json({
            message: "Invalid token/format",
        });
    }

    const decodedValue:any = decodeJWT(token);
    if (!decodedValue || !decodedValue.userId || !mongoose.Types.ObjectId.isValid(decodedValue.userId)) {
        return res.status(STATUS_CODES.Forbidden).json({
            message: "Invalid token/format",
        });
    }

    req.userId = decodedValue.userId;
    next();
}

export default authMiddleware;