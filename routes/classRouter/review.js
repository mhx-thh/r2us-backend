const express = require('express');
const reviewController = require('../../controller/reviewCtrl');
const authController = require('../../controller/authCtrl');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setClassUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

module.exports = router;
