const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const facultySchema = new mongoose.Schema({
  facultyName: {
    type: String,
    required: [true, 'Please provide the name'],
    default: '',
  },

  facultyDescription: String,
});

facultySchema.index = ({ facultyName: 'text' });

facultySchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

const Faculty = mongoose.model('Faculty', facultySchema);
module.exports = Faculty;
