const express = require('express');
const resourceCtrl = require('../../controller/resourceCtrl');
const classCtrl = require('../../controller/classCtrl');
const authController = require('../../controller/authCtrl');
const enrollCtrl = require('../../controller/enrollCtrl');
const { convVieSearch, getMe, paging } = require('../../controller/middleCtrl');

const router = express.Router();

router
  .get('/',
    classCtrl.convertQueryToClassId,
    convVieSearch, paging,
    resourceCtrl.getAllResources);
router
  .get('/new-resources',
    resourceCtrl.getNewResources,
    resourceCtrl.getAllResources);
router
  .get('/me',
    authController.protect,
    classCtrl.convertQueryToClassId,
    getMe,
    convVieSearch, paging,
    resourceCtrl.getAllResources);
router.get('/:id', resourceCtrl.getResource);

router.use(authController.protect);
router
  .post('/',
    resourceCtrl.setUserCreateResource,
    resourceCtrl.createResource);

router.route('/:id')
  .all(
    resourceCtrl.resourceIdtoClassIdOnReq,
    enrollCtrl.protect,
    resourceCtrl.canEditAndDelete,
  )
  .patch(
    resourceCtrl.restrictUpdateResourceFields,
    resourceCtrl.updateResource,
  )
  .delete(
    resourceCtrl.deleteResource,
  );

module.exports = router;
