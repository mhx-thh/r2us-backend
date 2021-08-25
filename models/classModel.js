const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/appError');
const convVie = require('../utils/convVie');
const reviewModel = require('./reviewModel');
const resourceModel = require('./resourceModel');
const enrollModel = require('./enrollModel');
const instructorModel = require('./instructorModel');

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, 'A class should have a name'],
    unique: true,
    trim: true,
    default: '',
  },
  classNameTextSearch: {
    type: String,
    select: false,
  },

  description: {
    type: String,
  },
  descriptionTextSearch: {
    type: String,
    select: false,
  },

  slug: {
    type: String,
    unique: [true, 'A class should have a slug unique'],
  },

  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'A class must belong to a course'],
  },

  instructorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Instructor',
    required: [true, 'A class must have at least 1 instructor'],
  },

  academicId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Academic',
    required: [true, 'A class must belong to a school-year'],
  },

  nStudents: {
    type: Number,
    default: 0,
  },
  createBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toObject: { virtuals: true },
});

classSchema.index({
  courseId: 1,
  instructorId: 1,
  academicId: 1,
}, { unique: true });
classSchema.index({ slug: 1 });
classSchema.index({ classNameTextSearch: 'text', descriptionTextSearch: 'text' });

classSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

classSchema.plugin(idValidator);

classSchema.pre('save', async function (next) {
  // check intructor is master of course
  const instructor = await instructorModel.findById(this.instructorId);
  if (!instructor.courseId.includes(this.courseId)) {
    return next(new AppError('Intructor is not master of course', StatusCodes.BAD_REQUEST));
  }
  // make it bester
  this.descriptionTextSearch = convVie(this.description).toLowerCase();
  this.classNameTextSearch = convVie(this.className).toLowerCase();
  this.slug = slugify(convVie(this.className), { lower: true });
  this.nStudents = 1;
  return next();
});

classSchema.post('save', async function () {
  // add class to intructor
  const instructor = await instructorModel.findById(this.instructorId);
  await instructor.updateOne({
    $addToSet: {
      // courseId: this.courseId,
      classId: this._id,
    },
  });
  // set user is provider of class
  await enrollModel.create({
    userId: this.createBy._id,
    classId: this._id,
    role: 'provider',
  });
});

classSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'courseId',
    select: 'courseName _id',
  }).populate({
    path: 'academicId',
    select: 'schoolyear semester',
  }).populate({
    path: 'instructorId',
    select: 'instructorName _id',
  });
  next();
});

classSchema.pre(/findOneAndUpdate|updateOne|update/, async function (next) {
  const docUpdate = this.getUpdate();
  if (!docUpdate) return next();
  const updateDocs = {};
  if (docUpdate.className) {
    updateDocs.classNameTextSearch = convVie(docUpdate.className).toLowerCase();
  }
  if (docUpdate.description) {
    updateDocs.descriptionTextSearch = convVie(docUpdate.description).toLowerCase();
  }
  // update
  this.findOneAndUpdate({}, updateDocs);
  return next();
});

classSchema.post(
  /findOneAndDelete|findOneAndRemove|deleteOne|remove/,
  { document: true, query: true },
  async (result) => {
    await reviewModel.deleteMany({ classId: result._id });
    await resourceModel.deleteMany({ classId: result._id });
    await enrollModel.deleteMany({ classId: result._id });
    await instructorModel.updateMany({}, { $pull: { classId: result._id } });
  },
);
const Class = mongoose.model('Class', classSchema);
module.exports = Class;
