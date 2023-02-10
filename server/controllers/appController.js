require("dotenv").config({ path: ".env" });
const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;
    // console.log(username)

    const checkUsername = await UserModel.findOne({ username });
    if (!checkUsername) {
      return res.status(404).send({ error: "Incorrect Credentials!" });
    }
    next();
  } catch (err) {
    return res.status(404).send({ error: "Incorrect Credentials!" });
  }
};

const Register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const checkUsername = new Promise((res, rej) => {
      UserModel.findOne({ username }, (err, user) => {
        if (err) rej(new Error(err));
        else if (user) rej({ err: "Username already registered!" });
        res();
      });
    });

    const checkEmail = new Promise((res, rej) => {
      UserModel.findOne({ email }, (err, email) => {
        if (err) rej(new Error(err));
        else if (email) rej({ err: "Email already registered!" });
        res();
      });
    });

    Promise.all([checkEmail, checkUsername])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                email,
              });

              // return save result as a response
              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "User Register Successfully" })
                )
                .catch((error) => res.status(500).send({ error }));
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Unable to hash password",
              });
            })
            .catch((err) => {
              res.status(500).send({ err: "Password hashing not done!" });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error, err: "Promise Error" });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passCheck) => {
            if (!passCheck) {
              return res.status(400).send({ error: "Incorrect Credentials!" });
            }

            const token = jwt.sign(
              {
                userID: user._id,
                username: user.username,
              },
              process.env.UNI,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              message: "Login Success!",
              username: username,
              token,
            });
          })
          .catch((err) => {
            return res.status(400).send({ error: "Incorrect Credentials!" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Incorrect Credentials!" });
      });
  } catch (err) {
    return res.status(500).send({ error });
  }
};

const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    if (!username) {
      return res.status(501).send({ error: "Incorrect Credentials!" });
    }

    UserModel.findOne({ username }, (err, user) => {
      if (err) {
        return res.status(500).send({ err });
      }

      if (!user) {
        return res.status(501).send({ error: "Incorrect Credentials!" });
      }

      const { _id, username, email } = user;

      res.status(200).send({ _id, username, email });
    });
  } catch (err) {}
};

const updateUser = async (req, res) => {
  try {
    const { userID } = req.user;

    if (userID) {
      UserModel.updateOne({ _id: userID }, req.body, (err, data) => {
        if (err) {
          throw err;
        }

        return res.status(201).send({ message: "Updation Successful" });
      });
    } else {
      return res.status(401).send({ error: "Incorrect Credentials!" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
};

const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
};

const verifyOTP = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ message: "Verification Successful" });
  }

  return res.status(400).send({ error: "Invalid OTP" });
};

const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
};

const resetPassword = async (req, res) => {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: "Session expired!" });
    }

    const { username, password } = req.body;

    try {
      UserModel.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPass) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPass },
                (err, data) => {
                  if (err) {
                    throw err;
                  }

                  req.app.locals.resetSession = false;
                  return res
                    .status(201)
                    .send({ message: "Details are updated!" });
                }
              );
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        })
        .catch((error) => {
          return res.status(404).send({ error: "Incorrect Credentials!" });
        });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
};

module.exports = {
  verifyUser,
  Register,
  Login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
};
