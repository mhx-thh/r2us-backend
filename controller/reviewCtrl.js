const { StatusCodes } = require('http-status-codes');
const Review = require('../models/reviewModel');
const factory = require('../utils/handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.getReviewBySlug = factory.getOne(Review, { query: 'slug' });
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.getNewReviews = (req, res, next) => {
  req.query.__limit = '4';
  req.query.__sort = '-createdAt, -updateAt';
  next();
};

exports.myReview = (req, res, next) => {
  req.query.userId = req.user.id;
  next();
};

// make user create to body form
exports.setUserCreateReview = (request, response, next) => {
  request.body.userId = request.user.id;
  return next();
};

// can delete = can edit
exports.canEditAndDelete = (req, res, next) => {
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
};

// check fields can edit with many permission
exports.restrictUpdateReviewFields = (req, res, next) => {
  // update with 'basic' permission
  const allowed = ['reviewTitle', 'review', 'reviewType'];
  // 'full' permission
  if (req.editWith === 'full') allowed.push('status');
  Object.keys(req.body).forEach((element) => {
    if (!allowed.includes(element)) {
      delete req.body[element];
    }
  });
  next();
};

// convert review Id on url to Class Id on Request
exports.reviewIdtoClassIdOnReq = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Review not found', StatusCodes.NOT_FOUND));
  req.review = review;
  req.class = { id: review.classId._id };
  return next();
});
