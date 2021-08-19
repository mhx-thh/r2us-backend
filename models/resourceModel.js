const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');
// const { StatusCodes } = require('http-status-codes');
const convVie = require('../utils/convVie');
// const AppError = require('../utils/appError');
const enrollModel = require('./enrollModel');

const resourceSchema = new mongoose.Schema({
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
    unique: true,
    default: '',
  },

  resourceDescription: {
    type: String,
    default: '',
  },

  textSearch: {
    type: String,
    select: false,
  },

  slug: String,

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
  isShare: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

resourceSchema.index({ textSearch: 'text' });

resourceSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: '_id givenName familyName photo',
  }).populate({
    path: 'classId',
    select: '_id className academicId',
  });
  next();
});

resourceSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

resourceSchema.plugin(idValidator);
resourceSchema.pre('save', async function (next) {
  this.textSearch = convVie(this.resourceName).toLowerCase();
  this.slug = slugify(this.textSearch, { lower: true });
  next();
});

resourceSchema.post('save', async function () {
  // set user is member of class
  const userId = this.userId._id;
  const classId = this.classId._id;
  // Find the document
  const isJoined = await enrollModel.findOne({ userId, classId });
  // if not, create role
  if (!isJoined) {
    await enrollModel.create({
      userId: this.userId._id,
      classId: this.classId._id,
      role: 'member',
    });
  }
});

resourceSchema.pre(/findOneAndUpdate|updateOne|update/, function (next) {
  const docUpdate = this.getUpdate();
  if (!docUpdate || !docUpdate.resourceName) return next();
  this.findOneAndUpdate({}, { textSearch: convVie(docUpdate.resourceName).toLowerCase() });
  return next();
});

const Resources = mongoose.model('Resources', resourceSchema);
module.exports = Resources;
