const { StatusCodes } = require('http-status-codes');
const Course = require('../models/courseModel');
const factory = require('../utils/handlerFactory');
const AppError = require('../utils/appError');

exports.getAllCourses = factory.getAll(Course);
exports.getCourseBySlug = factory.getOne(Course, { query: 'slug' });
exports.getCourse = factory.getOne(Course);
exports.createCourse = factory.createOne(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);

exports.checkValidation = async function (req, res, next) {
  const courseExists = await Course.find(
    {
      courseName: req.body.courseName,
      facultyId: req.body.facultyId,
    },
  );
  if (courseExists) return next(new AppError('Course already exists', StatusCodes.NOT_ACCEPTABLE));
  return next();
};
