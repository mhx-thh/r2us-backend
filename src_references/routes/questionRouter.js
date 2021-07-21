const express = require('express');
const questionCtrl = require('../controller/questionController');
const authCtrl = require('../controller/authController');
// const answerRouter = require('./answerRouter');

const router = express.Router();

// Advanced Route

router
  .route('/top-10-questions')
  // to avoid conflix with route('/:id'), place this router above router /:id
  .get(questionCtrl.aliasTop10Questions, questionCtrl.getAllQuestion);

router.route('/category').get(questionCtrl.getAllQuestionCategory);

// Normal CRUD route

router
  .route('/me')
  .get(
    authCtrl.protect,
    questionCtrl.myQuestion,
    questionCtrl.getAllQuestion,
  );

router
  .route('/')
  .get(questionCtrl.getAllQuestion)
  .post(
    authCtrl.protect,
    questionCtrl.setUserId,
    questionCtrl.createQuestion,
  );

// router.use('/:questionId/answers', answerRouter);

router.patch('/:id/buy',
  authCtrl.protect,
  questionCtrl.setBuyIt,
  questionCtrl.buyIt);

router.patch('/:id/accept',
  authCtrl.protect,
  questionCtrl.checkQuestionOwnerOrAdmin,
  questionCtrl.acceptAnswer);
router.patch('/:id/reject',
  authCtrl.protect,
  questionCtrl.checkQuestionOwnerOrAdmin,
  questionCtrl.rejectAnswer);
router.patch('/:id/confirm-reject',
  authCtrl.protect,
  authCtrl.restrictTo('admin'),
  questionCtrl.confirmRejectAnswer);

router
  .route('/:id')
  .get(questionCtrl.getQuestion)
  .patch(
    authCtrl.protect,
    questionCtrl.checkQuestionOwnerOrAdmin,
    questionCtrl.restrictUpdateQuestionFields,
    questionCtrl.updateQuestion,
  )
  .delete(
    authCtrl.protect,
    questionCtrl.checkQuestionOwnerOrAdmin,
    questionCtrl.deleteQuestion,
  );

module.exports = router;
