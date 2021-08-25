const { StatusCodes } = require('http-status-codes');
const Enroll = require('../models/enrollModel');
const Class = require('../models/classModel');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendResponse = require('../utils/sendResponse');

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

exports.protect = catchAsync(async (req, res, next) => {
  const isEnrolled = await Enroll.findOne(
    { userId: req.user.id, classId: req.params.id },
  );
  if (!isEnrolled) {
    return next(new AppError('You are not enrolled', StatusCodes.UNAUTHORIZED));
  }
  req.userEnroll = isEnrolled;
  return next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (req.user.role === 'admin') return next();
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

exports.advanceToProvider = catchAsync(async (req, res, next) => {
  const enrollment = await Enroll.findById(req.params.id);
  await enrollment.advanceToProvider();
  sendResponse({
    message: 'You are a provider for this class now',
  },
  StatusCodes.OK,
  res);
});

exports.checkPermission = catchAsync(async (req, res, next) => {
  const enrollment = await Enroll.findOne({ id: req.params.id });
  if (enrollment.role === 'member' || enrollment.role === 'provider') return next(new AppError('Already a member of this class', StatusCodes.NOT_MODIFIED));
  return next();
});

exports.checkProvider = catchAsync(async (req, res, next) => {
  const enrollment = await Enroll.findById(req.params.id);
  if (!enrollment) return next(new AppError('You are not enrolled', StatusCodes.UNAUTHORIZED));
  if (enrollment.role === 'provider') return next(new AppError('You are already a provider now', StatusCodes.NOT_MODIFIED));
  return next();
});

exports.getSlug = catchAsync(async (req, res, next) => {
  const slug = await Class.findOne({ slug: req.params.slug }, { select: 'slug' });
  if (!slug) return next(new AppError('Class not found', StatusCodes.NOT_FOUND));
  return next();
});

exports.setIdBySlug = catchAsync(async (req, res, next) => {
  const slug = await Class.findOne({ slug: req.params.slug }, { select: 'id' });
  if (!slug) return next(new AppError('Class not found', StatusCodes.NOT_FOUND));
  req.body.classId = slug;
  return next();
});
