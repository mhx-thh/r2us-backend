const { StatusCodes } = require('http-status-codes');
const Enroll = require('../models/enrollModel');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllEnrollment = factory.getAll(Enroll);
exports.getEnrollment = factory.getOne(Enroll);
exports.createEnrollment = factory.createOne(Enroll);
exports.updateEnrollment = factory.updateOne(Enroll);
exports.deleteEnrollment = factory.deleteOne(Enroll);

exports.getMe = async function (request, response, next) {
  request.query.userId = request.user.id;
  return next();
};

exports.setUserId = (request, response, next) => {
  request.body.userId = request.user.id;
  next();
};

exports.setMember = (request, response, next) => {
  request.body.role = 'member';
  next();
};

exports.setProvider = (request, response, next) => {
  request.body.role = 'provider';
  next();
};

exports.enrollIdtoClassIdOnReq = catchAsync(async (req, res, next) => {
  const enroll = await Enroll.findById(req.params.id);
  if (!enroll) return next(new AppError('Enroll not found', StatusCodes.NOT_FOUND));
  req.enroll = enroll;
  req.class = { id: enroll.classId._id };
  return next();
});

// checkout is enroll this class
exports.protect = catchAsync(async (req, res, next) => {
  const isEnrolled = await Enroll.findOne(
    { userId: req.user.id, classId: req.class.id },
  );
  if (!isEnrolled) {
    return next(new AppError('You are not enrolled', StatusCodes.UNAUTHORIZED));
  }
  req.userEnroll = isEnrolled;
  return next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.userEnroll.role)) {
    return next(
      new AppError(
        'You do not have permission to do this action',
        StatusCodes.FORBIDDEN,
      ),
    );
  }
  return next();
};

exports.restrictUpdateEnrollFields = (req, res, next) => {
  // update with 'basic' permission
  const allowed = [];
  // 'full' permission
  if (req.editWith === 'full') allowed.push('role');
  Object.keys(req.body).forEach((element) => {
    if (!allowed.includes(element)) {
      delete req.body[element];
    }
  });
  next();
};

exports.canEditAndDeleteEnroll = catchAsync(async (req, res, next) => {
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
