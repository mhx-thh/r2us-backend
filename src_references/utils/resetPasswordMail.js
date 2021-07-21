const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

exports.resetPasswordMail = function (resetURL) {
  const filePath = path.join(__dirname, './password-reset.html');

  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    linkresetpassword: resetURL,
  };
  const htmlToSend = template(replacements);
  return htmlToSend;
};
