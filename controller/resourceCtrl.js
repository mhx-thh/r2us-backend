const Resource = require('../models/resourceModel');
const factory = require('../utils/handlerFactory');

exports.getAllResources = factory.getAll(Resource);
exports.getResourceBySlug = factory.getOne(Resource, { query: 'slug' });
exports.searchByDescription = factory.getOne(Resource, { query: 'resourceDescription' });
exports.createResource = factory.createOne(Resource);
exports.updateResource = factory.updateOne(Resource);
exports.deleteResource = factory.deleteOne(Resource);
