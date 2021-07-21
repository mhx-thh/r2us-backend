const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const uniqueValidator = require('mongoose-unique-validator');

const answerSchema = new mongoose.Schema(
  {
    answer: {
      type: String,
      required: [true, 'Please type your answer'],
      minlength: [10, 'A Answer must have more than 10 character'],
      select: false,
    },
    showcase: {
      type: String,
    },
    question: {
      type: mongoose.Schema.ObjectId,
      ref: 'Question',
      required: [true, 'Answer must belong to a question'],
    },
    photoUrl: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Answer must belong to an User'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Make sure to one user can answer each question only one time
answerSchema.index({ question: 1, user: 1 }, { unique: true });

answerSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

// QUERY MIDDLEWARE - auto pupulate user in answer
answerSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '_id name photo', // just show name + photo and hide everything else for security
  });
  next();
});

// validate ID of user and question
answerSchema.plugin(idValidator);

answerSchema.pre('save', function (next) {
  const maxLength = 300;
  const len = this.answer.length / 2 < maxLength ? this.answer.length / 2 : maxLength;
  this.showcase = this.answer.substring(0, len);
  next();
});

answerSchema.post('save', async function () {
  const question = await this.model('Question').findByIdAndUpdate(this.question, {
    status: 'answered',
  });
  await this.model('Notification').create({
    content: 'Câu trả lời của bạn vừa được tạo thành công.',
    type: 'ANSWER',
    action: 'CREATE',
    link: this._id,
    user: this.user,
  });
  await this.model('Notification').create({
    content: 'Câu hỏi của bạn có người trả lời.',
    type: 'QUESTION',
    action: 'ANSWER',
    link: question._id,
    user: question.user,
  });
});

answerSchema.post(
  /findOneAndDelete|findOneAndRemove|deleteOne|remove/,
  { document: true },
  async function () {
    await this.model('Question').findByIdAndUpdate(this.question, { status: 'pending' });
  },
);

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
