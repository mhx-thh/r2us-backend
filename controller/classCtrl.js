const Class = require('../models/classModel');
const factory = require('../utils/handlerFactory');

exports.getAllClasses = factory.getAll(Class);
exports.getClassBySlug = factory.getOne(Class, { query: 'slug' });
exports.searchByDescription = factory.getOne(Class, { query: 'description' });
exports.getNewClasses = factory.getOne(Class, { sort: '-createdAt', limit: 5 });
exports.createClass = factory.createOne(Class);
exports.updateClass = factory.updateOne(Class);
exports.deleteClass = factory.deleteOne(Class);
