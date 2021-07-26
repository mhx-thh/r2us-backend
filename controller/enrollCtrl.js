const Enroll = require('../models/enrollModel');
const factory = require('../utils/handlerFactory');

exports.getAllEnrollment = factory.getAll(Enroll);
exports.getEnrollment = factory.getOne(Enroll);
exports.createEnrollment = factory.createOne(Enroll);
exports.updateEnrollment = factory.updateOne(Enroll);
exports.deleteEnrollment = factory.deleteOne(Enroll);
