const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');
// const { StatusCodes } = require('http-status-codes');
// const AppError = require('../utils/appError');
const convVie = require('../utils/convVie');
// const classModel = require('./classModel');
const enrollModel = require('./enrollModel');

const reviewSchema = new mongoose.Schema({
  reviewType: {
    type: String,
    enum: ['Class', 'Course', 'Instructor'],
    default: 'Class',
  },

  reviewTitle: {
    type: String,
    required: [true, 'A review must have a title'],
    default: 'Review',
  },

  textSearch: {
    type: String,
    select: false,
  },

  slug: String,

  review: {
    type: String,
    unique: true,
    required: [true, 'A review cannot be empty'],
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },

  classId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
  },

}, {
  timestamps: true,
  toObject: { virtuals: true },
});

// One review will be from a user
reviewSchema.index({ textSearch: 'text' });
reviewSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

reviewSchema.plugin(idValidator);
reviewSchema.pre('save', async function (next) {
  this.textSearch = convVie(this.reviewTitle).toLowerCase();
  this.slug = slugify(convVie(this.reviewTitle), { lower: true });
  next();
});

reviewSchema.post('save', async function () {
  // set user is member of class
  const userId = this.userId._id;
  const classId = this.classId._id;
  // Find the document
  const isJoined = await enrollModel.findOne({ userId, classId });
  // if not, create role
  if (!isJoined) {
    await enrollModel.create({
      userId: this.userId._id,
      classId: this.classId._id,
      role: 'member',
    });
  }
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: '_id givenName familyName photo',
  }).populate({
    path: 'classId',
    select: '_id className academicId',
  }).populate({
    path: 'courseId',
    select: '_id courseName facultyId',
  }).populate({
    path: 'instructorId',
    select: '_id instructorName',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
