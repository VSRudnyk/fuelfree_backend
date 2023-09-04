const nodemailer = require("nodemailer");
const { MAIL_PASSWORD, EMAIL } = process.env;

const nodemailConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: MAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailConfig);
const sendEmail = async (data) => {
  const email = { ...data, from: "fuelfree@ukr.net" };
  await transporter.sendMail(email);
};

module.exports = { sendEmail };
