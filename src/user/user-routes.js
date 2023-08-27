const { Router } = require("express");
const {
  createUser,
  userLogin,
  getUser,
  userLogout,
} = require("./user-controller");
const { isAuthenticated } = require("../../middleware/auth");

const router = Router();

router.post("/create-user", createUser);
router.post("/user-login", userLogin);
router.get("/get-user", isAuthenticated, getUser);
router.post("/user-logout", isAuthenticated, userLogout);

module.exports = router;
