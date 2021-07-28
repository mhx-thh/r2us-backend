const express = require('express');
const authController = require('../../controller/authCtrl');
const facultyController = require('../../controller/facultyCtrl');

const router = express.Router();

router
  .route('/')
  .get(facultyController.getAllFaculty)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    facultyController.createFaculty,
  );

router
  .route('/:id')
  .get(facultyController.getFaculty)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    facultyController.updateFaculty,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    facultyController.deleteFaculty,
  );
