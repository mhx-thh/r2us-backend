const { StatusCodes } = require('http-status-codes');
const Answer = require('../models/answerModel');
const QuestionBuyer = require('../models/questionBuyerModel');
const handler = require('../utils/handlerFactory');
const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

// ROUTE HANDLERS

exports.getAllAnswers = handler.getAll(Answer);
exports.getAnswer = handler.getOne(Answer, { select: { answer: 1, photoUrl: 1 } });
exports.createAnswer = handler.createOne(Answer);
exports.deleteAnswer = handler.deleteOne(Answer);
exports.updateAnswer = handler.updateOne(Answer);

exports.checkCanView = catchAsync(async (request, response, next) => {
  // admin role
  if (request.user.role === 'admin') return next();

  const answer = await Answer.findById(request.params.id).populate('question');
  if (!answer) return next(new AppError('Dont have this answer', StatusCodes.NOT_FOUND));
  // answer owner
  if (request.user.id === answer.user.id) return next();
  // answer of question which user is buyer
  const buyer = await QuestionBuyer.findOne({
    user: request.user.id, question: answer.question.id,
  });
  if (buyer) return next();
  return next(new AppError('You do not have permission to perform this action', StatusCodes.FORBIDDEN));
});

exports.checkCanUpdate = catchAsync(async (request, response, next) => {
  const answer = await Answer.findById(request.params.id).populate('question');
  if (!answer) return next(new AppError('Dont have this answer', StatusCodes.NOT_FOUND));

  // admin role
  if (request.user.role === 'admin') return next();
  if (answer.question.status === 'closed') return next(new AppError('This question of Answer is closed, You dont have permission to do this', StatusCodes.FORBIDDEN));
  // answer owner
  if (request.user.id === answer.user.id) return next();

  return next(new AppError('You do not have permission to perform this action', StatusCodes.FORBIDDEN));
});

exports.myAnswer = (request, response, next) => {
  request.query.user = request.user.id;
  return next();
};

exports.setQuestionUserIds = (request, response, next) => {
  // Allow nested routes

  if (!request.body.question && request.params.questionId) {
    request.body.question = request.params.questionId;
  }
  // if (!request.body.user)
  request.body.user = request.user.id;

  next();
};

exports.restrictUpdateAnswerFields = (request, response, next) => {
  const allowedFields = ['answer', 'photoUrl'];

  Object.keys(request.body).forEach((element) => {
    if (!allowedFields.includes(element)) {
      delete request.body[element];
    }
  });
  next();
};
