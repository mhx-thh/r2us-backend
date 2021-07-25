const Review = require('../models/reviewModel');
const factory = require('../utils/handlerFactory');

exports.setClassUserIds = (req, res, next) => {
  if (!req.body.class) req.body.class = req.params.classId;
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.instructor) req.body.instructor = req.instructor.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
