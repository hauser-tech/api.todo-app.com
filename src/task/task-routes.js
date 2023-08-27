const { Router } = require("express");
const { isAuthenticated, isOwner } = require("../../middleware/auth");
const {
  createTask,
  updateTaskStatus,
  deleteTask,
  getTasks,
} = require("./task-controller");

const router = Router();

router.post("/create-task", isAuthenticated, createTask);
router.put(
  "/update-task-status/:taskId",
  isAuthenticated,
  isOwner,
  updateTaskStatus
);
router.delete("/delete-task/:taskId", isAuthenticated, isOwner, deleteTask);
router.get("/get-all-tasks-by-user-id", isAuthenticated, getTasks);

module.exports = router;
