import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Rectangles } from "./types/rectangles";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let rectangles: Rectangles[] = [];

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.emit("rectangle:init", rectangles);

  socket.on("rectangle:add", (data) => {
    rectangles.push(data);
    socket.broadcast.emit("rectangle:add", data);
  });
  socket.on("rectangle:move", (data) => {
    rectangles = rectangles.map((rect) =>
      rect.id === data.id ? { ...rect, x: data.x, y: data.y } : rect
    );
    socket.broadcast.emit("rectangle:move", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
