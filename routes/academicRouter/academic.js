const express = require('express');
const authController = require('../../controller/authCtrl');
const academicController = require('../../controller/academicCtrl');

const router = express.Router();

router.get('/getAll', academicController.getAllAcademics);
router.get('/getAcademic/:id', academicController.getAcademic);

// Most secure router
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/createAcademic').post(academicController.createAcademic);

router.route('/updateAcademic/:id').patch(academicController.updateAcademic);
router.route('/deleteAcademic/:id').delete(academicController.deleteAcademic);

module.exports = router;
