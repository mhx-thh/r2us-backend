const express = require('express');
const academicRouter = require('./academic');
const courseRouter = require('./course');
const facultyRouter = require('./faculty');

const router = express.Router();

router.use('/courses', courseRouter);
router.use('/faculties', facultyRouter);
router.use('/', academicRouter);

module.exports = router;
