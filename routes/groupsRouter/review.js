const express = require('express');
const reviewController = require('../../controller/reviewCtrl');
const classCtrl = require('../../controller/classCtrl');
const enrollController = require('../../controller/enrollCtrl');
const authController = require('../../controller/authCtrl');

const router = express.Router();

router.get('/', classCtrl.convertQueryToClassId, reviewController.getAllReviews);
router.get('/new-reviews', reviewController.getNewReviews, reviewController.getAllReviews);
router.get('/me',
  authController.protect,
  enrollController.getMe,
  classCtrl.convertQueryToClassId,
  reviewController.getAllReviews);
router.get('/:slug', reviewController.getReviewBySlug);

router.use(authController.protect);
router.route('/create')
  .post(
    reviewController.setUserCreateReview,
    reviewController.createReview,
  );

router.use(enrollController.restrictTo('member', 'provider'));
router.route('/update/:id')
  .patch(
    reviewController.checkReviewOwner,
    reviewController.restrictUpdateReviewFields,
    reviewController.updateReview,
  );
router.route('/delete/:id')
  .delete(
    reviewController.checkReviewOwner,
    reviewController.deleteReview,
  );

// router.use(authController.restrictTo('admin'));
// router.route('/:id').get(reviewController.getReview);
// router.route('/admin/create').post(reviewController.createReview);
// router.route('/admin/update/:id').patch(reviewController.updateReview);
// router.route('/admin/delete/:id').delete(reviewController.deleteReview);

module.exports = router;
