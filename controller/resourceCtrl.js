const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/appError');
const Resource = require('../models/resourceModel');
const sendResponse = require('../utils/sendResponse');
const factory = require('../utils/handlerFactory');

exports.getAllResources = factory.getAll(Resource);
exports.getResourceBySlug = factory.getOne(Resource, { query: 'slug' });
exports.createResource = factory.createOne(Resource);
exports.updateResource = factory.updateOne(Resource);
exports.deleteResource = factory.deleteOne(Resource);

exports.getNewResources = (req, res, next) => {
  req.query.__limit = 5;
  req.query.__sort = '-createdAt,-updatedAt';
  next();
};

exports.searchByDescription = async function (req, res, next) {
  const searchField = req.query.description;
  const resourceExists = await Resource.find({ resourceDescription: { $regex: searchField, $options: '$i' } });
  const document = resourceExists;
  if (!document) return next(new AppError('No document found', StatusCodes.NOT_FOUND));

  return sendResponse(document, StatusCodes.OK, res);
};

exports.acceptResource = async function (req, res, next) {
  const resourceIn = await Resource.findByIdAndUpdate(req.query.id, { status: 'accepted' }, { returnOriginal: false });
  return sendResponse(resourceIn, StatusCodes.OK, res);
};
