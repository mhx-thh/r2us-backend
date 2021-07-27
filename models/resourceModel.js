const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');
const { StatusCodes } = require('http-status-codes');
const convVie = require('../utils/convVie');
const AppError = require('../utils/appError');

const resourceSchema = new mongoose.Schema({
  resourceId: {
    type: String,
    unique: [true, 'This file must have a unique ID'],
    required: [true, 'This file should have an ID'],
    default: '',
  },

  resourceType: {
    type: String,
    enum: ['Resources', 'Examination Paper', 'Review Paper'],
    default: 'Resources',
  },

  resourceName: {
    type: String,
    trim: true,
    minlength: [10, 'This resource should have a name with 10chars or more'],
    required: [true, 'Resource should have a name'],
  },

  resourceLink: {
    type: String,
    default: '',
  },

  resourceDescription: {
    type: String,
    default: '',
    select: false,
  },

  classId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: [true, 'This file must belong to a class'],
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'This file must belong to a user'],
  },

  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending',
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

resourceSchema.plugin(idValidator);
resourceSchema.pre('save', async function (next) {
  this.resourceDescription = convVie(this.resourceName).toLowerCase();
});

resourceSchema.pre(/findOneAndUpdate|updateOne|update/, function (next) {
  const docUpdate = this.getUpdate();
  if (!docUpdate || docUpdate.resourceName) return next();
  this.findOneAndUpdate({}, { resourceDescription: convVie(docUpdate.resourceName).toLowerCase() });
  return next();
});

resourceSchema.methods.acceptResource = async function () {
  const resourceIn = await this.model('Class').findOne({ resource: this.resourceId });
  if (!resourceIn) throw new AppError('This class do not have any resource', StatusCodes.NOT_FOUND);
};

resourceSchema.methods.rejectResource = async function () {
  const resourceIn = await this.model('Class').findOne({ resource: this.resourceId });
  if (!resourceIn) throw new AppError('This class do not have any resource', StatusCodes.NOT_FOUND);
};

const Resources = mongoose.model('Resources', resourceSchema);
module.exports = Resources;
