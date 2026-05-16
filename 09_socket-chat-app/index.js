import http from "http";
import { Server } from "socket.io";
import path from "node:path";
import express from "express";

async function main() {
  const app = express();
  app.use(express.static(path.resolve("./public")));

  const server = http.createServer(app);
  const io = new Server();

  io.attach(server);

  io.on("connection", (socket) => {
    console.log(`A new socket has connected`, socket.id);
    
    socket.on("user:message", (data) => {
      console.log("Message from socket", data);
      io.emit("server:message", data);
    });

    socket.on("user:typing", (data) => {
      console.log("User typing:", data);
      socket.broadcast.emit("user:typing", { userId: socket.id, isTyping: data.isTyping });
    });
  });

  server.listen(9000, () => {
    console.log(`Http server is running on PORT 9000`);
  });
}

main();
