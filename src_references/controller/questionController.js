const { StatusCodes } = require('http-status-codes');
const Question = require('../models/questionModel');
const QuestionBuyer = require('../models/questionBuyerModel');
const catchAsync = require('../utils/catchAsync');
const handler = require('../utils/handlerFactory');
const sendResponse = require('../utils/sendResponse');
const AppError = require('../utils/appError');

// ROUTE HANDLERS

exports.getAllQuestion = handler.getAll(Question);
exports.getQuestion = handler.getOne(Question);

exports.createQuestion = handler.createOne(Question);
exports.updateQuestion = handler.updateOne(Question);
exports.deleteQuestion = handler.deleteOne(Question);

exports.getAllQuestionCategory = handler.sendArry(['Tổng quát', 'Toán học',
  'Ngữ văn', 'Sinh học', 'Vật lý', 'Hóa học', 'Lịch sử',
  'Địa lý', 'Tiếng anh', 'Thể dục', 'Công nghệ', 'Tin học']);
exports.getCategoryAndCount = handler.getDistinctValueAndCount(
  Question,
  'category',
);

exports.acceptAnswer = catchAsync(async (request, response, next) => {
  const question = await Question.findById(request.params.id);
  await question.acceptAnswer();
  sendResponse({
    message: 'Now, you can access Answer for this question',
  },
  StatusCodes.OK,
  response);
});

exports.rejectAnswer = catchAsync(async (request, response, next) => {
  const question = await Question.findById(request.params.id);
  const reason = request.body.reason || '';
  await question.rejectAnswer(reason);
  sendResponse({
    message: 'You sent one notification to admin to reject this question',
  },
  StatusCodes.OK,
  response);
});

exports.confirmRejectAnswer = catchAsync(async (request, response, next) => {
  const question = await Question.findById(request.params.id);
  const reason = request.body.reason || '';
  await question.confirmRejectAnswer(reason);
  sendResponse({
    message: 'Your question is switch to pending status',
  },
  StatusCodes.OK,
  response);
});

exports.setBuyIt = (request, response, next) => {
  request.body.user = request.user.id;
  request.body.question = request.params.id;
  return next();
};
exports.buyIt = handler.createOne(QuestionBuyer);

exports.checkQuestionOwnerOrAdmin = catchAsync(async (request, response, next) => {
  if (request.user.role === 'admin') return next();

  const question = await Question.findById(request.params.id);
  if (!question) return next(new AppError('Question not found', StatusCodes.NOT_FOUND));
  if (request.user.id !== question.user.id) {
    return next(
      new AppError(
        'You do not have permission to perform this action',
        403,
      ),
    );
  }
  return next();
});

exports.aliasTop10Questions = (request, response, next) => {
  request.query.__limit = '10';
  next();
};

exports.setUserId = (request, response, next) => {
  request.body.user = request.user.id;
  next();
};

exports.myQuestion = (request, response, next) => {
  request.query.user = request.user.id;
  return next();
};

exports.restrictUpdateQuestionFields = (request, response, next) => {
  const allowedFields = ['title', 'content', 'category', 'photoUrl'];

  if (request.user.role === 'admin') {
    allowedFields.push('status');
  }

  Object.keys(request.body).forEach((element) => {
    if (!allowedFields.includes(element)) {
      delete request.body[element];
    }
  });
  next();
};
