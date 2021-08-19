const Faculty = require('../models/facultyModel');
const factory = require('../utils/handlerFactory');

exports.getAllFaculty = factory.getAll(Faculty);
exports.getFaculty = factory.getOne(Faculty);
exports.createFaculty = factory.createOne(Faculty);
exports.updateFaculty = factory.updateOne(Faculty);
exports.deleteFaculty = factory.deleteOne(Faculty);
