const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');

const sendEmail = catchAsync(async (options) => {
  // 1 Create a transporter

  // if using gmail smtp
  const smtpOptions = {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(smtpOptions);

  // 2 Define the email options
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: `${options.name} <${options.email}>`,
    subject: options.subject,
    html: options.htmlToSend,
  };

  // 3 Actually send the email
  await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
