const express = require('express');
const authController = require('../../controller/authCtrl');
const classController = require('../../controller/classCtrl');
const enrollController = require('../../controller/enrollCtrl');

const router = express.Router();

router.get('/', classController.getAllClasses);
router.get('/:slug', classController.getClassBySlug);
router.get('/search', classController.searchByDescription, classController.getAllClasses);
router.get('/new-classes', classController.getNewClasses, classController.getAllClasses);

// User can create class
router.use(authController.protect);
router.use(authController.restrictTo('user'));
router.route('/create').post(classController.checkExistence, classController.createClass);

// Provider can update class
router.route('/update/:id')
  .patch(
    enrollController.protect,
    enrollController.restrictTo('provider'),
    classController.checkExistence,
    classController.updateClass,
  );

// Most secure router
router.use(authController.restrictTo('admin'));
router.route('/admin/create').post(classController.createClass);
router.route('/admin/update/:id').patch(classController.updateClass);
router.route('/admin/delete/:id').delete(classController.deleteClass);

module.exports = router;
