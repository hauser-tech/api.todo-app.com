const ErrorHandler = require("../../utils/ErrorHandler");
const Task = require("./task-model");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");

exports.createTask = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, dueDate } = req.body;

    const task = await Task.findOne({
      name: name.toLowerCase(),
      userId: req.user._id,
    });

    if (task) {
      return next(new ErrorHandler("Task already exists.", 400));
    }

    const currentTask = {
      name: name.toLowerCase(),
      dueDate: dueDate,
      userId: req.user._id,
    };

    await Task.create(currentTask);
    return res.status(201).json({
      message: "Task created successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.updateTaskStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { status: true },
      { new: true }
    );

    if (!task) {
      return next(new ErrorHandler("Task doesn't exists!", 400));
    }

    return res.status(201).json({
      message: "Task status updated successfully.",
      task,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.deleteTask = catchAsyncErrors(async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return next(new ErrorHandler("Task doesn't exists!", 400));
    }

    return res.status(201).json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.getTasks = catchAsyncErrors(async (req, res, next) => {
  try {
    const { search } = req.query;

    const query = search
      ? { name: new RegExp(search, "i"), userId: req.user._id }
      : { userId: req.user._id };

    const tasks = await Task.find(query);

    if (!tasks) {
      return next(new ErrorHandler("Tasks doesn't exists!", 400));
    }

    return res.status(201).json(tasks);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
