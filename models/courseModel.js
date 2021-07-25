const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    unique: true,
    required: [true, 'A course should have a unique ID'],
    default: '',
  },

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
    default: '',
  },

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

courseSchema.index({ slug: 1 });

courseSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
