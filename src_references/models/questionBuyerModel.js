const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const uniqueValidator = require('mongoose-unique-validator');
const AppError = require('../utils/appError');

const questionBuyerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: [true, 'Must just one User'],
  },
  question: {
    type: mongoose.Schema.ObjectId,
    ref: 'Question',
    require: [true, 'Has one question'],
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
},
{
  toJSON: { virtuals: true }, // pass the virtuals properties to JSON
  toObject: { virtuals: true }, // --                        -- Object
});

questionBuyerSchema.index({ question: 1, user: 1 }, { unique: true });

questionBuyerSchema.plugin(idValidator);

questionBuyerSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

questionBuyerSchema.pre('save', async function (next) {
  // check coin
  const user = await this.model('User').findById(this.user);
  const question = await this.model('Question').findById(this.question);
  if (!question) return next(new Error('Question not found'));
  if (user._id.toString() === question.user._id.toString()) return next();

  const isSuccess = await user.updateCoin({
    coin: -Math.abs(parseInt(question.coin || 0, 10)),
    content: 'Cập nhật Coin do bạn vừa mua câu hỏi.',
  });
  if (!isSuccess) {
    return next(new AppError('You dont have enough coin to buy question', StatusCodes.NOT_ACCEPTABLE));
  }
  // add
  return next();
});

const QuestionBuyer = mongoose.model('QuestionBuyer', questionBuyerSchema);
module.exports = QuestionBuyer;
