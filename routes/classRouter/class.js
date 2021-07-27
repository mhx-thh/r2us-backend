const express = require('express');
const authController = require('../../controller/authCtrl');
const classController = require('../../controller/classCtrl');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(classController.getAllClasses)
  .post(
    authController.restrictTo('admin'),
    classController.createClass,
  );

router
  .route('/[:slug]')
  .get(classController.getClass)
  .patch(
    authController.restrictTo('admin'),
    classController.updateClass,
  )
  .delete(
    authController.restrictTo('admin'),
    classController.deleteClass,
  );
