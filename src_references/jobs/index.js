const cron = require('cron');
const questionJobs = require('./questionJob');

const job = new cron.CronJob({
  cronTime: '00 00 23 * * 0-6', // Chạy Jobs vào 23h30 hằng đêm
  // eslint-disable-next-line object-shorthand
  onTick: function () {
    questionJobs.acceptAnswerSchedule();
    console.log('Cron jub runing...');
  },
  start: true,
  timeZone: 'Asia/Ho_Chi_Minh', // Lưu ý set lại time zone cho đúng
});

console.log('start jobs schedual');
job.start();
