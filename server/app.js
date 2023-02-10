const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connect = require("./database/connection.js");
const router = require("./router/route")

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); 

app.use("/api", router);

connect().then(() => {
  try {
    app.listen(5000, () => {
      console.log(`Server connected to http://localhost:${5000}`);
    });
  } catch (error) {
    console.log("502 Bad Gateway");
  }
}).catch((error) => {
    console.log("Connection to Database failed!")
})
