const express = require('express');
const authController = require('../../controller/authCtrl');
const classController = require('../../controller/classCtrl');
const enrollController = require('../../controller/enrollCtrl');

const router = express.Router();

router.route('/new-groups').get(classController.getNewClasses, classController.getAllClasses);
// router.get('/search', classController.searchByDescription, classController.getAllClasses);
router.get('/', classController.getAllClasses);
router.get('/:slug', classController.getClassBySlug);

// router.get('/search', classController.getNewClasses, classController.getAllClasses);
// User can create class
router.use(authController.protect);
router.route('/create')
  .post(
    authController.restrictTo('user'),
    classController.setUserCreateClass,
    classController.createClass,
  );

// Provider can update class
router.route('/:id')
  .patch(
    enrollController.protect,
    enrollController.restrictTo('provider'),
    classController.restrictUpdateClassFields,
    classController.updateClass,
  );

// Most secure router
// TODO i dont think so
// router.use(authController.restrictTo('admin'));
// router.route('/admin/create').post(classController.createClass);
// router.route('/admin/update/:id').patch(classController.updateClass);
// router.route('/admin/delete/:id').delete(classController.deleteClass);

module.exports = router;
