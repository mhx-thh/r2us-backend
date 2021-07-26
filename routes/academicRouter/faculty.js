const express = require('express');
const authController = require('../../controller/authCtrl');
const facultyController = require('../../controller/facultyCtrl');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(facultyController.getAllFaculty)
  .post(
    authController.restrictTo('admin'),
    facultyController.createFaculty,
  );

router
  .route(':/id')
  .get(facultyController.getFaculty)
  .patch(
    authController.restrictTo('admin'),
    facultyController.updateFaculty,
  )
  .delete(
    authController.restrictTo('admin'),
    facultyController.deleteFaculty,
  );
