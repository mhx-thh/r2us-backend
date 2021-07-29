const express = require('express');
// const authController = require('../../controller/authCtrl');
const classController = require('../../controller/classCtrl');

const router = express.Router();

router.get('/getAll', classController.getAllClasses);
router.get('/getClass/:slug', classController.getClassBySlug);
router.get('/search/:description', classController.searchByDescription);
// router.use(authController.protect);
// router.use(authController.restrictTo('user', 'admin'));
router.route('/createClass').post(classController.createClass);
router.route('/updateClass/:slug').patch(classController.updateClass);
router.route('/deleteClass/:slug').delete(classController.deleteClass);

module.exports = router;
