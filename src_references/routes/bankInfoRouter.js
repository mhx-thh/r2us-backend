const express = require('express');
const bankInfoCtrl = require('../controller/bankInfoController');
const authCtrl = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(
    bankInfoCtrl.getAllBankInfos,
  )
  .post(
    authCtrl.protect,
    authCtrl.restrictTo('admin'),
    bankInfoCtrl.createBankInfo,
  );

router
  .route('/:id')
  .get(bankInfoCtrl.getBankInfo)
  .patch(
    authCtrl.protect,
    authCtrl.restrictTo('admin'),
    bankInfoCtrl.updateBankInfo,
  )
  .delete(
    authCtrl.protect,
    authCtrl.restrictTo('admin'),
    bankInfoCtrl.deleteBankInfo,
  );

module.exports = router;
