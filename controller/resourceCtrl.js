const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/appError');
const Resource = require('../models/resourceModel');
const sendResponse = require('../utils/sendResponse');
const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/handlerFactory');

exports.getAllResources = factory.getAll(Resource);
exports.getResourceBySlug = factory.getOne(Resource, { query: 'slug' });
exports.createResource = factory.createOne(Resource);
exports.updateResource = factory.updateOne(Resource);
exports.deleteResource = factory.deleteOne(Resource);

exports.getNewResources = (req, res, next) => {
  req.query.__limit = 4;
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
  const resourceIn = await Resource.findByIdAndUpdate(req.params.id, { status: 'accepted' }, {
    new: true,
    runValidators: true,
  });
  return sendResponse(resourceIn, StatusCodes.OK, res);
};

exports.restrictUpdateResourceFields = (req, res, next) => {
  const allowed = ['resourceName', 'resourceDescription'];
  Object.keys(req.body).forEach((element) => {
    if (!allowed.includes(element)) {
      delete req.body[element];
    }
  });
  next();
};

exports.checkResourceOwner = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return next(new AppError('Resource not found', StatusCodes.NOT_FOUND));
  if (req.user.id !== resource.userId) {
    return next(
      new AppError('You do not have permission to perform this action',
        StatusCodes.FORBIDDEN),
    );
  }
  return next();
});
