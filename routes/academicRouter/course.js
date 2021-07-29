const express = require('express');
const authController = require('../../controller/authCtrl');
const courseController = require('../../controller/courseCtrl');

const router = express.Router();

router.get('/getAll', courseController.getAllCourses);
router.get('/getCourse/:id', courseController.getCourse);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));
router.route('/createCourse').post(courseController.createCourse);
router.route('/updateCourse/:slug').patch(courseController.updateCourse);
router.route('/deleteCourse/:slug').delete(courseController.deleteCourse);

module.exports = router;
