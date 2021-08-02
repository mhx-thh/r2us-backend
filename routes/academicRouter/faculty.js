const express = require('express');
const authController = require('../../controller/authCtrl');
const facultyController = require('../../controller/facultyCtrl');

const router = express.Router();

router.get('/', facultyController.getAllFaculty);
router.get('/:id', facultyController.getFaculty);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/create').post(facultyController.checkValidation, facultyController.createFaculty);
router.route('/update/:id').patch(facultyController.updateFaculty);
router.route('/delete/:id').delete(facultyController.deleteFaculty);

module.exports = router;
