const serverless = require('serverless-http');
const { app } = require('./dist/server');

const proxy = serverless(app);

exports.handler = proxy;
