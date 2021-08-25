const { StatusCodes } = require('http-status-codes');
const Review = require('../models/reviewModel');
const factory = require('../utils/handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getNewReviews = (req, res, next) => {
  req.query.__limit = '4';
  req.query.__sort = '-createdAt, -updateAt';
  next();
};

exports.myReview = (req, res, next) => {
  req.query.userId = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.getReviewBySlug = factory.getOne(Review, { query: 'slug' });
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.restrictUpdateReviewFields = (req, res, next) => {
  const allowed = ['reviewTitle', 'review', 'reviewType'];
  Object.keys(req.body).forEach((element) => {
    if (!allowed.includes(element)) {
      delete req.body[element];
    }
  });
  next();
};

exports.reviewToClass = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Review not found', StatusCodes.NOT_FOUND));
  req.class = review.classId;
  return next();
});

exports.checkOwner = catchAsync(async (req, res, next) => {
  if (req.user.role === 'admin') return next();
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Review not found', StatusCodes.NOT_FOUND));
  if (review.userId !== req.user.id) {
    return next(
      new AppError(
        'You do not have permission to perform this action.',
        StatusCodes.FORBIDDEN,
      ),
    );
  }
  return next();
});

exports.setUserCreateReview = (request, response, next) => {
  request.body.userId = request.user.id;
  return next();
};
