const Class = require('../models/classModel');
const factory = require('../utils/handlerFactory');

exports.getAllClasses = factory.getAll(Class);
exports.getClass = factory.getOne(Class, { path: 'reviews' });
exports.createClass = factory.createOne(Class);
exports.updateClass = factory.updateOne(Class);
exports.deleteClass = factory.deleteOne(Class);
