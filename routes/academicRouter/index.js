const express = require('express');
const semsterRouter = require('./semster');
const courseRouter = require('./course');
const facultyRouter = require('./faculty');
const intructorRouter = require('./instructor');

const router = express.Router();

router.use('/courses', courseRouter);
router.use('/faculties', facultyRouter);
router.use('/semesters', semsterRouter);
router.use('/intructors', intructorRouter);

module.exports = router;
