import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import rootRouter from "./routes";
import bodyParser from "body-parser";
import { decodeJWT, verifyJWT } from "./helpers/jwt";
import { CONNECTED_USERS } from "./store";
import { User } from "./db";
import { config } from "dotenv";
import sendMessageHandler from "./socket/events/send_message";
import createRoomHandler from "./socket/events/create_room";
import joinRoomHandler from "./socket/events/join_room";
config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1", rootRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token || !verifyJWT(token)) {
    return next(new Error("Invalid token!"));
  }

  const decodedValue: any = decodeJWT(token);
  const userId = decodedValue.userId;

  if (CONNECTED_USERS.includes(userId)) {
    return next(new Error("One connection already exists for this user!"));
  }

  socket.data.userId = decodedValue.userId;

  next();
}).on("connection", async (socket) => {
  const userId = socket.data.userId;
  CONNECTED_USERS.push(userId);

  const user = await User.findOne({ _id: userId });
  user?.rooms.forEach((roomId) => {
    socket.join(roomId.toString());
  });

  console.log(
    `User ${user?.username} connected using socket id ${socket.id} and present in ${socket.rooms.size} rooms initially!`
  );

  socket.on(
    "send_message",
    async ({ roomId, message }: { roomId: string; message: string }) => {
      sendMessageHandler(io, userId, roomId, message);
    }
  );

  socket.on(
    "create_room",
    async ({ title, description }: { title: string; description: string }) => {
      createRoomHandler(io, socket, userId, title, description);
    }
  );

  socket.on("join_room", async ({ inviteCode }: { inviteCode: string }) => {
    joinRoomHandler(io, socket, userId, inviteCode);
  });

  socket.on("disconnect", () => {
    const index = CONNECTED_USERS.indexOf(userId);

    if (index > -1) CONNECTED_USERS.splice(index, 1);

    console.log(`User disconnected ${socket.id}`);
  });
});

httpServer.listen(3000);
