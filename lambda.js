const serverless = require('serverless-http');
const { app } = require('./src/server');

const proxy = serverless(app);

exports.handler = proxy;
