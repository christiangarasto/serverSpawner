const User = require("../models/User");
const CustomError = require("../errors");
const { okDto } = require("./response-dto");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ username });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  okDto(res, { user: tokenUser });
};

const logout = async (req, res) => {
  // Rimuovi il cookie dal client
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Solo in produzione usa secure
    signed: true, // Se stai usando cookie firmati
  });

  // Invia una risposta di successo
  okDto({ message: "Logged out successfully" });
};

const me = async (req, res) => {
  const tokenUser = req.user;

  okDto(res, { user: tokenUser });
};

module.exports = {
  login,
  logout,
  me,
};
