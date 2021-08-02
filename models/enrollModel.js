const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/appError');

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

  role: {
    type: String,
    enum: ['unenrolled', 'member', 'provider'],
    default: 'unenrolled',
  },
}, {
  timestamp: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

classRoleSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

classRoleSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: '_id studentCardNumber givenName familyName email dateOfBirth photo',
  }).populate({
    path: 'classId',
    select: '_id className courseId instructorId academicId',
  });
  next();
});

classRoleSchema.methods.acceptEnrollment = async function () {
  const classEnroll = await this.model('Class').findById(this.classId);
  if (!classEnroll) throw new AppError('There is no class with this id', StatusCodes.NOT_FOUND);
  const userEnroll = await this.model('User').findById(this.userId);
  if (!userEnroll) throw new AppError('There is no user with this id', StatusCodes.NOT_FOUND);
  await this.updateOne({ role: 'member' });
};

classRoleSchema.methods.advanceToProvider = async function () {
  const classEnroll = await this.model('Class').findById(this.classId);
  if (!classEnroll) throw new AppError('There is no class with this id', StatusCodes.NOT_FOUND);
  const userEnroll = await this.model('User').findById(this.userId);
  if (!userEnroll) throw new AppError('There is no user with this id', StatusCodes.NOT_FOUND);

  if (this.role === 'member') await this.updateOne({ role: 'provider' });
  else if (this.role === 'unenrolled') throw new AppError('You do not have permission to perform this action', StatusCodes.FORBIDDEN);
};
const ClassRole = mongoose.model('ClassRole', classRoleSchema);
module.exports = ClassRole;
