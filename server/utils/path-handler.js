const path = require("path");
const fs = require("fs");

const createDirectories = (filePath) => {
  const dirPath = path.dirname(filePath); // Ottiene il percorso della directory

  if (!fs.existsSync(dirPath)) {
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
      } else {
        console.log(`Directory ${dirPath} created successfully.`);
      }
    });
  }
};

module.exports = { createDirectories };
