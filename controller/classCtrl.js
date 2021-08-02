const { StatusCodes } = require('http-status-codes');
const Class = require('../models/classModel');
const AppError = require('../utils/appError');
const sendResponse = require('../utils/sendResponse');
const factory = require('../utils/handlerFactory');

exports.getAllClasses = factory.getAll(Class);
exports.getClassBySlug = factory.getOne(Class, { query: 'slug' });
exports.createClass = factory.createOne(Class);
exports.updateClass = factory.updateOne(Class);
exports.deleteClass = factory.deleteOne(Class);

exports.getNewClasses = (req, res, next) => {
  req.query.__limit = 5;
  req.query.__sort = '-createdAt';
  next();
};

exports.checkExistence = async function (req, res, next) {
  await Class.find({ className: req.body.className }).then(
    (classFound) => {
      if (classFound) return next(new AppError('Class exists', StatusCodes.SEE_OTHER));
      return next();
    },
  );
};

exports.searchByDescription = async function (req, res, next) {
  const searchField = req.query.description;
  const classExists = await Class.find({ description: { $regex: searchField, $options: '$i' } });
  const document = classExists;
  if (!document) return next(new AppError('No document found', StatusCodes.NOT_FOUND));

  return sendResponse(document, StatusCodes.OK, res);
};
