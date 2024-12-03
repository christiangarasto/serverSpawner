const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
  const tokenJWT = createJWT({ payload: { user } });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("authToken", tokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay * process.env.JWT_LIFETIME),
    domain: "192.168.1.28",
    port: "4200",
    path: "/",
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
