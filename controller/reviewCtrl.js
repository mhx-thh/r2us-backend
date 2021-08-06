const { StatusCodes } = require('http-status-codes');
const Review = require('../models/reviewModel');
const factory = require('../utils/handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');

exports.getNewReviews = (req, res, next) => {
  req.query.limit = 4;
  req.query.sort = '-createdAt, -updateAt';
  next();
};

exports.setClassUserIds = (req, res, next) => {
  if (!req.body.classId) req.body.classId = req.params.id;
  if (!req.body.userId) req.body.userId = req.user.id;
  next();
};

exports.myReview = (req, res, next) => {
  req.query.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.searchByDescription = async function (req, res, next) {
  const searchField = req.query.description;
  const reviewExists = await Review.find({ description: { $regex: searchField, $options: '$i' } });
  const document = reviewExists;
  if (!document) return next(new AppError('No document found', StatusCodes.NOT_FOUND));

  return sendResponse(document, StatusCodes.OK, res);
};

exports.restrictUpdateReviewFields = (req, res, next) => {
  const allowed = ['reviewTitle', 'review'];
  Object.keys(req.body).forEach((element) => {
    if (!allowed.includes(element)) {
      delete req.body[element];
    }
  });
  next();
};

exports.checkReviewOwner = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Review not found', StatusCodes.NOT_FOUND));
  if (req.user.id !== review.userId) {
    return next(
      new AppError('You do not have permission to perform this action',
        StatusCodes.FORBIDDEN),
    );
  }
  return next();
});
