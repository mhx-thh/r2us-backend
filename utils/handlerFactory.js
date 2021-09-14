/* eslint-disable prefer-destructuring */
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('./catchAsync');
const AppError = require('./appError');

const { queryToMongo } = require('./queryToMongo');
const sendResponse = require('./sendResponse');

exports.createOne = (Model) => catchAsync(async (request, response, next) => {
  const document = await Model.create(request.body);
  sendResponse(document, StatusCodes.CREATED, response);
});

exports.getAll = (Model) => catchAsync(async (request, response, next) => {
  const {
    skip, limit, sort, filter,
  } = queryToMongo({})(request.query);
  const [total, result] = await Promise.all([
    Model.countDocuments(filter),
    Model.find(filter).sort(sort).skip(skip).limit(limit),
  ]);

  return sendResponse({ total, returned: result.length, result }, StatusCodes.OK, response);
});

/**
 * @param  { model }   Model  - Mongoose Model
 * @param  { Object }  Option - Specific options for Tour Controller
 * @param {Object} Option.populate - populate virtual property - E.g: { path: 'reviews' }
 * @param {Object} Option.query - using findOne - not findById as default
 * @param {String} Option.select - select fields
 */
exports.getOne = (Model, Option = {}) => catchAsync(async (request, response, next) => {
  let query = Option.query
    ? Model.findOne({ [Option.query]: request.params[Option.query] })
    : Model.findById(request.params.id);

  if (Option.populate) query = query.populate(Option.populate);
  let select = {};
  if (Option.select) {
    select = Option.select;
  }
  query = query.select(select);

  const document = await query;

  if (!document) return next(new AppError('No document found', StatusCodes.NOT_FOUND));

  return sendResponse(document, StatusCodes.OK, response);
});

exports.updateOne = (Model) => catchAsync(async (request, response, next) => {
  const updateOption = {
    new: true, // return the new Update document to client
    runValidators: true, // run the validator
    context: 'query',
  };

  const document = await Model.findByIdAndUpdate(
    request.params.id,
    request.body,
    updateOption,
  );

  if (!document) return next(new AppError('No document found', StatusCodes.NOT_FOUND));

  return sendResponse(document, StatusCodes.OK, response);
});

exports.deleteOne = (Model) => catchAsync(async (request, response, next) => {
  const document = await Model.findByIdAndDelete(request.params.id);

  if (!document) return next(new AppError('No document found', StatusCodes.NOT_FOUND));

  // in RESTful API, common practice is not send anything back to client when deleted
  return sendResponse(undefined, StatusCodes.NO_CONTENT, response);
});

exports.getDistinctValueAndCount = (Model, value) => catchAsync(async (request, response, next) => {
  const document = await Model.aggregate([
    {
      $unwind: `$${value}`,
    },
    {
      $group: {
        _id: `$${value}`,
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        value: '$_id',
        _id: 0,
        count: 1,
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  sendResponse(document, StatusCodes.OK, response);
});

exports.sendArry = (value) => (request, response, next) => {
  sendResponse(value, StatusCodes.OK, response);
};
