const express = require('express');
const reviewCtrl = require('../../controller/reviewCtrl');
const classCtrl = require('../../controller/classCtrl');
const enrollCtrl = require('../../controller/enrollCtrl');
const authController = require('../../controller/authCtrl');
const { convVieSearch, getMe, paging } = require('../../controller/middleCtrl');

const router = express.Router();

router
  .get('/', // get all review with paging and search
    classCtrl.convertQueryToClassId,
    convVieSearch, paging,
    reviewCtrl.getAllReviews);
router
  .get('/new-reviews',
    reviewCtrl.getNewReviews,
    reviewCtrl.getAllReviews);
router
  .get('/me', // get my review with paging and search
    authController.protect,
    classCtrl.convertQueryToClassId,
    getMe, // or use reviewCtrl.myReview
    convVieSearch, paging,
    reviewCtrl.getAllReviews);
router.get('/:id', reviewCtrl.getReview);

router.use(authController.protect);
router
  .post('/',
    reviewCtrl.setUserCreateReview,
    reviewCtrl.createReview);

router.route('/:id')
  .all(
    reviewCtrl.reviewIdtoClassIdOnReq,
    enrollCtrl.protect,
    reviewCtrl.canEditAndDelete,
  )
  .patch(
    reviewCtrl.restrictUpdateReviewFields,
    reviewCtrl.updateReview,
  )
  .delete(
    reviewCtrl.deleteReview,
  );

module.exports = router;
