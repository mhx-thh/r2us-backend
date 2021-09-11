const mongoose = require('mongoose');
// const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');
const convVie = require('../utils/convVie');
const classModel = require('./classModel');
const instructorModel = require('./instructorModel');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, 'A course should have a name'],
    trim: true,
    minlength: 10,
    maxlength: 60,
  },

  facultyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Faculty',
    required: [true, 'A class should relate to a faculty'],
  },

  courseDescription: {
    type: String,
    select: false,
  },
}, {
  toObject: { virtuals: true },
});

courseSchema.index({ courseDescription: 'text' });
// courseSchema.index = ({ slug: 1 });

courseSchema.pre('save', function (next) {
  this.courseDescription = convVie(this.courseName);
  // this.slug = slugify(this.courseDescription, { lower: true });
  next();
});

courseSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

courseSchema.plugin(idValidator);
courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'facultyId',
    select: 'facultyName _id',
  });
  next();
});

courseSchema.pre(/findOneAndUpdate|updateOne|update/, function (next) {
  const docUpdate = this.getUpdate();
  if (!docUpdate || !docUpdate.courseName) return next();
  this.findOneAndUpdate({}, { courseDescription: convVie(docUpdate.courseName).toLowercase() });
  return next();
});

courseSchema.post(
  /findOneAndDelete|findOneAndRemove|deleteOne|remove/,
  { document: true, query: true },
  async (result) => {
    await classModel.deleteMany({ courseId: result._id });
    await instructorModel.updateMany({}, { $pull: { courseId: result._id } });
  },
);
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
