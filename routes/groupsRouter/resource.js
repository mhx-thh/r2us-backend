const express = require('express');
const resourceController = require('../../controller/resourceCtrl');
const authController = require('../../controller/authCtrl');
const enrollController = require('../../controller/enrollCtrl');

const router = express.Router();

router.get('/new-resources', resourceController.getNewResources, resourceController.getAllResources);
router.route('/me')
  .get(
    authController.protect,
    enrollController.getMe,
    resourceController.getAllResources,
  );
router.get('/', resourceController.getAllResources);
router.get('/:slug', resourceController.getResourceBySlug);
router.get('/search', resourceController.searchByDescription, resourceController.getAllResources);

router.use(authController.protect);
router.route('/create')
  .post(
    resourceController.createResource,
    enrollController.createEnrollment,
  );
router.use(enrollController.protect);
router.use(enrollController.restrictTo('member', 'provider'));
router.route('/update/:id')
  .patch(
    resourceController.checkResourceOwner,
    resourceController.restrictUpdateResourceFields,
    resourceController.updateResource,
  );
router.route('/delete/:id')
  .delete(
    resourceController.checkResourceOwner,
    resourceController.deleteResource,
  );

// Provider
// Accept resource
router.use(enrollController.restrictTo('provider'));
router.route('/accept/:id').patch(resourceController.acceptResource);
router.route('/reject/:id').delete(resourceController.deleteResource);

module.exports = router;
