const { StatusCodes } = require('http-status-codes');
const Faculty = require('../models/facultyModel');
const factory = require('../utils/handlerFactory');
const AppError = require('../utils/appError');

exports.getAllFaculty = factory.getAll(Faculty);
exports.getFaculty = factory.getOne(Faculty);
exports.createFaculty = factory.createOne(Faculty);
exports.updateFaculty = factory.updateOne(Faculty);
exports.deleteFaculty = factory.deleteOne(Faculty);

exports.checkValidation = async function (req, res, next) {
  const facultyExists = await Faculty.find({ facultyName: req.body.facultyName });
  if (facultyExists) return next(new AppError('Faculty already exists', StatusCodes.NOT_ACCEPTABLE));
  return next();
};
