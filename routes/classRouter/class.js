const express = require('express');
// const authController = require('../../controller/authCtrl');
const classController = require('../../controller/classCtrl');

const router = express.Router();

router.get('/', classController.getAllClasses);
router.get('/:slug', classController.getClassBySlug);
router.get('/search', classController.searchByDescription, classController.getAllClasses);
router.get('/new-classes', classController.getNewClasses, classController.getAllClasses);

router.route('/create').post(classController.checkExistence, classController.createClass);
router.route('/update/:id').patch(classController.updateClass);
router.route('/delete/:id').delete(classController.deleteClass);

module.exports = router;
