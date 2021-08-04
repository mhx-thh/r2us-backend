const express = require('express');
const authController = require('../../controller/authCtrl');
const academicController = require('../../controller/academicCtrl');

const router = express.Router();

router.get('/', academicController.getAllAcademics);
router.get('/:id', academicController.getAcademic);

// Most secure router
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/create').post(academicController.createAcademic);
router.route('/update/:id').patch(academicController.updateAcademic);
router.route('/delete/:id').delete(academicController.deleteAcademic);

module.exports = router;
