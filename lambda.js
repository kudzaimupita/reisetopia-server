const serverless = require('serverless-http');
const { app } = require('./src');

const proxy = serverless(app);

exports.handler = proxy;
