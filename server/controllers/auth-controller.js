const User = require("../models/User");
const CustomError = require("../errors");
const { okDto } = require("./response-dto");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

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

  okDto(res, tokenUser);
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  okDto(res, "logout");
};

module.exports = {
  login,
  logout,
};

module.exports = { login, logout };
