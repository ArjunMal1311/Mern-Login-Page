const { Router } = require("express");
const router = Router();
const { Auth, localVariables } = require("../middleware/auth");
const { registerMail } = require("../controllers/mailer");

const {
  verifyUser,
  Register,
  Login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
} = require("../controllers/appController");

// POST Methods
router.route("/register").post(Register); 
router.route("/registerMail").post(registerMail); 
router.route("/authenciate").post(verifyUser, (req, res) => res.end()); 
router.route("/login").post(verifyUser, Login); 

// GET Methods
router.route("/user/:username").get(getUser); 
router.route("/generateOTP").get(verifyUser, localVariables, generateOTP); 
router.route("/verifyOTP").get(verifyUser, verifyOTP); 
router.route("/createResetSession").get(createResetSession); 

// PUT Methods
router.route("/updateuser").put(Auth, updateUser); 
router.route("/resetPassword").put(verifyUser, resetPassword); 

module.exports = router;
