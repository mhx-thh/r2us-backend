const express = require('express');
const authController = require('../../controller/authCtrl');
const enrollController = require('../../controller/enrollCtrl');
const { convVieSearch } = require('../../controller/middleCtrl');

const router = express.Router();

router.get('/', convVieSearch, enrollController.getAllEnrollment);

router.get('/me', // Get my enrollment and role
  authController.protect,
  enrollController.getMe,
  enrollController.getAllEnrollment);

// login
router.use(authController.protect);

router.post('/', // join class with member role
  enrollController.setUserId,
  enrollController.setMember,
  enrollController.createEnrollment);

module.exports = router;
