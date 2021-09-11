const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/appError');
const Resource = require('../models/resourceModel');
const sendResponse = require('../utils/sendResponse');
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

exports.acceptResource = async function (req, res, next) {
  const resourceIn = await Resource.findByIdAndUpdate(req.params.id, { status: 'accepted' }, {
    new: true,
    runValidators: true,
  });
  return sendResponse(resourceIn, StatusCodes.OK, res);
};

exports.restrictUpdateResourceFields = (req, res, next) => {
  const allowed = ['resourceLink', 'resourceName', 'resourceDescription', 'resourceType'];
  if (req.userEnroll !== undefined && req.userEnroll.role === 'provider') allowed.append('status');
  Object.keys(req.body).forEach((element) => {
    if (!allowed.includes(element)) {
      delete req.body[element];
    }
  });
  next();
};

exports.resourceToClass = catchAsync(async (req, res, next) => {
  const review = await Resource.findById(req.params.id);
  if (!review) return next(new AppError('Resource not found', StatusCodes.NOT_FOUND));
  req.class = review.classId;
  return next();
});

exports.checkOwner = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return next(new AppError('Resource not found', StatusCodes.NOT_FOUND));
  req.class = { id: resource.classId._id };
  if (req.user.role === 'admin') return next();
  if (resource.userId !== req.user.id) {
    return next(
      new AppError(
        'You do not have permission to perform this action.',
        StatusCodes.FORBIDDEN,
      ),
    );
  }
  return next();
});

exports.setUserCreateResource = (request, response, next) => {
  request.body.userId = request.user.id;
  return next();
};
