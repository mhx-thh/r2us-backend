const Notification = require('../models/notificationModel');
const handler = require('../utils/handlerFactory');
const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

// ROUTE HANDLERS
exports.getAllNotifications = handler.getAll(Notification);
exports.getNotification = handler.getOne(Notification);
exports.createNotification = handler.createOne(Notification);
exports.deleteNotification = handler.deleteOne(Notification);
exports.updateNotification = handler.updateOne(Notification);

exports.checkNotificationOwnerOrAdmin = catchAsync(async (request, response, next) => {
  if (request.user.role === 'admin') return next();
  const notification = await Notification.findById(request.params.id);

  if (request.user.id !== notification.user.id) {
    return next(
      new AppError(
        'You do not have permission to perform this action',
        403,
      ),
    );
  }
  return next();
});

exports.myNotification = (request, response, next) => {
  request.query.user = request.user.id;
  next();
};

exports.restrictUpdateNotificationFields = (request, response, next) => {
  const allowedFields = ['read'];

  Object.keys(request.body).forEach((element) => {
    if (!allowedFields.includes(element)) {
      delete request.body[element];
    }
  });
  next();
};
