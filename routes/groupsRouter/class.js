const express = require('express');
const authCtrl = require('../../controller/authCtrl');
const classCtrl = require('../../controller/classCtrl');
const enrollCtrl = require('../../controller/enrollCtrl');
const { convVieSearch, paging } = require('../../controller/middleCtrl');

const router = express.Router();

router.route('/new-groups').get(classCtrl.getNewClasses, classCtrl.getAllClasses);
router.get('/', convVieSearch, paging, classCtrl.getAllClasses);
router.get('/:slug', classCtrl.getClassBySlug);

// User can create class
router.use(authCtrl.protect);
router.route('/create')
  .post(
    classCtrl.setUserCreateClass,
    classCtrl.createClass,
  );

// Provider can update class
router.route('/:id',
  classCtrl.setClassId,
  enrollCtrl.protect,
  classCtrl.canEditAndDeleteClass)
  .patch(
    classCtrl.restrictUpdateClassFields,
    classCtrl.updateClass,
  )
  .delete(
    classCtrl.deleteClass,
  );

module.exports = router;
