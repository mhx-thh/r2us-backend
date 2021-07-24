const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const facultySchema = new mongoose.Schema({
  facultyId: {
    type: String,
    unique: true,
    required: [true, 'There should be an ID for this faculty'],
    default: '',
  },

  facultyName: {
    type: String,
    required: [true, 'Please provide the name'],
    default: '',
  },
});

facultySchema.index = ({ facultyName: 'text' });

facultySchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

const Faculty = mongoose.model('Faculty', facultySchema);
module.exports = Faculty;
