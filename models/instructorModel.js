const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');
const AppError = require('../utils/appError');
const classModel = require('./classModel');
const reviewModel = require('./reviewModel');

const instructorSchema = new mongoose.Schema({
  instructorName: {
    type: String,
    required: [true, 'Please provide the name'],
  },

  courseId: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Course',
    minlength: 0,
  },

  classId: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Class',
    minlength: 0,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

instructorSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken.',
});

instructorSchema.plugin(idValidator);

instructorSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'courseId',
    select: 'courseName _id',
  });
  next();
});

instructorSchema.pre(/findOneAndUpdate|updateOne|update/, async function (next) {
  const docUpdate = this.getUpdate();
  if (!docUpdate || !docUpdate.instructorName) return next();
  const classExists = await classModel.findById(this.classId).then(
    (courseFound) => {
      if (!courseFound) return next(new AppError('Course not found', StatusCodes.NOT_FOUND));
      return courseFound.toJSON();
    },
  );
  this.findOneAndUpdate({}, { courseId: classExists.courseId, classId: classExists._id });
  return next();
});

instructorSchema.post(
  /findOneAndDelete|findOneAndRemove|deleteOne|remove/,
  { document: true, query: true },
  async (result) => {
    await classModel.deleteMany({ instructorId: result._id });
    await reviewModel.deleteMany({ instructorId: result._id });
  },
);

const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;
