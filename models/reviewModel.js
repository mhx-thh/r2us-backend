const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const uniqueValidator = require('mongoose-unique-validator');
const Course = require('./courseModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    unique: true,
    required: [true, 'A review cannot be empty'],
    default: '',
  },

  reviewRating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'A review should have a rating'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },

  class: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: [true, 'A review must belong to a class'],
  },

  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Instructor',
    required: [true, 'A review must belong to a instructor'],
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// One user can review only a class
reviewSchema.index({ class: 1, user: 1 });
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'User',
    select: '_id studentCardNumber photo',
  });

  next();
});

reviewSchema.plugin(idValidator);

reviewSchema.statics.calcAverageRatings = async function (classId) {
  const stats = await this.aggregate([
    {
      $match: { course: classId },
    },
    {
      $group: {
        _id: '$class',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(classId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Course.findByIdAndUpdate(classId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.class);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.class);
});

reviewSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
