const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  instructorName: {
    type: String,
    required: [true, 'Please provide the name'],
  },

  courseId: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Course',
    minlength: 1,
  },

  classId: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Class',
    minlength: 1,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;
