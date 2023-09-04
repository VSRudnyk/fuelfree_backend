const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendSgEmail = async (data) => {
  const email = { ...data, from: 'ivan.roschin86@gmail.com' };
  await sgMail.send(email);
};

module.exports = { sendSgEmail };
