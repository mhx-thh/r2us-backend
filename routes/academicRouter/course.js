const express = require('express');
const authController = require('../../controller/authCtrl');
const courseController = require('../../controller/courseCtrl');

const router = express.Router();

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    courseController.createCourse,
  );

router
  .route('/:id')
  .get(courseController.getCourse)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    courseController.updateCourse,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    courseController.deleteCourse,
  );
