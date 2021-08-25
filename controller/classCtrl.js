const { StatusCodes } = require('http-status-codes');
const Classes = require('../models/classModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const factory = require('../utils/handlerFactory');
const queryToMongo = require('../utils/queryToMongo')({});

exports.getAllClasses = factory.getAll(Classes);
exports.getClassBySlug = factory.getOne(Classes, { query: 'slug' });
exports.createClass = factory.createOne(Classes);
exports.updateClass = factory.updateOne(Classes);
exports.deleteClass = factory.deleteOne(Classes);

exports.getNewClasses = (req, res, next) => {
  req.query.__limit = '4';
  req.query.__sort = '-createdAt, -updatedAt';
  next();
};

exports.searchByDescription = async function (req, res, next) {
  const searchField = req.query.description;
  const classExists = await Classes.find({ description: { $regex: searchField, $options: '$i' } }).exec();
  const document = classExists;
  if (!document) return next(new AppError('No document found', StatusCodes.NOT_FOUND));

  return sendResponse(document, StatusCodes.OK, res);
};

exports.setUserCreateClass = (request, response, next) => {
  request.body.createBy = request.user.id;
  return next();
};

exports.restrictUpdateClassFields = (req, res, next) => {
  const allowed = ['className', 'description'];
  Object.keys(req.body).forEach((element) => {
    if (!allowed.includes(element)) {
      delete req.body[element];
    }
  });
  next();
};

exports.convertQueryToClassId = catchAsync(async (req, res, next) => {
  const allowed = new RegExp('(courseId|instructorId|academicId)', 'g');
  const queryClass = {};
  Object.keys(req.query).forEach((element) => {
    if (element.search(allowed) === 0) {
      queryClass[element] = req.query[element];
    }
  });
  const { filter } = queryToMongo(queryClass);
  const classIds = await Classes.find(filter).distinct('_id');
  req.query.classId__in = classIds.join();
  Object.keys(req.query).forEach((element) => {
    if (element.search(allowed) === 0) {
      delete req.query[element];
    }
  });
  next();
});
