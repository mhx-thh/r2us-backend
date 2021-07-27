const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  instructorName: {
    type: String,
    required: [true, 'Please provide the name'],
  },

  nCourses: {
    type: Number,
    default: 0,
  },

  nClasses: {
    type: Number,
    default: 0,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

instructorSchema.virtual('classes', {
  ref: 'Class',
  localField: '__id',
  foreignField: 'instructorId',
});

const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;
