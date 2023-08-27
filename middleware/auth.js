const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../src/user/user-model");
const Task = require("../src/task/task-model");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id).select("-password");
  next();
});

exports.isOwner = catchAsyncErrors(async (req, res, next) => {
  const { taskId } = req.params;

  const task = await Task.findOne({ _id: taskId, userId: req.user._id });

  if (!task) {
    return next(
      new ErrorHandler("You are not authorized for handling this task", 401)
    );
  }

  next();
});
