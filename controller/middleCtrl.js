const convVie = require('../utils/convVie');

// eslint-disable-next-line no-unused-vars
exports.convVieSearch = (req, _, next) => {
  Object.keys(req.query).forEach((element) => {
    if (element.indexOf('__search') !== -1) {
      req.query[element] = convVie(req.query[element]).toLowerCase();
    }
  });
  next();
};
