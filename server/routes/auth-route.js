const express = require("express");
const router = express.Router();

const { login, logout, me } = require("../controllers/auth-controller");
const { authenticateUser } = require("../middleware/authentication");

router.post("/login", login);
router.get("/logout", logout);

router.get("/me", authenticateUser, me);

module.exports = router;
