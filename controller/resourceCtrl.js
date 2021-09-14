const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/appError');
const Resource = require('../models/resourceModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/handlerFactory');

exports.getAllResources = factory.getAll(Resource);
exports.getResourceBySlug = factory.getOne(Resource, { query: 'slug' });
exports.getResource = factory.getOne(Resource);
exports.createResource = factory.createOne(Resource);
exports.updateResource = factory.updateOne(Resource);
exports.deleteResource = factory.deleteOne(Resource);

exports.getNewResources = (req, res, next) => {
  req.query.__limit = '4';
  req.query.__sort = '-createdAt,-updatedAt';
  next();
};

exports.myResource = (req, res, next) => {
  req.query.userId = req.user.id;
  next();
};

exports.setUserCreateResource = (request, response, next) => {
  request.body.userId = request.user.id;
  return next();
};

// can delete = can edit
exports.canEditAndDelete = (req, res, next) => {
  req.editWith = 'full';
  if (req.user.role === 'admin') return next();
  if (req.userEnroll.role === 'provider') return next();
  req.editWith = 'basic';
  if (req.review.userId === req.user.id) return next();
  return next(
    new AppError(
      'You do not have permission to perform this action.',
      StatusCodes.FORBIDDEN,
    ),
  );
};

exports.restrictUpdateResourceFields = (req, res, next) => {
  // update with 'basic' permission
  const allowed = ['resourceLink', 'resourceName', 'resourceDescription', 'resourceType'];
  // 'full' permission
  if (req.editWith === 'full') allowed.push('status');
  Object.keys(req.body).forEach((element) => {
    if (!allowed.includes(element)) {
      delete req.body[element];
    }
  });
  next();
};

// convert resource Id on url to Class Id on Request
exports.resourceIdtoClassIdOnReq = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return next(new AppError('Resource not found', StatusCodes.NOT_FOUND));
  req.resource = resource;
  req.class = { id: resource.classId._id };
  return next();
});
