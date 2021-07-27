const express = require('express');
const authController = require('../../controller/authCtrl');
const academicController = require('../../controller/academicCtrl');

const router = express.Router();

router
  .route('/')
  .get(academicController.getAllAcademics)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    academicController.createAcademic,
  );

router
  .route('/:id')
  .get(academicController.getAcademic)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    academicController.updateAcademic,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    academicController.deleteAcademic,
  );
