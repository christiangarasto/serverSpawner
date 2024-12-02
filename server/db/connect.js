const mongoose = require("mongoose");

const connectDB = async (url) => {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(url, {});

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from DB");
    });

    console.log("Database connection established");
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
