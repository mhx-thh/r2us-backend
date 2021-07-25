const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const classRoleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: [true, 'Please provide the userID'],
  },

  classId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: [true, 'Please provide the class ID'],
  },

  roleId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Role',
    required: [true, 'Each user must have a role'],
  },
}, {
  timestamp: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

classRoleSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

const ClassRole = mongoose.model('ClassRole', classRoleSchema);
module.exports = ClassRole;
