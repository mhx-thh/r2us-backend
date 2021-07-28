const express = require('express');
const classRouter = require('./class');
const enrollRouter = require('./enroll');
const reviewRouter = require('./review');

const router = express.Router();

router.use('/class', classRouter);
router.use('/enroll', enrollRouter);
router.use('/review', reviewRouter);
