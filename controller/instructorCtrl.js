const Instructor = require('../models/instructorModel');
const factory = require('../utils/handlerFactory');
// const sendResponse = require('../utils/sendResponse');

exports.getAllInstructors = factory.getAll(Instructor);
exports.getInstructor = factory.getOne(Instructor);
exports.createInstructor = factory.createOne(Instructor);
exports.updateInstructor = factory.updateOne(Instructor);
exports.deleteInstructor = factory.deleteOne(Instructor);
