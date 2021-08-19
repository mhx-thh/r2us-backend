// const { StatusCodes } = require('http-status-codes');
const Course = require('../models/courseModel');
const factory = require('../utils/handlerFactory');
// const AppError = require('../utils/appError');

exports.getAllCourses = factory.getAll(Course);
// exports.getCourseBySlug = factory.getOne(Course, { query: 'slug' });
exports.getCourse = factory.getOne(Course);
exports.createCourse = factory.createOne(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);
