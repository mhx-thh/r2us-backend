const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const express = require('express');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../../utils/appError');
const User = require('../../models/userModel');

const router = express.Router({ mapParams: true });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      const ggInfo = {
        givenName: profile.name.givenName,
        familyName: profile.name.familyName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        googleId: profile.id,
      };

      return cb(null, ggInfo);
    },
  ),
);

router.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  }),
);

router.use(passport.initialize());

router.get(
  '/',
  (req, res, next) => {
    req.session.callbackUrll = req.query.url || process.env.DEFAULT_CALLBACK_URL;
    next();
  },
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);

router.get(
  '/callback', (req, res, next) => {
    passport.authenticate('google', async (err, info) => {
      if (err) { return next(new AppError('Google auth fail', StatusCodes.BAD_REQUEST)); }
      if (!info) { return res.redirect(''); }
      let user = await User.findOne({ email: info.email });
      if (!user) user = await User.create(info);
      // sent token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      return res.redirect(`${req.session.callbackUrll}?token=${token}`);
    })(req, res, next);
  },
);

router.get('/create', (req, res, next) => {
  res.json({ user: req.session.user });
});

module.exports = router;
