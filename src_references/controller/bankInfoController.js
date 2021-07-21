const BankInfoModel = require('../models/bankInfoModel');
const handler = require('../utils/handlerFactory');
// ROUTE HANDLERS
exports.getAllBankInfos = handler.getAll(BankInfoModel);
exports.getBankInfo = handler.getOne(BankInfoModel);
exports.createBankInfo = handler.createOne(BankInfoModel);
exports.deleteBankInfo = handler.deleteOne(BankInfoModel);
exports.updateBankInfo = handler.updateOne(BankInfoModel);
