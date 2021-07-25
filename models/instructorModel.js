const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  instructorName: {
    type: String,
    required: [true, 'Please provide the name'],
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

instructorSchema.index({ instructorName: 'text' });

const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;
