require("dotenv").config({ path: ".env" });
const jwt = require("jsonwebtoken");

const Auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    // console.log("----------");
    const decodedToken = await jwt.verify(token, process.env.UNI);
    // console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({ error: "Authenciation Failed" });
  }
};

const localVariables = async (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};

module.exports = { Auth, localVariables };
