const Academic = require('../models/academicModel');
const factory = require('../utils/handlerFactory');

exports.getAllAcademics = factory.getAll(Academic);
exports.getAcademic = factory.getOne(Academic);
exports.createAcademic = factory.createOne(Academic);
exports.updateAcademic = factory.updateOne(Academic);
exports.deleteAcademic = factory.deleteOne(Academic);
