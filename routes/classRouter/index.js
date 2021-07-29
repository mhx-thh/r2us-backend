const express = require('express');
const classRouter = require('./class');
const enrollRouter = require('./enroll');
const instructorRouter = require('./instructor');
// const resourceRouter = require('./resource');
const reviewRouter = require('./review');

const router = express.Router();

router.use('/', classRouter);
router.use('/enroll', enrollRouter);
router.use('/instructor', instructorRouter);
router.use('/review', reviewRouter);

module.exports = router;
