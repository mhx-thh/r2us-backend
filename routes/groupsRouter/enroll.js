const express = require('express');
const authController = require('../../controller/authCtrl');
const enrollController = require('../../controller/enrollCtrl');
// const userController = require('../../controller/userCtrl');

const router = express.Router();

// Get based on class
router.get('/:slug', enrollController.getSlug, enrollController.getAllEnrollment);

// Middleware: Please login in order to access this function
router.use(authController.protect);

// Get my enrollment
router.get('/me', enrollController.getMe, enrollController.getAllEnrollment);

// Create an enrollment
router.post('/create', enrollController.createEnrollment);

// Unenrolled a class
router.delete('/deleteMe', enrollController.deleteEnrollment);

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
