const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');
const convVie = require('../utils/convVie');
const reviewModel = require('./reviewModel');

const classSchema = new mongoose.Schema({
  classId: {
    type: String,
    unique: [true, 'A class should have a unique ID'],
    required: [true, 'A class should have an ID'],
    default: '',
  },

  className: {
    type: String,
    required: [true, 'A class should have a name'],
    trim: true,
    default: '',
  },

  description: {
    type: String,
    select: false,
  },

  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'A class must belong to a course'],
    default: '',
  },

  instructors: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Instructor',
    minlength: 1,
    required: [true, 'A class must have at least 1 instructor'],
  },

  schoolYear: {
    type: mongoose.Schema.ObjectId,
    ref: 'Academic',
    required: [true, 'A class must belong to a school-year'],
    default: '',
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5,
    set: (val) => Math.round(val * 10) / 10,
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  nStudents: {
    type: Number,
    default: 0,
  },

  nResource: {
    type: Number,
    default: 0,
  },

  nReviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

classSchema.index = ({ className: 'text' });
classSchema.index = ({ classId: 1, courseId: 1 }, { unique: true });

classSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

classSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'class',
});

classSchema.virtual('students', {
  ref: 'Enroll',
  localField: '_id',
  foreignField: 'classId',
});

classSchema.virtual('resources', {
  ref: 'Resource',
  localField: '_id',
  foreignField: 'classId',
});

classSchema.plugin(idValidator);

classSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'classId studentCardNumber',
  })
    .populate({
      path: 'reviews',
      select: '_id createdAt',
    });
  next();
});

classSchema.pre(/findOneAndUpdate|updateOne|update/, function (next) {
  const docUpdate = this.getUpdate();
  if (!docUpdate || !docUpdate.className) return next();
  this.findOneAndUpdate({}, { description: convVie(docUpdate.className).toLowercase() });
  return next();
});

classSchema.post(
  /findOneAndDelete|findOneAndRemove|deleteOne|remove/,
  { document: true, query: true },
  async (result) => {
    await reviewModel.deleteMany({ review: result._id });
  },
);
const Class = mongoose.model('Class', classSchema);
module.exports = Class;
