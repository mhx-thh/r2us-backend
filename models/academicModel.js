const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const classModel = require('./classModel');

const academicSchema = new mongoose.Schema({
  schoolyear: {
    type: String,
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

academicSchema.post(
  /findOneAndDelete|findOneAndRemove|deleteOne|remove/,
  { document: true, query: true },
  async (result) => {
    await classModel.deleteMany({ academicId: result._id });
  },
);

const Academic = mongoose.model('Academic', academicSchema);
module.exports = Academic;
