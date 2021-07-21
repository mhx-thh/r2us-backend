const express = require('express');
const answerCtrl = require('../controller/answerController');
const authCtrl = require('../controller/authController');

const router = express.Router({ mergeParams: true });
// must pass {mergeParams: true} to the child router
// if you want to access the params from the parent router.

router.use(authCtrl.protect);

router
  .route('/')
  .get(
    authCtrl.restrictTo('admin'),
    answerCtrl.getAllAnswers,
  )
  .post(
    authCtrl.restrictTo('provider', 'admin'),
    answerCtrl.setQuestionUserIds,
    answerCtrl.createAnswer,
  );

router
  .route('/me')
  .get(
    answerCtrl.myAnswer,
    answerCtrl.getAllAnswers,
  );

router
  .route('/:id')
  .get(answerCtrl.checkCanView, answerCtrl.getAnswer)
  .patch(answerCtrl.checkCanUpdate, answerCtrl.restrictUpdateAnswerFields, answerCtrl.updateAnswer)
  .delete(answerCtrl.checkCanUpdate, answerCtrl.deleteAnswer);
module.exports = router;
