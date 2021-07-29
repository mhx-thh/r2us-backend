const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');
const convVie = require('../utils/convVie');
const reviewModel = require('./reviewModel');

const classSchema = new mongoose.Schema({
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

  slug: String,

  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'A class must belong to a course'],
    default: '',
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
}, {
  timestamps: true,
  toObject: { virtuals: true },
});

classSchema.index = ({ description: 'text' });
classSchema.index = ({ __id: 1, courseId: 1 }, { unique: true });
classSchema.index = ({ __id: 1, instructorId: 1 });
classSchema.index = ({ __id: 1, academicId: 1 });
classSchema.index = ({ slug: 1 });

classSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

classSchema.plugin(idValidator);

classSchema.pre('save', function (next) {
  this.description = convVie(this.className);
  this.slug = slugify(this.description, { lower: true });
  next();
});

classSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'studentCardNumber',
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
