const mongoose = require("mongoose");

const mongoURL = "mongodb://localhost:27017/livetest"

mongoose.connect(mongoURL);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongo DB Connection Successfull");
});

connection.on("error", () => {
  console.log("Mongo DB Connection failed");
});

module.exports = mongoose;