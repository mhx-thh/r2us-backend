const express = require('express');
const authController = require('../../controller/authCtrl');
const facultyController = require('../../controller/facultyCtrl');

const router = express.Router();

router.get('/getAll', facultyController.getAllFaculty);
router.get('/getFaculty/:id', facultyController.getFaculty);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/createFaculty').post(facultyController.createFaculty);
router.route('/updateFaculty/:id').patch(facultyController.updateFaculty);
router.route('/deleteFaculty/:id').delete(facultyController.deleteFaculty);

module.exports = router;
