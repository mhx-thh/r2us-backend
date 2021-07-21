const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const url = process.env.APP_URL !== 'http://localhost'
  ? `${process.env.APP_URL}/api/v1/`
  : `${process.env.APP_URL}:${process.env.PORT}/api/v1/`;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API documentation for Olar project',
      version: '1.0.0',
      description:
      'This is version 1 of API for Olar project',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'phamvmnhut',
        url: 'https://fb.com/phamvmnhut',
        email: 'phamvmnhut@gmail.com',
      },
    },
    servers: [
      {
        url,
      },
    ],
    schemes: [
      'https',
      'http',
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    definitions: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          username: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          role: {
            type: 'string',
          },
        },
        xml: {
          name: 'User',
        },
      },
      Question: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          username: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          role: {
            type: 'string',
          },
        },
        xml: {
          name: 'Question',
        },
      },
    },
  },
  apis: ['./routes/*.yaml'],
};

router.use(
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(swaggerOptions), { explorer: true }), // search bar in top
);

module.exports = router;
