require("dotenv").config({ path: ".env" });

const { mongoose } = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

async function connect() {
  const mongod = await MongoMemoryServer.create();
  const getUri = mongod.getUri();

  mongoose.set("strictQuery", true);

  return mongoose
    .connect(process.env.connectionString)
    .then(() => console.log("Connected to DB"));
}

module.exports = connect;
