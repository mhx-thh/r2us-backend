const express = require('express');
const notificationCtrl = require('../controller/notificationController');
const authCtrl = require('../controller/authController');

const router = express.Router();

router.use(authCtrl.protect);

router
  .route('/')
  .get(
    authCtrl.restrictTo('admin'),
    notificationCtrl.getAllNotifications,
  )
  .post(
    authCtrl.restrictTo('admin'),
    notificationCtrl.createNotification,
  );

router
  .route('/me')
  .get(
    notificationCtrl.myNotification,
    notificationCtrl.getAllNotifications,
  );

router
  .route('/:id', notificationCtrl.checkNotificationOwnerOrAdmin)
  .get(notificationCtrl.getNotification)
  .patch(
    notificationCtrl.restrictUpdateNotificationFields,
    notificationCtrl.updateNotification,
  )
  .delete(notificationCtrl.deleteNotification);

module.exports = router;
