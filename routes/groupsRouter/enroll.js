const express = require('express');
const authController = require('../../controller/authCtrl');
const enrollController = require('../../controller/enrollCtrl');
// const userController = require('../../controller/userCtrl');

const router = express.Router();

// Get based on class

// Middleware: Please login in order to access this function
// router.use();

// Get my enrollment
router.route('/me')
  .get(
    authController.protect,
    enrollController.getMe,
    enrollController.getAllEnrollment,
  );

// Auto-enroll to member
router.route('/member/:slug')
  .post(
    authController.protect,
    enrollController.setUserId,
    enrollController.setIdBySlug,
    enrollController.createEnrollment,
  );

// Auto enroll to provider
router.route('/provider/:slug')
  .post(
    authController.protect,
    enrollController.setUserId,
    enrollController.setIdBySlug,
    enrollController.setProvider,
    enrollController.createEnrollment,
  );

// Create an enrollment
router.route('/create')
  .post(authController.protect,
    enrollController.setUserId,
    enrollController.createEnrollment);

// Most secure route (only for admin)
router.use(authController.restrictTo('admin'));
router.get('/all', enrollController.getAllEnrollment);
router.get('/:id', enrollController.getEnrollment);

// Advance to provider
router.patch('/:id/provider',
  enrollController.checkProvider,
  enrollController.advanceToProvider);

router.route('/create').post(enrollController.createEnrollment);
router.route('/update/:id').patch(enrollController.updateEnrollment);
router.route('/delete/:id').delete(enrollController.deleteEnrollment);

module.exports = router;
