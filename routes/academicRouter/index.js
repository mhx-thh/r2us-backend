const express = require('express');
const academicRouter = require('./academic');
const courseRouter = require('./course');
const facultyRouter = require('./faculty');

const router = express.Router();

router.use('/course', courseRouter);
router.use('/faculty', facultyRouter);
router.use('/academic', academicRouter);
