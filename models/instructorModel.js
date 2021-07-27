const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  instructorId: {
    type: String,
    required: [true, 'An instructor should have an ID'],
    unique: [true, 'A unique ID is required'],
  },

  instructorName: {
    type: String,
    required: [true, 'Please provide the name'],
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
  localField: 'instructorId',
  foreignField: 'instructors',
});

const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;
