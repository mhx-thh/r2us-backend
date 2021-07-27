const express = require('express');
const authController = require('../../controller/authCtrl');
const courseController = require('../../controller/courseCtrl');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(
    authController.restrictTo('admin'),
    courseController.createCourse,
  );

router
  .route('/:id')
  .get(courseController.getCourse)
  .patch(
    authController.restrictTo('admin'),
    courseController.updateCourse,
  )
  .delete(
    authController.restrictTo('admin'),
    courseController.deleteCourse,
  );
