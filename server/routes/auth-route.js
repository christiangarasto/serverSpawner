const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const { login, logout } = require("../controllers/auth-controller");

router.post("/login", login);
router.get("/logout", authenticateUser, logout);

module.exports = router;
