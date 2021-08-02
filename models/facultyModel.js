const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const courseModel = require('./courseModel');

const facultySchema = new mongoose.Schema({
  facultyName: {
    type: String,
    required: [true, 'Please provide the name'],
    default: '',
  },

  facultyDescription: String,
});

facultySchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

facultySchema.post(
  /findOneAndDelete|findOneAndRemove|deleteOne|remove/,
  { document: true, query: true },
  async (result) => {
    await courseModel.deleteMany({ facultyId: result._id });
  },
);

const Faculty = mongoose.model('Faculty', facultySchema);
module.exports = Faculty;
