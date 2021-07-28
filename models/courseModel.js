const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');
const convVie = require('../utils/convVie');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, 'A course should have a name'],
    unique: true,
    trim: true,
    minlength: 10,
    maxlength: 60,
    default: '',
  },

  slug: String,

  facultyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Faculty',
    required: [true, 'A class should relate to a faculty'],
  },

  courseDescription: {
    type: String,
    select: false,
  },

  nClasses: {
    type: Number,
    default: 0,
  },

}, {
  toObject: { virtuals: true },
});

courseSchema.index = ({ description: 'text' });
courseSchema.index = ({ courseId: 1, facultyId: 1 });
courseSchema.index = ({ slug: 1 });

courseSchema.virtual('classes', {
  ref: 'Class',
  localField: '_id',
  foreignField: '_id',
});

courseSchema.pre('save', function (next) {
  this.description = convVie(this.className);
  this.slug = slugify(this.description, { lower: true });
  next();
});

courseSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

courseSchema.plugin(idValidator);
courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'class',
    select: 'className courseName schoolyear instructors',
  });
  next();
});

courseSchema.pre(/findOneAndUpdate|updateOne|update/, function (next) {
  const docUpdate = this.getUpdate();
  if (!docUpdate || !docUpdate.courseName) return next();
  this.findOneAndUpdate({}, { description: convVie(docUpdate.courseName).toLowercase() });
  return next();
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
