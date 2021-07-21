const { promisify } = require('util');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const sendEmail = require('../utils/email');
// const sendResponse = require('../utils/sendResponse');
// const { resetPasswordMail } = require('../utils/resetPasswordMail');

// const createAndSendToken = (user, statusCode, response) => {
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });

//   return sendResponse({
//     user: user.toAuthJSON(),
//     token,
//   },
//   statusCode,
//   response);
// };

exports.protect = catchAsync(async (request, response, next) => {
  // 1 Getting token and check of it's there
  let token;

  // token is set at header:
  // authorization: Bearer {token}
  if (
    request.headers.authorization
    && request.headers.authorization.startsWith('Bearer')
  ) {
    token = request.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', StatusCodes.UNAUTHORIZED),
    );
  }

  // 2 Verification token
  const verifiedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  ); // promisify(jwt.verify) will return a promise

  // 3 Check if user still exists
  const user = await User.findById(verifiedToken.id);

  if (!user) return next(new AppError('This user does no longer exist.', StatusCodes.UNAUTHORIZED));

  // 4 Check if user changed password after the token was issued
  // if (user.changedPasswordAfterToken(verifiedToken.iat)) {
  //   return next(
  //     new AppError(
  //       'User has recently changed password! Please log in again to get access.',
  //       StatusCodes.UNAUTHORIZED,
  //     ),
  //   );
  // }

  request.user = user; // tranfer data logged user to the next middleware function

  return next();
});

exports.restrictTo = (...roles) => (request, response, next) => {
  if (!roles.includes(request.user.role)) {
    return next(
      new AppError(
        'You do not have permission to perform this action.',
        StatusCodes.FORBIDDEN,
      ),
    );
  }
  return next();
};

// exports.signup = catchAsync(async (request, response) => {
//   // to avoid someone want to take controll by set admin role in req.body
//   const {
//     name, email, password, passwordConfirm, dateOfbirth, school, major, bio,
//   } = request.body;
//   let { photo } = request.body;

//   if (!photo) photo = `https://i.pravatar.cc/150?u=${email}`;

//   const newUser = await User.create({
//     name,
//     email,
//     password,
//     passwordConfirm,
//     photo,
//     dateOfbirth,
//     school,
//     major,
//     bio,
//   });

//   return createAndSendToken(newUser, StatusCodes.CREATED, response);
// });

// exports.login = catchAsync(async (request, response, next) => {
//   const { email, password } = request.body;

//   // 1 check if email and password exist
//   if (!email || !password) {
//     return next(new AppError('Please provide email & password', StatusCodes.BAD_REQUEST));
//   }

//   // 2 Check if user exits && password is correct
//   const user = await User.findOne({ email }).select('+password');
//   // +password because it was hidden in db (seted hidden in user schema)

//   // check user exist and correct password if it's yes
//   if (!user || !(await user.comparePassword(password, user.password))) {
//     return next(new AppError('Incorect Email or Password', StatusCodes.UNAUTHORIZED));
//   }

//   // 3 If everything is ok, send token to client
//   return createAndSendToken(user, StatusCodes.OK, response);
// });

// exports.forgotPassword = catchAsync(async (request, response, next) => {
//   // 1 Get user based on POSTed email
//   const user = await User.findOne({ email: request.body.email });

//   if (!user) {
//     return next(new AppError('There is no user with email address', StatusCodes.NOT_FOUND));
//   }

//   // 2 Generate the random resetToken
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });
//   // turn off the validate because passwordConfirm is null right now

//   // 3) Send it to user's email
//   const resetURL = `${process.env.URL_RESET_PASSWORD_CLIENT}/${resetToken}`;

//   const htmlToSend = resetPasswordMail(resetURL);

//   try {
//     await sendEmail({
//       name: user.name,
//       email: user.email,
//       subject: 'No-reply, Yêu cầu đổi mật khẩu.',
//       htmlToSend,
//     });
//   } catch {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     // turn off the validate because passwordConfirm is null right now

//     return next(
//       new AppError(
//         'There was an error on sending email. Try again later.',
//         StatusCodes.INTERNAL_SERVER_ERROR,
//       ),
//     );
//   }
//   return sendResponse({
//     message: 'check email',
//   },
//   StatusCodes.OK,
//   response);
// });

// exports.resetPassword = catchAsync(async (request, response, next) => {
//   // 1 Get user based on the token

//   // encrypt the plain token user provided
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(request.params.token)
//     .digest('hex');

//   // find the user on db
//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() }, // check token has not expired
//   });

//   // 2 if token has not expired and there is user on db, set the new password
//   if (!user) next(new AppError('Token is invalid or has expired', StatusCodes.BAD_REQUEST));

//   user.password = request.body.password;
//   user.passwordConfirm = request.body.passwordConfirm;
//   user.passwordResetToken = undefined; // reset
//   user.passwordResetExpires = undefined; // reset

//   await user.save(); // have to user save() to run validator.

//   // 4 Log the user in, send JWT
//   return createAndSendToken(user, StatusCodes.OK, response);
// });

// exports.updatePassword = catchAsync(async (request, response, next) => {
//   // 1 Get user from collection
//   const user = await User.findById(request.user.id).select('+password');

//   // 2 check if POSTed current password is correct
//   if (!(await user.comparePassword(request.body.oldPassword, user.password))) {
//     return next(new AppError('Incorect Password.', StatusCodes.UNAUTHORIZED));
//   }
//   // 3 if ok, update password
//   user.password = request.body.newPassword;
//   user.passwordConfirm = request.body.passwordConfirm;

//   await user.save();

//   // 4 log user in, send JWT
//   return createAndSendToken(user, StatusCodes.OK, response);
// });
