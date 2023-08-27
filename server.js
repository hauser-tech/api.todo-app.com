const app = require("./app");
const connectDatabase = require("./db/database");

// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log("Error : ", err.message);
  console.log("shutting down the server for handling uncaught exception.");
});

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./config/.env",
  });
}

//connect db
connectDatabase();

//create server
const server = app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});

const io = require("socket.io")(server, {
  path: "/api/socket",
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ],
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
    }
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
  });

  // send message to all user
  socket.on("send-message", (data) => {
    io.emit("recieve-message", data);
  });
});

// Handling promise rejection
process.on("unhandledRejection", (err) => {
  console.log("Error : ", err.message);
  console.log("shutting down the server for unhandled promise rejection.");

  server.close(() => {
    process.exit(1);
  });
});
