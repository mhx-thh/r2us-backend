const express = require('express');
const resourceCtrl = require('../../controller/resourceCtrl');
const classCtrl = require('../../controller/classCtrl');
const authController = require('../../controller/authCtrl');
const enrollController = require('../../controller/enrollCtrl');
const { convVieSearch } = require('../../controller/middleCtrl');

const router = express.Router();

router.get('/new-resources', resourceCtrl.getNewResources, resourceCtrl.getAllResources);
router.get('/me',
  authController.protect,
  enrollController.getMe,
  classCtrl.convertQueryToClassId,
  convVieSearch,
  resourceCtrl.getAllResources);
router.get('/:id', resourceCtrl.getResource);
router.get('/', classCtrl.convertQueryToClassId, convVieSearch, resourceCtrl.getAllResources);

router.use(authController.protect);
router
  .post('/',
    resourceCtrl.setUserCreateResource,
    resourceCtrl.createResource);

router.route('/:id')
  .all(
    resourceCtrl.checkOwner,
    enrollController.protect,
  )
  .patch(
    resourceCtrl.restrictUpdateResourceFields,
    resourceCtrl.updateResource,
  )
  .delete(
    resourceCtrl.deleteResource,
  );

// Provider
// Accept resource
// router.use(enrollController.restrictTo('provider'));
// router.route('/accept/:id').patch(resourceCtrl.acceptResource);
// router.route('/reject/:id').delete(resourceCtrl.deleteResource);

module.exports = router;
