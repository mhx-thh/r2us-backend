const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');
const convVie = require('../utils/convVie');
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
  resourceNameTextSearch: {
    type: String,
    select: false,
  },

  resourceLink: {
    type: String,
  },

  resourceDescription: {
    type: String,
    default: '',
  },
  resourceDescriptionTextSearch: {
    type: String,
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
  isShare: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

resourceSchema.index({ resourceNameTextSearch: 'text', resourceDescriptionTextSearch: 'text' });

resourceSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: '_id givenName familyName photo',
  }).populate({
    path: 'classId',
    select: '_id className courseId instructorId academicId slug',
  });
  next();
});

resourceSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

resourceSchema.plugin(idValidator);
resourceSchema.pre('save', async function (next) {
  this.resourceNameTextSearch = convVie(this.resourceName).toLowerCase();
  this.resourceDescriptionTextSearch = convVie(this.resourceDescription).toLowerCase();
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
  // return if not update search
  if (!docUpdate) return next();
  const updateDocs = {};
  if (docUpdate.resourceDescription) {
    updateDocs.resourceDescriptionTextSearch = convVie(docUpdate.resourceDescription).toLowerCase();
  }
  if (docUpdate.resourceName) {
    updateDocs.resourceNameTextSearch = convVie(docUpdate.resourceName).toLowerCase();
  }
  // update
  this.findOneAndUpdate({}, updateDocs);
  return next();
});

const Resources = mongoose.model('Resources', resourceSchema);
module.exports = Resources;
