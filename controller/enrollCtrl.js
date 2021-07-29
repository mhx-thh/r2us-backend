const { StatusCodes } = require('http-status-codes');
const Enroll = require('../models/enrollModel');
const Class = require('../models/classModel');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllEnrollment = factory.getAll(Enroll);
exports.getEnrollment = factory.getOne(Enroll);
exports.createEnrollment = factory.createOne(Enroll);
exports.updateEnrollment = factory.updateOne(Enroll);
exports.deleteEnrollment = factory.deleteOne(Enroll);

exports.protect = catchAsync(async (req, res, next) => {
  const exists = await Class.findById(req.params.__id);
  if (!exists) {
    return next(new AppError('Class not found', StatusCodes.NOT_FOUND));
  }
  return next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.params.role)) {
    return next(
      new AppError(
        'You do not have permission to do this action',
        StatusCodes.FORBIDDEN,
      ),
    );
  }
  return next();
};
