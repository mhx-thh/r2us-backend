const express = require('express');
const reviewCtrl = require('../../controller/reviewCtrl');
const classCtrl = require('../../controller/classCtrl');
const enrollController = require('../../controller/enrollCtrl');
const authController = require('../../controller/authCtrl');
const { convVieSearch } = require('../../controller/middleCtrl');

const router = express.Router();

router.get('/', classCtrl.convertQueryToClassId, convVieSearch, reviewCtrl.getAllReviews);
router.get('/new-reviews', reviewCtrl.getNewReviews, reviewCtrl.getAllReviews);
router.get('/me',
  authController.protect,
  enrollController.getMe,
  classCtrl.convertQueryToClassId,
  convVieSearch,
  reviewCtrl.getAllReviews);
router.get('/:id', reviewCtrl.getReview);

router.use(authController.protect);
router.post(
  reviewCtrl.setUserCreateReview,
  reviewCtrl.createReview,
);

router.route('/:id', reviewCtrl.checkOwner)
  .patch(
    reviewCtrl.restrictUpdateReviewFields,
    reviewCtrl.updateReview,
  )
  .delete(
    reviewCtrl.deleteReview,
  );

// router.use(authController.restrictTo('admin'));
// router.route('/:id').get(reviewCtrl.getReview);
// router.route('/admin/create').post(reviewCtrl.createReview);
// router.route('/admin/update/:id').patch(reviewCtrl.updateReview);
// router.route('/admin/delete/:id').delete(reviewCtrl.deleteReview);

module.exports = router;
