const express = require('express');
// const authController = require('../../controller/authCtrl');
const instructorController = require('../../controller/instructorCtrl');

const router = express.Router();

router.get('/getAll', instructorController.getAllInstructors);
router.get('/getInstructor/:id', instructorController.getInstructor);

// router.use(authController.protect);
// router.use(authController.restrictTo('admin'));

router.route('/createInstructor').post(instructorController.createInstructor);
router.route('/updateInstructor/:id').patch(instructorController.updateInstructor);
router.route('/deleteInstructor/:id').delete(instructorController.deleteInstructor);

module.exports = router;
