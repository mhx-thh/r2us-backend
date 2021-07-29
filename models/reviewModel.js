const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    unique: true,
    required: [true, 'A review cannot be empty'],
    default: '',
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },

  classId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: [true, 'A review must belong to a class'],
  },

  instructorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Instructor',
    required: [true, 'A review must belong to a instructor'],
  },
}, {
  timestamps: true,
  toObject: { virtuals: true },
});

// One review will be from a user
reviewSchema.index({ _id: 1, user: 1 });
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'User',
    select: '_id studentCardNumber photo',
  });

  next();
});

reviewSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
