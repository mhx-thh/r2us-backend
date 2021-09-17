const { StatusCodes } = require('http-status-codes');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handler = require('../utils/handlerFactory');
const sendResponse = require('../utils/sendResponse');

const updateUserFunc = (opt = { type: 'common' }) => catchAsync(async (request, response, next) => {
  // FIX: Fix some thing here
  const allowedFields = ['givenName', 'familyName', 'studentCardNumber', 'email', 'photo', 'dateOfbirth', 'bio'];
  if (opt.type === 'admin') {
    allowedFields.push('role');
  }

  // 1 Create error if user POSTs unwanted fields names that are not allowed to be updated
  // eslint-disable-next-line consistent-return
  Object.keys(request.body).forEach((element) => {
    if (!allowedFields.includes(element)) {
      return next(
        new AppError(
          `This route is used just for update ${allowedFields} Please try again`,
          StatusCodes.NOT_FOUND,
        ),
      );
    }
  });

  // 2 Update User data
  const updatedUser = await User.findByIdAndUpdate(
    request.params.id,
    request.body, // filteredReqBody,
    {
      new: true, //  true to return the modified document rather than the original.
      runValidators: true, //  runs update validators on this command.
      // Update validators validate the update operation against the model's schema.
    },
  );

  // 3 send response
  sendResponse({ user: updatedUser }, StatusCodes.OK, response);
});

exports.getAllUsers = handler.getAll(User);
exports.getUser = handler.getOne(User);
exports.updateUser = updateUserFunc({ type: 'admin' });
exports.deleteUser = handler.deleteOne(User);

exports.getMe = (request, response, next) => {
  request.params.id = request.user.id;
  next();
};

exports.getRoleAndCount = handler.getDistinctValueAndCount(User, 'role');

exports.updateMe = updateUserFunc();
