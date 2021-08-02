const express = require('express');
const authController = require('../../controller/authCtrl');
const courseController = require('../../controller/courseCtrl');

const router = express.Router();

router.get('/', courseController.getAllCourses);
router.get('/:slug', courseController.getCourseBySlug);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/create').post(courseController.checkValidation, courseController.createCourse);
router.route('/update/:id').patch(courseController.updateCourse);
router.route('/delete/:id').delete(courseController.deleteCourse);

module.exports = router;
