const nodemailer = require('nodemailer');
const mandrillTransport = require('nodemailer-mandrill-transport');

require('dotenv').config();

let transporter;
function createTransporter() {
  return new Promise((resolve, reject) => {
    transporter = nodemailer.createTransport(
      mandrillTransport({
        auth: {
          apiKey: process.env.MANDRILL_API_KEY
        }
      })
    );
    resolve(transporter);
  });
}

async function send(emailFrom, emailTo, subject, message, attachments) {
  if (typeof transporter === 'undefined') {
    transporter = await createTransporter();
  }

  return new Promise((resolve, reject) => {
    let options = {
      from: emailFrom,
      to: emailTo,
      subject: subject,
      text: message,
      attachments: attachments
    };

    transporter.sendMail(options, (error, info) => {
      if (error) {
        return reject(error);
      }
      return resolve(info);
    });
  });
}

module.exports = {
  send
};
