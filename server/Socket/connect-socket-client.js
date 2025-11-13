const { Server } = require("socket.io");
const { wrap, sessionMiddleware } = require("../service/sessionMiddleware");

let io;

function CreateServer(server, allowedOrigins) {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type"],
    },
  });
  //
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);

    if (socket.request.session?.user?.id) {
      redisClient.hset(
        `userid:${socket.request.session.user.id}`,
        "userid",
        socket.request.session.user.id
      );
      next();
    } else {
      console.log("userID null");
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `Session: ${JSON.stringify(socket.request.session.user)}, connected`
    );

    socket.on("disconnect", (reason) => {
      console.log(`User Disconnected: ${socket.userId}, Reason: ${reason}`);
    });

    socket.on("login", (data) => {
      console.log("Data received from client:", data);
      socket.emit("responseData", `Xin chào ${data.data.fullName}`);
    });

    socket.on("comming_soon", (data) => {
      console.log("Data received from client:", data);
      socket.emit("responseData", `Chức năng xem ${data} sắp ra mắt`);
    });
  });
}

const sendNotification = (clientId, message) => {
  if (clientId) {
    io.to(clientId).emit("notification", message); // Gửi thông báo đến phòng cụ thể
  } else {
    io.emit("notification", message); // Gửi thông báo đến tất cả người dùng
  }
};

module.exports = { CreateServer, sendNotification };
