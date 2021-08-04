// const { StatusCodes } = require('http-status-codes');
const Academic = require('../models/academicModel');
const factory = require('../utils/handlerFactory');
// const AppError = require('../utils/appError');

exports.getAllAcademics = factory.getAll(Academic);
exports.getAcademic = factory.getOne(Academic);
exports.createAcademic = factory.createOne(Academic);
exports.updateAcademic = factory.updateOne(Academic);
exports.deleteAcademic = factory.deleteOne(Academic);
