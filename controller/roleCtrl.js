const Role = require('../models/roleModel');
const factory = require('../utils/handlerFactory');

exports.getAllRole = factory.getAll(Role);
exports.getRole = factory.getOne(Role);
exports.createRole = factory.createOne(Role);
exports.editRole = factory.updateOne(Role);
exports.deleteRole = factory.deleteOne(Role);
