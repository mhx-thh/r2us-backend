const Class = require('../models/classModel');
const Resource = require('../models/resourceModel');
const factory = require('../utils/handlerFactory');

exports.getAllClasses = factory.getAll(Class);
exports.getClass = factory.getOne(Class, { path: 'reviews' });
exports.getAllResources = factory.getAll(Resource);
exports.getResource = factory.getOne(Resource);

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
