const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');
const convVie = require('../utils/convVie');

const reviewSchema = new mongoose.Schema({
  reviewTitle: {
    type: String,
    required: [true, 'A review must have a title'],
    default: 'Review',
  },

  description: String,

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
reviewSchema.index({ _id: 1, userId: 1 });
reviewSchema.index({ description: 'text' });
reviewSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

reviewSchema.plugin(idValidator);
reviewSchema.pre('save', async function (next) {
  this.description = slugify(convVie(this.reviewTitle), { lower: true });
  next();
});
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: '_id studentCardNumber photo',
  }).populate({
    path: 'classId',
    select: '_id className academicId',
  }).populate({
    path: 'instructorId',
    select: '_id instructorName',
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
