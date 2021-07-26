const express = require('express');
const authController = require('../../controller/authCtrl');
const roleController = require('../../controller/roleCtrl');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(roleController.getAllRole)
  .post(
    authController.restrictTo('admin'),
    roleController.createRole,
  );

router
  .route(':/id')
  .get(roleController.getRole)
  .patch(
    authController.restrictTo('admin'),
    roleController.updateRole,
  )
  .delete(
    authController.restrictTo('admin'),
    roleController.deleteRole,
  );
