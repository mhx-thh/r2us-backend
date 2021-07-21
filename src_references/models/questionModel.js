const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const uniqueValidator = require('mongoose-unique-validator');
const { StatusCodes } = require('http-status-codes');
const convVie = require('../utils/convVie');
const AppError = require('../utils/appError');

const questionBuyerModel = require('./questionBuyerModel');
const answerModel = require('./answerModel');

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A Question must have a title'],
      trim: true,
      minlength: [
        10,
        'A question title must have more then or equal to 10 characters',
      ],
    },
    content: {
      type: String,
      required: [true, 'A Question must have a content'],
    },
    description: {
      type: String,
      select: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Answer must belong to an User'],
    },
    photoUrl: {
      type: String,
    },
    coin: {
      type: Number,
      required: [true, 'A Question must have coin'],
      min: [300, 'not less than 300'],
    },
    category: {
      type: String,
      enum: ['Tổng quát', 'Toán học', 'Ngữ văn', 'Sinh học', 'Vật lý', 'Hóa học', 'Lịch sử',
        'Địa lý', 'Tiếng anh', 'Thể dục', 'Công nghệ', 'Tin học'],
      default: 'Tổng quát',
    },
    status: {
      type: String,
      enum: ['pending', 'answered', 'reject', 'closed'],
      default: 'pending',
    },
    // createAt: {
    //   type: Date,
    //   default: Date.now(), // Mongoose will auto convert to today's date
    // },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // pass the virtuals properties to JSON
    toObject: { virtuals: true }, // --                        -- Object
  },
);

// mongo’s full-text search,
// we need to create indexes for the fields we need to search.
questionSchema.index({ description: 'text' });

questionSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

// Virtual populate for show up child referencing
questionSchema.virtual('answers', {
  ref: 'Answer',
  foreignField: 'question',
  localField: '_id',
});

questionSchema.plugin(idValidator);

questionSchema.pre('save', async function (next) {
  this.description = convVie(this.title).toLowerCase();
  const user = await this.model('User').findById(this.user);
  const isSuccess = await user.updateCoin({
    coin: -Math.abs(parseInt(this.coin || 0, 10)),
    content: 'Cập nhật Coin do bạn vừa đăng câu hỏi.',
  });
  if (!isSuccess) {
    return next(new AppError('You dont have enough coin to post question', StatusCodes.NOT_ACCEPTABLE));
  }
  return next();
});
questionSchema.post('save', async function () {
  await this.model('Notification').create({
    content: 'Câu hỏi của bạn đã được đăng thành công.',
    type: 'QUESTION',
    action: 'CREATE',
    link: this._id,
    user: this.user,
  });
  await this.model('QuestionBuyer').create({
    question: this._id,
    user: this.user,
  });
});

// QUERY MIDDLEWARE - auto pupulate user in answer
questionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '_id name photo', // just show name + photo and hide everything else for security
  })
    .populate({
      path: 'answers',
      select: '_id showcase createdAt',
    });
  next();
});

// all middleware are trigger
questionSchema.pre(
  /findOneAndUpdate|updateOne|update/,
  function (next) {
    const docUpdate = this.getUpdate();
    if (!docUpdate || !docUpdate.title) return next();
    this.findOneAndUpdate({}, { description: convVie(docUpdate.title).toLowerCase() });
    return next();
  },
);

questionSchema.post(
  /findOneAndDelete|findOneAndRemove|deleteOne|remove/,
  { document: true, query: false },
  async (result) => {
    await questionBuyerModel.deleteMany({ qestion: result._id }); // delete buyer
    await answerModel.deleteMany({ question: result._id }); // delete answer
  },
);

questionSchema.methods.acceptAnswer = async function (isOs = false) {
  const answer = await this.model('Answer').findOne({ question: this._id });
  if (!answer) throw new AppError('This question dont have any answer', StatusCodes.NOT_FOUND);

  if (this.status === 'closed') { throw new AppError(`This status'question is ${this.status}`, StatusCodes.NOT_ACCEPTABLE); }
  await this.update({ status: 'closed' });
  const userAnswer = await this.model('User').findById(answer.user);
  await userAnswer.updateCoin({
    coin: +parseInt(this.coin, 10),
    content: 'Thêm Coin do câu trả lời của bạn đã được chấp nhận.',
  });
  await this.model('Notification').create({
    content: 'Câu trả lời của bạn đã được chấp nhận.',
    type: 'QUESTION',
    action: 'ACCEPT',
    link: this._id,
    user: userAnswer._id,
  });
  if (isOs) {
    await this.model('Notification').create({
      content: 'Câu trả lời cho câu hỏi của bạn đã được tự động duyệt.',
      type: 'QUESTION',
      action: 'AUTOACCEPT',
      link: this._id,
      user: this.user._id,
    });
  }
};

questionSchema.methods.rejectAnswer = async function (reason) {
  const answer = await this.model('Answer').findOne({ question: this._id });
  if (!answer) throw new AppError('This question dont have any answer', StatusCodes.NOT_FOUND);

  if (this.status !== 'answered') { throw new AppError(`This status'question is ${this.status}, not is answered`, StatusCodes.NOT_ACCEPTABLE); }
  await this.update({ status: 'reject' });
  // find one user admin which is the first
  const user = await this.model('User').findOne({ role: 'admin' });
  // eslint-disable-next-line no-param-reassign
  if (reason === '') reason = 'Just has one reject answer is requested';
  await this.model('Notification').create({
    content: `Yêu cầu từ chối câu trả lời với lý do: ${reason}`,
    type: 'QUESTION',
    action: 'REJECT',
    link: this._id,
    user: user._id,
  });
};

questionSchema.methods.confirmRejectAnswer = async function (reason) {
  const answer = await this.model('Answer').findOne({ question: this._id });
  if (!answer) throw new AppError('This question dont have any answer', StatusCodes.NOT_FOUND);

  if (this.status !== 'reject') { throw new AppError(`This status'question is ${this.status}, not is reject`, StatusCodes.NOT_ACCEPTABLE); }

  await this.update({ status: 'pending', createAt: Date.now() });
  // eslint-disable-next-line no-param-reassign
  if (reason === '') reason = 'Your answer is rejected';
  await this.model('Notification').create({
    content: 'Yêu cầu từ chối câu trả lời của bạn đã được chấp nhận, câu hỏi của bạn đã trở về trạng thái mới.',
    type: 'QUESTION',
    action: 'RESTART',
    link: this._id,
    user: this.user,
  });

  await this.model('Answer').deleteOne({ question: this._id });
  await this.model('Notification').create({
    content: `Câu trả lời của bạn bị từ chối vì ${reason}`,
    type: 'ANSWER',
    action: 'REJECTED',
    link: this._id,
    user: answer.user._id,
  });
};

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
