const express = require('express');
const classRouter = require('./class');
const enrollRouter = require('./enroll');
const instructorRouter = require('./instructor');
const resourceRouter = require('./resource');
const reviewRouter = require('./review');

const router = express.Router();

router.use('/class', classRouter);
router.use('/enrollment', enrollRouter);
router.use('/instructors', instructorRouter);
router.use('/reviews', reviewRouter);
router.use('/resources', resourceRouter);

module.exports = router;
