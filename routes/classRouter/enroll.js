const express = require('express');
const authController = require('../../controller/authCtrl');
const enrollController = require('../../controller/enrollCtrl');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(enrollController.getAllEnrollment)
  .post(
    authController.restrictTo('admin'),
    enrollController.createEnrollment,
  );

router
  .route('/:id')
  .get(enrollController.getEnrollment)
  .patch(
    authController.restrictTo('admin'),
    enrollController.updateEnrollment,
  )
  .delete(
    authController.restrictTo('admin'),
    enrollController.deleteEnrollment,
  );
