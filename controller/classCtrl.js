const { StatusCodes } = require('http-status-codes');
const Classes = require('../models/classModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/handlerFactory');
const { queryToMongo } = require('../utils/queryToMongo');

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

exports.convertQueryToClassId = catchAsync(async (req, res, next) => {
  const allowed = new RegExp('(courseId|instructorId|academicId)', 'g');
  const queryClass = {};
  Object.keys(req.query).forEach((element) => {
    // have classId query
    if (element.indexOf('classId') !== -1) next();
    // import query
    if (element.search(allowed) === 0) {
      queryClass[element] = req.query[element];
    }
  });
  if (Object.keys(queryClass).length < 1) return next();
  const { filter } = queryToMongo({})(queryClass);
  const classIds = await Classes.find(filter).distinct('_id');
  req.query.classId__in = classIds.join();
  Object.keys(req.query).forEach((element) => {
    if (element.search(allowed) === 0) {
      delete req.query[element];
    }
  });
  return next();
});

exports.setUserCreateClass = (request, response, next) => {
  request.body.createBy = request.user.id;
  return next();
};

exports.setClassId = (request, response, next) => {
  request.class = { id: request.param.id };
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

exports.canEditAndDeleteClass = catchAsync(async (req, res, next) => {
  req.editWith = 'full';
  if (req.user.role === 'admin') return next();
  if (req.userEnroll.role === 'provider') return next();
  req.editWith = 'basic';
  if (req.review.userId === req.user.id) return next();
  return next(
    new AppError(
      'You do not have permission to perform this action.',
      StatusCodes.FORBIDDEN,
    ),
  );
});
