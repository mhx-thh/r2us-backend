// const { StatusCodes } = require('http-status-codes');
// const { StatusCodes } = require('http-status-codes');
const Instructor = require('../models/instructorModel');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
// const sendResponse = require('../utils/sendResponse');
// const Class = require('../models/classModel');
// const AppError = require('../utils/appError');

exports.getAllInstructors = factory.getAll(Instructor);
exports.getInstructor = factory.getOne(Instructor);
exports.createInstructor = factory.createOne(Instructor);
exports.updateInstructor = factory.updateOne(Instructor);
exports.deleteInstructor = factory.deleteOne(Instructor);

exports.updateClass = catchAsync(async (req, res, next) => {
  const instructor = await Instructor.findById(req.body.instructorId);
  await instructor.updateClassAndCourse();
  return next();
});
