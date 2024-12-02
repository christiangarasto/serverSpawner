// require dotenv package to load environment variables
require("dotenv").config();

// configuration
const HTTP_DOMAIN = process.env.HTTP_DOMAIN || "http://localhost";
const HTTP_PORT = process.env.HTTP_PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// express async-errors
require("express-async-errors");

// database
const connectDB = require("./db/connect");

// logger
const logger = require("./middleware/logger");

// define routes
const authRouter = require("./routes/auth-route");

// define cookieParser
const cookieParser = require("cookie-parser");

// error handlers
const notFoundError = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// middlewares
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// express
const express = require("express");
const app = express();

// express
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(logger);
app.use(express.json());
app.use(cookieParser(JWT_SECRET));

// define path
const authPath = "/api/v1/auth";

// define routes
app.use(authPath, authRouter);

// define errors middleware
app.use(notFoundError);
app.use(errorHandlerMiddleware);

// create server
const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(HTTP_PORT, () => {
      console.log(`Server is listening on domain: ${HTTP_DOMAIN}:${HTTP_PORT}`);
      console.log("authPath", `${HTTP_DOMAIN}:${HTTP_PORT}${authPath}`);
    });
  } catch (error) {
    console.error(error);
  }
};

// start server
start();
