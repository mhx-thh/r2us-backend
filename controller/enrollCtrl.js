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

exports.protect = catchAsync(async (req, res, next) => {
  const isEnrolled = await Enroll.findOne(
    { userId: req.body.userId, classId: req.body.classId },
  );
  if (!isEnrolled) {
    return next(new AppError('You are not enrolled', StatusCodes.UNAUTHORIZED));
  }
  req.user = isEnrolled;
  return next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError(
        'You do not have permission to do this action',
        StatusCodes.FORBIDDEN,
      ),
    );
  }
  return next();
};

exports.acceptEnrollment = catchAsync(async (req, res, next) => {
  const enrollment = await Enroll.findById(req.params.id);
  await enrollment.acceptEnrollment();
  sendResponse({
    message: 'Now, you can access this class',
  },
  StatusCodes.OK,
  res);
});

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
  const enrollment = await Enroll.find({ userId: req.body.userId, classId: req.body.classId });
  if (enrollment.role === 'member' || enrollment.role === 'provider') return next(new AppError('You are already a member of this class now', StatusCodes.NOT_MODIFIED));
  return next();
});

exports.checkProvider = catchAsync(async (req, res, next) => {
  const enrollment = await Enroll.findById(req.params.id);
  if (!enrollment) return next(new AppError('You are not enrolled', StatusCodes.UNAUTHORIZED));
  if (enrollment.role === 'unenrolled') return next(new AppError('Your request has not been accepted', StatusCodes.FORBIDDEN));
  if (enrollment.role === 'provider') return next(new AppError('You are already a provider now', StatusCodes.NOT_MODIFIED));
  return next();
});

exports.getSlug = catchAsync(async (req, res, next) => {
  const slug = await Class.find({ slug: req.params.slug }, { select: 'slug' });
  if (!slug) return next(new AppError('Class not found', StatusCodes.NOT_FOUND));
  return next();
});
