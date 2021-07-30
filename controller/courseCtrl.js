const Course = require('../models/courseModel');
const factory = require('../utils/handlerFactory');

exports.getAllCourses = factory.getAll(Course);
exports.getCourseBySlug = factory.getOne(Course, { query: 'slug' });
exports.searchByDescription = factory.getOne(Course, { query: 'courseDescription' });
exports.createCourse = factory.createOne(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);
