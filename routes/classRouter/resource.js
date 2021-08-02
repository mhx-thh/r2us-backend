const express = require('express');
const resourceController = require('../../controller/resourceCtrl');
const authController = require('../../controller/authCtrl');
const enrollController = require('../../controller/enrollCtrl');

const router = express.Router();

router.get('/getAll', resourceController.getAllResources);
router.get('/getResources/:id', resourceController.getResource);

router.use(authController.protect);
router.use(enrollController.protect);
router.use(enrollController.restrictTo('provider'));
router.route('/createResource').post(resourceController.createResource);
router.route('/updateResource/:id').patch(resourceController.updateResource);
router.route('/deleteResource/:id').delete(resourceController.deleteResource);
