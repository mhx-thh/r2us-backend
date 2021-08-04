const express = require('express');
const resourceController = require('../../controller/resourceCtrl');
const authController = require('../../controller/authCtrl');
const enrollController = require('../../controller/enrollCtrl');

const router = express.Router();

router.get('/', resourceController.getAllResources);
router.get('/:slug', resourceController.getResourceBySlug);
router.get('/new-resources', resourceController.getNewResources, resourceController.getAllResources);

router.use(authController.protect);
router.use(enrollController.protect);
router.use(enrollController.restrictTo('member'));
router.route('/create').post(resourceController.createResource);
router.route('/update/:id').patch(resourceController.updateResource);
router.route('/delete/:id').delete(resourceController.deleteResource);

// Provider
// Accept resource
router.use(enrollController.restrictTo('provider'));
router.route('/accept').patch(resourceController.acceptResource);

module.exports = router;
