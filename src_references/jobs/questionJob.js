const QuestionModel = require('../models/questionModel');

const acceptAnswerSchedule = async () => {
  try {
    const timeNow = Date.now();
    const questions = await QuestionModel.find({ status: 'answered' });
    for (let i = 0; i < questions.length; i += 1) {
      console.log(timeNow - Date.parse(questions[i].answers[0].createdAt));
      if (timeNow - Date.parse(questions[i].answers[0].createdAt) > 24 * 60 * 60 * 1000) {
        // eslint-disable-next-line no-await-in-loop
        await questions[i].acceptAnswer(true);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

exports.acceptAnswerSchedule = acceptAnswerSchedule;
