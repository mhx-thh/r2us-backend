const express = require('express');
const path = require('path');

const morgan = require('morgan');
const cors = require('cors');
// const qs = require('qs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const groupsRouter = require('./routes/groupsRouter');
const academicRouter = require('./routes/academicRouter');
const blogRouter = require('./routes/blogRouter');
// TOTO: insert router
const docsRouter = require('./routes/docsRouter');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/errorHandler');

const app = express();

// 1 GLOBAL MIDDLEWARE
/*
const whitelist = new Set([
  'http://localhost:8080',
  'http://localhost:8081',
  '::ffff:127.0.0.1',
]);

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));
*/

// Allow the query using comma for array :
// destinations[all]=Hue,Halong%20Bay = destinations: { all: [ 'Hue', 'Halong Bay' ] },
// in express 4. , app.set must above app.use
// https://github.com/expressjs/express/issues/3039

// app.set('query parser', (string) => qs.parse(
//   string, {
//     comma: true,
//     arrayLimit: 30,
//   },
// ));

app.use(express.urlencoded({ extended: false }));

// Set security HTTP headers
app.use(helmet());
app.use(cors());

// Limit requests from same API
if (process.env.NODE_ENV !== 'development') {
  const limiter = rateLimit({
    max: 70,
    windowMs: 15 * 60 * 1000,
    handler(request, response, next) {
      next(new AppError('Too many requests, please try again later!', 421));
    },
  });

  app.use('/api/', limiter);
}

// build-in middleware to get req.body ~ req.query from body
app.use(express.json({ limit: '20kb' }));

// Data Sanitization against:
app.use(mongoSanitize()); // NoSQL query injection
app.use(xss()); // XSS
app.use(
  hpp({
    whitelist: ['duration'],
  }),
); // parameter pollution

// Serving static files
app.use(express.static(path.join('__dirname', 'public')));

// middleware to show log on console
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    skip(req, res) { return res.statusCode < 400; }, // only log error responses
  }));
}

// 2 ROUTES
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/groups', groupsRouter);
app.use('/api/v1/academic', academicRouter);
app.use('/api/v1/blog', blogRouter);
// TODO: use route here
app.use('/api/v1/api-docs', docsRouter);

app.all('*', (request, response, next) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
