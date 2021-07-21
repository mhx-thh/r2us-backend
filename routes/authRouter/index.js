const express = require('express');
const googleRouter = require('./google');

const router = express.Router();

// router.post('/signup', authController.signup);
// router.post('/signin', authController.login);
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);

router.use('/google', googleRouter);

module.exports = router;
