const mongoose = require('mongoose');

const bankInfoSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
  },
  usernameMomo: {
    type: String,
  },
  accountNumberBank: {
    type: String,
  },
  usernameBank: {
    type: String,
  },
  branchBank: {
    type: String,
  },
});

// Create BankInfo collection
const BankInfo = mongoose.model('BankInfo', bankInfoSchema);
module.exports = BankInfo;
