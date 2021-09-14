const express = require('express');
const authController = require('../../controller/authCtrl');
const enrollCtrl = require('../../controller/enrollCtrl');
const { convVieSearch, paging, getMe } = require('../../controller/middleCtrl');

const router = express.Router();

router.get('/', convVieSearch, paging, enrollCtrl.getAllEnrollment);

// login
router.use(authController.protect);

router.get('/me', // Get my enrollment and role
  getMe, // or using enrollCtrl.getMe
  enrollCtrl.getAllEnrollment);

router.post('/', // join class with member role
  enrollCtrl.setUserId,
  enrollCtrl.setMember,
  enrollCtrl.createEnrollment);

router.route('/:id')
  .all(
    enrollCtrl.enrollIdtoClassIdOnReq,
    enrollCtrl.protect,
    enrollCtrl.canEditAndDeleteEnroll,
  )
  .patch(
    enrollCtrl.restrictUpdateEnrollFields,
    enrollCtrl.updateEnrollment,
  )
  .delete(
    enrollCtrl.deleteEnrollment,
  );

module.exports = router;
