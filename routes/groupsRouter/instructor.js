const express = require('express');
const authController = require('../../controller/authCtrl');
const instructorController = require('../../controller/instructorCtrl');

const router = express.Router();

router.get('/', instructorController.getAllInstructors);
router.get('/:id', instructorController.getInstructor);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/create').post(instructorController.createInstructor);
router.route('/update/:id').patch(instructorController.updateInstructor);
router.route('/delete/:id').delete(instructorController.deleteInstructor);

module.exports = router;
