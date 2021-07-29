const express = require('express');
const authController = require('../../controller/authCtrl');
const enrollController = require('../../controller/enrollCtrl');
const userController = require('../../controller/userCtrl');

const router = express.Router();

// Middleware: Only enroll, get, update, delete enroll by oneself
router.use(authController.protect);
router.use(userController.getMe);

router
  .route('/')
  .get(enrollController.getAllEnrollment)
  .post(
    enrollController.protect,
    enrollController.createEnrollment,
  );

router
  .route('/:id')
  .get(
    enrollController.getEnrollment,
  )
  .patch(
    enrollController.protect,
    enrollController.restrictTo('member', 'provider'),
    enrollController.updateEnrollment,
  )
  .delete(
    enrollController.protect,
    enrollController.restrictTo('user', 'provider'),
    enrollController.deleteEnrollment,
  );

module.exports = router;
