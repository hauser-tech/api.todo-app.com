const express = require("express");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://main-todo-app-com.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//import routes
const userRoutes = require("./src/user/user-routes");
const taskRoutes = require("./src/task/task-routes");

app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

//Error Handling
app.use(ErrorHandler);

module.exports = app;
