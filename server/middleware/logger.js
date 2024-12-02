const morgan = require("morgan");
const fs = require("fs");
const pathHandler = require("../utils/path-handler");

const fileRelativePath = "./logs/access.log";
pathHandler.createDirectories(fileRelativePath);

// Crea un flusso di scrittura (write stream) per il file di log
const accessLogStream = fs.createWriteStream(fileRelativePath, {
  flags: "a",
});

// Funzione personalizzata per accedere a req.user e aggiungerlo al log
morgan.format("custom", (tokens, req, res) => {
  return [
    tokens["remote-addr"](req, res),
    "-",
    tokens["remote-user"](req, res),
    "[" + tokens["date"](req, res, "clf") + "]",
    req.user ? `User: ${JSON.stringify(req.user)}` : "",
    '"' +
      tokens["method"](req, res) +
      " " +
      tokens["url"](req, res) +
      " HTTP/" +
      tokens["http-version"](req, res) +
      '"',
    tokens["status"](req, res),
    tokens["res"](req, res, "content-length"),
    '"' + tokens["referrer"](req, res) + '"',
    '"' + tokens["user-agent"](req, res) + '"',
  ].join(" ");
});

// Esporta il middleware di morgan configurato con il formato personalizzato
const logger = morgan("custom", {
  skip: (req, res) => req.url === "/favicon.ico",
  stream: {
    write: (message) => {
      // Logga sulla console
      process.stdout.write(message);
      // Logga nel file
      accessLogStream.write(message);
    },
  },
});

module.exports = logger;
