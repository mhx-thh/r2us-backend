const express = require('express');
const reviewController = require('../../controller/reviewCtrl');
const enrollController = require('../../controller/enrollCtrl');
const authController = require('../../controller/authCtrl');

const router = express.Router();

router.get('/search',
  reviewController.searchByDescription,
  reviewController.getAllReviews);

router.get('/me',
  authController.protect,
  reviewController.myReview,
  reviewController.getAllReviews);
router.get('/', reviewController.getAllReviews);

// router.use();

router.use(enrollController.protect);
router.use(enrollController.restrictTo('member', 'provider'));
router.route('/create')
  .post(
    reviewController.setClassUserIds,
    reviewController.createReview,
  );
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

router.use(authController.restrictTo('admin'));
router.route('/:id').get(reviewController.getReview);
router.route('/admin/create').post(reviewController.createReview);
router.route('/admin/update/:id').patch(reviewController.updateReview);
router.route('/admin/delete/:id').delete(reviewController.deleteReview);

module.exports = router;
