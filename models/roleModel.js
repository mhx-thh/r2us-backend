const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const roleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  nCourses: {
    type: Number,
    default: 0,
  },
});

roleSchema.virtual('classes', {
  ref: 'Enroll',
  localField: 'userId',
  foreignField: 'userId',
});

roleSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
