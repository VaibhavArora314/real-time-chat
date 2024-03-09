import { Router } from "express";
import userRouter from "./user/user.route";
import roomRouter from "./room/room.route";

const rootRouter = Router();
rootRouter.use('/user',userRouter);
rootRouter.use('/room',roomRouter);

export default rootRouter;