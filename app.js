const express = require("express");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));
// app.use(fileUpload({ useTempFiles: true }));
// app.use(bodyParser.urlencoded());

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./config/.env",
  });
}

//import routes
const userRoutes = require("./src/user/user-routes");
const taskRoutes = require("./src/task/task-routes");

app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

//Error Handling
app.use(ErrorHandler);

module.exports = app;
