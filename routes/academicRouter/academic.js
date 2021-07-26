const express = require('express');
const authController = require('../../controller/authCtrl');
const academicController = require('../../controller/academicCtrl');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(academicController.getAllAcademics)
  .post(
    authController.restrictTo('admin'),
    academicController.createAcademic,
  );

router
  .route(':/id')
  .get(academicController.getAcademic)
  .patch(
    authController.restrictTo('admin'),
    academicController.updateAcademic,
  )
  .delete(
    authController.restrictTo('admin'),
    academicController.deleteAcademic,
  );
