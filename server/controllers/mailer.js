require("dotenv").config({ path: ".env" });
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;
  let email = {
    body: {
      name: username,
      intro:
        text ||
        "Welcome to Daily Tuition! We're very excited to have you on board.",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  let emailBody = MailGenerator.generate(email);

  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: emailBody,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "You should receive an email from us." });
    })
    .catch((error) => res.status(500).send({ error }));
};

module.exports = { registerMail };
