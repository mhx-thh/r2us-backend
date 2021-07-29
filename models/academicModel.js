const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const academicSchema = new mongoose.Schema({
  schoolyear: {
    type: String,
    default: '',
    required: [true, 'Please provide the school-year'],
  },

  semester: {
    type: Number,
    enum: [1, 2, 3],
    required: [true, 'Please provide the semester'],
  },
});

academicSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

const Academic = mongoose.model('Academic', academicSchema);
module.exports = Academic;
