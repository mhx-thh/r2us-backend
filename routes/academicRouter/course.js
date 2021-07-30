const express = require('express');
// const authController = require('../../controller/authCtrl');
const courseController = require('../../controller/courseCtrl');

const router = express.Router();

router.get('/getAll', courseController.getAllCourses);
router.get('/getCourse/:slug', courseController.getCourseBySlug);

// router.use(authController.protect);
// router.use(authController.restrictTo('admin'));
router.route('/createCourse').post(courseController.createCourse);
router.route('/updateCourse/:id').patch(courseController.updateCourse);
router.route('/deleteCourse/:id').delete(courseController.deleteCourse);

module.exports = router;
