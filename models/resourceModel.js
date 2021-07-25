const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const resourceSchema = new mongoose.Schema({
  resourceId: {
    type: String,
    unique: [true, 'This file must have a unique ID'],
    required: [true, 'This file should have an ID'],
    default: '',
  },

  resourceType: {
    type: String,
    enum: ['Resources', 'Examination Paper'],
    default: 'Resources',
  },

  resourceDescription: {
    type: String,
    default: '',
  },

  classId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: [true, 'This file must belong to a class'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

resourceSchema.index({ resourceDescription: 'text' });

resourceSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

const Resources = mongoose.model('Resources', resourceSchema);
module.exports = Resources;
