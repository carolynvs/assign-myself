const { serverless } = require('probot-serverless-azurefunctions')
const appFn = require('../index')
module.exports.probot = serverless(appFn)