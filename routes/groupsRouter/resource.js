const express = require('express');
const resourceCtrl = require('../../controller/resourceCtrl');
const classCtrl = require('../../controller/classCtrl');
const authController = require('../../controller/authCtrl');
const enrollController = require('../../controller/enrollCtrl');

const router = express.Router();

router.get('/', classCtrl.convertQueryToClassId, resourceCtrl.getAllResources);
router.get('/new-resources', resourceCtrl.getNewResources, resourceCtrl.getAllResources);
router.route('/me')
  .get(
    authController.protect,
    enrollController.getMe,
    classCtrl.convertQueryToClassId,
    resourceCtrl.getAllResources,
  );
router.get('/:id', resourceCtrl.getResource);

router.use(authController.protect);
router
  .post(
    resourceCtrl.setUserCreateResource,
    resourceCtrl.createResource,
  );

router.route('/:id', resourceCtrl.checkOwner)
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
