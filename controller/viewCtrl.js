const Class = require('../models/classModel');
const Enroll = require('../models/enrollModel');
const catchAsync = require('../models/userModel');
const AppError = require('../utils/appError');

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

exports.getOverview = catchAsync(async (req, res, next) => {
  const classes = await Class.find();
  res.status(200).render('overview', {
    title: 'All classes',
    classes,
  });
});

// eslint-disable-next-line consistent-return
exports.getClasses = catchAsync(async (req, res, next) => {
  const classes = await Class.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review reviewRating userId',
  });

  if (!classes) {
    return next(new AppError('There is no class with that name', 404));
  }

  res.status(200).render('classes', {
    title: `Class: ${classes.className}`,
    classes,
  });
});

exports.getMyClasses = catchAsync(async (req, res, next) => {
  const enrollment = await Enroll.find({ userId: req.user._id });
  const classIds = enrollment.map((el) => el.classId);
  const classes = await Class.find({ classId: { $in: classIds } });
  res.status(200).render('overview', {
    title: 'My classes',
    classes,
  });
});
